import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { UserStatsCard } from '@/components/gamification/UserStatsCard'
import { BadgeGrid } from '@/components/gamification/BadgeGrid'
import { getUserGamificationProfile } from '@/lib/services/gamification'
import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'

interface ContributorPageProps {
  params: Promise<{ id: string; locale: string }>
}

export default async function ContributorPage({ params }: ContributorPageProps) {
  const { id } = await params

  const profile = await getUserGamificationProfile(id)

  if (!profile) {
    notFound()
  }

  // Get recent activity for this user
  const recentActivity = await prisma.activityLog.findMany({
    where: { userId: id },
    include: {
      species: { select: { id: true, scientificName: true, slug: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 10,
  })

  // Get user's published species
  const publishedSpecies = await prisma.species.findMany({
    where: {
      createdById: id,
      status: 'PUBLISHED',
    },
    include: {
      photos: {
        where: { primary: true },
        take: 1,
        select: { url: true },
      },
    },
    orderBy: { publishedAt: 'desc' },
    take: 6,
  })

  const activityLabels: Record<string, string> = {
    SPECIES_CREATED: 'Created species',
    SPECIES_UPDATED: 'Updated species',
    SPECIES_SUBMITTED: 'Submitted for review',
    SPECIES_RESUBMITTED: 'Resubmitted for review',
    REVIEW_APPROVED: 'Approved',
    REVIEW_REJECTED: 'Requested changes',
    SPECIES_PUBLISHED: 'Published',
    REVISION_REQUESTED: 'Requested revision',
    REVIEWER_APPLICATION_SUBMITTED: 'Applied to become reviewer',
    REVIEWER_APPLICATION_APPROVED: 'Became a reviewer',
    REVIEWER_APPLICATION_REJECTED: 'Application declined',
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 bg-gray-50">
        <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8 max-w-4xl">
          {/* Profile Card */}
          <UserStatsCard
            user={{
              name: profile.user.name,
              avatar: profile.user.avatar,
              role: profile.user.role,
            }}
            gamification={profile.gamification}
            stats={profile.stats}
            badges={profile.badges.map(b => ({
              ...b,
              earnedAt: b.earnedAt,
            }))}
          />

          {/* All Badges Section */}
          {profile.badges.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">
                All Badges ({profile.badges.length})
              </h2>
              <BadgeGrid
                badges={profile.badges.map(b => ({
                  ...b,
                  earnedAt: b.earnedAt,
                }))}
                showEarnedDate
                size="lg"
              />
            </div>
          )}

          {/* Published Species */}
          {publishedSpecies.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">
                  Published Species ({profile.stats.speciesPublished})
                </h2>
                {profile.stats.speciesPublished > 6 && (
                  <Link
                    href={`/catalog?contributor=${id}`}
                    className="text-sm text-green-600 hover:text-green-700"
                  >
                    View all
                  </Link>
                )}
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {publishedSpecies.map((species) => (
                  <Link
                    key={species.id}
                    href={`/species/${species.slug}`}
                    className="group"
                  >
                    <div className="aspect-[4/3] relative rounded-lg overflow-hidden bg-gray-100">
                      {species.photos[0]?.url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={species.photos[0].url}
                          alt={species.scientificName}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-green-400 to-green-600 text-white text-xs">
                          No Image
                        </div>
                      )}
                    </div>
                    <p className="mt-2 text-sm font-medium text-gray-900 group-hover:text-green-600 truncate">
                      {species.scientificName}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          {recentActivity.length > 0 && (
            <div className="mt-8 bg-white rounded-lg shadow-sm border p-6">
              <h2 className="text-lg font-semibold mb-4">Recent Activity</h2>
              <div className="space-y-3">
                {recentActivity.map((activity) => (
                  <div
                    key={activity.id}
                    className="flex items-center gap-3 text-sm"
                  >
                    <span className="text-muted-foreground w-32 flex-shrink-0">
                      {formatDistanceToNow(activity.createdAt, { addSuffix: true })}
                    </span>
                    <span>
                      {activityLabels[activity.action] || activity.action}
                    </span>
                    {activity.species && (
                      <Link
                        href={`/species/${activity.species.slug}`}
                        className="text-green-600 hover:text-green-700 font-medium truncate"
                      >
                        {activity.species.scientificName}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Member Since */}
          <div className="mt-8 text-center text-sm text-muted-foreground">
            Member since {formatDistanceToNow(profile.user.joinedAt, { addSuffix: true })}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
