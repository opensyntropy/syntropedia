import { NextRequest, NextResponse } from 'next/server'
import { withAdmin, AuthenticatedContext } from '@/lib/auth/api'
import prisma from '@/lib/prisma'
import { UserRole } from '@prisma/client'

// PUT - Change user role
export const PUT = withAdmin(async (
  req: NextRequest,
  { params, session }: AuthenticatedContext
) => {
  const id = params.id
  const body = await req.json()
  const newRole = body.role as UserRole

  // Validate role
  if (!newRole || !Object.values(UserRole).includes(newRole)) {
    return NextResponse.json({ error: 'Invalid role' }, { status: 400 })
  }

  // Check if user exists
  const user = await prisma.user.findUnique({
    where: { id },
    select: { id: true, name: true, email: true, role: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  // Don't allow changing own role
  if (id === session.user.id) {
    return NextResponse.json({ error: 'Cannot change your own role' }, { status: 400 })
  }

  // Don't allow demoting other admins
  if (user.role === 'ADMIN' && newRole !== 'ADMIN') {
    return NextResponse.json({ error: 'Cannot demote admin users' }, { status: 400 })
  }

  // Update the role
  await prisma.user.update({
    where: { id },
    data: { role: newRole },
  })

  return NextResponse.json({ success: true })
})
