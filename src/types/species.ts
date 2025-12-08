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

// Regional biomes (major global and regional biomes)
export type RegionalBiome =
  // Tropical
  | 'AMAZON'
  | 'ATLANTIC_FOREST'
  | 'TROPICAL_RAINFOREST'
  | 'TROPICAL_DRY_FOREST'
  | 'TROPICAL_SAVANNA'
  | 'CERRADO'
  | 'CAATINGA'
  | 'PANTANAL'
  | 'MANGROVE'
  // Subtropical
  | 'SUBTROPICAL_FOREST'
  | 'SUBTROPICAL_GRASSLAND'
  // Temperate
  | 'TEMPERATE_FOREST'
  | 'TEMPERATE_GRASSLAND'
  | 'PAMPA'
  | 'MEDITERRANEAN'
  | 'CHAPARRAL'
  // Boreal
  | 'BOREAL_FOREST'
  | 'TAIGA'
  // Cold
  | 'TUNDRA'
  | 'ALPINE'
  // Arid
  | 'DESERT'
  | 'SEMI_ARID'

// Global biomes
export type GlobalBiome =
  | 'TROPICAL_RAINFOREST'
  | 'TROPICAL_DRY_FOREST'
  | 'TROPICAL_SAVANNA'
  | 'SUBTROPICAL_FOREST'
  | 'SUBTROPICAL_GRASSLAND'
  | 'TEMPERATE_FOREST'
  | 'TEMPERATE_GRASSLAND'
  | 'MEDITERRANEAN'
  | 'BOREAL_FOREST'
  | 'TUNDRA'
  | 'DESERT'
  | 'MANGROVE'

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
  regionalBiome?: RegionalBiome[]
  globalBiome?: GlobalBiome[]
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
  lifeCycleYears?: { min: number; max: number }
  specieType: SpecieType
  regionalBiome?: RegionalBiome[]
  globalBiome?: GlobalBiome[]
  foliageType?: FoliageType
  growthRate?: GrowthRate
  uses?: PlantUse[]
  nitrogenFixer?: boolean
  edibleFruit?: boolean
  service?: boolean
  heightMeters?: number
  canopyWidthMeters?: number
  fruitingAge?: { min: number; max: number }
  imageUrl: string
}

// Canopy shapes
export type CanopyShape =
  | 'CONICAL'
  | 'PYRAMIDAL'
  | 'COLUMNAR'
  | 'ROUNDED'
  | 'GLOBOSE'
  | 'OVAL'
  | 'IRREGULAR'
  | 'WEEPING'
  | 'UMBRELLA'
  | 'PALM'

// Root systems
export type RootSystem =
  | 'TAPROOT'
  | 'FIBROUS'
  | 'TUBEROUS'
  | 'ADVENTITIOUS'
  | 'PNEUMATOPHORE'
  | 'PROP'
  | 'MIXED'

// Biomass production
export type BiomassProduction = 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | 'VERY_LOW'

export interface SpeciesDetail {
  id: string
  slug: string

  // Nomenclature
  scientificName: string
  genus?: string
  species?: string
  author?: string
  commonNames: string[]
  synonyms?: string[]
  botanicalFamily?: string
  variety?: string

  // Base Data
  stratum: Stratum
  successionalStage: SuccessionalStage
  lifeCycle?: LifeCycle
  lifeCycleYears?: { min: number; max: number }
  heightMeters?: number
  canopyWidthMeters?: number
  canopyShape?: CanopyShape
  specieType?: SpecieType

  // Additional Data
  originCenter?: string
  globalBiome?: GlobalBiome
  regionalBiome?: RegionalBiome[]
  foliageType?: FoliageType
  leafDropSeason?: string
  growthRate?: GrowthRate
  rootSystem?: RootSystem
  nitrogenFixer?: boolean
  biomassProduction?: BiomassProduction
  hasFruit?: boolean
  edibleFruit?: boolean
  fruitingAge?: { min: number; max: number }

  // Uses
  uses?: PlantUse[]

  // Propagation
  propagationMethods?: string[]

  // Other
  observations?: string

  // Images
  imageUrl: string
  images?: string[]
  service?: boolean
}

// Search result type for API responses
export interface SearchResult {
  id: string
  slug: string
  scientificName: string
  commonNames: string[]
  stratum: Stratum
  successionalStage: SuccessionalStage
  imageUrl: string
  heightMeters: number | null
  edibleFruit: boolean
}
