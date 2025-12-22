import { NextRequest, NextResponse } from 'next/server'
import { withReviewer, type AuthenticatedContext } from '@/lib/auth/api'
import { prisma } from '@/lib/prisma'

// POST /api/reviews/photos/[id]/approve - Approve a pending photo
export const POST = withReviewer(async (req: NextRequest, { params, session }: AuthenticatedContext) => {
  const id = params.id

  // Find the photo
  const photo = await prisma.photo.findUnique({
    where: { id },
    include: {
      species: { select: { scientificName: true } },
      uploadBy: { select: { name: true, email: true } },
    },
  })

  if (!photo) {
    return NextResponse.json({ error: 'Photo not found' }, { status: 404 })
  }

  if (photo.approved) {
    return NextResponse.json({ error: 'Photo is already approved' }, { status: 400 })
  }

  // Approve the photo
  await prisma.photo.update({
    where: { id },
    data: { approved: true },
  })

  return NextResponse.json({ success: true })
})
