import { getServerSession } from 'next-auth'
import { authOptions } from './config'
import { UserRole, SpeciesStatus } from '@prisma/client'
import type { Session } from 'next-auth'

export async function getSession() {
  return await getServerSession(authOptions)
}

export async function requireAuth() {
  const session = await getSession()
  if (!session?.user) {
    throw new Error('UNAUTHORIZED')
  }
  return session
}

export async function requireRole(roles: UserRole[]) {
  const session = await requireAuth()
  if (!roles.includes(session.user.role as UserRole)) {
    throw new Error('FORBIDDEN')
  }
  return session
}

export async function requireReviewer() {
  return requireRole([UserRole.REVIEWER, UserRole.ADMIN])
}

export async function requireAdmin() {
  return requireRole([UserRole.ADMIN])
}

interface SubmissionLike {
  createdById: string
  status?: SpeciesStatus
}

export function canViewSubmission(
  session: Session,
  submission: SubmissionLike
): boolean {
  const role = session.user.role as UserRole
  return (
    role === UserRole.ADMIN ||
    role === UserRole.REVIEWER ||
    submission.createdById === session.user.id
  )
}

export function canEditSubmission(
  session: Session,
  submission: SubmissionLike
): boolean {
  const role = session.user.role as UserRole

  // Creator can edit if DRAFT
  if (submission.createdById === session.user.id && submission.status === SpeciesStatus.DRAFT) {
    return true
  }

  // Reviewers can edit during review
  if (
    (role === UserRole.REVIEWER || role === UserRole.ADMIN) &&
    submission.status === SpeciesStatus.IN_REVIEW
  ) {
    return true
  }

  return false
}

export function canDeleteSubmission(
  session: Session,
  submission: SubmissionLike
): boolean {
  // Only creator can delete, and only if DRAFT
  return (
    submission.createdById === session.user.id &&
    submission.status === SpeciesStatus.DRAFT
  )
}

export function canSubmitForReview(
  session: Session,
  submission: SubmissionLike
): boolean {
  // Only creator can submit for review, and only if DRAFT
  return (
    submission.createdById === session.user.id &&
    submission.status === SpeciesStatus.DRAFT
  )
}

export function canReview(
  session: Session,
  submission: SubmissionLike
): boolean {
  const role = session.user.role as UserRole

  // Cannot review own submission
  if (submission.createdById === session.user.id) {
    return false
  }

  // Must be reviewer or admin
  if (role !== UserRole.REVIEWER && role !== UserRole.ADMIN) {
    return false
  }

  // Must be in review
  return submission.status === SpeciesStatus.IN_REVIEW
}

export function canViewActivityLog(session: Session): boolean {
  const role = session.user.role as UserRole
  return role === UserRole.REVIEWER || role === UserRole.ADMIN
}

export function isReviewer(session: Session): boolean {
  const role = session.user.role as UserRole
  return role === UserRole.REVIEWER || role === UserRole.ADMIN
}

export function isAdmin(session: Session): boolean {
  return session.user.role === UserRole.ADMIN
}
