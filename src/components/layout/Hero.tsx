'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useState, useRef, useMemo, useEffect, startTransition } from 'react'
import { useRouter } from 'next/navigation'
import { debounce } from '@/lib/debounce'
import { SearchResult } from '@/types/species'
import { SearchResults } from '@/components/layout/SearchResults'

interface HeroProps {
  locale: string
  translations: {
    title: string
    subtitle: string
    searchPlaceholder: string
    exploreCatalog: string
    learnMore: string
  }
  searchTranslations: {
    noResults: string
    noResultsHint: string
    viewAllResults: string
    catalog: string
    edibleFruit: string
    stratum: Record<string, string>
  }
}

export function Hero({ locale, translations, searchTranslations }: HeroProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [totalCount, setTotalCount] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [error, setError] = useState<string | null>(null)

  const searchRef = useRef<HTMLDivElement>(null)
  const abortControllerRef = useRef<AbortController | null>(null)
  const navigationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const router = useRouter()

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current)
      }
    }
  }, [])

  // Debounced search function
  const debouncedSearch = useMemo(
    () =>
      debounce(async (query: string) => {
        if (query.length < 3) {
          setSearchResults([])
          setShowResults(false)
          setTotalCount(0)
          return
        }

        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort()
        }

        abortControllerRef.current = new AbortController()
        setIsSearching(true)
        setError(null)

        try {
          const response = await fetch(
            `/api/species/search?q=${encodeURIComponent(query)}&limit=8`,
            { signal: abortControllerRef.current.signal }
          )

          if (!response.ok) throw new Error('Search failed')

          const data = await response.json()
          setSearchResults(data.results)
          setTotalCount(data.totalCount)
          setShowResults(true)
          setSelectedIndex(-1)
        } catch (err: any) {
          if (err.name !== 'AbortError') {
            setError('Failed to load results')
            setShowResults(false)
          }
        } finally {
          setIsSearching(false)
        }
      }, 1500),
    []
  )

  // Trigger search when query changes
  useEffect(() => {
    debouncedSearch(searchQuery)
  }, [searchQuery, debouncedSearch])

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showResults || searchResults.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex((prev) =>
          prev < searchResults.length - 1 ? prev + 1 : prev
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSelectResult(searchResults[selectedIndex].slug)
        } else {
          handleViewAll()
        }
        break
      case 'Escape':
        e.preventDefault()
        setShowResults(false)
        break
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/${locale}/catalogo?q=${encodeURIComponent(searchQuery)}`)
      setShowResults(false)
    }
  }

  const handleSelectResult = (slug: string) => {
    // Simply close the dropdown - Link component handles navigation
    setShowResults(false)
  }

  const handleViewAll = () => {
    // Clear any pending navigation
    if (navigationTimeoutRef.current) {
      clearTimeout(navigationTimeoutRef.current)
    }

    setShowResults(false)

    // Use requestAnimationFrame to wait for next render, then navigate
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        startTransition(() => {
          router.push(`/${locale}/catalogo?q=${encodeURIComponent(searchQuery)}`)
        })
      })
    })
  }

  const handleClose = () => {
    setShowResults(false)
  }

  return (
    <section className="relative bg-gradient-to-b from-primary-50/30 to-white py-20 sm:py-32">
      <div className="container mx-auto px-6 text-center lg:px-12">
        {/* Title */}
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          {translations.title}
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-12 max-w-2xl text-base text-gray-600 sm:text-lg lg:text-xl">
          {translations.subtitle}
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mx-auto mb-10 max-w-2xl">
          <div ref={searchRef} className="relative">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder={translations.searchPlaceholder}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                if (searchResults.length > 0 && searchQuery.length >= 3) {
                  setShowResults(true)
                }
              }}
              className="h-14 rounded-lg border-2 border-gray-200 pl-14 pr-4 text-base shadow-sm transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
              aria-label={translations.searchPlaceholder}
              aria-autocomplete="list"
              aria-controls="search-results"
              aria-expanded={showResults}
            />

            {/* Search Results Dropdown */}
            {showResults && (searchResults.length > 0 || isSearching) && (
              <SearchResults
                results={searchResults}
                isLoading={isSearching}
                totalCount={totalCount}
                query={searchQuery}
                selectedIndex={selectedIndex}
                locale={locale}
                translations={searchTranslations}
                onClose={handleClose}
                onSelectResult={handleSelectResult}
                onViewAll={handleViewAll}
              />
            )}
          </div>
        </form>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="rounded-xl bg-primary-600 px-7 shadow-md transition-all hover:bg-primary-700 hover:shadow-lg"
            asChild
          >
            <Link href={`/${locale}/catalogo`}>
              {translations.exploreCatalog}
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-xl border-2 border-primary-600 text-primary-600 transition-all hover:bg-primary-50"
            asChild
          >
            <Link href={`/${locale}/sobre`}>
              {translations.learnMore}
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
