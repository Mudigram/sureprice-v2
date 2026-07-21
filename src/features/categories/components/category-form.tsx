'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { createCategorySchema, type CreateCategoryInput } from '../schema'
import { createCategory } from '../actions'

export function CategoryForm({ businessId }: { businessId: string }) {
  const [isPending, startTransition] = useTransition()
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateCategoryInput>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: { business_id: businessId, name: '' },
  })

  const onSubmit = (data: CreateCategoryInput) => {
    startTransition(async () => {
      await createCategory(data)
      reset({ business_id: businessId, name: '' })
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex items-end gap-2">
      <input type="hidden" {...register('business_id')} />
      <div className="flex-1">
        <input
          {...register('name')}
          placeholder="New category name"
          className="w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground"
        />
        {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
      </div>
      <button type="submit" disabled={isPending} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">
        {isPending ? 'Adding…' : 'Add'}
      </button>
    </form>
  )
}