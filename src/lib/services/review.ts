import prisma from '@/lib/prisma'
import { ReviewDecision, SpeciesStatus, ActivityAction, Prisma } from '@prisma/client'
import { logActivity } from './activity'
import { SPECIES_EDITABLE_FIELDS } from '@/lib/validations/species'

export interface SubmitReviewParams {
  speciesId: string
  reviewerId: string
  decision: ReviewDecision
  comments?: string
}

export async function submitReview(params: SubmitReviewParams) {
  const { speciesId, reviewerId, decision, comments } = params

  // Create or update the review
  const review = await prisma.speciesReview.upsert({
    where: {
      speciesId_reviewerId: { speciesId, reviewerId },
    },
    create: {
      speciesId,
      reviewerId,
      decision,
      comments,
    },
    update: {
      decision,
      comments,
      reviewedAt: new Date(),
    },
  })

  // Log the activity
  const actionMap: Record<ReviewDecision, ActivityAction> = {
    APPROVED: ActivityAction.REVIEW_APPROVED,
    REJECTED: ActivityAction.REVIEW_REJECTED,
  }

  await logActivity({
    action: actionMap[decision],
    userId: reviewerId,
    speciesId,
    details: comments ? { comments } : undefined,
  })

  // Handle decision outcomes
  if (decision === ReviewDecision.APPROVED) {
    // Check if we have 2 approvals to auto-publish
    const approvalCount = await prisma.speciesReview.count({
      where: {
        speciesId,
        decision: ReviewDecision.APPROVED,
      },
    })

    if (approvalCount >= 2) {
      await publishSpecies(speciesId, reviewerId)
    }
  } else if (decision === ReviewDecision.REJECTED) {
    // Check if this is a revision request (previously published species)
    const species = await prisma.species.findUnique({
      where: { id: speciesId },
      select: { revisionRequestedById: true },
    })

    if (species?.revisionRequestedById) {
      // Revision request rejected: restore to PUBLISHED, discard draft
      await prisma.species.update({
        where: { id: speciesId },
        data: {
          status: SpeciesStatus.PUBLISHED,
          // Clear draft and revision fields
          draftData: Prisma.DbNull,
          revisionRequestedById: null,
          revisionRequestReason: null,
          revisionRequestedAt: null,
        },
      })
    } else {
      // New submission rejected: set status to REJECTED
      await prisma.species.update({
        where: { id: speciesId },
        data: {
          status: SpeciesStatus.REJECTED,
        },
      })
    }
  }

  return review
}

async function publishSpecies(speciesId: string, publishedById: string) {
  // Get current species to check for draftData
  const species = await prisma.species.findUnique({
    where: { id: speciesId },
    select: { draftData: true, revisionRequestedById: true },
  })

  // Build update data
  const updateData: Record<string, unknown> = {
    status: SpeciesStatus.PUBLISHED,
    updatedById: publishedById,
    publishedAt: new Date(),
    // Clear revision and draft fields
    draftData: Prisma.DbNull,
    revisionRequestedById: null,
    revisionRequestReason: null,
    revisionRequestedAt: null,
  }

  // If there's draftData (from revision review), apply it to regular fields
  // Only apply fields that exist in the current schema to handle schema changes
  if (species?.draftData && typeof species.draftData === 'object') {
    const draftData = species.draftData as Record<string, unknown>
    for (const field of SPECIES_EDITABLE_FIELDS) {
      if (field in draftData) {
        updateData[field] = draftData[field]
      }
    }
  }

  await prisma.species.update({
    where: { id: speciesId },
    data: updateData,
  })

  // Approve all photos for this species
  await prisma.photo.updateMany({
    where: { speciesId },
    data: { approved: true },
  })

  await logActivity({
    action: ActivityAction.SPECIES_PUBLISHED,
    userId: publishedById,
    speciesId,
    details: {
      reason: 'Double review approval reached',
      hadDraftData: !!species?.draftData,
    },
  })
}

export async function getReviewStatus(speciesId: string) {
  const reviews = await prisma.speciesReview.findMany({
    where: { speciesId },
    include: {
      reviewer: { select: { id: true, name: true, email: true, avatar: true } },
    },
    orderBy: { reviewedAt: 'desc' },
  })

  const approvalCount = reviews.filter(r => r.decision === ReviewDecision.APPROVED).length
  const rejectionCount = reviews.filter(r => r.decision === ReviewDecision.REJECTED).length

  return {
    reviews,
    approvalCount,
    rejectionCount,
    isReadyToPublish: approvalCount >= 2,
  }
}

export async function hasUserReviewed(speciesId: string, userId: string): Promise<boolean> {
  const review = await prisma.speciesReview.findUnique({
    where: {
      speciesId_reviewerId: { speciesId, reviewerId: userId },
    },
  })
  return !!review
}

export async function getUserReview(speciesId: string, userId: string) {
  return prisma.speciesReview.findUnique({
    where: {
      speciesId_reviewerId: { speciesId, reviewerId: userId },
    },
  })
}

export async function resubmitRejected(speciesId: string, userId: string) {
  // Verify the species exists and is rejected
  const species = await prisma.species.findUnique({
    where: { id: speciesId },
  })

  if (!species) {
    throw new Error('Species not found')
  }

  if (species.status !== SpeciesStatus.REJECTED) {
    throw new Error('Species is not in REJECTED status')
  }

  if (species.createdById !== userId) {
    throw new Error('Only the species creator can resubmit')
  }

  // Clear old reviews and set status back to IN_REVIEW
  await prisma.$transaction([
    prisma.speciesReview.deleteMany({
      where: { speciesId },
    }),
    prisma.species.update({
      where: { id: speciesId },
      data: {
        status: SpeciesStatus.IN_REVIEW,
        submittedAt: new Date(),
      },
    }),
  ])

  await logActivity({
    action: ActivityAction.SPECIES_RESUBMITTED,
    userId,
    speciesId,
  })

  return true
}
