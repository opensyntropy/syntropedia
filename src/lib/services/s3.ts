import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

const s3Client = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

const BUCKET_NAME = process.env.AWS_S3_BUCKET!

export interface GetUploadUrlParams {
  fileName: string
  fileType: string
  folder?: string
}

export async function getUploadUrl(params: GetUploadUrlParams): Promise<{ uploadUrl: string; fileUrl: string; key: string }> {
  const { fileName, fileType, folder = 'species' } = params

  // Generate unique key
  const timestamp = Date.now()
  const randomString = Math.random().toString(36).substring(2, 15)
  const extension = fileName.split('.').pop()
  const key = `${folder}/${timestamp}-${randomString}.${extension}`

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    ContentType: fileType,
  })

  const uploadUrl = await getSignedUrl(s3Client, command, { expiresIn: 3600 })
  const fileUrl = `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`

  return { uploadUrl, fileUrl, key }
}

export async function deleteFile(key: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  })

  await s3Client.send(command)
}

export function getFileKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    // Remove leading slash
    return urlObj.pathname.slice(1)
  } catch {
    return null
  }
}

export const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]

export const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export function validateImageFile(fileType: string, fileSize: number): { valid: boolean; error?: string } {
  if (!ALLOWED_IMAGE_TYPES.includes(fileType)) {
    return { valid: false, error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' }
  }

  if (fileSize > MAX_FILE_SIZE) {
    return { valid: false, error: 'File too large. Maximum size: 10MB' }
  }

  return { valid: true }
}
