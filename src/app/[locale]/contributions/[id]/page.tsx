import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { getSession, canViewSubmission, canEditSubmission, canDeleteSubmission, isReviewer, canReview } from '@/lib/auth/server'
import { getSubmissionById, getFormValuesFromSubmission } from '@/lib/services/submission'
import { getSpeciesChangeHistory } from '@/lib/services/activity'
import { getUserReview } from '@/lib/services/review'
import { getTranslations } from '@/lib/getTranslations'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StatusBadge } from '@/components/submissions/StatusBadge'
import { ReviewProgress } from '@/components/submissions/ReviewProgress'
import { ChangeHistory } from '@/components/activity/ChangeHistory'
import { SpeciesForm } from '@/components/submissions/SpeciesForm'
import { DeleteSubmissionButton } from '@/components/submissions/DeleteSubmissionButton'
import { ReviewDecisionButtons } from '@/components/submissions/ReviewDecisionButtons'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Edit, Send, Image as ImageIcon } from 'lucide-react'
import { SpeciesStatus, ReviewDecision } from '@prisma/client'
import { PHOTO_FRAGMENT_TAGS, type PhotoFragmentTag } from '@/lib/validations/species'

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
    redirect('/contributions')
  }

  // Get translations
  const t = await getTranslations(locale, 'contributions')
  const tReview = await getTranslations(locale, 'review')
  const tStratum = await getTranslations(locale, 'stratum')
  const tStage = await getTranslations(locale, 'successionalStage')
  const tLifeCycle = await getTranslations(locale, 'lifeCycle')
  const tFoliage = await getTranslations(locale, 'foliageType')
  const tGrowth = await getTranslations(locale, 'growthRate')
  const tUse = await getTranslations(locale, 'plantUse')
  const tPhotos = await getTranslations(locale, 'photoTags')
  const tCanopyShape = await getTranslations(locale, 'canopyShape')
  const tRootSystem = await getTranslations(locale, 'rootSystem')
  const tBiomass = await getTranslations(locale, 'biomassProduction')
  const tGlobalBiome = await getTranslations(locale, 'globalBiome')
  const tDetail = await getTranslations(locale, 'speciesDetail')

  const canEdit = canEditSubmission(session, submission)
  const canDelete = canDeleteSubmission(session, submission)
  const userIsReviewer = isReviewer(session)

  // Reviewers can edit species in review (not their own)
  const canReviewEdit = canReview(session, submission)
  const isReviewMode = canReviewEdit && submission.status === SpeciesStatus.IN_REVIEW
  const isEditMode = edit === 'true' && (canEdit || canReviewEdit)

  // Get change history for reviewers
  const changeHistory = userIsReviewer ? await getSpeciesChangeHistory(id) : []

  // Get user's review if they've already reviewed
  const userReview = isReviewMode ? await getUserReview(id, session.user.id) : null
  const hasAlreadyReviewed = !!userReview

  const approvalCount = submission.reviews.filter(
    r => r.decision === ReviewDecision.APPROVED
  ).length

  if (isEditMode) {
    const formMode = isReviewMode ? 'review' : 'edit'
    const pageTitle = isReviewMode
      ? (locale === 'pt-BR' ? 'Revisar Espécie' : locale === 'es' ? 'Revisar Especie' : 'Review Species')
      : t('editSpecies')

    return (
      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 container mx-auto px-4 py-8">
          <div className="mb-6">
            <Link href={isReviewMode ? '/reviews' : `/contributions/${id}`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                {isReviewMode
                  ? (locale === 'pt-BR' ? 'Voltar para Fila' : locale === 'es' ? 'Volver a Cola' : 'Back to Queue')
                  : t('backToDetails')}
              </Button>
            </Link>
            <h1 className="text-3xl font-bold mt-4">{pageTitle}</h1>
            {isReviewMode && (
              <p className="text-muted-foreground mt-1">
                {locale === 'pt-BR'
                  ? 'Edite os campos se necessário, depois aprove ou rejeite'
                  : locale === 'es'
                  ? 'Edite los campos si es necesario, luego apruebe o rechace'
                  : 'Edit fields if needed, then approve or reject'}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <SpeciesForm
                mode={formMode}
                speciesId={id}
                locale={locale}
                defaultValues={getFormValuesFromSubmission(submission)}
                defaultPhotos={submission.photos.map(p => ({
                  id: p.id,
                  url: p.url,
                  key: p.url.split('/').pop() || p.id,
                  caption: p.caption || undefined,
                  primary: p.primary,
                  // Filter to only valid photo fragment tags
                  tags: (p.tags || []).filter(tag =>
                    PHOTO_FRAGMENT_TAGS.includes(tag as PhotoFragmentTag)
                  ),
                }))}
              />
            </div>

            {/* Sidebar for review mode */}
            {isReviewMode && (
              <div className="space-y-6">
                {/* Species Creator */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {locale === 'pt-BR' ? 'Criado por' : locale === 'es' ? 'Creado por' : 'Created by'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center gap-3">
                      {submission.createdBy.avatar ? (
                        <img
                          src={submission.createdBy.avatar}
                          alt={submission.createdBy.name || ''}
                          className="w-10 h-10 rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <span className="text-primary font-medium">
                            {(submission.createdBy.name || submission.createdBy.email)[0].toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div>
                        <p className="font-medium">{submission.createdBy.name || submission.createdBy.email}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(submission.createdAt).toLocaleDateString(locale)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Review Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle>
                      {locale === 'pt-BR' ? 'Progresso' : locale === 'es' ? 'Progreso' : 'Progress'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ReviewProgress
                      approvalCount={approvalCount}
                      rejectionCount={submission.reviews.filter(r => r.decision === ReviewDecision.REJECTED).length}
                      locale={locale}
                    />
                  </CardContent>
                </Card>

                {/* Change History */}
                {changeHistory.length > 0 && (
                  <ChangeHistory changes={changeHistory as any} locale={locale} />
                )}

                {/* Decision Buttons at bottom */}
                <ReviewDecisionButtons
                  speciesId={id}
                  locale={locale}
                  hasAlreadyReviewed={hasAlreadyReviewed}
                  previousDecision={userReview?.decision}
                  previousComments={userReview?.comments || undefined}
                />
              </div>
            )}
          </div>
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
          <Link href="/contributions">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t('backToContributions')}
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
                    {(submission.genus || submission.species || submission.author) && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {submission.genus && <span>{tDetail('genus')}: <em>{submission.genus}</em></span>}
                        {submission.species && <span> | {tDetail('species')}: <em>{submission.species}</em></span>}
                        {submission.author && <span> | {tDetail('author')}: {submission.author}</span>}
                      </p>
                    )}
                    {submission.variety && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {tDetail('variety')}: {submission.variety}
                      </p>
                    )}
                    {submission.synonyms && submission.synonyms.length > 0 && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {tDetail('synonyms')}: {submission.synonyms.join(', ')}
                      </p>
                    )}
                  </div>

                  <div className="flex gap-2">
                    {canEdit && submission.status === SpeciesStatus.DRAFT && (
                      <Link href={`/submissions/${id}?edit=true`}>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4 mr-2" />
                          {t('edit')}
                        </Button>
                      </Link>
                    )}
                    {canDelete && (
                      <DeleteSubmissionButton
                        submissionId={id}
                        speciesName={submission.scientificName}
                        translations={{
                          delete: t('delete'),
                          confirmMessage: t('deleteConfirm'),
                        }}
                      />
                    )}
                    {userIsReviewer &&
                      submission.status === SpeciesStatus.IN_REVIEW &&
                      submission.createdById !== session.user.id && (
                        <Link href={`/contributions/${id}?edit=true`}>
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
                  {submission.canopyShape && (
                    <div>
                      <p className="text-sm text-muted-foreground">{tDetail('canopyShape')}</p>
                      <Badge variant="outline">{tCanopyShape(submission.canopyShape)}</Badge>
                    </div>
                  )}
                  {(submission.lifeCycleYearsStart || submission.lifeCycleYearsEnd) && (
                    <div>
                      <p className="text-sm text-muted-foreground">{tDetail('lifespan')}</p>
                      <p className="font-medium">
                        {submission.lifeCycleYearsStart && submission.lifeCycleYearsEnd
                          ? `${submission.lifeCycleYearsStart}-${submission.lifeCycleYearsEnd}`
                          : submission.lifeCycleYearsStart || submission.lifeCycleYearsEnd} {tDetail('years')}
                      </p>
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
              <CardContent className="space-y-4">
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
                  {submission.rootSystem && (
                    <div>
                      <p className="text-sm text-muted-foreground">{tDetail('rootSystem')}</p>
                      <Badge variant="outline">{tRootSystem(submission.rootSystem)}</Badge>
                    </div>
                  )}
                  {submission.biomassProduction && (
                    <div>
                      <p className="text-sm text-muted-foreground">{tDetail('biomassProduction')}</p>
                      <Badge variant="outline">{tBiomass(submission.biomassProduction)}</Badge>
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
                  {(submission.fruitingAgeStart || submission.fruitingAgeEnd) && (
                    <div>
                      <p className="text-sm text-muted-foreground">{tDetail('fruitingAge')}</p>
                      <p className="font-medium">
                        {submission.fruitingAgeStart && submission.fruitingAgeEnd
                          ? `${submission.fruitingAgeStart}-${submission.fruitingAgeEnd}`
                          : submission.fruitingAgeStart || submission.fruitingAgeEnd} {tDetail('years')}
                      </p>
                    </div>
                  )}
                </div>

                {/* Origin & Biomes */}
                {(submission.originCenter || submission.globalBiome || (submission.regionalBiome && submission.regionalBiome.length > 0)) && (
                  <div className="pt-4 border-t space-y-3">
                    {submission.originCenter && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{tDetail('originCenter')}</p>
                        <p className="font-medium">{submission.originCenter}</p>
                      </div>
                    )}
                    {submission.globalBiome && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{tDetail('globalBiome')}</p>
                        <Badge variant="secondary">{tGlobalBiome(submission.globalBiome)}</Badge>
                      </div>
                    )}
                    {submission.regionalBiome && submission.regionalBiome.length > 0 && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">{tDetail('regionalBiomes')}</p>
                        <div className="flex flex-wrap gap-1">
                          {submission.regionalBiome.map((biome) => (
                            <Badge key={biome} variant="outline">{biome}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
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

            {/* Propagation Methods */}
            {submission.propagationMethods && submission.propagationMethods.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>{tDetail('propagation')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {submission.propagationMethods.map((method) => (
                      <Badge key={method} variant="outline">
                        {tDetail(`propagationMethod.${method}`)}
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

            {/* Photos */}
            {submission.photos.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ImageIcon className="h-5 w-5" />
                    {tPhotos('title')}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {submission.photos.map((photo, index) => (
                      <div key={photo.id} className="border rounded-lg overflow-hidden">
                        <div className="relative aspect-video bg-gray-100">
                          <img
                            src={photo.url}
                            alt={photo.caption || `Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          {photo.primary && (
                            <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                              {tPhotos('primary')}
                            </span>
                          )}
                        </div>
                        {(photo.caption || (photo.tags && photo.tags.length > 0)) && (
                          <div className="p-3 space-y-2">
                            {photo.caption && (
                              <p className="text-sm text-muted-foreground">{photo.caption}</p>
                            )}
                            {photo.tags && photo.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1">
                                {photo.tags.map((tag) => (
                                  <Badge key={tag} variant="secondary" className="text-xs">
                                    {tPhotos(tag as PhotoFragmentTag)}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Submission Info */}
            <Card>
              <CardHeader>
                <CardTitle>{t('contributionInfo')}</CardTitle>
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
                              : 'destructive'
                          }
                          className={
                            review.decision === ReviewDecision.APPROVED
                              ? 'bg-green-100 text-green-800'
                              : ''
                          }
                        >
                          {review.decision === ReviewDecision.APPROVED
                            ? tReview('approve')
                            : tReview('reject')}
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

            {/* Change History (Reviewers only) */}
            {userIsReviewer && changeHistory.length > 0 && (
              <ChangeHistory changes={changeHistory as any} locale={locale} />
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
