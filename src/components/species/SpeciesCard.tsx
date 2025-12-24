import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent } from '@/components/ui/card'

export interface SpeciesCardProps {
  slug: string
  scientificName: string
  commonNames: string[]
  stratum: string
  successionalStage: string
  imageUrl?: string
}

const stratumLabels: Record<string, string> = {
  EMERGENT: 'Emergent',
  CANOPY: 'Canopy',
  SUBCANOPY: 'Subcanopy',
  UNDERSTORY: 'Understory',
  GROUND_COVER: 'Ground Cover',
}

const successionalStageLabels: Record<string, string> = {
  PIONEER: 'Pioneer',
  EARLY_SECONDARY: 'Early Secondary',
  LATE_SECONDARY: 'Late Secondary',
  CLIMAX: 'Climax',
}

export function SpeciesCard({
  slug,
  scientificName,
  commonNames,
  stratum,
  successionalStage,
  imageUrl = '/placeholder-species.jpg',
}: SpeciesCardProps) {
  return (
    <Link href={`/species/${slug}`}>
      <Card className="group overflow-hidden rounded-lg border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-lifted">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={scientificName}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <CardContent className="p-5">
          {/* Scientific Name */}
          <h3 className="mb-2 text-lg font-semibold italic text-gray-900">
            {scientificName}
          </h3>

          {/* Common Names */}
          {commonNames.length > 0 && (
            <p className="mb-4 text-sm text-gray-600">
              {commonNames.slice(0, 3).join(', ')}
              {commonNames.length > 3 && '...'}
            </p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className="badge-gradient-hover">
              {stratumLabels[stratum] || stratum}
            </span>
            <span className="badge-gradient-hover">
              {successionalStageLabels[successionalStage] || successionalStage}
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
