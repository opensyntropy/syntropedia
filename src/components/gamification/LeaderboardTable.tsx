'use client'

import { LevelBadge } from './LevelBadge'
import Image from 'next/image'
import Link from 'next/link'

interface LeaderboardEntry {
  rank: number
  userId: string
  name?: string | null
  avatar?: string | null
  level: number
  title: string
  value: number
  metric: string
}

interface LeaderboardTableProps {
  entries: LeaderboardEntry[]
  isLoading?: boolean
}

const rankStyles: Record<number, string> = {
  1: 'text-amber-500',
  2: 'text-gray-400',
  3: 'text-amber-700',
}

const rankIcons: Record<number, string> = {
  1: '🥇',
  2: '🥈',
  3: '🥉',
}

export function LeaderboardTable({ entries, isLoading = false }: LeaderboardTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg animate-pulse">
            <div className="w-8 h-8 bg-gray-200 rounded-full" />
            <div className="w-10 h-10 bg-gray-200 rounded-full" />
            <div className="flex-1">
              <div className="h-4 w-32 bg-gray-200 rounded mb-1" />
              <div className="h-3 w-20 bg-gray-200 rounded" />
            </div>
            <div className="h-6 w-16 bg-gray-200 rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No entries yet
      </div>
    )
  }

  return (
    <div className="space-y-2">
      {entries.map((entry) => (
        <Link
          key={entry.userId}
          href={`/contributors/${entry.userId}`}
          className="flex items-center gap-4 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          {/* Rank */}
          <div className={`w-8 text-center font-bold text-lg ${rankStyles[entry.rank] || 'text-gray-600'}`}>
            {rankIcons[entry.rank] || `#${entry.rank}`}
          </div>

          {/* Avatar */}
          <div className="relative">
            {entry.avatar ? (
              <Image
                src={entry.avatar}
                alt={entry.name || 'User'}
                width={40}
                height={40}
                className="rounded-full"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center">
                <span className="text-green-600 font-medium">
                  {entry.name?.charAt(0) || '?'}
                </span>
              </div>
            )}
            <div className="absolute -bottom-1 -right-1">
              <LevelBadge level={entry.level} size="sm" title={entry.title} />
            </div>
          </div>

          {/* Name & Title */}
          <div className="flex-1 min-w-0">
            <div className="font-medium truncate">{entry.name || 'Anonymous'}</div>
            <div className="text-xs text-muted-foreground">{entry.title}</div>
          </div>

          {/* Value */}
          <div className="text-right">
            <div className="font-bold text-green-600">{entry.value.toLocaleString()}</div>
            <div className="text-xs text-muted-foreground">{entry.metric}</div>
          </div>
        </Link>
      ))}
    </div>
  )
}
