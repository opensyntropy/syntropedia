'use client'

import { useState } from 'react'
import { format, type Locale } from 'date-fns'
import { ptBR, es } from 'date-fns/locale'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { History, ArrowRight, User, ChevronDown, ChevronRight } from 'lucide-react'

interface ChangeEntry {
  id: string
  changedFields: string
  previousValue: unknown
  newValue: unknown
  changeReason: string | null
  changedBy: { id: string; name: string | null; email: string; avatar: string | null }
  changedAt: string | Date
}

interface ChangeHistoryProps {
  changes: ChangeEntry[]
  locale?: string
}

interface ChangeHistoryLabels {
  title: string
  noChanges: string
  field: string
  from: string
  to: string
  reason: string
  changedBy: string
  fieldsChanged: string
}

const labelsByLocale: Record<string, ChangeHistoryLabels> = {
  en: {
    title: 'Change History',
    noChanges: 'No changes recorded.',
    field: 'Field',
    from: 'From',
    to: 'To',
    reason: 'Reason',
    changedBy: 'Changed by',
    fieldsChanged: 'fields changed',
  },
  'pt-BR': {
    title: 'Histórico de Alterações',
    noChanges: 'Nenhuma alteração registrada.',
    field: 'Campo',
    from: 'De',
    to: 'Para',
    reason: 'Motivo',
    changedBy: 'Alterado por',
    fieldsChanged: 'campos alterados',
  },
  es: {
    title: 'Historial de Cambios',
    noChanges: 'Sin cambios registrados.',
    field: 'Campo',
    from: 'De',
    to: 'A',
    reason: 'Motivo',
    changedBy: 'Cambiado por',
    fieldsChanged: 'campos cambiados',
  },
}

