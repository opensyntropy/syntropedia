'use client'

import { useSession } from 'next-auth/react'
import { UserRole, SpeciesStatus } from '@prisma/client'

interface SubmissionLike {
  createdById: string
  status?: SpeciesStatus
}

export function usePermissions() {
  const { data: session, status } = useSession()

  const isLoading = status === 'loading'
  const isAuthenticated = !!session?.user
  const userId = session?.user?.id
  const userRole = session?.user?.role as UserRole | undefined

  const isReviewer = userRole === UserRole.REVIEWER || userRole === UserRole.ADMIN
  const isAdmin = userRole === UserRole.ADMIN

  const canViewAllSubmissions = isReviewer
  const canViewActivityLog = isReviewer

  const canViewSubmission = (submission: SubmissionLike): boolean => {
    if (!isAuthenticated) return false
    return isReviewer || submission.createdById === userId
  }

  const canEditSubmission = (submission: SubmissionLike): boolean => {
    if (!isAuthenticated || !userId) return false

    // Creator can edit if DRAFT
    if (submission.createdById === userId && submission.status === SpeciesStatus.DRAFT) {
      return true
    }

    // Reviewers can edit during review
    if (isReviewer && submission.status === SpeciesStatus.IN_REVIEW) {
      return true
    }

    return false
  }

  const canDeleteSubmission = (submission: SubmissionLike): boolean => {
    if (!isAuthenticated || !userId) return false
    return submission.createdById === userId && submission.status === SpeciesStatus.DRAFT
  }

  const canSubmitForReview = (submission: SubmissionLike): boolean => {
    if (!isAuthenticated || !userId) return false
    return submission.createdById === userId && submission.status === SpeciesStatus.DRAFT
  }

  const canReviewSubmission = (submission: SubmissionLike): boolean => {
    if (!isAuthenticated || !userId) return false

    // Cannot review own submission
    if (submission.createdById === userId) {
      return false
    }

    // Must be reviewer or admin and in review status
    return isReviewer && submission.status === SpeciesStatus.IN_REVIEW
  }

  return {
    isLoading,
    isAuthenticated,
    isReviewer,
    isAdmin,
    userId,
    userRole,
    canViewAllSubmissions,
    canViewActivityLog,
    canViewSubmission,
    canEditSubmission,
    canDeleteSubmission,
    canSubmitForReview,
    canReviewSubmission,
  }
}
