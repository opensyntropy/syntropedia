import { NextRequest, NextResponse } from 'next/server'
import { withAdmin } from '@/lib/auth/api'
import prisma from '@/lib/prisma'
import { UserRole, UserStatus } from '@prisma/client'

// GET - Get paginated list of all users with search/filter
export const GET = withAdmin(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)

  const search = searchParams.get('search') || ''
  const role = searchParams.get('role') as UserRole | null
  const status = searchParams.get('status') as UserStatus | null
  const sort = searchParams.get('sort') || 'newest'
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const skip = (page - 1) * limit

  // Build where clause
  const where: Record<string, unknown> = {}

  if (search) {
    where.OR = [
      { name: { contains: search, mode: 'insensitive' } },
      { email: { contains: search, mode: 'insensitive' } },
    ]
  }

  if (role) {
    where.role = role
  }

  if (status) {
    where.status = status
  }

  // Build orderBy
  let orderBy: Record<string, string> = { createdAt: 'desc' }
  switch (sort) {
    case 'oldest':
      orderBy = { createdAt: 'asc' }
      break
    case 'name':
      orderBy = { name: 'asc' }
      break
    case 'xp':
      orderBy = { xp: 'desc' }
      break
  }

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        avatar: true,
        image: true,
        role: true,
        status: true,
        xp: true,
        level: true,
        title: true,
        createdAt: true,
        _count: {
          select: {
            speciesCreated: true,
            reviewsGiven: true,
          },
        },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ])

  return NextResponse.json({
    users,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  })
})
