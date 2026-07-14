'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { createBusinessSchema, type CreateBusinessInput } from '../schema'
import { createBusiness } from '../actions'
import { BUSINESS_TYPES } from '../types'

export function BusinessForm({ organizationId }: { organizationId: string }) {
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateBusinessInput>({
    resolver: zodResolver(createBusinessSchema),
    defaultValues: { organization_id: organizationId },
  })

  const onSubmit = (data: CreateBusinessInput) => {
    startTransition(() => {
      createBusiness(data)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('organization_id')} />

      <div>
        <label className="block text-sm font-medium text-foreground">Name</label>
        <input
          {...register('name')}
          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
        />
        {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Slug</label>
        <input
          {...register('slug')}
          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
        />
        {errors.slug && <p className="mt-1 text-sm text-destructive">{errors.slug.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Business Type</label>
        <select
          {...register('business_type')}
          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
        >
          {BUSINESS_TYPES.map((type) => (
            <option key={type} value={type}>
              {type.replace('_', ' ')}
            </option>
          ))}
        </select>
        {errors.business_type && <p className="mt-1 text-sm text-destructive">{errors.business_type.message}</p>}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {isPending ? 'Creating…' : 'Create Business'}
      </button>
    </form>
  )
}