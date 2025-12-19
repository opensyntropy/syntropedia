'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'

export interface UploadedPhoto {
  id?: string
  url: string
  key: string
  caption?: string
  primary?: boolean
}

interface PhotoUploadProps {
  photos: UploadedPhoto[]
  onPhotosChange: (photos: UploadedPhoto[]) => void
  speciesId?: string
  maxPhotos?: number
  locale?: string
}

interface Translations {
  title: string
  dragDrop: string
  orClick: string
  maxSize: string
  uploading: string
  setPrimary: string
  primary: string
  remove: string
  maxPhotosReached: string
}

const translationsByLocale: Record<string, Translations> = {
  en: {
    title: 'Photos',
    dragDrop: 'Drag & drop photos here',
    orClick: 'or click to select',
    maxSize: 'Max 10MB per image. JPEG, PNG, WebP, GIF.',
    uploading: 'Uploading...',
    setPrimary: 'Set as primary',
    primary: 'Primary',
    remove: 'Remove',
    maxPhotosReached: 'Maximum photos reached',
  },
  'pt-BR': {
    title: 'Fotos',
    dragDrop: 'Arraste e solte fotos aqui',
    orClick: 'ou clique para selecionar',
    maxSize: 'Máx 10MB por imagem. JPEG, PNG, WebP, GIF.',
    uploading: 'Enviando...',
    setPrimary: 'Definir como principal',
    primary: 'Principal',
    remove: 'Remover',
    maxPhotosReached: 'Número máximo de fotos atingido',
  },
  es: {
    title: 'Fotos',
    dragDrop: 'Arrastra y suelta fotos aquí',
    orClick: 'o haz clic para seleccionar',
    maxSize: 'Máx 10MB por imagen. JPEG, PNG, WebP, GIF.',
    uploading: 'Subiendo...',
    setPrimary: 'Establecer como principal',
    primary: 'Principal',
    remove: 'Eliminar',
    maxPhotosReached: 'Número máximo de fotos alcanzado',
  },
}

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
const MAX_SIZE = 10 * 1024 * 1024 // 10MB

export function PhotoUpload({
  photos,
  onPhotosChange,
  speciesId,
  maxPhotos = 5,
  locale = 'en',
}: PhotoUploadProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({})
  const [error, setError] = useState<string | null>(null)

  const t = translationsByLocale[locale] || translationsByLocale.en

  const uploadFile = async (file: File): Promise<UploadedPhoto | null> => {
    try {
      // Get presigned URL
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName: file.name,
          fileType: file.type,
          folder: speciesId ? `species/${speciesId}` : 'species/temp',
        }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to get upload URL')
      }

      const { uploadUrl, fileUrl, key } = await response.json()

      // Upload to S3
      const uploadResponse = await fetch(uploadUrl, {
        method: 'PUT',
        body: file,
        headers: {
          'Content-Type': file.type,
        },
      })

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file')
      }

      return {
        url: fileUrl,
        key,
        primary: photos.length === 0, // First photo is primary by default
      }
    } catch (err) {
      console.error('Upload error:', err)
      throw err
    }
  }

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (photos.length >= maxPhotos) {
        setError(t.maxPhotosReached)
        return
      }

      const filesToUpload = acceptedFiles.slice(0, maxPhotos - photos.length)
      setUploading(true)
      setError(null)

      const newPhotos: UploadedPhoto[] = []

      for (const file of filesToUpload) {
        try {
          const photo = await uploadFile(file)
          if (photo) {
            newPhotos.push(photo)
          }
        } catch (err) {
          setError(err instanceof Error ? err.message : 'Upload failed')
        }
      }

      if (newPhotos.length > 0) {
        onPhotosChange([...photos, ...newPhotos])
      }

      setUploading(false)
    },
    [photos, maxPhotos, onPhotosChange, t.maxPhotosReached]
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp', '.gif'],
    },
    maxSize: MAX_SIZE,
    disabled: uploading || photos.length >= maxPhotos,
  })

  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index)
    // If we removed the primary photo, make the first one primary
    if (photos[index].primary && newPhotos.length > 0) {
      newPhotos[0] = { ...newPhotos[0], primary: true }
    }
    onPhotosChange(newPhotos)
  }

  const setPrimary = (index: number) => {
    const newPhotos = photos.map((photo, i) => ({
      ...photo,
      primary: i === index,
    }))
    onPhotosChange(newPhotos)
  }

  return (
    <Card>
      <CardContent className="pt-6 space-y-4">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <ImageIcon className="h-5 w-5" />
          {t.title}
        </h3>

        {/* Dropzone */}
        <div
          {...getRootProps()}
          className={`
            border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary/50'}
            ${uploading || photos.length >= maxPhotos ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          <input {...getInputProps()} />
          {uploading ? (
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <p className="text-sm text-muted-foreground">{t.uploading}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <p className="font-medium">{t.dragDrop}</p>
              <p className="text-sm text-muted-foreground">{t.orClick}</p>
              <p className="text-xs text-muted-foreground">{t.maxSize}</p>
            </div>
          )}
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}

        {/* Photo Grid */}
        {photos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            {photos.map((photo, index) => (
              <div key={photo.key} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                  <img
                    src={photo.url}
                    alt={`Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Primary Badge */}
                {photo.primary && (
                  <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded">
                    {t.primary}
                  </span>
                )}

                {/* Actions Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex flex-col items-center justify-center gap-2">
                  {!photo.primary && (
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => setPrimary(index)}
                    >
                      {t.setPrimary}
                    </Button>
                  )}
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    onClick={() => removePhoto(index)}
                  >
                    <X className="h-4 w-4 mr-1" />
                    {t.remove}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

        <p className="text-xs text-muted-foreground">
          {photos.length}/{maxPhotos} photos
        </p>
      </CardContent>
    </Card>
  )
}
