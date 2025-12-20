'use client'

import { useState } from 'react'
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
  ChevronDown,
  ChevronRight,
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

  // Track which items are expanded (all collapsed by default)
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggleItem = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else {
        next.add(id)
      }
      return next
    })
  }

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
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {activities.map((activity) => {
            const iconConfig = actionIcons[activity.action] || { icon: Edit, color: 'text-gray-600' }
            const Icon = iconConfig.icon
            const labelKey = actionLabelKey[activity.action]
            const actionLabel = labelKey ? labels[labelKey] : activity.action.replace(/_/g, ' ').toLowerCase()
            const hasDetails = activity.details && (
              (activity.details as { comments?: string }).comments ||
              (activity.details as { reason?: string }).reason
            )
            const isExpanded = expandedItems.has(activity.id)

            return (
              <div key={activity.id} className="border rounded-lg overflow-hidden">
                {/* Collapsible Header */}
                <button
                  type="button"
                  onClick={() => toggleItem(activity.id)}
                  className="w-full flex items-center gap-2 p-3 text-sm bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                  <div className={`flex-shrink-0 ${iconConfig.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="font-medium">
                      {activity.user.name || activity.user.email}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      {actionLabel}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {format(new Date(activity.createdAt), 'PP', { locale: dateLocale })}
                  </span>
                </button>

                {/* Expandable Content */}
                {isExpanded && (
                  <div className="border-t p-3 space-y-2">
                    {/* Full timestamp */}
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(activity.createdAt), 'PPp', { locale: dateLocale })}
                    </p>

                    {showSpeciesLink && activity.species && (
                      <a
                        href={`/submissions/${activity.species.id}`}
                        className="text-sm text-primary hover:underline block"
                      >
                        {activity.species.scientificName}
                      </a>
                    )}

                    {hasDetails && (
                      <p className="text-sm text-muted-foreground bg-slate-50 p-2 rounded-md">
                        &quot;{(activity.details as { comments?: string; reason?: string }).comments ||
                          (activity.details as { comments?: string; reason?: string }).reason}&quot;
                      </p>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
