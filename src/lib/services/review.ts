import prisma from '@/lib/prisma'
import { ReviewDecision, SpeciesStatus, ActivityAction } from '@prisma/client'
import { logActivity } from './activity'

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
    // Set status to REJECTED - user can resubmit later
    // Keep reviews for history
    await prisma.species.update({
      where: { id: speciesId },
      data: {
        status: SpeciesStatus.REJECTED,
      },
    })
  }

  return review
}

async function publishSpecies(speciesId: string, publishedById: string) {
  await prisma.species.update({
    where: { id: speciesId },
    data: {
      status: SpeciesStatus.PUBLISHED,
      updatedById: publishedById,
    },
  })

  await logActivity({
    action: ActivityAction.SPECIES_PUBLISHED,
    userId: publishedById,
    speciesId,
    details: { reason: 'Double review approval reached' },
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
