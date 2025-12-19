'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle, XCircle, AlertTriangle, Loader2 } from 'lucide-react'

interface ReviewFormProps {
  speciesId: string
  locale?: string
  onReviewSubmitted?: () => void
}

type ReviewDecision = 'APPROVED' | 'REJECTED' | 'CHANGES_REQUESTED'

interface Translations {
  title: string
  commentsLabel: string
  commentsPlaceholder: string
  approve: string
  requestChanges: string
  reject: string
}

const defaultTranslations: Translations = {
  title: 'Submit Review',
  commentsLabel: 'Comments (optional)',
  commentsPlaceholder: 'Add any comments for the submitter...',
  approve: 'Approve',
  requestChanges: 'Request Changes',
  reject: 'Reject',
}

const translationsByLocale: Record<string, Translations> = {
  en: defaultTranslations,
  'pt-BR': {
    title: 'Enviar Revisão',
    commentsLabel: 'Comentários (opcional)',
    commentsPlaceholder: 'Adicione comentários para o autor...',
    approve: 'Aprovar',
    requestChanges: 'Solicitar Alterações',
    reject: 'Rejeitar',
  },
  es: {
    title: 'Enviar Revisión',
    commentsLabel: 'Comentarios (opcional)',
    commentsPlaceholder: 'Agregue comentarios para el autor...',
    approve: 'Aprobar',
    requestChanges: 'Solicitar Cambios',
    reject: 'Rechazar',
  },
}

export function ReviewForm({ speciesId, locale = 'en', onReviewSubmitted }: ReviewFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [comments, setComments] = useState('')
  const [error, setError] = useState<string | null>(null)

  const t = translationsByLocale[locale] || defaultTranslations

  const handleSubmitReview = async (decision: ReviewDecision) => {
    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/species/submissions/${speciesId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ decision, comments: comments || undefined }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit review')
      }

      onReviewSubmitted?.()
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="comments" className="block text-sm font-medium mb-1">
            {t.commentsLabel}
          </label>
          <textarea
            id="comments"
            value={comments}
            onChange={(e) => setComments(e.target.value)}
            className="w-full min-h-[100px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={t.commentsPlaceholder}
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => handleSubmitReview('APPROVED')}
            disabled={isSubmitting}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4 mr-2" />
            )}
            {t.approve}
          </Button>

          <Button
            onClick={() => handleSubmitReview('CHANGES_REQUESTED')}
            disabled={isSubmitting}
            variant="outline"
            className="border-amber-500 text-amber-700 hover:bg-amber-50"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <AlertTriangle className="h-4 w-4 mr-2" />
            )}
            {t.requestChanges}
          </Button>

          <Button
            onClick={() => handleSubmitReview('REJECTED')}
            disabled={isSubmitting}
            variant="destructive"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <XCircle className="h-4 w-4 mr-2" />
            )}
            {t.reject}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
