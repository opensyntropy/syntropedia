// Stratum/Layer in the forest
export type Stratum = 'EMERGENT' | 'CANOPY' | 'SUBCANOPY' | 'UNDERSTORY' | 'GROUND_COVER'

// Successional stage
export type SuccessionalStage = 'PIONEER' | 'EARLY_SECONDARY' | 'LATE_SECONDARY' | 'CLIMAX'

// Life cycle
export type LifeCycle = 'ANNUAL' | 'BIENNIAL' | 'PERENNIAL'

export interface SpeciesFilters {
  stratum?: Stratum[]
  successionalStage?: SuccessionalStage[]
  lifeCycle?: LifeCycle[]
}

export interface SpeciesListItem {
  id: string
  slug: string
  scientificName: string
  commonNames: string[]
  stratum: Stratum
  successionalStage: SuccessionalStage
  lifeCycle: LifeCycle
  imageUrl: string
}
