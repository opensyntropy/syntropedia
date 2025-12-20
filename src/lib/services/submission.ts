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
      lifeCycleYearsStart: data.lifeCycleYearsStart,
      lifeCycleYearsEnd: data.lifeCycleYearsEnd,
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
      serviceSpecies: data.serviceSpecies || false,
      pruningSprout: data.pruningSprout,
      seedlingShade: data.seedlingShade,
      biomassProduction: data.biomassProduction,
      hasFruit: data.hasFruit || false,
      edibleFruit: data.edibleFruit || false,
      fruitingAgeStart: data.fruitingAgeStart,
      fruitingAgeEnd: data.fruitingAgeEnd,
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

  // Regular users can only edit their own DRAFT submissions
  // No change tracking needed for drafts - they're works in progress
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

export type SubmissionType = 'new' | 'revision'

export interface GetSubmissionsParams {
  userId?: string
  status?: SpeciesStatus | SpeciesStatus[]
  page?: number
  limit?: number
  search?: string
  isReviewer?: boolean
  submissionType?: SubmissionType
}

export async function getSubmissions(params: GetSubmissionsParams = {}) {
  const { userId, status, page = 1, limit = 20, search, isReviewer = false, submissionType } = params

  const where: Record<string, unknown> = {}

  // Role-based filtering
  if (!isReviewer && userId) {
    where.createdById = userId
  }

  // Status filter
  if (status) {
    where.status = Array.isArray(status) ? { in: status } : status
  }

  // Submission type filter (new vs revision request)
  if (submissionType === 'new') {
    // New submissions: never been published
    where.publishedAt = null
  } else if (submissionType === 'revision') {
    // Revision requests: has a revision request
    where.revisionRequestedById = { not: null }
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

  // Add primaryPhoto helper for easier access
  const submissionsWithPrimaryPhoto = submissions.map(submission => ({
    ...submission,
    primaryPhoto: submission.photos[0] || null,
  }))

  return {
    submissions: submissionsWithPrimaryPhoto,
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

export interface GetReviewQueueParams {
  reviewerId: string
  submissionType?: SubmissionType
}

export async function getReviewQueue(params: GetReviewQueueParams | string) {
  // Support both old signature (string) and new signature (object)
  const { reviewerId, submissionType } = typeof params === 'string'
    ? { reviewerId: params, submissionType: undefined }
    : params

  // Build where clause
  const where: Record<string, unknown> = {
    status: SpeciesStatus.IN_REVIEW,
    createdById: { not: reviewerId },
    reviews: {
      none: { reviewerId: reviewerId }
    }
  }

  // Submission type filter (new vs revision request)
  // Default to 'new' if not specified
  const effectiveType = submissionType ?? 'new'
  if (effectiveType === 'new') {
    // New submissions: never been published
    where.publishedAt = null
  } else if (effectiveType === 'revision') {
    // Revision requests: has a revision request
    where.revisionRequestedById = { not: null }
  }

  // Get IN_REVIEW submissions where:
  // - User is NOT the creator (can't self-review)
  // - User has NOT already reviewed
  const submissions = await prisma.species.findMany({
    where,
    include: {
      createdBy: { select: { id: true, name: true, email: true, avatar: true } },
      photos: { where: { primary: true }, take: 1 },
      reviews: {
        include: { reviewer: { select: { id: true, name: true } } }
      },
      revisionRequestedBy: { select: { id: true, name: true } }
    },
    orderBy: { submittedAt: 'asc' } // Oldest first (FIFO queue)
  })

  // Add primaryPhoto helper for easier access
  return submissions.map(submission => ({
    ...submission,
    primaryPhoto: submission.photos[0] || null,
  }))
}

export interface ReviewerEditParams {
  id: string
  data: Partial<SpeciesFormData>
  reviewerId: string
  changeReason: string
}

export async function reviewerEditSubmission(params: ReviewerEditParams) {
  const { id, data, reviewerId, changeReason } = params

  // Get current values for change tracking
  const currentSpecies = await prisma.species.findUnique({
    where: { id },
  })

  if (!currentSpecies) {
    throw new Error('Species not found')
  }

  // Track changes for each modified field
  const changes: Array<{
    field: string
    previousValue: unknown
    newValue: unknown
  }> = []

  const transformedData = transformFormData(data)

  // Compare each field that's being updated
  for (const [key, newValue] of Object.entries(transformedData)) {
    const currentValue = (currentSpecies as Record<string, unknown>)[key]

    // Check if value actually changed
    const valueChanged = JSON.stringify(currentValue) !== JSON.stringify(newValue)
    if (valueChanged) {
      changes.push({
        field: key,
        previousValue: currentValue,
        newValue: newValue,
      })
    }
  }

  // Only update if there are actual changes
  if (changes.length === 0) {
    return currentSpecies
  }

  // Update species and log changes
  const species = await prisma.species.update({
    where: { id },
    data: {
      ...transformedData,
      updatedById: reviewerId,
    },
  })

  // Log each change to ChangeHistory
  await prisma.changeHistory.createMany({
    data: changes.map(change => ({
      speciesId: id,
      changedById: reviewerId,
      changedFields: change.field,
      previousValue: change.previousValue as object,
      newValue: change.newValue as object,
      changeReason,
    })),
  })

  await logActivity({
    action: ActivityAction.SPECIES_UPDATED,
    userId: reviewerId,
    speciesId: species.id,
    details: {
      updatedFields: changes.map(c => c.field),
      reviewerEdit: true
    },
  })

  return species
}

export interface RequestRevisionParams {
  speciesId: string
  userId: string
  reason: string
}

export async function requestRevision(params: RequestRevisionParams) {
  const { speciesId, userId, reason } = params

  // Verify species exists and is published
  const species = await prisma.species.findUnique({
    where: { id: speciesId },
  })

  if (!species) {
    throw new Error('Species not found')
  }

  if (species.status !== SpeciesStatus.PUBLISHED) {
    throw new Error('Only published species can have revision requests')
  }

  // Update species to IN_REVIEW with revision info
  const updated = await prisma.species.update({
    where: { id: speciesId },
    data: {
      status: SpeciesStatus.IN_REVIEW,
      revisionRequestedById: userId,
      revisionRequestReason: reason,
      revisionRequestedAt: new Date(),
    },
  })

  // Log activity
  await logActivity({
    action: ActivityAction.REVISION_REQUESTED,
    userId,
    speciesId,
    details: { reason },
  })

  // Notify reviewers
  const reviewers = await prisma.user.findMany({
    where: {
      role: { in: [UserRole.REVIEWER, UserRole.ADMIN] },
    },
    select: { email: true },
  })

  if (reviewers.length > 0) {
    await sendSubmissionNotification({
      speciesName: species.scientificName,
      speciesId: species.id,
      creatorName: 'User revision request',
      reviewerEmails: reviewers.map(r => r.email),
    })
  }

  return updated
}

export async function getSpeciesBySlug(slug: string) {
  return prisma.species.findUnique({
    where: { slug },
    include: {
      createdBy: { select: { id: true, name: true, email: true, avatar: true } },
      photos: true,
      revisionRequestedBy: { select: { id: true, name: true, email: true, avatar: true } },
    },
  })
}
