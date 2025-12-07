'use client'

import * as React from 'react'
import { X, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface MultiSelectProps {
  options: { value: string; label: string }[]
  value: string[]
  onChange: (value: string[]) => void
  placeholder?: string
}

export function MultiSelect({ options, value, onChange, placeholder }: MultiSelectProps) {
  const [open, setOpen] = React.useState(false)
  const [search, setSearch] = React.useState('')
  const containerRef = React.useRef<HTMLDivElement>(null)

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const filteredOptions = options.filter(option =>
    option.label.toLowerCase().includes(search.toLowerCase())
  )

  const toggleOption = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue]
    onChange(newValue)
  }

  const removeValue = (optionValue: string) => {
    onChange(value.filter(v => v !== optionValue))
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Selected values as badges */}
      {value.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-1">
          {value.map(v => {
            const option = options.find(o => o.value === v)
            return (
              <Badge
                key={v}
                variant="secondary"
                className="rounded-full bg-blue-100 text-blue-700 hover:bg-blue-200"
              >
                {option?.label}
                <button
                  type="button"
                  className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  onClick={(e) => {
                    e.preventDefault()
                    removeValue(v)
                  }}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            )
          })}
        </div>
      )}

      {/* Input field */}
      <Input
        placeholder={placeholder}
        value={search}
        onChange={(e) => {
          setSearch(e.target.value)
          setOpen(true)
        }}
        onFocus={() => setOpen(true)}
        className="w-full"
      />

      {/* Dropdown list */}
      {open && filteredOptions.length > 0 && (
        <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border border-gray-200 bg-white shadow-lg">
          {filteredOptions.map(option => {
            const isSelected = value.includes(option.value)
            return (
              <div
                key={option.value}
                className="flex cursor-pointer items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100"
                onClick={() => toggleOption(option.value)}
              >
                <div
                  className={`flex h-4 w-4 items-center justify-center rounded border ${
                    isSelected
                      ? 'border-blue-600 bg-blue-600'
                      : 'border-gray-300'
                  }`}
                >
                  {isSelected && <Check className="h-3 w-3 text-white" />}
                </div>
                <span>{option.label}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
