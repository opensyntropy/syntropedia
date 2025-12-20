'use client'

import { CheckCircle, Circle } from 'lucide-react'

interface ReviewProgressProps {
  approvalCount: number
  rejectionCount?: number
  requiredApprovals?: number
  locale?: string
}

interface ProgressTranslations {
  approvals: string
  readyToPublish: string
}

const translationsByLocale: Record<string, ProgressTranslations> = {
  en: { approvals: 'approvals', readyToPublish: 'Ready to publish' },
  'pt-BR': { approvals: 'aprovações', readyToPublish: 'Pronto para publicar' },
  es: { approvals: 'aprobaciones', readyToPublish: 'Listo para publicar' },
}

export function ReviewProgress({
  approvalCount,
  rejectionCount = 0,
  requiredApprovals = 2,
  locale = 'en',
}: ReviewProgressProps) {
  const isComplete = approvalCount >= requiredApprovals
  const t = translationsByLocale[locale] || translationsByLocale.en

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1">
        {Array.from({ length: requiredApprovals }).map((_, i) => {
          const isApproved = i < approvalCount
          return isApproved ? (
            <CheckCircle key={i} className="h-5 w-5 text-green-600" />
          ) : (
            <Circle key={i} className="h-5 w-5 text-gray-300" />
          )
        })}
      </div>
      <span className="text-sm text-muted-foreground">
        {approvalCount}/{requiredApprovals} {t.approvals}
      </span>
      {isComplete && (
        <span className="text-sm text-green-600 font-medium">
          {t.readyToPublish}
        </span>
      )}
    </div>
  )
}
