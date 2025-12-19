'use client'

import { format } from 'date-fns'
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
  approved: string
  rejected: string
  changesRequested: string
  published: string
}

const labelsByLocale: Record<string, ActivityLabels> = {
  en: {
    title: 'Activity Log',
    noActivity: 'No activity yet.',
    created: 'Created',
    updated: 'Updated',
    submitted: 'Submitted for review',
    approved: 'Approved',
    rejected: 'Rejected',
    changesRequested: 'Requested changes',
    published: 'Published',
  },
  'pt-BR': {
    title: 'Histórico de Atividades',
    noActivity: 'Sem atividade ainda.',
    created: 'Criou',
    updated: 'Atualizou',
    submitted: 'Submeteu para revisão',
    approved: 'Aprovou',
    rejected: 'Rejeitou',
    changesRequested: 'Solicitou mudanças',
    published: 'Publicou',
  },
  es: {
    title: 'Historial de Actividades',
    noActivity: 'Sin actividad aún.',
    created: 'Creó',
    updated: 'Actualizó',
    submitted: 'Envió para revisión',
    approved: 'Aprobó',
    rejected: 'Rechazó',
    changesRequested: 'Solicitó cambios',
    published: 'Publicó',
  },
}

const actionIcons: Record<ActivityAction, { icon: typeof PlusCircle; color: string }> = {
  SPECIES_CREATED: { icon: PlusCircle, color: 'text-blue-600' },
  SPECIES_UPDATED: { icon: Edit, color: 'text-gray-600' },
  SPECIES_SUBMITTED: { icon: Send, color: 'text-purple-600' },
  REVIEW_APPROVED: { icon: CheckCircle, color: 'text-green-600' },
  REVIEW_REJECTED: { icon: XCircle, color: 'text-red-600' },
  REVIEW_CHANGES_REQUESTED: { icon: AlertTriangle, color: 'text-amber-600' },
  SPECIES_PUBLISHED: { icon: Globe, color: 'text-green-700' },
}

const actionLabelKey: Record<ActivityAction, keyof ActivityLabels> = {
  SPECIES_CREATED: 'created',
  SPECIES_UPDATED: 'updated',
  SPECIES_SUBMITTED: 'submitted',
  REVIEW_APPROVED: 'approved',
  REVIEW_REJECTED: 'rejected',
  REVIEW_CHANGES_REQUESTED: 'changesRequested',
  SPECIES_PUBLISHED: 'published',
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
        <div className="space-y-4">
          {activities.map((activity) => {
            const iconConfig = actionIcons[activity.action]
            const Icon = iconConfig.icon
            const labelKey = actionLabelKey[activity.action]
            const actionLabel = labels[labelKey]

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
                  {activity.details && (activity.details as { comments?: string }).comments && (
                    <p className="text-sm text-muted-foreground mt-1">
                      &quot;{(activity.details as { comments: string }).comments}&quot;
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
