import Link from 'next/link'
import { SpeciesCard } from '@/components/species/SpeciesCard'

export interface RecentSpecies {
  id: string
  slug: string
  scientificName: string
  commonNames: string[]
  stratum: string
  successionalStage: string
  imageUrl: string | null
  publishedAt: Date | null
}

export interface RecentlyAddedSectionProps {
  species: RecentSpecies[]
  labels: {
    title: string
    description: string
    viewAll: string
  }
}

export function RecentlyAddedSection({ species, labels }: RecentlyAddedSectionProps) {
  if (species.length === 0) {
    return null
  }

  return (
    <section className="bg-white py-16 sm:py-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {labels.title}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {labels.description}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {species.map((s) => (
            <SpeciesCard
              key={s.id}
              slug={s.slug}
              scientificName={s.scientificName}
              commonNames={s.commonNames}
              stratum={s.stratum}
              successionalStage={s.successionalStage}
              imageUrl={s.imageUrl || '/placeholder-species.jpg'}
            />
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/catalog"
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            {labels.viewAll}
          </Link>
        </div>
      </div>
    </section>
  )
}
