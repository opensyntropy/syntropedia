import { NextRequest, NextResponse } from 'next/server'
import { withReviewer } from '@/lib/auth/api'
import { getGlobalActivity } from '@/lib/services/activity'
import { ActivityAction } from '@prisma/client'

// GET /api/activity - Get global activity log
export const GET = withReviewer(async (req) => {
  const { searchParams } = new URL(req.url)
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')
  const action = searchParams.get('action') as ActivityAction | null
  const userId = searchParams.get('userId') || undefined

  const result = await getGlobalActivity({
    page,
    limit,
    action: action || undefined,
    userId,
  })

  return NextResponse.json(result)
})
