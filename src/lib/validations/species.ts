import { z } from 'zod'

// Photo fragment tags for identifying plant parts in images
export const PHOTO_FRAGMENT_TAGS = [
  'whole', 'leaf', 'trunk', 'fruit', 'seeds', 'flower'
] as const
export type PhotoFragmentTag = typeof PHOTO_FRAGMENT_TAGS[number]

// Helper to convert empty strings to undefined for optional enums
const optionalEnum = <T extends readonly [string, ...string[]]>(values: T) =>
  z.union([z.enum(values), z.literal('')]).transform(val => val === '' ? undefined : val).optional()

// Helper to convert empty/NaN numbers to undefined
const optionalNumber = z.preprocess(
  (val) => (val === '' || val === null || val === undefined || Number.isNaN(Number(val)) ? undefined : Number(val)),
  z.number().optional()
)

export const speciesFormSchema = z.object({
  // Nomenclature
  scientificName: z.string().min(1, 'Scientific name is required'),
  genus: z.string().optional(),
  species: z.string().optional(),
  author: z.string().optional(),
  commonNames: z.array(z.string()).min(1, 'At least one common name is required'),
  synonyms: z.array(z.string()).optional(),
  botanicalFamily: z.string().optional(),
  variety: z.string().optional(),

  // Base Data
  stratum: z.enum(['EMERGENT', 'HIGH', 'MEDIUM', 'LOW', 'GROUND']),
  successionalStage: z.enum(['PIONEER', 'EARLY_SECONDARY', 'LATE_SECONDARY', 'CLIMAX']),
  lifeCycle: optionalEnum(['ANNUAL', 'BIENNIAL', 'PERENNIAL'] as const),
  lifeCycleYearsStart: optionalNumber.pipe(z.number().min(1).max(1000).optional()),
  lifeCycleYearsEnd: optionalNumber.pipe(z.number().min(1).max(1000).optional()),
  heightMeters: optionalNumber.pipe(z.number().positive().optional()),
  canopyWidthMeters: optionalNumber.pipe(z.number().positive().optional()),
  canopyShape: optionalEnum([
    'CONICAL', 'PYRAMIDAL', 'COLUMNAR', 'ROUNDED', 'GLOBOSE',
    'OVAL', 'IRREGULAR', 'WEEPING', 'UMBRELLA', 'PALM'
  ] as const),

  // Additional Data
  originCenter: z.array(z.string()).optional(),
  globalBiome: z.array(z.string()).optional(),
  regionalBiome: z.array(z.string()).optional(),
  foliageType: optionalEnum(['EVERGREEN', 'SEMI_EVERGREEN', 'DECIDUOUS', 'SEMI_DECIDUOUS'] as const),
  leafDropSeason: z.string().optional(),
  growthRate: optionalEnum(['VERY_FAST', 'FAST', 'MEDIUM', 'SLOW', 'VERY_SLOW'] as const),
  rootSystem: optionalEnum([
    'TAPROOT', 'FIBROUS', 'TUBEROUS', 'ADVENTITIOUS',
    'PNEUMATOPHORE', 'PROP', 'MIXED'
  ] as const),
  nitrogenFixer: z.boolean().default(false),
  serviceSpecies: z.boolean().default(false),
  pruningSprout: optionalEnum(['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW', 'VERY_LOW'] as const),
  seedlingShade: optionalEnum(['FULL_SHADE', 'MUCH_SHADE', 'PARTIAL_SHADE', 'LIGHT_SHADE', 'NO_SHADE'] as const),
  biomassProduction: optionalEnum(['VERY_HIGH', 'HIGH', 'MEDIUM', 'LOW', 'VERY_LOW'] as const),
  hasFruit: z.boolean().default(false),
  edibleFruit: z.boolean().default(false),
  fruitingAgeStart: optionalNumber.pipe(z.number().min(1).max(100).optional()),
  fruitingAgeEnd: optionalNumber.pipe(z.number().min(1).max(100).optional()),

  // Uses
  uses: z.array(z.enum([
    'HUMAN_FOOD', 'ANIMAL_FOOD', 'TIMBER', 'MEDICINAL', 'ORNAMENTAL',
    'HEDGING', 'SHADE', 'WINDBREAK', 'GROUND_COVER', 'HONEY',
    'FIBER', 'OIL', 'FIREWOOD', 'HANDICRAFT'
  ])).optional(),

  // Propagation
  propagationMethods: z.array(z.string()).optional(),
  germinationDaysMin: optionalNumber.pipe(z.number().min(1).max(365).optional()),
  germinationDaysMax: optionalNumber.pipe(z.number().min(1).max(365).optional()),

  // Other
  observations: z.string().optional(),
})

export const reviewFormSchema = z.object({
  decision: z.enum(['APPROVED', 'REJECTED']),
  comments: z.string().optional(),
})

export const uploadUrlSchema = z.object({
  fileName: z.string().min(1),
  fileType: z.string().min(1),
  folder: z.string().optional(),
})

export type SpeciesFormData = z.infer<typeof speciesFormSchema>
export type ReviewFormData = z.infer<typeof reviewFormSchema>
export type UploadUrlData = z.infer<typeof uploadUrlSchema>

// List of editable species fields - derived from the form schema
// Used to ensure consistency between form, draftData, and database
export const SPECIES_EDITABLE_FIELDS = Object.keys(speciesFormSchema.shape) as (keyof SpeciesFormData)[]
