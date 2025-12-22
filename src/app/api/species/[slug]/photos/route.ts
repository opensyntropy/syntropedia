import { NextRequest, NextResponse } from 'next/server'
import { withAuth, type AuthenticatedContext } from '@/lib/auth/api'
import { prisma } from '@/lib/prisma'
import { z } from 'zod'
import { PHOTO_FRAGMENT_TAGS } from '@/lib/validations/species'
import { awardXP, checkBadges } from '@/lib/services/gamification'

const photoSchema = z.object({
  url: z.string().url(),
  key: z.string().min(1),
  tags: z.array(z.enum(PHOTO_FRAGMENT_TAGS)).min(1, 'At least one tag is required'),
})

const submitPhotosSchema = z.object({
  photos: z.array(photoSchema).min(1).max(3, 'Maximum 3 photos per submission'),
})

// POST /api/species/[slug]/photos - Submit photos to a published species
export const POST = withAuth(async (req: NextRequest, { params, session }: AuthenticatedContext) => {
  const slug = params.slug
  const userId = session.user.id

  // Find the species by slug
  const species = await prisma.species.findFirst({
    where: { slug },
    select: { id: true, status: true, scientificName: true },
  })

  if (!species) {
    return NextResponse.json({ error: 'Species not found' }, { status: 404 })
  }

  // Only allow photo submissions to published species
  if (species.status !== 'PUBLISHED') {
    return NextResponse.json(
      { error: 'Can only submit photos to published species' },
      { status: 400 }
    )
  }

  const body = await req.json()
  const parsed = submitPhotosSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { photos } = parsed.data

  // Create photos with approved: false (pending review)
  const createdPhotos = await Promise.all(
    photos.map(photo =>
      prisma.photo.create({
        data: {
          url: photo.url,
          tags: photo.tags,
          speciesId: species.id,
          uploadById: userId,
          approved: false, // Requires reviewer approval
        },
      })
    )
  )

  // Award XP for each photo uploaded
  for (const _ of createdPhotos) {
    await awardXP(userId, 'PHOTO_UPLOADED')
  }
  await checkBadges(userId)

  return NextResponse.json(
    {
      success: true,
      photosAdded: createdPhotos.length,
      message: 'Photos submitted for review'
    },
    { status: 201 }
  )
})
