'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Textarea } from '@/components/ui/textarea'
import { Check, X, Loader2, ExternalLink, ImageIcon } from 'lucide-react'
import { ToastNotification, type ToastType } from '@/components/ui/toast-notification'

interface Photo {
  id: string
  url: string
  tags: string[]
  uploadedAt: string
  species: {
    id: string
    slug: string
    scientificName: string
    commonNames: string[]
  }
  uploadBy: {
    id: string
    name: string | null
    email: string
    avatar: string | null
  }
}

interface PendingPhotosListProps {
  locale?: string
}

const translations: Record<string, Record<string, string>> = {
  en: {
    title: 'Pending Photos',
    noPhotos: 'No pending photos to review',
    uploadedBy: 'Uploaded by',
    approve: 'Approve',
    reject: 'Reject',
    approved: 'Photo approved',
    rejected: 'Photo rejected',
    error: 'An error occurred',
    viewSpecies: 'View species',
    rejectPhoto: 'Reject Photo',
    rejectReason: 'Reason for rejection (optional)',
    rejectReasonPlaceholder: 'e.g., Low quality, blurry, wrong species...',
    cancel: 'Cancel',
    confirmReject: 'Reject Photo',
  },
  'pt-BR': {
    title: 'Fotos Pendentes',
    noPhotos: 'Nenhuma foto pendente para revisar',
    uploadedBy: 'Enviado por',
    approve: 'Aprovar',
    reject: 'Rejeitar',
    approved: 'Foto aprovada',
    rejected: 'Foto rejeitada',
    error: 'Ocorreu um erro',
    viewSpecies: 'Ver espécie',
    rejectPhoto: 'Rejeitar Foto',
    rejectReason: 'Motivo da rejeição (opcional)',
    rejectReasonPlaceholder: 'ex., Baixa qualidade, desfocada, espécie errada...',
    cancel: 'Cancelar',
    confirmReject: 'Rejeitar Foto',
  },
  es: {
    title: 'Fotos Pendientes',
    noPhotos: 'No hay fotos pendientes para revisar',
    uploadedBy: 'Subido por',
    approve: 'Aprobar',
    reject: 'Rechazar',
    approved: 'Foto aprobada',
    rejected: 'Foto rechazada',
    error: 'Ocurrió un error',
    viewSpecies: 'Ver especie',
    rejectPhoto: 'Rechazar Foto',
    rejectReason: 'Motivo del rechazo (opcional)',
    rejectReasonPlaceholder: 'ej., Baja calidad, borrosa, especie incorrecta...',
    cancel: 'Cancelar',
    confirmReject: 'Rechazar Foto',
  },
}

const tagLabels: Record<string, Record<string, string>> = {
  en: {
    whole: 'Whole',
    leaf: 'Leaf',
    trunk: 'Trunk',
    fruit: 'Fruit',
    seeds: 'Seeds',
    flower: 'Flower',
  },
  'pt-BR': {
    whole: 'Inteira',
    leaf: 'Folha',
    trunk: 'Tronco',
    fruit: 'Fruto',
    seeds: 'Sementes',
    flower: 'Flor',
  },
  es: {
    whole: 'Entera',
    leaf: 'Hoja',
    trunk: 'Tronco',
    fruit: 'Fruto',
    seeds: 'Semillas',
    flower: 'Flor',
  },
}

