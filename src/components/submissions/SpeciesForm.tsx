'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { speciesFormSchema, type SpeciesFormData } from '@/lib/validations/species'
import { PhotoUpload, type UploadedPhoto, validatePhotoTags } from './PhotoUpload'
import { Loader2, Plus, X, Save, Send } from 'lucide-react'

interface SpeciesFormProps {
  defaultValues?: Partial<SpeciesFormData>
  defaultPhotos?: UploadedPhoto[]
  speciesId?: string
  mode?: 'create' | 'edit'
  locale?: string
}

interface FormTranslations {
  // Section titles
  nomenclature: string
  baseData: string
  ecology: string
  fruit: string
  uses: string
  propagation: string
  observations: string
  // Nomenclature fields
  scientificName: string
  scientificNamePlaceholder: string
  genus: string
  genusPlaceholder: string
  species: string
  speciesPlaceholder: string
  author: string
  authorPlaceholder: string
  botanicalFamily: string
  botanicalFamilyPlaceholder: string
  variety: string
  varietyPlaceholder: string
  commonNames: string
  addCommonName: string
  synonyms: string
  addSynonym: string
  // Base Data fields
  stratum: string
  selectStratum: string
  successionalStage: string
  selectStage: string
  lifeCycle: string
  selectLifeCycle: string
  lifeCycleYearsStart: string
  lifeCycleYearsEnd: string
  heightMeters: string
  heightPlaceholder: string
  canopyWidthMeters: string
  canopyWidthPlaceholder: string
  canopyShape: string
  selectCanopyShape: string
  // Ecology fields
  originCenter: string
  originCenterPlaceholder: string
  globalBiome: string
  globalBiomePlaceholder: string
  regionalBiome: string
  addRegionalBiome: string
  foliageType: string
  selectFoliageType: string
  growthRate: string
  selectGrowthRate: string
  rootSystem: string
  selectRootSystem: string
  nitrogenFixer: string
  serviceSpecies: string
  serviceSpeciesHelp: string
  pruningSprout: string
  selectPruningSprout: string
  seedlingShade: string
  selectSeedlingShade: string
  biomassProduction: string
  selectBiomassProduction: string
  // Fruit fields
  hasFruit: string
  edibleFruit: string
  fruitingAgeStart: string
  fruitingAgeEnd: string
  // Propagation
  propagationMethods: string
  addPropagationMethod: string
  // Actions
  cancel: string
  saveAsDraft: string
  submitForReview: string
  observationsPlaceholder: string
}

const defaultFormTranslations: FormTranslations = {
  nomenclature: 'Nomenclature',
  baseData: 'Base Data',
  ecology: 'Ecology & Environment',
  fruit: 'Fruit',
  uses: 'Uses',
  propagation: 'Propagation',
  observations: 'Observations',
  scientificName: 'Scientific Name',
  scientificNamePlaceholder: 'e.g., Euterpe oleracea',
  genus: 'Genus',
  genusPlaceholder: 'e.g., Euterpe',
  species: 'Species',
  speciesPlaceholder: 'e.g., oleracea',
  author: 'Author',
  authorPlaceholder: 'e.g., Mart.',
  botanicalFamily: 'Botanical Family',
  botanicalFamilyPlaceholder: 'e.g., Arecaceae',
  variety: 'Variety',
  varietyPlaceholder: 'e.g., var. edulis',
  commonNames: 'Common Names',
  addCommonName: 'Add a common name',
  synonyms: 'Synonyms',
  addSynonym: 'Add a synonym',
  stratum: 'Stratum',
  selectStratum: 'Select stratum',
  successionalStage: 'Successional Stage',
  selectStage: 'Select stage',
  lifeCycle: 'Life Cycle',
  selectLifeCycle: 'Select life cycle',
  lifeCycleYearsStart: 'Duration Start (years)',
  lifeCycleYearsEnd: 'Duration End (years)',
  heightMeters: 'Height (meters)',
  heightPlaceholder: 'e.g., 25',
  canopyWidthMeters: 'Canopy Width (meters)',
  canopyWidthPlaceholder: 'e.g., 8',
  canopyShape: 'Canopy Shape',
  selectCanopyShape: 'Select canopy shape',
  originCenter: 'Origin Center',
  originCenterPlaceholder: 'e.g., South America',
  globalBiome: 'Global Biome',
  globalBiomePlaceholder: 'e.g., Tropical',
  regionalBiome: 'Regional Biomes',
  addRegionalBiome: 'Add a regional biome',
  foliageType: 'Foliage Type',
  selectFoliageType: 'Select foliage type',
  growthRate: 'Growth Rate',
  selectGrowthRate: 'Select growth rate',
  rootSystem: 'Root System',
  selectRootSystem: 'Select root system',
  nitrogenFixer: 'Nitrogen Fixer',
  serviceSpecies: 'Service Species',
  serviceSpeciesHelp: 'Good for pruning and biomass production',
  pruningSprout: 'Pruning Sprout Vigor',
  selectPruningSprout: 'Select sprout vigor after pruning',
  seedlingShade: 'Seedling Shade Requirement',
  selectSeedlingShade: 'Select shade need when young',
  biomassProduction: 'Biomass Production',
  selectBiomassProduction: 'Select biomass production',
  hasFruit: 'Has Fruit',
  edibleFruit: 'Edible Fruit',
  fruitingAgeStart: 'Fruiting Start (years)',
  fruitingAgeEnd: 'Fruiting End (years)',
  propagationMethods: 'Propagation Methods',
  addPropagationMethod: 'Add a propagation method',
  cancel: 'Cancel',
  saveAsDraft: 'Save as Draft',
  submitForReview: 'Submit for Review',
  observationsPlaceholder: 'Additional observations about this species...',
}

