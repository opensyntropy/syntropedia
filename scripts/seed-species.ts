import { PrismaClient, Stratum, SuccessionalStage, LifeCycle, FoliageType, GrowthRate, PlantUse } from '@prisma/client'

const prisma = new PrismaClient()

const stratums: Stratum[] = ['EMERGENT', 'HIGH', 'MEDIUM', 'LOW', 'GROUND']
const stages: SuccessionalStage[] = ['PIONEER', 'EARLY_SECONDARY', 'LATE_SECONDARY', 'CLIMAX']
const lifeCycles: LifeCycle[] = ['ANNUAL', 'BIENNIAL', 'PERENNIAL']
const foliageTypes: FoliageType[] = ['EVERGREEN', 'SEMI_EVERGREEN', 'DECIDUOUS', 'SEMI_DECIDUOUS']
const growthRates: GrowthRate[] = ['VERY_FAST', 'FAST', 'MEDIUM', 'SLOW', 'VERY_SLOW']
const uses: PlantUse[] = ['HUMAN_FOOD', 'ANIMAL_FOOD', 'TIMBER', 'MEDICINAL', 'ORNAMENTAL', 'SHADE', 'WINDBREAK']

const regionalBiomes = ['Atlantic Forest', 'Cerrado', 'Amazon', 'Caatinga', 'Pantanal', 'Pampa']
const globalBiomes = ['Tropical Rainforest', 'Tropical Savanna', 'Temperate Forest', 'Mediterranean']

