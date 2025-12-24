import prisma from '@/lib/prisma'
import { BadgeCategory, UserRole } from '@prisma/client'

// Level progression thresholds (total XP/Abundance required for each level)
// Titles follow successional stages from syntropic agriculture
export const LEVEL_THRESHOLDS = [
  { level: 1, xpRequired: 0, title: 'Pioneer Seed' },
  { level: 2, xpRequired: 100, title: 'Pioneer Sprout' },
  { level: 3, xpRequired: 350, title: 'Early Secondary' },
  { level: 4, xpRequired: 850, title: 'Secondary Growth' },
  { level: 5, xpRequired: 1600, title: 'Mid Secondary' },
  { level: 6, xpRequired: 2600, title: 'Late Secondary' },
  { level: 7, xpRequired: 4100, title: 'Pre-Climax' },
  { level: 8, xpRequired: 6100, title: 'Climax Pioneer' },
  { level: 9, xpRequired: 9100, title: 'Climax Builder' },
  { level: 10, xpRequired: 14100, title: 'Climax Master' },
] as const

// XP rewards for various actions
export const XP_REWARDS = {
  SPECIES_SUBMITTED: 10,
  SPECIES_PUBLISHED: 50,
  SPECIES_RESUBMITTED: 5,
  REVIEW_SUBMITTED: 15,
  ISSUE_REPORTED: 10,
  PHOTO_UPLOADED: 5,
} as const

export type XPAction = keyof typeof XP_REWARDS

/**
 * Award XP to a user and check for level up
 */
export async function awardXP(
  userId: string,
  action: XPAction,
  customAmount?: number
): Promise<{ newXP: number; leveledUp: boolean; newLevel?: number; newTitle?: string }> {
  const amount = customAmount ?? XP_REWARDS[action]

  // Get current user XP
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { xp: true, level: true },
  })

  if (!user) {
    throw new Error('User not found')
  }

  const newXP = user.xp + amount

  // Check for level up
  const { level: newLevel, title: newTitle } = getLevelForXP(newXP)
  const leveledUp = newLevel > user.level

  // Update user
  await prisma.user.update({
    where: { id: userId },
    data: {
      xp: newXP,
      level: newLevel,
      title: newTitle,
    },
  })

  return {
    newXP,
    leveledUp,
    newLevel: leveledUp ? newLevel : undefined,
    newTitle: leveledUp ? newTitle : undefined,
  }
}

/**
 * Get the level and title for a given XP amount
 */
export function getLevelForXP(xp: number): { level: number; title: string } {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i].xpRequired) {
      return {
        level: LEVEL_THRESHOLDS[i].level,
        title: LEVEL_THRESHOLDS[i].title,
      }
    }
  }
  return { level: 1, title: 'Pioneer Seed' }
}

/**
 * Get XP progress to next level
 */
export function getXPProgress(
  xp: number,
  level: number
): { currentLevelXP: number; nextLevelXP: number; progress: number } {
  const currentThreshold = LEVEL_THRESHOLDS.find(t => t.level === level)
  const nextThreshold = LEVEL_THRESHOLDS.find(t => t.level === level + 1)

  if (!currentThreshold) {
    return { currentLevelXP: 0, nextLevelXP: 100, progress: 0 }
  }

  if (!nextThreshold) {
    // Max level
    return { currentLevelXP: currentThreshold.xpRequired, nextLevelXP: xp, progress: 100 }
  }

  const xpInCurrentLevel = xp - currentThreshold.xpRequired
  const xpNeededForNextLevel = nextThreshold.xpRequired - currentThreshold.xpRequired
  const progress = Math.min(100, Math.floor((xpInCurrentLevel / xpNeededForNextLevel) * 100))

  return {
    currentLevelXP: currentThreshold.xpRequired,
    nextLevelXP: nextThreshold.xpRequired,
    progress,
  }
}

/**
 * Award a badge to a user if they don't already have it
 */
