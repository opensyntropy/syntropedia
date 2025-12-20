import prisma from '@/lib/prisma'
import { ApplicationStatus, UserRole, ActivityAction } from '@prisma/client'
import { logActivity } from './activity'

export interface SubmitApplicationParams {
  userId: string
  motivation: string
  fullAddress: string
  city: string
  state: string
  country: string
  education: string
  yearsExperience: number
  experienceDetails: string
  socialLinkedin?: string
  socialInstagram?: string
  socialTwitter?: string
  socialWebsite?: string
}

export async function submitApplication(params: SubmitApplicationParams) {
  const { userId, ...applicationData } = params

  // Check if user already has a reviewer or admin role
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  })

  if (!user) {
    throw new Error('User not found')
  }

  if (user.role === UserRole.REVIEWER || user.role === UserRole.ADMIN) {
    throw new Error('User is already a reviewer or admin')
  }

  // Check for existing pending application
  const existingApplication = await prisma.reviewerApplication.findFirst({
    where: {
      userId,
      status: ApplicationStatus.PENDING,
    },
  })

  if (existingApplication) {
    throw new Error('User already has a pending application')
  }

  // Create application
  const application = await prisma.reviewerApplication.create({
    data: {
      userId,
      ...applicationData,
    },
  })

  // Log activity
  await logActivity({
    action: ActivityAction.REVIEWER_APPLICATION_SUBMITTED,
    userId,
    details: { applicationId: application.id },
  })

  return application
}

export async function getUserApplication(userId: string) {
  return prisma.reviewerApplication.findFirst({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
}

export interface GetApplicationsParams {
  status?: ApplicationStatus
  page?: number
  limit?: number
}

export async function getApplications(params: GetApplicationsParams = {}) {
  const { status, page = 1, limit = 20 } = params

  const where = status ? { status } : {}

  const [applications, total] = await Promise.all([
    prisma.reviewerApplication.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true, avatar: true } },
        reviewedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    }),
    prisma.reviewerApplication.count({ where }),
  ])

  return {
    applications,
    total,
    page,
    totalPages: Math.ceil(total / limit),
  }
}

export interface ReviewApplicationParams {
  applicationId: string
  adminId: string
  decision: 'APPROVED' | 'REJECTED'
  note?: string
}

export async function reviewApplication(params: ReviewApplicationParams) {
  const { applicationId, adminId, decision, note } = params

  const application = await prisma.reviewerApplication.findUnique({
    where: { id: applicationId },
    include: { user: true },
  })

  if (!application) {
    throw new Error('Application not found')
  }

  if (application.status !== ApplicationStatus.PENDING) {
    throw new Error('Application has already been reviewed')
  }

  // Update application status
  const updatedApplication = await prisma.reviewerApplication.update({
    where: { id: applicationId },
    data: {
      status: decision === 'APPROVED' ? ApplicationStatus.APPROVED : ApplicationStatus.REJECTED,
      reviewedById: adminId,
      reviewedAt: new Date(),
      reviewNote: note,
    },
  })

  // If approved, update user role to REVIEWER
  if (decision === 'APPROVED') {
    await prisma.user.update({
      where: { id: application.userId },
      data: { role: UserRole.REVIEWER },
    })
  }

  // Log activity
  await logActivity({
    action: decision === 'APPROVED'
      ? ActivityAction.REVIEWER_APPLICATION_APPROVED
      : ActivityAction.REVIEWER_APPLICATION_REJECTED,
    userId: adminId,
    details: {
      applicationId,
      applicantId: application.userId,
      applicantName: application.user.name,
    },
  })

  return updatedApplication
}

export async function getReviewers() {
  return prisma.user.findMany({
    where: { role: UserRole.REVIEWER },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { name: 'asc' },
  })
}

export interface RevokeReviewerParams {
  userId: string
  adminId: string
}

export async function revokeReviewer(params: RevokeReviewerParams) {
  const { userId, adminId } = params

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true, name: true },
  })

  if (!user) {
    throw new Error('User not found')
  }

  if (user.role !== UserRole.REVIEWER) {
    throw new Error('User is not a reviewer')
  }

  // Update user role back to USER
  await prisma.user.update({
    where: { id: userId },
    data: { role: UserRole.USER },
  })

  // Log activity
  await logActivity({
    action: ActivityAction.REVIEWER_STATUS_REVOKED,
    userId: adminId,
    details: {
      revokedUserId: userId,
      revokedUserName: user.name,
    },
  })

  return { success: true }
}
