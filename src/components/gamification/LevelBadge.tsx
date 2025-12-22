'use client'

import { cn } from '@/lib/utils'

interface LevelBadgeProps {
  level: number
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
  title?: string
}

const levelColors: Record<number, string> = {
  1: 'from-green-300 to-green-400',
  2: 'from-green-400 to-green-500',
  3: 'from-green-500 to-green-600',
  4: 'from-emerald-400 to-emerald-500',
  5: 'from-emerald-500 to-emerald-600',
  6: 'from-teal-400 to-teal-500',
  7: 'from-teal-500 to-cyan-500',
  8: 'from-cyan-500 to-blue-500',
  9: 'from-blue-500 to-indigo-500',
  10: 'from-indigo-500 to-purple-500',
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
}

export function LevelBadge({ level, size = 'md', showTooltip = true, title }: LevelBadgeProps) {
  const colorClass = levelColors[level] || levelColors[1]
  const sizeClass = sizeClasses[size]

  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-gradient-to-br font-bold text-white shadow-sm',
        colorClass,
        sizeClass
      )}
      title={showTooltip ? `Level ${level}${title ? ` - ${title}` : ''}` : undefined}
    >
      {level}
    </div>
  )
}
