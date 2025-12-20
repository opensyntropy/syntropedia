import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/api'
import { getUserApplication } from '@/lib/services/reviewer-application'

// GET - Get current user's application
export const GET = withAuth(async (req, { session }) => {
  const application = await getUserApplication(session.user.id)
  return NextResponse.json({ application })
})
