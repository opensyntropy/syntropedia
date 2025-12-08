import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CatalogoClient } from '@/components/catalogo/CatalogoClient'
import { prisma } from '@/lib/prisma'
import { type SpeciesListItem } from '@/types/species'

async function getAllSpecies(): Promise<SpeciesListItem[]> {
  const dbSpecies = await prisma.species.findMany({
    where: {
      status: 'PUBLISHED'
    },
    include: {
      photos: {
        where: { approved: true },
        orderBy: { primary: 'desc' },
        take: 1,
        select: { url: true }
      }
    },
    orderBy: {
      scientificName: 'asc'
    }
  })

  return dbSpecies.map(sp => {
    const primaryPhoto = sp.photos.find((_, index) => index === 0)
    // SVG placeholder - no external network call needed
    const placeholderSvg = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600'%3E%3Crect width='800' height='600' fill='%234ade80'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='24' fill='white'%3ENo Image%3C/text%3E%3C/svg%3E`
    const imageUrl = primaryPhoto?.url || placeholderSvg

    // Convert Decimal types to numbers
    const heightMeters = sp.heightMeters ? Number(sp.heightMeters.toString()) : undefined
    const canopyWidthMeters = sp.canopyWidthMeters ? Number(sp.canopyWidthMeters.toString()) : undefined

    return {
      id: sp.id,
      slug: sp.slug,
      scientificName: sp.scientificName,
      commonNames: sp.commonNames,
      stratum: sp.stratum,
      successionalStage: sp.successionalStage,
      lifeCycle: sp.lifeCycle || 'PERENNIAL',
      lifeCycleYears: sp.lifeCycleYears ? { min: 0, max: 100 } : undefined,
      specieType: sp.specieType || 'TREE',
      regionalBiome: sp.regionalBiome || undefined,
      globalBiome: sp.globalBiome ? [sp.globalBiome] : undefined,
      foliageType: sp.foliageType || undefined,
      growthRate: sp.growthRate || undefined,
      uses: sp.uses || undefined,
      nitrogenFixer: sp.nitrogenFixer || undefined,
      edibleFruit: sp.edibleFruit || undefined,
      service: sp.nitrogenFixer || false, // Using nitrogenFixer as a proxy for "service"
      heightMeters,
      canopyWidthMeters,
      fruitingAge: sp.fruitingAge ? { min: 0, max: 20 } : undefined,
      imageUrl
    }
  })
}

export default async function CatalogoPage() {
  const species = await getAllSpecies()

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-6 py-8 lg:px-12">
          <CatalogoClient initialSpecies={species} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
