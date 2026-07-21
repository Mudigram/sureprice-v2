'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { createCatalogItemSchema, type CreateCatalogItemFormValues, type CreateCatalogItemInput } from '../schema'
import { createCatalogItem } from '../actions'
import { AttributesEditor } from './attributes-editor'
import type { Category } from '@/features/categories/types'

export function CatalogItemForm({ businessId, categories }: { businessId: string; categories: Category[] }) {
  const [isPending, startTransition] = useTransition()
  const { register, control, handleSubmit, formState: { errors } } = useForm<CreateCatalogItemFormValues>({
    resolver: zodResolver(createCatalogItemSchema),
    defaultValues: { business_id: businessId, attributes: [] },
  })

  const onSubmit = (data: CreateCatalogItemFormValues) => {
    startTransition(() => {
      createCatalogItem(data as CreateCatalogItemInput)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('business_id')} />

      <div>
        <label className="block text-sm font-medium text-foreground">Name</label>
        <input {...register('name')} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground" />
        {errors.name && <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Description</label>
        <textarea {...register('description')} rows={3} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground" />
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Base Price</label>
        <input type="number" step="0.01" {...register('base_price')} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground" />
        {errors.base_price && <p className="mt-1 text-sm text-destructive">{errors.base_price.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-foreground">Category</label>
        <select {...register('category_id')} className="mt-1 w-full rounded-lg border border-input bg-background px-3 py-2 text-foreground">
          <option value="">Uncategorized</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <AttributesEditor control={control} register={register} />

      <button type="submit" disabled={isPending} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">
        {isPending ? 'Creating…' : 'Create Item'}
      </button>
    </form>
  )
}