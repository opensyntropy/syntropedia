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
    specieType: 'TREE' as const,
    foliageType: 'SEMI_DECIDUOUS' as const,
    growthRate: 'SLOW' as const,
    uses: ['TIMBER' as const, 'MEDICINAL' as const, 'HONEY' as const],
    nitrogenFixer: false,
    edibleFruit: true,
    service: false,
    heightMeters: 20,
    canopyWidthMeters: 12,
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
    specieType: 'HERB' as const,
    foliageType: 'EVERGREEN' as const,
    growthRate: 'VERY_FAST' as const,
    uses: ['HUMAN_FOOD' as const, 'ANIMAL_FOOD' as const],
    nitrogenFixer: false,
    edibleFruit: true,
    service: true,
    heightMeters: 4,
    canopyWidthMeters: 2,
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
    specieType: 'PALM' as const,
    foliageType: 'EVERGREEN' as const,
    growthRate: 'MEDIUM' as const,
    uses: ['HUMAN_FOOD' as const, 'ANIMAL_FOOD' as const, 'ORNAMENTAL' as const],
    nitrogenFixer: false,
    edibleFruit: true,
    service: false,
    heightMeters: 12,
    canopyWidthMeters: 3,
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
    specieType: 'SHRUB' as const,
    foliageType: 'EVERGREEN' as const,
    growthRate: 'FAST' as const,
    uses: ['HUMAN_FOOD' as const],
    nitrogenFixer: false,
    edibleFruit: true,
    service: false,
    heightMeters: 3,
    canopyWidthMeters: 2,
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
    specieType: 'SHRUB' as const,
    foliageType: 'EVERGREEN' as const,
    growthRate: 'FAST' as const,
    uses: ['HUMAN_FOOD' as const, 'MEDICINAL' as const],
    nitrogenFixer: false,
    edibleFruit: true,
    service: false,
    heightMeters: 2.5,
    canopyWidthMeters: 2,
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
    specieType: 'TREE' as const,
    foliageType: 'EVERGREEN' as const,
    growthRate: 'VERY_FAST' as const,
    uses: ['HUMAN_FOOD' as const, 'ANIMAL_FOOD' as const, 'SHADE' as const],
    nitrogenFixer: true,
    edibleFruit: true,
    service: true,
    heightMeters: 8,
    canopyWidthMeters: 6,
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

    // Search filter - match against scientific name and common names
    if (newFilters.search) {
      const searchLower = newFilters.search.toLowerCase()
      filtered = filtered.filter(s =>
        s.scientificName.toLowerCase().includes(searchLower) ||
        s.commonNames.some(name => name.toLowerCase().includes(searchLower))
      )
    }

    if (newFilters.stratum && newFilters.stratum.length > 0) {
      filtered = filtered.filter(s => newFilters.stratum!.includes(s.stratum))
    }

    if (newFilters.successionalStage && newFilters.successionalStage.length > 0) {
      filtered = filtered.filter(s => newFilters.successionalStage!.includes(s.successionalStage))
    }

    if (newFilters.lifeCycle && newFilters.lifeCycle.length > 0) {
      filtered = filtered.filter(s => newFilters.lifeCycle!.includes(s.lifeCycle))
    }

    if (newFilters.specieType && newFilters.specieType.length > 0) {
      filtered = filtered.filter(s => newFilters.specieType!.includes(s.specieType))
    }

    if (newFilters.foliageType && newFilters.foliageType.length > 0) {
      filtered = filtered.filter(s => s.foliageType && newFilters.foliageType!.includes(s.foliageType))
    }

    if (newFilters.growthRate && newFilters.growthRate.length > 0) {
      filtered = filtered.filter(s => s.growthRate && newFilters.growthRate!.includes(s.growthRate))
    }

    if (newFilters.uses && newFilters.uses.length > 0) {
      filtered = filtered.filter(s =>
        s.uses && s.uses.some(use => newFilters.uses!.includes(use))
      )
    }

    if (newFilters.nitrogenFixer) {
      filtered = filtered.filter(s => s.nitrogenFixer === true)
    }

    if (newFilters.edibleFruit) {
      filtered = filtered.filter(s => s.edibleFruit === true)
    }

    if (newFilters.service) {
      filtered = filtered.filter(s => s.service === true)
    }

    setFilteredSpecies(filtered)
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-6 py-8 lg:px-12">
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
