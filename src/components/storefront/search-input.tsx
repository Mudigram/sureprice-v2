'use client'

import { Search, X } from 'lucide-react'
import { useState, useId } from 'react'

interface SearchInputProps {
  placeholder?: string
  value?: string
  onChange?: (value: string) => void
}

export function SearchInput({ placeholder = 'Search…', value, onChange }: SearchInputProps) {
  const id = useId()
  const [internal, setInternal] = useState('')
  const controlled = value !== undefined
  const current = controlled ? value : internal

  const handleChange = (v: string) => {
    if (!controlled) setInternal(v)
    onChange?.(v)
  }

  return (
    <div className="relative flex items-center">
      <Search
        size={16}
        className="absolute left-3.5 text-[var(--lime-dark)]"
        strokeWidth={2.5}
      />
      <input
        id={id}
        type="search"
        placeholder={placeholder}
        value={current}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full rounded-xl border border-[var(--lime-base)]/40 bg-[var(--lime-base)]/8 py-3 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:border-[var(--lime-base)] focus:outline-none focus:ring-2 focus:ring-[var(--lime-base)]/20"
      />
      {current && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => handleChange('')}
          className="absolute right-3 text-muted-foreground hover:text-foreground"
        >
          <X size={15} />
        </button>
      )}
    </div>
  )
}
