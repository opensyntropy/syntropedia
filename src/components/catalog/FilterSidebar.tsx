'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Search, ChevronDown } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { MultiSelect } from '@/components/ui/multi-select'
import { Badge } from '@/components/ui/badge'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { type SpeciesFilters, type Stratum, type SuccessionalStage, type LifeCycle, type RegionalBiome, type GlobalBiome, type FoliageType, type GrowthRate, type PlantUse } from '@/types/species'
import { useTranslations } from '@/lib/IntlProvider'
import { cn } from '@/lib/utils'

interface FilterSidebarProps {
  filters: SpeciesFilters
  onFilterChange: (filters: SpeciesFilters) => void
}

const stratumOptions: Stratum[] = ['EMERGENT', 'HIGH', 'MEDIUM', 'LOW', 'GROUND']

const successionalStageOptions: SuccessionalStage[] = ['PIONEER', 'EARLY_SECONDARY', 'LATE_SECONDARY', 'CLIMAX']

const lifeCycleOptions: LifeCycle[] = ['ANNUAL', 'BIENNIAL', 'PERENNIAL']

const regionalBiomeOptions: RegionalBiome[] = [
  'AMAZON', 'ATLANTIC_FOREST', 'TROPICAL_RAINFOREST', 'TROPICAL_DRY_FOREST',
  'TROPICAL_SAVANNA', 'CERRADO', 'CAATINGA', 'PANTANAL', 'MANGROVE',
  'SUBTROPICAL_FOREST', 'SUBTROPICAL_GRASSLAND',
  'TEMPERATE_FOREST', 'TEMPERATE_GRASSLAND', 'PAMPA', 'MEDITERRANEAN', 'CHAPARRAL',
  'BOREAL_FOREST', 'TAIGA', 'TUNDRA', 'ALPINE', 'DESERT', 'SEMI_ARID'
]

const globalBiomeOptions: GlobalBiome[] = [
  'TROPICAL_RAINFOREST', 'TROPICAL_DRY_FOREST', 'TROPICAL_SAVANNA',
  'SUBTROPICAL_FOREST', 'SUBTROPICAL_GRASSLAND',
  'TEMPERATE_FOREST', 'TEMPERATE_GRASSLAND', 'MEDITERRANEAN',
  'BOREAL_FOREST', 'TUNDRA', 'DESERT', 'MANGROVE'
]

const foliageTypeOptions: FoliageType[] = ['EVERGREEN', 'SEMI_EVERGREEN', 'DECIDUOUS', 'SEMI_DECIDUOUS']

const growthRateOptions: GrowthRate[] = ['VERY_FAST', 'FAST', 'MEDIUM', 'SLOW', 'VERY_SLOW']

const plantUseOptions: PlantUse[] = [
  'HUMAN_FOOD', 'ANIMAL_FOOD', 'TIMBER', 'MEDICINAL',
  'ORNAMENTAL', 'SHADE', 'HONEY', 'FIREWOOD'
]

// Flat style for filter badges
const selectedBadgeClass = 'bg-primary-100 text-primary-700 border-primary-300'
const unselectedBadgeClass = 'bg-gray-100 text-gray-600 hover:bg-gray-200 border-transparent'

