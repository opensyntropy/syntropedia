// Stratum/Layer in the forest
export type Stratum = 'EMERGENT' | 'CANOPY' | 'SUBCANOPY' | 'UNDERSTORY' | 'GROUND_COVER'

// Successional stage
export type SuccessionalStage = 'PIONEER' | 'EARLY_SECONDARY' | 'LATE_SECONDARY' | 'CLIMAX'

// Life cycle
export type LifeCycle = 'ANNUAL' | 'BIENNIAL' | 'PERENNIAL'

// Foliage type
export type FoliageType = 'EVERGREEN' | 'SEMI_EVERGREEN' | 'DECIDUOUS' | 'SEMI_DECIDUOUS'

// Growth rate
export type GrowthRate = 'VERY_FAST' | 'FAST' | 'MEDIUM' | 'SLOW' | 'VERY_SLOW'

// Specie type
export type SpecieType = 'TREE' | 'SHRUB' | 'VINE' | 'PALM' | 'GRASS' | 'HERB' | 'FERN'

// Plant uses
export type PlantUse =
  | 'HUMAN_FOOD'
  | 'ANIMAL_FOOD'
  | 'TIMBER'
  | 'MEDICINAL'
  | 'ORNAMENTAL'
  | 'HEDGING'
  | 'SHADE'
  | 'WINDBREAK'
  | 'GROUND_COVER'
  | 'HONEY'
  | 'FIBER'
  | 'OIL'
  | 'FIREWOOD'
  | 'HANDICRAFT'

export interface SpeciesFilters {
  search?: string
  stratum?: Stratum[]
  successionalStage?: SuccessionalStage[]
  lifeCycle?: LifeCycle[]
  specieType?: SpecieType[]
  foliageType?: FoliageType[]
  growthRate?: GrowthRate[]
  uses?: PlantUse[]
  nitrogenFixer?: boolean
  edibleFruit?: boolean
  service?: boolean
}

export interface SpeciesListItem {
  id: string
  slug: string
  scientificName: string
  commonNames: string[]
  stratum: Stratum
  successionalStage: SuccessionalStage
  lifeCycle: LifeCycle
  specieType: SpecieType
  foliageType?: FoliageType
  growthRate?: GrowthRate
  uses?: PlantUse[]
  nitrogenFixer?: boolean
  edibleFruit?: boolean
  service?: boolean
  heightMeters?: number
  canopyWidthMeters?: number
  imageUrl: string
}