const ptBRTranslations: FormTranslations = {
  nomenclature: 'Nomenclatura',
  baseData: 'Dados Básicos',
  ecology: 'Ecologia e Ambiente',
  fruit: 'Fruto',
  uses: 'Usos',
  propagation: 'Propagação',
  observations: 'Observações',
  scientificName: 'Nome Científico',
  scientificNamePlaceholder: 'ex., Euterpe oleracea',
  genus: 'Gênero',
  genusPlaceholder: 'ex., Euterpe',
  species: 'Espécie',
  speciesPlaceholder: 'ex., oleracea',
  author: 'Autor',
  authorPlaceholder: 'ex., Mart.',
  botanicalFamily: 'Família Botânica',
  botanicalFamilyPlaceholder: 'ex., Arecaceae',
  variety: 'Variedade',
  varietyPlaceholder: 'ex., var. edulis',
  commonNames: 'Nomes Populares',
  addCommonName: 'Adicionar nome popular',
  synonyms: 'Sinônimos',
  addSynonym: 'Adicionar sinônimo',
  stratum: 'Estrato',
  selectStratum: 'Selecione o estrato',
  successionalStage: 'Estágio Sucessional',
  selectStage: 'Selecione o estágio',
  lifeCycle: 'Ciclo de Vida',
  selectLifeCycle: 'Selecione o ciclo de vida',
  lifeCycleYearsStart: 'Duração Início (anos)',
  lifeCycleYearsEnd: 'Duração Fim (anos)',
  heightMeters: 'Altura (metros)',
  heightPlaceholder: 'ex., 25',
  canopyWidthMeters: 'Largura da Copa (metros)',
  canopyWidthPlaceholder: 'ex., 8',
  canopyShape: 'Forma da Copa',
  selectCanopyShape: 'Selecione a forma da copa',
  originCenter: 'Centro de Origem',
  originCenterPlaceholder: 'ex., América do Sul',
  globalBiome: 'Bioma Global',
  globalBiomePlaceholder: 'ex., Tropical',
  regionalBiome: 'Biomas Regionais',
  addRegionalBiome: 'Adicionar bioma regional',
  foliageType: 'Tipo de Folhagem',
  selectFoliageType: 'Selecione o tipo de folhagem',
  growthRate: 'Taxa de Crescimento',
  selectGrowthRate: 'Selecione a taxa de crescimento',
  rootSystem: 'Sistema Radicular',
  selectRootSystem: 'Selecione o sistema radicular',
  nitrogenFixer: 'Fixa Nitrogênio',
  serviceSpecies: 'Espécie de Serviço',
  serviceSpeciesHelp: 'Boa para poda e produção de biomassa',
  pruningSprout: 'Vigor de Rebrota após Poda',
  selectPruningSprout: 'Selecione o vigor de rebrota',
  seedlingShade: 'Necessidade de Sombra (Muda)',
  selectSeedlingShade: 'Selecione a necessidade de sombra quando jovem',
  biomassProduction: 'Produção de Biomassa',
  selectBiomassProduction: 'Selecione a produção de biomassa',
  hasFruit: 'Tem Fruto',
  edibleFruit: 'Fruto Comestível',
  fruitingAgeStart: 'Frutificação Início (anos)',
  fruitingAgeEnd: 'Frutificação Fim (anos)',
  propagationMethods: 'Métodos de Propagação',
  addPropagationMethod: 'Adicionar método de propagação',
  cancel: 'Cancelar',
  saveAsDraft: 'Salvar como Rascunho',
  submitForReview: 'Submeter para Revisão',
  observationsPlaceholder: 'Observações adicionais sobre esta espécie...',
}

const esTranslations: FormTranslations = {
  nomenclature: 'Nomenclatura',
  baseData: 'Datos Básicos',
  ecology: 'Ecología y Ambiente',
  fruit: 'Fruto',
  uses: 'Usos',
  propagation: 'Propagación',
  observations: 'Observaciones',
  scientificName: 'Nombre Científico',
  scientificNamePlaceholder: 'ej., Euterpe oleracea',
  genus: 'Género',
  genusPlaceholder: 'ej., Euterpe',
  species: 'Especie',
  speciesPlaceholder: 'ej., oleracea',
  author: 'Autor',
  authorPlaceholder: 'ej., Mart.',
  botanicalFamily: 'Familia Botánica',
  botanicalFamilyPlaceholder: 'ej., Arecaceae',
  variety: 'Variedad',
  varietyPlaceholder: 'ej., var. edulis',
  commonNames: 'Nombres Comunes',
  addCommonName: 'Agregar nombre común',
  synonyms: 'Sinónimos',
  addSynonym: 'Agregar sinónimo',
  stratum: 'Estrato',
  selectStratum: 'Seleccione estrato',
  successionalStage: 'Etapa Sucesional',
  selectStage: 'Seleccione etapa',
  lifeCycle: 'Ciclo de Vida',
  selectLifeCycle: 'Seleccione ciclo de vida',
  lifeCycleYearsStart: 'Duración Inicio (años)',
  lifeCycleYearsEnd: 'Duración Fin (años)',
  heightMeters: 'Altura (metros)',
  heightPlaceholder: 'ej., 25',
  canopyWidthMeters: 'Ancho de Copa (metros)',
  canopyWidthPlaceholder: 'ej., 8',
  canopyShape: 'Forma de Copa',
  selectCanopyShape: 'Seleccione forma de copa',
  originCenter: 'Centro de Origen',
  originCenterPlaceholder: 'ej., América del Sur',
  globalBiome: 'Bioma Global',
  globalBiomePlaceholder: 'ej., Tropical',
  regionalBiome: 'Biomas Regionales',
  addRegionalBiome: 'Agregar bioma regional',
  foliageType: 'Tipo de Follaje',
  selectFoliageType: 'Seleccione tipo de follaje',
  growthRate: 'Tasa de Crecimiento',
  selectGrowthRate: 'Seleccione tasa de crecimiento',
  rootSystem: 'Sistema Radicular',
  selectRootSystem: 'Seleccione sistema radicular',
  nitrogenFixer: 'Fija Nitrógeno',
  serviceSpecies: 'Especie de Servicio',
  serviceSpeciesHelp: 'Buena para poda y producción de biomasa',
  pruningSprout: 'Vigor de Rebrote tras Poda',
  selectPruningSprout: 'Seleccione vigor de rebrote',
  seedlingShade: 'Necesidad de Sombra (Plántula)',
  selectSeedlingShade: 'Seleccione necesidad de sombra cuando joven',
  biomassProduction: 'Producción de Biomasa',
  selectBiomassProduction: 'Seleccione producción de biomasa',
  hasFruit: 'Tiene Fruto',
  edibleFruit: 'Fruto Comestible',
  fruitingAgeStart: 'Fructificación Inicio (años)',
  fruitingAgeEnd: 'Fructificación Fin (años)',
  propagationMethods: 'Métodos de Propagación',
  addPropagationMethod: 'Agregar método de propagación',
  cancel: 'Cancelar',
  saveAsDraft: 'Guardar como Borrador',
  submitForReview: 'Enviar para Revisión',
  observationsPlaceholder: 'Observaciones adicionales sobre esta especie...',
}

const formTranslationsByLocale: Record<string, FormTranslations> = {
  en: defaultFormTranslations,
  'pt-BR': ptBRTranslations,
  es: esTranslations,
}

