import { Resend } from 'resend'

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@syntropedia.org'
const APP_URL = process.env.NEXTAUTH_URL || 'http://localhost:3000'

// Lazy init to avoid errors when API key is not set
let resendClient: Resend | null = null

function getResendClient(): Resend | null {
  if (!process.env.RESEND_API_KEY) {
    return null
  }
  if (!resendClient) {
    resendClient = new Resend(process.env.RESEND_API_KEY)
  }
  return resendClient
}

export interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
}

export async function sendEmail(params: SendEmailParams) {
  const client = getResendClient()
  if (!client) {
    console.warn('RESEND_API_KEY not configured, skipping email')
    return null
  }

  try {
    const result = await client.emails.send({
      from: FROM_EMAIL,
      to: params.to,
      subject: params.subject,
      html: params.html,
    })
    return result
  } catch (error) {
    console.error('Failed to send email:', error)
    throw error
  }
}

export interface SubmissionNotificationParams {
  speciesName: string
  speciesId: string
  creatorName: string
  reviewerEmails: string[]
}

export async function sendSubmissionNotification(params: SubmissionNotificationParams) {
  const { speciesName, speciesId, creatorName, reviewerEmails } = params

  if (reviewerEmails.length === 0) return null

  const reviewUrl = `${APP_URL}/submissions/${speciesId}/review`

  return sendEmail({
    to: reviewerEmails,
    subject: `New species submission: ${speciesName}`,
    html: `
      <h2>New Species Submission</h2>
      <p><strong>${creatorName}</strong> has submitted a new species for review:</p>
      <p><em>${speciesName}</em></p>
      <p><a href="${reviewUrl}">Click here to review</a></p>
    `,
  })
}

export interface ReviewNotificationParams {
  speciesName: string
  speciesId: string
  decision: 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED'
  reviewerName: string
  creatorEmail: string
  comments?: string
}

export async function sendReviewNotification(params: ReviewNotificationParams) {
  const { speciesName, speciesId, decision, reviewerName, creatorEmail, comments } = params

  const decisionLabels = {
    APPROVED: 'approved',
    REJECTED: 'rejected',
    CHANGES_REQUESTED: 'requested changes on',
  }

  const speciesUrl = `${APP_URL}/submissions/${speciesId}`

  return sendEmail({
    to: creatorEmail,
    subject: `Review update: ${speciesName}`,
    html: `
      <h2>Review Update</h2>
      <p><strong>${reviewerName}</strong> has ${decisionLabels[decision]} your species submission:</p>
      <p><em>${speciesName}</em></p>
      ${comments ? `<p><strong>Comments:</strong> ${comments}</p>` : ''}
      <p><a href="${speciesUrl}">View your submission</a></p>
    `,
  })
}

export interface PublishedNotificationParams {
  speciesName: string
  speciesSlug: string
  creatorEmail: string
}

export async function sendPublishedNotification(params: PublishedNotificationParams) {
  const { speciesName, speciesSlug, creatorEmail } = params

  const speciesUrl = `${APP_URL}/species/${speciesSlug}`

  return sendEmail({
    to: creatorEmail,
    subject: `Your species has been published: ${speciesName}`,
    html: `
      <h2>Species Published!</h2>
      <p>Congratulations! Your species has been approved by two reviewers and is now published:</p>
      <p><em>${speciesName}</em></p>
      <p><a href="${speciesUrl}">View the published species</a></p>
    `,
  })
}
