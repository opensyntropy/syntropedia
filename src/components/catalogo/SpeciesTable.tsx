'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import { type SpeciesListItem } from '@/types/species'

interface SpeciesTableProps {
  species: SpeciesListItem[]
}

const stratumLabels: Record<string, string> = {
  EMERGENT: 'Emergent',
  CANOPY: 'Canopy',
  SUBCANOPY: 'Subcanopy',
  UNDERSTORY: 'Understory',
  GROUND_COVER: 'Ground Cover',
}

const stratumColors: Record<string, string> = {
  EMERGENT: 'bg-green-100 text-green-700',
  CANOPY: 'bg-green-100 text-green-700',
  SUBCANOPY: 'bg-emerald-100 text-emerald-700',
  UNDERSTORY: 'bg-lime-100 text-lime-700',
  GROUND_COVER: 'bg-yellow-100 text-yellow-700',
}

const successionalStageLabels: Record<string, string> = {
  PIONEER: 'Pioneer',
  EARLY_SECONDARY: 'Early Sec.',
  LATE_SECONDARY: 'Late Sec.',
  CLIMAX: 'Climax',
}

const successionalStageColors: Record<string, string> = {
  PIONEER: 'bg-blue-100 text-blue-700',
  EARLY_SECONDARY: 'bg-indigo-100 text-indigo-700',
  LATE_SECONDARY: 'bg-purple-100 text-purple-700',
  CLIMAX: 'bg-violet-100 text-violet-700',
}

const lifeCycleLabels: Record<string, string> = {
  ANNUAL: 'Annual',
  BIENNIAL: 'Biennial',
  PERENNIAL: 'Perennial',
}

const lifeCycleColors: Record<string, string> = {
  ANNUAL: 'bg-orange-100 text-orange-700',
  BIENNIAL: 'bg-amber-100 text-amber-700',
  PERENNIAL: 'bg-teal-100 text-teal-700',
}

export function SpeciesTable({ species }: SpeciesTableProps) {
  if (species.length === 0) {
    return (
      <Card className="flex h-64 items-center justify-center border-gray-200">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">
            No species found
          </p>
          <p className="mt-1 text-sm text-gray-600">
            Try adjusting the filters to see more results
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Table Header (Desktop) */}
      <div className="hidden rounded-lg bg-white px-6 py-4 shadow-sm lg:block">
        <div className="grid grid-cols-[120px_1fr_140px_140px_120px] gap-4 text-sm font-semibold text-gray-700">
          <div>Image</div>
          <div>Scientific Name</div>
          <div>Stratum</div>
          <div>Stage</div>
          <div>Life Cycle</div>
        </div>
      </div>

      {/* Table Rows */}
      <div className="space-y-3">
        {species.map(specie => (
          <Link
            key={specie.id}
            href={`/especies/${specie.slug}`}
            className="block transition-transform hover:scale-[1.01]"
          >
            <Card className="overflow-hidden border-gray-200 transition-shadow hover:shadow-md">
              <div className="grid gap-4 p-4 lg:grid-cols-[120px_1fr_140px_140px_120px] lg:items-center lg:p-6">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-lg bg-gray-100 lg:aspect-square">
                  <Image
                    src={specie.imageUrl}
                    alt={specie.scientificName}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 120px"
                  />
                </div>

                {/* Content */}
                <div className="space-y-2 lg:space-y-1">
                  <h3 className="text-lg font-semibold italic text-gray-900 lg:text-base">
                    {specie.scientificName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {specie.commonNames.slice(0, 3).join(', ')}
                  </p>
                </div>

                {/* Badges - Mobile stacked, Desktop grid */}
                <div className="flex flex-wrap gap-2 lg:block lg:space-y-1">
                  <div className="lg:hidden">
                    <span className="text-xs font-medium text-gray-500">Stratum:</span>
                  </div>
                  <Badge className={`rounded-full ${stratumColors[specie.stratum]}`}>
                    {stratumLabels[specie.stratum]}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 lg:block lg:space-y-1">
                  <div className="lg:hidden">
                    <span className="text-xs font-medium text-gray-500">Stage:</span>
                  </div>
                  <Badge className={`rounded-full ${successionalStageColors[specie.successionalStage]}`}>
                    {successionalStageLabels[specie.successionalStage]}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2 lg:block lg:space-y-1">
                  <div className="lg:hidden">
                    <span className="text-xs font-medium text-gray-500">Life Cycle:</span>
                  </div>
                  <Badge className={`rounded-full ${lifeCycleColors[specie.lifeCycle]}`}>
                    {lifeCycleLabels[specie.lifeCycle]}
                  </Badge>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
