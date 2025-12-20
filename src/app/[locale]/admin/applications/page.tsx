import { redirect } from 'next/navigation'
import { getSession, isAdmin } from '@/lib/auth/server'
import { getTranslations } from '@/lib/getTranslations'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getApplications, getReviewers } from '@/lib/services/reviewer-application'
import { ApplicationStatus } from '@prisma/client'
import { AdminApplicationsClient } from '@/components/admin/AdminApplicationsClient'

interface AdminApplicationsPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ tab?: string; status?: string }>
}

export default async function AdminApplicationsPage({ params, searchParams }: AdminApplicationsPageProps) {
  const session = await getSession()

  if (!session?.user || !isAdmin(session)) {
    redirect('/auth/signin?callbackUrl=/admin/applications')
  }

  const { locale } = await params
  const { tab = 'applications', status } = await searchParams
  const t = await getTranslations(locale, 'admin')

  // Fetch data based on active tab
  const applicationsResult = await getApplications({
    status: status as ApplicationStatus | undefined,
  })
  const reviewers = await getReviewers()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{t('applicationsTitle')}</h1>
          <p className="text-muted-foreground mt-1">{t('applicationsDescription')}</p>
        </div>

        <AdminApplicationsClient
          locale={locale}
          initialTab={tab}
          applications={applicationsResult.applications}
          reviewers={reviewers}
          status={status}
        />
      </main>

      <Footer />
    </div>
  )
}
