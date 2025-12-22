'use client'

import Link from 'next/link'
import { Sprout, Menu, X } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { UserMenu } from './UserMenu'
import { useState } from 'react'
import { useTranslations } from '@/lib/IntlProvider'
import { useSession } from 'next-auth/react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const t = useTranslations('common')
  const { data: session } = useSession()
  const isReviewer = session?.user?.role === 'REVIEWER' || session?.user?.role === 'ADMIN'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-100 bg-white/80 backdrop-blur-md">
      <div className="container mx-auto flex h-18 items-center justify-between px-6 lg:px-12">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 transition-colors hover:opacity-80">
          <Sprout className="h-6 w-6 text-primary-600" />
          <span className="text-lg font-semibold text-primary-600 sm:text-xl">
            Syntropedia
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-8 md:flex">
          <Link
            href="/catalog"
            className="rounded-full bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white transition-colors hover:bg-primary-700"
          >
            {t('catalog')}
          </Link>
          {session && (
            <Link
              href="/contributions"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
            >
              {t('contributions')}
            </Link>
          )}
          {isReviewer && (
            <Link
              href="/reviews"
              className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
            >
              {t('reviews')}
            </Link>
          )}
          <Link
            href="/leaderboard"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
          >
            {t('leaderboard')}
          </Link>
          <Link
            href="https://placenta.opensyntropy.earth"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
          >
            {t('forum')} ↗
          </Link>
        </nav>

        {/* Desktop User Menu & Language Switcher */}
        <div className="hidden items-center gap-3 md:flex">
          <LanguageSwitcher />
          <UserMenu />
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6 text-gray-700" />
          ) : (
            <Menu className="h-6 w-6 text-gray-700" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-6 py-6">
            <Link
              href="/catalog"
              className="inline-block w-fit rounded-full bg-primary-600 px-4 py-1.5 text-base font-semibold text-white transition-colors hover:bg-primary-700"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('catalog')}
            </Link>
            {session && (
              <Link
                href="/contributions"
                className="text-base font-medium text-gray-700 transition-colors hover:text-primary-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('contributions')}
              </Link>
            )}
            {isReviewer && (
              <Link
                href="/reviews"
                className="text-base font-medium text-gray-700 transition-colors hover:text-primary-600"
                onClick={() => setMobileMenuOpen(false)}
              >
                {t('reviews')}
              </Link>
            )}
            <Link
              href="/leaderboard"
              className="text-base font-medium text-gray-700 transition-colors hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('leaderboard')}
            </Link>
            <Link
              href="https://placenta.opensyntropy.earth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium text-gray-700 transition-colors hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              {t('forum')} ↗
            </Link>
            <div className="mt-4 flex items-center justify-between gap-2">
              <LanguageSwitcher />
              <UserMenu />
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
