import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q')
    const limitParam = searchParams.get('limit')

    // Validation
    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Query must be at least 2 characters' },
        { status: 400 }
      )
    }

    const limit = Math.min(parseInt(limitParam || '8'), 50)
    const sanitizedQuery = query.trim()

    // Execute queries in parallel for better performance
    const [species, totalCount] = await Promise.all([
      prisma.species.findMany({
        where: {
          status: 'PUBLISHED',
          OR: [
            {
              scientificName: {
                contains: sanitizedQuery,
                mode: 'insensitive'
              }
            },
            {
              commonNames: {
                hasSome: [sanitizedQuery]
              }
            },
            {
              genus: {
                contains: sanitizedQuery,
                mode: 'insensitive'
              }
            }
          ]
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
        take: limit,
        orderBy: [{ scientificName: 'asc' }]
      }),
      prisma.species.count({
        where: {
          status: 'PUBLISHED',
          OR: [
            {
              scientificName: {
                contains: sanitizedQuery,
                mode: 'insensitive'
              }
            },
            {
              commonNames: {
                hasSome: [sanitizedQuery]
              }
            },
            {
              genus: {
                contains: sanitizedQuery,
                mode: 'insensitive'
              }
            }
          ]
        }
      })
    ])

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
