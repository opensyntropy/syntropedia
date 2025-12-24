'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Camera } from 'lucide-react'
import { SubmitPhotoModal } from './SubmitPhotoModal'

interface SubmitPhotoButtonProps {
  speciesSlug: string
  speciesName: string
  locale?: string
  isLoggedIn?: boolean
}

const buttonLabels: Record<string, string> = {
  en: 'Submit Photo',
  'pt-BR': 'Enviar Foto',
  es: 'Enviar Foto',
}

export function SubmitPhotoButton({
  speciesSlug,
  speciesName,
  locale = 'en',
  isLoggedIn = false,
}: SubmitPhotoButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const router = useRouter()

  const handleClick = () => {
    if (isLoggedIn) {
      setIsModalOpen(true)
    } else {
      router.push('/participate')
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        className="border-primary-300 text-primary-700 hover:bg-primary-100 hover:text-primary-800"
      >
        <Camera className="h-4 w-4 mr-2" />
        {buttonLabels[locale] || buttonLabels.en}
      </Button>

      <SubmitPhotoModal
        speciesSlug={speciesSlug}
        speciesName={speciesName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        locale={locale}
      />
    </>
  )
}
