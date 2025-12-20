'use client'

import { Badge } from '@/components/ui/badge'
import { SpeciesStatus } from '@prisma/client'

interface StatusBadgeProps {
  status: SpeciesStatus
  locale?: string
}

interface StatusLabels {
  DRAFT: string
  IN_REVIEW: string
  PUBLISHED: string
  REJECTED: string
}

const statusLabelsByLocale: Record<string, StatusLabels> = {
  en: { DRAFT: 'Draft', IN_REVIEW: 'In Review', PUBLISHED: 'Published', REJECTED: 'Rejected' },
  'pt-BR': { DRAFT: 'Rascunho', IN_REVIEW: 'Em Revisão', PUBLISHED: 'Publicada', REJECTED: 'Rejeitada' },
  es: { DRAFT: 'Borrador', IN_REVIEW: 'En Revisión', PUBLISHED: 'Publicada', REJECTED: 'Rechazada' },
}

const statusVariant: Record<SpeciesStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  DRAFT: 'secondary',
  IN_REVIEW: 'default',
  PUBLISHED: 'outline',
  REJECTED: 'destructive',
}

export function StatusBadge({ status, locale = 'en' }: StatusBadgeProps) {
  const labels = statusLabelsByLocale[locale] || statusLabelsByLocale.en
  const variant = statusVariant[status]

  return (
    <Badge variant={variant} className={
      status === 'PUBLISHED' ? 'bg-green-100 text-green-800 border-green-300' :
      status === 'IN_REVIEW' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
      status === 'REJECTED' ? 'bg-red-100 text-red-800 border-red-300' :
      'bg-gray-100 text-gray-800 border-gray-300'
    }>
      {labels[status]}
    </Badge>
  )
}
