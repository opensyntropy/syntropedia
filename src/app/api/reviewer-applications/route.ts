import { NextRequest, NextResponse } from 'next/server'
import { withAuth, withAdmin } from '@/lib/auth/api'
import { submitApplication, getApplications } from '@/lib/services/reviewer-application'
import { ApplicationStatus } from '@prisma/client'
import { z } from 'zod'

const submitSchema = z.object({
  motivation: z.string().min(50, 'Motivation must be at least 50 characters'),
  fullAddress: z.string().min(10, 'Please provide your full address'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State/Province is required'),
  country: z.string().min(2, 'Country is required'),
  education: z.string().min(10, 'Please describe your education'),
  yearsExperience: z.number().min(0).max(100),
  experienceDetails: z.string().min(50, 'Please describe your experience in detail'),
  socialLinkedin: z.string().url().optional().or(z.literal('')),
  socialInstagram: z.string().optional(),
  socialTwitter: z.string().optional(),
  socialWebsite: z.string().url().optional().or(z.literal('')),
})

// POST - User submits application
export const POST = withAuth(async (req, { session }) => {
  try {
    const body = await req.json()
    const validatedData = submitSchema.parse(body)

    const application = await submitApplication({
      userId: session.user.id,
      ...validatedData,
      yearsExperience: validatedData.yearsExperience,
      socialLinkedin: validatedData.socialLinkedin || undefined,
      socialInstagram: validatedData.socialInstagram || undefined,
      socialTwitter: validatedData.socialTwitter || undefined,
      socialWebsite: validatedData.socialWebsite || undefined,
    })

    return NextResponse.json(application, { status: 201 })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: 'Invalid request data', details: error.issues }, { status: 400 })
    }
    if (error instanceof Error) {
      if (error.message === 'User is already a reviewer or admin') {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
      if (error.message === 'User already has a pending application') {
        return NextResponse.json({ error: error.message }, { status: 400 })
      }
    }
    throw error
  }
})

// GET - Admin gets list of applications
export const GET = withAdmin(async (req) => {
  const { searchParams } = new URL(req.url)
  const status = searchParams.get('status') as ApplicationStatus | null
  const page = parseInt(searchParams.get('page') || '1')
  const limit = parseInt(searchParams.get('limit') || '20')

  const result = await getApplications({
    status: status || undefined,
    page,
    limit,
  })

  return NextResponse.json(result)
})
