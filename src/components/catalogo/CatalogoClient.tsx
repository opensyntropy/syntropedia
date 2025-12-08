'use client'

import { useState } from 'react'
import { FilterSidebar } from './FilterSidebar'
import { SpeciesTable } from './SpeciesTable'
import { type SpeciesFilters, type SpeciesListItem } from '@/types/species'

interface CatalogoClientProps {
  initialSpecies: SpeciesListItem[]
}

export function CatalogoClient({ initialSpecies }: CatalogoClientProps) {
  const [filters, setFilters] = useState<SpeciesFilters>({})
  const [filteredSpecies, setFilteredSpecies] = useState(initialSpecies)

  const handleFilterChange = (newFilters: SpeciesFilters) => {
    setFilters(newFilters)

    // Apply filters
    let filtered = initialSpecies

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
      filtered = filtered.filter(s => s.lifeCycle && newFilters.lifeCycle!.includes(s.lifeCycle))
    }

    if (newFilters.specieType && newFilters.specieType.length > 0) {
      filtered = filtered.filter(s => s.specieType && newFilters.specieType!.includes(s.specieType))
    }

    if (newFilters.regionalBiome && newFilters.regionalBiome.length > 0) {
      filtered = filtered.filter(s =>
        s.regionalBiome && s.regionalBiome.some(biome => newFilters.regionalBiome!.includes(biome))
      )
    }

    if (newFilters.globalBiome && newFilters.globalBiome.length > 0) {
      filtered = filtered.filter(s =>
        s.globalBiome && s.globalBiome.some(biome => newFilters.globalBiome!.includes(biome))
      )
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
    <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
      {/* Left Column - Filters */}
      <FilterSidebar
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Right Column - Species Table */}
      <SpeciesTable species={filteredSpecies} />
    </div>
  )
}
