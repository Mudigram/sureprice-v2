'use client'

import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { updateCatalogItemSchema, type UpdateCatalogItemFormValues, type UpdateCatalogItemInput } from '../schema'
import { updateCatalogItem } from '../actions'
import type { Category } from '@/features/categories/types'
import type { CatalogItem } from '../types'

function attributesToArray(attrs: CatalogItem['attributes']): { key: string; value: string }[] {
  if (attrs && typeof attrs === 'object' && !Array.isArray(attrs)) {
    return Object.entries(attrs as Record<string, string>).map(([key, value]) => ({
      key,
      value: String(value),
    }))
  }
  return []
}

export function CatalogItemEditForm({ item, categories }: { item: CatalogItem; categories: Category[] }) {
  const [isPending, startTransition] = useTransition()
  const { register, control, handleSubmit, formState: { errors } } = useForm<UpdateCatalogItemFormValues>({
    resolver: zodResolver(updateCatalogItemSchema),
    defaultValues: {
      category_id: item.category_id,
      name: item.name,
      description: item.description ?? '',
      base_price: item.base_price ?? undefined,
      attributes: attributesToArray(item.attributes),
    },
  })

  const { fields, append, remove } = useFieldArray({ control, name: 'attributes' })

  const onSubmit = (data: UpdateCatalogItemFormValues) => {
    startTransition(() => {
      updateCatalogItem(item.id, item.business_id, data as UpdateCatalogItemInput)
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      <div>
        <label className="block text-sm font-medium text-foreground">Attributes</label>
        <div className="mt-2 space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex gap-2">
              <input
                {...register(`attributes.${index}.key` as const)}
                placeholder="Key"
                className="w-1/3 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
              />
              <input
                {...register(`attributes.${index}.value` as const)}
                placeholder="Value"
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm text-foreground"
              />
              <button type="button" onClick={() => remove(index)} className="text-muted-foreground hover:text-destructive">
                ✕
              </button>
            </div>
          ))}
        </div>
        <button type="button" onClick={() => append({ key: '', value: '' })} className="mt-2 text-sm text-primary underline">
          + Add attribute
        </button>
      </div>

      <button type="submit" disabled={isPending} className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50">
        {isPending ? 'Saving…' : 'Save Changes'}
      </button>
    </form>
  )
}
