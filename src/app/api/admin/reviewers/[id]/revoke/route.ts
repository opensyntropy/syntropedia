import { NextResponse } from 'next/server'
import { withAdmin } from '@/lib/auth/api'
import { revokeReviewer } from '@/lib/services/reviewer-application'

// POST - Revoke reviewer status
export const POST = withAdmin(async (req, { params, session }) => {
  try {
    const result = await revokeReviewer({
      userId: params.id,
      adminId: session.user.id,
    })

    return NextResponse.json(result)
  } catch (error) {
    if (error instanceof Error) {
      if (error.message === 'User not found') {
        return NextResponse.json({ error: error.message }, { status: 404 })
      }
      if (error.message === 'User is not a reviewer') {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }
    throw error
  }
})
