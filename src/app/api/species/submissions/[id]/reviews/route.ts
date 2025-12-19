import { NextRequest, NextResponse } from 'next/server'
import { withAuth, withReviewer } from '@/lib/auth/api'
import { canReview } from '@/lib/auth/server'
import { getSubmissionById } from '@/lib/services/submission'
import { submitReview, getReviewStatus, hasUserReviewed } from '@/lib/services/review'
import { sendReviewNotification } from '@/lib/services/email'
import { reviewFormSchema } from '@/lib/validations/species'

// GET /api/species/submissions/[id]/reviews - Get reviews
export const GET = withReviewer(async (req, { params }) => {
  const reviewStatus = await getReviewStatus(params.id)
  return NextResponse.json(reviewStatus)
})

// POST /api/species/submissions/[id]/reviews - Submit review
export const POST = withAuth(async (req, { params, session }) => {
  const submission = await getSubmissionById(params.id)

  if (!submission) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
  }

  if (!canReview(session, submission)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  // Check if user already reviewed
  const alreadyReviewed = await hasUserReviewed(params.id, session.user.id)
  if (alreadyReviewed) {
    return NextResponse.json({ error: 'You have already reviewed this submission' }, { status: 400 })
  }

  const body = await req.json()

  // Validate input
  const parsed = reviewFormSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const review = await submitReview({
    speciesId: params.id,
    reviewerId: session.user.id,
    decision: parsed.data.decision,
    comments: parsed.data.comments,
  })

  // Send notification to creator
  await sendReviewNotification({
    speciesName: submission.scientificName,
    speciesId: submission.id,
    decision: parsed.data.decision,
    reviewerName: session.user.name || 'A reviewer',
    creatorEmail: submission.createdBy.email,
    comments: parsed.data.comments,
  })

  return NextResponse.json(review, { status: 201 })
})
