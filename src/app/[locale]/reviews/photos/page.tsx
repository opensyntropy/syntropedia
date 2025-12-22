import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getSession, isReviewer } from '@/lib/auth/server'
import { getTranslations } from '@/lib/getTranslations'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { PendingPhotosList } from '@/components/reviewer/PendingPhotosList'
import { Button } from '@/components/ui/button'
import { Sparkles, RefreshCw, ImageIcon } from 'lucide-react'

interface PhotosReviewPageProps {
  params: Promise<{ locale: string }>
}

export default async function PhotosReviewPage({ params }: PhotosReviewPageProps) {
  const session = await getSession()

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/reviews/photos')
  }

  if (!isReviewer(session)) {
    redirect('/contributions')
  }

  const { locale } = await params
  const t = await getTranslations(locale, 'reviewQueue')
  const tPhotos = await getTranslations(locale, 'reviewPhotos')

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{tPhotos('title')}</h1>
          <p className="text-muted-foreground mt-1">
            {tPhotos('description')}
          </p>
        </div>

        {/* Type Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          <Link href="/reviews?type=new">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <Sparkles className="h-3 w-3" />
              {t('newSubmissions')}
            </Button>
          </Link>
          <Link href="/reviews?type=revision">
            <Button
              variant="outline"
              size="sm"
              className="gap-1"
            >
              <RefreshCw className="h-3 w-3" />
              {t('revisionRequests')}
            </Button>
          </Link>
          <Link href="/reviews/photos">
            <Button
              variant="default"
              size="sm"
              className="gap-1"
            >
              <ImageIcon className="h-3 w-3" />
              {tPhotos('photos') || 'Photos'}
            </Button>
          </Link>
        </div>

        <PendingPhotosList locale={locale} />
      </main>

      <Footer />
    </div>
  )
}
