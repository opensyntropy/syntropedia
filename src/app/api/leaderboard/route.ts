import { NextRequest, NextResponse } from 'next/server'
import { getLeaderboard, LeaderboardType, LeaderboardPeriod } from '@/lib/services/gamification'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const type = (searchParams.get('type') || 'xp') as LeaderboardType
    const period = (searchParams.get('period') || 'all_time') as LeaderboardPeriod
    const limit = parseInt(searchParams.get('limit') || '10', 10)

    // Validate inputs
    if (!['contributors', 'reviewers', 'xp'].includes(type)) {
      return NextResponse.json({ error: 'Invalid type' }, { status: 400 })
    }

    if (!['all_time', 'month'].includes(period)) {
      return NextResponse.json({ error: 'Invalid period' }, { status: 400 })
    }

    const entries = await getLeaderboard(type, period, Math.min(limit, 100))

    return NextResponse.json({ entries })
  } catch (error) {
    console.error('Error fetching leaderboard:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
