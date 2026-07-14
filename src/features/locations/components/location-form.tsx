'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { createLocationSchema, type CreateLocationInput } from '../schema'
import { createLocation } from '../actions'

export function LocationForm({ businessId }: { businessId: string }) {
  const [isPending, startTransition] = useTransition()
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateLocationInput>({
    resolver: zodResolver(createLocationSchema),
    defaultValues: { business_id: businessId },
  })

  const onSubmit = (data: CreateLocationInput) => {
    startTransition(() => {
      createLocation(data)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('business_id')} />

      <div>
        <label className="block text-sm font-medium text-foreground">Name</label>
        <input
          {...register('name')}
          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
        />
        {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Address</label>
        <input
          {...register('address_line1')}
          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">City</label>
        <input
          {...register('city')}
          className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
      >
        {isPending ? 'Creating…' : 'Create Location'}
      </button>
    </form>
  )
}