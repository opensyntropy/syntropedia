import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export interface SpeciesCardProps {
  slug: string
  scientificName: string
  commonNames: string[]
  stratum: string
  successionalStage: string
  imageUrl?: string
}

const stratumColors: Record<string, string> = {
  EMERGENT: 'bg-green-100 text-green-700 hover:bg-green-200',
  CANOPY: 'bg-green-100 text-green-700 hover:bg-green-200',
  SUBCANOPY: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
  UNDERSTORY: 'bg-lime-100 text-lime-700 hover:bg-lime-200',
  GROUND_COVER: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200',
}

const successionalStageColors: Record<string, string> = {
  PIONEER: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  EARLY_SECONDARY: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
  LATE_SECONDARY: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  CLIMAX: 'bg-violet-100 text-violet-700 hover:bg-violet-200',
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
            <Badge
              variant="secondary"
              className={`rounded-full text-xs font-medium ${stratumColors[stratum] || 'bg-gray-100 text-gray-700'}`}
            >
              {stratumLabels[stratum] || stratum}
            </Badge>
            <Badge
              variant="secondary"
              className={`rounded-full text-xs font-medium ${successionalStageColors[successionalStage] || 'bg-gray-100 text-gray-700'}`}
            >
              {successionalStageLabels[successionalStage] || successionalStage}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
