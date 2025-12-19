import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession, isReviewer } from '@/lib/auth/server'
import { getSubmissions } from '@/lib/services/submission'
import { getTranslations } from '@/lib/getTranslations'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StatusBadge } from '@/components/submissions/StatusBadge'
import { ReviewProgress } from '@/components/submissions/ReviewProgress'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Plus, Eye, Edit } from 'lucide-react'
import { SpeciesStatus, ReviewDecision } from '@prisma/client'

interface SubmissionsPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ status?: string; page?: string }>
}

export default async function SubmissionsPage({ params, searchParams }: SubmissionsPageProps) {
  const session = await getSession()

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/submissions')
  }

  const { locale } = await params
  const { status, page } = await searchParams
  const userIsReviewer = isReviewer(session)

  const result = await getSubmissions({
    userId: session.user.id,
    isReviewer: userIsReviewer,
    status: status as SpeciesStatus | undefined,
    page: page ? parseInt(page) : 1,
    limit: 20,
  })

  const t = await getTranslations(locale, 'submissions')

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <p className="text-muted-foreground mt-1">
              {userIsReviewer ? t('allSubmissions') : t('yourSubmissions')}
            </p>
          </div>
          <Link href={`/${locale}/submissions/new`}>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('newSpecies')}
            </Button>
          </Link>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex gap-2 mb-6">
          <Link href={`/${locale}/submissions`}>
            <Button variant={!status ? 'default' : 'outline'} size="sm">
              {t('all')}
            </Button>
          </Link>
          <Link href={`/${locale}/submissions?status=DRAFT`}>
            <Button variant={status === 'DRAFT' ? 'default' : 'outline'} size="sm">
              {t('draft')}
            </Button>
          </Link>
          <Link href={`/${locale}/submissions?status=IN_REVIEW`}>
            <Button variant={status === 'IN_REVIEW' ? 'default' : 'outline'} size="sm">
              {t('inReview')}
            </Button>
          </Link>
          <Link href={`/${locale}/submissions?status=PUBLISHED`}>
            <Button variant={status === 'PUBLISHED' ? 'default' : 'outline'} size="sm">
              {t('published')}
            </Button>
          </Link>
        </div>

        {/* Submissions List */}
        {result.submissions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">{t('noSubmissions')}</p>
              <Link href={`/${locale}/submissions/new`}>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('createFirst')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {result.submissions.map((submission) => {
              const approvalCount = submission.reviews.filter(
                r => r.decision === ReviewDecision.APPROVED
              ).length

              return (
                <Card key={submission.id}>
                  <CardContent className="py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-3">
                          <h3 className="font-semibold text-lg truncate">
                            {submission.scientificName}
                          </h3>
                          <StatusBadge status={submission.status} locale={locale} />
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          {submission.commonNames.slice(0, 3).join(', ')}
                          {submission.commonNames.length > 3 && '...'}
                        </p>
                        {userIsReviewer && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {t('submittedBy')}: {submission.createdBy.name || submission.createdBy.email}
                          </p>
                        )}
                        {submission.status === SpeciesStatus.IN_REVIEW && (
                          <div className="mt-2">
                            <ReviewProgress approvalCount={approvalCount} locale={locale} />
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Link href={`/${locale}/submissions/${submission.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            {t('view')}
                          </Button>
                        </Link>
                        {submission.status === SpeciesStatus.DRAFT && (
                          <Link href={`/${locale}/submissions/${submission.id}?edit=true`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              {t('edit')}
                            </Button>
                          </Link>
                        )}
                        {submission.status === SpeciesStatus.IN_REVIEW &&
                          userIsReviewer &&
                          submission.createdById !== session.user.id && (
                            <Link href={`/${locale}/submissions/${submission.id}/review`}>
                              <Button size="sm">
                                {t('review')}
                              </Button>
                            </Link>
                          )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {result.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {result.page > 1 && (
              <Link href={`/${locale}/submissions?page=${result.page - 1}${status ? `&status=${status}` : ''}`}>
                <Button variant="outline">{t('previous')}</Button>
              </Link>
            )}
            <span className="flex items-center px-4 text-sm text-muted-foreground">
              {t('pageOf').replace('{page}', String(result.page)).replace('{total}', String(result.totalPages))}
            </span>
            {result.page < result.totalPages && (
              <Link href={`/${locale}/submissions?page=${result.page + 1}${status ? `&status=${status}` : ''}`}>
                <Button variant="outline">{t('next')}</Button>
              </Link>
            )}
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