const speciesData = [
  { genus: 'Cedrela', species: 'fissilis', common: ['Cedro-rosa', 'Red Cedar', 'Spanish Cedar'] },
  { genus: 'Tabebuia', species: 'impetiginosa', common: ['Ipê-roxo', 'Purple Lapacho', 'Pink Trumpet Tree'] },
  { genus: 'Hymenaea', species: 'courbaril', common: ['Jatobá', 'Brazilian Copal', 'West Indian Locust'] },
  { genus: 'Copaifera', species: 'langsdorffii', common: ['Copaíba', 'Diesel Tree', 'Copaiba'] },
  { genus: 'Astronium', species: 'graveolens', common: ['Guaritá', 'Goncalo Alves', 'Tigerwood'] },
  { genus: 'Anadenanthera', species: 'colubrina', common: ['Angico-branco', 'Cebil', 'Vilca'] },
  { genus: 'Enterolobium', species: 'contortisiliquum', common: ['Tamboril', 'Ear Pod Tree', 'Pacara Earpod Tree'] },
  { genus: 'Jacaranda', species: 'mimosifolia', common: ['Jacarandá-mimoso', 'Blue Jacaranda', 'Black Poui'] },
  { genus: 'Inga', species: 'edulis', common: ['Ingá', 'Ice Cream Bean', 'Guaba'] },
  { genus: 'Schinus', species: 'terebinthifolius', common: ['Aroeira-pimenteira', 'Brazilian Pepper', 'Christmas Berry'] },
  { genus: 'Cecropia', species: 'hololeuca', common: ['Embaúba-branca', 'Trumpet Tree', 'Snakewood'] },
  { genus: 'Psidium', species: 'cattleianum', common: ['Araçá', 'Strawberry Guava', 'Cattley Guava'] },
  { genus: 'Eugenia', species: 'uniflora', common: ['Pitanga', 'Surinam Cherry', 'Brazilian Cherry'] },
  { genus: 'Myrciaria', species: 'cauliflora', common: ['Jabuticaba', 'Brazilian Grape Tree', 'Jaboticaba'] },
  { genus: 'Annona', species: 'muricata', common: ['Graviola', 'Soursop', 'Guanábana'] },
  { genus: 'Pouteria', species: 'caimito', common: ['Abiu', 'Caimito', 'Yellow Star Apple'] },
  { genus: 'Plinia', species: 'cauliflora', common: ['Jabuticabeira', 'Brazilian Grape', 'Guaperu'] },
  { genus: 'Spondias', species: 'mombin', common: ['Cajá', 'Yellow Mombin', 'Hog Plum'] },
  { genus: 'Byrsonima', species: 'crassifolia', common: ['Murici', 'Golden Spoon', 'Nance'] },
  { genus: 'Talisia', species: 'esculenta', common: ['Pitomba', 'Pitomba Tree', 'Guinep'] },
  { genus: 'Dipteryx', species: 'alata', common: ['Baru', 'Cumbaru', 'Barueiro'] },
  { genus: 'Genipa', species: 'americana', common: ['Jenipapo', 'Genipap', 'Marmalade Box'] },
  { genus: 'Handroanthus', species: 'albus', common: ['Ipê-amarelo', 'Yellow Lapacho', 'Golden Trumpet Tree'] },
  { genus: 'Anadenanthera', species: 'peregrina', common: ['Angico-vermelho', 'Yopo', 'Cohoba'] },
  { genus: 'Mimosa', species: 'scabrella', common: ['Bracatinga', 'Brazilian Mimosa', 'Bracatinga'] },
  { genus: 'Leucaena', species: 'leucocephala', common: ['Leucena', 'White Leadtree', 'Jumbay'] },
  { genus: 'Gliricidia', species: 'sepium', common: ['Gliricídia', 'Mexican Lilac', 'Mother of Cacao'] },
  { genus: 'Peltophorum', species: 'dubium', common: ['Canafístula', 'Yellow Poinciana', 'Yellow Flame Tree'] },
  { genus: 'Senna', species: 'multijuga', common: ['Pau-cigarra', 'November Shower', 'Copperpod'] },
  { genus: 'Caesalpinia', species: 'ferrea', common: ['Pau-ferro', 'Brazilian Ironwood', 'Leopard Tree'] },
  { genus: 'Tipuana', species: 'tipu', common: ['Tipuana', 'Rosewood', 'Pride of Bolivia'] },
  { genus: 'Erythrina', species: 'crista-galli', common: ['Corticeira', 'Cockspur Coral Tree', 'Cry-baby Tree'] },
  { genus: 'Bauhinia', species: 'forficata', common: ['Pata-de-vaca', 'Orchid Tree', 'Brazilian Orchid Tree'] },
  { genus: 'Chorisia', species: 'speciosa', common: ['Paineira', 'Floss Silk Tree', 'Palo Borracho'] },
  { genus: 'Cariniana', species: 'legalis', common: ['Jequitibá-rosa', 'Brazilian Mahogany', 'Pink Jequitiba'] },
  { genus: 'Aspidosperma', species: 'polyneuron', common: ['Peroba-rosa', 'Pink Peroba', 'Red Quebracho'] },
  { genus: 'Myracrodruon', species: 'urundeuva', common: ['Aroeira', 'Urunday', 'Aroeira-do-sertão'] },
  { genus: 'Paratecoma', species: 'peroba', common: ['Peroba-do-campo', 'Yellow Peroba', 'Ipê-peroba'] },
  { genus: 'Cordia', species: 'trichotoma', common: ['Louro-pardo', 'Laurel Cordia', 'Peterebi'] },
  { genus: 'Luehea', species: 'divaricata', common: ['Açoita-cavalo', 'Brazilian Jute', 'Azote Caballo'] },
  { genus: 'Guazuma', species: 'ulmifolia', common: ['Mutambo', 'West Indian Elm', 'Guácima'] },
  { genus: 'Trema', species: 'micrantha', common: ['Grandiúva', 'Jamaica Nettletree', 'Guácimo'] },
  { genus: 'Alchornea', species: 'glandulosa', common: ['Tapiá', 'Christmas Bush', 'Uvilla'] },
  { genus: 'Croton', species: 'urucurana', common: ['Sangra-d\'água', 'Dragon\'s Blood', 'Urucurana'] },
  { genus: 'Solanum', species: 'granulosoleprosum', common: ['Gravitinga', 'Tree Tomato', 'Fumo-bravo'] },
  { genus: 'Vernonia', species: 'polyanthes', common: ['Assa-peixe', 'Ironweed', 'Cambará-branco'] },
  { genus: 'Baccharis', species: 'dracunculifolia', common: ['Alecrim-do-campo', 'Rosemary Groundsel', 'Vassoura'] },
  { genus: 'Sapindus', species: 'saponaria', common: ['Saboeiro', 'Soapberry', 'Jaboncillo'] },
  { genus: 'Dilodendron', species: 'bipinnatum', common: ['Maria-pobre', 'Mulungu-do-litoral', 'Tamboril-branco'] },
  { genus: 'Ceiba', species: 'speciosa', common: ['Paineira-rosa', 'Silk Floss Tree', 'Palo Borracho Rosado'] },
  { genus: 'Ficus', species: 'enormis', common: ['Figueira', 'Fig Tree', 'Higuera'] },
  { genus: 'Triplaris', species: 'americana', common: ['Pau-formiga', 'Ant Tree', 'Long John'] },
  { genus: 'Platypodium', species: 'elegans', common: ['Amendoim-bravo', 'Brazilian Rosewood', 'Jacarandá-do-campo'] },
  { genus: 'Machaerium', species: 'stipitatum', common: ['Sapuva', 'Jacarandá-paulista', 'Canela-do-brejo'] },
  { genus: 'Lonchocarpus', species: 'muehlbergianus', common: ['Embira-de-sapo', 'Lance Pod', 'Barbasco'] },
  { genus: 'Centrolobium', species: 'tomentosum', common: ['Araribá', 'Arariba', 'Araribá-rosa'] },
  { genus: 'Ormosia', species: 'arborea', common: ['Olho-de-cabra', 'Necklace Tree', 'Colorín'] },
  { genus: 'Pterogyne', species: 'nitens', common: ['Amendoim', 'Amendoim-bravo', 'Brazilian Peanut Tree'] },
  { genus: 'Colubrina', species: 'glandulosa', common: ['Saguaraji', 'Greenheart', 'Bijaguara'] },
  { genus: 'Rhamnidium', species: 'elaeocarpum', common: ['Saguaraji-amarelo', 'Yellow Greenheart', 'Coffee Berry'] },
]

