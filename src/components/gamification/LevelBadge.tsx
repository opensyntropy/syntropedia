'use client'

import { cn } from '@/lib/utils'

interface LevelBadgeProps {
  level: number
  size?: 'sm' | 'md' | 'lg'
  showTooltip?: boolean
  title?: string
}

const levelColors: Record<number, string> = {
  1: 'from-primary-300 to-primary-400',
  2: 'from-primary-400 to-primary-500',
  3: 'from-primary-500 to-primary-600',
  4: 'from-primary-500 to-syntropy-400',
  5: 'from-primary-400 to-syntropy-400',
  6: 'from-syntropy-300 to-syntropy-400',
  7: 'from-syntropy-400 to-syntropy-500',
  8: 'from-syntropy-500 to-syntropy-600',
  9: 'from-syntropy-600 to-syntropy-700',
  10: 'from-syntropy-700 to-syntropy-800',
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
