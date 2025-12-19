import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getSession, canViewSubmission, canEditSubmission, isReviewer } from '@/lib/auth/server'
import { getSubmissionById } from '@/lib/services/submission'
import { getSpeciesActivity } from '@/lib/services/activity'
import { getTranslations } from '@/lib/getTranslations'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StatusBadge } from '@/components/submissions/StatusBadge'
import { ReviewProgress } from '@/components/submissions/ReviewProgress'
import { ActivityLog } from '@/components/activity/ActivityLog'
import { SpeciesForm } from '@/components/submissions/SpeciesForm'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Send } from 'lucide-react'
import { SpeciesStatus, ReviewDecision } from '@prisma/client'

interface SubmissionDetailPageProps {
  params: Promise<{ locale: string; id: string }>
  searchParams: Promise<{ edit?: string }>
}

export default async function SubmissionDetailPage({ params, searchParams }: SubmissionDetailPageProps) {
  const session = await getSession()

  if (!session?.user) {
    redirect('/auth/signin')
  }

  const { locale, id } = await params
  const { edit } = await searchParams

  const submission = await getSubmissionById(id)

  if (!submission) {
    notFound()
  }

  if (!canViewSubmission(session, submission)) {
    redirect(`/${locale}/submissions`)
  }

  // Get translations
  const t = await getTranslations(locale, 'submissions')
  const tReview = await getTranslations(locale, 'review')
  const tStratum = await getTranslations(locale, 'stratum')
  const tStage = await getTranslations(locale, 'successionalStage')
  const tLifeCycle = await getTranslations(locale, 'lifeCycle')
  const tFoliage = await getTranslations(locale, 'foliageType')
  const tGrowth = await getTranslations(locale, 'growthRate')
  const tUse = await getTranslations(locale, 'plantUse')

  const canEdit = canEditSubmission(session, submission)
  const userIsReviewer = isReviewer(session)
  const isEditMode = edit === 'true' && canEdit

  // Get activity log for reviewers
  const activities = userIsReviewer ? await getSpeciesActivity(id) : []

  const approvalCount = submission.reviews.filter(
    r => r.decision === ReviewDecision.APPROVED
  ).length

  if (isEditMode) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href={`/${locale}/submissions/${id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {t('backToDetails')}
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mt-4">{t('editSpecies')}</h1>
          </div>

          <SpeciesForm
            mode="edit"
            speciesId={id}
            locale={locale}
            defaultValues={{
              scientificName: submission.scientificName,
              genus: submission.genus || undefined,
              species: submission.species || undefined,
              author: submission.author || undefined,
              commonNames: submission.commonNames,
              synonyms: submission.synonyms,
              botanicalFamily: submission.botanicalFamily || undefined,
              variety: submission.variety || undefined,
              stratum: submission.stratum,
              successionalStage: submission.successionalStage,
              lifeCycle: submission.lifeCycle || undefined,
              lifeCycleYears: submission.lifeCycleYears || undefined,
              heightMeters: submission.heightMeters ? Number(submission.heightMeters) : undefined,
              canopyWidthMeters: submission.canopyWidthMeters ? Number(submission.canopyWidthMeters) : undefined,
              canopyShape: submission.canopyShape || undefined,
              originCenter: submission.originCenter || undefined,
              globalBiome: submission.globalBiome || undefined,
              regionalBiome: submission.regionalBiome,
              foliageType: submission.foliageType || undefined,
              leafDropSeason: submission.leafDropSeason || undefined,
              growthRate: submission.growthRate || undefined,
              rootSystem: submission.rootSystem || undefined,
              nitrogenFixer: submission.nitrogenFixer,
              biomassProduction: submission.biomassProduction || undefined,
              hasFruit: submission.hasFruit,
              edibleFruit: submission.edibleFruit,
              fruitingAge: submission.fruitingAge || undefined,
              uses: submission.uses,
              propagationMethods: submission.propagationMethods,
              observations: submission.observations || undefined,
            }}
            defaultPhotos={submission.photos.map(p => ({
              id: p.id,
              url: p.url,
              key: p.url.split('/').pop() || p.id,
              caption: p.caption || undefined,
              primary: p.primary,
            }))}
          />
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href={`/${locale}/submissions`}>
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToSubmissions')}
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Header */}
            <Card>
              <CardContent className="py-6">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-3">
                      <h1 className="text-2xl font-bold italic">
                        {submission.scientificName}
                      </h1>
                      <StatusBadge status={submission.status} locale={locale} />
                    </div>
                    <p className="text-muted-foreground mt-1">
                      {submission.commonNames.join(', ')}
                    </p>
                    {submission.botanicalFamily && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {tReview('family')}: {submission.botanicalFamily}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {canEdit && submission.status === SpeciesStatus.DRAFT && (
                      <Link href={`/${locale}/submissions/${id}?edit=true`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          {t('edit')}
                        </Button>
                      </Link>
                    )}
                    {userIsReviewer &&
                      submission.status === SpeciesStatus.IN_REVIEW &&
                      submission.createdById !== session.user.id && (
                        <Link href={`/${locale}/submissions/${id}/review`}>
                          <Button size="sm">
                            {t('review')}
                          </Button>
                        </Link>
                      )}
                  </div>
                </div>

                {submission.status === SpeciesStatus.IN_REVIEW && (
                  <div className="mt-4 pt-4 border-t">
                    <ReviewProgress
                      approvalCount={approvalCount}
                      rejectionCount={submission.reviews.filter(r => r.decision === ReviewDecision.REJECTED).length}
                      changesRequestedCount={submission.reviews.filter(r => r.decision === ReviewDecision.CHANGES_REQUESTED).length}
                      locale={locale}
                    />
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Base Data */}
            <Card>
              <CardHeader>
                <CardTitle>{tReview('baseData')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">{tReview('stratum')}</p>
                    <Badge variant="outline">{tStratum(submission.stratum)}</Badge>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{tReview('successionalStage')}</p>
                    <Badge variant="outline">{tStage(submission.successionalStage)}</Badge>
                  </div>
                  {submission.lifeCycle && (
                    <div>
                      <p className="text-sm text-muted-foreground">{tReview('lifeCycle')}</p>
                      <Badge variant="outline">{tLifeCycle(submission.lifeCycle)}</Badge>
                    </div>
                  )}
                  {submission.heightMeters && (
                    <div>
                      <p className="text-sm text-muted-foreground">{tReview('height')}</p>
                      <p className="font-medium">{Number(submission.heightMeters)} m</p>
                    </div>
                  )}
                  {submission.canopyWidthMeters && (
                    <div>
                      <p className="text-sm text-muted-foreground">{tReview('canopyWidth')}</p>
                      <p className="font-medium">{Number(submission.canopyWidthMeters)} m</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ecology */}
            <Card>
              <CardHeader>
                <CardTitle>{tReview('ecology')}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {submission.foliageType && (
                    <div>
                      <p className="text-sm text-muted-foreground">{tReview('foliageType')}</p>
                      <Badge variant="outline">{tFoliage(submission.foliageType)}</Badge>
                    </div>
                  )}
                  {submission.growthRate && (
                    <div>
                      <p className="text-sm text-muted-foreground">{tReview('growthRate')}</p>
                      <Badge variant="outline">{tGrowth(submission.growthRate)}</Badge>
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-muted-foreground">{tReview('nitrogenFixer')}</p>
                    <p className="font-medium">{submission.nitrogenFixer ? tReview('yes') : tReview('no')}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{tReview('hasFruit')}</p>
                    <p className="font-medium">{submission.hasFruit ? tReview('yes') : tReview('no')}</p>
                  </div>
                  {submission.hasFruit && (
                    <div>
                      <p className="text-sm text-muted-foreground">{tReview('edibleFruit')}</p>
                      <p className="font-medium">{submission.edibleFruit ? tReview('yes') : tReview('no')}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Uses */}
            {submission.uses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{tReview('uses')}</CardTitle>
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
                  <CardTitle>{tReview('observations')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{submission.observations}</p>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Submission Info */}
            <Card>
              <CardHeader>
                <CardTitle>{t('submissionInfo')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div>
                  <p className="text-muted-foreground">{t('createdBy')}</p>
                  <p className="font-medium">{submission.createdBy.name || submission.createdBy.email}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">{t('createdAt')}</p>
                  <p className="font-medium">
                    {new Date(submission.createdAt).toLocaleDateString(locale)}
                  </p>
                </div>
                {submission.submittedAt && (
                  <div>
                    <p className="text-muted-foreground">{t('submittedForReview')}</p>
                    <p className="font-medium">
                      {new Date(submission.submittedAt).toLocaleDateString(locale)}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Reviews */}
            {submission.reviews.length > 0 && userIsReviewer && (
              <Card>
                <CardHeader>
                  <CardTitle>{tReview('reviews')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {submission.reviews.map((review) => (
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
                          {review.decision === ReviewDecision.APPROVED
                            ? tReview('approve')
                            : review.decision === ReviewDecision.REJECTED
                            ? tReview('reject')
                            : tReview('requestChanges')}
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

            {/* Activity Log (Reviewers only) */}
            {userIsReviewer && activities.length > 0 && (
              <ActivityLog activities={activities as any} locale={locale} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
