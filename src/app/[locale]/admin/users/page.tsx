import { redirect } from 'next/navigation'
import { getSession, isAdmin } from '@/lib/auth/server'
import { getTranslations } from '@/lib/getTranslations'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { UsersList } from '@/components/admin/UsersList'
import prisma from '@/lib/prisma'
import { UserRole, UserStatus } from '@prisma/client'
import Link from 'next/link'

interface AdminUsersPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{
    search?: string
    role?: string
    status?: string
    sort?: string
    page?: string
  }>
}

async function getUsers(params: {
  search?: string
  role?: UserRole
  status?: UserStatus
  sort?: string
  page?: number
  limit?: number
}) {
  const { search, role, status, sort = 'newest', page = 1, limit = 20 } = params
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

  return {
    users: users.map((u) => ({ ...u, createdAt: u.createdAt.toISOString() })),
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export default async function AdminUsersPage({ params, searchParams }: AdminUsersPageProps) {
  const session = await getSession()

  if (!session?.user || !isAdmin(session)) {
    redirect('/auth/signin?callbackUrl=/admin/users')
  }

  const { locale } = await params
  const sp = await searchParams
  const t = await getTranslations(locale, 'adminUsers')
  const tFooter = await getTranslations(locale, 'footer')

  const { users, total, page, totalPages } = await getUsers({
    search: sp.search,
    role: sp.role as UserRole | undefined,
    status: sp.status as UserStatus | undefined,
    sort: sp.sort,
    page: sp.page ? parseInt(sp.page) : 1,
  })

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="container mx-auto flex-1 px-4 py-8">
        {/* Breadcrumb */}
        <div className="mb-4 text-sm text-muted-foreground">
          <Link href="/admin/applications" className="hover:underline">
            Admin
          </Link>
          {' / '}
          <span>{t('title')}</span>
        </div>

        <div className="mb-6">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="mt-1 text-muted-foreground">{t('description')}</p>
        </div>

        <UsersList
          users={users}
          total={total}
          page={page}
          totalPages={totalPages}
          locale={locale}
        />
      </main>

      <Footer
        labels={{
          description: tFooter('description'),
          project: tFooter('project'),
          about: tFooter('about'),
          catalog: tFooter('catalog'),
          contribute: tFooter('contribute'),
          community: tFooter('community'),
          forum: tFooter('forum'),
          github: tFooter('github'),
          discussions: tFooter('discussions'),
          legal: tFooter('legal'),
          mitLicense: tFooter('mitLicense'),
          ccLicense: tFooter('ccLicense'),
          privacy: tFooter('privacy'),
          copyright: tFooter('copyright'),
        }}
      />
    </div>
  )
}
