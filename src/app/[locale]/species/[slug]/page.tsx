import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Card } from '@/components/ui/card'
import {
  TreeDeciduous,
  Clock,
  Apple,
  Sprout,
  Trees,
  MapPin,
  Hammer,
  FileText,
  ArrowLeft,
  Layers,
  TrendingUp,
  FlaskConical,
  Camera,
  AlertCircle
} from 'lucide-react'
import { type SpeciesDetail } from '@/types/species'
import { getTranslations } from '@/lib/getTranslations'
import { prisma } from '@/lib/prisma'
import { getSession } from '@/lib/auth/server'
import { RequestRevisionButton } from '@/components/species/RequestRevisionButton'
import { SubmitPhotoButton } from '@/components/species/SubmitPhotoButton'
import { ImageGallery } from '@/components/species/ImageGallery'

// Extended type to include status for revision button check
interface SpeciesDetailWithStatus extends SpeciesDetail {
  status: string
  isUnderRevision: boolean
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const getMockSpecies = (slug: string): SpeciesDetail | null => {
  // Mock data kept for reference but not used - page uses getSpeciesFromDb
  const species = {
    'hymenaea-courbaril': {
      id: '1',
      slug: 'hymenaea-courbaril',
      scientificName: 'Hymenaea courbaril',
      genus: 'Hymenaea',
      species: 'courbaril',
      author: 'L.',
      commonNames: ['Jatobá', 'Courbaril', 'Brazilian Cherry'],
      synonyms: ['Hymenaea stilbocarpa', 'Inga megacarpa'],
      botanicalFamily: 'Fabaceae',
      variety: undefined,
      stratum: 'EMERGENT',
      successionalStage: 'LATE_SECONDARY',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 100, max: 300 },
      heightMeters: 20,
      canopyWidthMeters: 12,
      canopyShape: 'ROUNDED',
      specieType: 'TREE',
      originCenter: 'Central and South America',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['AMAZON', 'ATLANTIC_FOREST', 'CERRADO'],
      foliageType: 'SEMI_DECIDUOUS',
      leafDropSeason: 'Dry season (partial)',
      growthRate: 'SLOW',
      rootSystem: 'TAPROOT',
      nitrogenFixer: true,
      biomassProduction: 'HIGH',
      hasFruit: true,
      edibleFruit: true,
      fruitingAge: { min: 10, max: 15 },
      uses: ['HUMAN_FOOD', 'TIMBER', 'MEDICINAL', 'SHADE', 'HONEY'],
      propagationMethods: ['Seeds', 'Grafting'],
      observations: 'Jatobá is a majestic tree native to tropical America. Its hard, durable wood is highly valued for construction and furniture. The fruit pulp is edible and nutritious, commonly used in traditional medicine. As a nitrogen-fixing legume, it enriches the soil and supports forest regeneration. The tree is slow-growing but extremely long-lived, making it ideal for permanent agroforestry systems.',
      imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop',
      photos: [
        { url: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&auto=format&fit=crop' },
        { url: 'https://images.unsplash.com/photo-1511497584788-876760111969?w=800&auto=format&fit=crop' }
      ]
    },
    'banana-musa-paradisiaca': {
      id: '2',
      slug: 'banana-musa-paradisiaca',
      scientificName: 'Musa × paradisiaca',
      genus: 'Musa',
      species: 'paradisiaca',
      author: 'L.',
      commonNames: ['Banana', 'Plátano', 'Bananeira'],
      synonyms: ['Musa sapientum'],
      botanicalFamily: 'Musaceae',
      stratum: 'UNDERSTORY',
      successionalStage: 'PIONEER',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 5, max: 10 },
      heightMeters: 5,
      canopyWidthMeters: 3,
      canopyShape: 'PALM',
      specieType: 'HERB',
      originCenter: 'Southeast Asia',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['TROPICAL_RAINFOREST', 'ATLANTIC_FOREST'],
      foliageType: 'EVERGREEN',
      growthRate: 'VERY_FAST',
      rootSystem: 'FIBROUS',
      nitrogenFixer: false,
      biomassProduction: 'VERY_HIGH',
      hasFruit: true,
      edibleFruit: true,
      fruitingAge: { min: 1, max: 2 },
      uses: ['HUMAN_FOOD', 'ANIMAL_FOOD', 'FIBER', 'GROUND_COVER'],
      propagationMethods: ['Suckers', 'Rhizome division'],
      observations: 'Banana is one of the most productive plants for tropical agroforestry. It provides quick biomass, edible fruit, and excellent ground cover. The large leaves create a humid microclimate beneficial for other plants.',
      imageUrl: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1603833665858-e61d17a86224?w=800&auto=format&fit=crop' }]
    },
    'euterpe-edulis': {
      id: '3',
      slug: 'euterpe-edulis',
      scientificName: 'Euterpe edulis',
      genus: 'Euterpe',
      species: 'edulis',
      author: 'Mart.',
      commonNames: ['Palmito-juçara', 'Juçara', 'Ripeira'],
      synonyms: ['Euterpe edulis var. edulis'],
      botanicalFamily: 'Arecaceae',
      stratum: 'CANOPY',
      successionalStage: 'LATE_SECONDARY',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 50, max: 100 },
      heightMeters: 12,
      canopyWidthMeters: 3,
      canopyShape: 'PALM',
      specieType: 'PALM',
      originCenter: 'Atlantic Forest, Brazil',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['ATLANTIC_FOREST'],
      foliageType: 'EVERGREEN',
      growthRate: 'MEDIUM',
      rootSystem: 'FIBROUS',
      nitrogenFixer: false,
      biomassProduction: 'MEDIUM',
      hasFruit: true,
      edibleFruit: true,
      fruitingAge: { min: 8, max: 12 },
      uses: ['HUMAN_FOOD', 'ANIMAL_FOOD', 'ORNAMENTAL', 'SHADE'],
      propagationMethods: ['Seeds'],
      observations: 'Juçara palm is an emblematic species of the Atlantic Forest. It produces the highly valued palmito (heart of palm) and açaí-like fruits. The palm is critically important for forest fauna as a food source. Sustainable management practices are essential as overharvesting has led to population decline. In agroforestry systems, it provides shade and valuable products.',
      imageUrl: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1509587584298-0f3b3a3a1797?w=800&auto=format&fit=crop' }]
    },
    'coffea-arabica': {
      id: '4',
      slug: 'coffea-arabica',
      scientificName: 'Coffea arabica',
      genus: 'Coffea',
      species: 'arabica',
      author: 'L.',
      commonNames: ['Café', 'Cafeeiro', 'Arabica Coffee'],
      synonyms: ['Coffea arabica var. arabica'],
      botanicalFamily: 'Rubiaceae',
      stratum: 'UNDERSTORY',
      successionalStage: 'EARLY_SECONDARY',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 20, max: 50 },
      heightMeters: 3,
      canopyWidthMeters: 2,
      canopyShape: 'ROUNDED',
      specieType: 'SHRUB',
      originCenter: 'Ethiopia',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['ATLANTIC_FOREST', 'CERRADO'],
      foliageType: 'EVERGREEN',
      growthRate: 'FAST',
      rootSystem: 'TAPROOT',
      nitrogenFixer: false,
      biomassProduction: 'MEDIUM',
      hasFruit: true,
      edibleFruit: false,
      fruitingAge: { min: 3, max: 4 },
      uses: ['HUMAN_FOOD', 'ORNAMENTAL'],
      propagationMethods: ['Seeds', 'Cuttings', 'Grafting'],
      observations: 'Coffee is an important cash crop that thrives under partial shade in agroforestry systems. It benefits from the protection of taller trees and contributes to understory diversity. Shade-grown coffee produces higher quality beans and supports biodiversity. The shrub requires well-drained soils and consistent moisture.',
      imageUrl: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&auto=format&fit=crop' }]
    },
    'malpighia-emarginata': {
      id: '5',
      slug: 'malpighia-emarginata',
      scientificName: 'Malpighia emarginata',
      genus: 'Malpighia',
      species: 'emarginata',
      author: 'DC.',
      commonNames: ['Acerola', 'Cereja-das-antilhas', 'Barbados Cherry'],
      synonyms: ['Malpighia glabra', 'Malpighia punicifolia'],
      botanicalFamily: 'Malpighiaceae',
      stratum: 'UNDERSTORY',
      successionalStage: 'PIONEER',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 15, max: 25 },
      heightMeters: 3,
      canopyWidthMeters: 3,
      canopyShape: 'ROUNDED',
      specieType: 'SHRUB',
      originCenter: 'Central America and Caribbean',
      globalBiome: 'TROPICAL_DRY_FOREST',
      regionalBiome: ['ATLANTIC_FOREST', 'CAATINGA'],
      foliageType: 'EVERGREEN',
      growthRate: 'FAST',
      rootSystem: 'FIBROUS',
      nitrogenFixer: false,
      biomassProduction: 'MEDIUM',
      hasFruit: true,
      edibleFruit: true,
      fruitingAge: { min: 2, max: 3 },
      uses: ['HUMAN_FOOD', 'MEDICINAL', 'ORNAMENTAL', 'HONEY'],
      propagationMethods: ['Seeds', 'Cuttings', 'Grafting'],
      observations: 'Acerola is renowned for its exceptionally high vitamin C content, making it a valuable fruit crop. The small shrub is highly productive and can fruit multiple times per year in favorable conditions. It adapts well to various soil types and is drought-tolerant once established. In agroforestry, it fills the understory layer and attracts pollinators.',
      imageUrl: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800&auto=format&fit=crop' }]
    },
    'inga-edulis': {
      id: '6',
      slug: 'inga-edulis',
      scientificName: 'Inga edulis',
      genus: 'Inga',
      species: 'edulis',
      author: 'Mart.',
      commonNames: ['Ingá', 'Ice-cream bean', 'Ingá-cipó'],
      synonyms: ['Inga vera', 'Mimosa inga'],
      botanicalFamily: 'Fabaceae',
      stratum: 'CANOPY',
      successionalStage: 'PIONEER',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 15, max: 30 },
      heightMeters: 10,
      canopyWidthMeters: 8,
      canopyShape: 'UMBRELLA',
      specieType: 'TREE',
      originCenter: 'Amazon Basin',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['AMAZON', 'ATLANTIC_FOREST'],
      foliageType: 'EVERGREEN',
      growthRate: 'VERY_FAST',
      rootSystem: 'TAPROOT',
      nitrogenFixer: true,
      biomassProduction: 'VERY_HIGH',
      hasFruit: true,
      edibleFruit: true,
      fruitingAge: { min: 2, max: 3 },
      uses: ['HUMAN_FOOD', 'ANIMAL_FOOD', 'SHADE', 'FIREWOOD', 'GROUND_COVER'],
      propagationMethods: ['Seeds', 'Cuttings'],
      observations: 'Ingá is an excellent pioneer species for agroforestry systems. As a nitrogen-fixing legume, it rapidly improves soil fertility. Its fast growth provides quick shade for crops like coffee and cacao. The sweet edible pulp surrounding the seeds is enjoyed by humans and wildlife. The tree produces abundant biomass and leaf litter, enriching the soil. It is particularly valuable in degraded land restoration.',
      imageUrl: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1464226184884-fa280b87c399?w=800&auto=format&fit=crop' }]
    },
    'cecropia-pachystachya': {
      id: '7',
      slug: 'cecropia-pachystachya',
      scientificName: 'Cecropia pachystachya',
      genus: 'Cecropia',
      species: 'pachystachya',
      author: 'Trécul',
      commonNames: ['Embaúba', 'Umbaúba', 'Árvore-da-preguiça'],
      synonyms: ['Cecropia adenopus', 'Cecropia palmata var. pachystachya'],
      botanicalFamily: 'Urticaceae',
      stratum: 'CANOPY',
      successionalStage: 'PIONEER',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 15, max: 40 },
      heightMeters: 15,
      canopyWidthMeters: 8,
      canopyShape: 'UMBRELLA',
      specieType: 'TREE',
      originCenter: 'South America',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['AMAZON', 'ATLANTIC_FOREST', 'CERRADO'],
      foliageType: 'EVERGREEN',
      growthRate: 'VERY_FAST',
      rootSystem: 'FIBROUS',
      nitrogenFixer: true,
      biomassProduction: 'VERY_HIGH',
      hasFruit: true,
      edibleFruit: false,
      fruitingAge: { min: 2, max: 3 },
      uses: ['ANIMAL_FOOD', 'MEDICINAL', 'SHADE'],
      propagationMethods: ['Seeds', 'Cuttings'],
      observations: 'Embaúba is an iconic pioneer tree crucial for forest regeneration. It grows extremely fast and provides shelter and food for wildlife, especially sloths and birds. The hollow stems house ant colonies in a symbiotic relationship. Rich in nitrogen-fixing capabilities, it enriches degraded soils. Its medicinal properties include treatment for respiratory conditions and hypertension.',
      imageUrl: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1502082553048-f009c37129b9?w=800&auto=format&fit=crop' }]
    },
    'theobroma-cacao': {
      id: '8',
      slug: 'theobroma-cacao',
      scientificName: 'Theobroma cacao',
      genus: 'Theobroma',
      species: 'cacao',
      author: 'L.',
      commonNames: ['Cacau', 'Cacaueiro', 'Cacao'],
      synonyms: ['Theobroma sativa', 'Cacao sativa'],
      botanicalFamily: 'Malvaceae',
      stratum: 'UNDERSTORY',
      successionalStage: 'LATE_SECONDARY',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 50, max: 100 },
      heightMeters: 6,
      canopyWidthMeters: 4,
      canopyShape: 'ROUNDED',
      specieType: 'TREE',
      originCenter: 'Amazon Basin',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['AMAZON', 'ATLANTIC_FOREST'],
      foliageType: 'EVERGREEN',
      growthRate: 'MEDIUM',
      rootSystem: 'TAPROOT',
      nitrogenFixer: false,
      biomassProduction: 'MEDIUM',
      hasFruit: true,
      edibleFruit: true,
      fruitingAge: { min: 4, max: 5 },
      uses: ['HUMAN_FOOD', 'TIMBER', 'SHADE'],
      propagationMethods: ['Seeds', 'Grafting', 'Cuttings'],
      observations: 'Cacao is the source of chocolate and a vital crop for agroforestry systems. It thrives under forest canopy shade, making it ideal for multi-strata systems. The tree produces pods directly on its trunk and branches, containing seeds rich in valuable compounds. Shade-grown cacao promotes biodiversity and produces higher quality beans. It requires humid conditions and benefits from companion trees.',
      imageUrl: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1511381939415-e44015466834?w=800&auto=format&fit=crop' }]
    },
    'schinus-terebinthifolia': {
      id: '9',
      slug: 'schinus-terebinthifolia',
      scientificName: 'Schinus terebinthifolia',
      genus: 'Schinus',
      species: 'terebinthifolia',
      author: 'Raddi',
      commonNames: ['Aroeira-vermelha', 'Aroeira-pimenteira', 'Brazilian Pepper'],
      synonyms: ['Schinus aroeira', 'Schinus mucronulatus'],
      botanicalFamily: 'Anacardiaceae',
      stratum: 'CANOPY',
      successionalStage: 'EARLY_SECONDARY',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 40, max: 80 },
      heightMeters: 10,
      canopyWidthMeters: 6,
      canopyShape: 'ROUNDED',
      specieType: 'TREE',
      originCenter: 'South America',
      globalBiome: 'TROPICAL_DRY_FOREST',
      regionalBiome: ['ATLANTIC_FOREST', 'CERRADO', 'PAMPA'],
      foliageType: 'EVERGREEN',
      growthRate: 'FAST',
      rootSystem: 'TAPROOT',
      nitrogenFixer: false,
      biomassProduction: 'HIGH',
      hasFruit: true,
      edibleFruit: false,
      fruitingAge: { min: 4, max: 6 },
      uses: ['MEDICINAL', 'ORNAMENTAL', 'TIMBER', 'HONEY'],
      propagationMethods: ['Seeds', 'Cuttings'],
      observations: 'Aroeira-vermelha is a resilient tree with powerful medicinal properties, particularly for wound healing and anti-inflammatory treatments. The red berries resemble pink peppercorns and have culinary uses. It adapts to various soil conditions and climate zones, making it valuable for restoration projects. The tree attracts diverse pollinators and provides year-round food for birds.',
      imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop' }]
    },
    'leucaena-leucocephala': {
      id: '10',
      slug: 'leucaena-leucocephala',
      scientificName: 'Leucaena leucocephala',
      genus: 'Leucaena',
      species: 'leucocephala',
      author: '(Lam.) de Wit',
      commonNames: ['Leucena', 'Acácia-branca', 'White Leadtree'],
      synonyms: ['Mimosa leucocephala', 'Leucaena glauca'],
      botanicalFamily: 'Fabaceae',
      stratum: 'SUBCANOPY',
      successionalStage: 'PIONEER',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 15, max: 50 },
      heightMeters: 7,
      canopyWidthMeters: 5,
      canopyShape: 'SPREADING',
      specieType: 'TREE',
      originCenter: 'Central America',
      globalBiome: 'TROPICAL_DRY_FOREST',
      regionalBiome: ['CAATINGA', 'CERRADO'],
      foliageType: 'SEMI_DECIDUOUS',
      growthRate: 'VERY_FAST',
      rootSystem: 'TAPROOT',
      nitrogenFixer: true,
      biomassProduction: 'VERY_HIGH',
      hasFruit: true,
      edibleFruit: false,
      fruitingAge: { min: 1, max: 2 },
      uses: ['ANIMAL_FOOD', 'FIREWOOD', 'GROUND_COVER', 'SHADE'],
      propagationMethods: ['Seeds', 'Cuttings'],
      observations: 'Leucena is an exceptional nitrogen-fixing tree that rapidly improves soil fertility. Its protein-rich foliage is excellent livestock fodder, though should be fed in moderation. The tree produces abundant biomass for mulching and green manure. It grows quickly in challenging conditions, making it ideal for degraded land rehabilitation. Regular pruning stimulates growth and biomass production.',
      imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800&auto=format&fit=crop' }]
    },
    'piper-aduncum': {
      id: '11',
      slug: 'piper-aduncum',
      scientificName: 'Piper aduncum',
      genus: 'Piper',
      species: 'aduncum',
      author: 'L.',
      commonNames: ['Pimenta-de-macaco', 'Falso-jaborandi', 'Spiked Pepper'],
      synonyms: ['Artanthe adunca', 'Piper angustifolium'],
      botanicalFamily: 'Piperaceae',
      stratum: 'UNDERSTORY',
      successionalStage: 'PIONEER',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 8, max: 15 },
      heightMeters: 3,
      canopyWidthMeters: 2,
      canopyShape: 'IRREGULAR',
      specieType: 'SHRUB',
      originCenter: 'Central and South America',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['AMAZON', 'ATLANTIC_FOREST'],
      foliageType: 'EVERGREEN',
      growthRate: 'VERY_FAST',
      rootSystem: 'FIBROUS',
      nitrogenFixer: false,
      biomassProduction: 'MEDIUM',
      hasFruit: true,
      edibleFruit: false,
      fruitingAge: { min: 1, max: 2 },
      uses: ['MEDICINAL', 'ORNAMENTAL', 'GROUND_COVER'],
      propagationMethods: ['Seeds', 'Cuttings'],
      observations: 'Pimenta-de-macaco is a fast-growing pioneer shrub with significant medicinal properties, particularly as an insect repellent and antimicrobial agent. It quickly colonizes disturbed areas, providing ground cover and preventing erosion. The aromatic leaves have traditional uses in folk medicine. Birds and small mammals feed on the small fruits, aiding in seed dispersal and forest regeneration.',
      imageUrl: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop' }]
    },
    'mimosa-caesalpiniifolia': {
      id: '12',
      slug: 'mimosa-caesalpiniifolia',
      scientificName: 'Mimosa caesalpiniifolia',
      genus: 'Mimosa',
      species: 'caesalpiniifolia',
      author: 'Benth.',
      commonNames: ['Sabiá', 'Sansão-do-campo', 'Sabia'],
      synonyms: ['Mimosa caesalpiniaefolia'],
      botanicalFamily: 'Fabaceae',
      stratum: 'CANOPY',
      successionalStage: 'EARLY_SECONDARY',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 30, max: 60 },
      heightMeters: 12,
      canopyWidthMeters: 6,
      canopyShape: 'IRREGULAR',
      specieType: 'TREE',
      originCenter: 'Northeast Brazil',
      globalBiome: 'TROPICAL_DRY_FOREST',
      regionalBiome: ['CAATINGA', 'ATLANTIC_FOREST'],
      foliageType: 'DECIDUOUS',
      growthRate: 'FAST',
      rootSystem: 'TAPROOT',
      nitrogenFixer: true,
      biomassProduction: 'HIGH',
      hasFruit: true,
      edibleFruit: false,
      fruitingAge: { min: 3, max: 4 },
      uses: ['TIMBER', 'FIREWOOD', 'HEDGING', 'SHADE'],
      propagationMethods: ['Seeds', 'Cuttings'],
      observations: 'Sabiá is a hardy leguminous tree native to the Brazilian Caatinga. It provides excellent timber for posts and fuel, while fixing nitrogen in the soil. The dense, thorny foliage makes it ideal for living fences and windbreaks. It tolerates drought and poor soils, making it valuable for dryland agroforestry. The tree supports local wildlife and enriches degraded soils.',
      imageUrl: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800&auto=format&fit=crop' }]
    },
    'annona-muricata': {
      id: '13',
      slug: 'annona-muricata',
      scientificName: 'Annona muricata',
      genus: 'Annona',
      species: 'muricata',
      author: 'L.',
      commonNames: ['Graviola', 'Jaca-de-pobre', 'Coração-de-rainha', 'Soursop'],
      synonyms: ['Annona macrocarpa', 'Annona bonplandiana'],
      botanicalFamily: 'Annonaceae',
      stratum: 'UNDERSTORY',
      successionalStage: 'LATE_SECONDARY',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 30, max: 50 },
      heightMeters: 6,
      canopyWidthMeters: 5,
      canopyShape: 'ROUNDED',
      specieType: 'TREE',
      originCenter: 'Tropical America',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['AMAZON', 'ATLANTIC_FOREST'],
      foliageType: 'EVERGREEN',
      growthRate: 'MEDIUM',
      rootSystem: 'TAPROOT',
      nitrogenFixer: false,
      biomassProduction: 'MEDIUM',
      hasFruit: true,
      edibleFruit: true,
      fruitingAge: { min: 3, max: 5 },
      uses: ['HUMAN_FOOD', 'MEDICINAL', 'ORNAMENTAL'],
      propagationMethods: ['Seeds', 'Grafting', 'Air layering'],
      observations: 'Graviola produces large, delicious fruits with creamy white pulp rich in nutrients and unique flavor. The fruit and leaves have traditional medicinal uses, including anti-inflammatory and antimicrobial properties. It thrives in humid tropical climates and benefits from partial shade in agroforestry systems. The tree requires hand pollination for optimal fruit production and provides year-round foliage.',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&auto=format&fit=crop' }]
    },
    'gliricidia-sepium': {
      id: '14',
      slug: 'gliricidia-sepium',
      scientificName: 'Gliricidia sepium',
      genus: 'Gliricidia',
      species: 'sepium',
      author: '(Jacq.) Kunth',
      commonNames: ['Gliricídia', 'Madero-negro', 'Mata-rato', 'Mother of Cacao'],
      synonyms: ['Robinia sepium', 'Lonchocarpus maculatus'],
      botanicalFamily: 'Fabaceae',
      stratum: 'SUBCANOPY',
      successionalStage: 'PIONEER',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 20, max: 40 },
      heightMeters: 10,
      canopyWidthMeters: 6,
      canopyShape: 'SPREADING',
      specieType: 'TREE',
      originCenter: 'Central America',
      globalBiome: 'TROPICAL_DRY_FOREST',
      regionalBiome: ['ATLANTIC_FOREST', 'CAATINGA'],
      foliageType: 'DECIDUOUS',
      growthRate: 'VERY_FAST',
      rootSystem: 'TAPROOT',
      nitrogenFixer: true,
      biomassProduction: 'VERY_HIGH',
      hasFruit: true,
      edibleFruit: false,
      fruitingAge: { min: 2, max: 3 },
      uses: ['ANIMAL_FOOD', 'FIREWOOD', 'HEDGING', 'SHADE'],
      propagationMethods: ['Stakes', 'Seeds', 'Cuttings'],
      observations: 'Gliricídia is a multipurpose tree widely used in agroforestry worldwide. It fixes substantial nitrogen, produces abundant biomass, and provides excellent livestock fodder. The tree can be easily propagated from living stakes and tolerates heavy pruning. It serves as ideal shade for coffee and cacao, and its attractive pink flowers support pollinators. The leaves have rodenticidal properties.',
      imageUrl: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?w=800&auto=format&fit=crop' }]
    },
    'psidium-guajava': {
      id: '15',
      slug: 'psidium-guajava',
      scientificName: 'Psidium guajava',
      genus: 'Psidium',
      species: 'guajava',
      author: 'L.',
      commonNames: ['Goiaba', 'Goiabeira', 'Guava'],
      synonyms: ['Psidium pomiferum', 'Psidium pyriferum'],
      botanicalFamily: 'Myrtaceae',
      stratum: 'SUBCANOPY',
      successionalStage: 'EARLY_SECONDARY',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 25, max: 50 },
      heightMeters: 6,
      canopyWidthMeters: 5,
      canopyShape: 'SPREADING',
      specieType: 'TREE',
      originCenter: 'Tropical America',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['ATLANTIC_FOREST', 'CERRADO', 'CAATINGA'],
      foliageType: 'EVERGREEN',
      growthRate: 'FAST',
      rootSystem: 'FIBROUS',
      nitrogenFixer: false,
      biomassProduction: 'MEDIUM',
      hasFruit: true,
      edibleFruit: true,
      fruitingAge: { min: 2, max: 4 },
      uses: ['HUMAN_FOOD', 'MEDICINAL', 'TIMBER', 'HONEY'],
      propagationMethods: ['Seeds', 'Cuttings', 'Grafting'],
      observations: 'Guava is a highly productive fruit tree with exceptional vitamin C content. The fruits are versatile for fresh eating, juices, and preserves. The leaves have medicinal properties for digestive health. The tree adapts to various soil types and climates, producing fruit year-round in favorable conditions. It attracts numerous pollinators and fruit-eating birds, supporting biodiversity in agroforestry systems.',
      imageUrl: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?w=800&auto=format&fit=crop' }]
    },
    'genipa-americana': {
      id: '16',
      slug: 'genipa-americana',
      scientificName: 'Genipa americana',
      genus: 'Genipa',
      species: 'americana',
      author: 'L.',
      commonNames: ['Jenipapo', 'Genipapo', 'Genipap'],
      synonyms: ['Genipa barbata', 'Genipa excelsa'],
      botanicalFamily: 'Rubiaceae',
      stratum: 'CANOPY',
      successionalStage: 'LATE_SECONDARY',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 60, max: 150 },
      heightMeters: 14,
      canopyWidthMeters: 8,
      canopyShape: 'ROUNDED',
      specieType: 'TREE',
      originCenter: 'Tropical America',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['AMAZON', 'ATLANTIC_FOREST', 'CERRADO', 'PANTANAL'],
      foliageType: 'SEMI_DECIDUOUS',
      growthRate: 'MEDIUM',
      rootSystem: 'TAPROOT',
      nitrogenFixer: false,
      biomassProduction: 'HIGH',
      hasFruit: true,
      edibleFruit: true,
      fruitingAge: { min: 7, max: 10 },
      uses: ['HUMAN_FOOD', 'ANIMAL_FOOD', 'MEDICINAL', 'TIMBER'],
      propagationMethods: ['Seeds', 'Grafting'],
      observations: 'Jenipapo produces large fruits with aromatic pulp used for juices, liqueurs, and traditional body paint by indigenous peoples. The fruit is rich in iron and has medicinal properties. The durable wood is valued for construction. The tree is adapted to seasonally flooded areas and provides important food for wildlife. It is long-lived and valuable for permanent agroforestry systems.',
      imageUrl: 'https://images.unsplash.com/photo-1483086431886-3590a88317fe?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1483086431886-3590a88317fe?w=800&auto=format&fit=crop' }]
    },
    'spondias-mombin': {
      id: '17',
      slug: 'spondias-mombin',
      scientificName: 'Spondias mombin',
      genus: 'Spondias',
      species: 'mombin',
      author: 'L.',
      commonNames: ['Cajá', 'Taperebá', 'Cajá-mirim', 'Yellow Mombin'],
      synonyms: ['Spondias lutea', 'Spondias myrobalanus'],
      botanicalFamily: 'Anacardiaceae',
      stratum: 'CANOPY',
      successionalStage: 'CLIMAX',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 80, max: 200 },
      heightMeters: 18,
      canopyWidthMeters: 10,
      canopyShape: 'SPREADING',
      specieType: 'TREE',
      originCenter: 'Tropical America',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['AMAZON', 'ATLANTIC_FOREST', 'CAATINGA'],
      foliageType: 'DECIDUOUS',
      growthRate: 'SLOW',
      rootSystem: 'TAPROOT',
      nitrogenFixer: false,
      biomassProduction: 'HIGH',
      hasFruit: true,
      edibleFruit: true,
      fruitingAge: { min: 8, max: 12 },
      uses: ['HUMAN_FOOD', 'ANIMAL_FOOD', 'TIMBER', 'SHADE'],
      propagationMethods: ['Seeds', 'Cuttings', 'Stakes'],
      observations: 'Cajá is a majestic tree producing delicious tropical fruits with tangy-sweet flavor. The fruits are rich in vitamins and used for juices, ice cream, and preserves. The tree is highly drought-resistant, making it valuable for semi-arid agroforestry. It provides excellent shade and wildlife habitat. The durable wood has commercial value. The tree can be propagated from large branch cuttings.',
      imageUrl: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?w=800&auto=format&fit=crop' }]
    },
    'manihot-esculenta': {
      id: '18',
      slug: 'manihot-esculenta',
      scientificName: 'Manihot esculenta',
      genus: 'Manihot',
      species: 'esculenta',
      author: 'Crantz',
      commonNames: ['Mandioca', 'Macaxeira', 'Aipim', 'Cassava'],
      synonyms: ['Manihot utilissima', 'Jatropha manihot'],
      botanicalFamily: 'Euphorbiaceae',
      stratum: 'GROUND_COVER',
      successionalStage: 'PIONEER',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 2, max: 5 },
      heightMeters: 2,
      canopyWidthMeters: 1.5,
      canopyShape: 'IRREGULAR',
      specieType: 'SHRUB',
      originCenter: 'Amazon Basin',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['AMAZON', 'ATLANTIC_FOREST', 'CERRADO', 'CAATINGA'],
      foliageType: 'DECIDUOUS',
      growthRate: 'VERY_FAST',
      rootSystem: 'TUBEROUS',
      nitrogenFixer: false,
      biomassProduction: 'MEDIUM',
      hasFruit: false,
      edibleFruit: false,
      fruitingAge: { min: 1, max: 1 },
      uses: ['HUMAN_FOOD', 'ANIMAL_FOOD', 'GROUND_COVER'],
      propagationMethods: ['Stem cuttings', 'Stakes'],
      observations: 'Cassava is a staple crop providing carbohydrate-rich tuberous roots that feed millions worldwide. It thrives in poor soils and drought conditions where other crops fail. In agroforestry, it provides quick ground cover and food security. The leaves are also edible and nutritious. Cassava is easily propagated from stem cuttings and can be intercropped with trees, offering income while forests develop.',
      imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800&auto=format&fit=crop' }]
    },
    'carica-papaya': {
      id: '19',
      slug: 'carica-papaya',
      scientificName: 'Carica papaya',
      genus: 'Carica',
      species: 'papaya',
      author: 'L.',
      commonNames: ['Mamão', 'Mamoeiro', 'Papaia', 'Papaya'],
      synonyms: ['Carica peltata', 'Papaya vulgaris'],
      botanicalFamily: 'Caricaceae',
      stratum: 'SUBCANOPY',
      successionalStage: 'PIONEER',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 3, max: 8 },
      heightMeters: 5,
      canopyWidthMeters: 3,
      canopyShape: 'PALM',
      specieType: 'TREE',
      originCenter: 'Central America',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['ATLANTIC_FOREST', 'AMAZON'],
      foliageType: 'EVERGREEN',
      growthRate: 'VERY_FAST',
      rootSystem: 'FIBROUS',
      nitrogenFixer: false,
      biomassProduction: 'MEDIUM',
      hasFruit: true,
      edibleFruit: true,
      fruitingAge: { min: 1, max: 1 },
      uses: ['HUMAN_FOOD', 'MEDICINAL', 'ANIMAL_FOOD'],
      propagationMethods: ['Seeds', 'Tissue culture'],
      observations: 'Papaya is one of the fastest fruiting trees, producing within the first year. The fruits are rich in enzymes, vitamins, and have digestive health benefits. The latex and leaves contain papain, used medicinally and in meat tenderizers. Short-lived but highly productive, papaya is ideal for early income in young agroforestry systems. It requires warm temperatures and good drainage.',
      imageUrl: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?w=800&auto=format&fit=crop' }]
    },
    'erythrina-fusca': {
      id: '20',
      slug: 'erythrina-fusca',
      scientificName: 'Erythrina fusca',
      genus: 'Erythrina',
      species: 'fusca',
      author: 'Lour.',
      commonNames: ['Mulungu', 'Corticeira', 'Swamp Immortelle'],
      synonyms: ['Erythrina glauca', 'Corallodendron fuscum'],
      botanicalFamily: 'Fabaceae',
      stratum: 'CANOPY',
      successionalStage: 'PIONEER',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 40, max: 80 },
      heightMeters: 15,
      canopyWidthMeters: 8,
      canopyShape: 'SPREADING',
      specieType: 'TREE',
      originCenter: 'Tropical America',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['AMAZON', 'ATLANTIC_FOREST', 'PANTANAL'],
      foliageType: 'DECIDUOUS',
      growthRate: 'FAST',
      rootSystem: 'FIBROUS',
      nitrogenFixer: true,
      biomassProduction: 'HIGH',
      hasFruit: true,
      edibleFruit: false,
      fruitingAge: { min: 3, max: 5 },
      uses: ['MEDICINAL', 'ORNAMENTAL', 'SHADE', 'HONEY'],
      propagationMethods: ['Seeds', 'Cuttings', 'Stakes'],
      observations: 'Mulungu is a nitrogen-fixing tree with powerful medicinal properties, particularly as a natural sedative and anxiolytic. The spectacular red flowers attract hummingbirds and other pollinators. It adapts to waterlogged soils and is ideal for riparian restoration. The light, cork-like wood has traditional uses in crafts. The tree provides excellent shade and enriches soil through nitrogen fixation.',
      imageUrl: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?w=800&auto=format&fit=crop' }]
    },
    'anacardium-occidentale': {
      id: '21',
      slug: 'anacardium-occidentale',
      scientificName: 'Anacardium occidentale',
      genus: 'Anacardium',
      species: 'occidentale',
      author: 'L.',
      commonNames: ['Caju', 'Cajueiro', 'Cashew'],
      synonyms: ['Anacardium microcarpum', 'Cassuvium pomiferum'],
      botanicalFamily: 'Anacardiaceae',
      stratum: 'CANOPY',
      successionalStage: 'EARLY_SECONDARY',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 50, max: 100 },
      heightMeters: 10,
      canopyWidthMeters: 12,
      canopyShape: 'SPREADING',
      specieType: 'TREE',
      originCenter: 'Northeast Brazil',
      globalBiome: 'TROPICAL_DRY_FOREST',
      regionalBiome: ['ATLANTIC_FOREST', 'CERRADO', 'CAATINGA'],
      foliageType: 'EVERGREEN',
      growthRate: 'MEDIUM',
      rootSystem: 'TAPROOT',
      nitrogenFixer: false,
      biomassProduction: 'MEDIUM',
      hasFruit: true,
      edibleFruit: true,
      fruitingAge: { min: 3, max: 5 },
      uses: ['HUMAN_FOOD', 'TIMBER', 'MEDICINAL', 'SHADE'],
      propagationMethods: ['Seeds', 'Grafting', 'Air layering'],
      observations: 'Cashew produces valuable nuts and the cashew apple, both with commercial importance. The tree is extremely drought-resistant and thrives in sandy, poor soils. It has an extensive root system that prevents erosion. The tree provides wide-spreading shade and the cashew shell liquid has industrial and medicinal uses. Grafted varieties produce higher yields and fruit within 2-3 years.',
      imageUrl: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&auto=format&fit=crop' }]
    },
    'passiflora-edulis': {
      id: '22',
      slug: 'passiflora-edulis',
      scientificName: 'Passiflora edulis',
      genus: 'Passiflora',
      species: 'edulis',
      author: 'Sims',
      commonNames: ['Maracujá', 'Maracujá-azedo', 'Passion Fruit'],
      synonyms: ['Passiflora diaden', 'Passiflora middletoniana'],
      botanicalFamily: 'Passifloraceae',
      stratum: 'GROUND_COVER',
      successionalStage: 'PIONEER',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 3, max: 8 },
      heightMeters: 0.5,
      canopyWidthMeters: 5,
      canopyShape: 'VINE',
      specieType: 'VINE',
      originCenter: 'South America',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['ATLANTIC_FOREST', 'AMAZON'],
      foliageType: 'EVERGREEN',
      growthRate: 'VERY_FAST',
      rootSystem: 'FIBROUS',
      nitrogenFixer: false,
      biomassProduction: 'MEDIUM',
      hasFruit: true,
      edibleFruit: true,
      fruitingAge: { min: 1, max: 1 },
      uses: ['HUMAN_FOOD', 'MEDICINAL', 'ORNAMENTAL'],
      propagationMethods: ['Seeds', 'Cuttings', 'Grafting'],
      observations: 'Passion fruit is a vigorous vine producing aromatic fruits with unique flavor, rich in vitamins and antioxidants. The leaves and flowers have sedative medicinal properties. In agroforestry, it provides ground cover, fruits quickly, and requires support structures like trellises or trees. The spectacular flowers attract diverse pollinators. It produces abundantly in the first year and thrives in humid tropical climates.',
      imageUrl: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=800&auto=format&fit=crop' }]
    },
    'citrus-sinensis': {
      id: '23',
      slug: 'citrus-sinensis',
      scientificName: 'Citrus × sinensis',
      genus: 'Citrus',
      species: 'sinensis',
      author: '(L.) Osbeck',
      commonNames: ['Laranja', 'Laranjeira', 'Sweet Orange'],
      synonyms: ['Citrus aurantium var. sinensis', 'Citrus aurantium dulcis'],
      botanicalFamily: 'Rutaceae',
      stratum: 'SUBCANOPY',
      successionalStage: 'LATE_SECONDARY',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 50, max: 100 },
      heightMeters: 5,
      canopyWidthMeters: 4,
      canopyShape: 'ROUNDED',
      specieType: 'TREE',
      originCenter: 'Southeast Asia',
      globalBiome: 'SUBTROPICAL_FOREST',
      regionalBiome: ['ATLANTIC_FOREST'],
      foliageType: 'EVERGREEN',
      growthRate: 'MEDIUM',
      rootSystem: 'TAPROOT',
      nitrogenFixer: false,
      biomassProduction: 'MEDIUM',
      hasFruit: true,
      edibleFruit: true,
      fruitingAge: { min: 3, max: 5 },
      uses: ['HUMAN_FOOD', 'MEDICINAL', 'ORNAMENTAL', 'HONEY'],
      propagationMethods: ['Grafting', 'Budding', 'Seeds'],
      observations: 'Orange is one of the most economically important fruit crops worldwide. The fruits are rich in vitamin C and versatile for fresh consumption and juices. The fragrant flowers are excellent for honey production and perfume. In agroforestry, grafted trees produce high-quality fruit within 3-4 years. The tree requires good drainage and benefits from protection from strong winds. The aromatic leaves have culinary and medicinal uses.',
      imageUrl: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1504198453319-5ce911bafcde?w=800&auto=format&fit=crop' }]
    },
    'persea-americana': {
      id: '24',
      slug: 'persea-americana',
      scientificName: 'Persea americana',
      genus: 'Persea',
      species: 'americana',
      author: 'Mill.',
      commonNames: ['Abacate', 'Abacateiro', 'Avocado'],
      synonyms: ['Persea gratissima', 'Laurus persea'],
      botanicalFamily: 'Lauraceae',
      stratum: 'CANOPY',
      successionalStage: 'LATE_SECONDARY',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 50, max: 150 },
      heightMeters: 15,
      canopyWidthMeters: 10,
      canopyShape: 'ROUNDED',
      specieType: 'TREE',
      originCenter: 'Central America',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['ATLANTIC_FOREST', 'CERRADO'],
      foliageType: 'EVERGREEN',
      growthRate: 'MEDIUM',
      rootSystem: 'FIBROUS',
      nitrogenFixer: false,
      biomassProduction: 'HIGH',
      hasFruit: true,
      edibleFruit: true,
      fruitingAge: { min: 5, max: 7 },
      uses: ['HUMAN_FOOD', 'TIMBER', 'OIL', 'SHADE'],
      propagationMethods: ['Grafting', 'Seeds', 'Air layering'],
      observations: 'Avocado produces nutritious fruits rich in healthy fats, vitamins, and minerals. The tree is valuable in agroforestry for its canopy layer contribution and long productive life. Grafted varieties ensure fruit quality and earlier production. The tree requires well-drained soils and adequate water. The leaves have antimicrobial properties and the oil from fruits has cosmetic and culinary uses. It provides excellent habitat for beneficial insects.',
      imageUrl: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1509023464722-18d996393ca8?w=800&auto=format&fit=crop' }]
    },
    'mangifera-indica': {
      id: '25',
      slug: 'mangifera-indica',
      scientificName: 'Mangifera indica',
      genus: 'Mangifera',
      species: 'indica',
      author: 'L.',
      commonNames: ['Manga', 'Mangueira', 'Mango'],
      synonyms: ['Mangifera domestica', 'Mangifera gladiata'],
      botanicalFamily: 'Anacardiaceae',
      stratum: 'EMERGENT',
      successionalStage: 'CLIMAX',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 100, max: 300 },
      heightMeters: 25,
      canopyWidthMeters: 15,
      canopyShape: 'ROUNDED',
      specieType: 'TREE',
      originCenter: 'South Asia',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['ATLANTIC_FOREST', 'CERRADO'],
      foliageType: 'EVERGREEN',
      growthRate: 'SLOW',
      rootSystem: 'TAPROOT',
      nitrogenFixer: false,
      biomassProduction: 'HIGH',
      hasFruit: true,
      edibleFruit: true,
      fruitingAge: { min: 5, max: 8 },
      uses: ['HUMAN_FOOD', 'SHADE', 'TIMBER', 'HONEY'],
      propagationMethods: ['Grafting', 'Budding', 'Seeds'],
      observations: 'Mango is a majestic fruit tree producing delicious, nutritious fruits beloved worldwide. The tree is long-lived and becomes increasingly productive with age. It provides extensive shade and serves as a keystone species in agroforestry systems. Grafted varieties ensure quality fruit production within 5-7 years. The tree is drought-tolerant once established and has dense, valuable timber. The leaves and bark have medicinal properties.',
      imageUrl: 'https://images.unsplash.com/photo-1490682143684-14369e18dce8?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1490682143684-14369e18dce8?w=800&auto=format&fit=crop' }]
    },
    'artocarpus-heterophyllus': {
      id: '26',
      slug: 'artocarpus-heterophyllus',
      scientificName: 'Artocarpus heterophyllus',
      genus: 'Artocarpus',
      species: 'heterophyllus',
      author: 'Lam.',
      commonNames: ['Jaca', 'Jaqueira', 'Jackfruit'],
      synonyms: ['Artocarpus brasiliensis', 'Artocarpus maximus'],
      botanicalFamily: 'Moraceae',
      stratum: 'EMERGENT',
      successionalStage: 'LATE_SECONDARY',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 80, max: 200 },
      heightMeters: 22,
      canopyWidthMeters: 12,
      canopyShape: 'PYRAMIDAL',
      specieType: 'TREE',
      originCenter: 'South and Southeast Asia',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['ATLANTIC_FOREST', 'AMAZON'],
      foliageType: 'EVERGREEN',
      growthRate: 'MEDIUM',
      rootSystem: 'TAPROOT',
      nitrogenFixer: false,
      biomassProduction: 'HIGH',
      hasFruit: true,
      edibleFruit: true,
      fruitingAge: { min: 6, max: 8 },
      uses: ['HUMAN_FOOD', 'TIMBER', 'ANIMAL_FOOD', 'SHADE'],
      propagationMethods: ['Grafting', 'Seeds', 'Air layering'],
      observations: 'Jackfruit produces the largest tree-borne fruit in the world, with versatile culinary uses from unripe to ripe stages. The young fruit is used as a meat substitute, while ripe fruit is sweet and nutritious. The tree is highly productive and provides valuable timber. It enriches soil with leaf litter and offers extensive shade. Seeds are also edible when cooked. The tree is resilient to pests and adapts well to various conditions.',
      imageUrl: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop' }]
    },
    'bambusa-vulgaris': {
      id: '27',
      slug: 'bambusa-vulgaris',
      scientificName: 'Bambusa vulgaris',
      genus: 'Bambusa',
      species: 'vulgaris',
      author: 'Schrad. ex J.C.Wendl.',
      commonNames: ['Bambu', 'Bambu-comum', 'Bambu-verde', 'Common Bamboo'],
      synonyms: ['Bambusa sieberi', 'Bambusa thouarsii'],
      botanicalFamily: 'Poaceae',
      stratum: 'SUBCANOPY',
      successionalStage: 'PIONEER',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 20, max: 100 },
      heightMeters: 12,
      canopyWidthMeters: 8,
      canopyShape: 'CLUMPING',
      specieType: 'GRASS',
      originCenter: 'Southeast Asia',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['ATLANTIC_FOREST', 'AMAZON'],
      foliageType: 'EVERGREEN',
      growthRate: 'VERY_FAST',
      rootSystem: 'RHIZOMATOUS',
      nitrogenFixer: false,
      biomassProduction: 'VERY_HIGH',
      hasFruit: false,
      edibleFruit: false,
      fruitingAge: undefined,
      uses: ['TIMBER', 'HANDICRAFT', 'WINDBREAK', 'GROUND_COVER'],
      propagationMethods: ['Rhizome division', 'Culm cuttings', 'Branch cuttings'],
      observations: 'Bamboo is one of the fastest-growing plants on Earth, producing enormous biomass and versatile construction material. It provides erosion control, windbreaks, and living fences. The culms are harvested sustainably without killing the plant. Bamboo creates a unique microclimate and provides habitat for wildlife. It is valuable for carbon sequestration and soil stabilization. The young shoots of some varieties are edible.',
      imageUrl: 'https://images.unsplash.com/photo-1511871893393-82e9c16b81e3?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1511871893393-82e9c16b81e3?w=800&auto=format&fit=crop' }]
    },
    'moringa-oleifera': {
      id: '28',
      slug: 'moringa-oleifera',
      scientificName: 'Moringa oleifera',
      genus: 'Moringa',
      species: 'oleifera',
      author: 'Lam.',
      commonNames: ['Moringa', 'Acácia-branca', 'Quiabo-de-quina', 'Drumstick Tree'],
      synonyms: ['Moringa pterygosperma', 'Guilandina moringa'],
      botanicalFamily: 'Moringaceae',
      stratum: 'SUBCANOPY',
      successionalStage: 'PIONEER',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 15, max: 30 },
      heightMeters: 8,
      canopyWidthMeters: 5,
      canopyShape: 'SPREADING',
      specieType: 'TREE',
      originCenter: 'Indian Subcontinent',
      globalBiome: 'TROPICAL_DRY_FOREST',
      regionalBiome: ['CAATINGA'],
      foliageType: 'DECIDUOUS',
      growthRate: 'VERY_FAST',
      rootSystem: 'TAPROOT',
      nitrogenFixer: false,
      biomassProduction: 'HIGH',
      hasFruit: true,
      edibleFruit: true,
      fruitingAge: { min: 1, max: 2 },
      uses: ['HUMAN_FOOD', 'MEDICINAL', 'OIL', 'ANIMAL_FOOD'],
      propagationMethods: ['Seeds', 'Cuttings'],
      observations: 'Moringa is known as the "miracle tree" due to its exceptional nutritional value. The leaves, pods, flowers, and seeds are all edible and rich in vitamins, minerals, and protein. It grows rapidly in challenging conditions with minimal water. The seeds produce oil for cooking and cosmetics, and also purify water. In agroforestry, it provides nutritious fodder and human food while improving soil quality through deep-rooting nutrient cycling.',
      imageUrl: 'https://images.unsplash.com/photo-1487260211189-670c54da558d?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1487260211189-670c54da558d?w=800&auto=format&fit=crop' }]
    },
    'syzygium-cumini': {
      id: '29',
      slug: 'syzygium-cumini',
      scientificName: 'Syzygium cumini',
      genus: 'Syzygium',
      species: 'cumini',
      author: '(L.) Skeels',
      commonNames: ['Jamelão', 'Jambolão', 'Azeitona-roxa', 'Java Plum'],
      synonyms: ['Eugenia jambolana', 'Syzygium jambolanum'],
      botanicalFamily: 'Myrtaceae',
      stratum: 'CANOPY',
      successionalStage: 'CLIMAX',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 100, max: 200 },
      heightMeters: 18,
      canopyWidthMeters: 10,
      canopyShape: 'ROUNDED',
      specieType: 'TREE',
      originCenter: 'Indian Subcontinent and Southeast Asia',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['ATLANTIC_FOREST'],
      foliageType: 'EVERGREEN',
      growthRate: 'MEDIUM',
      rootSystem: 'TAPROOT',
      nitrogenFixer: false,
      biomassProduction: 'HIGH',
      hasFruit: true,
      edibleFruit: true,
      fruitingAge: { min: 8, max: 10 },
      uses: ['HUMAN_FOOD', 'MEDICINAL', 'TIMBER', 'SHADE'],
      propagationMethods: ['Seeds', 'Grafting', 'Air layering'],
      observations: 'Jamelão produces abundant purple-black fruits with antidiabetic and antioxidant properties. The tree is long-lived and provides excellent shade for people and understory crops. The fruits attract diverse wildlife, especially birds. The dense wood is valuable for construction. The tree is highly resilient to urban pollution and drought once established, making it ideal for both agroforestry and urban forestry applications.',
      imageUrl: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800&auto=format&fit=crop' }]
    },
    'cajanus-cajan': {
      id: '30',
      slug: 'cajanus-cajan',
      scientificName: 'Cajanus cajan',
      genus: 'Cajanus',
      species: 'cajan',
      author: '(L.) Huth',
      commonNames: ['Feijão-guandu', 'Andu', 'Guandu', 'Pigeon Pea'],
      synonyms: ['Cajanus indicus', 'Cytisus cajan'],
      botanicalFamily: 'Fabaceae',
      stratum: 'UNDERSTORY',
      successionalStage: 'PIONEER',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 3, max: 8 },
      heightMeters: 3,
      canopyWidthMeters: 2,
      canopyShape: 'IRREGULAR',
      specieType: 'SHRUB',
      originCenter: 'Indian Subcontinent',
      globalBiome: 'TROPICAL_DRY_FOREST',
      regionalBiome: ['CAATINGA', 'CERRADO'],
      foliageType: 'SEMI_DECIDUOUS',
      growthRate: 'VERY_FAST',
      rootSystem: 'TAPROOT',
      nitrogenFixer: true,
      biomassProduction: 'HIGH',
      hasFruit: true,
      edibleFruit: true,
      fruitingAge: { min: 1, max: 1 },
      uses: ['HUMAN_FOOD', 'ANIMAL_FOOD', 'GROUND_COVER', 'SHADE'],
      propagationMethods: ['Seeds'],
      observations: 'Pigeon pea is a multipurpose nitrogen-fixing shrub providing protein-rich edible seeds for humans and livestock. It grows rapidly, produces abundant biomass for mulch, and improves soil fertility. The deep taproot breaks up compacted soil and accesses deep nutrients. In agroforestry, it provides quick ground cover and food production while supporting tree establishment. The leaves and green pods are excellent animal fodder.',
      imageUrl: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1497436072909-60f360e1d4b1?w=800&auto=format&fit=crop' }]
    },
    'tithonia-diversifolia': {
      id: '31',
      slug: 'tithonia-diversifolia',
      scientificName: 'Tithonia diversifolia',
      genus: 'Tithonia',
      species: 'diversifolia',
      author: '(Hemsl.) A.Gray',
      commonNames: ['Girassol-mexicano', 'Margaridão', 'Flor-do-nilo', 'Tree Marigold'],
      synonyms: ['Tithonia diversifolia var. diversifolia', 'Mirasolia diversifolia'],
      botanicalFamily: 'Asteraceae',
      stratum: 'UNDERSTORY',
      successionalStage: 'PIONEER',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 5, max: 10 },
      heightMeters: 3,
      canopyWidthMeters: 2,
      canopyShape: 'IRREGULAR',
      specieType: 'SHRUB',
      originCenter: 'Central America',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['ATLANTIC_FOREST', 'CERRADO'],
      foliageType: 'EVERGREEN',
      growthRate: 'VERY_FAST',
      rootSystem: 'FIBROUS',
      nitrogenFixer: false,
      biomassProduction: 'VERY_HIGH',
      hasFruit: false,
      edibleFruit: false,
      fruitingAge: { min: 1, max: 1 },
      uses: ['GROUND_COVER', 'ANIMAL_FOOD', 'ORNAMENTAL'],
      propagationMethods: ['Cuttings', 'Seeds'],
      observations: 'Mexican sunflower is a biomass powerhouse producing enormous quantities of nutrient-rich organic matter for mulching and composting. The leaves are high in nitrogen, phosphorus, and potassium, making excellent green manure. It grows rapidly from cuttings and tolerates poor soils and drought. The bright yellow flowers attract beneficial insects and pollinators. Regular cutting stimulates regrowth and provides continuous biomass for soil improvement.',
      imageUrl: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=800&auto=format&fit=crop' }]
    },
    'eugenia-uniflora': {
      id: '32',
      slug: 'eugenia-uniflora',
      scientificName: 'Eugenia uniflora',
      genus: 'Eugenia',
      species: 'uniflora',
      author: 'L.',
      commonNames: ['Pitanga', 'Pitangueira', 'Surinam Cherry'],
      synonyms: ['Eugenia michelii', 'Stenocalyx michelii'],
      botanicalFamily: 'Myrtaceae',
      stratum: 'UNDERSTORY',
      successionalStage: 'EARLY_SECONDARY',
      lifeCycle: 'PERENNIAL',
      lifeCycleYears: { min: 40, max: 80 },
      heightMeters: 4,
      canopyWidthMeters: 3,
      canopyShape: 'ROUNDED',
      specieType: 'SHRUB',
      originCenter: 'South America',
      globalBiome: 'TROPICAL_RAINFOREST',
      regionalBiome: ['ATLANTIC_FOREST', 'CERRADO', 'PAMPA'],
      foliageType: 'EVERGREEN',
      growthRate: 'FAST',
      rootSystem: 'FIBROUS',
      nitrogenFixer: false,
      biomassProduction: 'MEDIUM',
      hasFruit: true,
      edibleFruit: true,
      fruitingAge: { min: 3, max: 4 },
      uses: ['HUMAN_FOOD', 'ORNAMENTAL', 'MEDICINAL', 'HEDGING'],
      propagationMethods: ['Seeds', 'Cuttings', 'Air layering'],
      observations: 'Pitanga produces delicious, distinctive fruits rich in vitamin C and antioxidants. The small tree is highly adaptable to different climates and soils, thriving from tropical to subtropical regions. The aromatic leaves have medicinal properties and insect-repellent qualities. It makes an excellent ornamental hedge that produces edible fruit. The tree attracts diverse birds and beneficial insects. It fruits prolifically and requires minimal maintenance.',
      imageUrl: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=800&auto=format&fit=crop',
      photos: [{ url: 'https://images.unsplash.com/photo-1470115636492-6d2b56f9146d?w=800&auto=format&fit=crop' }]
    }
  }

  return (species as Record<string, SpeciesDetail>)[slug] || null
}

