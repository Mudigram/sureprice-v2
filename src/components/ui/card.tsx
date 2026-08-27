import type { ReactNode } from 'react'

type Props = {
  className?: string
  children: ReactNode
}

/** Flat-by-default surface card. Add shadow utilities only for interactive/elevated use. */
export function Card({ className = '', children }: Props) {
  return (
    <div className={`rounded-3xl border border-slate-200/80 bg-white ${className}`}>{children}</div>
  )
}

export function CardTitle({ className = '', children }: Props) {
  return <h3 className={`text-base font-black tracking-tight text-slate-900 ${className}`}>{children}</h3>
}