export function PendingPhotosList({ locale = 'en' }: PendingPhotosListProps) {
  const [photos, setPhotos] = useState<Photo[]>([])
  const [loading, setLoading] = useState(true)
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)
  const [rejectingPhoto, setRejectingPhoto] = useState<Photo | null>(null)
  const [rejectReason, setRejectReason] = useState('')

  const t = translations[locale] || translations.en
  const tags = tagLabels[locale] || tagLabels.en

  useEffect(() => {
    fetchPhotos()
  }, [])

  const fetchPhotos = async () => {
    try {
      const res = await fetch('/api/reviews/photos?status=pending')
      if (res.ok) {
        const data = await res.json()
        setPhotos(data.photos)
      }
    } catch (error) {
      console.error('Failed to fetch photos:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (photoId: string) => {
    setProcessingIds(prev => new Set(prev).add(photoId))
    try {
      const res = await fetch(`/api/reviews/photos/${photoId}/approve`, {
        method: 'POST',
      })
      if (res.ok) {
        setPhotos(prev => prev.filter(p => p.id !== photoId))
        setToast({ message: t.approved, type: 'success' })
      } else {
        throw new Error('Failed to approve')
      }
    } catch (error) {
      setToast({ message: t.error, type: 'error' })
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev)
        next.delete(photoId)
        return next
      })
    }
  }

  const openRejectDialog = (photo: Photo) => {
    setRejectingPhoto(photo)
    setRejectReason('')
  }

  const closeRejectDialog = () => {
    setRejectingPhoto(null)
    setRejectReason('')
  }

  const handleReject = async () => {
    if (!rejectingPhoto) return

    const photoId = rejectingPhoto.id
    setProcessingIds(prev => new Set(prev).add(photoId))
    try {
      const res = await fetch(`/api/reviews/photos/${photoId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason }),
      })
      if (res.ok) {
        setPhotos(prev => prev.filter(p => p.id !== photoId))
        setToast({ message: t.rejected, type: 'success' })
        closeRejectDialog()
      } else {
        throw new Error('Failed to reject')
      }
    } catch (error) {
      setToast({ message: t.error, type: 'error' })
    } finally {
      setProcessingIds(prev => {
        const next = new Set(prev)
        next.delete(photoId)
        return next
      })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    )
  }

  if (photos.length === 0) {
    return (
      <div className="text-center py-12">
        <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">{t.noPhotos}</p>
      </div>
    )
  }

  return (
    <div>
      {toast && (
        <div className="mb-4">
          <ToastNotification
            message={toast.message}
            type={toast.type}
            onClose={() => setToast(null)}
          />
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map(photo => (
          <Card key={photo.id} className="overflow-hidden">
            <div className="relative aspect-square bg-gray-100">
              <Image
                src={photo.url}
                alt={photo.species.scientificName}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              {/* Tags overlay */}
              <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
                {photo.tags.map(tag => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="bg-black/60 text-white text-xs"
                  >
                    {tags[tag] || tag}
                  </Badge>
                ))}
              </div>
            </div>
            <CardContent className="p-4">
              <div className="mb-3">
                <Link
                  href={`/species/${photo.species.slug}`}
                  className="font-medium text-gray-900 hover:text-green-600 flex items-center gap-1"
                >
                  <span className="italic">{photo.species.scientificName}</span>
                  <ExternalLink className="h-3 w-3" />
                </Link>
                <p className="text-sm text-gray-500">
                  {photo.species.commonNames.slice(0, 2).join(', ')}
                </p>
              </div>

              <div className="text-xs text-gray-500 mb-3">
                <p>{t.uploadedBy}: {photo.uploadBy.name || photo.uploadBy.email}</p>
                <p>{new Date(photo.uploadedAt).toLocaleDateString()}</p>
              </div>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-green-300 text-green-700 hover:bg-green-50"
                  onClick={() => handleApprove(photo.id)}
                  disabled={processingIds.has(photo.id)}
                >
                  {processingIds.has(photo.id) ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-1" />
                      {t.approve}
                    </>
                  )}
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 border-red-300 text-red-700 hover:bg-red-50"
                  onClick={() => openRejectDialog(photo)}
                  disabled={processingIds.has(photo.id)}
                >
                  <X className="h-4 w-4 mr-1" />
                  {t.reject}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Rejection Dialog */}
      {rejectingPhoto && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-4 border-b">
              <h3 className="text-lg font-semibold">{t.rejectPhoto}</h3>
            </div>
            <div className="p-4">
              <div className="flex gap-3 mb-4">
                <div className="w-20 h-20 relative rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={rejectingPhoto.url}
                    alt={rejectingPhoto.species.scientificName}
                    fill
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="font-medium italic">{rejectingPhoto.species.scientificName}</p>
                  <p className="text-sm text-gray-500">
                    {t.uploadedBy}: {rejectingPhoto.uploadBy.name || rejectingPhoto.uploadBy.email}
                  </p>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t.rejectReason}
                </label>
                <Textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder={t.rejectReasonPlaceholder}
                  rows={3}
                  className="w-full"
                />
              </div>
            </div>
            <div className="p-4 border-t flex gap-2 justify-end">
              <Button
                variant="outline"
                onClick={closeRejectDialog}
                disabled={processingIds.has(rejectingPhoto.id)}
              >
                {t.cancel}
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={processingIds.has(rejectingPhoto.id)}
              >
                {processingIds.has(rejectingPhoto.id) ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <X className="h-4 w-4 mr-1" />
                )}
                {t.confirmReject}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
