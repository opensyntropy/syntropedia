'use client'

import { useEffect, useState } from 'react'
import { CheckCircle, XCircle, X, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastType = 'success' | 'error' | 'warning'

interface ToastNotificationProps {
  message: string
  type: ToastType
  onClose: () => void
  duration?: number
}

export function ToastNotification({
  message,
  type,
  onClose,
  duration = 5000,
}: ToastNotificationProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isLeaving, setIsLeaving] = useState(false)

  useEffect(() => {
    // Trigger enter animation
    requestAnimationFrame(() => setIsVisible(true))

    // Auto-dismiss
    const timer = setTimeout(() => {
      handleClose()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration])

  const handleClose = () => {
    setIsLeaving(true)
    setTimeout(onClose, 300) // Wait for exit animation
  }

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <XCircle className="h-5 w-5" />,
    warning: <AlertCircle className="h-5 w-5" />,
  }

  const styles = {
    success: 'bg-green-50 border-green-200 text-green-800',
    error: 'bg-red-50 border-red-200 text-red-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  }

  const iconStyles = {
    success: 'text-green-500',
    error: 'text-red-500',
    warning: 'text-yellow-500',
  }

  return (
    <div
      className={cn(
        'fixed top-4 left-1/2 -translate-x-1/2 z-50 max-w-md w-full mx-4',
        'transform transition-all duration-300 ease-out',
        isVisible && !isLeaving
          ? 'translate-y-0 opacity-100'
          : '-translate-y-4 opacity-0'
      )}
    >
      <div
        className={cn(
          'flex items-start gap-3 p-4 rounded-lg border shadow-lg',
          styles[type]
        )}
      >
        <span className={cn('flex-shrink-0 mt-0.5', iconStyles[type])}>
          {icons[type]}
        </span>
        <p className="flex-1 text-sm font-medium">{message}</p>
        <button
          onClick={handleClose}
          className="flex-shrink-0 p-1 rounded hover:bg-black/5 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
