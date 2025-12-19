'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Upload, X, Loader2, Image as ImageIcon } from 'lucide-react'
import { PHOTO_FRAGMENT_TAGS, type PhotoFragmentTag } from '@/lib/validations/species'

export interface UploadedPhoto {
  id?: string
  url: string
  key: string
  caption?: string
  primary?: boolean
  tags?: string[]
}

// Validation helper - checks if all photos have at least one tag
export function validatePhotoTags(photos: UploadedPhoto[]): boolean {
  if (photos.length === 0) return true
  return photos.every(photo => photo.tags && photo.tags.length > 0)
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
  plantParts: string
  plantPartsRequired: string
  tags: Record<PhotoFragmentTag, string>
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
    plantParts: 'Plant parts',
    plantPartsRequired: 'Select at least one plant part',
    tags: {
      whole: 'Whole',
      leaf: 'Leaf',
      trunk: 'Trunk',
      fruit: 'Fruit',
      seeds: 'Seeds',
      flower: 'Flower',
    },
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
    plantParts: 'Partes da planta',
    plantPartsRequired: 'Selecione ao menos uma parte da planta',
    tags: {
      whole: 'Inteira',
      leaf: 'Folha',
      trunk: 'Tronco',
      fruit: 'Fruto',
      seeds: 'Sementes',
      flower: 'Flor',
    },
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
    plantParts: 'Partes de la planta',
    plantPartsRequired: 'Seleccione al menos una parte de la planta',
    tags: {
      whole: 'Entera',
      leaf: 'Hoja',
      trunk: 'Tronco',
      fruit: 'Fruto',
      seeds: 'Semillas',
      flower: 'Flor',
    },
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

  const toggleTag = (index: number, tag: PhotoFragmentTag) => {
    const newPhotos = photos.map((photo, i) => {
      if (i !== index) return photo
      const currentTags = photo.tags || []
      const hasTag = currentTags.includes(tag)
      return {
        ...photo,
        tags: hasTag
          ? currentTags.filter(t => t !== tag)
          : [...currentTags, tag],
      }
    })
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {photos.map((photo, index) => (
              <div key={photo.key} className="border rounded-lg p-3 space-y-3">
                {/* Photo with overlay */}
                <div className="relative group">
                  <div className="aspect-video rounded-lg overflow-hidden bg-gray-100">
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

                {/* Tag Selection */}
                <div className="space-y-1.5">
                  <p className="text-xs text-muted-foreground">
                    {t.plantParts} <span className="text-red-500">*</span>
                  </p>
                  <div className={`flex flex-wrap gap-1.5 p-2 rounded-md ${
                    (!photo.tags || photo.tags.length === 0) ? 'bg-red-50 border border-red-200' : ''
                  }`}>
                    {PHOTO_FRAGMENT_TAGS.map(tag => {
                      const isSelected = (photo.tags || []).includes(tag)
                      return (
                        <Badge
                          key={tag}
                          variant={isSelected ? 'default' : 'outline'}
                          className={`cursor-pointer text-xs ${
                            isSelected
                              ? 'bg-primary hover:bg-primary/80'
                              : 'hover:bg-gray-100'
                          }`}
                          onClick={() => toggleTag(index, tag)}
                        >
                          {t.tags[tag]}
                        </Badge>
                      )
                    })}
                  </div>
                  {(!photo.tags || photo.tags.length === 0) && (
                    <p className="text-xs text-red-500">{t.plantPartsRequired}</p>
                  )}
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
