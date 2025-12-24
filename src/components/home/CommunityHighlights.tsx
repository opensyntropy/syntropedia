import Link from 'next/link'
import Image from 'next/image'
import { LevelBadge } from '@/components/gamification/LevelBadge'

export interface TopContributor {
  id: string
  name: string
  avatar: string | null | undefined
  level: number
  title: string
  publishedCount: number
}

export interface CommunityHighlightsProps {
  contributors: TopContributor[]
  labels: {
    title: string
    description: string
    speciesPublished: string
    viewLeaderboard: string
  }
}

export function CommunityHighlights({ contributors, labels }: CommunityHighlightsProps) {
  if (contributors.length === 0) {
    return null
  }

  const formatSpeciesCount = (count: number) => {
    return labels.speciesPublished.replace('{count}', count.toString())
  }

  return (
    <section className="bg-gradient-to-b from-primary-50/30 to-white py-16 sm:py-20">
      <div className="container mx-auto px-6 lg:px-12">
        <div className="mb-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl">
            {labels.title}
          </h2>
          <p className="mt-2 text-muted-foreground">
            {labels.description}
          </p>
        </div>

        <div className="mx-auto max-w-2xl">
          <div className="grid gap-4 sm:grid-cols-3">
            {contributors.map((contributor) => (
              <Link
                key={contributor.id}
                href={`/contributors/${contributor.id}`}
                className="group flex flex-col items-center rounded-xl bg-white p-6 shadow-sm border border-gray-100 transition-all hover:-translate-y-1 hover:shadow-md"
              >
                <div className="relative mb-3">
                  <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gray-100">
                    {contributor.avatar ? (
                      <Image
                        src={contributor.avatar}
                        alt={contributor.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-2xl font-semibold text-gray-400">
                        {contributor.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                  </div>
                  <div className="absolute -bottom-1 -right-1">
                    <LevelBadge level={contributor.level} size="sm" title={contributor.title} />
                  </div>
                </div>

                <h3 className="font-semibold text-gray-900 group-hover:text-primary-600 transition-colors">
                  {contributor.name}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {contributor.title}
                </p>
                <p className="mt-2 text-sm font-medium text-primary-600">
                  {formatSpeciesCount(contributor.publishedCount)}
                </p>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/leaderboard"
            className="text-primary-600 hover:text-primary-700 font-medium transition-colors"
          >
            {labels.viewLeaderboard}
          </Link>
        </div>
      </div>
    </section>
  )
}