// Field name translations
const fieldNamesByLocale: Record<string, Record<string, string>> = {
  en: {
    scientificName: 'Scientific Name',
    commonNames: 'Common Names',
    genus: 'Genus',
    species: 'Species',
    author: 'Author',
    botanicalFamily: 'Botanical Family',
    variety: 'Variety',
    stratum: 'Stratum',
    successionalStage: 'Successional Stage',
    lifeCycle: 'Life Cycle',
    lifeCycleYearsStart: 'Life Cycle Start (years)',
    lifeCycleYearsEnd: 'Life Cycle End (years)',
    heightMeters: 'Height (m)',
    canopyWidthMeters: 'Canopy Width (m)',
    canopyShape: 'Canopy Shape',
    originCenter: 'Origin Center',
    globalBiome: 'Global Biome',
    regionalBiome: 'Regional Biome',
    foliageType: 'Foliage Type',
    growthRate: 'Growth Rate',
    rootSystem: 'Root System',
    nitrogenFixer: 'Nitrogen Fixer',
    serviceSpecies: 'Service Species',
    pruningSprout: 'Pruning Sprout',
    seedlingShade: 'Seedling Shade',
    biomassProduction: 'Biomass Production',
    hasFruit: 'Has Fruit',
    edibleFruit: 'Edible Fruit',
    fruitingAgeStart: 'Fruiting Age Start',
    fruitingAgeEnd: 'Fruiting Age End',
    uses: 'Uses',
    propagationMethods: 'Propagation Methods',
    observations: 'Observations',
    photos_added: 'Photos Added',
    photos_removed: 'Photos Removed',
    photo_updated: 'Photo Updated',
  },
  'pt-BR': {
    scientificName: 'Nome Científico',
    commonNames: 'Nomes Populares',
    genus: 'Gênero',
    species: 'Espécie',
    author: 'Autor',
    botanicalFamily: 'Família Botânica',
    variety: 'Variedade',
    stratum: 'Estrato',
    successionalStage: 'Estágio Sucessional',
    lifeCycle: 'Ciclo de Vida',
    lifeCycleYearsStart: 'Ciclo Início (anos)',
    lifeCycleYearsEnd: 'Ciclo Fim (anos)',
    heightMeters: 'Altura (m)',
    canopyWidthMeters: 'Largura da Copa (m)',
    canopyShape: 'Forma da Copa',
    originCenter: 'Centro de Origem',
    globalBiome: 'Bioma Global',
    regionalBiome: 'Bioma Regional',
    foliageType: 'Tipo de Folhagem',
    growthRate: 'Taxa de Crescimento',
    rootSystem: 'Sistema Radicular',
    nitrogenFixer: 'Fixa Nitrogênio',
    serviceSpecies: 'Espécie de Serviço',
    pruningSprout: 'Rebrota após Poda',
    seedlingShade: 'Sombra (Muda)',
    biomassProduction: 'Produção de Biomassa',
    hasFruit: 'Tem Fruto',
    edibleFruit: 'Fruto Comestível',
    fruitingAgeStart: 'Frutificação Início',
    fruitingAgeEnd: 'Frutificação Fim',
    uses: 'Usos',
    propagationMethods: 'Métodos de Propagação',
    observations: 'Observações',
    photos_added: 'Fotos Adicionadas',
    photos_removed: 'Fotos Removidas',
    photo_updated: 'Foto Atualizada',
  },
  es: {
    scientificName: 'Nombre Científico',
    commonNames: 'Nombres Comunes',
    genus: 'Género',
    species: 'Especie',
    author: 'Autor',
    botanicalFamily: 'Familia Botánica',
    variety: 'Variedad',
    stratum: 'Estrato',
    successionalStage: 'Etapa Sucesional',
    lifeCycle: 'Ciclo de Vida',
    lifeCycleYearsStart: 'Ciclo Inicio (años)',
    lifeCycleYearsEnd: 'Ciclo Fin (años)',
    heightMeters: 'Altura (m)',
    canopyWidthMeters: 'Ancho de Copa (m)',
    canopyShape: 'Forma de Copa',
    originCenter: 'Centro de Origen',
    globalBiome: 'Bioma Global',
    regionalBiome: 'Bioma Regional',
    foliageType: 'Tipo de Follaje',
    growthRate: 'Tasa de Crecimiento',
    rootSystem: 'Sistema Radicular',
    nitrogenFixer: 'Fija Nitrógeno',
    serviceSpecies: 'Especie de Servicio',
    pruningSprout: 'Rebrote tras Poda',
    seedlingShade: 'Sombra (Plántula)',
    biomassProduction: 'Producción de Biomasa',
    hasFruit: 'Tiene Fruto',
    edibleFruit: 'Fruto Comestible',
    fruitingAgeStart: 'Fructificación Inicio',
    fruitingAgeEnd: 'Fructificación Fin',
    uses: 'Usos',
    propagationMethods: 'Métodos de Propagación',
    observations: 'Observaciones',
    photos_added: 'Fotos Añadidas',
    photos_removed: 'Fotos Eliminadas',
    photo_updated: 'Foto Actualizada',
  },
}

const dateLocales: Record<string, Locale> = {
  'pt-BR': ptBR,
  es: es,
}

function formatValue(value: unknown, field?: string, locale?: string): string {
  // Handle wrapped values from the new format { value: actualValue }
  if (value !== null && typeof value === 'object' && 'value' in value) {
    return formatValue((value as { value: unknown }).value, field, locale)
  }

  if (value === null || value === undefined) {
    return '-'
  }

  // Handle photo-related fields with friendly messages
  if (field?.startsWith('photos_') || field === 'photo_updated') {
    if (Array.isArray(value)) {
      const count = value.length
      const photoLabel = locale === 'pt-BR' ? (count === 1 ? 'foto' : 'fotos')
        : locale === 'es' ? (count === 1 ? 'foto' : 'fotos')
        : (count === 1 ? 'photo' : 'photos')
      return `${count} ${photoLabel}`
    }
    // Single photo update - show what changed
    if (typeof value === 'object' && value !== null) {
      const photo = value as { url?: string; caption?: string; primary?: boolean; tags?: string[] }
      const parts: string[] = []
      if (photo.caption) parts.push(`"${photo.caption}"`)
      if (photo.primary) parts.push(locale === 'pt-BR' ? 'principal' : locale === 'es' ? 'principal' : 'primary')
      if (photo.tags?.length) parts.push(`tags: ${photo.tags.join(', ')}`)
      return parts.length > 0 ? parts.join(', ') : (locale === 'pt-BR' ? '(sem detalhes)' : locale === 'es' ? '(sin detalles)' : '(no details)')
    }
  }

  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No'
  }
  if (Array.isArray(value)) {
    return value.length > 0 ? value.join(', ') : '-'
  }
  if (typeof value === 'object') {
    return JSON.stringify(value)
  }
  return String(value)
}

