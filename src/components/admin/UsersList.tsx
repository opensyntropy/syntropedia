'use client'

import { useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/lib/IntlProvider'
import {
  User,
  Shield,
  ShieldCheck,
  Ban,
  CheckCircle,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { UserRole, UserStatus } from '@prisma/client'

interface UserData {
  id: string
  name: string | null
  email: string
  avatar: string | null
  image: string | null
  role: UserRole
  status: UserStatus
  xp: number
  level: number
  title: string | null
  createdAt: string
  _count: {
    speciesCreated: number
    reviewsGiven: number
  }
}

interface UsersListProps {
  users: UserData[]
  total: number
  page: number
  totalPages: number
  locale: string
}

const roleColors: Record<UserRole, string> = {
  ADMIN: 'bg-purple-100 text-purple-700',
  REVIEWER: 'bg-blue-100 text-blue-700',
  USER: 'bg-gray-100 text-gray-700',
}

const roleIcons: Record<UserRole, React.ReactNode> = {
  ADMIN: <ShieldCheck className="h-3 w-3" />,
  REVIEWER: <Shield className="h-3 w-3" />,
  USER: <User className="h-3 w-3" />,
}

export function UsersList({ users, total, page, totalPages, locale }: UsersListProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const t = useTranslations('adminUsers')

  const [search, setSearch] = useState(searchParams.get('search') || '')
  const [loadingAction, setLoadingAction] = useState<string | null>(null)

  const updateFilters = (updates: Record<string, string | null>) => {
    const params = new URLSearchParams(searchParams.toString())
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    // Reset to page 1 when filters change (except for page changes)
    if (!updates.page) {
      params.set('page', '1')
    }
    router.push(`/admin/users?${params.toString()}`)
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters({ search: search || null })
  }

  const handleBlock = async (userId: string, userName: string | null) => {
    const reason = window.prompt(t('blockReasonPrompt'))
    if (reason === null) return

    setLoadingAction(userId)
    try {
      const response = await fetch(`/api/admin/users/${userId}/block`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || 'Failed to block user')
        return
      }

      router.refresh()
    } catch (error) {
      console.error('Error blocking user:', error)
    } finally {
      setLoadingAction(null)
    }
  }

  const handleUnblock = async (userId: string) => {
    if (!window.confirm(t('unblockConfirm'))) return

    setLoadingAction(userId)
    try {
      const response = await fetch(`/api/admin/users/${userId}/unblock`, {
        method: 'POST',
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || 'Failed to unblock user')
        return
      }

      router.refresh()
    } catch (error) {
      console.error('Error unblocking user:', error)
    } finally {
      setLoadingAction(null)
    }
  }

  const handleRoleChange = async (userId: string, newRole: UserRole) => {
    if (!window.confirm(t('roleChangeConfirm').replace('{role}', newRole))) return

    setLoadingAction(userId)
    try {
      const response = await fetch(`/api/admin/users/${userId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      })

      if (!response.ok) {
        const data = await response.json()
        alert(data.error || 'Failed to change role')
        return
      }

      router.refresh()
    } catch (error) {
      console.error('Error changing role:', error)
    } finally {
      setLoadingAction(null)
    }
  }

  const currentRole = searchParams.get('role') || ''
  const currentStatus = searchParams.get('status') || ''
  const currentSort = searchParams.get('sort') || 'newest'

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Search */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:w-64"
            />
          </div>
          <Button type="submit" size="sm">
            {t('search')}
          </Button>
        </form>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <select
            value={currentRole}
            onChange={(e) => updateFilters({ role: e.target.value || null })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
          >
            <option value="">{t('allRoles')}</option>
            <option value="USER">{t('roleUser')}</option>
            <option value="REVIEWER">{t('roleReviewer')}</option>
            <option value="ADMIN">{t('roleAdmin')}</option>
          </select>

          <select
            value={currentStatus}
            onChange={(e) => updateFilters({ status: e.target.value || null })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
          >
            <option value="">{t('allStatus')}</option>
            <option value="ACTIVE">{t('statusActive')}</option>
            <option value="BLOCKED">{t('statusBlocked')}</option>
          </select>

          <select
            value={currentSort}
            onChange={(e) => updateFilters({ sort: e.target.value })}
            className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none"
          >
            <option value="newest">{t('sortNewest')}</option>
            <option value="oldest">{t('sortOldest')}</option>
            <option value="name">{t('sortName')}</option>
            <option value="xp">{t('sortXP')}</option>
          </select>
        </div>
      </div>

      {/* Results count */}
      <p className="text-sm text-muted-foreground">
        {t('showingResults')
          .replace('{count}', users.length.toString())
          .replace('{total}', total.toString())}
      </p>

      {/* Users List */}
      {users.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">{t('noUsers')}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {users.map((user) => (
            <Card key={user.id} className={user.status === 'BLOCKED' ? 'opacity-60' : ''}>
              <CardContent className="py-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {/* Avatar */}
                  <div className="flex-shrink-0">
                    {user.avatar || user.image ? (
                      <img
                        src={user.avatar || user.image || ''}
                        alt={user.name || ''}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                        <User className="h-6 w-6 text-gray-400" />
                      </div>
                    )}
                  </div>

                  {/* User Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">{user.name || t('anonymous')}</h3>
                      {/* Role Badge */}
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${roleColors[user.role]}`}
                      >
                        {roleIcons[user.role]}
                        {user.role}
                      </span>
                      {/* Status Badge */}
                      {user.status === 'BLOCKED' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700">
                          <Ban className="h-3 w-3" />
                          {t('statusBlocked')}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="mt-1 flex flex-wrap gap-3 text-xs text-muted-foreground">
                      <span>
                        {t('level')} {user.level} • {user.xp} Abundance
                      </span>
                      <span>
                        {user._count.speciesCreated} {t('species')}
                      </span>
                      {user._count.reviewsGiven > 0 && (
                        <span>
                          {user._count.reviewsGiven} {t('reviews')}
                        </span>
                      )}
                      <span>
                        {t('joined')} {new Date(user.createdAt).toLocaleDateString(locale)}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2">
                    {/* Role Change (only for non-admins) */}
                    {user.role !== 'ADMIN' && (
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as UserRole)}
                        disabled={loadingAction === user.id}
                        className="rounded border border-gray-300 px-2 py-1 text-sm"
                      >
                        <option value="USER">User</option>
                        <option value="REVIEWER">Reviewer</option>
                      </select>
                    )}

                    {/* Block/Unblock (only for non-admins) */}
                    {user.role !== 'ADMIN' && (
                      <>
                        {user.status === 'ACTIVE' ? (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleBlock(user.id, user.name)}
                            disabled={loadingAction === user.id}
                            className="text-red-600 hover:bg-red-50 hover:text-red-700"
                          >
                            <Ban className="mr-1 h-4 w-4" />
                            {t('block')}
                          </Button>
                        ) : (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleUnblock(user.id)}
                            disabled={loadingAction === user.id}
                            className="text-green-600 hover:bg-green-50 hover:text-green-700"
                          >
                            <CheckCircle className="mr-1 h-4 w-4" />
                            {t('unblock')}
                          </Button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilters({ page: (page - 1).toString() })}
            disabled={page <= 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            {t('pageOf').replace('{page}', page.toString()).replace('{total}', totalPages.toString())}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateFilters({ page: (page + 1).toString() })}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}
