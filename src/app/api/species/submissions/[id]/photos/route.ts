import { NextRequest, NextResponse } from 'next/server'
import { withAuth, AuthenticatedRequest } from '@/lib/auth/api'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { PHOTO_FRAGMENT_TAGS } from '@/lib/validations/species'

const photoSchema = z.object({
  url: z.string().url(),
  key: z.string().min(1),
  caption: z.string().optional(),
  primary: z.boolean().optional().default(false),
  tags: z.array(z.enum(PHOTO_FRAGMENT_TAGS)).optional().default([]),
})

const photosSchema = z.array(photoSchema)

// GET /api/species/submissions/[id]/photos - Get photos for a species
export const GET = withAuth(async (req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params

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
export const POST = withAuth(async (req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const userId = req.user.id

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
export const PUT = withAuth(async (req: AuthenticatedRequest, { params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params
  const userId = req.user.id

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
  const parsed = photosSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
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

  // Delete removed photos
  if (photosToDelete.length > 0) {
    await prisma.photo.deleteMany({
      where: { id: { in: photosToDelete.map(p => p.id) } },
    })
  }

  // Update or create photos
  const result = await Promise.all(
    photosData.map(async (photo, index) => {
      const existing = existingPhotos.find(p => p.url === photo.url)

      if (existing) {
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

  return NextResponse.json(result)
})
