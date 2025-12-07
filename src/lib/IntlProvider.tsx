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
    if (namespace) {
      return messages[namespace]?.[key] || key
    }
    return messages[key] || key
  }
}

export function useLocale() {
  // This will be set via context or prop drilling
  return 'pt-BR' // Default for now
}
