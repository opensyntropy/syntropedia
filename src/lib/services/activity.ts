import prisma from '@/lib/prisma'
import { ActivityAction } from '@prisma/client'

export interface LogActivityParams {
  action: ActivityAction
  userId: string
  speciesId?: string
  details?: Record<string, unknown>
}

export async function logActivity(params: LogActivityParams) {
  return prisma.activityLog.create({
    data: {
      action: params.action,
      userId: params.userId,
      speciesId: params.speciesId,
      details: params.details ?? undefined,
    },
  })
}

export async function getSpeciesActivity(speciesId: string) {
  return prisma.activityLog.findMany({
    where: { speciesId },
    include: {
      user: { select: { id: true, name: true, email: true, avatar: true } },
    },
    orderBy: { createdAt: 'desc' },
  })
}

export interface GetGlobalActivityParams {
  page?: number
  limit?: number
  action?: ActivityAction
  userId?: string
}

export async function getGlobalActivity(params: GetGlobalActivityParams = {}) {
  const { page = 1, limit = 20, action, userId } = params

  const where = {
    ...(action && { action }),
    ...(userId && { userId }),
  }

  const [activities, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        species: { select: { id: true, scientificName: true, slug: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.activityLog.count({ where }),
  ])

  return {
    activities,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export function getActivityActionLabel(action: ActivityAction): string {
  const labels: Record<ActivityAction, string> = {
    SPECIES_CREATED: 'Created species',
    SPECIES_UPDATED: 'Updated species',
    SPECIES_SUBMITTED: 'Submitted for review',
    REVIEW_APPROVED: 'Approved',
    REVIEW_REJECTED: 'Rejected',
    REVIEW_CHANGES_REQUESTED: 'Requested changes',
    SPECIES_PUBLISHED: 'Published',
  }
  return labels[action] || action
}
