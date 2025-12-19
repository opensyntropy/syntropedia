import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/api'
import { isReviewer } from '@/lib/auth/server'
import { createSubmission, getSubmissions } from '@/lib/services/submission'
import { speciesFormSchema } from '@/lib/validations/species'
import { SpeciesStatus } from '@prisma/client'

// GET /api/species/submissions - List submissions
export const GET = withAuth(async (req, { session }) => {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const status = searchParams.get('status') as SpeciesStatus | null
  const search = searchParams.get('search') || undefined

  const result = await getSubmissions({
    userId: session.user.id,
    isReviewer: isReviewer(session),
    status: status || undefined,
    page,
    limit,
    search,
  })

  return NextResponse.json(result)
})

// POST /api/species/submissions - Create new submission
export const POST = withAuth(async (req, { session }) => {
  try {
    const body = await req.json()

    // Validate input
    const parsed = speciesFormSchema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 }
      )
    }

    const species = await createSubmission({
      data: parsed.data,
      userId: session.user.id,
    })

    return NextResponse.json(species, { status: 201 })
  } catch (error) {
    console.error('Failed to create submission:', error)
    const message = error instanceof Error ? error.message : 'Failed to create submission'

    // Check for foreign key constraint error (invalid user)
    if (message.includes('Foreign key constraint') || (error as any)?.code === 'P2003') {
      return NextResponse.json(
        { error: 'Session expired or invalid. Please log out and log in again.' },
        { status: 401 }
      )
    }

    return NextResponse.json(
      { error: message },
      { status: 500 }
    )
  }
})
