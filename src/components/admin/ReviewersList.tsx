'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/lib/IntlProvider'
import { User, Shield, Trash2 } from 'lucide-react'

interface Reviewer {
  id: string
  name: string | null
  email: string
  avatar: string | null
  createdAt: Date
}

interface ReviewersListProps {
  reviewers: Reviewer[]
  locale: string
}

export function ReviewersList({ reviewers, locale }: ReviewersListProps) {
  const router = useRouter()
  const t = useTranslations('admin')
  const [revokingId, setRevokingId] = useState<string | null>(null)

  const handleRevoke = async (id: string, name: string | null) => {
    const confirmed = window.confirm(
      t('revokeConfirm').replace('{name}', name || 'this user')
    )
    if (!confirmed) return

    setRevokingId(id)
    try {
      const response = await fetch(`/api/admin/reviewers/${id}/revoke`, {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to revoke reviewer status')
      }

      router.refresh()
    } catch (error) {
      console.error('Error revoking reviewer:', error)
    } finally {
      setRevokingId(null)
    }
  }

  if (reviewers.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">{t('noReviewers')}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {reviewers.map((reviewer) => (
        <Card key={reviewer.id}>
          <CardContent className="py-4">
            <div className="flex items-center gap-4">
              {/* User Avatar */}
              <div className="flex-shrink-0">
                {reviewer.avatar ? (
                  <img
                    src={reviewer.avatar}
                    alt={reviewer.name || ''}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="h-6 w-6 text-gray-400" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold">
                    {reviewer.name || reviewer.email}
                  </h3>
                  <Shield className="h-4 w-4 text-primary-600" />
                </div>
                <p className="text-sm text-muted-foreground">{reviewer.email}</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {t('memberSince')}: {new Date(reviewer.createdAt).toLocaleDateString(locale)}
                </p>
              </div>

              {/* Actions */}
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleRevoke(reviewer.id, reviewer.name)}
                disabled={revokingId === reviewer.id}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                {t('revoke')}
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
