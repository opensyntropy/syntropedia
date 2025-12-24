import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getTranslations } from '@/lib/getTranslations'
import prisma from '@/lib/prisma'
import Link from 'next/link'
import { Sprout, Users, CheckCircle, BookOpen, Camera, Award, AlertCircle } from 'lucide-react'

async function getStats() {
  const [speciesCount, contributorsCount, reviewsCount] = await Promise.all([
    prisma.species.count({ where: { status: 'PUBLISHED' } }),
    prisma.user.count({ where: { speciesCreated: { some: {} } } }),
    prisma.speciesReview.count(),
  ])
  return { speciesCount, contributorsCount, reviewsCount }
}

export default async function ContributePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations(locale, 'contributePage')
  const tFooter = await getTranslations(locale, 'footer')
  const stats = await getStats()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-primary-50 via-syntropy-50 to-white py-20 sm:py-28">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl">
                {t('hero.title')}
              </h1>
              <p className="mb-8 text-lg text-gray-600 sm:text-xl">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/contributions/new"
                  className="inline-flex items-center justify-center rounded-full bg-primary-600 px-8 py-3 font-semibold text-white shadow-lg transition-all hover:bg-primary-700 hover:shadow-xl"
                >
                  <Sprout className="mr-2 h-5 w-5" />
                  {t('hero.cta')}
                </Link>
                <Link
                  href="/contributions"
                  className="inline-flex items-center justify-center rounded-full border-2 border-primary-600 px-8 py-3 font-semibold text-primary-600 transition-all hover:bg-primary-50"
                >
                  {t('hero.myContributions')}
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-6 text-3xl font-bold text-gray-900">
                {t('mission.title')}
              </h2>
              <p className="mb-8 text-lg text-gray-600">
                {t('mission.description')}
              </p>
              <div className="grid gap-6 sm:grid-cols-3">
                <div className="rounded-xl bg-gray-50 p-6">
                  <BookOpen className="mx-auto mb-4 h-10 w-10 text-primary-600" />
                  <h3 className="mb-2 font-semibold text-gray-900">{t('mission.open.title')}</h3>
                  <p className="text-sm text-gray-600">{t('mission.open.description')}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-6">
                  <Users className="mx-auto mb-4 h-10 w-10 text-primary-600" />
                  <h3 className="mb-2 font-semibold text-gray-900">{t('mission.community.title')}</h3>
                  <p className="text-sm text-gray-600">{t('mission.community.description')}</p>
                </div>
                <div className="rounded-xl bg-gray-50 p-6">
                  <CheckCircle className="mx-auto mb-4 h-10 w-10 text-primary-600" />
                  <h3 className="mb-2 font-semibold text-gray-900">{t('mission.verified.title')}</h3>
                  <p className="text-sm text-gray-600">{t('mission.verified.description')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Community Stats */}
        <section className="border-y border-gray-100 bg-gradient-to-b from-gray-50 to-white py-16">
          <div className="container mx-auto px-6 lg:px-12">
            <h2 className="mb-10 text-center text-2xl font-bold text-gray-900">
              {t('stats.title')}
            </h2>
            <div className="grid gap-8 sm:grid-cols-3">
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-primary-600 sm:text-5xl">
                  {stats.speciesCount}
                </div>
                <div className="text-sm font-medium uppercase tracking-wide text-gray-600">
                  {t('stats.species')}
                </div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-primary-600 sm:text-5xl">
                  {stats.contributorsCount}
                </div>
                <div className="text-sm font-medium uppercase tracking-wide text-gray-600">
                  {t('stats.contributors')}
                </div>
              </div>
              <div className="text-center">
                <div className="mb-2 text-4xl font-bold text-primary-600 sm:text-5xl">
                  {stats.reviewsCount}
                </div>
                <div className="text-sm font-medium uppercase tracking-wide text-gray-600">
                  {t('stats.reviews')}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Ways to Participate */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <h2 className="mb-12 text-center text-3xl font-bold text-gray-900">
              {t('participate.title')}
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {/* Share Knowledge */}
              <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                  <Sprout className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {t('participate.share.title')}
                </h3>
                <p className="mb-6 text-gray-600">
                  {t('participate.share.description')}
                </p>
                <Link
                  href="/contributions/new"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {t('participate.share.cta')} &rarr;
                </Link>
              </div>

              {/* Add Photos */}
              <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                  <Camera className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {t('participate.photos.title')}
                </h3>
                <p className="mb-6 text-gray-600">
                  {t('participate.photos.description')}
                </p>
                <Link
                  href="/catalog"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {t('participate.photos.cta')} &rarr;
                </Link>
              </div>

              {/* Become a Reviewer */}
              <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary-100">
                  <Award className="h-6 w-6 text-primary-600" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {t('participate.review.title')}
                </h3>
                <p className="mb-6 text-gray-600">
                  {t('participate.review.description')}
                </p>
                <Link
                  href="/become-reviewer"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {t('participate.review.cta')} &rarr;
                </Link>
              </div>

              {/* Report Errors */}
              <div className="rounded-xl border border-gray-100 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                  <AlertCircle className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  {t('participate.report.title')}
                </h3>
                <p className="mb-6 text-gray-600">
                  {t('participate.report.description')}
                </p>
                <Link
                  href="/catalog"
                  className="text-sm font-medium text-primary-600 hover:text-primary-700 hover:underline"
                >
                  {t('participate.report.cta')} &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* OpenSyntropy Ecosystem Section */}
        <section className="border-t border-primary-100 bg-gradient-to-br from-syntropy-50 via-primary-50 to-syntropy-100 py-16 sm:py-24">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mx-auto max-w-4xl">
              <div className="mb-12 text-center">
                <span className="mb-4 inline-block rounded-full bg-primary-100 px-4 py-1.5 text-sm font-medium text-primary-700">
                  OpenSyntropy Ecosystem
                </span>
                <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                  {t('ecosystem.title')}
                </h2>
                <p className="mx-auto max-w-2xl text-lg text-gray-600">
                  {t('ecosystem.description')}
                </p>
              </div>

              <div className="grid gap-6 sm:grid-cols-3">
                {/* Syntropedia */}
                <div className="relative overflow-hidden rounded-2xl border-2 border-primary-300 bg-white p-6 shadow-lg">
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-primary-100 opacity-50" />
                  <div className="relative">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary-500 text-2xl text-white shadow-md">
                      S
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">Syntropedia</h3>
                    <p className="mb-4 text-sm text-gray-600">
                      {t('ecosystem.syntropedia.description')}
                    </p>
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-100 px-3 py-1 text-xs font-medium text-primary-700">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary-500" />
                      {t('ecosystem.youAreHere')}
                    </span>
                  </div>
                </div>

                {/* Placenta */}
                <a
                  href="https://placenta.opensyntropy.earth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-syntropy-300 hover:shadow-lg"
                >
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-syntropy-100 opacity-0 transition-opacity group-hover:opacity-50" />
                  <div className="relative">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-syntropy-500 text-2xl text-white shadow-md">
                      P
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">Placenta</h3>
                    <p className="mb-4 text-sm text-gray-600">
                      {t('ecosystem.placenta.description')}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-syntropy-600 group-hover:underline">
                      {t('ecosystem.visitForum')} &rarr;
                    </span>
                  </div>
                </a>

                {/* Oasis */}
                <a
                  href="https://oasis.opensyntropy.earth"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-syntropy-300 hover:shadow-lg"
                >
                  <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-syntropy-100 opacity-0 transition-opacity group-hover:opacity-50" />
                  <div className="relative">
                    <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-syntropy-400 to-primary-400 text-2xl text-white shadow-md">
                      O
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-gray-900">Oasis</h3>
                    <p className="mb-4 text-sm text-gray-600">
                      {t('ecosystem.oasis.description')}
                    </p>
                    <span className="inline-flex items-center gap-1.5 text-sm font-medium text-syntropy-600 group-hover:underline">
                      {t('ecosystem.explore')} &rarr;
                    </span>
                  </div>
                </a>
              </div>

              <div className="mt-10 text-center">
                <p className="text-sm text-gray-500">
                  {t('ecosystem.createdBy')}{' '}
                  <a
                    href="https://opensyntropy.earth"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold text-primary-600 hover:underline"
                  >
                    OpenSyntropy
                  </a>
                  {' '}&mdash; {t('ecosystem.tagline')}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="bg-primary-600 py-16 sm:py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-white">
                {t('cta.title')}
              </h2>
              <p className="mb-8 text-lg text-primary-100">
                {t('cta.subtitle')}
              </p>
              <Link
                href="/contributions/new"
                className="inline-flex items-center justify-center rounded-full bg-white px-8 py-3 font-semibold text-primary-600 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
              >
                {t('cta.button')}
              </Link>
            </div>
          </div>
        </section>
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
