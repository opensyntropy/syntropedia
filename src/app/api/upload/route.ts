import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth/api'
import { getUploadUrl, validateImageFile } from '@/lib/services/s3'
import { uploadUrlSchema } from '@/lib/validations/species'

// POST /api/upload - Get S3 presigned URL for upload
export const POST = withAuth(async (req) => {
  const body = await req.json()

  // Validate input
  const parsed = uploadUrlSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Validation failed', details: parsed.error.flatten() },
      { status: 400 }
    )
  }

  const { fileName, fileType, folder } = parsed.data

  // Validate file type (check without file size since we don't have it yet)
  const validation = validateImageFile(fileType, 0)
  if (!validation.valid && validation.error?.includes('type')) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  try {
    const result = await getUploadUrl({ fileName, fileType, folder })
    return NextResponse.json(result)
  } catch (error) {
    console.error('Upload URL generation failed:', error)
    return NextResponse.json(
      { error: 'Failed to generate upload URL' },
      { status: 500 }
    )
  }
})
