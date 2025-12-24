'use client'

import { useRouter } from 'next/navigation'
import { useTransition, useMemo } from 'react'
import { FilterSidebar } from './FilterSidebar'
import { SpeciesTable } from './SpeciesTable'
import { Pagination } from './Pagination'
import { CatalogSkeleton } from './CatalogSkeleton'
import { type SpeciesFilters, type SpeciesListItem } from '@/types/species'
import { useTranslations } from '@/lib/IntlProvider'

interface CatalogoClientProps {
  species: SpeciesListItem[]
  currentFilters: SpeciesFilters
  totalCount: number
  currentPage: number
  totalPages: number
}

export function CatalogoClient({
  species,
  currentFilters,
  totalCount,
  currentPage,
  totalPages
}: CatalogoClientProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const t = useTranslations('catalog')
  const tStratum = useTranslations('stratum')
  const tStage = useTranslations('successionalStage')
  const tLifeCycle = useTranslations('lifeCycle')
  const tRegionalBiome = useTranslations('regionalBiome')
  const tGlobalBiome = useTranslations('globalBiome')
  const tFoliage = useTranslations('foliageType')
  const tGrowth = useTranslations('growthRate')
  const tUse = useTranslations('plantUse')

  // Check if any filters are active
  const hasActiveFilters = useMemo(() => {
    return !!(
      currentFilters.search ||
      currentFilters.stratum?.length ||
      currentFilters.successionalStage?.length ||
      currentFilters.lifeCycle?.length ||
      currentFilters.regionalBiome?.length ||
      currentFilters.globalBiome?.length ||
      currentFilters.foliageType?.length ||
      currentFilters.growthRate?.length ||
      currentFilters.uses?.length ||
      currentFilters.nitrogenFixer ||
      currentFilters.edibleFruit ||
      currentFilters.service
    )
  }, [currentFilters])

  // Build active filter tags
  const activeFilterTags = useMemo(() => {
    const tags: { label: string; value: string; filterKey: keyof SpeciesFilters; arrayValue?: string }[] = []

    // Search
    if (currentFilters.search) {
      tags.push({ label: t('search'), value: currentFilters.search, filterKey: 'search' })
    }

    // Array filters with translations
    currentFilters.stratum?.forEach(value => {
      tags.push({ label: t('stratum'), value: tStratum(value), filterKey: 'stratum', arrayValue: value })
    })

    currentFilters.successionalStage?.forEach(value => {
      tags.push({ label: t('successionalStage'), value: tStage(value), filterKey: 'successionalStage', arrayValue: value })
    })

    currentFilters.lifeCycle?.forEach(value => {
      tags.push({ label: t('lifeCycle'), value: tLifeCycle(value), filterKey: 'lifeCycle', arrayValue: value })
    })

    currentFilters.regionalBiome?.forEach(value => {
      tags.push({ label: t('regionalBiome'), value: tRegionalBiome(value), filterKey: 'regionalBiome', arrayValue: value })
    })

    currentFilters.globalBiome?.forEach(value => {
      tags.push({ label: t('globalBiome'), value: tGlobalBiome(value), filterKey: 'globalBiome', arrayValue: value })
    })

    currentFilters.foliageType?.forEach(value => {
      tags.push({ label: t('foliageType'), value: tFoliage(value), filterKey: 'foliageType', arrayValue: value })
    })

    currentFilters.growthRate?.forEach(value => {
      tags.push({ label: t('growthRate'), value: tGrowth(value), filterKey: 'growthRate', arrayValue: value })
    })

    currentFilters.uses?.forEach(value => {
      tags.push({ label: t('uses'), value: tUse(value), filterKey: 'uses', arrayValue: value })
    })

    // Boolean filters
    if (currentFilters.nitrogenFixer) {
      tags.push({ label: t('characteristics'), value: t('nitrogenFixer'), filterKey: 'nitrogenFixer' })
    }

    if (currentFilters.edibleFruit) {
      tags.push({ label: t('characteristics'), value: t('edibleFruit'), filterKey: 'edibleFruit' })
    }

    if (currentFilters.service) {
      tags.push({ label: t('characteristics'), value: t('service'), filterKey: 'service' })
    }

    return tags
  }, [currentFilters, t, tStratum, tStage, tLifeCycle, tRegionalBiome, tGlobalBiome, tFoliage, tGrowth, tUse])

  /**
   * Build URL query string from filters
   */
  const buildFilterUrl = (filters: SpeciesFilters, page?: number): string => {
    const params = new URLSearchParams()

    // Add search
    if (filters.search) params.set('search', filters.search)

    // Add array filters (comma-separated)
    if (filters.stratum?.length) params.set('stratum', filters.stratum.join(','))
    if (filters.successionalStage?.length) params.set('successionalStage', filters.successionalStage.join(','))
    if (filters.lifeCycle?.length) params.set('lifeCycle', filters.lifeCycle.join(','))
    if (filters.regionalBiome?.length) params.set('regionalBiome', filters.regionalBiome.join(','))
    if (filters.globalBiome?.length) params.set('globalBiome', filters.globalBiome.join(','))
    if (filters.foliageType?.length) params.set('foliageType', filters.foliageType.join(','))
    if (filters.growthRate?.length) params.set('growthRate', filters.growthRate.join(','))
    if (filters.uses?.length) params.set('uses', filters.uses.join(','))

    // Add boolean filters
    if (filters.nitrogenFixer) params.set('nitrogenFixer', 'true')
    if (filters.edibleFruit) params.set('edibleFruit', 'true')
    if (filters.service) params.set('service', 'true')

    // Add page number (if not page 1)
    if (page && page > 1) params.set('page', page.toString())

    const queryString = params.toString()
    return queryString ? `?${queryString}` : ''
  }

  /**
   * Handle filter changes - navigate to new URL with updated filters
   */
  const handleFilterChange = (newFilters: SpeciesFilters) => {
    const url = buildFilterUrl(newFilters)

    startTransition(() => {
      router.push(url || '/catalog')
    })
  }

  /**
   * Handle page change - navigate to new URL with updated page number
   */
  const handlePageChange = (page: number) => {
    const url = buildFilterUrl(currentFilters, page)

    startTransition(() => {
      router.push(url || '/catalog')
    })
  }

  /**
   * Clear all filters - navigate back to base catalog URL
   */
  const clearAllFilters = () => {
    startTransition(() => {
      router.push('/catalog')
    })
  }

  /**
   * Remove a single filter
   */
  const removeFilter = (filterKey: keyof SpeciesFilters, arrayValue?: string) => {
    const newFilters = { ...currentFilters }

    if (arrayValue) {
      // Remove from array filter
      const currentArray = newFilters[filterKey] as string[] | undefined
      if (currentArray) {
        const filtered = currentArray.filter(v => v !== arrayValue)
        if (filtered.length === 0) {
          delete newFilters[filterKey]
        } else {
          (newFilters[filterKey] as string[]) = filtered
        }
      }
    } else {
      // Remove boolean or string filter
      delete newFilters[filterKey]
    }

    const url = buildFilterUrl(newFilters, currentPage)
    startTransition(() => {
      router.push(url || '/catalog')
    })
  }

  return (
    <>
      {/* Fixed Left Sidebar - Filters */}
      <FilterSidebar
        filters={currentFilters}
        onFilterChange={handleFilterChange}
      />

      {/* Main Content Area - offset by sidebar width on lg+ */}
      <div className="lg:ml-[300px]">
        <div className="grid gap-6 xl:grid-cols-[1fr_240px] overflow-hidden">
          {/* Center Column - Species Table and Pagination (with loading overlay) */}
          <div className="relative min-w-0">
            {/* Filters and Result Count Card */}
            <div className="bg-white border border-gray-200 rounded-lg shadow-sm mb-6 p-4">
              {/* Header with result count and clear filters button */}
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">
                  {totalCount > 0 ? (
                    <>
                      {t('showingResults').replace('{showing}', String(species.length)).replace('{total}', String(totalCount))}
                    </>
                  ) : (
                    t('noSpeciesFound')
                  )}
                </h2>

                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="text-sm text-primary-600 hover:text-primary-700 hover:underline transition-colors font-medium"
                  >
                    {t('clearAllFilters')}
                  </button>
                )}
              </div>

              {/* Active Filters */}
              {hasActiveFilters && (
                <div>
                  <div className="flex flex-wrap gap-2">
                    {activeFilterTags.map((tag, index) => (
                      <button
                        key={`${tag.filterKey}-${tag.arrayValue || 'single'}-${index}`}
                        onClick={() => removeFilter(tag.filterKey, tag.arrayValue)}
                        className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary-50 text-primary-700 text-sm rounded-full hover:bg-primary-100 transition-colors"
                      >
                        <span className="font-medium">{tag.label}:</span>
                        <span>{tag.value}</span>
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Loading overlay (only on the table/results area) */}
            {isPending && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] z-10 flex items-start justify-center pt-20">
                <div className="flex items-center gap-3 px-4 py-2 bg-white rounded-lg shadow-lg border border-gray-200">
                  <svg className="animate-spin h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span className="text-sm font-medium text-gray-700">{t('loading')}</span>
                </div>
              </div>
            )}

            <SpeciesTable species={species} />

            {/* Pagination */}
            {totalPages > 1 && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>

          {/* Right Column - CTAs (only on xl screens) */}
          <div className="hidden xl:block space-y-6">
            <div className="sticky top-24 space-y-6">
              {/* Community Stats */}
              <div className="bg-white border border-gray-200 rounded-lg p-6">
                <h3 className="font-semibold text-gray-900 mb-4">{t('communityTitle')}</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('totalSpecies')}</span>
                    <span className="font-semibold text-primary-600">{totalCount.toLocaleString()}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{t('contributors')}</span>
                    <span className="font-semibold text-primary-600">42</span>
                  </div>
                </div>
              </div>

              {/* Contribute CTA */}
              <div className="bg-gradient-to-br from-primary-50 to-syntropy-50 border border-primary-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">{t('contributeTitle')}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {t('contributeDescription')}
                </p>
                <a
                  href="/contributions/new"
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
                >
                  {t('contributeButton')}
                </a>
              </div>

              {/* Become Reviewer CTA */}
              <div className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-lg p-6">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">{t('reviewerTitle')}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  {t('reviewerDescription')}
                </p>
                <a
                  href="/become-reviewer"
                  className="inline-flex items-center justify-center w-full px-4 py-2 bg-amber-600 text-white text-sm font-medium rounded-lg hover:bg-amber-700 transition-colors"
                >
                  {t('reviewerButton')}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
