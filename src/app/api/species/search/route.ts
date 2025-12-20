import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const limitParam = searchParams.get('limit')

    // Validation
    if (!query || query.trim().length < 3) {
      return NextResponse.json(
        { error: 'Query must be at least 3 characters' },
        { status: 400 }
      )
    }

    const limit = Math.min(parseInt(limitParam || '8'), 50)
    const sanitizedQuery = query.trim()
    const searchPattern = `%${sanitizedQuery}%`

    // Use raw query to enable partial matching on common_names array
    // This searches: scientific_name, genus, and common_names (converted to string)
    // Include PUBLISHED species and IN_REVIEW species with revision requests (previously published)
    const speciesRows = await prisma.$queryRaw<{ id: string; scientific_name: string }[]>`
      SELECT id, scientific_name FROM species
      WHERE (status = 'PUBLISHED' OR (status = 'IN_REVIEW' AND revision_requested_by_id IS NOT NULL))
      AND (
        scientific_name ILIKE ${searchPattern}
        OR genus ILIKE ${searchPattern}
        OR array_to_string(common_names, ' ') ILIKE ${searchPattern}
      )
      ORDER BY scientific_name ASC
      LIMIT ${limit}
    `

    const totalCountResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM species
      WHERE (status = 'PUBLISHED' OR (status = 'IN_REVIEW' AND revision_requested_by_id IS NOT NULL))
      AND (
        scientific_name ILIKE ${searchPattern}
        OR genus ILIKE ${searchPattern}
        OR array_to_string(common_names, ' ') ILIKE ${searchPattern}
      )
    `

    const totalCount = Number(totalCountResult[0]?.count || 0)
    const ids = speciesRows.map(s => s.id)

    // Fetch full species data with photos
    const species = ids.length > 0 ? await prisma.species.findMany({
      where: {
        id: { in: ids }
      },
      select: {
        id: true,
        slug: true,
        scientificName: true,
        commonNames: true,
        stratum: true,
        successionalStage: true,
        heightMeters: true,
        edibleFruit: true,
        photos: {
          where: { primary: true },
          take: 1,
          select: { url: true }
        }
      },
      orderBy: [{ scientificName: 'asc' }]
    }) : []

    // Transform results to match SearchResult interface
    const results = species.map((s) => ({
      id: s.id,
      slug: s.slug,
      scientificName: s.scientificName,
      commonNames: s.commonNames,
      stratum: s.stratum,
      successionalStage: s.successionalStage,
      heightMeters: s.heightMeters ? parseFloat(s.heightMeters.toString()) : null,
      edibleFruit: s.edibleFruit || false,
      imageUrl: s.photos[0]?.url || '/images/placeholder-species.jpg'
    }))

    return NextResponse.json({
      results,
      totalCount,
      query: sanitizedQuery
    })
  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
