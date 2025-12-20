import { NextRequest, NextResponse } from 'next/server'
import { withAuth, type AuthenticatedContext } from '@/lib/auth/api'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { PHOTO_FRAGMENT_TAGS } from '@/lib/validations/species'
import { logActivity } from '@/lib/services/activity'
import { ActivityAction } from '@prisma/client'

const photoSchema = z.object({
  url: z.string().url(),
  key: z.string().min(1),
  caption: z.string().optional(),
  primary: z.boolean().optional().default(false),
  tags: z.array(z.enum(PHOTO_FRAGMENT_TAGS)).optional().default([]),
})

const photosSchema = z.array(photoSchema)

// GET /api/species/submissions/[id]/photos - Get photos for a species
export const GET = withAuth(async (req: NextRequest, { params, session }: AuthenticatedContext) => {
  const id = params.id

  const photos = await prisma.photo.findMany({
    where: { speciesId: id },
    orderBy: [
      { primary: 'desc' },
      { uploadedAt: 'asc' },
    ],
  })

  return NextResponse.json(photos)
})

// POST /api/species/submissions/[id]/photos - Add photos to a species
export const POST = withAuth(async (req: NextRequest, { params, session }: AuthenticatedContext) => {
  const id = params.id
  const userId = session.user.id

  // Verify species exists and user can edit it
  const species = await prisma.species.findUnique({
    where: { id },
    select: { id: true, createdById: true, status: true },
  })

  if (!species) {
    return NextResponse.json({ error: 'Species not found' }, { status: 404 })
  }

  // Check permissions - only creator can add photos to draft, or reviewers/admins
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })

  const isReviewer = user?.role === 'REVIEWER' || user?.role === 'ADMIN'
  const isOwner = species.createdById === userId

  if (!isOwner && !isReviewer) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  const body = await req.json()
  const parsed = photosSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const photosData = parsed.data

  // If any photo is marked as primary, unset existing primary photos
  const hasPrimary = photosData.some(p => p.primary)
  if (hasPrimary) {
    await prisma.photo.updateMany({
      where: { speciesId: id, primary: true },
      data: { primary: false },
    })
  }

  // Create photos
  const createdPhotos = await Promise.all(
    photosData.map(photo =>
      prisma.photo.create({
        data: {
          url: photo.url,
          caption: photo.caption,
          primary: photo.primary,
          tags: photo.tags,
          speciesId: id,
          uploadById: userId,
          approved: false, // Photos need approval
        },
      })
    )
  )

  return NextResponse.json(createdPhotos, { status: 201 })
})

// PUT /api/species/submissions/[id]/photos - Update all photos for a species
export const PUT = withAuth(async (req: NextRequest, { params, session }: AuthenticatedContext) => {
  const id = params.id
  const userId = session.user.id

  // Verify species exists and user can edit it
  const species = await prisma.species.findUnique({
    where: { id },
    select: { id: true, createdById: true, status: true },
  })

  if (!species) {
    return NextResponse.json({ error: 'Species not found' }, { status: 404 })
  }

  // Check permissions
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })

  const isReviewer = user?.role === 'REVIEWER' || user?.role === 'ADMIN'
  const isOwner = species.createdById === userId

  if (!isOwner && !isReviewer) {
    return NextResponse.json({ error: 'Not authorized' }, { status: 403 })
  }

  const body = await req.json()
  console.log('Photos PUT body:', JSON.stringify(body, null, 2))
  const parsed = photosSchema.safeParse(body)

  if (!parsed.success) {
    console.error('Photos validation failed:', parsed.error.flatten())
    const flatErrors = parsed.error.flatten()
    // Build a user-friendly error message
    const errorMessages: string[] = []
    if (flatErrors.formErrors.length > 0) {
      errorMessages.push(...flatErrors.formErrors)
    }
    Object.entries(flatErrors.fieldErrors).forEach(([key, errors]) => {
      const photoIndex = parseInt(key)
      if (!isNaN(photoIndex) && errors) {
        errorMessages.push(`Photo ${photoIndex + 1}: ${errors.join(', ')}`)
      }
    })
    return NextResponse.json(
      { error: errorMessages.join('; ') || 'Validation failed', details: flatErrors },
      { status: 400 }
    )
  }

  const photosData = parsed.data

  // Get existing photos
  const existingPhotos = await prisma.photo.findMany({
    where: { speciesId: id },
  })

  // Find photos to delete (those not in the new list)
  const newUrls = new Set(photosData.map(p => p.url))
  const photosToDelete = existingPhotos.filter(p => !newUrls.has(p.url))

  // Track changes for history
  const changes: Array<{
    field: string
    previousValue: unknown
    newValue: unknown
  }> = []

  // Track deleted photos
  if (photosToDelete.length > 0) {
    changes.push({
      field: 'photos_removed',
      previousValue: photosToDelete.map(p => ({ url: p.url, caption: p.caption })),
      newValue: null,
    })

    await prisma.photo.deleteMany({
      where: { id: { in: photosToDelete.map(p => p.id) } },
    })
  }

  // Track added photos
  const existingUrls = new Set(existingPhotos.map(p => p.url))
  const addedPhotos = photosData.filter(p => !existingUrls.has(p.url))
  if (addedPhotos.length > 0) {
    changes.push({
      field: 'photos_added',
      previousValue: null,
      newValue: addedPhotos.map(p => ({ url: p.url, caption: p.caption, tags: p.tags })),
    })
  }

  // Update or create photos
  const result = await Promise.all(
    photosData.map(async (photo, index) => {
      const existing = existingPhotos.find(p => p.url === photo.url)

      if (existing) {
        // Track changes to existing photos
        const photoChanges: string[] = []
        if (existing.primary !== photo.primary) photoChanges.push('primary')
        if (existing.caption !== (photo.caption || null)) photoChanges.push('caption')
        if (JSON.stringify(existing.tags) !== JSON.stringify(photo.tags)) photoChanges.push('tags')

        if (photoChanges.length > 0) {
          changes.push({
            field: `photo_updated`,
            previousValue: { url: existing.url, caption: existing.caption, primary: existing.primary, tags: existing.tags },
            newValue: { url: photo.url, caption: photo.caption, primary: photo.primary, tags: photo.tags },
          })
        }

        return prisma.photo.update({
          where: { id: existing.id },
          data: {
            caption: photo.caption,
            primary: photo.primary,
            tags: photo.tags,
          },
        })
      } else {
        return prisma.photo.create({
          data: {
            url: photo.url,
            caption: photo.caption,
            primary: photo.primary,
            tags: photo.tags,
            speciesId: id,
            uploadById: userId,
            approved: false,
          },
        })
      }
    })
  )

  // Log changes to ChangeHistory if any
  if (changes.length > 0) {
    await prisma.changeHistory.createMany({
      data: changes.map(change => ({
        speciesId: id,
        changedById: userId,
        changedFields: change.field,
        previousValue: { value: change.previousValue ?? null },
        newValue: { value: change.newValue ?? null },
        changeReason: 'Photo update',
      })),
    })

    await logActivity({
      action: ActivityAction.SPECIES_UPDATED,
      userId,
      speciesId: id,
      details: {
        updatedFields: changes.map(c => c.field),
        photoUpdate: true,
      },
    })
  }

  return NextResponse.json(result)
})
