'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { RequestRevisionModal } from './RequestRevisionModal'

interface RequestRevisionButtonProps {
  speciesSlug: string
  speciesName: string
  locale?: string
  isLoggedIn?: boolean
}

const buttonLabels: Record<string, string> = {
  en: 'Report Issue',
  'pt-BR': 'Reportar Erro',
  es: 'Reportar Error',
}

export function RequestRevisionButton({
  speciesSlug,
  speciesName,
  locale = 'en',
  isLoggedIn = false,
}: RequestRevisionButtonProps) {
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
        className="border-amber-300 text-amber-700 hover:bg-amber-50"
      >
        <AlertTriangle className="h-4 w-4 mr-2" />
        {buttonLabels[locale] || buttonLabels.en}
      </Button>

      <RequestRevisionModal
        speciesSlug={speciesSlug}
        speciesName={speciesName}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        locale={locale}
      />
    </>
  )
}
