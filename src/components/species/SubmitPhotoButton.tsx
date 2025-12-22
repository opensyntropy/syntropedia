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
      router.push('/contribute')
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={handleClick}
        className="border-green-300 text-green-700 hover:bg-green-50"
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
