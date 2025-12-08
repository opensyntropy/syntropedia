'use client'

import { type SpeciesDetail } from '@/types/species'

interface SpeciesDetailClientProps {
  children: React.ReactNode
}

export function SpeciesDetailClient({ children }: SpeciesDetailClientProps) {
  return <>{children}</>
}
