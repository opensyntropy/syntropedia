'use client'

import { useState, useEffect } from 'react'
import { type Locale, locales } from '@/config/locales'

const COOKIE_NAME = 'NEXT_LOCALE'
const DEFAULT_LOCALE: Locale = 'pt-BR'

/**
 * Parse cookies from document.cookie string
 */
function getCookie(name: string): string | undefined {
  if (typeof document === 'undefined') return undefined

  const cookies = document.cookie.split(';')
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.trim().split('=')
    if (cookieName === name) {
      return cookieValue
    }
  }
  return undefined
}

/**
 * Hook to get the current locale from cookie
 * Falls back to default locale if cookie is not set or invalid
 */
export function useLocale(): Locale {
  const [locale, setLocale] = useState<Locale>(DEFAULT_LOCALE)

  useEffect(() => {
    const cookieLocale = getCookie(COOKIE_NAME) as Locale | undefined
    if (cookieLocale && locales.includes(cookieLocale)) {
      setLocale(cookieLocale)
    }
  }, [])

  return locale
}

/**
 * Set the locale cookie (client-side)
 */
export function setLocaleCookie(locale: Locale): void {
  if (typeof document === 'undefined') return

  const maxAge = 60 * 60 * 24 * 365 // 1 year
  document.cookie = `${COOKIE_NAME}=${locale}; path=/; max-age=${maxAge}; samesite=lax`
}
