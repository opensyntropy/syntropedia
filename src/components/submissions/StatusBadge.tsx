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
}

const statusLabelsByLocale: Record<string, StatusLabels> = {
  en: { DRAFT: 'Draft', IN_REVIEW: 'In Review', PUBLISHED: 'Published' },
  'pt-BR': { DRAFT: 'Rascunho', IN_REVIEW: 'Em Revisão', PUBLISHED: 'Publicada' },
  es: { DRAFT: 'Borrador', IN_REVIEW: 'En Revisión', PUBLISHED: 'Publicada' },
}

const statusVariant: Record<SpeciesStatus, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  DRAFT: 'secondary',
  IN_REVIEW: 'default',
  PUBLISHED: 'outline',
}

export function StatusBadge({ status, locale = 'en' }: StatusBadgeProps) {
  const labels = statusLabelsByLocale[locale] || statusLabelsByLocale.en
  const variant = statusVariant[status]

  return (
    <Badge variant={variant} className={
      status === 'PUBLISHED' ? 'bg-green-100 text-green-800 border-green-300' :
      status === 'IN_REVIEW' ? 'bg-yellow-100 text-yellow-800 border-yellow-300' :
      'bg-gray-100 text-gray-800 border-gray-300'
    }>
      {labels[status]}
    </Badge>
  )
}
