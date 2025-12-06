import { Header } from '@/components/layout/Header'
import { Hero } from '@/components/layout/Hero'
import { Statistics } from '@/components/layout/Statistics'
import { Footer } from '@/components/layout/Footer'
import { SpeciesCard, type SpeciesCardProps } from '@/components/especies/SpeciesCard'

// Mock data for featured species (will be replaced with actual database queries)
const featuredSpecies: SpeciesCardProps[] = [
  {
    slug: 'jatoba-hymenaea-courbaril',
    nomeCientifico: 'Hymenaea courbaril',
    nomesPopulares: ['Jatobá', 'Jataí', 'Jutaí'],
    estrato: 'EMERGENTE',
    estagioSucessional: 'CLIMAX',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop',
  },
  {
    slug: 'banana-musa-paradisiaca',
    nomeCientifico: 'Musa × paradisiaca',
    nomesPopulares: ['Banana', 'Bananeira'],
    estrato: 'MEDIO',
    estagioSucessional: 'PIONEIRA',
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&h=600&fit=crop',
  },
  {
    slug: 'palmito-euterpe-edulis',
    nomeCientifico: 'Euterpe edulis',
    nomesPopulares: ['Palmito-juçara', 'Juçara', 'Ripeira'],
    estrato: 'ALTO',
    estagioSucessional: 'SECUNDARIA_TARDIA',
    imageUrl: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=800&h=600&fit=crop',
  },
  {
    slug: 'cafe-coffea-arabica',
    nomeCientifico: 'Coffea arabica',
    nomesPopulares: ['Café', 'Cafeeiro'],
    estrato: 'BAIXO',
    estagioSucessional: 'SECUNDARIA_INICIAL',
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop',
  },
  {
    slug: 'acerola-malpighia-emarginata',
    nomeCientifico: 'Malpighia emarginata',
    nomesPopulares: ['Acerola', 'Cereja-das-antilhas'],
    estrato: 'BAIXO',
    estagioSucessional: 'PIONEIRA',
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&h=600&fit=crop',
  },
  {
    slug: 'inga-inga-edulis',
    nomeCientifico: 'Inga edulis',
    nomesPopulares: ['Ingá', 'Ingá-de-metro', 'Ingá-cipó'],
    estrato: 'MEDIO',
    estagioSucessional: 'PIONEIRA',
    imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop',
  },
]

export default function HomePage() {
  // Mock statistics (will be replaced with actual database queries)
  const stats = {
    speciesCount: 6,
    photosCount: 24,
    contributorsCount: 12,
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1">
        <Hero />

        {/* Featured Species Section */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-6 lg:px-12">
            <div className="mb-12 text-center">
              <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl">
                Espécies em Destaque
              </h2>
              <p className="mx-auto max-w-2xl text-gray-600">
                Conheça algumas das espécies catalogadas em nossa base de dados
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
                  O que é Syntropedia?
                </h2>
                <div className="space-y-4 text-gray-600">
                  <p>
                    A Syntropedia é uma plataforma open-source que reúne conhecimento sobre
                    espécies vegetais para sistemas agroflorestais e agricultura sintrópica.
                  </p>
                  <p>
                    Nossa comunidade documenta, compartilha e aprende sobre plantas que transformam
                    a agricultura, promovendo práticas regenerativas e sustentáveis.
                  </p>
                  <p>
                    Todos os dados são licenciados sob Creative Commons, garantindo acesso livre
                    ao conhecimento para agricultores, pesquisadores e entusiastas.
                  </p>
                </div>
                <a
                  href="/sobre"
                  className="mt-6 inline-flex items-center text-primary-600 transition-colors hover:text-primary-700 hover:underline"
                >
                  Saiba mais sobre o projeto →
                </a>
              </div>

              {/* How to Contribute */}
              <div className="rounded-xl bg-gradient-to-br from-primary-50 to-emerald-50 p-8 shadow-sm sm:p-10">
                <h2 className="mb-6 text-2xl font-bold text-gray-900">
                  Como Contribuir?
                </h2>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white">
                      1
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-gray-900">Faça login</h3>
                      <p className="text-sm text-gray-700">
                        Conecte-se via fórum Discourse para começar a contribuir
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white">
                      2
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-gray-900">Adicione fotos</h3>
                      <p className="text-sm text-gray-700">
                        Contribua com imagens das espécies que você conhece
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary-600 text-lg font-bold text-white">
                      3
                    </div>
                    <div>
                      <h3 className="mb-1 font-semibold text-gray-900">Participe</h3>
                      <p className="text-sm text-gray-700">
                        Discuta, compartilhe experiências e aprenda com a comunidade
                      </p>
                    </div>
                  </div>
                </div>

                <a
                  href="/login"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-xl bg-primary-600 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-primary-700 hover:shadow-lg sm:w-auto"
                >
                  Começar a Contribuir →
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
