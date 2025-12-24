import { prisma } from '@/lib/prisma'
import { getLeaderboard } from './gamification'

/**
 * Get homepage statistics
 */
export async function getHomeStats() {
  const [speciesCount, photosCount, contributorsCount] = await Promise.all([
    prisma.species.count({ where: { status: 'PUBLISHED' } }),
    prisma.photo.count({ where: { approved: true } }),
    prisma.user.count({
      where: {
        speciesCreated: {
          some: { status: 'PUBLISHED' },
        },
      },
    }),
  ])

  return {
    speciesCount,
    photosCount,
    contributorsCount,
  }
}

/**
 * Get featured species for homepage (most recent published)
 */
export async function getFeaturedSpecies(count: number = 6) {
  const species = await prisma.species.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      photos: {
        where: { primary: true },
        take: 1,
        select: { url: true },
      },
    },
    orderBy: { publishedAt: 'desc' },
    take: count,
  })

  return species.map((s) => ({
    id: s.id,
    slug: s.slug,
    scientificName: s.scientificName,
    commonNames: s.commonNames,
    stratum: s.stratum,
    successionalStage: s.successionalStage,
    imageUrl: s.photos[0]?.url || null,
  }))
}

/**
 * Get recently published species with dates
 */
export async function getRecentlyPublished(count: number = 4) {
  const species = await prisma.species.findMany({
    where: { status: 'PUBLISHED' },
    include: {
      photos: {
        where: { primary: true },
        take: 1,
        select: { url: true },
      },
    },
    orderBy: { publishedAt: 'desc' },
    take: count,
  })

  return species.map((s) => ({
    id: s.id,
    slug: s.slug,
    scientificName: s.scientificName,
    commonNames: s.commonNames,
    stratum: s.stratum,
    successionalStage: s.successionalStage,
    imageUrl: s.photos[0]?.url || null,
    publishedAt: s.publishedAt,
  }))
}

/**
 * Get top contributors for community highlights
 */
export async function getTopContributors(count: number = 3) {
  const contributors = await getLeaderboard('contributors', 'all_time', count)

  return contributors.map((c) => ({
    id: c.userId,
    name: c.name || 'Anonymous',
    avatar: c.avatar,
    level: c.level,
    title: c.title,
    publishedCount: c.value,
  }))
}
