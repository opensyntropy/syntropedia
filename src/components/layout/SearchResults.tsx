'use client'

import { SearchResult } from '@/types/species'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import Image from 'next/image'

interface SearchResultsProps {
  results: SearchResult[]
  isLoading: boolean
  totalCount: number
  query: string
  selectedIndex: number
  locale: string
  translations: {
    noResults: string
    noResultsHint: string
    viewAllResults: string
    catalog: string
    edibleFruit: string
    stratum: Record<string, string>
  }
  onClose: () => void
  onSelectResult: (slug: string) => void
  onViewAll: () => void
}

export function SearchResults({
  results,
  isLoading,
  totalCount,
  query,
  selectedIndex,
  locale,
  translations,
  onClose,
  onSelectResult,
  onViewAll
}: SearchResultsProps) {
  // Loading skeleton
  if (isLoading) {
    return (
      <Card className="absolute z-50 w-full mt-2 p-4 shadow-lg max-h-[500px] overflow-y-auto">
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 animate-pulse">
              <div className="w-10 h-10 bg-gray-200 rounded-md" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3 pt-3 border-t">
          <div className="h-4 bg-gray-200 rounded w-full" />
        </div>
      </Card>
    )
  }

  // Empty state
  if (results.length === 0 && !isLoading) {
    return (
      <Card className="absolute z-50 w-full mt-2 p-6 shadow-lg text-center">
        <p className="text-gray-700 font-medium mb-2">
          {translations.noResults.replace('{query}', query)}
        </p>
        <p className="text-sm text-gray-500 mb-4">
          {translations.noResultsHint}
        </p>
        <Button
          variant="outline"
          onClick={() => {
            window.location.href = '/catalog'
          }}
        >
          {translations.catalog}
        </Button>
      </Card>
    )
  }

  return (
    <Card className="absolute z-50 w-full mt-2 shadow-lg max-h-[500px] overflow-y-auto">
      <div className="divide-y">
        {results.map((result, index) => {
          const isSelected = index === selectedIndex
          const primaryCommonName = result.commonNames[0]

          return (
            <div
              key={result.id}
              onClick={() => {
                onClose()
                window.location.href = `/species/${result.slug}`
              }}
              className={`w-full flex items-center gap-3 p-3 text-left transition-colors cursor-pointer ${
                isSelected
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="relative w-10 h-10 flex-shrink-0">
                <Image
                  src={result.imageUrl}
                  alt={result.scientificName}
                  fill
                  className="rounded-md object-cover"
                  sizes="40px"
                />
              </div>

              <div className="flex-1 min-w-0">
                <p
                  className={`font-medium italic text-sm truncate ${
                    isSelected ? 'text-primary-foreground' : 'text-gray-900'
                  }`}
                >
                  {result.scientificName}
                </p>
                {primaryCommonName && (
                  <p
                    className={`text-xs truncate ${
                      isSelected ? 'text-primary-foreground/80' : 'text-gray-600'
                    }`}
                  >
                    {primaryCommonName}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <Badge
                  variant={isSelected ? 'secondary' : 'default'}
                  className="text-xs whitespace-nowrap"
                >
                  {translations.stratum[result.stratum]}
                </Badge>
                {result.edibleFruit && (
                  <span className="text-base" title={translations.edibleFruit}>
                    🍎
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Footer with "View all results" button */}
      <div className="p-3 border-t bg-gray-50">
        <Button
          variant="ghost"
          className="w-full text-primary hover:text-primary hover:bg-primary/10"
          onClick={onViewAll}
        >
          {translations.viewAllResults.replace('{count}', totalCount.toString())}
        </Button>
      </div>
    </Card>
  )
}
