'use client'

import { X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { type SpeciesFilters, type Stratum, type SuccessionalStage, type LifeCycle } from '@/types/species'
import { useTranslations } from '@/lib/IntlProvider'

interface FilterSidebarProps {
  filters: SpeciesFilters
  onFilterChange: (filters: SpeciesFilters) => void
}

const stratumOptions: { value: Stratum; color: string }[] = [
  { value: 'EMERGENT', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { value: 'CANOPY', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { value: 'SUBCANOPY', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
  { value: 'UNDERSTORY', color: 'bg-lime-100 text-lime-700 hover:bg-lime-200' },
  { value: 'GROUND_COVER', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
]

const successionalStageOptions: { value: SuccessionalStage; color: string }[] = [
  { value: 'PIONEER', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { value: 'EARLY_SECONDARY', color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' },
  { value: 'LATE_SECONDARY', color: 'bg-purple-100 text-purple-700 hover:bg-purple-200' },
  { value: 'CLIMAX', color: 'bg-violet-100 text-violet-700 hover:bg-violet-200' },
]

const lifeCycleOptions: { value: LifeCycle; color: string }[] = [
  { value: 'ANNUAL', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  { value: 'BIENNIAL', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
  { value: 'PERENNIAL', color: 'bg-teal-100 text-teal-700 hover:bg-teal-200' },
]

export function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const tCatalog = useTranslations('catalog')
  const tStratum = useTranslations('stratum')
  const tStage = useTranslations('successionalStage')
  const tLifeCycle = useTranslations('lifeCycle')

  const toggleFilter = <T extends string>(
    filterKey: keyof SpeciesFilters,
    value: T
  ) => {
    const currentValues = (filters[filterKey] as T[]) || []
    const newValues = currentValues.includes(value)
      ? currentValues.filter(v => v !== value)
      : [...currentValues, value]

    onFilterChange({
      ...filters,
      [filterKey]: newValues.length > 0 ? newValues : undefined,
    })
  }

  const clearAllFilters = () => {
    onFilterChange({})
  }

  const activeFiltersCount =
    (filters.stratum?.length || 0) +
    (filters.successionalStage?.length || 0) +
    (filters.lifeCycle?.length || 0)

  return (
    <div className="lg:sticky lg:top-24 lg:h-fit">
      <Card className="border-gray-200">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold">{tCatalog('filters')}</CardTitle>
          {activeFiltersCount > 0 && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-sm text-gray-600 transition-colors hover:text-gray-900"
            >
              <X className="h-4 w-4" />
              {tCatalog('clearFilters').replace('{count}', String(activeFiltersCount))}
            </button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Stratum Filter */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">{tCatalog('stratum')}</h3>
            <div className="flex flex-wrap gap-2">
              {stratumOptions.map(option => (
                <Badge
                  key={option.value}
                  className={`cursor-pointer rounded-full border-2 transition-all ${
                    filters.stratum?.includes(option.value)
                      ? option.color + ' border-current'
                      : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => toggleFilter('stratum', option.value)}
                >
                  {tStratum(option.value)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Successional Stage Filter */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">
              {tCatalog('successionalStage')}
            </h3>
            <div className="flex flex-wrap gap-2">
              {successionalStageOptions.map(option => (
                <Badge
                  key={option.value}
                  className={`cursor-pointer rounded-full border-2 transition-all ${
                    filters.successionalStage?.includes(option.value)
                      ? option.color + ' border-current'
                      : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => toggleFilter('successionalStage', option.value)}
                >
                  {tStage(option.value)}
                </Badge>
              ))}
            </div>
          </div>

          {/* Life Cycle Filter */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">{tCatalog('lifeCycle')}</h3>
            <div className="flex flex-wrap gap-2">
              {lifeCycleOptions.map(option => (
                <Badge
                  key={option.value}
                  className={`cursor-pointer rounded-full border-2 transition-all ${
                    filters.lifeCycle?.includes(option.value)
                      ? option.color + ' border-current'
                      : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                  onClick={() => toggleFilter('lifeCycle', option.value)}
                >
                  {tLifeCycle(option.value)}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
