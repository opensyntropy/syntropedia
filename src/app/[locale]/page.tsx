import { Header } from '@/components/layout/Header'
import { Hero } from '@/components/layout/Hero'
import { Statistics } from '@/components/layout/Statistics'
import { Footer } from '@/components/layout/Footer'
import { SpeciesCard, type SpeciesCardProps } from '@/components/species/SpeciesCard'
import { getTranslations } from '@/lib/getTranslations'

// Mock data for featured species (will be replaced with actual database queries)
const featuredSpecies: SpeciesCardProps[] = [
  {
    slug: 'jatoba-hymenaea-courbaril',
    scientificName: 'Hymenaea courbaril',
    commonNames: ['Jatobá', 'Jataí', 'Jutaí'],
    stratum: 'EMERGENT',
    successionalStage: 'CLIMAX',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop',
  },
  {
    slug: 'banana-musa-paradisiaca',
    scientificName: 'Musa × paradisiaca',
    commonNames: ['Banana', 'Bananeira'],
    stratum: 'SUBCANOPY',
    successionalStage: 'PIONEER',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&h=600&fit=crop',
  },
  {
    slug: 'palmito-euterpe-edulis',
    scientificName: 'Euterpe edulis',
    commonNames: ['Palmito-juçara', 'Juçara', 'Ripeira'],
    stratum: 'CANOPY',
    successionalStage: 'LATE_SECONDARY',
    imageUrl: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=800&h=600&fit=crop',
  },
  {
    slug: 'cafe-coffea-arabica',
    scientificName: 'Coffea arabica',
    commonNames: ['Café', 'Cafeeiro'],
    stratum: 'UNDERSTORY',
    successionalStage: 'EARLY_SECONDARY',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop',
  },
  {
    slug: 'acerola-malpighia-emarginata',
    scientificName: 'Malpighia emarginata',
    commonNames: ['Acerola', 'Cereja-das-antilhas'],
    stratum: 'UNDERSTORY',
    successionalStage: 'PIONEER',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&h=600&fit=crop',
  },
  {
    slug: 'inga-inga-edulis',
    scientificName: 'Inga edulis',
    commonNames: ['Ingá', 'Ingá-de-metro', 'Ingá-cipó'],
    stratum: 'SUBCANOPY',
    successionalStage: 'PIONEER',
    imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop',
  },
]

export default async function HomePage({ params }: { params: { locale: string } }) {
  // Mock statistics (will be replaced with actual database queries)
  const stats = {
    speciesCount: 6,
    photosCount: 24,
    contributorsCount: 12,
  }

  // Get translations
  const tHome = await getTranslations(params.locale, 'home')
  const tSearch = await getTranslations(params.locale, 'search')
  const tCatalog = await getTranslations(params.locale, 'catalog')
  const tStratum = await getTranslations(params.locale, 'stratum')

  // Get all stratum translations
  const stratumTranslations: Record<string, string> = {
    EMERGENT: tStratum('EMERGENT'),
    CANOPY: tStratum('CANOPY'),
    SUBCANOPY: tStratum('SUBCANOPY'),
    UNDERSTORY: tStratum('UNDERSTORY'),
    GROUND_COVER: tStratum('GROUND_COVER'),
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <Hero
          locale={params.locale}
          translations={{
            title: tHome('hero.title'),
            subtitle: tHome('hero.subtitle'),
            searchPlaceholder: tSearch('placeholder'),
            exploreCatalog: tHome('hero.exploreCatalog'),
            learnMore: tHome('hero.learnMore'),
          }}
          searchTranslations={{
            noResults: tSearch('noResults'),
            noResultsHint: tSearch('noResultsHint'),
            viewAllResults: tSearch('viewAllResults'),
            catalog: tCatalog('title'),
            edibleFruit: tCatalog('edibleFruit'),
            stratum: stratumTranslations,
          }}
        />

        {/* Featured Species Section */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                {tHome('featured.title')}
              </h2>
              <p className="mx-auto max-w-2xl text-gray-600">
                {tHome('featured.description')}
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featuredSpecies.map((species) => (
                <SpeciesCard key={species.slug} {...species} />
              ))}
            </div>
          </div>
        </section>

        <Statistics {...stats} />

        {/* About + CTA Section */}
        <section className="py-16 sm:py-24">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
              {/* About */}
              <div>
                <h2 className="mb-6 text-3xl font-bold text-gray-900">
                  {tHome('about.title')}
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>{tHome('about.p1')}</p>
                  <p>{tHome('about.p2')}</p>
                  <p>{tHome('about.p3')}</p>
                </div>
                <a
                  href="/sobre"
                  className="mt-6 inline-flex items-center text-primary-600 transition-colors hover:text-primary-700 hover:underline"
                >
                  {tHome('about.learnMore')}
                </a>
              </div>

              {/* How to Contribute */}
              <div className="rounded-xl bg-gradient-to-br from-primary-50 to-emerald-50 p-8 shadow-sm sm:p-10">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  {tHome('contribute.title')}
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white">
                      1
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-gray-900">
                        {tHome('contribute.step1.title')}
                      </h3>
                      <p className="text-sm text-gray-700">
                        {tHome('contribute.step1.description')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white">
                      2
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-gray-900">
                        {tHome('contribute.step2.title')}
                      </h3>
                      <p className="text-sm text-gray-700">
                        {tHome('contribute.step2.description')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white">
                      3
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-gray-900">
                        {tHome('contribute.step3.title')}
                      </h3>
                      <p className="text-sm text-gray-700">
                        {tHome('contribute.step3.description')}
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href="/auth/signin"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg sm:w-auto"
                >
                  {tHome('contribute.cta')}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
