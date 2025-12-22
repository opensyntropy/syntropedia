'use client'

import { Card, CardContent } from '@/components/ui/card'
import { LevelBadge } from './LevelBadge'
import { XPProgressBar } from './XPProgressBar'
import { BadgeGrid } from './BadgeGrid'
import Image from 'next/image'

interface UserStats {
  speciesContributed: number
  speciesPublished: number
  photosUploaded: number
  reviewsGiven: number
}

interface Gamification {
  xp: number
  level: number
  title: string
  xpProgress: {
    currentLevelXP: number
    nextLevelXP: number
    progress: number
  }
}

interface Badge {
  id: string
  code: string
  name: string
  description: string
  icon: string
  category: string
  earnedAt?: Date
}

interface UserStatsCardProps {
  user: {
    name: string | null
    avatar: string | null
    role: string
  }
  gamification: Gamification
  stats: UserStats
  badges: Badge[]
  compact?: boolean
}

export function UserStatsCard({
  user,
  gamification,
  stats,
  badges,
  compact = false,
}: UserStatsCardProps) {
  if (compact) {
    return (
      <div className="flex items-center gap-3">
        <div className="relative">
          {user.avatar ? (
            <Image
              src={user.avatar}
              alt={user.name || 'User'}
              width={40}
              height={40}
              className="rounded-full"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-medium">
                {user.name?.charAt(0) || '?'}
              </span>
            </div>
          )}
          <div className="absolute -bottom-1 -right-1">
            <LevelBadge level={gamification.level} size="sm" title={gamification.title} />
          </div>
        </div>
        <div>
          <div className="font-medium text-sm">{user.name}</div>
          <div className="text-xs text-muted-foreground">{gamification.title}</div>
        </div>
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-6">
          <div className="relative">
            {user.avatar ? (
              <Image
                src={user.avatar}
                alt={user.name || 'User'}
                width={64}
                height={64}
                className="rounded-full"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-bold text-2xl">
                  {user.name?.charAt(0) || '?'}
                </span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1">
              <LevelBadge level={gamification.level} size="md" title={gamification.title} />
            </div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-lg">{user.name}</h3>
            <p className="text-muted-foreground">{gamification.title}</p>
            <div className="flex items-center gap-2 mt-1">
              {user.role === 'ADMIN' && (
                <span className="text-xs px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full">
                  Admin
                </span>
              )}
              {user.role === 'REVIEWER' && (
                <span className="text-xs px-2 py-0.5 bg-blue-100 text-blue-700 rounded-full">
                  Reviewer
                </span>
              )}
            </div>
          </div>
        </div>

        {/* XP Progress */}
        <div className="mb-6">
          <XPProgressBar
            currentXP={gamification.xp}
            currentLevelXP={gamification.xpProgress.currentLevelXP}
            nextLevelXP={gamification.xpProgress.nextLevelXP}
            progress={gamification.xpProgress.progress}
            level={gamification.level}
          />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{stats.speciesPublished}</div>
            <div className="text-xs text-muted-foreground">Published</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{stats.speciesContributed}</div>
            <div className="text-xs text-muted-foreground">Contributed</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-amber-600">{stats.reviewsGiven}</div>
            <div className="text-xs text-muted-foreground">Reviews</div>
          </div>
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">{stats.photosUploaded}</div>
            <div className="text-xs text-muted-foreground">Photos</div>
          </div>
        </div>

        {/* Badges */}
        {badges.length > 0 && (
          <div>
            <h4 className="font-medium text-sm mb-3">Badges ({badges.length})</h4>
            <BadgeGrid badges={badges} showEarnedDate size="md" maxDisplay={8} />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
