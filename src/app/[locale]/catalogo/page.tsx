'use client'

import { useState } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { FilterSidebar } from '@/components/catalogo/FilterSidebar'
import { SpeciesTable } from '@/components/catalogo/SpeciesTable'
import { type SpeciesFilters } from '@/types/species'
import { useTranslations } from '@/lib/IntlProvider'

// Mock data - will be replaced with database queries
const mockSpecies = [
  {
    id: '1',
    slug: 'jatoba-hymenaea-courbaril',
    scientificName: 'Hymenaea courbaril',
    commonNames: ['Jatobá', 'Jataí', 'Jutaí'],
    stratum: 'EMERGENT' as const,
    successionalStage: 'CLIMAX' as const,
    lifeCycle: 'PERENNIAL' as const,
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop',
  },
  {
    id: '2',
    slug: 'banana-musa-paradisiaca',
    scientificName: 'Musa × paradisiaca',
    commonNames: ['Banana', 'Bananeira'],
    stratum: 'SUBCANOPY' as const,
    successionalStage: 'PIONEER' as const,
    lifeCycle: 'PERENNIAL' as const,
    imageUrl: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=800&h=600&fit=crop',
  },
  {
    id: '3',
    slug: 'palmito-euterpe-edulis',
    scientificName: 'Euterpe edulis',
    commonNames: ['Palmito-juçara', 'Juçara', 'Ripeira'],
    stratum: 'CANOPY' as const,
    successionalStage: 'LATE_SECONDARY' as const,
    lifeCycle: 'PERENNIAL' as const,
    imageUrl: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=800&h=600&fit=crop',
  },
  {
    id: '4',
    slug: 'cafe-coffea-arabica',
    scientificName: 'Coffea arabica',
    commonNames: ['Café', 'Cafeeiro'],
    stratum: 'UNDERSTORY' as const,
    successionalStage: 'EARLY_SECONDARY' as const,
    lifeCycle: 'PERENNIAL' as const,
    imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&h=600&fit=crop',
  },
  {
    id: '5',
    slug: 'acerola-malpighia-emarginata',
    scientificName: 'Malpighia emarginata',
    commonNames: ['Acerola', 'Cereja-das-antilhas'],
    stratum: 'UNDERSTORY' as const,
    successionalStage: 'PIONEER' as const,
    lifeCycle: 'PERENNIAL' as const,
    imageUrl: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800&h=600&fit=crop',
  },
  {
    id: '6',
    slug: 'inga-inga-edulis',
    scientificName: 'Inga edulis',
    commonNames: ['Ingá', 'Ingá-de-metro', 'Ingá-cipó'],
    stratum: 'SUBCANOPY' as const,
    successionalStage: 'PIONEER' as const,
    lifeCycle: 'PERENNIAL' as const,
    imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&h=600&fit=crop',
  },
]

export default function CatalogoPage() {
  const t = useTranslations('catalog')
  const [filters, setFilters] = useState<SpeciesFilters>({})
  const [filteredSpecies, setFilteredSpecies] = useState(mockSpecies)

  const handleFilterChange = (newFilters: SpeciesFilters) => {
    setFilters(newFilters)

    // Apply filters
    let filtered = mockSpecies

    if (newFilters.stratum && newFilters.stratum.length > 0) {
      filtered = filtered.filter(s => newFilters.stratum!.includes(s.stratum))
    }

    if (newFilters.successionalStage && newFilters.successionalStage.length > 0) {
      filtered = filtered.filter(s => newFilters.successionalStage!.includes(s.successionalStage))
    }

    if (newFilters.lifeCycle && newFilters.lifeCycle.length > 0) {
      filtered = filtered.filter(s => newFilters.lifeCycle!.includes(s.lifeCycle))
    }

    setFilteredSpecies(filtered)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-6 py-8 lg:px-12">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              {t('title')}
            </h1>
            <p className="text-gray-600">
              {t('description').replace('{count}', String(filteredSpecies.length))}
            </p>
          </div>

          {/* Two Column Layout */}
          <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
            {/* Left Column - Filters */}
            <FilterSidebar
              filters={filters}
              onFilterChange={handleFilterChange}
            />

            {/* Right Column - Species Table */}
            <SpeciesTable species={filteredSpecies} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