// Force dynamic rendering to avoid hydration issues
export const dynamic = 'force-dynamic'

async function getSpeciesFromDb(slug: string): Promise<SpeciesDetailWithStatus | null> {
  // Include PUBLISHED species and IN_REVIEW species with revision requests (previously published)
  const dbSpecies = await prisma.species.findFirst({
    where: {
      slug,
      OR: [
        { status: 'PUBLISHED' },
        { status: 'IN_REVIEW', revisionRequestedById: { not: null } }
      ]
    },
    include: {
      photos: {
        where: { approved: true },
        orderBy: { primary: 'desc' },
        select: { url: true, tags: true }
      }
    }
  })

  if (!dbSpecies) return null

  const primaryPhoto = dbSpecies.photos.find((_, index) => index === 0)
  // SVG placeholder - no external network call needed
  const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%234ade80'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='white'%3ENo Image%3C/text%3E%3C/svg%3E`
  const imageUrl = primaryPhoto?.url || placeholderSvg
  // Map photos with url and tags for ImageGallery
  const photos = dbSpecies.photos.map(photo => ({
    url: photo.url,
    tags: photo.tags
  }))

  // Convert Decimal types to numbers to avoid React hydration errors
  const heightMeters = dbSpecies.heightMeters ? Number(dbSpecies.heightMeters.toString()) : undefined
  const canopyWidthMeters = dbSpecies.canopyWidthMeters ? Number(dbSpecies.canopyWidthMeters.toString()) : undefined

  return {
    id: dbSpecies.id,
    slug: dbSpecies.slug,
    scientificName: dbSpecies.scientificName,
    genus: dbSpecies.genus,
    species: dbSpecies.species,
    author: dbSpecies.author,
    commonNames: dbSpecies.commonNames,
    synonyms: dbSpecies.synonyms || undefined,
    botanicalFamily: dbSpecies.botanicalFamily,
    variety: dbSpecies.variety,
    stratum: dbSpecies.stratum,
    successionalStage: dbSpecies.successionalStage,
    lifeCycle: dbSpecies.lifeCycle,
    lifeCycleYearsStart: dbSpecies.lifeCycleYearsStart,
    lifeCycleYearsEnd: dbSpecies.lifeCycleYearsEnd,
    heightMeters,
    canopyWidthMeters,
    canopyShape: dbSpecies.canopyShape,
    originCenter: dbSpecies.originCenter,
    globalBiome: dbSpecies.globalBiome,
    regionalBiome: dbSpecies.regionalBiome || undefined,
    foliageType: dbSpecies.foliageType,
    leafDropSeason: dbSpecies.leafDropSeason,
    growthRate: dbSpecies.growthRate,
    rootSystem: dbSpecies.rootSystem,
    nitrogenFixer: dbSpecies.nitrogenFixer || undefined,
    serviceSpecies: dbSpecies.serviceSpecies || undefined,
    pruningSprout: dbSpecies.pruningSprout,
    seedlingShade: dbSpecies.seedlingShade,
    biomassProduction: dbSpecies.biomassProduction,
    hasFruit: dbSpecies.hasFruit || undefined,
    edibleFruit: dbSpecies.edibleFruit || undefined,
    fruitingAgeStart: dbSpecies.fruitingAgeStart,
    fruitingAgeEnd: dbSpecies.fruitingAgeEnd,
    uses: dbSpecies.uses || undefined,
    propagationMethods: dbSpecies.propagationMethods || undefined,
    germinationDaysMin: dbSpecies.germinationDaysMin,
    germinationDaysMax: dbSpecies.germinationDaysMax,
    observations: dbSpecies.observations,
    imageUrl,
    photos: photos.length > 0 ? photos : undefined,
    status: dbSpecies.status,
    isUnderRevision: dbSpecies.status === 'IN_REVIEW' && !!dbSpecies.revisionRequestedById
  }
}

