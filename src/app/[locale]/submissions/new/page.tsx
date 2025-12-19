import { redirect } from 'next/navigation'
import { getSession } from '@/lib/auth/server'
import { getTranslations } from '@/lib/getTranslations'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { SpeciesForm } from '@/components/submissions/SpeciesForm'

interface NewSubmissionPageProps {
  params: Promise<{ locale: string }>
}

export default async function NewSubmissionPage({ params }: NewSubmissionPageProps) {
  const session = await getSession()

  if (!session?.user) {
    redirect('/auth/signin?callbackUrl=/submissions/new')
  }

  const { locale } = await params
  const t = await getTranslations(locale, 'submissions')

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1 container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold">{t('submitNewSpecies')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('submitDescription')}
          </p>
        </div>

        <SpeciesForm mode="create" locale={locale} />
      </main>

      <Footer />
    </div>
  )
}
