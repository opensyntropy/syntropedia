import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession, isReviewer } from '@/lib/auth/server'
import { getSubmissions, type SubmissionType } from '@/lib/services/submission'
import { getTranslations } from '@/lib/getTranslations'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StatusBadge } from '@/components/submissions/StatusBadge'
import { ReviewProgress } from '@/components/submissions/ReviewProgress'
import { ResubmitButton } from '@/components/submissions/ResubmitButton'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, RefreshCw, Sparkles } from 'lucide-react'
import { SpeciesStatus, ReviewDecision } from '@prisma/client'

interface SubmissionsPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ status?: string; page?: string; type?: string }>
}

export default async function SubmissionsPage({ params, searchParams }: SubmissionsPageProps) {
  const session = await getSession()

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/contributions')
  }

  const { locale } = await params
  const { status, page, type } = await searchParams
  const userIsReviewer = isReviewer(session)

  const result = await getSubmissions({
    userId: session.user.id,
    isReviewer: userIsReviewer,
    status: status as SpeciesStatus | undefined,
    page: page ? parseInt(page) : 1,
    limit: 20,
    submissionType: type as SubmissionType | undefined,
  })

  const t = await getTranslations(locale, 'contributions')

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <p className="text-muted-foreground mt-1">
              {userIsReviewer ? t('allContributions') : t('yourContributions')}
            </p>
          </div>
          <Link href="/contributions/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t('newSpecies')}
            </Button>
          </Link>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Link href="/contributions">
            <Button variant={!status ? 'default' : 'outline'} size="sm">
              {t('all')}
            </Button>
          </Link>
          <Link href="/contributions?status=DRAFT">
            <Button variant={status === 'DRAFT' ? 'default' : 'outline'} size="sm">
              {t('draft')}
            </Button>
          </Link>
          <Link href="/contributions?status=IN_REVIEW">
            <Button variant={status === 'IN_REVIEW' ? 'default' : 'outline'} size="sm">
              {t('inReview')}
            </Button>
          </Link>
          <Link href="/contributions?status=REJECTED">
            <Button variant={status === 'REJECTED' ? 'default' : 'outline'} size="sm">
              {t('rejected')}
            </Button>
          </Link>
          <Link href="/contributions?status=PUBLISHED">
            <Button variant={status === 'PUBLISHED' ? 'default' : 'outline'} size="sm">
              {t('published')}
            </Button>
          </Link>
        </div>

        {/* Submission Type Filter - Show when IN_REVIEW is selected */}
        {status === 'IN_REVIEW' && (
          <div className="flex flex-wrap gap-2 mb-6">
            <span className="text-sm text-muted-foreground self-center mr-2">{t('filterType')}:</span>
            <Link href="/contributions?status=IN_REVIEW">
              <Button variant={!type ? 'secondary' : 'ghost'} size="sm">
                {t('allTypes')}
              </Button>
            </Link>
            <Link href="/contributions?status=IN_REVIEW&type=new">
              <Button variant={type === 'new' ? 'secondary' : 'ghost'} size="sm" className="gap-1">
                <Sparkles className="h-3 w-3" />
                {t('newSubmissions')}
              </Button>
            </Link>
            <Link href="/contributions?status=IN_REVIEW&type=revision">
              <Button variant={type === 'revision' ? 'secondary' : 'ghost'} size="sm" className="gap-1">
                <RefreshCw className="h-3 w-3" />
                {t('revisionRequests')}
              </Button>
            </Link>
          </div>
        )}

        {/* Submissions List */}
        {result.submissions.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">{t('noContributions')}</p>
              <Link href="/contributions/new">
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
                <Link key={submission.id} href={`/contributions/${submission.id}`} className="block">
                  <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                    <CardContent className="py-4">
                      <div className="flex items-start gap-4">
                        {/* Thumbnail */}
                        <div className="flex-shrink-0">
                          {submission.primaryPhoto ? (
                            <img
                              src={submission.primaryPhoto.url}
                              alt={submission.scientificName}
                              className="w-16 h-16 rounded-lg object-cover bg-gray-100"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center">
                              <span className="text-gray-400 text-2xl">🌱</span>
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-3 flex-wrap">
                            <h3 className="font-semibold text-lg truncate">
                              {submission.scientificName}
                            </h3>
                            <StatusBadge status={submission.status} locale={locale} />
                            {submission.status === SpeciesStatus.IN_REVIEW && (
                              submission.revisionRequestedById ? (
                                <Badge variant="outline" className="text-orange-600 border-orange-300 bg-orange-50 gap-1">
                                  <RefreshCw className="h-3 w-3" />
                                  {t('revision')}
                                </Badge>
                              ) : (
                                <Badge variant="outline" className="text-emerald-600 border-emerald-300 bg-emerald-50 gap-1">
                                  <Sparkles className="h-3 w-3" />
                                  {t('new')}
                                </Badge>
                              )
                            )}
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
                          {submission.status === SpeciesStatus.DRAFT && (
                            <Link href={`/contributions/${submission.id}?edit=true`}>
                              <Button variant="outline" size="sm">
                                <Edit className="h-4 w-4 mr-1" />
                                {t('edit')}
                              </Button>
                            </Link>
                          )}
                          {submission.status === SpeciesStatus.REJECTED &&
                            submission.createdById === session.user.id && (
                              <>
                                <Link href={`/contributions/${submission.id}?edit=true`}>
                                  <Button variant="outline" size="sm">
                                    <Edit className="h-4 w-4 mr-1" />
                                    {t('edit')}
                                  </Button>
                                </Link>
                                <ResubmitButton speciesId={submission.id} locale={locale} />
                              </>
                            )}
                          {submission.status === SpeciesStatus.IN_REVIEW &&
                            userIsReviewer &&
                            submission.createdById !== session.user.id && (
                              <Link href={`/contributions/${submission.id}/review`}>
                                <Button size="sm">
                                  {t('review')}
                                </Button>
                              </Link>
                            )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {result.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-8">
            {result.page > 1 && (
              <Link href={`/submissions?page=${result.page - 1}${status ? `&status=${status}` : ''}`}>
                <Button variant="outline">{t('previous')}</Button>
              </Link>
            )}
            <span className="flex items-center px-4 text-sm text-muted-foreground">
              {t('pageOf').replace('{page}', String(result.page)).replace('{total}', String(result.totalPages))}
            </span>
            {result.page < result.totalPages && (
              <Link href={`/submissions?page=${result.page + 1}${status ? `&status=${status}` : ''}`}>
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
