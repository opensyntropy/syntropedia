'use client'

import { cn } from '@/lib/utils'

interface XPProgressBarProps {
  currentXP: number
  currentLevelXP: number
  nextLevelXP: number
  progress: number
  level: number
  showLabels?: boolean
  size?: 'sm' | 'md' | 'lg'
}

const sizeClasses = {
  sm: 'h-1.5',
  md: 'h-2.5',
  lg: 'h-4',
}

export function XPProgressBar({
  currentXP,
  currentLevelXP,
  nextLevelXP,
  progress,
  level,
  showLabels = true,
  size = 'md',
}: XPProgressBarProps) {
  const isMaxLevel = level >= 10
  const xpInLevel = currentXP - currentLevelXP
  const xpNeeded = nextLevelXP - currentLevelXP

  return (
    <div className="w-full">
      {showLabels && (
        <div className="flex justify-between text-xs text-muted-foreground mb-1">
          <span>{currentXP.toLocaleString()} XP</span>
          {isMaxLevel ? (
            <span>Max Level</span>
          ) : (
            <span>
              {xpInLevel.toLocaleString()} / {xpNeeded.toLocaleString()} to Level {level + 1}
            </span>
          )}
        </div>
      )}
      <div className={cn('w-full bg-gray-200 rounded-full overflow-hidden', sizeClasses[size])}>
        <div
          className={cn(
            'h-full bg-gradient-to-r from-green-400 to-green-600 transition-all duration-500 ease-out rounded-full',
            isMaxLevel && 'from-indigo-500 to-purple-500'
          )}
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>
    </div>
  )
}