export async function awardBadge(
  userId: string,
  badgeCode: string
): Promise<{ awarded: boolean; badge?: { name: string; icon: string; xpReward: number } }> {
  // Check if badge exists
  const badge = await prisma.badge.findUnique({
    where: { code: badgeCode },
  })

  if (!badge) {
    console.warn(`Badge not found: ${badgeCode}`)
    return { awarded: false }
  }

  // Check if user already has this badge
  const existing = await prisma.userBadge.findUnique({
    where: {
      userId_badgeId: { userId, badgeId: badge.id },
    },
  })

  if (existing) {
    return { awarded: false }
  }

  // Award the badge
  await prisma.userBadge.create({
    data: {
      userId,
      badgeId: badge.id,
    },
  })

  // Award XP for the badge
  if (badge.xpReward > 0) {
    await awardXP(userId, 'SPECIES_SUBMITTED', badge.xpReward)
  }

  return {
    awarded: true,
    badge: {
      name: badge.name,
      icon: badge.icon,
      xpReward: badge.xpReward,
    },
  }
}

/**
 * Check all badges for a user and award any they've earned
 */
export async function checkBadges(userId: string): Promise<{
  newBadges: Array<{ code: string; name: string; icon: string }>
}> {
  const newBadges: Array<{ code: string; name: string; icon: string }> = []

  // Get user data with counts
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      _count: {
        select: {
          speciesCreated: true,
          photos: true,
          reviewsGiven: true,
        },
      },
    },
  })

  if (!user) return { newBadges }

  // Get published species count
  const publishedCount = await prisma.species.count({
    where: {
      createdById: userId,
      status: 'PUBLISHED',
    },
  })

  // Get review stats
  const reviewStats = await prisma.speciesReview.groupBy({
    by: ['decision'],
    where: { reviewerId: userId },
    _count: true,
  })

  const totalReviews = reviewStats.reduce((sum, r) => sum + r._count, 0)
  const approvalCount = reviewStats.find(r => r.decision === 'APPROVED')?._count ?? 0

  // Get all badges user doesn't have yet
  const allBadges = await prisma.badge.findMany({
    where: {
      users: {
        none: { userId },
      },
    },
  })

  for (const badge of allBadges) {
    const requirement = badge.requirement as Record<string, unknown>
    let earned = false

    switch (requirement.type) {
      case 'species_submitted':
        earned = user._count.speciesCreated >= (requirement.count as number)
        break

      case 'species_published':
        earned = publishedCount >= (requirement.count as number)
        break

      case 'photos_uploaded':
        earned = user._count.photos >= (requirement.count as number)
        break

      case 'reviews_given':
        earned = totalReviews >= (requirement.count as number)
        break

      case 'reviewer_status':
        earned = user.role === UserRole.REVIEWER || user.role === UserRole.ADMIN
        break

      case 'approval_accuracy':
        if (totalReviews >= (requirement.minReviews as number)) {
          const accuracy = (approvalCount / totalReviews) * 100
          earned = accuracy >= (requirement.accuracy as number)
        }
        break

      case 'all_fields_complete':
        // Check if user has a species with all optional fields filled
        const completeSpecies = await prisma.species.findFirst({
          where: {
            createdById: userId,
            status: 'PUBLISHED',
            lifeCycle: { not: null },
            heightMeters: { not: null },
            canopyWidthMeters: { not: null },
            canopyShape: { not: null },
            originCenter: { not: null },
            foliageType: { not: null },
            growthRate: { not: null },
            rootSystem: { not: null },
            biomassProduction: { not: null },
            pruningSprout: { not: null },
            seedlingShade: { not: null },
            observations: { not: null },
          },
        })
        earned = !!completeSpecies
        break

      case 'date_before':
        // Early adopter type badges
        earned = user.createdAt < new Date(requirement.date as string)
        break

      case 'streak':
        // TODO: Implement activity streak checking
        // This would require tracking daily activity
        break
    }

    if (earned) {
      await awardBadge(userId, badge.code)
      newBadges.push({
        code: badge.code,
        name: badge.name,
        icon: badge.icon,
      })
    }
  }

  return { newBadges }
}

/**
 * Get user's badges
 */
