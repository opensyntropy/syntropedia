import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/api'
import { requestRevision, getSpeciesBySlug } from '@/lib/services/submission'
import { z } from 'zod'

const requestRevisionSchema = z.object({
  reason: z.string().min(10, 'Reason must be at least 10 characters').max(2000),
})

// POST /api/species/[slug]/request-revision - Request revision for a published species
export const POST = withAuth(async (req, { params, session }) => {
  const species = await getSpeciesBySlug(params.slug)

  if (!species) {
    return NextResponse.json({ error: 'Species not found' }, { status: 404 })
  }

  if (species.status !== 'PUBLISHED') {
    return NextResponse.json(
      { error: 'Only published species can have revision requests' },
      { status: 400 }
    )
  }

  const body = await req.json()
  const parsed = requestRevisionSchema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  try {
    const updated = await requestRevision({
      speciesId: species.id,
      userId: session.user.id,
      reason: parsed.data.reason,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error('Error requesting revision:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to request revision' },
      { status: 500 }
    )
  }
})
