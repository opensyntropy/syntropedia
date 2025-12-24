'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Card } from '@/components/ui/card'
import { TreeDeciduous, Clock, Apple } from 'lucide-react'
import { type SpeciesListItem } from '@/types/species'
import { useTranslations } from '@/lib/IntlProvider'

interface SpeciesTableProps {
  species: SpeciesListItem[]
}

export function SpeciesTable({ species }: SpeciesTableProps) {
  const params = useParams()
  const locale = params.locale as string
  const t = useTranslations('catalog')
  const tStratum = useTranslations('stratum')
  const tStage = useTranslations('successionalStage')
  const tLifeCycle = useTranslations('lifeCycle')

  if (species.length === 0) {
    return (
      <Card className="flex h-64 items-center justify-center border-gray-200">
        <div className="text-center">
          <p className="text-lg font-medium text-gray-900">
            {t('noSpeciesFound')}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {t('tryAdjustingFilters')}
          </p>
        </div>
      </Card>
    )
  }

  return (
    <div className="space-y-4">
      {/* Table Rows */}
      <div className="space-y-3">
        {species.map(specie => (
          <Link
            key={specie.id}
            href={`/species/${specie.slug}`}
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
                  {(specie.heightMeters || specie.canopyWidthMeters) && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <TreeDeciduous className="h-3.5 w-3.5" />
                      <div className="flex gap-3">
                        {specie.heightMeters && (
                          <span>
                            {t('heightLabel')}: {specie.heightMeters}m
                          </span>
                        )}
                        {specie.canopyWidthMeters && (
                          <span>
                            {t('widthLabel')}: {specie.canopyWidthMeters}m
                          </span>
                        )}
                      </div>
                    </div>
                  )}
                  {(specie.lifeCycleYearsStart || specie.lifeCycleYearsEnd) && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3.5 w-3.5" />
                      <span>
                        {specie.lifeCycleYearsStart && specie.lifeCycleYearsEnd
                          ? `${specie.lifeCycleYearsStart}-${specie.lifeCycleYearsEnd}`
                          : specie.lifeCycleYearsStart || specie.lifeCycleYearsEnd} {t('years')}
                      </span>
                    </div>
                  )}
                  {(specie.fruitingAgeStart || specie.fruitingAgeEnd) && (
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Apple className="h-3.5 w-3.5" />
                      <span>
                        {t('fruitsAt')}: {specie.fruitingAgeStart && specie.fruitingAgeEnd
                          ? `${specie.fruitingAgeStart}-${specie.fruitingAgeEnd}`
                          : specie.fruitingAgeStart || specie.fruitingAgeEnd} {t('years')}
                      </span>
                    </div>
                  )}
                </div>

                {/* Badges - Mobile stacked, Desktop grid */}
                <div className="flex flex-wrap gap-2 lg:block lg:space-y-1">
                  <div className="lg:hidden">
                    <span className="text-xs font-medium text-gray-500">{t('stratum')}:</span>
                  </div>
                  <span className="badge-gradient">
                    {tStratum(specie.stratum)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 lg:block lg:space-y-1">
                  <div className="lg:hidden">
                    <span className="text-xs font-medium text-gray-500">{t('stage')}:</span>
                  </div>
                  <span className="badge-gradient">
                    {tStage(specie.successionalStage)}
                  </span>
                </div>

                {specie.lifeCycle && (
                  <div className="flex flex-wrap gap-2 lg:block lg:space-y-1">
                    <div className="lg:hidden">
                      <span className="text-xs font-medium text-gray-500">{t('lifeCycle')}:</span>
                    </div>
                    <span className="badge-gradient">
                      {tLifeCycle(specie.lifeCycle)}
                    </span>
                  </div>
                )}
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}