export async function getUserBadges(userId: string) {
  const userBadges = await prisma.userBadge.findMany({
    where: { userId },
    include: {
      badge: true,
    },
    orderBy: { earnedAt: 'desc' },
  })

  return userBadges.map(ub => ({
    ...ub.badge,
    earnedAt: ub.earnedAt,
  }))
}

/**
 * Get user's gamification profile
 */
export async function getUserGamificationProfile(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      role: true,
      xp: true,
      level: true,
      title: true,
      createdAt: true,
      _count: {
        select: {
          speciesCreated: true,
          photos: true,
          reviewsGiven: true,
        },
      },
    },
  })

  if (!user) return null

  // Get published species count
  const publishedCount = await prisma.species.count({
    where: {
      createdById: userId,
      status: 'PUBLISHED',
    },
  })

  // Get badges
  const badges = await getUserBadges(userId)

  // Get XP progress
  const xpProgress = getXPProgress(user.xp, user.level)

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      joinedAt: user.createdAt,
    },
    gamification: {
      xp: user.xp,
      level: user.level,
      title: user.title ?? 'Pioneer Seed',
      xpProgress,
    },
    stats: {
      speciesContributed: user._count.speciesCreated,
      speciesPublished: publishedCount,
      photosUploaded: user._count.photos,
      reviewsGiven: user._count.reviewsGiven,
    },
    badges,
  }
}

export type LeaderboardType = 'contributors' | 'reviewers' | 'xp'
export type LeaderboardPeriod = 'all_time' | 'month'

/**
 * Get leaderboard data
 */
export async function getLeaderboard(
  type: LeaderboardType = 'xp',
  period: LeaderboardPeriod = 'all_time',
  limit: number = 10
) {
  const monthStart = new Date(new Date().setDate(1))

  if (type === 'contributors') {
    // Top contributors by published species count
    const contributors = await prisma.species.groupBy({
      by: ['createdById'],
      where: {
        status: 'PUBLISHED',
        ...(period === 'month' ? { publishedAt: { gte: monthStart } } : {}),
      },
      _count: true,
      orderBy: { _count: { createdById: 'desc' } },
      take: limit,
    })

    const userIds = contributors.map(c => c.createdById)
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        name: true,
        avatar: true,
        level: true,
        title: true,
      },
    })

    return contributors.map((c, index) => {
      const user = users.find(u => u.id === c.createdById)
      return {
        rank: index + 1,
        userId: c.createdById,
        name: user?.name,
        avatar: user?.avatar,
        level: user?.level ?? 1,
        title: user?.title ?? 'Pioneer Seed',
        value: c._count,
        metric: 'species published',
      }
    })
  }

  if (type === 'reviewers') {
    // Top reviewers by review count
    const reviewers = await prisma.speciesReview.groupBy({
      by: ['reviewerId'],
      where: period === 'month' ? { reviewedAt: { gte: monthStart } } : {},
      _count: true,
      orderBy: { _count: { reviewerId: 'desc' } },
      take: limit,
    })

    const userIds = reviewers.map(r => r.reviewerId)
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: {
        id: true,
        name: true,
        avatar: true,
        level: true,
        title: true,
      },
    })

    return reviewers.map((r, index) => {
      const user = users.find(u => u.id === r.reviewerId)
      return {
        rank: index + 1,
        userId: r.reviewerId,
        name: user?.name,
        avatar: user?.avatar,
        level: user?.level ?? 1,
        title: user?.title ?? 'Pioneer Seed',
        value: r._count,
        metric: 'reviews',
      }
    })
  }

  // XP leaders (default)
  const leaders = await prisma.user.findMany({
    where: { xp: { gt: 0 } },
    select: {
      id: true,
      name: true,
      avatar: true,
      level: true,
      title: true,
      xp: true,
    },
    orderBy: { xp: 'desc' },
    take: limit,
  })

  return leaders.map((user, index) => ({
    rank: index + 1,
    userId: user.id,
    name: user.name,
    avatar: user.avatar,
    level: user.level,
    title: user.title ?? 'Pioneer Seed',
    value: user.xp,
    metric: 'Abundance',
  }))
}
