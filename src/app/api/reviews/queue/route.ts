import { NextResponse } from 'next/server'
import { withReviewer } from '@/lib/auth/api'
import { getReviewQueue } from '@/lib/services/submission'

// GET /api/reviews/queue - Get review queue for current reviewer
export const GET = withReviewer(async (req, { session }) => {
  const queue = await getReviewQueue(session.user.id)
  return NextResponse.json(queue)
})