export function FilterSidebar({ filters, onFilterChange }: FilterSidebarProps) {
  const tCatalog = useTranslations('catalog')
  const tStratum = useTranslations('stratum')
  const tStage = useTranslations('successionalStage')
  const tLifeCycle = useTranslations('lifeCycle')
  const tRegionalBiome = useTranslations('regionalBiome')
  const tGlobalBiome = useTranslations('globalBiome')
  const tFoliage = useTranslations('foliageType')
  const tGrowth = useTranslations('growthRate')
  const tUse = useTranslations('plantUse')

  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(['stratum', 'successionalStage', 'lifeCycle'])
  )

  // Local state for search input (shows what user types immediately)
  const [searchInput, setSearchInput] = useState(filters.search || '')
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Track bottom offset to avoid overlapping footer
  const [bottomOffset, setBottomOffset] = useState(0)

  // Calculate bottom offset based on footer visibility
  const calculateBottomOffset = useCallback(() => {
    const footer = document.querySelector('footer')
    if (!footer) return

    const footerRect = footer.getBoundingClientRect()
    const viewportHeight = window.innerHeight

    // If footer is visible in viewport, adjust bottom offset
    if (footerRect.top < viewportHeight) {
      const overlap = viewportHeight - footerRect.top
      setBottomOffset(Math.max(0, overlap))
    } else {
      setBottomOffset(0)
    }
  }, [])

  // Listen to scroll and resize events
  useEffect(() => {
    calculateBottomOffset()
    window.addEventListener('scroll', calculateBottomOffset, { passive: true })
    window.addEventListener('resize', calculateBottomOffset, { passive: true })

    return () => {
      window.removeEventListener('scroll', calculateBottomOffset)
      window.removeEventListener('resize', calculateBottomOffset)
    }
  }, [calculateBottomOffset])

  // Sync local search input when filters.search changes externally (e.g., clear filters)
  useEffect(() => {
    setSearchInput(filters.search || '')
  }, [filters.search])

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current)
      }
    }
  }, [])

  const toggleSection = (section: string, open: boolean) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      open ? next.add(section) : next.delete(section)
      return next
    })
  }

  const allSections = ['stratum', 'successionalStage', 'lifeCycle',
                       'regionalBiome', 'globalBiome', 'foliageType', 'growthRate',
                       'uses']

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
    // Update local state immediately so user sees what they're typing
    setSearchInput(value)

    // Clear any existing timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    // Set new timeout to trigger filter after 1.5s
    searchTimeoutRef.current = setTimeout(() => {
      const trimmed = value.trim()
      onFilterChange({
        ...filters,
        // Only set search if at least 3 characters, otherwise clear it
        search: trimmed.length >= 3 ? trimmed : undefined,
      })
    }, 1500)
  }

  return (
    <aside
      className="hidden lg:block fixed left-0 top-16 w-[300px] bg-white border-r border-gray-200 overflow-y-auto z-40 transition-all duration-150"
      style={{ bottom: `${bottomOffset}px` }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">{tCatalog('filters')}</h2>
          <button
            onClick={toggleAll}
            className="text-xs font-medium text-gray-500 hover:text-gray-700 transition-colors"
          >
            {expandedSections.size >= allSections.length ? tCatalog('collapseAll') : tCatalog('expandAll')}
          </button>
        </div>
        <div className="space-y-6">
          {/* Search Input */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">{tCatalog('search')}</h3>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder={tCatalog('searchPlaceholder')}
                value={searchInput}
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
                      key={option}
                      className={`cursor-pointer rounded-full border-2 transition-all ${
                        filters.stratum?.includes(option)
                          ? selectedBadgeClass
                          : unselectedBadgeClass
                      }`}
                      onClick={() => toggleFilter('stratum', option)}
                    >
                      {tStratum(option)}
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
                      key={option}
                      className={`cursor-pointer rounded-full border-2 transition-all ${
                        filters.successionalStage?.includes(option)
                          ? selectedBadgeClass
                          : unselectedBadgeClass
                      }`}
                      onClick={() => toggleFilter('successionalStage', option)}
                    >
                      {tStage(option)}
                    </Badge>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

          {/* Service Plant Filter */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">{tCatalog('service')}</h3>
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

          {/* Nitrogen Fixer Filter */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-gray-900">{tCatalog('nitrogenFixer')}</h3>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox
                checked={filters.nitrogenFixer || false}
                onCheckedChange={(checked) =>
                  onFilterChange({ ...filters, nitrogenFixer: checked === true ? true : undefined })
                }
              />
              <span className="text-sm text-gray-700">{tCatalog('nitrogenFixer')}</span>
            </label>
          </div>

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
                      key={option}
                      className={`cursor-pointer rounded-full border-2 transition-all ${
                        filters.lifeCycle?.includes(option)
                          ? selectedBadgeClass
                          : unselectedBadgeClass
                      }`}
                      onClick={() => toggleFilter('lifeCycle', option)}
                    >
                      {tLifeCycle(option)}
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
                    value: option,
                    label: tRegionalBiome(option)
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
                    value: option,
                    label: tGlobalBiome(option)
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
                      key={option}
                      className={`cursor-pointer rounded-full border-2 transition-all ${
                        filters.foliageType?.includes(option)
                          ? selectedBadgeClass
                          : unselectedBadgeClass
                      }`}
                      onClick={() => toggleFilter('foliageType', option)}
                    >
                      {tFoliage(option)}
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
                      key={option}
                      className={`cursor-pointer rounded-full border-2 transition-all ${
                        filters.growthRate?.includes(option)
                          ? selectedBadgeClass
                          : unselectedBadgeClass
                      }`}
                      onClick={() => toggleFilter('growthRate', option)}
                    >
                      {tGrowth(option)}
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
                      key={option}
                      className={`cursor-pointer rounded-full border-2 transition-all ${
                        filters.uses?.includes(option)
                          ? selectedBadgeClass
                          : unselectedBadgeClass
                      }`}
                      onClick={() => toggleFilter('uses', option)}
                    >
                      {tUse(option)}
                    </Badge>
                  ))}
                </div>
              </CollapsibleContent>
            </div>
          </Collapsible>

        </div>
      </div>
    </aside>
  )
}
