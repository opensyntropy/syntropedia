import { Header } from '@/components/layout/Header'
import { Hero } from '@/components/layout/Hero'
import { Statistics } from '@/components/layout/Statistics'
import { Footer } from '@/components/layout/Footer'
import { SpeciesCard } from '@/components/species/SpeciesCard'
import { RecentlyAddedSection } from '@/components/home/RecentlyAddedSection'
import { CommunityHighlights } from '@/components/home/CommunityHighlights'
import { getTranslations } from '@/lib/getTranslations'
import {
  getHomeStats,
  getFeaturedSpecies,
  getRecentlyPublished,
  getTopContributors,
} from '@/lib/services/home'

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params

  // Fetch real data
  const [stats, featuredSpecies, recentSpecies, topContributors] = await Promise.all([
    getHomeStats(),
    getFeaturedSpecies(6),
    getRecentlyPublished(4),
    getTopContributors(3),
  ])

  // Get translations
  const tHome = await getTranslations(locale, 'home')
  const tSearch = await getTranslations(locale, 'search')
  const tCatalog = await getTranslations(locale, 'catalog')
  const tStratum = await getTranslations(locale, 'stratum')
  const tFooter = await getTranslations(locale, 'footer')

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
          locale={locale}
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
        {featuredSpecies.length > 0 && (
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
                  <SpeciesCard
                    key={species.id}
                    slug={species.slug}
                    scientificName={species.scientificName}
                    commonNames={species.commonNames}
                    stratum={species.stratum}
                    successionalStage={species.successionalStage}
                    imageUrl={species.imageUrl || '/placeholder-species.jpg'}
                  />
                ))}
              </div>
            </div>
          </section>
        )}

        <Statistics
          speciesCount={stats.speciesCount}
          photosCount={stats.photosCount}
          contributorsCount={stats.contributorsCount}
          labels={{
            species: tHome('statistics.species'),
            photos: tHome('statistics.photos'),
            contributors: tHome('statistics.contributors'),
          }}
        />

        <RecentlyAddedSection
          species={recentSpecies}
          labels={{
            title: tHome('recentlyAdded.title'),
            description: tHome('recentlyAdded.description'),
            viewAll: tHome('recentlyAdded.viewAll'),
          }}
        />

        <CommunityHighlights
          contributors={topContributors}
          labels={{
            title: tHome('community.title'),
            description: tHome('community.description'),
            speciesPublished: tHome('community.speciesPublished'),
            viewLeaderboard: tHome('community.viewLeaderboard'),
          }}
        />

        {/* Participate CTA Section */}
        <section className="bg-gradient-to-br from-primary-500 to-syntropy-400 py-16 sm:py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mx-auto max-w-3xl text-center">
              <h2 className="mb-4 text-3xl font-bold text-white sm:text-4xl">
                {tHome('participate.title')}
              </h2>
              <p className="mb-8 text-lg text-white/80">
                {tHome('participate.description')}
              </p>

              <a
                href="/participate"
                className="inline-flex items-center justify-center rounded-xl bg-white px-8 py-3 font-semibold text-primary-500 shadow-lg transition-all hover:bg-gray-50 hover:shadow-xl"
              >
                {tHome('participate.cta')}
              </a>
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
