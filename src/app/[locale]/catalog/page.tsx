import { Suspense } from 'react'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { CatalogoClient } from '@/components/catalog/CatalogoClient'
import { CatalogSkeleton } from '@/components/catalog/CatalogSkeleton'
import { prisma } from '@/lib/prisma'
import { type SpeciesListItem, type SpeciesFilters } from '@/types/species'
import { parseArrayParam, parseBooleanParam, parseNumberParam } from '@/lib/filterParams'
import { Prisma } from '@prisma/client'

interface CatalogoPageProps {
  params: { locale: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

async function getFilteredSpecies(
  filters: SpeciesFilters,
  page: number,
  pageSize: number
): Promise<{ species: SpeciesListItem[]; totalCount: number }> {
  // If there's a search term, first find matching IDs using raw SQL for partial matching
  let searchMatchingIds: string[] | null = null
  if (filters.search) {
    const searchPattern = `%${filters.search.trim()}%`
    const searchResults = await prisma.$queryRaw<{ id: string }[]>`
      SELECT id FROM species
      WHERE status = 'PUBLISHED'
      AND (
        scientific_name ILIKE ${searchPattern}
        OR genus ILIKE ${searchPattern}
        OR array_to_string(common_names, ' ') ILIKE ${searchPattern}
      )
    `
    searchMatchingIds = searchResults.map(r => r.id)
  }

  // Build dynamic where clause based on filters
  const where: Prisma.SpeciesWhereInput = {
    status: 'PUBLISHED',

    // Text search - use IDs from raw SQL search
    ...(searchMatchingIds !== null && {
      id: { in: searchMatchingIds }
    }),

    // Categorical filters
    ...(filters.stratum?.length && { stratum: { in: filters.stratum } }),
    ...(filters.successionalStage?.length && { successionalStage: { in: filters.successionalStage } }),
    ...(filters.lifeCycle?.length && { lifeCycle: { in: filters.lifeCycle } }),
    ...(filters.foliageType?.length && { foliageType: { in: filters.foliageType } }),
    ...(filters.growthRate?.length && { growthRate: { in: filters.growthRate } }),

    // Array filters (regional/global biome, uses)
    ...(filters.regionalBiome?.length && {
      regionalBiome: { hasSome: filters.regionalBiome }
    }),
    ...(filters.globalBiome?.length && {
      globalBiome: { in: filters.globalBiome }
    }),
    ...(filters.uses?.length && {
      uses: { hasSome: filters.uses }
    }),

    // Boolean filters
    ...(filters.nitrogenFixer && { nitrogenFixer: true }),
    ...(filters.edibleFruit && { edibleFruit: true }),
  }

  // Fetch species and total count in parallel for optimal performance
  const [dbSpecies, totalCount] = await Promise.all([
    prisma.species.findMany({
      where,
      include: {
        photos: {
          where: { approved: true },
          orderBy: { primary: 'desc' },
          take: 1,
          select: { url: true }
        }
      },
      orderBy: { scientificName: 'asc' },
      take: pageSize,
      skip: (page - 1) * pageSize
    }),
    prisma.species.count({ where })
  ])

  // Transform database results to SpeciesListItem format
  const species: SpeciesListItem[] = dbSpecies.map(sp => {
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
      lifeCycle: sp.lifeCycle,
      lifeCycleYearsStart: sp.lifeCycleYearsStart,
      lifeCycleYearsEnd: sp.lifeCycleYearsEnd,
      regionalBiome: sp.regionalBiome || undefined,
      globalBiome: sp.globalBiome,
      foliageType: sp.foliageType,
      growthRate: sp.growthRate,
      uses: sp.uses || undefined,
      nitrogenFixer: sp.nitrogenFixer || undefined,
      edibleFruit: sp.edibleFruit || undefined,
      serviceSpecies: sp.serviceSpecies || false,
      heightMeters,
      canopyWidthMeters,
      fruitingAgeStart: sp.fruitingAgeStart,
      fruitingAgeEnd: sp.fruitingAgeEnd,
      imageUrl
    }
  })

  return { species, totalCount }
}

export default async function CatalogoPage({ params, searchParams }: CatalogoPageProps) {
  // Parse filters from URL parameters
  const filters: SpeciesFilters = {
    search: searchParams.search as string | undefined,
    stratum: parseArrayParam(searchParams.stratum) as SpeciesFilters['stratum'],
    successionalStage: parseArrayParam(searchParams.successionalStage) as SpeciesFilters['successionalStage'],
    lifeCycle: parseArrayParam(searchParams.lifeCycle) as SpeciesFilters['lifeCycle'],
    regionalBiome: parseArrayParam(searchParams.regionalBiome) as SpeciesFilters['regionalBiome'],
    globalBiome: parseArrayParam(searchParams.globalBiome) as SpeciesFilters['globalBiome'],
    foliageType: parseArrayParam(searchParams.foliageType) as SpeciesFilters['foliageType'],
    growthRate: parseArrayParam(searchParams.growthRate) as SpeciesFilters['growthRate'],
    uses: parseArrayParam(searchParams.uses) as SpeciesFilters['uses'],
    nitrogenFixer: parseBooleanParam(searchParams.nitrogenFixer),
    edibleFruit: parseBooleanParam(searchParams.edibleFruit),
    service: parseBooleanParam(searchParams.service),
  }

  // Parse pagination
  const page = parseNumberParam(searchParams.page, 1)
  const pageSize = 50

  // Fetch filtered species with pagination
  const { species, totalCount } = await getFilteredSpecies(filters, page, pageSize)
  const totalPages = Math.ceil(totalCount / pageSize)

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50 overflow-x-hidden">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-[1600px]">
          <Suspense fallback={<CatalogSkeleton />}>
            <CatalogoClient
              species={species}
              currentFilters={filters}
              totalCount={totalCount}
              currentPage={page}
              totalPages={totalPages}
            />
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  )
}