export default async function SpeciesDetailPage({
  params,
}: {
  params: { slug: string; locale: string }
}) {
  const species = await getSpeciesFromDb(params.slug)

  if (!species) {
    redirect('/catalog')
  }

  // Get session to check if user is logged in
  const session = await getSession()
  const isLoggedIn = !!session?.user
  const showRevisionButton = species.status === 'PUBLISHED'

  const t = await getTranslations(params.locale, 'speciesDetail')
  const tCommon = await getTranslations(params.locale, 'common')
  const tCatalog = await getTranslations(params.locale, 'catalog')
  const tStratum = await getTranslations(params.locale, 'stratum')
  const tStage = await getTranslations(params.locale, 'successionalStage')
  const tLifeCycle = await getTranslations(params.locale, 'lifeCycle')
  const tSpecieType = await getTranslations(params.locale, 'specieType')
  const tFoliage = await getTranslations(params.locale, 'foliageType')
  const tGrowth = await getTranslations(params.locale, 'growthRate')
  const tUse = await getTranslations(params.locale, 'plantUse')
  const tBiome = await getTranslations(params.locale, 'regionalBiome')
  const tCanopy = await getTranslations(params.locale, 'canopyShape')
  const tRoot = await getTranslations(params.locale, 'rootSystem')
  const tBiomass = await getTranslations(params.locale, 'biomassProduction')
  const tPruningSprout = await getTranslations(params.locale, 'pruningSprout')
  const tSeedlingShade = await getTranslations(params.locale, 'seedlingShade')

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header / Back Button */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <Link
            href="/catalog"
            className="inline-flex items-center gap-2 text-sm text-gray-600 transition-colors hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4" />
            {t('backToCatalog')}
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-8">
          <Card className="overflow-hidden">
            <div className="grid gap-8 lg:grid-cols-2">
              {/* Image Gallery */}
              <div className="p-4 lg:p-6">
                <ImageGallery
                  photos={species.photos || [{ url: species.imageUrl }]}
                  alt={species.scientificName}
                />
              </div>

              {/* Header Info */}
              <div className="p-6 lg:p-8">
                <h1 className="mb-2 text-3xl font-bold italic text-gray-900 lg:text-4xl">
                  {species.scientificName}
                </h1>
                <p className="mb-4 text-lg text-gray-600">
                  {species.commonNames.join(', ')}
                </p>

                {/* Quick Badges */}
                <div className="mb-6 flex flex-wrap gap-2">
                  <Badge className="bg-green-100 text-green-700">
                    {tStratum(species.stratum)}
                  </Badge>
                  <Badge className="bg-blue-100 text-blue-700">
                    {tStage(species.successionalStage)}
                  </Badge>
                  {species.lifeCycle && (
                    <Badge className="bg-purple-100 text-purple-700">
                      {tLifeCycle(species.lifeCycle)}
                    </Badge>
                  )}
                  {species.nitrogenFixer && (
                    <Badge className="bg-emerald-100 text-emerald-700">
                      <FlaskConical className="mr-1 h-3 w-3" />
                      {t('nitrogenFixer')}
                    </Badge>
                  )}
                  {species.serviceSpecies && (
                    <Badge className="bg-cyan-100 text-cyan-700">
                      {tCatalog('service')}
                    </Badge>
                  )}
                  {species.edibleFruit && (
                    <Badge className="bg-rose-100 text-rose-700">
                      <Apple className="mr-1 h-3 w-3" />
                      {tCatalog('edibleFruit')}
                    </Badge>
                  )}
                </div>

                {/* Action Buttons - for published species */}
                {showRevisionButton && (
                  <div className="mb-6 flex flex-wrap gap-2">
                    <SubmitPhotoButton
                      speciesSlug={species.slug}
                      speciesName={species.scientificName}
                      locale={params.locale}
                      isLoggedIn={isLoggedIn}
                    />
                    <RequestRevisionButton
                      speciesSlug={species.slug}
                      speciesName={species.scientificName}
                      locale={params.locale}
                      isLoggedIn={isLoggedIn}
                    />
                  </div>
                )}

                {/* Under Revision Banner - shown when species is being reviewed */}
                {species.status === 'IN_REVIEW' && (
                  <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <div className="text-sm text-amber-800">
                        <p className="font-medium">{t('underRevisionTitle')}</p>
                        <p className="mt-1">{t('underRevisionMessage')}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Quick Stats */}
                <div className="space-y-3 border-t pt-6">
                  {species.heightMeters && (
                    <div className="flex items-center gap-3 text-sm">
                      <TreeDeciduous className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">
                        {t('height')}: <span className="font-medium text-gray-900">{species.heightMeters}m</span>
                      </span>
                    </div>
                  )}
                  {species.canopyWidthMeters && (
                    <div className="flex items-center gap-3 text-sm">
                      <Trees className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">
                        {t('canopyWidth')}: <span className="font-medium text-gray-900">{species.canopyWidthMeters}m</span>
                      </span>
                    </div>
                  )}
                  {(species.lifeCycleYearsStart || species.lifeCycleYearsEnd) && (
                    <div className="flex items-center gap-3 text-sm">
                      <Clock className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">
                        {t('lifespan')}: <span className="font-medium text-gray-900">
                          {species.lifeCycleYearsStart && species.lifeCycleYearsEnd
                            ? `${species.lifeCycleYearsStart}-${species.lifeCycleYearsEnd}`
                            : species.lifeCycleYearsStart || species.lifeCycleYearsEnd} {t('years')}
                        </span>
                      </span>
                    </div>
                  )}
                  {(species.fruitingAgeStart || species.fruitingAgeEnd) && (
                    <div className="flex items-center gap-3 text-sm">
                      <Apple className="h-5 w-5 text-gray-400" />
                      <span className="text-gray-600">
                        {t('fruitsAt')}: <span className="font-medium text-gray-900">
                          {species.fruitingAgeStart && species.fruitingAgeEnd
                            ? `${species.fruitingAgeStart}-${species.fruitingAgeEnd}`
                            : species.fruitingAgeStart || species.fruitingAgeEnd} {t('years')}
                        </span>
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>
        </div>


        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Left Column - Main Info */}
          <div className="space-y-6 lg:col-span-2">
            {/* Nomenclature */}
            {(species.genus || species.botanicalFamily || species.synonyms?.length) && (
              <Card className="p-6">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                  <FileText className="h-5 w-5 text-gray-400" />
                  {t('nomenclature')}
                </h2>
                <dl className="space-y-3">
                  {species.genus && (
                    <div className="flex border-b pb-3">
                      <dt className="w-1/3 text-sm font-medium text-gray-600">{t('genus')}</dt>
                      <dd className="w-2/3 text-sm italic text-gray-900">{species.genus}</dd>
                    </div>
                  )}
                  {species.species && (
                    <div className="flex border-b pb-3">
                      <dt className="w-1/3 text-sm font-medium text-gray-600">{t('species')}</dt>
                      <dd className="w-2/3 text-sm italic text-gray-900">{species.species}</dd>
                    </div>
                  )}
                  {species.author && (
                    <div className="flex border-b pb-3">
                      <dt className="w-1/3 text-sm font-medium text-gray-600">{t('author')}</dt>
                      <dd className="w-2/3 text-sm text-gray-900">{species.author}</dd>
                    </div>
                  )}
                  {species.botanicalFamily && (
                    <div className="flex border-b pb-3">
                      <dt className="w-1/3 text-sm font-medium text-gray-600">{t('family')}</dt>
                      <dd className="w-2/3 text-sm text-gray-900">{species.botanicalFamily}</dd>
                    </div>
                  )}
                  {species.variety && (
                    <div className="flex border-b pb-3">
                      <dt className="w-1/3 text-sm font-medium text-gray-600">{t('variety')}</dt>
                      <dd className="w-2/3 text-sm text-gray-900">{species.variety}</dd>
                    </div>
                  )}
                  {species.synonyms && species.synonyms.length > 0 && (
                    <div className="flex">
                      <dt className="w-1/3 text-sm font-medium text-gray-600">{t('synonyms')}</dt>
                      <dd className="w-2/3 text-sm italic text-gray-900">
                        {species.synonyms.join(', ')}
                      </dd>
                    </div>
                  )}
                </dl>
              </Card>
            )}

            {/* Forest Ecology */}
            <Card className="p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                <Layers className="h-5 w-5 text-gray-400" />
                {t('forestEcology')}
              </h2>
              <dl className="space-y-3">
                <div className="flex border-b pb-3">
                  <dt className="w-1/3 text-sm font-medium text-gray-600">{t('stratum')}</dt>
                  <dd className="w-2/3">
                    <Badge className="bg-green-100 text-green-700">
                      {tStratum(species.stratum)}
                    </Badge>
                  </dd>
                </div>
                <div className="flex border-b pb-3">
                  <dt className="w-1/3 text-sm font-medium text-gray-600">{t('successionalStage')}</dt>
                  <dd className="w-2/3">
                    <Badge className="bg-blue-100 text-blue-700">
                      {tStage(species.successionalStage)}
                    </Badge>
                  </dd>
                </div>
                {species.growthRate && (
                  <div className="flex border-b pb-3">
                    <dt className="w-1/3 text-sm font-medium text-gray-600">{t('growthRate')}</dt>
                    <dd className="w-2/3">
                      <Badge className="bg-orange-100 text-orange-700">
                        {tGrowth(species.growthRate)}
                      </Badge>
                    </dd>
                  </div>
                )}
                {species.biomassProduction && (
                  <div className="flex border-b pb-3">
                    <dt className="w-1/3 text-sm font-medium text-gray-600">{t('biomassProduction')}</dt>
                    <dd className="w-2/3">
                      <Badge className="bg-lime-100 text-lime-700">
                        {tBiomass(species.biomassProduction)}
                      </Badge>
                    </dd>
                  </div>
                )}
                {species.pruningSprout && (
                  <div className="flex border-b pb-3">
                    <dt className="w-1/3 text-sm font-medium text-gray-600">{t('pruningSprout')}</dt>
                    <dd className="w-2/3">
                      <Badge className="bg-yellow-100 text-yellow-700">
                        {tPruningSprout(species.pruningSprout)}
                      </Badge>
                    </dd>
                  </div>
                )}
                {species.seedlingShade && (
                  <div className="flex border-b pb-3">
                    <dt className="w-1/3 text-sm font-medium text-gray-600">{t('seedlingShade')}</dt>
                    <dd className="w-2/3">
                      <Badge className="bg-indigo-100 text-indigo-700">
                        {tSeedlingShade(species.seedlingShade)}
                      </Badge>
                    </dd>
                  </div>
                )}
                <div className="flex border-b pb-3">
                  <dt className="w-1/3 text-sm font-medium text-gray-600">{t('nitrogenFixer')}</dt>
                  <dd className="w-2/3 text-sm text-gray-900">
                    {species.nitrogenFixer ? t('yes') : t('no')}
                  </dd>
                </div>
                <div className="flex border-b pb-3">
                  <dt className="w-1/3 text-sm font-medium text-gray-600">{t('serviceSpecies')}</dt>
                  <dd className="w-2/3 text-sm text-gray-900">
                    {species.serviceSpecies ? t('yes') : t('no')}
                  </dd>
                </div>
                <div className="flex">
                  <dt className="w-1/3 text-sm font-medium text-gray-600">{t('hasFruit')}</dt>
                  <dd className="w-2/3 text-sm text-gray-900">
                    {species.hasFruit ? t('yes') : t('no')}
                  </dd>
                </div>
              </dl>
            </Card>

            {/* Physical Characteristics */}
            <Card className="p-6">
              <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                <TreeDeciduous className="h-5 w-5 text-gray-400" />
                {t('physicalCharacteristics')}
              </h2>
              <dl className="space-y-3">
                {species.heightMeters && (
                  <div className="flex border-b pb-3">
                    <dt className="w-1/3 text-sm font-medium text-gray-600">{t('height')}</dt>
                    <dd className="w-2/3 text-sm text-gray-900">{species.heightMeters}m</dd>
                  </div>
                )}
                {species.canopyWidthMeters && (
                  <div className="flex border-b pb-3">
                    <dt className="w-1/3 text-sm font-medium text-gray-600">{t('canopyWidth')}</dt>
                    <dd className="w-2/3 text-sm text-gray-900">{species.canopyWidthMeters}m</dd>
                  </div>
                )}
                {species.canopyShape && (
                  <div className="flex border-b pb-3">
                    <dt className="w-1/3 text-sm font-medium text-gray-600">{t('canopyShape')}</dt>
                    <dd className="w-2/3">
                      <Badge className="bg-teal-100 text-teal-700">
                        {tCanopy(species.canopyShape)}
                      </Badge>
                    </dd>
                  </div>
                )}
                {species.rootSystem && (
                  <div className="flex border-b pb-3">
                    <dt className="w-1/3 text-sm font-medium text-gray-600">{t('rootSystem')}</dt>
                    <dd className="w-2/3">
                      <Badge className="bg-amber-100 text-amber-700">
                        {tRoot(species.rootSystem)}
                      </Badge>
                    </dd>
                  </div>
                )}
                {species.foliageType && (
                  <div className="flex border-b pb-3">
                    <dt className="w-1/3 text-sm font-medium text-gray-600">{t('foliageType')}</dt>
                    <dd className="w-2/3">
                      <Badge className="bg-green-100 text-green-700">
                        {tFoliage(species.foliageType)}
                      </Badge>
                    </dd>
                  </div>
                )}
                {species.leafDropSeason && (
                  <div className="flex">
                    <dt className="w-1/3 text-sm font-medium text-gray-600">{t('leafDropSeason')}</dt>
                    <dd className="w-2/3 text-sm text-gray-900">{species.leafDropSeason}</dd>
                  </div>
                )}
              </dl>
            </Card>

            {/* Observations */}
            {species.observations && (
              <Card className="p-6">
                <h2 className="mb-4 flex items-center gap-2 text-xl font-semibold text-gray-900">
                  <FileText className="h-5 w-5 text-gray-400" />
                  {t('observations')}
                </h2>
                <p className="text-sm leading-relaxed text-gray-700">{species.observations}</p>
              </Card>
            )}
          </div>

          {/* Right Column - Secondary Info */}
          <div className="space-y-6">
            {/* Habitat & Distribution */}
            {(species.originCenter || species.regionalBiome?.length) && (
              <Card className="p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  {t('habitat')}
                </h2>
                <div className="space-y-4">
                  {species.originCenter && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-gray-600">{t('originCenter')}</p>
                      <p className="text-sm text-gray-900">{species.originCenter}</p>
                    </div>
                  )}
                  {species.globalBiome && (
                    <div>
                      <p className="mb-2 text-xs font-medium text-gray-600">{t('globalBiome')}</p>
                      <Badge className="bg-sky-100 text-sky-700">
                        {tBiome(species.globalBiome)}
                      </Badge>
                    </div>
                  )}
                  {species.regionalBiome && species.regionalBiome.length > 0 && (
                    <div>
                      <p className="mb-2 text-xs font-medium text-gray-600">{t('regionalBiomes')}</p>
                      <div className="flex flex-wrap gap-2">
                        {species.regionalBiome.map((biome) => (
                          <Badge key={biome} className="bg-emerald-100 text-emerald-700">
                            {tBiome(biome)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Uses & Applications */}
            {species.uses && species.uses.length > 0 && (
              <Card className="p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Hammer className="h-5 w-5 text-gray-400" />
                  {t('uses')}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {species.uses.map((use) => (
                    <Badge key={use} className="bg-violet-100 text-violet-700">
                      {tUse(use)}
                    </Badge>
                  ))}
                </div>
              </Card>
            )}

            {/* Life Cycle Timeline */}
            {(species.lifeCycleYearsStart || species.lifeCycleYearsEnd || species.fruitingAgeStart || species.fruitingAgeEnd) && (
              <Card className="p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <TrendingUp className="h-5 w-5 text-gray-400" />
                  {t('lifeCycle')}
                </h2>
                <div className="space-y-4">
                  {species.lifeCycle && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-gray-600">{t('type')}</p>
                      <Badge className="bg-purple-100 text-purple-700">
                        {tLifeCycle(species.lifeCycle)}
                      </Badge>
                    </div>
                  )}
                  {(species.lifeCycleYearsStart || species.lifeCycleYearsEnd) && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-gray-600">{t('lifespan')}</p>
                      <p className="text-sm text-gray-900">
                        {species.lifeCycleYearsStart && species.lifeCycleYearsEnd
                          ? `${species.lifeCycleYearsStart}-${species.lifeCycleYearsEnd}`
                          : species.lifeCycleYearsStart || species.lifeCycleYearsEnd} {t('years')}
                      </p>
                    </div>
                  )}
                  {(species.fruitingAgeStart || species.fruitingAgeEnd) && (
                    <div>
                      <p className="mb-1 text-xs font-medium text-gray-600">{t('fruitingAge')}</p>
                      <p className="text-sm text-gray-900">
                        {species.fruitingAgeStart && species.fruitingAgeEnd
                          ? `${species.fruitingAgeStart}-${species.fruitingAgeEnd}`
                          : species.fruitingAgeStart || species.fruitingAgeEnd} {t('years')}
                      </p>
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* Propagation */}
            {((species.propagationMethods && species.propagationMethods.length > 0) || species.germinationDaysMin || species.germinationDaysMax) && (
              <Card className="p-6">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-gray-900">
                  <Sprout className="h-5 w-5 text-gray-400" />
                  {t('propagation')}
                </h2>
                {species.propagationMethods && species.propagationMethods.length > 0 && (
                  <ul className="space-y-2 mb-4">
                    {species.propagationMethods.map((method, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <Sprout className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                        {method}
                      </li>
                    ))}
                  </ul>
                )}
                {(species.germinationDaysMin || species.germinationDaysMax) && (
                  <div className="flex items-center gap-2 text-sm text-gray-700">
                    <Clock className="h-4 w-4 flex-shrink-0 text-amber-600" />
                    <span className="font-medium">{t('germinationTime')}:</span>
                    <span>
                      {species.germinationDaysMin && species.germinationDaysMax
                        ? `${species.germinationDaysMin}-${species.germinationDaysMax} ${t('days')}`
                        : species.germinationDaysMin
                        ? `${species.germinationDaysMin}+ ${t('days')}`
                        : `${t('upTo')} ${species.germinationDaysMax} ${t('days')}`}
                    </span>
                  </div>
                )}
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
