import { NextRequest, NextResponse } from 'next/server'
import { getSession } from './server'
import { UserRole } from '@prisma/client'
import type { Session } from 'next-auth'

export interface AuthenticatedContext {
  params: Record<string, string>
  session: Session
}

type AuthenticatedHandler = (
  req: NextRequest,
  context: AuthenticatedContext
) => Promise<NextResponse>

export function withAuth(handler: AuthenticatedHandler) {
  return async (req: NextRequest, context: { params: Promise<Record<string, string>> }) => {
    try {
      const session = await getSession()
      if (!session?.user) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }

      const params = await context.params
      return handler(req, { params, session })
    } catch (error) {
      console.error('API Error:', error)
      if (error instanceof Error) {
        if (error.message === 'UNAUTHORIZED') {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }
        if (error.message === 'FORBIDDEN') {
          return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
        }
        if (error.message === 'NOT_FOUND') {
          return NextResponse.json({ error: 'Not found' }, { status: 404 })
        }
      }
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
    }
  }
}

export function withRole(roles: UserRole[], handler: AuthenticatedHandler) {
  return withAuth(async (req, context) => {
    const userRole = context.session.user.role as UserRole
    if (!roles.includes(userRole)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
    }
    return handler(req, context)
  })
}

export function withReviewer(handler: AuthenticatedHandler) {
  return withRole([UserRole.REVIEWER, UserRole.ADMIN], handler)
}

export function withAdmin(handler: AuthenticatedHandler) {
  return withRole([UserRole.ADMIN], handler)
}
