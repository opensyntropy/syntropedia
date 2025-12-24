'use client'

import { createContext, useContext } from 'react'

type Messages = Record<string, any>

const MessagesContext = createContext<Messages>({})

export function IntlProvider({
  children,
  messages,
  locale
}: {
  children: React.ReactNode
  messages: Messages
  locale: string
}) {
  return (
    <MessagesContext.Provider value={messages}>
      {children}
    </MessagesContext.Provider>
  )
}

export function useMessages() {
  return useContext(MessagesContext)
}

export function useTranslations(namespace?: string) {
  const messages = useMessages()

  return (key: string) => {
    // Support dot notation for nested keys (e.g., 'gamification.published')
    const fullKey = namespace ? `${namespace}.${key}` : key
    const parts = fullKey.split('.')

    let value: any = messages
    for (const part of parts) {
      value = value?.[part]
      if (value === undefined) {
        return fullKey // Return the key if not found
      }
    }

    return value || fullKey
  }
}

export function useLocale() {
  // This will be set via context or prop drilling
  return 'pt-BR' // Default for now
}
