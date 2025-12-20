'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useTranslations } from '@/lib/IntlProvider'
import { ApplicationsList } from './ApplicationsList'
import { ReviewersList } from './ReviewersList'
import { ClipboardList } from 'lucide-react'

interface Application {
  id: string
  userId: string
  motivation: string
  fullAddress: string
  city: string
  state: string
  country: string
  education: string
  yearsExperience: number
  experienceDetails: string
  socialLinkedin: string | null
  socialInstagram: string | null
  socialTwitter: string | null
  socialWebsite: string | null
  status: 'PENDING' | 'APPROVED' | 'REJECTED'
  reviewNote: string | null
  createdAt: Date
  user: {
    id: string
    name: string | null
    email: string
    avatar: string | null
  }
  reviewedBy: {
    id: string
    name: string | null
  } | null
}

interface Reviewer {
  id: string
  name: string | null
  email: string
  avatar: string | null
  createdAt: Date
}

interface AdminApplicationsClientProps {
  locale: string
  initialTab: string
  applications: Application[]
  reviewers: Reviewer[]
  status?: string
}

export function AdminApplicationsClient({
  locale,
  initialTab,
  applications,
  reviewers,
  status,
}: AdminApplicationsClientProps) {
  const router = useRouter()
  const t = useTranslations('admin')
  const [activeTab, setActiveTab] = useState(initialTab)

  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    router.push(`/admin/applications?tab=${tab}`)
  }

  return (
    <div className="space-y-6">
      {/* Quick Link to Species Review Queue */}
      <Link href="/reviews">
        <div className="flex items-center gap-3 p-4 bg-primary-50 border border-primary-200 rounded-lg hover:bg-primary-100 transition-colors">
          <ClipboardList className="h-5 w-5 text-primary-600" />
          <div>
            <p className="font-medium text-primary-700">{t('speciesReviewQueue')}</p>
            <p className="text-sm text-primary-600">{t('speciesReviewQueueHint')}</p>
          </div>
        </div>
      </Link>

      {/* Tab Navigation */}
      <div className="flex gap-2 border-b pb-2">
        <Button
          variant={activeTab === 'applications' ? 'default' : 'ghost'}
          onClick={() => handleTabChange('applications')}
        >
          {t('tabApplications')} ({applications.length})
        </Button>
        <Button
          variant={activeTab === 'reviewers' ? 'default' : 'ghost'}
          onClick={() => handleTabChange('reviewers')}
        >
          {t('tabReviewers')} ({reviewers.length})
        </Button>
      </div>

      {/* Tab Content */}
      {activeTab === 'applications' && (
        <div className="space-y-4">
          {/* Status Filter */}
          <div className="flex gap-2">
            <Link href="/admin/applications?tab=applications">
              <Button variant={!status ? 'default' : 'outline'} size="sm">
                {t('all')}
              </Button>
            </Link>
            <Link href="/admin/applications?tab=applications&status=PENDING">
              <Button variant={status === 'PENDING' ? 'default' : 'outline'} size="sm">
                {t('pending')}
              </Button>
            </Link>
            <Link href="/admin/applications?tab=applications&status=APPROVED">
              <Button variant={status === 'APPROVED' ? 'default' : 'outline'} size="sm">
                {t('approved')}
              </Button>
            </Link>
            <Link href="/admin/applications?tab=applications&status=REJECTED">
              <Button variant={status === 'REJECTED' ? 'default' : 'outline'} size="sm">
                {t('rejected')}
              </Button>
            </Link>
          </div>

          <ApplicationsList applications={applications} locale={locale} />
        </div>
      )}

      {activeTab === 'reviewers' && (
        <ReviewersList reviewers={reviewers} locale={locale} />
      )}
    </div>
  )
}
