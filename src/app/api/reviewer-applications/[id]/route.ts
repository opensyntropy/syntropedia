import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/auth/api'
import { reviewApplication } from '@/lib/services/reviewer-application'
import { z } from 'zod'

const reviewSchema = z.object({
  decision: z.enum(['APPROVED', 'REJECTED']),
  note: z.string().optional(),
})

// PUT - Admin approves or rejects application
export const PUT = withAdmin(async (req, { params, session }) => {
  try {
    const body = await req.json()
    const { decision, note } = reviewSchema.parse(body)

    const application = await reviewApplication({
      applicationId: params.id,
      adminId: session.user.id,
      decision,
      note,
    })

    return NextResponse.json(application)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data' }, { status: 400 })
    }
    if (error instanceof Error) {
      if (error.message === 'Application not found') {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }
      if (error.message === 'Application has already been reviewed') {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }
    throw error
  }
})
