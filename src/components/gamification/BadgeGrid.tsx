'use client'

import { cn } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'

interface Badge {
  id: string
  code: string
  name: string
  description: string
  icon: string
  category: string
  earnedAt?: Date
}

interface BadgeGridProps {
  badges: Badge[]
  showEarnedDate?: boolean
  size?: 'sm' | 'md' | 'lg'
  maxDisplay?: number
}

const sizeClasses = {
  sm: 'w-10 h-10 text-xl',
  md: 'w-14 h-14 text-2xl',
  lg: 'w-20 h-20 text-4xl',
}

const categoryColors: Record<string, string> = {
  CONTRIBUTOR: 'from-green-100 to-green-200 border-green-300',
  REVIEWER: 'from-blue-100 to-blue-200 border-blue-300',
  COMMUNITY: 'from-purple-100 to-purple-200 border-purple-300',
  SPECIAL: 'from-amber-100 to-amber-200 border-amber-300',
}

export function BadgeGrid({
  badges,
  showEarnedDate = false,
  size = 'md',
  maxDisplay,
}: BadgeGridProps) {
  const displayBadges = maxDisplay ? badges.slice(0, maxDisplay) : badges
  const remainingCount = maxDisplay ? Math.max(0, badges.length - maxDisplay) : 0

  if (badges.length === 0) {
    return (
      <div className="text-center py-4 text-muted-foreground text-sm">
        No badges earned yet
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-2">
      {displayBadges.map((badge) => (
        <div
          key={badge.id}
          className="group relative"
          title={`${badge.name}: ${badge.description}`}
        >
          <div
            className={cn(
              'flex items-center justify-center rounded-full bg-gradient-to-br border-2 shadow-sm transition-transform hover:scale-110 cursor-pointer',
              sizeClasses[size],
              categoryColors[badge.category] || categoryColors.CONTRIBUTOR
            )}
          >
            <span>{badge.icon}</span>
          </div>

          {/* Tooltip */}
          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-10">
            <div className="bg-gray-900 text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap shadow-lg">
              <div className="font-semibold">{badge.name}</div>
              <div className="text-gray-300">{badge.description}</div>
              {showEarnedDate && badge.earnedAt && (
                <div className="text-gray-400 mt-1">
                  Earned {formatDistanceToNow(new Date(badge.earnedAt), { addSuffix: true })}
                </div>
              )}
              {/* Arrow */}
              <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
            </div>
          </div>
        </div>
      ))}

      {remainingCount > 0 && (
        <div
          className={cn(
            'flex items-center justify-center rounded-full bg-gray-100 border-2 border-gray-200 text-gray-500 font-medium',
            sizeClasses[size].replace(/text-\w+/, 'text-sm')
          )}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  )
}
