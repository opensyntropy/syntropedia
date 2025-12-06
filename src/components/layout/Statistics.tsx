import { Sprout, Camera, Users } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

interface StatCardProps {
  icon: React.ReactNode
  value: string | number
  label: string
}

function StatCard({ icon, value, label }: StatCardProps) {
  return (
    <Card className="rounded-xl border border-gray-100 shadow-sm">
      <CardContent className="flex flex-col items-center p-8 sm:p-12">
        <div className="mb-4 text-primary-600">{icon}</div>
        <div className="mb-2 text-4xl font-bold text-primary-600 sm:text-5xl">
          {value}
        </div>
        <div className="text-sm font-medium uppercase tracking-wide text-gray-600">
          {label}
        </div>
      </CardContent>
    </Card>
  )
}

export interface StatisticsProps {
  speciesCount?: number
  photosCount?: number
  contributorsCount?: number
}

export function Statistics({
  speciesCount = 0,
  photosCount = 0,
  contributorsCount = 0,
}: StatisticsProps) {
  const formatNumber = (num: number) => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`
    }
    return num.toString()
  }

  return (
    <section className="border-t border-gray-100 bg-gradient-to-b from-gray-50 to-white py-16 sm:py-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="grid gap-6 sm:grid-cols-3">
          <StatCard
            icon={<Sprout className="h-12 w-12" />}
            value={formatNumber(speciesCount)}
            label="Espécies"
          />
          <StatCard
            icon={<Camera className="h-12 w-12" />}
            value={formatNumber(photosCount)}
            label="Fotos"
          />
          <StatCard
            icon={<Users className="h-12 w-12" />}
            value={formatNumber(contributorsCount)}
            label="Contribuidores"
          />
        </div>
      </div>
    </section>
  )
}
