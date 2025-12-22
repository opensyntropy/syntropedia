import { NextRequest, NextResponse } from 'next/server'
import { withAdmin, AuthenticatedContext } from '@/lib/auth/api'
import prisma from '@/lib/prisma'
import { UserStatus } from '@prisma/client'

// POST - Block a user
export const POST = withAdmin(async (
  req: NextRequest,
  { params, session }: AuthenticatedContext
) => {
  const id = params.id
  const body = await req.json().catch(() => ({}))
  const reason = body.reason || ''

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, status: true, role: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Don't allow blocking admins
  if (user.role === 'ADMIN') {
    return NextResponse.json({ error: 'Cannot block admin users' }, { status: 400 })
  }

  // Check if already blocked
  if (user.status === UserStatus.BLOCKED) {
    return NextResponse.json({ error: 'User is already blocked' }, { status: 400 })
  }

  // Block the user
  await prisma.user.update({
    where: { id },
    data: { status: UserStatus.BLOCKED },
  })

  return NextResponse.json({ success: true })
})
