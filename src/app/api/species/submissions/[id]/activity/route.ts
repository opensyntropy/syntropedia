import { NextRequest, NextResponse } from 'next/server'
import { withReviewer } from '@/lib/auth/api'
import { getSpeciesActivity } from '@/lib/services/activity'

// GET /api/species/submissions/[id]/activity - Get activity log for species
export const GET = withReviewer(async (req, { params }) => {
  const activities = await getSpeciesActivity(params.id)
  return NextResponse.json({ activities })
})
