'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Camera, X, Loader2 } from 'lucide-react'
import { ToastNotification, type ToastType } from '@/components/ui/toast-notification'
import { PhotoUpload, type UploadedPhoto, validatePhotoTags } from '@/components/submissions/PhotoUpload'

interface SubmitPhotoModalProps {
  speciesSlug: string
  speciesName: string
  isOpen: boolean
  onClose: () => void
  locale?: string
}

interface ModalLabels {
  title: string
  description: string
  photoHelp: string
  cancel: string
  submit: string
  submitting: string
  success: string
  errorNoPhotos: string
  errorNoTags: string
}

const labelsByLocale: Record<string, ModalLabels> = {
  en: {
    title: 'Submit Photos',
    description: 'Upload photos of this species. Photos will be reviewed before appearing on the species page.',
    photoHelp: 'Maximum 3 photos. Each photo must have at least one plant part tag selected.',
    cancel: 'Cancel',
    submit: 'Submit Photos',
    submitting: 'Submitting...',
    success: 'Photos submitted for review!',
    errorNoPhotos: 'Please upload at least one photo',
    errorNoTags: 'Each photo must have at least one plant part tag',
  },
  'pt-BR': {
    title: 'Enviar Fotos',
    description: 'Envie fotos desta espécie. As fotos serão revisadas antes de aparecer na página da espécie.',
    photoHelp: 'Máximo 3 fotos. Cada foto deve ter pelo menos uma tag de parte da planta selecionada.',
    cancel: 'Cancelar',
    submit: 'Enviar Fotos',
    submitting: 'Enviando...',
    success: 'Fotos enviadas para revisão!',
    errorNoPhotos: 'Por favor, envie pelo menos uma foto',
    errorNoTags: 'Cada foto deve ter pelo menos uma tag de parte da planta',
  },
  es: {
    title: 'Enviar Fotos',
    description: 'Sube fotos de esta especie. Las fotos serán revisadas antes de aparecer en la página de la especie.',
    photoHelp: 'Máximo 3 fotos. Cada foto debe tener al menos una etiqueta de parte de planta seleccionada.',
    cancel: 'Cancelar',
    submit: 'Enviar Fotos',
    submitting: 'Enviando...',
    success: '¡Fotos enviadas para revisión!',
    errorNoPhotos: 'Por favor, sube al menos una foto',
    errorNoTags: 'Cada foto debe tener al menos una etiqueta de parte de planta',
  },
}

export function SubmitPhotoModal({
  speciesSlug,
  speciesName,
  isOpen,
  onClose,
  locale = 'en',
}: SubmitPhotoModalProps) {
  const [photos, setPhotos] = useState<UploadedPhoto[]>([])
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)
  const [success, setSuccess] = useState(false)

  const labels = labelsByLocale[locale] || labelsByLocale.en

  const showToast = (message: string, type: ToastType) => {
    setToast({ message, type })
  }

  const handleClose = () => {
    if (!isSubmitting) {
      setPhotos([])
      setSuccess(false)
      setToast(null)
      onClose()
    }
  }

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setToast(null)

    if (photos.length === 0) {
      showToast(labels.errorNoPhotos, 'error')
      return
    }

    if (!validatePhotoTags(photos)) {
      showToast(labels.errorNoTags, 'error')
      return
    }

    setIsSubmitting(true)

    try {
      const response = await fetch(`/api/species/${speciesSlug}/photos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          photos: photos.map(p => ({
            url: p.url,
            key: p.key,
            tags: p.tags || [],
          })),
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to submit photos')
      }

      setSuccess(true)
      showToast(labels.success, 'success')
      setTimeout(() => {
        handleClose()
      }, 2000)
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'An error occurred', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <Card className="relative z-10 w-full max-w-2xl mx-4 shadow-xl max-h-[90vh] overflow-y-auto">
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-full">
              <Camera className="h-5 w-5 text-green-600" />
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
            onClick={handleClose}
            className="h-8 w-8 p-0"
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent>
          {/* Toast Notification */}
          {toast && (
            <ToastNotification
              message={toast.message}
              type={toast.type}
              onClose={() => setToast(null)}
            />
          )}

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

              <PhotoUpload
                photos={photos}
                onPhotosChange={setPhotos}
                maxPhotos={3}
                locale={locale}
              />

              <p className="text-xs text-muted-foreground">
                {labels.photoHelp}
              </p>

              <div className="flex justify-end gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleClose}
                  disabled={isSubmitting}
                >
                  {labels.cancel}
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || photos.length === 0}
                  className="bg-green-600 hover:bg-green-700"
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
