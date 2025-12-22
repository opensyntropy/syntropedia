import { NextRequest, NextResponse } from 'next/server'
import { withReviewer, type AuthenticatedContext } from '@/lib/auth/api'
import { prisma } from '@/lib/prisma'

// POST /api/reviews/photos/[id]/reject - Reject and delete a pending photo
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
    return NextResponse.json({ error: 'Cannot reject an approved photo' }, { status: 400 })
  }

  // Get optional rejection reason
  const body = await req.json().catch(() => ({}))
  const reason = body.reason || ''

  // Mark the photo as rejected (instead of deleting, so user can see the rejection)
  await prisma.photo.update({
    where: { id },
    data: {
      rejected: true,
      rejectionReason: reason || null,
      rejectedAt: new Date(),
    },
  })

  // Log the rejection with reason for audit purposes
  console.log(`Photo ${id} rejected by ${session.user.email}${reason ? `: ${reason}` : ''}`)

  return NextResponse.json({ success: true, reason })
})