// Option constants
const STRATUM_OPTIONS = [
  { value: 'EMERGENT', label: 'Emergent' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
  { value: 'GROUND', label: 'Ground' },
]

const SUCCESSIONAL_STAGE_OPTIONS = [
  { value: 'PIONEER', label: 'Pioneer' },
  { value: 'EARLY_SECONDARY', label: 'Early Secondary' },
  { value: 'LATE_SECONDARY', label: 'Late Secondary' },
  { value: 'CLIMAX', label: 'Climax' },
]

const LIFE_CYCLE_OPTIONS = [
  { value: 'ANNUAL', label: 'Annual' },
  { value: 'BIENNIAL', label: 'Biennial' },
  { value: 'PERENNIAL', label: 'Perennial' },
]

const CANOPY_SHAPE_OPTIONS = [
  { value: 'CONICAL', label: 'Conical' },
  { value: 'PYRAMIDAL', label: 'Pyramidal' },
  { value: 'COLUMNAR', label: 'Columnar' },
  { value: 'ROUNDED', label: 'Rounded' },
  { value: 'GLOBOSE', label: 'Globose' },
  { value: 'OVAL', label: 'Oval' },
  { value: 'IRREGULAR', label: 'Irregular' },
  { value: 'WEEPING', label: 'Weeping' },
  { value: 'UMBRELLA', label: 'Umbrella' },
  { value: 'PALM', label: 'Palm' },
]

const FOLIAGE_TYPE_OPTIONS = [
  { value: 'EVERGREEN', label: 'Evergreen' },
  { value: 'SEMI_EVERGREEN', label: 'Semi-evergreen' },
  { value: 'DECIDUOUS', label: 'Deciduous' },
  { value: 'SEMI_DECIDUOUS', label: 'Semi-deciduous' },
]

const GROWTH_RATE_OPTIONS = [
  { value: 'VERY_FAST', label: 'Very Fast' },
  { value: 'FAST', label: 'Fast' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'SLOW', label: 'Slow' },
  { value: 'VERY_SLOW', label: 'Very Slow' },
]

const ROOT_SYSTEM_OPTIONS = [
  { value: 'TAPROOT', label: 'Taproot' },
  { value: 'FIBROUS', label: 'Fibrous' },
  { value: 'TUBEROUS', label: 'Tuberous' },
  { value: 'ADVENTITIOUS', label: 'Adventitious' },
  { value: 'PNEUMATOPHORE', label: 'Pneumatophore' },
  { value: 'PROP', label: 'Prop' },
  { value: 'MIXED', label: 'Mixed' },
]

const BIOMASS_PRODUCTION_OPTIONS = [
  { value: 'VERY_HIGH', label: 'Very High' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
  { value: 'VERY_LOW', label: 'Very Low' },
]

const PRUNING_SPROUT_OPTIONS = [
  { value: 'VERY_HIGH', label: 'Very High' },
  { value: 'HIGH', label: 'High' },
  { value: 'MEDIUM', label: 'Medium' },
  { value: 'LOW', label: 'Low' },
  { value: 'VERY_LOW', label: 'Very Low' },
]

const SEEDLING_SHADE_OPTIONS = [
  { value: 'FULL_SHADE', label: 'Full Shade' },
  { value: 'MUCH_SHADE', label: 'Much Shade' },
  { value: 'PARTIAL_SHADE', label: 'Partial Shade' },
  { value: 'LIGHT_SHADE', label: 'Light Shade' },
  { value: 'NO_SHADE', label: 'No Shade (Full Sun)' },
]

const PLANT_USE_OPTIONS = [
  { value: 'HUMAN_FOOD', label: 'Human Food' },
  { value: 'ANIMAL_FOOD', label: 'Animal Food' },
  { value: 'TIMBER', label: 'Timber' },
  { value: 'MEDICINAL', label: 'Medicinal' },
  { value: 'ORNAMENTAL', label: 'Ornamental' },
  { value: 'HEDGING', label: 'Hedging' },
  { value: 'SHADE', label: 'Shade' },
  { value: 'WINDBREAK', label: 'Windbreak' },
  { value: 'GROUND_COVER', label: 'Ground Cover' },
  { value: 'HONEY', label: 'Honey' },
  { value: 'FIBER', label: 'Fiber' },
  { value: 'OIL', label: 'Oil' },
  { value: 'FIREWOOD', label: 'Firewood' },
  { value: 'HANDICRAFT', label: 'Handicraft' },
]

// Major botanical families for agroforestry
const BOTANICAL_FAMILY_OPTIONS = [
  'Arecaceae', 'Fabaceae', 'Malvaceae', 'Rutaceae', 'Musaceae',
  'Anacardiaceae', 'Myrtaceae', 'Euphorbiaceae', 'Moraceae', 'Lauraceae',
  'Sapotaceae', 'Annonaceae', 'Solanaceae', 'Cucurbitaceae', 'Poaceae',
  'Brassicaceae', 'Apiaceae', 'Asteraceae', 'Lamiaceae', 'Rosaceae',
  'Lecythidaceae', 'Meliaceae', 'Bignoniaceae', 'Rubiaceae', 'Passifloraceae',
  'Caricaceae', 'Bromeliaceae', 'Zingiberaceae', 'Sapindaceae', 'Clusiaceae',
  'Combretaceae', 'Verbenaceae', 'Caesalpiniaceae', 'Mimosaceae', 'Sterculiaceae',
  'Bombacaceae', 'Araucariaceae', 'Pinaceae', 'Cupressaceae', 'Cycadaceae',
]

// Common genera in agroforestry
const GENUS_OPTIONS = [
  'Acacia', 'Albizia', 'Anacardium', 'Annona', 'Artocarpus',
  'Bactris', 'Bixa', 'Byrsonima', 'Carica', 'Cecropia',
  'Cedrela', 'Citrus', 'Cocos', 'Coffea', 'Cordia',
  'Croton', 'Enterolobium', 'Erythrina', 'Eucalyptus', 'Euterpe',
  'Ficus', 'Genipa', 'Gliricidia', 'Guazuma', 'Hancornia',
  'Hevea', 'Hymenaea', 'Inga', 'Leucaena', 'Mangifera',
  'Manihot', 'Mauritia', 'Morus', 'Musa', 'Persea',
  'Piper', 'Psidium', 'Schinus', 'Spondias', 'Swietenia',
  'Tabebuia', 'Theobroma', 'Tipuana', 'Tectona', 'Virola',
]

// Centers of origin - countries grouped by Vavilov centers
const ORIGIN_CENTER_OPTIONS = [
  // South America
  { value: 'Brazil', label: 'Brazil' },
  { value: 'Peru', label: 'Peru' },
  { value: 'Ecuador', label: 'Ecuador' },
  { value: 'Bolivia', label: 'Bolivia' },
  { value: 'Colombia', label: 'Colombia' },
  { value: 'Venezuela', label: 'Venezuela' },
  { value: 'Argentina', label: 'Argentina' },
  { value: 'Chile', label: 'Chile' },
  { value: 'Paraguay', label: 'Paraguay' },
  // Central America & Caribbean
  { value: 'Mexico', label: 'Mexico' },
  { value: 'Guatemala', label: 'Guatemala' },
  { value: 'Costa Rica', label: 'Costa Rica' },
  { value: 'Panama', label: 'Panama' },
  { value: 'Cuba', label: 'Cuba' },
  // Africa
  { value: 'Ethiopia', label: 'Ethiopia' },
  { value: 'Nigeria', label: 'Nigeria' },
  { value: 'Cameroon', label: 'Cameroon' },
  { value: 'DR Congo', label: 'DR Congo' },
  { value: 'Kenya', label: 'Kenya' },
  { value: 'Tanzania', label: 'Tanzania' },
  { value: 'Madagascar', label: 'Madagascar' },
  { value: 'South Africa', label: 'South Africa' },
  // Asia
  { value: 'India', label: 'India' },
  { value: 'China', label: 'China' },
  { value: 'Indonesia', label: 'Indonesia' },
  { value: 'Malaysia', label: 'Malaysia' },
  { value: 'Thailand', label: 'Thailand' },
  { value: 'Vietnam', label: 'Vietnam' },
  { value: 'Philippines', label: 'Philippines' },
  { value: 'Japan', label: 'Japan' },
  { value: 'Sri Lanka', label: 'Sri Lanka' },
  { value: 'Myanmar', label: 'Myanmar' },
  // Central Asia
  { value: 'Afghanistan', label: 'Afghanistan' },
  { value: 'Pakistan', label: 'Pakistan' },
  { value: 'Iran', label: 'Iran' },
  { value: 'Turkey', label: 'Turkey' },
  // Mediterranean
  { value: 'Spain', label: 'Spain' },
  { value: 'Italy', label: 'Italy' },
  { value: 'Greece', label: 'Greece' },
  { value: 'Morocco', label: 'Morocco' },
  { value: 'Egypt', label: 'Egypt' },
  // Oceania
  { value: 'Australia', label: 'Australia' },
  { value: 'Papua New Guinea', label: 'Papua New Guinea' },
  { value: 'New Zealand', label: 'New Zealand' },
]

// WWF 14 Global Biomes
const GLOBAL_BIOME_OPTIONS = [
  { value: 'TROPICAL_MOIST_BROADLEAF', label: 'Tropical & Subtropical Moist Broadleaf Forests' },
  { value: 'TROPICAL_DRY_BROADLEAF', label: 'Tropical & Subtropical Dry Broadleaf Forests' },
  { value: 'TROPICAL_CONIFEROUS', label: 'Tropical & Subtropical Coniferous Forests' },
  { value: 'TEMPERATE_BROADLEAF', label: 'Temperate Broadleaf & Mixed Forests' },
  { value: 'TEMPERATE_CONIFER', label: 'Temperate Conifer Forests' },
  { value: 'BOREAL_TAIGA', label: 'Boreal Forests/Taiga' },
  { value: 'TROPICAL_SAVANNA', label: 'Tropical & Subtropical Grasslands, Savannas & Shrublands' },
  { value: 'TEMPERATE_GRASSLAND', label: 'Temperate Grasslands, Savannas & Shrublands' },
  { value: 'FLOODED_GRASSLAND', label: 'Flooded Grasslands & Savannas' },
  { value: 'MONTANE_GRASSLAND', label: 'Montane Grasslands & Shrublands' },
  { value: 'TUNDRA', label: 'Tundra' },
  { value: 'MEDITERRANEAN', label: 'Mediterranean Forests, Woodlands & Scrub' },
  { value: 'DESERT_XERIC', label: 'Deserts & Xeric Shrublands' },
  { value: 'MANGROVES', label: 'Mangroves' },
]

// Regional biomes grouped by country
const REGIONAL_BIOME_OPTIONS: Record<string, string[]> = {
  // Brazil
  Brazil: [
    'Amazônia', 'Cerrado', 'Mata Atlântica', 'Caatinga', 'Pantanal', 'Pampa',
  ],
  // India
  India: [
    'Western Ghats', 'Eastern Himalayas', 'Indo-Gangetic Plain', 'Deccan Plateau',
    'Thar Desert', 'Sundarbans', 'Northeast India', 'Andaman & Nicobar',
  ],
  // Indonesia
  Indonesia: [
    'Sumatra Rainforests', 'Borneo Rainforests', 'Java Forests', 'Sulawesi Forests',
    'Papua Rainforests', 'Lesser Sunda Islands', 'Indonesian Mangroves',
  ],
  // Mexico
  Mexico: [
    'Sierra Madre Occidental', 'Sierra Madre Oriental', 'Yucatan Peninsula',
    'Sonoran Desert', 'Chihuahuan Desert', 'Mexican Dry Forests', 'Gulf Coastal Plain',
  ],
  // Africa
  Ethiopia: ['Ethiopian Highlands', 'Ethiopian Rift Valley', 'Afromontane Forests'],
  'DR Congo': ['Congo Basin Rainforest', 'Albertine Rift Montane Forests'],
  'South Africa': ['Fynbos', 'Karoo', 'Savanna', 'Grassland', 'Albany Thicket'],
  // General Africa
  Africa: [
    'Congo Basin', 'Sahel', 'Miombo Woodlands', 'East African Savannas',
    'Madagascar Rainforests', 'Guinean Forests', 'Fynbos',
  ],
  // Australia
  Australia: [
    'Australian Tropical Rainforests', 'Great Barrier Reef', 'Outback',
    'Eucalyptus Forests', 'Mallee Woodlands', 'Tasmania Wilderness',
  ],
  // Southeast Asia
  'Southeast Asia': [
    'Indo-Burma Hotspot', 'Sundaland', 'Wallacea', 'Philippines Forests',
    'Mekong Delta', 'Thai-Malay Peninsula',
  ],
  // Central America
  'Central America': [
    'Mesoamerican Forests', 'Central American Pine-Oak', 'Caribbean Islands',
    'Petén-Veracruz Moist Forests', 'Pacific Dry Forests',
  ],
  // South America (other)
  'South America': [
    'Chocó-Darién', 'Andes Montane Forests', 'Patagonia', 'Gran Chaco',
    'Llanos', 'Yungas', 'Atlantic Forest', 'Guiana Highlands',
  ],
}

// Propagation methods
const PROPAGATION_METHOD_OPTIONS = [
  { value: 'SEED', label: 'Seeds' },
  { value: 'CUTTING', label: 'Stem Cuttings' },
  { value: 'GRAFTING', label: 'Grafting' },
  { value: 'AIR_LAYERING', label: 'Air Layering' },
  { value: 'DIVISION', label: 'Division' },
  { value: 'TISSUE_CULTURE', label: 'Tissue Culture' },
  { value: 'BULB', label: 'Bulbs' },
  { value: 'TUBER', label: 'Tubers' },
  { value: 'RHIZOME', label: 'Rhizomes' },
  { value: 'STOLON', label: 'Stolons/Runners' },
  { value: 'SUCKER', label: 'Suckers' },
  { value: 'ROOT_CUTTING', label: 'Root Cuttings' },
  { value: 'LAYERING', label: 'Ground Layering' },
  { value: 'BUDDING', label: 'Budding' },
]

// Translations for enum options
const stratumTranslations: Record<string, Record<string, string>> = {
  en: { EMERGENT: 'Emergent', HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low', GROUND: 'Ground' },
  'pt-BR': { EMERGENT: 'Emergente', HIGH: 'Alto', MEDIUM: 'Médio', LOW: 'Baixo', GROUND: 'Rasteiro' },
  es: { EMERGENT: 'Emergente', HIGH: 'Alto', MEDIUM: 'Medio', LOW: 'Bajo', GROUND: 'Rastrero' },
}

const successionalStageTranslations: Record<string, Record<string, string>> = {
  en: { PIONEER: 'Pioneer', EARLY_SECONDARY: 'Early Secondary', LATE_SECONDARY: 'Late Secondary', CLIMAX: 'Climax' },
  'pt-BR': { PIONEER: 'Pioneira', EARLY_SECONDARY: 'Secundária Inicial', LATE_SECONDARY: 'Secundária Tardia', CLIMAX: 'Clímax' },
  es: { PIONEER: 'Pionera', EARLY_SECONDARY: 'Secundaria Temprana', LATE_SECONDARY: 'Secundaria Tardía', CLIMAX: 'Clímax' },
}

const lifeCycleTranslations: Record<string, Record<string, string>> = {
  en: { ANNUAL: 'Annual', BIENNIAL: 'Biennial', PERENNIAL: 'Perennial' },
  'pt-BR': { ANNUAL: 'Anual', BIENNIAL: 'Bienal', PERENNIAL: 'Perene' },
  es: { ANNUAL: 'Anual', BIENNIAL: 'Bienal', PERENNIAL: 'Perenne' },
}

const canopyShapeTranslations: Record<string, Record<string, string>> = {
  en: { CONICAL: 'Conical', PYRAMIDAL: 'Pyramidal', COLUMNAR: 'Columnar', ROUNDED: 'Rounded', GLOBOSE: 'Globose', OVAL: 'Oval', IRREGULAR: 'Irregular', WEEPING: 'Weeping', UMBRELLA: 'Umbrella', PALM: 'Palm' },
  'pt-BR': { CONICAL: 'Cônica', PYRAMIDAL: 'Piramidal', COLUMNAR: 'Colunar', ROUNDED: 'Arredondada', GLOBOSE: 'Globosa', OVAL: 'Oval', IRREGULAR: 'Irregular', WEEPING: 'Chorona', UMBRELLA: 'Guarda-chuva', PALM: 'Palmeira' },
  es: { CONICAL: 'Cónica', PYRAMIDAL: 'Piramidal', COLUMNAR: 'Columnar', ROUNDED: 'Redondeada', GLOBOSE: 'Globosa', OVAL: 'Oval', IRREGULAR: 'Irregular', WEEPING: 'Llorona', UMBRELLA: 'Paraguas', PALM: 'Palma' },
}

const foliageTypeTranslations: Record<string, Record<string, string>> = {
  en: { EVERGREEN: 'Evergreen', SEMI_EVERGREEN: 'Semi-evergreen', DECIDUOUS: 'Deciduous', SEMI_DECIDUOUS: 'Semi-deciduous' },
  'pt-BR': { EVERGREEN: 'Perene', SEMI_EVERGREEN: 'Semi-perene', DECIDUOUS: 'Caduca', SEMI_DECIDUOUS: 'Semi-caduca' },
  es: { EVERGREEN: 'Perenne', SEMI_EVERGREEN: 'Semi-Perenne', DECIDUOUS: 'Caduca', SEMI_DECIDUOUS: 'Semi-Caduca' },
}

const growthRateTranslations: Record<string, Record<string, string>> = {
  en: { VERY_FAST: 'Very Fast', FAST: 'Fast', MEDIUM: 'Medium', SLOW: 'Slow', VERY_SLOW: 'Very Slow' },
  'pt-BR': { VERY_FAST: 'Muito Rápido', FAST: 'Rápido', MEDIUM: 'Médio', SLOW: 'Lento', VERY_SLOW: 'Muito Lento' },
  es: { VERY_FAST: 'Muy Rápido', FAST: 'Rápido', MEDIUM: 'Medio', SLOW: 'Lento', VERY_SLOW: 'Muy Lento' },
}

const rootSystemTranslations: Record<string, Record<string, string>> = {
  en: { TAPROOT: 'Taproot', FIBROUS: 'Fibrous', TUBEROUS: 'Tuberous', ADVENTITIOUS: 'Adventitious', PNEUMATOPHORE: 'Pneumatophore', PROP: 'Prop', MIXED: 'Mixed' },
  'pt-BR': { TAPROOT: 'Pivotante', FIBROUS: 'Fasciculada', TUBEROUS: 'Tuberosa', ADVENTITIOUS: 'Adventícia', PNEUMATOPHORE: 'Pneumatófora', PROP: 'Escora', MIXED: 'Mista' },
  es: { TAPROOT: 'Pivotante', FIBROUS: 'Fibrosa', TUBEROUS: 'Tuberosa', ADVENTITIOUS: 'Adventicia', PNEUMATOPHORE: 'Neumatófora', PROP: 'Puntal', MIXED: 'Mixta' },
}

const biomassProductionTranslations: Record<string, Record<string, string>> = {
  en: { VERY_HIGH: 'Very High', HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low', VERY_LOW: 'Very Low' },
  'pt-BR': { VERY_HIGH: 'Muito Alta', HIGH: 'Alta', MEDIUM: 'Média', LOW: 'Baixa', VERY_LOW: 'Muito Baixa' },
  es: { VERY_HIGH: 'Muy Alta', HIGH: 'Alta', MEDIUM: 'Media', LOW: 'Baja', VERY_LOW: 'Muy Baja' },
}

const pruningSproutTranslations: Record<string, Record<string, string>> = {
  en: { VERY_HIGH: 'Very High', HIGH: 'High', MEDIUM: 'Medium', LOW: 'Low', VERY_LOW: 'Very Low' },
  'pt-BR': { VERY_HIGH: 'Muito Alto', HIGH: 'Alto', MEDIUM: 'Médio', LOW: 'Baixo', VERY_LOW: 'Muito Baixo' },
  es: { VERY_HIGH: 'Muy Alto', HIGH: 'Alto', MEDIUM: 'Medio', LOW: 'Bajo', VERY_LOW: 'Muy Bajo' },
}

const seedlingShadeTranslations: Record<string, Record<string, string>> = {
  en: { FULL_SHADE: 'Full Shade', MUCH_SHADE: 'Much Shade', PARTIAL_SHADE: 'Partial Shade', LIGHT_SHADE: 'Light Shade', NO_SHADE: 'No Shade (Full Sun)' },
  'pt-BR': { FULL_SHADE: 'Sombra Total', MUCH_SHADE: 'Muita Sombra', PARTIAL_SHADE: 'Meia Sombra', LIGHT_SHADE: 'Pouca Sombra', NO_SHADE: 'Sem Sombra (Sol Pleno)' },
  es: { FULL_SHADE: 'Sombra Total', MUCH_SHADE: 'Mucha Sombra', PARTIAL_SHADE: 'Sombra Parcial', LIGHT_SHADE: 'Poca Sombra', NO_SHADE: 'Sin Sombra (Sol Pleno)' },
}

const plantUseTranslations: Record<string, Record<string, string>> = {
  en: { HUMAN_FOOD: 'Human Food', ANIMAL_FOOD: 'Animal Food', TIMBER: 'Timber', MEDICINAL: 'Medicinal', ORNAMENTAL: 'Ornamental', HEDGING: 'Hedging', SHADE: 'Shade', WINDBREAK: 'Windbreak', GROUND_COVER: 'Ground Cover', HONEY: 'Honey', FIBER: 'Fiber', OIL: 'Oil', FIREWOOD: 'Firewood', HANDICRAFT: 'Handicraft' },
  'pt-BR': { HUMAN_FOOD: 'Alimentação Humana', ANIMAL_FOOD: 'Alimentação Animal', TIMBER: 'Madeira', MEDICINAL: 'Medicinal', ORNAMENTAL: 'Ornamental', HEDGING: 'Cerca Viva', SHADE: 'Sombra', WINDBREAK: 'Quebra-vento', GROUND_COVER: 'Cobertura do Solo', HONEY: 'Mel', FIBER: 'Fibra', OIL: 'Óleo', FIREWOOD: 'Lenha', HANDICRAFT: 'Artesanato' },
  es: { HUMAN_FOOD: 'Alimentación Humana', ANIMAL_FOOD: 'Alimentación Animal', TIMBER: 'Madera', MEDICINAL: 'Medicinal', ORNAMENTAL: 'Ornamental', HEDGING: 'Seto Vivo', SHADE: 'Sombra', WINDBREAK: 'Cortaviento', GROUND_COVER: 'Cobertura del Suelo', HONEY: 'Miel', FIBER: 'Fibra', OIL: 'Aceite', FIREWOOD: 'Leña', HANDICRAFT: 'Artesanía' },
}

const propagationMethodTranslations: Record<string, Record<string, string>> = {
  en: { SEED: 'Seeds', CUTTING: 'Stem Cuttings', GRAFTING: 'Grafting', AIR_LAYERING: 'Air Layering', DIVISION: 'Division', TISSUE_CULTURE: 'Tissue Culture', BULB: 'Bulbs', TUBER: 'Tubers', RHIZOME: 'Rhizomes', STOLON: 'Stolons/Runners', SUCKER: 'Suckers', ROOT_CUTTING: 'Root Cuttings', LAYERING: 'Ground Layering', BUDDING: 'Budding' },
  'pt-BR': { SEED: 'Sementes', CUTTING: 'Estacas', GRAFTING: 'Enxertia', AIR_LAYERING: 'Alporquia', DIVISION: 'Divisão', TISSUE_CULTURE: 'Cultura de Tecidos', BULB: 'Bulbos', TUBER: 'Tubérculos', RHIZOME: 'Rizomas', STOLON: 'Estolões', SUCKER: 'Rebentos', ROOT_CUTTING: 'Estacas de Raiz', LAYERING: 'Mergulhia', BUDDING: 'Borbulhia' },
  es: { SEED: 'Semillas', CUTTING: 'Esquejes', GRAFTING: 'Injerto', AIR_LAYERING: 'Acodo Aéreo', DIVISION: 'División', TISSUE_CULTURE: 'Cultivo de Tejidos', BULB: 'Bulbos', TUBER: 'Tubérculos', RHIZOME: 'Rizomas', STOLON: 'Estolones', SUCKER: 'Retoños', ROOT_CUTTING: 'Esquejes de Raíz', LAYERING: 'Acodo Terrestre', BUDDING: 'Injerto de Yema' },
}

// Array field component for reuse
function ArrayFieldInput({
  id,
  values,
  onAdd,
  onRemove,
  placeholder,
  addLabel,
}: {
  id: string
  values: string[]
  onAdd: (value: string) => void
  onRemove: (index: number) => void
  placeholder: string
  addLabel: string
}) {
  const handleAdd = () => {
    const input = document.getElementById(id) as HTMLInputElement
    if (input?.value.trim()) {
      onAdd(input.value.trim())
      input.value = ''
    }
  }

  return (
    <div>
      <div className="flex gap-2 mb-2">
        <Input
          id={id}
          placeholder={placeholder}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAdd())}
        />
        <Button type="button" onClick={handleAdd} variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {values.map((value, index) => (
            <span
              key={index}
              className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
            >
              {value}
              <button
                type="button"
                onClick={() => onRemove(index)}
                className="hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

export function SpeciesForm({ defaultValues, defaultPhotos = [], speciesId, mode = 'create', locale = 'en' }: SpeciesFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitAction, setSubmitAction] = useState<'draft' | 'review'>('draft')
  const [error, setError] = useState<string | null>(null)
  const [photos, setPhotos] = useState<UploadedPhoto[]>(defaultPhotos)

  // Get translations for current locale
  const t = formTranslationsByLocale[locale] || defaultFormTranslations
  const tStratum = stratumTranslations[locale] || stratumTranslations.en
  const tStage = successionalStageTranslations[locale] || successionalStageTranslations.en
  const tLifeCycle = lifeCycleTranslations[locale] || lifeCycleTranslations.en
  const tCanopyShape = canopyShapeTranslations[locale] || canopyShapeTranslations.en
  const tFoliage = foliageTypeTranslations[locale] || foliageTypeTranslations.en
  const tGrowth = growthRateTranslations[locale] || growthRateTranslations.en
  const tRootSystem = rootSystemTranslations[locale] || rootSystemTranslations.en
  const tBiomass = biomassProductionTranslations[locale] || biomassProductionTranslations.en
  const tUse = plantUseTranslations[locale] || plantUseTranslations.en
  const tPropagation = propagationMethodTranslations[locale] || propagationMethodTranslations.en
  const tPruningSprout = pruningSproutTranslations[locale] || pruningSproutTranslations.en
  const tSeedlingShade = seedlingShadeTranslations[locale] || seedlingShadeTranslations.en

  const form = useForm<SpeciesFormData>({
    resolver: zodResolver(speciesFormSchema) as any,
    defaultValues: {
      commonNames: [],
      originCenter: [],
      globalBiome: [],
      regionalBiome: [],
      uses: [],
      propagationMethods: [],
      nitrogenFixer: false,
      serviceSpecies: false,
      hasFruit: false,
      edibleFruit: false,
      ...defaultValues,
    },
  })

  const { register, handleSubmit, watch, setValue, formState: { errors } } = form

  // Array field values
  const commonNames = watch('commonNames') || []
  const originCenter = watch('originCenter') || []
  const globalBiome = watch('globalBiome') || []
  const regionalBiome = watch('regionalBiome') || []
  const propagationMethods = watch('propagationMethods') || []
  const uses = watch('uses') || []

  const toggleUse = (use: string) => {
    const currentUses = uses as string[]
    if (currentUses.includes(use)) {
      setValue('uses', currentUses.filter(u => u !== use) as SpeciesFormData['uses'])
    } else {
      setValue('uses', [...currentUses, use] as SpeciesFormData['uses'])
    }
  }

  const onSubmit = async (data: SpeciesFormData) => {
    setIsSubmitting(true)
    setError(null)

    // Validate photo tags before submission
    if (photos.length > 0 && !validatePhotoTags(photos)) {
      setError(locale === 'pt-BR'
        ? 'Todas as fotos precisam ter ao menos uma parte da planta selecionada'
        : locale === 'es'
        ? 'Todas las fotos deben tener al menos una parte de la planta seleccionada'
        : 'All photos must have at least one plant part selected')
      setIsSubmitting(false)
      return
    }

    try {
      const url = mode === 'create'
        ? '/api/species/submissions'
        : `/api/species/submissions/${speciesId}`

      const response = await fetch(url, {
        method: mode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to save species')
      }

      const species = await response.json()

      // Save photos if any
      if (photos.length > 0) {
        const photosResponse = await fetch(`/api/species/submissions/${species.id}/photos`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(photos),
        })

        if (!photosResponse.ok) {
          console.error('Failed to save photos')
        }
      }

      // If submitting for review
      if (submitAction === 'review') {
        const submitResponse = await fetch(`/api/species/submissions/${species.id}/submit`, {
          method: 'POST',
        })

        if (!submitResponse.ok) {
          const result = await submitResponse.json()
          throw new Error(result.error || 'Failed to submit for review')
        }
      }

      router.push('/contributions')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {error && (
        <div className="p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Nomenclature Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t.nomenclature}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                {t.commonNames} *
              </label>
              <ArrayFieldInput
                id="newCommonName"
                values={commonNames}
                onAdd={(value) => setValue('commonNames', [...commonNames, value])}
                onRemove={(index) => setValue('commonNames', commonNames.filter((_, i) => i !== index))}
                placeholder={t.addCommonName}
                addLabel={t.addCommonName}
              />
              {errors.commonNames && (
                <p className="text-red-500 text-sm mt-1">{errors.commonNames.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                {t.scientificName}
              </label>
              <Input
                {...register('scientificName')}
                placeholder={t.scientificNamePlaceholder}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t.botanicalFamily}</label>
              <Input {...register('botanicalFamily')} list="botanical-families" placeholder={t.botanicalFamilyPlaceholder} />
              <datalist id="botanical-families">
                {BOTANICAL_FAMILY_OPTIONS.map(family => (
                  <option key={family} value={family} />
                ))}
              </datalist>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.genus}</label>
              <Input {...register('genus')} list="genera" placeholder={t.genusPlaceholder} />
              <datalist id="genera">
                {GENUS_OPTIONS.map(genus => (
                  <option key={genus} value={genus} />
                ))}
              </datalist>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t.species}</label>
              <Input {...register('species')} placeholder={t.speciesPlaceholder} />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.variety}</label>
              <Input {...register('variety')} placeholder={t.varietyPlaceholder} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Base Data Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t.baseData}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t.stratum} *</label>
              <select
                {...register('stratum')}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{t.selectStratum}</option>
                {STRATUM_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{tStratum[opt.value] || opt.label}</option>
                ))}
              </select>
              {errors.stratum && (
                <p className="text-red-500 text-sm mt-1">{errors.stratum.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t.successionalStage} *</label>
              <select
                {...register('successionalStage')}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{t.selectStage}</option>
                {SUCCESSIONAL_STAGE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{tStage[opt.value] || opt.label}</option>
                ))}
              </select>
              {errors.successionalStage && (
                <p className="text-red-500 text-sm mt-1">{errors.successionalStage.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t.lifeCycle}</label>
              <select
                {...register('lifeCycle')}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{t.selectLifeCycle}</option>
                {LIFE_CYCLE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{tLifeCycle[opt.value] || opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t.lifeCycleYearsStart}</label>
              <Input
                type="number"
                min={1}
                max={1000}
                {...register('lifeCycleYearsStart')}
                placeholder="1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t.lifeCycleYearsEnd}</label>
              <Input
                type="number"
                min={1}
                max={1000}
                {...register('lifeCycleYearsEnd')}
                placeholder="1000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t.canopyShape}</label>
              <select
                {...register('canopyShape')}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{t.selectCanopyShape}</option>
                {CANOPY_SHAPE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{tCanopyShape[opt.value] || opt.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t.heightMeters}</label>
              <Input
                type="number"
                step="0.1"
                {...register('heightMeters')}
                placeholder={t.heightPlaceholder}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t.canopyWidthMeters}</label>
              <Input
                type="number"
                step="0.1"
                {...register('canopyWidthMeters')}
                placeholder={t.canopyWidthPlaceholder}
              />
            </div>
          </div>

          {/* Syntropic Agriculture Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nitrogen Fixer - Highlighted */}
            <div className="p-4 bg-green-50 border-2 border-green-500 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={watch('nitrogenFixer')}
                  onCheckedChange={(checked) => setValue('nitrogenFixer', !!checked)}
                  className="h-5 w-5 border-green-500 data-[state=checked]:bg-green-600"
                />
                <div>
                  <span className="text-base font-semibold text-green-800">{t.nitrogenFixer}</span>
                  <p className="text-xs text-green-600 mt-0.5">Important for syntropic agriculture systems</p>
                </div>
              </label>
            </div>

            {/* Service Species - Highlighted */}
            <div className="p-4 bg-amber-50 border-2 border-amber-500 rounded-lg">
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox
                  checked={watch('serviceSpecies')}
                  onCheckedChange={(checked) => setValue('serviceSpecies', !!checked)}
                  className="h-5 w-5 border-amber-500 data-[state=checked]:bg-amber-600"
                />
                <div>
                  <span className="text-base font-semibold text-amber-800">{t.serviceSpecies}</span>
                  <p className="text-xs text-amber-600 mt-0.5">{t.serviceSpeciesHelp}</p>
                </div>
              </label>
            </div>
          </div>

          {/* Pruning Sprout Vigor - shows when service species is checked */}
          {watch('serviceSpecies') && (
            <div className="p-4 bg-amber-50/50 border border-amber-300 rounded-lg">
              <label className="block text-sm font-medium mb-2 text-amber-800">{t.pruningSprout}</label>
              <select
                {...register('pruningSprout')}
                className="w-full max-w-xs px-3 py-2 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
              >
                <option value="">{t.selectPruningSprout}</option>
                {PRUNING_SPROUT_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{tPruningSprout[opt.value] || opt.label}</option>
                ))}
              </select>
            </div>
          )}

          {/* Seedling Shade Requirement - Highlighted */}
          <div className="p-4 bg-sky-50 border-2 border-sky-400 rounded-lg">
            <label className="block text-sm font-semibold mb-2 text-sky-800">{t.seedlingShade}</label>
            <select
              {...register('seedlingShade')}
              className="w-full max-w-xs px-3 py-2 border border-sky-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white"
            >
              <option value="">{t.selectSeedlingShade}</option>
              {SEEDLING_SHADE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{tSeedlingShade[opt.value] || opt.label}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Ecology Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t.ecology}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">{t.originCenter}</label>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2 p-3 border rounded-md max-h-48 overflow-y-auto">
              {ORIGIN_CENTER_OPTIONS.map(opt => (
                <label key={opt.value} className="flex items-center gap-1">
                  <Checkbox
                    checked={originCenter.includes(opt.value)}
                    onCheckedChange={(checked) => {
                      if (checked) {
                        setValue('originCenter', [...originCenter, opt.value])
                      } else {
                        setValue('originCenter', originCenter.filter(c => c !== opt.value))
                      }
                    }}
                  />
                  <span className="text-xs">{opt.label}</span>
                </label>
              ))}
            </div>
            {originCenter.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {originCenter.map((country, index) => (
                  <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                    {country}
                    <button type="button" onClick={() => setValue('originCenter', originCenter.filter((_, i) => i !== index))} className="hover:text-red-500">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Biomes Container */}
          <div className="p-4 border rounded-lg space-y-4 bg-slate-50">
            <div>
              <label className="block text-sm font-semibold mb-2">{t.globalBiome}</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-3 border rounded-md bg-white">
                {GLOBAL_BIOME_OPTIONS.map(opt => (
                  <label key={opt.value} className="flex items-center gap-2">
                    <Checkbox
                      checked={globalBiome.includes(opt.value)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setValue('globalBiome', [...globalBiome, opt.value])
                        } else {
                          setValue('globalBiome', globalBiome.filter(b => b !== opt.value))
                        }
                      }}
                    />
                    <span className="text-xs">{opt.label}</span>
                  </label>
                ))}
              </div>
              {globalBiome.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {globalBiome.map((biome, index) => {
                    const biomeLabel = GLOBAL_BIOME_OPTIONS.find(o => o.value === biome)?.label || biome
                    return (
                      <span key={index} className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm">
                        {biomeLabel}
                        <button type="button" onClick={() => setValue('globalBiome', globalBiome.filter((_, i) => i !== index))} className="hover:text-red-500">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="border-t pt-4">
              <label className="block text-sm font-semibold mb-2">{t.regionalBiome}</label>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 p-3 border rounded-md bg-white max-h-64 overflow-y-auto">
                {Object.entries(REGIONAL_BIOME_OPTIONS).map(([country, biomes]) => (
                  <div key={country} className="space-y-1">
                    <p className="text-xs font-semibold text-muted-foreground border-b pb-1">{country}</p>
                    {biomes.map(biome => (
                      <label key={biome} className="flex items-center gap-1 text-sm">
                        <Checkbox
                          checked={regionalBiome.includes(biome)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setValue('regionalBiome', [...regionalBiome, biome])
                            } else {
                              setValue('regionalBiome', regionalBiome.filter(b => b !== biome))
                            }
                          }}
                        />
                        <span className="text-xs">{biome}</span>
                      </label>
                    ))}
                  </div>
                ))}
              </div>
              {regionalBiome.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {regionalBiome.map((biome, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-primary/10 text-primary rounded-md text-sm"
                    >
                      {biome}
                      <button
                        type="button"
                        onClick={() => setValue('regionalBiome', regionalBiome.filter((_, i) => i !== index))}
                        className="hover:text-red-500"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">{t.foliageType}</label>
            <select
              {...register('foliageType')}
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">{t.selectFoliageType}</option>
              {FOLIAGE_TYPE_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{tFoliage[opt.value] || opt.label}</option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">{t.growthRate}</label>
              <select
                {...register('growthRate')}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{t.selectGrowthRate}</option>
                {GROWTH_RATE_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{tGrowth[opt.value] || opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t.rootSystem}</label>
              <select
                {...register('rootSystem')}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{t.selectRootSystem}</option>
                {ROOT_SYSTEM_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{tRootSystem[opt.value] || opt.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">{t.biomassProduction}</label>
              <select
                {...register('biomassProduction')}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              >
                <option value="">{t.selectBiomassProduction}</option>
                {BIOMASS_PRODUCTION_OPTIONS.map(opt => (
                  <option key={opt.value} value={opt.value}>{tBiomass[opt.value] || opt.label}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Fruit Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t.fruit}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-6">
            <label className="flex items-center gap-2">
              <Checkbox
                checked={watch('hasFruit')}
                onCheckedChange={(checked) => setValue('hasFruit', !!checked)}
              />
              <span className="text-sm">{t.hasFruit}</span>
            </label>

            <label className="flex items-center gap-2">
              <Checkbox
                checked={watch('edibleFruit')}
                onCheckedChange={(checked) => setValue('edibleFruit', !!checked)}
              />
              <span className="text-sm">{t.edibleFruit}</span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-md">
            <div>
              <label className="block text-sm font-medium mb-1">{t.fruitingAgeStart}</label>
              <Input
                type="number"
                min={1}
                max={100}
                {...register('fruitingAgeStart')}
                placeholder="1"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">{t.fruitingAgeEnd}</label>
              <Input
                type="number"
                min={1}
                max={100}
                {...register('fruitingAgeEnd')}
                placeholder="100"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Uses Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t.uses}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {PLANT_USE_OPTIONS.map(use => (
              <label key={use.value} className="flex items-center gap-2">
                <Checkbox
                  checked={(uses as string[]).includes(use.value)}
                  onCheckedChange={() => toggleUse(use.value)}
                />
                <span className="text-sm">{tUse[use.value] || use.label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Propagation Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t.propagation}</CardTitle>
        </CardHeader>
        <CardContent>
          <label className="block text-sm font-medium mb-2">{t.propagationMethods}</label>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {PROPAGATION_METHOD_OPTIONS.map(method => (
              <label key={method.value} className="flex items-center gap-2">
                <Checkbox
                  checked={propagationMethods.includes(method.value)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setValue('propagationMethods', [...propagationMethods, method.value])
                    } else {
                      setValue('propagationMethods', propagationMethods.filter(m => m !== method.value))
                    }
                  }}
                />
                <span className="text-sm">{tPropagation[method.value] || method.label}</span>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Observations */}
      <Card>
        <CardHeader>
          <CardTitle>{t.observations}</CardTitle>
        </CardHeader>
        <CardContent>
          <textarea
            {...register('observations')}
            className="w-full min-h-[150px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={t.observationsPlaceholder}
          />
        </CardContent>
      </Card>

      {/* Photos */}
      <PhotoUpload
        photos={photos}
        onPhotosChange={setPhotos}
        speciesId={speciesId}
        locale={locale}
      />

      {/* Form Actions */}
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={isSubmitting}
        >
          {t.cancel}
        </Button>

        <Button
          type="submit"
          variant="outline"
          disabled={isSubmitting}
          onClick={() => setSubmitAction('draft')}
        >
          {isSubmitting && submitAction === 'draft' ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Save className="h-4 w-4 mr-2" />
          )}
          {t.saveAsDraft}
        </Button>

        <Button
          type="submit"
          disabled={isSubmitting}
          onClick={() => setSubmitAction('review')}
        >
          {isSubmitting && submitAction === 'review' ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Send className="h-4 w-4 mr-2" />
          )}
          {t.submitForReview}
        </Button>
      </div>
    </form>
  )
}
