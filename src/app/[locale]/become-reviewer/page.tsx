import { redirect } from 'next/navigation'
import { getSession, isReviewer } from '@/lib/auth/server'
import { getTranslations } from '@/lib/getTranslations'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getUserApplication } from '@/lib/services/reviewer-application'
import { ReviewerApplicationForm } from '@/components/reviewer/ReviewerApplicationForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, Clock, XCircle, Shield } from 'lucide-react'
import Link from 'next/link'

interface BecomeReviewerPageProps {
  params: Promise<{ locale: string }>
}

export default async function BecomeReviewerPage({ params }: BecomeReviewerPageProps) {
  const session = await getSession()
  const { locale } = await params
  const t = await getTranslations(locale, 'becomeReviewer')

  // If user is already a reviewer, show message
  if (session?.user && isReviewer(session)) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <Shield className="h-12 w-12 text-primary-600 mx-auto mb-4" />
              <CardTitle>{t('alreadyReviewer')}</CardTitle>
              <CardDescription>{t('alreadyReviewerDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Link href="/contributions">
                <Button>{t('viewContributions')}</Button>
              </Link>
            </CardContent>
          </Card>
        </main>
        <Footer />
      </div>
    )
  }

  // Check if user has an existing application
  const application = session?.user ? await getUserApplication(session.user.id) : null

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Page Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold">{t('title')}</h1>
            <p className="text-muted-foreground mt-2">{t('description')}</p>
          </div>

          {/* Benefits Section */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>{t('whatReviewersDo')}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t('benefit1')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t('benefit2')}</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{t('benefit3')}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          {/* Login Prompt */}
          {!session?.user && (
            <Card>
              <CardHeader>
                <CardTitle>{t('loginRequired')}</CardTitle>
                <CardDescription>{t('loginRequiredDescription')}</CardDescription>
              </CardHeader>
              <CardContent>
                <Link href="/auth/signin?callbackUrl=/become-reviewer">
                  <Button className="w-full">{t('login')}</Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Application Status */}
          {session?.user && application && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {application.status === 'PENDING' && (
                    <>
                      <Clock className="h-5 w-5 text-yellow-500" />
                      {t('statusPending')}
                    </>
                  )}
                  {application.status === 'APPROVED' && (
                    <>
                      <CheckCircle className="h-5 w-5 text-green-500" />
                      {t('statusApproved')}
                    </>
                  )}
                  {application.status === 'REJECTED' && (
                    <>
                      <XCircle className="h-5 w-5 text-red-500" />
                      {t('statusRejected')}
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {application.status === 'PENDING' && (
                  <p className="text-muted-foreground">{t('pendingDescription')}</p>
                )}
                {application.status === 'APPROVED' && (
                  <p className="text-muted-foreground">{t('approvedDescription')}</p>
                )}
                {application.status === 'REJECTED' && (
                  <div>
                    <p className="text-muted-foreground mb-2">{t('rejectedDescription')}</p>
                    {application.reviewNote && (
                      <div className="bg-muted p-3 rounded-md">
                        <p className="text-sm font-medium mb-1">{t('adminNote')}:</p>
                        <p className="text-sm text-muted-foreground">{application.reviewNote}</p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Application Form */}
          {session?.user && !application && (
            <ReviewerApplicationForm locale={locale} />
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
