import * as React from "react"
import { Check } from "lucide-react"

interface CheckboxProps {
  checked?: boolean
  onCheckedChange?: (checked: boolean) => void
  className?: string
}

export function Checkbox({ checked = false, onCheckedChange, className = "" }: CheckboxProps) {
  const handleClick = () => {
    onCheckedChange?.(!checked)
  }

  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      onClick={handleClick}
      className={`h-4 w-4 shrink-0 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${
        checked ? 'bg-green-600 border-green-600 text-white' : 'bg-white'
      } ${className}`}
    >
      {checked && <Check className="h-3 w-3" />}
    </button>
  )
}
