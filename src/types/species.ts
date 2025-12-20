// Stratum/Layer in the forest (matches Prisma schema)
export type Stratum = 'EMERGENT' | 'HIGH' | 'MEDIUM' | 'LOW' | 'GROUND'

// Successional stage
export type SuccessionalStage = 'PIONEER' | 'EARLY_SECONDARY' | 'LATE_SECONDARY' | 'CLIMAX'

// Life cycle
export type LifeCycle = 'ANNUAL' | 'BIENNIAL' | 'PERENNIAL'

// Foliage type
export type FoliageType = 'EVERGREEN' | 'SEMI_EVERGREEN' | 'DECIDUOUS' | 'SEMI_DECIDUOUS'

// Growth rate
export type GrowthRate = 'VERY_FAST' | 'FAST' | 'MEDIUM' | 'SLOW' | 'VERY_SLOW'

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
  lifeCycle?: LifeCycle | null
  lifeCycleYearsStart?: number | null
  lifeCycleYearsEnd?: number | null
  regionalBiome?: string[]
  globalBiome?: string | null
  foliageType?: FoliageType | null
  growthRate?: GrowthRate | null
  uses?: PlantUse[]
  nitrogenFixer?: boolean
  edibleFruit?: boolean
  serviceSpecies?: boolean
  heightMeters?: number | null
  canopyWidthMeters?: number | null
  fruitingAgeStart?: number | null
  fruitingAgeEnd?: number | null
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

// Pruning sprout response
export type PruningSprout = 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | 'VERY_LOW'

// Seedling shade tolerance
export type SeedlingShade = 'FULL_SHADE' | 'MUCH_SHADE' | 'PARTIAL_SHADE' | 'LIGHT_SHADE' | 'NO_SHADE'

export interface SpeciesDetail {
  id: string
  slug: string

  // Nomenclature
  scientificName: string
  genus?: string | null
  species?: string | null
  author?: string | null
  commonNames: string[]
  synonyms?: string[]
  botanicalFamily?: string | null
  variety?: string | null

  // Base Data
  stratum: Stratum
  successionalStage: SuccessionalStage
  lifeCycle?: LifeCycle | null
  lifeCycleYearsStart?: number | null
  lifeCycleYearsEnd?: number | null
  heightMeters?: number | null
  canopyWidthMeters?: number | null
  canopyShape?: CanopyShape | null

  // Additional Data
  originCenter?: string | null
  globalBiome?: string | null
  regionalBiome?: string[]
  foliageType?: FoliageType | null
  leafDropSeason?: string | null
  growthRate?: GrowthRate | null
  rootSystem?: RootSystem | null
  nitrogenFixer?: boolean
  serviceSpecies?: boolean
  pruningSprout?: PruningSprout | null
  seedlingShade?: SeedlingShade | null
  biomassProduction?: BiomassProduction | null
  hasFruit?: boolean
  edibleFruit?: boolean
  fruitingAgeStart?: number | null
  fruitingAgeEnd?: number | null

  // Uses
  uses?: PlantUse[]

  // Propagation
  propagationMethods?: string[]

  // Other
  observations?: string | null

  // Images
  imageUrl: string
  photos?: { url: string; tags?: string[] }[]
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
