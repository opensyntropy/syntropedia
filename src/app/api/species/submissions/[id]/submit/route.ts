import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/api'
import { canSubmitForReview } from '@/lib/auth/server'
import { getSubmissionById, submitForReview } from '@/lib/services/submission'

// POST /api/species/submissions/[id]/submit - Submit for review
export const POST = withAuth(async (req, { params, session }) => {
  const submission = await getSubmissionById(params.id)

  if (!submission) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
  }

  if (!canSubmitForReview(session, submission)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const updated = await submitForReview(params.id, session.user.id)

  return NextResponse.json(updated)
})
