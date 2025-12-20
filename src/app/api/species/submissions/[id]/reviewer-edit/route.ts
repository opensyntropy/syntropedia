import { NextResponse } from 'next/server'
import { withReviewer } from '@/lib/auth/api'
import { getSubmissionById, reviewerEditSubmission } from '@/lib/services/submission'
import { canReview } from '@/lib/auth/server'
import { speciesFormSchema } from '@/lib/validations/species'

// PUT /api/species/submissions/[id]/reviewer-edit - Edit submission as reviewer
export const PUT = withReviewer(async (req, { params, session }) => {
  const submission = await getSubmissionById(params.id)

  if (!submission) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
  }

  // Check if user can review this submission
  if (!canReview(session, submission)) {
    return NextResponse.json({ error: 'Cannot edit this submission' }, { status: 403 })
  }

  const body = await req.json()
  const { changeReason, ...formData } = body

  // Validate changeReason is required for reviewer edits
  if (!changeReason || typeof changeReason !== 'string' || changeReason.trim().length === 0) {
    return NextResponse.json(
      { error: 'Change reason is required for reviewer edits' },
      { status: 400 }
    )
  }

  // Partial validation for updates
  const parsed = speciesFormSchema.partial().safeParse(formData)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  try {
    const updated = await reviewerEditSubmission({
      id: params.id,
      data: parsed.data,
      reviewerId: session.user.id,
      changeReason: changeReason.trim(),
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error updating submission:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update' },
      { status: 500 }
    )
  }
})
