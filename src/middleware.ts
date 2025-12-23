import { NextRequest, NextResponse } from 'next/server'
import { locales, type Locale } from './config/locales'

const defaultLocale: Locale = 'pt-BR'
const COOKIE_NAME = 'NEXT_LOCALE'
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365 // 1 year

/**
 * Parse Accept-Language header to get preferred locale
 */
function getPreferredLocale(acceptLanguage: string | null): Locale {
  if (!acceptLanguage) return defaultLocale

  // Parse Accept-Language header (e.g., "pt-BR,pt;q=0.9,en;q=0.8")
  const languages = acceptLanguage.split(',').map(lang => {
    const [code] = lang.trim().split(';')
    return code.toLowerCase()
  })

  for (const lang of languages) {
    // Check exact match first (pt-br, en, es)
    if (lang === 'pt-br') return 'pt-BR'
    if (lang === 'es') return 'es'
    if (lang === 'en') return 'en'

    // Check language prefix (pt -> pt-BR)
    const prefix = lang.split('-')[0]
    if (prefix === 'pt') return 'pt-BR'
    if (prefix === 'es') return 'es'
    if (prefix === 'en') return 'en'
  }

  return defaultLocale
}

export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname

  // Check if pathname already has a locale (for backwards compatibility)
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  // If URL has locale, redirect to clean URL and set cookie
  if (pathnameHasLocale) {
    const segments = pathname.split('/')
    const urlLocale = segments[1] as Locale
    const pathWithoutLocale = '/' + segments.slice(2).join('/') || '/'

    const response = NextResponse.redirect(new URL(pathWithoutLocale, request.url))
    response.cookies.set(COOKIE_NAME, urlLocale, {
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
    })
    return response
  }

  // Get locale from cookie or detect from Accept-Language header
  const cookieLocale = request.cookies.get(COOKIE_NAME)?.value as Locale | undefined
  const locale = cookieLocale && locales.includes(cookieLocale)
    ? cookieLocale
    : getPreferredLocale(request.headers.get('accept-language'))

  // Rewrite the URL internally to include locale (user sees clean URL)
  const url = request.nextUrl.clone()
  url.pathname = `/${locale}${pathname}`

  const response = NextResponse.rewrite(url)

  // Set cookie if not present or different
  if (cookieLocale !== locale) {
    response.cookies.set(COOKIE_NAME, locale, {
      path: '/',
      maxAge: COOKIE_MAX_AGE,
      sameSite: 'lax',
    })
  }

  return response
}

export const config = {
  // Match all pathnames except for
  // - /api (API routes)
  // - /auth (Auth routes - not locale-aware)
  // - /account (Account routes - not locale-aware)
  // - /embed (Embed routes for oEmbed - not locale-aware)
  // - /_next (Next.js internals)
  // - /_static (inside /public)
  // - all root files inside /public (e.g. /favicon.ico)
  matcher: ['/((?!api|auth|account|embed|_next|_static|favicon.ico|.*\\..*).*)'],
}
