'use client'

import { useState } from 'react'
import Image from 'next/image'

interface Photo {
  url: string
  tags?: string[]
}

interface ImageGalleryProps {
  photos: Photo[]
  alt: string
}

export function ImageGallery({ photos, alt }: ImageGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0)

  if (!photos || photos.length === 0) {
    return (
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gradient-to-br from-primary-400 to-syntropy-400 flex items-center justify-center">
        <span className="text-white text-lg">No Image</span>
      </div>
    )
  }

  const selectedPhoto = photos[selectedIndex]

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-gray-100">
        <Image
          src={selectedPhoto.url}
          alt={`${alt} - Photo ${selectedIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
        {/* Tags overlay on main image */}
        {selectedPhoto.tags && selectedPhoto.tags.length > 0 && (
          <div className="absolute bottom-2 left-2 right-2 flex flex-wrap gap-1">
            {selectedPhoto.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-xs font-medium bg-black/60 text-white rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          {photos.map((photo, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              className={`group relative flex-shrink-0 w-16 h-16 rounded-md overflow-hidden transition-all ${
                selectedIndex === index
                  ? 'ring-2 ring-primary-500 ring-offset-2'
                  : 'opacity-70 hover:opacity-100'
              }`}
              title={photo.tags?.join(', ') || ''}
            >
              <Image
                src={photo.url}
                alt={`${alt} - Thumbnail ${index + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
              {/* Tags tooltip on hover */}
              {photo.tags && photo.tags.length > 0 && (
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center p-1">
                  <span className="text-[10px] text-white text-center line-clamp-3">
                    {photo.tags.join(', ')}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
