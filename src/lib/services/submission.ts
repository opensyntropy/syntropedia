import prisma from '@/lib/prisma'
import { SpeciesStatus, UserRole, ActivityAction } from '@prisma/client'
import { logActivity } from './activity'
import { sendSubmissionNotification } from './email'
import type { SpeciesFormData } from '@/lib/validations/species'

// Transform form data arrays to Prisma-compatible types
function transformFormData(data: Partial<SpeciesFormData>) {
  const transformed = { ...data } as Record<string, unknown>

  // Convert array fields to comma-separated strings for String? columns
  if ('originCenter' in data) {
    transformed.originCenter = data.originCenter?.length ? data.originCenter.join(', ') : null
  }
  if ('globalBiome' in data) {
    transformed.globalBiome = data.globalBiome?.length ? data.globalBiome.join(', ') : null
  }

  return transformed
}

function generateSlug(scientificName: string): string {
  return scientificName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export interface CreateSubmissionParams {
  data: SpeciesFormData
  userId: string
}

export async function createSubmission(params: CreateSubmissionParams) {
  const { data, userId } = params

  // Generate unique slug
  let slug = generateSlug(data.scientificName)
  const existingWithSlug = await prisma.species.findUnique({ where: { slug } })
  if (existingWithSlug) {
    slug = `${slug}-${Date.now()}`
  }

  const species = await prisma.species.create({
    data: {
      slug,
      scientificName: data.scientificName,
      genus: data.genus,
      species: data.species,
      author: data.author,
      commonNames: data.commonNames,
      synonyms: data.synonyms || [],
      botanicalFamily: data.botanicalFamily,
      variety: data.variety,
      stratum: data.stratum,
      successionalStage: data.successionalStage,
      lifeCycle: data.lifeCycle,
      lifeCycleYears: data.lifeCycleYears,
      heightMeters: data.heightMeters,
      canopyWidthMeters: data.canopyWidthMeters,
      canopyShape: data.canopyShape,
      originCenter: data.originCenter?.length ? data.originCenter.join(', ') : null,
      globalBiome: data.globalBiome?.length ? data.globalBiome.join(', ') : null,
      regionalBiome: data.regionalBiome || [],
      foliageType: data.foliageType,
      leafDropSeason: data.leafDropSeason,
      growthRate: data.growthRate,
      rootSystem: data.rootSystem,
      nitrogenFixer: data.nitrogenFixer || false,
      biomassProduction: data.biomassProduction,
      hasFruit: data.hasFruit || false,
      edibleFruit: data.edibleFruit || false,
      fruitingAge: data.fruitingAge,
      uses: data.uses || [],
      propagationMethods: data.propagationMethods || [],
      observations: data.observations,
      status: SpeciesStatus.DRAFT,
      createdById: userId,
    },
  })

  await logActivity({
    action: ActivityAction.SPECIES_CREATED,
    userId,
    speciesId: species.id,
  })

  return species
}

export interface UpdateSubmissionParams {
  id: string
  data: Partial<SpeciesFormData>
  userId: string
}

export async function updateSubmission(params: UpdateSubmissionParams) {
  const { id, data, userId } = params

  const species = await prisma.species.update({
    where: { id },
    data: {
      ...transformFormData(data),
      updatedById: userId,
    },
  })

  await logActivity({
    action: ActivityAction.SPECIES_UPDATED,
    userId,
    speciesId: species.id,
    details: { updatedFields: Object.keys(data) },
  })

  return species
}

export async function deleteSubmission(id: string) {
  return prisma.species.delete({
    where: { id },
  })
}

export async function submitForReview(speciesId: string, userId: string) {
  const species = await prisma.species.update({
    where: { id: speciesId },
    data: {
      status: SpeciesStatus.IN_REVIEW,
      submittedAt: new Date(),
    },
    include: {
      createdBy: { select: { name: true, email: true } },
    },
  })

  await logActivity({
    action: ActivityAction.SPECIES_SUBMITTED,
    userId,
    speciesId,
  })

  // Notify reviewers
  const reviewers = await prisma.user.findMany({
    where: {
      role: { in: [UserRole.REVIEWER, UserRole.ADMIN] },
      id: { not: userId }, // Don't notify the submitter if they're a reviewer
    },
    select: { email: true },
  })

  if (reviewers.length > 0) {
    await sendSubmissionNotification({
      speciesName: species.scientificName,
      speciesId: species.id,
      creatorName: species.createdBy.name || 'Unknown user',
      reviewerEmails: reviewers.map(r => r.email),
    })
  }

  return species
}

export interface GetSubmissionsParams {
  userId?: string
  status?: SpeciesStatus | SpeciesStatus[]
  page?: number
  limit?: number
  search?: string
  isReviewer?: boolean
}

export async function getSubmissions(params: GetSubmissionsParams = {}) {
  const { userId, status, page = 1, limit = 20, search, isReviewer = false } = params

  const where: Record<string, unknown> = {}

  // Role-based filtering
  if (!isReviewer && userId) {
    where.createdById = userId
  }

  // Status filter
  if (status) {
    where.status = Array.isArray(status) ? { in: status } : status
  }

  // Search filter
  if (search) {
    where.OR = [
      { scientificName: { contains: search, mode: 'insensitive' } },
      { commonNames: { hasSome: [search] } },
    ]
  }

  const [submissions, total] = await Promise.all([
    prisma.species.findMany({
      where,
      include: {
        createdBy: { select: { id: true, name: true, email: true, avatar: true } },
        photos: { where: { primary: true }, take: 1 },
        reviews: {
          include: {
            reviewer: { select: { id: true, name: true } },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.species.count({ where }),
  ])

  return {
    submissions,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export async function getSubmissionById(id: string) {
  return prisma.species.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, name: true, email: true, avatar: true } },
      updatedBy: { select: { id: true, name: true, email: true, avatar: true } },
      photos: true,
      reviews: {
        include: {
          reviewer: { select: { id: true, name: true, email: true, avatar: true } },
        },
        orderBy: { reviewedAt: 'desc' },
      },
    },
  })
}
