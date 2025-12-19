import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getSession, canReview, isReviewer } from '@/lib/auth/server'
import { getSubmissionById } from '@/lib/services/submission'
import { getReviewStatus, getUserReview } from '@/lib/services/review'
import { getSpeciesActivity } from '@/lib/services/activity'
import { getTranslations } from '@/lib/getTranslations'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StatusBadge } from '@/components/submissions/StatusBadge'
import { ReviewProgress } from '@/components/submissions/ReviewProgress'
import { ReviewForm } from '@/components/submissions/ReviewForm'
import { ActivityLog } from '@/components/activity/ActivityLog'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import { SpeciesStatus, ReviewDecision } from '@prisma/client'

interface ReviewPageProps {
  params: Promise<{ locale: string; id: string }>
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const session = await getSession()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const { locale, id } = await params

  if (!isReviewer(session)) {
    redirect('/submissions')
  }

  const submission = await getSubmissionById(id)

  if (!submission) {
    notFound()
  }

  if (!canReview(session, submission)) {
    redirect(`/submissions/${id}`)
  }

  const reviewStatus = await getReviewStatus(id)
  const userReview = await getUserReview(id, session.user.id)
  const activities = await getSpeciesActivity(id)

  const hasAlreadyReviewed = !!userReview

  const t = await getTranslations(locale, 'review')
  const tSub = await getTranslations(locale, 'submissions')
  const tStratum = await getTranslations(locale, 'stratum')
  const tStage = await getTranslations(locale, 'successionalStage')
  const tLifeCycle = await getTranslations(locale, 'lifeCycle')
  const tFoliage = await getTranslations(locale, 'foliageType')
  const tGrowth = await getTranslations(locale, 'growthRate')
  const tUse = await getTranslations(locale, 'plantUse')

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href={`/submissions/${id}`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {tSub('backToDetails')}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardContent className="py-6">
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold italic">
                    {submission.scientificName}
                  </h1>
                  <StatusBadge status={submission.status} locale={locale} />
                </div>
                <p className="text-muted-foreground mt-1">
                  {submission.commonNames.join(', ')}
                </p>
                <div className="mt-4 pt-4 border-t">
                  <ReviewProgress
                    approvalCount={reviewStatus.approvalCount}
                    rejectionCount={reviewStatus.rejectionCount}
                    changesRequestedCount={reviewStatus.changesRequestedCount}
                    locale={locale}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Base Data */}
            <Card>
              <CardHeader>
                <CardTitle>{t('baseData')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{t('stratum')}</p>
                    <Badge variant="outline">{tStratum(submission.stratum)}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('successionalStage')}</p>
                    <Badge variant="outline">{tStage(submission.successionalStage)}</Badge>
                  </div>
                  {submission.lifeCycle && (
                    <div>
                      <p className="text-sm text-muted-foreground">{t('lifeCycle')}</p>
                      <Badge variant="outline">{tLifeCycle(submission.lifeCycle)}</Badge>
                    </div>
                  )}
                  {submission.heightMeters && (
                    <div>
                      <p className="text-sm text-muted-foreground">{t('height')}</p>
                      <p className="font-medium">{Number(submission.heightMeters)} m</p>
                    </div>
                  )}
                  {submission.canopyWidthMeters && (
                    <div>
                      <p className="text-sm text-muted-foreground">{t('canopyWidth')}</p>
                      <p className="font-medium">{Number(submission.canopyWidthMeters)} m</p>
                    </div>
                  )}
                  {submission.botanicalFamily && (
                    <div>
                      <p className="text-sm text-muted-foreground">{t('family')}</p>
                      <p className="font-medium">{submission.botanicalFamily}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ecology */}
            <Card>
              <CardHeader>
                <CardTitle>{t('ecology')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {submission.foliageType && (
                    <div>
                      <p className="text-sm text-muted-foreground">{t('foliageType')}</p>
                      <Badge variant="outline">{tFoliage(submission.foliageType)}</Badge>
                    </div>
                  )}
                  {submission.growthRate && (
                    <div>
                      <p className="text-sm text-muted-foreground">{t('growthRate')}</p>
                      <Badge variant="outline">{tGrowth(submission.growthRate)}</Badge>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">{t('nitrogenFixer')}</p>
                    <p className="font-medium">{submission.nitrogenFixer ? t('yes') : t('no')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t('hasFruit')}</p>
                    <p className="font-medium">{submission.hasFruit ? t('yes') : t('no')}</p>
                  </div>
                  {submission.hasFruit && (
                    <div>
                      <p className="text-sm text-muted-foreground">{t('edibleFruit')}</p>
                      <p className="font-medium">{submission.edibleFruit ? t('yes') : t('no')}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Uses */}
            {submission.uses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('uses')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {submission.uses.map((use) => (
                      <Badge key={use} variant="secondary">
                        {tUse(use)}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Observations */}
            {submission.observations && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('observations')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{submission.observations}</p>
                </CardContent>
              </Card>
            )}

            {/* Review Form */}
            {hasAlreadyReviewed ? (
              <Card>
                <CardContent className="py-6">
                  <div className="flex items-center gap-2 text-green-600">
                    <CheckCircle className="h-5 w-5" />
                    <span className="font-medium">{t('alreadyReviewed')}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t('yourDecision')}: {userReview.decision.replace('_', ' ')}
                    {userReview.comments && ` - "${userReview.comments}"`}
                  </p>
                </CardContent>
              </Card>
            ) : (
              <ReviewForm speciesId={id} locale={locale} />
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Submission Info */}
            <Card>
              <CardHeader>
                <CardTitle>{tSub('submissionInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">{tSub('createdBy')}</p>
                  <p className="font-medium">{submission.createdBy.name || submission.createdBy.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{tSub('createdAt')}</p>
                  <p className="font-medium">
                    {new Date(submission.createdAt).toLocaleDateString(locale)}
                  </p>
                </div>
                {submission.submittedAt && (
                  <div>
                    <p className="text-muted-foreground">{tSub('submittedForReview')}</p>
                    <p className="font-medium">
                      {new Date(submission.submittedAt).toLocaleDateString(locale)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Previous Reviews */}
            {reviewStatus.reviews.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{t('reviews')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {reviewStatus.reviews.map((review) => (
                    <div key={review.id} className="border-b last:border-0 pb-3 last:pb-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">
                          {review.reviewer.name || review.reviewer.email}
                        </span>
                        <Badge
                          variant={
                            review.decision === ReviewDecision.APPROVED
                              ? 'default'
                              : review.decision === ReviewDecision.REJECTED
                              ? 'destructive'
                              : 'secondary'
                          }
                          className={
                            review.decision === ReviewDecision.APPROVED
                              ? 'bg-green-100 text-green-800'
                              : ''
                          }
                        >
                          {review.decision.replace('_', ' ')}
                        </Badge>
                      </div>
                      {review.comments && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {review.comments}
                        </p>
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Activity Log */}
            {activities.length > 0 && (
              <ActivityLog activities={activities as any} locale={locale} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
