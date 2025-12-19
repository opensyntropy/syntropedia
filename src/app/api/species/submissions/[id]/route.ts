import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/api'
import { canViewSubmission, canEditSubmission, canDeleteSubmission } from '@/lib/auth/server'
import { getSubmissionById, updateSubmission, deleteSubmission } from '@/lib/services/submission'
import { speciesFormSchema } from '@/lib/validations/species'

// GET /api/species/submissions/[id] - Get submission details
export const GET = withAuth(async (req, { params, session }) => {
  const submission = await getSubmissionById(params.id)

  if (!submission) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
  }

  if (!canViewSubmission(session, submission)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  return NextResponse.json(submission)
})

// PUT /api/species/submissions/[id] - Update submission
export const PUT = withAuth(async (req, { params, session }) => {
  const submission = await getSubmissionById(params.id)

  if (!submission) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
  }

  if (!canEditSubmission(session, submission)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const body = await req.json()

  // Partial validation for updates
  const parsed = speciesFormSchema.partial().safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const updated = await updateSubmission({
    id: params.id,
    data: parsed.data,
    userId: session.user.id,
  })

  return NextResponse.json(updated)
})

// DELETE /api/species/submissions/[id] - Delete submission
export const DELETE = withAuth(async (req, { params, session }) => {
  const submission = await getSubmissionById(params.id)

  if (!submission) {
    return NextResponse.json({ error: 'Submission not found' }, { status: 404 })
  }

  if (!canDeleteSubmission(session, submission)) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  await deleteSubmission(params.id)

  return NextResponse.json({ success: true })
})
