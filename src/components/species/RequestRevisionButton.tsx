'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { AlertTriangle } from 'lucide-react'
import { RequestRevisionModal } from './RequestRevisionModal'

interface RequestRevisionButtonProps {
  speciesSlug: string
  speciesName: string
  locale?: string
}

const buttonLabels: Record<string, string> = {
  en: 'Request Revision',
  'pt-BR': 'Solicitar Revisão',
  es: 'Solicitar Revisión',
}

export function RequestRevisionButton({
  speciesSlug,
  speciesName,
  locale = 'en',
}: RequestRevisionButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsModalOpen(true)}
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
