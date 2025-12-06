'use client'

import { Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'
import { useState } from 'react'

export function Hero() {
  const [searchQuery, setSearchQuery] = useState('')

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      window.location.href = `/catalogo?q=${encodeURIComponent(searchQuery)}`
    }
  }

  return (
    <section className="relative bg-gradient-to-b from-primary-50/30 to-white py-20 sm:py-32">
      <div className="container mx-auto px-6 text-center lg:px-12">
        {/* Title */}
        <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl lg:text-6xl">
          Syntropedia
        </h1>

        {/* Subtitle */}
        <p className="mx-auto mb-12 max-w-2xl text-base text-gray-600 sm:text-lg lg:text-xl">
          Conhecimento colaborativo sobre espécies para agricultura sintrópica e agrofloresta
        </p>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="mx-auto mb-10 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Buscar espécies por nome..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-14 rounded-lg border-2 border-gray-200 pl-14 pr-4 text-base shadow-sm transition-all focus:border-primary-500 focus:ring-4 focus:ring-primary-100"
            />
          </div>
        </form>

        {/* CTA Buttons */}
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
          <Button
            size="lg"
            className="rounded-xl bg-primary-600 px-7 shadow-md transition-all hover:bg-primary-700 hover:shadow-lg"
            asChild
          >
            <Link href="/catalogo">
              Explorar Catálogo →
            </Link>
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="rounded-xl border-2 border-primary-600 text-primary-600 transition-all hover:bg-primary-50"
            asChild
          >
            <Link href="/sobre">
              Contribuir
            </Link>
          </Button>
        </div>
      </div>
    </section>
  )
}
