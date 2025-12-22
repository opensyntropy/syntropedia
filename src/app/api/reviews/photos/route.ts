import { NextRequest, NextResponse } from 'next/server'
import { withReviewer, type AuthenticatedContext } from '@/lib/auth/api'
import { prisma } from '@/lib/prisma'

// GET /api/reviews/photos - List pending photos for review
export const GET = withReviewer(async (req: NextRequest, { session }: AuthenticatedContext) => {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') || 'pending'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const offset = (page - 1) * limit

  // Build filter based on status
  let where: { approved?: boolean; rejected?: boolean } = {}
  if (status === 'approved') {
    where = { approved: true }
  } else if (status === 'rejected') {
    where = { rejected: true }
  } else {
    // pending: not approved and not rejected
    where = { approved: false, rejected: false }
  }

  const [photos, total] = await Promise.all([
    prisma.photo.findMany({
      where,
      include: {
        species: {
          select: {
            id: true,
            slug: true,
            scientificName: true,
            commonNames: true,
          },
        },
        uploadBy: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
      },
      orderBy: { uploadedAt: 'desc' },
      take: limit,
      skip: offset,
    }),
    prisma.photo.count({ where }),
  ])

  return NextResponse.json({
    photos,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
})
