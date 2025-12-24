import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { getTranslations } from '@/lib/getTranslations'
import Image from 'next/image'
import Link from 'next/link'
import { Leaf, Users, BookOpen, Globe, ArrowRight, Instagram, Linkedin } from 'lucide-react'

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations(locale, 'aboutPage')
  const tFooter = await getTranslations(locale, 'footer')

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-gradient-to-b from-primary-50 to-white py-16 sm:py-24">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mx-auto max-w-3xl text-center">
              <h1 className="mb-6 text-4xl font-bold text-gray-900 sm:text-5xl">
                {t('title')}
              </h1>
              <p className="text-lg text-gray-600 sm:text-xl">
                {t('subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* Mission Section */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-8 text-3xl font-bold text-gray-900">{t('mission.title')}</h2>
              <p className="mb-6 text-lg text-gray-600">
                {t('mission.p1')}
              </p>
              <p className="mb-8 text-lg text-gray-600">
                {t('mission.p2')}
              </p>

              <div className="grid gap-6 sm:grid-cols-2">
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                    <BookOpen className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{t('mission.openKnowledge.title')}</h3>
                  <p className="text-gray-600">
                    {t('mission.openKnowledge.description')}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                    <Users className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{t('mission.communityDriven.title')}</h3>
                  <p className="text-gray-600">
                    {t('mission.communityDriven.description')}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                    <Leaf className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{t('mission.regenerativeFocus.title')}</h3>
                  <p className="text-gray-600">
                    {t('mission.regenerativeFocus.description')}
                  </p>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                  <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary-100">
                    <Globe className="h-6 w-6 text-primary-600" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-gray-900">{t('mission.globalImpact.title')}</h3>
                  <p className="text-gray-600">
                    {t('mission.globalImpact.description')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Founder Section */}
        <section className="bg-gray-50 py-16 sm:py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-12 text-3xl font-bold text-gray-900">{t('founder.title')}</h2>

              <div className="flex flex-col items-center gap-8 sm:flex-row sm:items-start">
                {/* Photo */}
                <div className="flex-shrink-0">
                  <div className="h-48 w-48 overflow-hidden rounded-2xl bg-gradient-to-br from-primary-200 to-syntropy-200 shadow-lg">
                    <Image
                      src="/founder.jpg"
                      alt={t('founder.name')}
                      width={192}
                      height={192}
                      className="h-full w-full object-cover"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="mb-2 text-2xl font-semibold text-gray-900">{t('founder.name')}</h3>
                  <p className="mb-4 text-primary-600 font-medium">{t('founder.role')}</p>
                  <p className="mb-4 text-gray-600">
                    {t('founder.bio1')}
                  </p>
                  <p className="mb-6 text-gray-600">
                    {t('founder.bio2')}
                  </p>

                  {/* Social Links */}
                  <div className="flex items-center gap-4">
                    <a
                      href="https://instagram.com/michel.agrofloresta"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-500 transition-colors hover:text-primary-600"
                      aria-label="Instagram"
                    >
                      <Instagram className="h-5 w-5" />
                      <span className="text-sm">Instagram</span>
                    </a>
                    <a
                      href="https://tiktok.com/@michel.agrofloresta"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-500 transition-colors hover:text-primary-600"
                      aria-label="TikTok"
                    >
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                      </svg>
                      <span className="text-sm">TikTok</span>
                    </a>
                    <a
                      href="https://www.linkedin.com/in/michel-bottan-b5473326/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 text-gray-500 transition-colors hover:text-primary-600"
                      aria-label="LinkedIn"
                    >
                      <Linkedin className="h-5 w-5" />
                      <span className="text-sm">LinkedIn</span>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Oasis Ecosystem Vision */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-8 text-3xl font-bold text-gray-900">{t('oasis.title')}</h2>

              <div className="mb-8 overflow-hidden rounded-2xl bg-gradient-to-br from-syntropy-100 to-primary-100 p-8 sm:p-12">
                <p className="mb-6 text-lg text-gray-700">
                  {t('oasis.p1')}
                </p>
                <p className="mb-6 text-lg text-gray-700">
                  {t('oasis.p2')}
                </p>
                <p className="text-lg text-gray-700">
                  {t('oasis.p3')}
                </p>
              </div>

              <h3 className="mb-6 text-xl font-semibold text-gray-900">{t('oasis.includes')}</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-primary-500 text-white font-bold">
                    S
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t('oasis.syntropedia.name')}</h4>
                    <p className="text-gray-600">{t('oasis.syntropedia.description')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-5">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-syntropy-500 text-white font-bold">
                    P
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t('oasis.placenta.name')}</h4>
                    <p className="text-gray-600">{t('oasis.placenta.description')}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4 rounded-lg border border-gray-200 bg-white p-5 opacity-60">
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-gray-400 text-white font-bold">
                    +
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{t('oasis.moreToCome.name')}</h4>
                    <p className="text-gray-600">{t('oasis.moreToCome.description')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Contribute CTA */}
        <section id="contribute" className="bg-gradient-to-br from-primary-500 to-primary-700 py-16 sm:py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                {t('cta.title')}
              </h2>
              <p className="mb-8 text-lg text-primary-100">
                {t('cta.description')}
              </p>
              <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
                <Link
                  href="/participate"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-8 py-3 font-semibold text-primary-600 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
                >
                  {t('cta.startContributing')}
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <a
                  href="https://github.com/opensyntropy/syntropedia"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border-2 border-white px-8 py-3 font-semibold text-white transition-all hover:bg-white/10"
                >
                  {t('cta.viewOnGitHub')}
                </a>
              </div>
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