async function main() {
  console.log('🌱 Starting database seeding...')

  // First, ensure we have a user to assign as creator
  let user = await prisma.user.findFirst()

  if (!user) {
    console.log('📝 Creating seed user...')
    user = await prisma.user.create({
      data: {
        name: 'Seed User',
        email: 'seed@syntropedia.com',
        role: 'ADMIN',
      },
    })
  }

  console.log(`👤 Using user: ${user.name} (${user.id})`)

  // Create 60 species (more than one page)
  let created = 0
  let skipped = 0

  for (let i = 0; i < speciesData.length; i++) {
    const data = speciesData[i]
    const scientificName = `${data.genus} ${data.species}`
    const slug = `${data.genus.toLowerCase()}-${data.species.toLowerCase()}`

    // Check if species already exists
    const existing = await prisma.species.findUnique({ where: { slug } })
    if (existing) {
      console.log(`⏭️  Skipping existing: ${scientificName}`)
      skipped++
      continue
    }

    // Random attributes
    const stratum = stratums[Math.floor(Math.random() * stratums.length)]
    const stage = stages[Math.floor(Math.random() * stages.length)]
    const lifeCycle = lifeCycles[Math.floor(Math.random() * lifeCycles.length)]
    const foliageType = foliageTypes[Math.floor(Math.random() * foliageTypes.length)]
    const growthRate = growthRates[Math.floor(Math.random() * growthRates.length)]

    // Random uses (1-3 uses)
    const numUses = Math.floor(Math.random() * 3) + 1
    const randomUses = [...uses].sort(() => 0.5 - Math.random()).slice(0, numUses)

    // Random biomes (1-2 regional, 1 global)
    const numRegionalBiomes = Math.floor(Math.random() * 2) + 1
    const randomRegionalBiomes = [...regionalBiomes].sort(() => 0.5 - Math.random()).slice(0, numRegionalBiomes)
    const randomGlobalBiome = globalBiomes[Math.floor(Math.random() * globalBiomes.length)]

    // Random characteristics
    const nitrogenFixer = Math.random() > 0.7 // 30% chance
    const edibleFruit = Math.random() > 0.6 // 40% chance
    const height = (Math.random() * 30 + 3).toFixed(2) // 3-33 meters
    const canopyWidth = (Math.random() * 15 + 2).toFixed(2) // 2-17 meters

    try {
      await prisma.species.create({
        data: {
          slug,
          scientificName,
          genus: data.genus,
          species: data.species,
          commonNames: data.common,
          stratum,
          successionalStage: stage,
          lifeCycle,
          heightMeters: height,
          canopyWidthMeters: canopyWidth,
          regionalBiome: randomRegionalBiomes,
          globalBiome: randomGlobalBiome,
          foliageType,
          growthRate,
          uses: randomUses,
          nitrogenFixer,
          edibleFruit,
          status: 'PUBLISHED',
          createdById: user.id,
          botanicalFamily: `${data.genus}aceae`,
          observations: `This is a seed entry for ${scientificName}. Native to Brazilian biomes with various ecological and economic uses.`,
        },
      })

      created++
      console.log(`✅ Created: ${scientificName} (${created}/${speciesData.length})`)
    } catch (error) {
      console.error(`❌ Error creating ${scientificName}:`, error)
    }
  }

  console.log(`\n🎉 Seeding complete!`)
  console.log(`   Created: ${created} species`)
  console.log(`   Skipped: ${skipped} species (already exist)`)
  console.log(`   Total in database: ${created + skipped} species`)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
