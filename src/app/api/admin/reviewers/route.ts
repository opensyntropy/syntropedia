import { NextResponse } from 'next/server'
import { withAdmin } from '@/lib/auth/api'
import { getReviewers } from '@/lib/services/reviewer-application'

// GET - Get list of all reviewers
export const GET = withAdmin(async () => {
  const reviewers = await getReviewers()
  return NextResponse.json({ reviewers })
})
