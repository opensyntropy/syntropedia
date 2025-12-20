'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw } from 'lucide-react'

interface ResubmitButtonProps {
  speciesId: string
  locale: string
}

export function ResubmitButton({ speciesId, locale }: ResubmitButtonProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const buttonText = locale === 'pt-BR' ? 'Reenviar' : locale === 'es' ? 'Reenviar' : 'Resubmit'

  const handleResubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsSubmitting(true)
    setError(null)

    try {
      const response = await fetch(`/api/species/submissions/${speciesId}/resubmit`, {
        method: 'POST',
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to resubmit')
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={handleResubmit}
      disabled={isSubmitting}
    >
      {isSubmitting ? (
        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
      ) : (
        <RefreshCw className="h-4 w-4 mr-1" />
      )}
      {buttonText}
    </Button>
  )
}
