'use client'

import { useState } from 'react'
import { X, Search, ChevronDown } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { MultiSelect } from '@/components/ui/multi-select'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { type SpeciesFilters, type Stratum, type SuccessionalStage, type LifeCycle, type SpecieType, type RegionalBiome, type GlobalBiome, type FoliageType, type GrowthRate, type PlantUse } from '@/types/species'
import { useTranslations } from '@/lib/IntlProvider'
import { cn } from '@/lib/utils'

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

const specieTypeOptions: { value: SpecieType; color: string }[] = [
  { value: 'TREE', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { value: 'SHRUB', color: 'bg-lime-100 text-lime-700 hover:bg-lime-200' },
  { value: 'VINE', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
  { value: 'PALM', color: 'bg-teal-100 text-teal-700 hover:bg-teal-200' },
  { value: 'GRASS', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
  { value: 'HERB', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
  { value: 'FERN', color: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200' },
]

const regionalBiomeOptions: { value: RegionalBiome; color: string }[] = [
  // Tropical
  { value: 'AMAZON', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { value: 'ATLANTIC_FOREST', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
  { value: 'TROPICAL_RAINFOREST', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { value: 'TROPICAL_DRY_FOREST', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
  { value: 'TROPICAL_SAVANNA', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
  { value: 'CERRADO', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
  { value: 'CAATINGA', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  { value: 'PANTANAL', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { value: 'MANGROVE', color: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200' },
  // Subtropical
  { value: 'SUBTROPICAL_FOREST', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
  { value: 'SUBTROPICAL_GRASSLAND', color: 'bg-lime-100 text-lime-700 hover:bg-lime-200' },
  // Temperate
  { value: 'TEMPERATE_FOREST', color: 'bg-teal-100 text-teal-700 hover:bg-teal-200' },
  { value: 'TEMPERATE_GRASSLAND', color: 'bg-lime-100 text-lime-700 hover:bg-lime-200' },
  { value: 'PAMPA', color: 'bg-lime-100 text-lime-700 hover:bg-lime-200' },
  { value: 'MEDITERRANEAN', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  { value: 'CHAPARRAL', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
  // Boreal
  { value: 'BOREAL_FOREST', color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' },
  { value: 'TAIGA', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  // Cold
  { value: 'TUNDRA', color: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
  { value: 'ALPINE', color: 'bg-gray-100 text-gray-700 hover:bg-gray-200' },
  // Arid
  { value: 'DESERT', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
  { value: 'SEMI_ARID', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
]

const globalBiomeOptions: { value: GlobalBiome; color: string }[] = [
  { value: 'TROPICAL_RAINFOREST', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { value: 'TROPICAL_DRY_FOREST', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
  { value: 'TROPICAL_SAVANNA', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
  { value: 'SUBTROPICAL_FOREST', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
  { value: 'TEMPERATE_FOREST', color: 'bg-teal-100 text-teal-700 hover:bg-teal-200' },
  { value: 'TEMPERATE_GRASSLAND', color: 'bg-lime-100 text-lime-700 hover:bg-lime-200' },
  { value: 'MEDITERRANEAN', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  { value: 'DESERT', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
  { value: 'MANGROVE', color: 'bg-cyan-100 text-cyan-700 hover:bg-cyan-200' },
]

const foliageTypeOptions: { value: FoliageType; color: string }[] = [
  { value: 'EVERGREEN', color: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
  { value: 'SEMI_EVERGREEN', color: 'bg-teal-100 text-teal-700 hover:bg-teal-200' },
  { value: 'DECIDUOUS', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
  { value: 'SEMI_DECIDUOUS', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
]

const growthRateOptions: { value: GrowthRate; color: string }[] = [
  { value: 'VERY_FAST', color: 'bg-red-100 text-red-700 hover:bg-red-200' },
  { value: 'FAST', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
  { value: 'MEDIUM', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
  { value: 'SLOW', color: 'bg-blue-100 text-blue-700 hover:bg-blue-200' },
  { value: 'VERY_SLOW', color: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200' },
]

const plantUseOptions: { value: PlantUse; color: string }[] = [
  { value: 'HUMAN_FOOD', color: 'bg-green-100 text-green-700 hover:bg-green-200' },
  { value: 'ANIMAL_FOOD', color: 'bg-lime-100 text-lime-700 hover:bg-lime-200' },
  { value: 'TIMBER', color: 'bg-amber-100 text-amber-700 hover:bg-amber-200' },
  { value: 'MEDICINAL', color: 'bg-rose-100 text-rose-700 hover:bg-rose-200' },
  { value: 'ORNAMENTAL', color: 'bg-pink-100 text-pink-700 hover:bg-pink-200' },
  { value: 'SHADE', color: 'bg-slate-100 text-slate-700 hover:bg-slate-200' },
  { value: 'HONEY', color: 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' },
  { value: 'FIREWOOD', color: 'bg-orange-100 text-orange-700 hover:bg-orange-200' },
]

export function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const tCatalog = useTranslations('catalog')
  const tStratum = useTranslations('stratum')
  const tStage = useTranslations('successionalStage')
  const tLifeCycle = useTranslations('lifeCycle')
  const tSpecieType = useTranslations('specieType')
  const tRegionalBiome = useTranslations('regionalBiome')
  const tGlobalBiome = useTranslations('globalBiome')
  const tFoliage = useTranslations('foliageType')
  const tGrowth = useTranslations('growthRate')
  const tUse = useTranslations('plantUse')

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['stratum', 'successionalStage', 'specieType'])
  )

  const toggleSection = (section: string, open: boolean) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      open ? next.add(section) : next.delete(section)
      return next
    })
  }

  const allSections = ['stratum', 'successionalStage', 'lifeCycle', 'specieType',
                       'regionalBiome', 'globalBiome', 'foliageType', 'growthRate',
                       'uses', 'characteristics']

  const toggleAll = () => {
    if (expandedSections.size >= allSections.length) {
      setExpandedSections(new Set(['stratum']))
    } else {
      setExpandedSections(new Set(allSections))
    }
  }

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

  const handleSearchChange = (value: string) => {
    onFilterChange({
      ...filters,
      search: value.trim() || undefined,
    })
  }

  const clearAllFilters = () => {
    onFilterChange({})
  }

  const activeFiltersCount =
    (filters.search ? 1 : 0) +
    (filters.stratum?.length || 0) +
    (filters.successionalStage?.length || 0) +
    (filters.lifeCycle?.length || 0) +
    (filters.specieType?.length || 0) +
    (filters.regionalBiome?.length || 0) +
    (filters.globalBiome?.length || 0) +
    (filters.foliageType?.length || 0) +
    (filters.growthRate?.length || 0) +
    (filters.uses?.length || 0) +
    (filters.nitrogenFixer ? 1 : 0) +
    (filters.edibleFruit ? 1 : 0) +
    (filters.service ? 1 : 0)

  return (
    <div className="lg:sticky lg:top-24 lg:max-h-[calc(100vh-7rem)] lg:overflow-y-auto lg:pr-2">
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
        <div className="px-6 pb-2">
          <button
            onClick={toggleAll}
            className="text-xs font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            {expandedSections.size >= allSections.length ? tCatalog('collapseAll') : tCatalog('expandAll')}
          </button>
        </div>
        <CardContent className="space-y-6">
          {/* Search Input */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">{tCatalog('search')}</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder={tCatalog('searchPlaceholder')}
                value={filters.search || ''}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* Stratum Filter */}
          <Collapsible
            open={expandedSections.has('stratum')}
            onOpenChange={(open) => toggleSection('stratum', open)}
          >
            <div className="space-y-3">
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between text-left group">
                  <h3 className="text-sm font-semibold text-gray-900">{tCatalog('stratum')}</h3>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:text-gray-700",
                    expandedSections.has('stratum') && "rotate-180"
                  )} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
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
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Successional Stage Filter */}
          <Collapsible
            open={expandedSections.has('successionalStage')}
            onOpenChange={(open) => toggleSection('successionalStage', open)}
          >
            <div className="space-y-3">
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between text-left group">
                  <h3 className="text-sm font-semibold text-gray-900">
                    {tCatalog('successionalStage')}
                  </h3>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:text-gray-700",
                    expandedSections.has('successionalStage') && "rotate-180"
                  )} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
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
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Life Cycle Filter */}
          <Collapsible
            open={expandedSections.has('lifeCycle')}
            onOpenChange={(open) => toggleSection('lifeCycle', open)}
          >
            <div className="space-y-3">
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between text-left group">
                  <h3 className="text-sm font-semibold text-gray-900">{tCatalog('lifeCycle')}</h3>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:text-gray-700",
                    expandedSections.has('lifeCycle') && "rotate-180"
                  )} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
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
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Specie Type Filter */}
          <Collapsible
            open={expandedSections.has('specieType')}
            onOpenChange={(open) => toggleSection('specieType', open)}
          >
            <div className="space-y-3">
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between text-left group">
                  <h3 className="text-sm font-semibold text-gray-900">{tCatalog('specieType')}</h3>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:text-gray-700",
                    expandedSections.has('specieType') && "rotate-180"
                  )} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {specieTypeOptions.map(option => (
                    <Badge
                      key={option.value}
                      className={`cursor-pointer rounded-full border-2 transition-all ${
                        filters.specieType?.includes(option.value)
                          ? option.color + ' border-current'
                          : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      onClick={() => toggleFilter('specieType', option.value)}
                    >
                      {tSpecieType(option.value)}
                    </Badge>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Regional Biome Filter */}
          <Collapsible
            open={expandedSections.has('regionalBiome')}
            onOpenChange={(open) => toggleSection('regionalBiome', open)}
          >
            <div className="space-y-3">
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between text-left group">
                  <h3 className="text-sm font-semibold text-gray-900">{tCatalog('regionalBiome')}</h3>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:text-gray-700",
                    expandedSections.has('regionalBiome') && "rotate-180"
                  )} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <MultiSelect
                  options={regionalBiomeOptions.map(option => ({
                    value: option.value,
                    label: tRegionalBiome(option.value)
                  }))}
                  value={filters.regionalBiome || []}
                  onChange={(value) => {
                    onFilterChange({
                      ...filters,
                      regionalBiome: value.length > 0 ? value as RegionalBiome[] : undefined
                    })
                  }}
                  placeholder={tCatalog('searchPlaceholder')}
                />
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Global Biome Filter */}
          <Collapsible
            open={expandedSections.has('globalBiome')}
            onOpenChange={(open) => toggleSection('globalBiome', open)}
          >
            <div className="space-y-3">
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between text-left group">
                  <h3 className="text-sm font-semibold text-gray-900">{tCatalog('globalBiome')}</h3>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:text-gray-700",
                    expandedSections.has('globalBiome') && "rotate-180"
                  )} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <MultiSelect
                  options={globalBiomeOptions.map(option => ({
                    value: option.value,
                    label: tGlobalBiome(option.value)
                  }))}
                  value={filters.globalBiome || []}
                  onChange={(value) => {
                    onFilterChange({
                      ...filters,
                      globalBiome: value.length > 0 ? value as GlobalBiome[] : undefined
                    })
                  }}
                  placeholder={tCatalog('searchPlaceholder')}
                />
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Foliage Type Filter */}
          <Collapsible
            open={expandedSections.has('foliageType')}
            onOpenChange={(open) => toggleSection('foliageType', open)}
          >
            <div className="space-y-3">
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between text-left group">
                  <h3 className="text-sm font-semibold text-gray-900">{tCatalog('foliageType')}</h3>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:text-gray-700",
                    expandedSections.has('foliageType') && "rotate-180"
                  )} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {foliageTypeOptions.map(option => (
                    <Badge
                      key={option.value}
                      className={`cursor-pointer rounded-full border-2 transition-all ${
                        filters.foliageType?.includes(option.value)
                          ? option.color + ' border-current'
                          : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      onClick={() => toggleFilter('foliageType', option.value)}
                    >
                      {tFoliage(option.value)}
                    </Badge>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Growth Rate Filter */}
          <Collapsible
            open={expandedSections.has('growthRate')}
            onOpenChange={(open) => toggleSection('growthRate', open)}
          >
            <div className="space-y-3">
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between text-left group">
                  <h3 className="text-sm font-semibold text-gray-900">{tCatalog('growthRate')}</h3>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:text-gray-700",
                    expandedSections.has('growthRate') && "rotate-180"
                  )} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {growthRateOptions.map(option => (
                    <Badge
                      key={option.value}
                      className={`cursor-pointer rounded-full border-2 transition-all ${
                        filters.growthRate?.includes(option.value)
                          ? option.color + ' border-current'
                          : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      onClick={() => toggleFilter('growthRate', option.value)}
                    >
                      {tGrowth(option.value)}
                    </Badge>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Plant Uses Filter */}
          <Collapsible
            open={expandedSections.has('uses')}
            onOpenChange={(open) => toggleSection('uses', open)}
          >
            <div className="space-y-3">
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between text-left group">
                  <h3 className="text-sm font-semibold text-gray-900">{tCatalog('uses')}</h3>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:text-gray-700",
                    expandedSections.has('uses') && "rotate-180"
                  )} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  {plantUseOptions.map(option => (
                    <Badge
                      key={option.value}
                      className={`cursor-pointer rounded-full border-2 transition-all ${
                        filters.uses?.includes(option.value)
                          ? option.color + ' border-current'
                          : 'border-transparent bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                      onClick={() => toggleFilter('uses', option.value)}
                    >
                      {tUse(option.value)}
                    </Badge>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Boolean Characteristics */}
          <Collapsible
            open={expandedSections.has('characteristics')}
            onOpenChange={(open) => toggleSection('characteristics', open)}
          >
            <div className="space-y-3">
              <CollapsibleTrigger asChild>
                <button className="flex w-full items-center justify-between text-left group">
                  <h3 className="text-sm font-semibold text-gray-900">{tCatalog('characteristics')}</h3>
                  <ChevronDown className={cn(
                    "h-4 w-4 text-gray-500 transition-transform duration-200 group-hover:text-gray-700",
                    expandedSections.has('characteristics') && "rotate-180"
                  )} />
                </button>
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-2">
                <div className="flex flex-col gap-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.nitrogenFixer || false}
                      onCheckedChange={(checked) =>
                        onFilterChange({ ...filters, nitrogenFixer: checked === true ? true : undefined })
                      }
                    />
                    <span className="text-sm text-gray-700">{tCatalog('nitrogenFixer')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.edibleFruit || false}
                      onCheckedChange={(checked) =>
                        onFilterChange({ ...filters, edibleFruit: checked === true ? true : undefined })
                      }
                    />
                    <span className="text-sm text-gray-700">{tCatalog('edibleFruit')}</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <Checkbox
                      checked={filters.service || false}
                      onCheckedChange={(checked) =>
                        onFilterChange({ ...filters, service: checked === true ? true : undefined })
                      }
                    />
                    <span className="text-sm text-gray-700">{tCatalog('service')}</span>
                  </label>
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>
        </CardContent>
      </Card>
    </div>
  )
}
