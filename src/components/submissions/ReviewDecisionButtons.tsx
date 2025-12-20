'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, ThumbsUp, ThumbsDown, CheckCircle } from 'lucide-react'

interface ReviewDecisionButtonsProps {
  speciesId: string
  locale: string
  hasAlreadyReviewed: boolean
  previousDecision?: string
  previousComments?: string
}

export function ReviewDecisionButtons({
  speciesId,
  locale,
  hasAlreadyReviewed,
  previousDecision,
  previousComments,
}: ReviewDecisionButtonsProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [reviewComments, setReviewComments] = useState('')
  const [error, setError] = useState<string | null>(null)

  // Translations
  const texts = {
    en: {
      yourDecision: 'Your Decision',
      comments: 'Comments (optional)',
      commentsPlaceholder: 'Add comments about your decision...',
      approve: 'Approve',
      reject: 'Reject',
      alreadyReviewed: 'You have already reviewed this species',
      decision: 'Your decision',
    },
    'pt-BR': {
      yourDecision: 'Sua Decisão',
      comments: 'Comentários (opcional)',
      commentsPlaceholder: 'Adicione comentários sobre sua decisão...',
      approve: 'Aprovar',
      reject: 'Rejeitar',
      alreadyReviewed: 'Você já revisou esta espécie',
      decision: 'Sua decisão',
    },
    es: {
      yourDecision: 'Tu Decisión',
      comments: 'Comentarios (opcional)',
      commentsPlaceholder: 'Agregue comentarios sobre su decisión...',
      approve: 'Aprobar',
      reject: 'Rechazar',
      alreadyReviewed: 'Ya has revisado esta especie',
      decision: 'Tu decisión',
    },
  }
  const t = texts[locale as keyof typeof texts] || texts.en

  const handleSubmitReview = async (decision: 'APPROVED' | 'REJECTED') => {
    if (hasAlreadyReviewed) return

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/species/submissions/${speciesId}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decision,
          comments: reviewComments || undefined,
        }),
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to submit review')
      }

      router.push('/reviews')
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (hasAlreadyReviewed) {
    return (
      <Card>
        <CardContent className="py-6">
          <div className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">{t.alreadyReviewed}</span>
          </div>
          {previousDecision && (
            <p className="text-sm text-muted-foreground mt-2">
              {t.decision}: {previousDecision.replace('_', ' ')}
              {previousComments && ` - "${previousComments}"`}
            </p>
          )}
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t.yourDecision}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}

        <div>
          <label className="block text-sm font-medium mb-2">{t.comments}</label>
          <textarea
            value={reviewComments}
            onChange={(e) => setReviewComments(e.target.value)}
            className="w-full min-h-[100px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder={t.commentsPlaceholder}
          />
        </div>

        <div className="flex gap-4">
          <Button
            onClick={() => handleSubmitReview('APPROVED')}
            disabled={isSubmitting}
            className="flex-1 bg-green-600 hover:bg-green-700"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <ThumbsUp className="h-4 w-4 mr-2" />
            )}
            {t.approve}
          </Button>
          <Button
            onClick={() => handleSubmitReview('REJECTED')}
            disabled={isSubmitting}
            variant="destructive"
            className="flex-1"
          >
            {isSubmitting ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <ThumbsDown className="h-4 w-4 mr-2" />
            )}
            {t.reject}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
