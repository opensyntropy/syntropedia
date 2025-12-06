import Link from 'next/link'
import Image from 'next/image'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export interface SpeciesCardProps {
  slug: string
  nomeCientifico: string
  nomesPopulares: string[]
  estrato: string
  estagioSucessional: string
  imageUrl?: string
}

const estratoColors: Record<string, string> = {
  EMERGENTE: 'bg-green-100 text-green-700 hover:bg-green-200',
  ALTO: 'bg-green-100 text-green-700 hover:bg-green-200',
  MEDIO: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200',
  BAIXO: 'bg-lime-100 text-lime-700 hover:bg-lime-200',
  RASTEIRO: 'bg-teal-100 text-teal-700 hover:bg-teal-200',
}

const estagioColors: Record<string, string> = {
  PIONEIRA: 'bg-blue-100 text-blue-700 hover:bg-blue-200',
  SECUNDARIA_INICIAL: 'bg-indigo-100 text-indigo-700 hover:bg-indigo-200',
  SECUNDARIA_TARDIA: 'bg-purple-100 text-purple-700 hover:bg-purple-200',
  CLIMAX: 'bg-violet-100 text-violet-700 hover:bg-violet-200',
}

const estratoLabels: Record<string, string> = {
  EMERGENTE: 'Emergente',
  ALTO: 'Alto',
  MEDIO: 'Médio',
  BAIXO: 'Baixo',
  RASTEIRO: 'Rasteiro',
}

const estagioLabels: Record<string, string> = {
  PIONEIRA: 'Pioneira',
  SECUNDARIA_INICIAL: 'Secundária Inicial',
  SECUNDARIA_TARDIA: 'Secundária Tardia',
  CLIMAX: 'Clímax',
}

export function SpeciesCard({
  slug,
  nomeCientifico,
  nomesPopulares,
  estrato,
  estagioSucessional,
  imageUrl = '/placeholder-species.jpg',
}: SpeciesCardProps) {
  return (
    <Link href={`/especies/${slug}`}>
      <Card className="group overflow-hidden rounded-lg border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-lifted">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
          <Image
            src={imageUrl}
            alt={nomeCientifico}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>

        {/* Content */}
        <CardContent className="p-5">
          {/* Scientific Name */}
          <h3 className="mb-2 text-lg font-semibold italic text-gray-900">
            {nomeCientifico}
          </h3>

          {/* Common Names */}
          {nomesPopulares.length > 0 && (
            <p className="mb-4 text-sm text-gray-600">
              {nomesPopulares.slice(0, 3).join(', ')}
              {nomesPopulares.length > 3 && '...'}
            </p>
          )}

          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <Badge
              variant="secondary"
              className={`rounded-full text-xs font-medium ${estratoColors[estrato] || 'bg-gray-100 text-gray-700'}`}
            >
              {estratoLabels[estrato] || estrato}
            </Badge>
            <Badge
              variant="secondary"
              className={`rounded-full text-xs font-medium ${estagioColors[estagioSucessional] || 'bg-gray-100 text-gray-700'}`}
            >
              {estagioLabels[estagioSucessional] || estagioSucessional}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
