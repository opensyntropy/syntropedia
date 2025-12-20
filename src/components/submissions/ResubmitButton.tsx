'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2, RefreshCw } from 'lucide-react'
import { ToastNotification, type ToastType } from '@/components/ui/toast-notification'

interface ResubmitButtonProps {
  speciesId: string
  locale: string
}

export function ResubmitButton({ speciesId, locale }: ResubmitButtonProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const buttonText = locale === 'pt-BR' ? 'Reenviar' : locale === 'es' ? 'Reenviar' : 'Resubmit'
  const successText = locale === 'pt-BR' ? 'Reenviado com sucesso!' : locale === 'es' ? '¡Reenviado con éxito!' : 'Resubmitted successfully!'

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type })
  }

  const handleResubmit = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    setIsSubmitting(true)
    setToast(null)

    try {
      const response = await fetch(`/api/species/submissions/${speciesId}/resubmit`, {
        method: 'POST',
      })

      if (!response.ok) {
        const result = await response.json()
        throw new Error(result.error || 'Failed to resubmit')
      }

      showToast(successText, 'success')
      router.refresh()
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'An error occurred', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      {/* Toast Notification */}
      {toast && (
        <ToastNotification
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

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
    </>
  )
}
