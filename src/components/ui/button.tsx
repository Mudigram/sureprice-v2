import Link from 'next/link'
import type { ComponentProps, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'outline' | 'accent-purple'
type Size = 'sm' | 'md' | 'lg'

const base =
  'inline-flex items-center justify-center gap-2 font-black tracking-tight transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--lime-dark)] disabled:pointer-events-none disabled:opacity-50'

const variants: Record<Variant, string> = {
  primary:
    'rounded-2xl bg-[var(--lime-base)] text-black shadow-lg shadow-[var(--lime-base)]/25 hover:bg-[var(--lime-dark)]',
  secondary:
    'rounded-2xl bg-slate-900 text-white shadow-sm hover:bg-slate-800 border border-slate-700',
  outline:
    'rounded-2xl border border-slate-300 bg-white text-slate-900 shadow-sm hover:bg-slate-50 hover:border-slate-400',
  'accent-purple':
    'rounded-2xl border border-purple-200 bg-purple-50 text-purple-900 shadow-sm hover:bg-purple-100',
}

const sizes: Record<Size, string> = {
  sm: 'px-3.5 py-2 text-xs min-h-[38px]',
  md: 'px-5 py-3 text-sm min-h-[44px]',
  lg: 'px-7 py-4 text-sm min-h-[52px]',
}

type CommonProps = {
  variant?: Variant
  size?: Size
  className?: string
  children: ReactNode
}

type ButtonProps = CommonProps & Omit<ComponentProps<'button'>, 'className' | 'children'>
type ButtonLinkProps = CommonProps & Omit<ComponentProps<typeof Link>, 'className' | 'children'>

export function Button({ variant = 'primary', size = 'md', className = '', children, ...rest }: ButtonProps) {
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </button>
  )
}

export function ButtonLink({ variant = 'primary', size = 'md', className = '', children, ...rest }: ButtonLinkProps) {
  return (
    <Link className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...rest}>
      {children}
    </Link>
  )
}
