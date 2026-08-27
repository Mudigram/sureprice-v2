import type { ReactNode } from 'react'

type Tone = 'lime' | 'emerald' | 'blue' | 'amber' | 'purple' | 'neutral' | 'onDark'

const tones: Record<Tone, string> = {
  lime: 'border-[var(--lime-base)]/30 bg-[var(--lime-base)]/15 text-[var(--lime-dark)]',
  emerald: 'border-emerald-200 bg-emerald-50 text-emerald-800',
  blue: 'border-blue-200 bg-blue-50 text-blue-800',
  amber: 'border-amber-200 bg-amber-50 text-amber-800',
  purple: 'border-purple-200 bg-purple-50 text-purple-800',
  neutral: 'border-slate-200 bg-slate-50 text-slate-700',
  onDark: 'border-emerald-500/30 bg-emerald-500/10 text-[var(--lime-base)]',
}

export function Badge({
  tone = 'neutral',
  className = '',
  children,
}: {
  tone?: Tone
  className?: string
  children: ReactNode
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[10px] font-extrabold uppercase tracking-wider ${tones[tone]} ${className}`}
    >
      {children}
    </span>
  )
}
