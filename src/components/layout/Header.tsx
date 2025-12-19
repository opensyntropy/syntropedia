'use client'

import Link from 'next/link'
import { Sprout, Menu, X } from 'lucide-react'
import { LanguageSwitcher } from './LanguageSwitcher'
import { UserMenu } from './UserMenu'
import { useState } from 'react'

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

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
            href="/catalogo"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
          >
            Catálogo
          </Link>
          <Link
            href="/sobre"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
          >
            Sobre
          </Link>
          <Link
            href="https://placenta.opensyntropy.earth"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm font-medium text-gray-700 transition-colors hover:text-primary-600"
          >
            Fórum ↗
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
              href="/catalogo"
              className="text-base font-medium text-gray-700 transition-colors hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Catálogo
            </Link>
            <Link
              href="/sobre"
              className="text-base font-medium text-gray-700 transition-colors hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Sobre
            </Link>
            <Link
              href="https://placenta.opensyntropy.earth"
              target="_blank"
              rel="noopener noreferrer"
              className="text-base font-medium text-gray-700 transition-colors hover:text-primary-600"
              onClick={() => setMobileMenuOpen(false)}
            >
              Fórum ↗
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
