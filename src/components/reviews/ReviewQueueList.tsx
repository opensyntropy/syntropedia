'use client'

import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useTranslations } from '@/lib/IntlProvider'
import { User, Clock } from 'lucide-react'
import { ReviewDecision } from '@prisma/client'

interface Submission {
  id: string
  scientificName: string
  commonNames: string[]
  submittedAt: Date | null
  revisionRequestedAt: Date | null
  createdBy: {
    id: string
    name: string | null
    email: string
    avatar: string | null
  }
  revisionRequestedBy: {
    id: string
    name: string | null
  } | null
  primaryPhoto: {
    url: string
  } | null
  reviews: {
    id: string
    decision: ReviewDecision
    reviewer: {
      id: string
      name: string | null
    }
  }[]
}

interface ReviewQueueListProps {
  submissions: Submission[]
  locale: string
}

export function ReviewQueueList({ submissions, locale }: ReviewQueueListProps) {
  const t = useTranslations('reviewQueue')

  if (submissions.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center">
          <div className="text-4xl mb-4">🎉</div>
          <p className="text-lg font-medium text-muted-foreground">{t('noSubmissions')}</p>
          <p className="text-sm text-muted-foreground mt-1">{t('noSubmissionsHint')}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {submissions.map((submission) => {
        const approvalCount = submission.reviews.filter(
          r => r.decision === ReviewDecision.APPROVED
        ).length

        return (
          <Link key={submission.id} href={`/contributions/${submission.id}/review`} className="block">
            <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
              <CardContent className="py-4">
                <div className="flex items-start gap-4">
                  {/* Thumbnail */}
                  <div className="flex-shrink-0">
                    {submission.primaryPhoto ? (
                      <img
                        src={submission.primaryPhoto.url}
                        alt={submission.scientificName}
                        className="w-20 h-20 rounded-lg object-cover bg-gray-100"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-400 text-3xl">🌱</span>
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-semibold text-lg italic truncate">
                        {submission.scientificName}
                      </h3>
                      <Badge
                        variant="outline"
                        className={approvalCount >= 1 ? 'bg-green-50 text-green-700 border-green-200' : ''}
                      >
                        {approvalCount}/2 {t('approvals')}
                      </Badge>
                    </div>

                    <p className="text-sm text-muted-foreground truncate">
                      {submission.commonNames.slice(0, 3).join(', ')}
                      {submission.commonNames.length > 3 && '...'}
                    </p>

                    <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground flex-wrap">
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {submission.revisionRequestedBy
                          ? `${t('requestedBy')}: ${submission.revisionRequestedBy.name || 'User'}`
                          : `${t('submittedBy')}: ${submission.createdBy.name || submission.createdBy.email}`
                        }
                      </span>
                      {submission.revisionRequestedAt ? (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(submission.revisionRequestedAt).toLocaleDateString(locale)}
                        </span>
                      ) : submission.submittedAt && (
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {new Date(submission.submittedAt).toLocaleDateString(locale)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        )
      })}
    </div>
  )
}
