import { NextRequest, NextResponse } from 'next/server'
import { withAdmin, AuthenticatedContext } from '@/lib/auth/api'
import prisma from '@/lib/prisma'
import { UserStatus } from '@prisma/client'

// POST - Unblock a user
export const POST = withAdmin(async (
  req: NextRequest,
  { params }: AuthenticatedContext
) => {
  const id = params.id

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, status: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Check if already active
  if (user.status === UserStatus.ACTIVE) {
    return NextResponse.json({ error: 'User is already active' }, { status: 400 })
  }

  // Unblock the user
  await prisma.user.update({
    where: { id },
    data: { status: UserStatus.ACTIVE },
  })

  return NextResponse.json({ success: true })
})
