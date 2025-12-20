import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/api'
import { getSubmissionById } from '@/lib/services/submission'
import { resubmitRejected } from '@/lib/services/review'

// POST /api/species/submissions/[id]/resubmit - Resubmit a rejected species
export const POST = withAuth(async (req, { params, session }) => {
  const submission = await getSubmissionById(params.id)

  if (!submission) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
  }

  // Only the creator can resubmit
  if (submission.createdById !== session.user.id) {
    return NextResponse.json({ error: 'Only the creator can resubmit' }, { status: 403 })
  }

  // Only REJECTED status can be resubmitted
  if (submission.status !== 'REJECTED') {
    return NextResponse.json(
      { error: 'Only rejected species can be resubmitted' },
      { status: 400 }
    )
  }

  try {
    await resubmitRejected(params.id, session.user.id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error resubmitting species:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to resubmit' },
      { status: 500 }
    )
  }
})
