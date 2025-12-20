'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { AlertTriangle, X, Loader2 } from 'lucide-react'

interface RequestRevisionModalProps {
  speciesSlug: string
  speciesName: string
  isOpen: boolean
  onClose: () => void
  locale?: string
}

interface ModalLabels {
  title: string
  description: string
  reasonLabel: string
  reasonPlaceholder: string
  reasonHelp: string
  cancel: string
  submit: string
  submitting: string
  success: string
  errorMinLength: string
}

const labelsByLocale: Record<string, ModalLabels> = {
  en: {
    title: 'Request Revision',
    description: 'Describe what needs to be changed or corrected in this species entry. A reviewer will evaluate your request.',
    reasonLabel: 'Reason for revision',
    reasonPlaceholder: 'Describe the issue or correction needed (e.g., incorrect data, missing information, outdated values)...',
    reasonHelp: 'Minimum 10 characters. Be specific about what needs to be changed.',
    cancel: 'Cancel',
    submit: 'Submit Request',
    submitting: 'Submitting...',
    success: 'Revision request submitted successfully!',
    errorMinLength: 'Reason must be at least 10 characters',
  },
  'pt-BR': {
    title: 'Solicitar Revisão',
    description: 'Descreva o que precisa ser alterado ou corrigido nesta entrada de espécie. Um revisor avaliará sua solicitação.',
    reasonLabel: 'Motivo da revisão',
    reasonPlaceholder: 'Descreva o problema ou correção necessária (ex: dados incorretos, informações faltando, valores desatualizados)...',
    reasonHelp: 'Mínimo de 10 caracteres. Seja específico sobre o que precisa ser alterado.',
    cancel: 'Cancelar',
    submit: 'Enviar Solicitação',
    submitting: 'Enviando...',
    success: 'Solicitação de revisão enviada com sucesso!',
    errorMinLength: 'O motivo deve ter pelo menos 10 caracteres',
  },
  es: {
    title: 'Solicitar Revisión',
    description: 'Describa qué necesita ser cambiado o corregido en esta entrada de especie. Un revisor evaluará su solicitud.',
    reasonLabel: 'Motivo de la revisión',
    reasonPlaceholder: 'Describa el problema o corrección necesaria (ej: datos incorrectos, información faltante, valores desactualizados)...',
    reasonHelp: 'Mínimo 10 caracteres. Sea específico sobre lo que necesita ser cambiado.',
    cancel: 'Cancelar',
    submit: 'Enviar Solicitud',
    submitting: 'Enviando...',
    success: '¡Solicitud de revisión enviada con éxito!',
    errorMinLength: 'El motivo debe tener al menos 10 caracteres',
  },
}

export function RequestRevisionModal({
  speciesSlug,
  speciesName,
  isOpen,
  onClose,
  locale = 'en',
}: RequestRevisionModalProps) {
  const [reason, setReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const labels = labelsByLocale[locale] || labelsByLocale.en

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (reason.trim().length < 10) {
      setError(labels.errorMinLength)
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/species/${speciesSlug}/request-revision`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: reason.trim() }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit request')
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
        // Don't refresh - the species status changed to IN_REVIEW
        // and refreshing would redirect away from the page
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Modal */}
      <Card className="relative z-10 w-full max-w-lg mx-4 shadow-xl">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-full">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <CardTitle>{labels.title}</CardTitle>
              <p className="text-sm text-muted-foreground mt-1 italic">
                {speciesName}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          {success ? (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-green-700 font-medium">{labels.success}</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {labels.description}
              </p>

              {error && (
                <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2">
                  {labels.reasonLabel} <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full min-h-[120px] px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500"
                  placeholder={labels.reasonPlaceholder}
                  required
                  disabled={isSubmitting}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {labels.reasonHelp}
                </p>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isSubmitting}
                >
                  {labels.cancel}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || reason.trim().length < 10}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {labels.submitting}
                    </>
                  ) : (
                    labels.submit
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
