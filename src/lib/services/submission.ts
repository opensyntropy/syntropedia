import prisma from '@/lib/prisma'
import { SpeciesStatus, UserRole, ActivityAction, Prisma } from '@prisma/client'
import { logActivity } from './activity'
import { sendSubmissionNotification } from './email'
import { SPECIES_EDITABLE_FIELDS, type SpeciesFormData } from '@/lib/validations/species'
import { awardXP, checkBadges } from './gamification'

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

  // Award XP for submission
  await awardXP(userId, 'SPECIES_SUBMITTED')
  await checkBadges(userId)

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
  const submission = await prisma.species.findUnique({
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

  return submission
}

// Fields that need special transformations when loading from DB to form
const DECIMAL_FIELDS = ['heightMeters', 'canopyWidthMeters'] as const
const COMMA_SEPARATED_FIELDS = ['originCenter', 'globalBiome'] as const
const BOOLEAN_FIELDS = ['nitrogenFixer', 'serviceSpecies', 'hasFruit', 'edibleFruit'] as const
const REQUIRED_FIELDS = ['scientificName', 'commonNames', 'stratum', 'successionalStage', 'synonyms', 'regionalBiome', 'uses', 'propagationMethods'] as const

// Helper to get form values for editing - merges draftData for revision requests
// Uses SPECIES_EDITABLE_FIELDS to ensure consistency with schema
export function getFormValuesFromSubmission(submission: NonNullable<Awaited<ReturnType<typeof getSubmissionById>>>) {
  const draftData = (submission.draftData as Record<string, unknown>) || {}
  const isRevisionRequest = !!submission.revisionRequestedById
  const submissionRecord = submission as Record<string, unknown>

  // Get raw value: use draft value if exists (for revision requests), otherwise use regular field
  const getRawValue = (field: string): unknown => {
    if (isRevisionRequest && field in draftData) {
      return draftData[field]
    }
    return submissionRecord[field]
  }

  // Build result dynamically from SPECIES_EDITABLE_FIELDS
  const result: Record<string, unknown> = {}

  for (const field of SPECIES_EDITABLE_FIELDS) {
    const rawValue = getRawValue(field)

    // Apply field-specific transformations
    if (DECIMAL_FIELDS.includes(field as typeof DECIMAL_FIELDS[number])) {
      // Decimal fields need Number conversion
      result[field] = rawValue ? Number(rawValue) : undefined
    } else if (COMMA_SEPARATED_FIELDS.includes(field as typeof COMMA_SEPARATED_FIELDS[number])) {
      // Comma-separated string fields need to be split into arrays
      result[field] = rawValue ? String(rawValue).split(', ').filter(Boolean) : undefined
    } else if (BOOLEAN_FIELDS.includes(field as typeof BOOLEAN_FIELDS[number])) {
      // Boolean fields keep their value as-is
      result[field] = rawValue
    } else if (REQUIRED_FIELDS.includes(field as typeof REQUIRED_FIELDS[number])) {
      // Required fields keep their value as-is
      result[field] = rawValue
    } else {
      // Optional fields: convert falsy to undefined
      result[field] = rawValue || undefined
    }
  }

  return result as SpeciesFormData
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

// Normalize value for comparison - treats null, undefined, "" as equivalent
// Also handles Decimal objects and empty arrays
function normalizeForComparison(value: unknown): unknown {
  // Handle Prisma Decimal objects
  if (value !== null && typeof value === 'object' && 'toNumber' in value) {
    return (value as { toNumber: () => number }).toNumber()
  }

  // Treat null, undefined, and empty string as equivalent (null)
  if (value === null || value === undefined || value === '') {
    return null
  }

  // Treat empty arrays as null for optional array fields
  if (Array.isArray(value) && value.length === 0) {
    return null
  }

  // For arrays, normalize each element
  if (Array.isArray(value)) {
    return value.map(normalizeForComparison)
  }

  return value
}

// Compare two values after normalization
function valuesAreEqual(a: unknown, b: unknown): boolean {
  const normalizedA = normalizeForComparison(a)
  const normalizedB = normalizeForComparison(b)
  return JSON.stringify(normalizedA) === JSON.stringify(normalizedB)
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

  const transformedData = transformFormData(data)

  // Check if this is a revision request (published species under review)
  // In this case, edits go to draftData JSON, not to regular fields
  const isRevisionRequest = !!currentSpecies.revisionRequestedById

  if (isRevisionRequest) {
    // For revision requests: store edits in draftData JSON
    // Regular database fields remain unchanged (preserving published data)
    const currentDraft = (currentSpecies.draftData as Record<string, unknown>) || {}

    // Track changes comparing against current draft (or original values if no draft yet)
    const changes: Array<{
      field: string
      previousValue: unknown
      newValue: unknown
    }> = []

    for (const [key, newValue] of Object.entries(transformedData)) {
      // Compare against draft value if exists, otherwise against original published value
      const previousValue = key in currentDraft
        ? currentDraft[key]
        : (currentSpecies as Record<string, unknown>)[key]

      // Use normalized comparison to avoid false positives from null/undefined/empty differences
      if (!valuesAreEqual(previousValue, newValue)) {
        changes.push({
          field: key,
          previousValue,
          newValue,
        })
      }
    }

    if (changes.length === 0) {
      return currentSpecies
    }

    // Merge new edits into draftData
    const updatedDraft = { ...currentDraft, ...transformedData }

    const species = await prisma.species.update({
      where: { id },
      data: {
        draftData: updatedDraft as Prisma.InputJsonValue,
        updatedById: reviewerId,
      },
    })

    // Log each change to ChangeHistory
    // Wrap values in objects to ensure valid JSON (undefined becomes null)
    await prisma.changeHistory.createMany({
      data: changes.map(change => ({
        speciesId: id,
        changedById: reviewerId,
        changedFields: change.field,
        previousValue: { value: change.previousValue ?? null },
        newValue: { value: change.newValue ?? null },
        changeReason,
      })),
    })

    await logActivity({
      action: ActivityAction.SPECIES_UPDATED,
      userId: reviewerId,
      speciesId: species.id,
      details: {
        updatedFields: changes.map(c => c.field),
        reviewerEdit: true,
        isDraft: true,
      },
    })

    return species
  }

  // For new submissions (not revision requests): edit regular fields directly
  const changes: Array<{
    field: string
    previousValue: unknown
    newValue: unknown
  }> = []

  // Compare each field that's being updated
  for (const [key, newValue] of Object.entries(transformedData)) {
    const currentValue = (currentSpecies as Record<string, unknown>)[key]

    // Use normalized comparison to avoid false positives from null/undefined/empty differences
    if (!valuesAreEqual(currentValue, newValue)) {
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
  // Wrap values in objects to ensure valid JSON (undefined becomes null)
  await prisma.changeHistory.createMany({
    data: changes.map(change => ({
      speciesId: id,
      changedById: reviewerId,
      changedFields: change.field,
      previousValue: { value: change.previousValue ?? null },
      newValue: { value: change.newValue ?? null },
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

  // Clear old reviews from previous review cycle and update species to IN_REVIEW
  await prisma.speciesReview.deleteMany({
    where: { speciesId },
  })

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

  // Award XP for reporting an issue
  await awardXP(userId, 'ISSUE_REPORTED')
  await checkBadges(userId)

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
