'use client'

import { format, type Locale } from 'date-fns'
import { ptBR, es } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ActivityAction } from '@prisma/client'
import {
  PlusCircle,
  Edit,
  Send,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Globe,
} from 'lucide-react'

interface ActivityEntry {
  id: string
  action: ActivityAction
  details: Record<string, unknown> | null
  user: { id: string; name: string | null; email: string }
  species?: { id: string; scientificName: string; slug: string } | null
  createdAt: string
}

interface ActivityLogProps {
  activities: ActivityEntry[]
  showSpeciesLink?: boolean
  title?: string
  locale?: string
}

interface ActivityLabels {
  title: string
  noActivity: string
  created: string
  updated: string
  submitted: string
  resubmitted: string
  approved: string
  rejected: string
  published: string
  revisionRequested: string
}

const labelsByLocale: Record<string, ActivityLabels> = {
  en: {
    title: 'Activity Log',
    noActivity: 'No activity yet.',
    created: 'Created',
    updated: 'Updated',
    submitted: 'Submitted for review',
    resubmitted: 'Resubmitted for review',
    approved: 'Approved',
    rejected: 'Rejected',
    published: 'Published',
    revisionRequested: 'Requested revision',
  },
  'pt-BR': {
    title: 'Histórico de Atividades',
    noActivity: 'Sem atividade ainda.',
    created: 'Criou',
    updated: 'Atualizou',
    submitted: 'Submeteu para revisão',
    resubmitted: 'Reenviou para revisão',
    approved: 'Aprovou',
    rejected: 'Rejeitou',
    published: 'Publicou',
    revisionRequested: 'Solicitou revisão',
  },
  es: {
    title: 'Historial de Actividades',
    noActivity: 'Sin actividad aún.',
    created: 'Creó',
    updated: 'Actualizó',
    submitted: 'Envió para revisión',
    resubmitted: 'Reenvió para revisión',
    approved: 'Aprobó',
    rejected: 'Rechazó',
    published: 'Publicó',
    revisionRequested: 'Solicitó revisión',
  },
}

const actionIcons: Partial<Record<ActivityAction, { icon: typeof PlusCircle; color: string }>> = {
  SPECIES_CREATED: { icon: PlusCircle, color: 'text-blue-600' },
  SPECIES_UPDATED: { icon: Edit, color: 'text-gray-600' },
  SPECIES_SUBMITTED: { icon: Send, color: 'text-purple-600' },
  SPECIES_RESUBMITTED: { icon: Send, color: 'text-purple-600' },
  REVIEW_APPROVED: { icon: CheckCircle, color: 'text-green-600' },
  REVIEW_REJECTED: { icon: XCircle, color: 'text-red-600' },
  SPECIES_PUBLISHED: { icon: Globe, color: 'text-green-700' },
  REVISION_REQUESTED: { icon: AlertTriangle, color: 'text-amber-600' },
}

const actionLabelKey: Partial<Record<ActivityAction, keyof ActivityLabels>> = {
  SPECIES_CREATED: 'created',
  SPECIES_UPDATED: 'updated',
  SPECIES_SUBMITTED: 'submitted',
  SPECIES_RESUBMITTED: 'resubmitted',
  REVIEW_APPROVED: 'approved',
  REVIEW_REJECTED: 'rejected',
  SPECIES_PUBLISHED: 'published',
  REVISION_REQUESTED: 'revisionRequested',
}

const dateLocales: Record<string, Locale> = {
  'pt-BR': ptBR,
  es: es,
}

export function ActivityLog({ activities, showSpeciesLink = false, title, locale = 'en' }: ActivityLogProps) {
  const labels = labelsByLocale[locale] || labelsByLocale.en
  const displayTitle = title || labels.title
  const dateLocale = dateLocales[locale]

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{displayTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">{labels.noActivity}</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{displayTitle}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
          {activities.map((activity) => {
            const iconConfig = actionIcons[activity.action] || { icon: Edit, color: 'text-gray-600' }
            const Icon = iconConfig.icon
            const labelKey = actionLabelKey[activity.action]
            const actionLabel = labelKey ? labels[labelKey] : activity.action.replace(/_/g, ' ').toLowerCase()

            return (
              <div key={activity.id} className="flex items-start gap-3">
                <div className={`mt-0.5 ${iconConfig.color}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm">
                      {activity.user.name || activity.user.email}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {actionLabel}
                    </span>
                    {showSpeciesLink && activity.species && (
                      <a
                        href={`/submissions/${activity.species.id}`}
                        className="text-sm text-primary hover:underline truncate"
                      >
                        {activity.species.scientificName}
                      </a>
                    )}
                  </div>
                  {activity.details && (
                    (activity.details as { comments?: string }).comments ||
                    (activity.details as { reason?: string }).reason
                  ) && (
                    <p className="text-sm text-muted-foreground mt-1">
                      &quot;{(activity.details as { comments?: string; reason?: string }).comments ||
                        (activity.details as { comments?: string; reason?: string }).reason}&quot;
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {format(new Date(activity.createdAt), 'PPp', { locale: dateLocale })}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