export function ChangeHistory({ changes, locale = 'en' }: ChangeHistoryProps) {
  const labels = labelsByLocale[locale] || labelsByLocale.en
  const fieldNames = fieldNamesByLocale[locale] || fieldNamesByLocale.en
  const dateLocale = dateLocales[locale]

  // Track which groups are expanded (all collapsed by default)
  const [expandedGroups, setExpandedGroups] = useState<Set<number>>(new Set())

  const toggleGroup = (index: number) => {
    setExpandedGroups(prev => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  if (changes.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            {labels.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">{labels.noChanges}</p>
        </CardContent>
      </Card>
    )
  }

  // Group changes by timestamp and user (changes made at the same time)
  const groupedChanges: Array<{
    changedBy: ChangeEntry['changedBy']
    changedAt: Date
    changeReason: string | null
    fields: Array<{ field: string; from: unknown; to: unknown }>
  }> = []

  changes.forEach((change) => {
    const changedAt = new Date(change.changedAt)
    const existingGroup = groupedChanges.find(
      (g) =>
        g.changedBy.id === change.changedBy.id &&
        Math.abs(g.changedAt.getTime() - changedAt.getTime()) < 1000 // Within 1 second
    )

    if (existingGroup) {
      existingGroup.fields.push({
        field: change.changedFields,
        from: change.previousValue,
        to: change.newValue,
      })
    } else {
      groupedChanges.push({
        changedBy: change.changedBy,
        changedAt,
        changeReason: change.changeReason,
        fields: [
          {
            field: change.changedFields,
            from: change.previousValue,
            to: change.newValue,
          },
        ],
      })
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          {labels.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {groupedChanges.map((group, groupIndex) => {
            const isExpanded = expandedGroups.has(groupIndex)

            return (
              <div key={groupIndex} className="border rounded-lg overflow-hidden">
                {/* Collapsible Header */}
                <button
                  type="button"
                  onClick={() => toggleGroup(groupIndex)}
                  className="w-full flex items-center gap-2 p-3 text-sm bg-slate-50 hover:bg-slate-100 transition-colors text-left"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                  )}
                  {group.changedBy.avatar ? (
                    <img
                      src={group.changedBy.avatar}
                      alt={group.changedBy.name || ''}
                      className="w-6 h-6 rounded-full flex-shrink-0"
                    />
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                      <User className="h-3 w-3 text-amber-600" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="font-medium">
                      {group.changedBy.name || group.changedBy.email}
                    </span>
                    <span className="text-muted-foreground ml-2">
                      ({group.fields.length} {labels.fieldsChanged})
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0">
                    {format(group.changedAt, 'PP', { locale: dateLocale })}
                  </span>
                </button>

                {/* Expandable Content */}
                {isExpanded && (
                  <div className="border-t border-l-2 border-l-amber-400 p-3 space-y-3">
                    {/* Full timestamp */}
                    <p className="text-xs text-muted-foreground">
                      {format(group.changedAt, 'PPp', { locale: dateLocale })}
                    </p>

                    {/* Reason */}
                    {group.changeReason && (
                      <div className="bg-amber-50 border border-amber-200 rounded-md p-2">
                        <p className="text-sm">
                          <span className="font-medium text-amber-800">{labels.reason}:</span>{' '}
                          <span className="text-amber-700">{group.changeReason}</span>
                        </p>
                      </div>
                    )}

                    {/* Field changes */}
                    <div className="space-y-2">
                      {group.fields.map((field, fieldIndex) => (
                        <div
                          key={fieldIndex}
                          className="bg-slate-50 rounded-md p-3 text-sm"
                        >
                          <div className="font-medium text-slate-700 mb-2">
                            {fieldNames[field.field] || field.field}
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                              {formatValue(field.from, field.field, locale)}
                            </Badge>
                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                              {formatValue(field.to, field.field, locale)}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
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
