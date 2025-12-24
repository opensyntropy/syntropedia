import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession, isReviewer } from '@/lib/auth/server'
import { getTranslations } from '@/lib/getTranslations'
import { getReviewQueue, type SubmissionType } from '@/lib/services/submission'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { ReviewQueueList } from '@/components/reviews/ReviewQueueList'
import { Button } from '@/components/ui/button'
import { Sparkles, RefreshCw, ImageIcon } from 'lucide-react'

interface ReviewsPageProps {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ type?: string }>
}

export default async function ReviewsPage({ params, searchParams }: ReviewsPageProps) {
  const session = await getSession()

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/reviews')
  }

  if (!isReviewer(session)) {
    redirect('/contributions')
  }

  const { locale } = await params
  const { type } = await searchParams
  const t = await getTranslations(locale, 'reviewQueue')
  const tFooter = await getTranslations(locale, 'footer')

  // Default to 'new' if no type specified
  const submissionType = (type as SubmissionType) || 'new'

  const queue = await getReviewQueue({
    reviewerId: session.user.id,
    submissionType
  })

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('description')}
          </p>
        </div>

        {/* Type Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link href="/reviews?type=new">
            <Button
              variant={submissionType === 'new' ? 'default' : 'outline'}
              size="sm"
              className="gap-1"
            >
              <Sparkles className="h-3 w-3" />
              {t('newSubmissions')}
            </Button>
          </Link>
          <Link href="/reviews?type=revision">
            <Button
              variant={submissionType === 'revision' ? 'default' : 'outline'}
              size="sm"
              className="gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              {t('revisionRequests')}
            </Button>
          </Link>
          <Link href="/reviews/photos">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <ImageIcon className="h-3 w-3" />
              Photos
            </Button>
          </Link>
          <span className="text-sm text-muted-foreground self-center ml-2">
            ({queue.length})
          </span>
        </div>

        <ReviewQueueList submissions={queue} locale={locale} />
      </main>

      <Footer
        labels={{
          description: tFooter('description'),
          project: tFooter('project'),
          about: tFooter('about'),
          catalog: tFooter('catalog'),
          contribute: tFooter('contribute'),
          community: tFooter('community'),
          forum: tFooter('forum'),
          github: tFooter('github'),
          discussions: tFooter('discussions'),
          legal: tFooter('legal'),
          mitLicense: tFooter('mitLicense'),
          ccLicense: tFooter('ccLicense'),
          privacy: tFooter('privacy'),
          copyright: tFooter('copyright'),
        }}
      />
    </div>
  )
}
