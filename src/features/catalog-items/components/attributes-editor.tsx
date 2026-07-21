'use client'

import { useFieldArray, type Control, type UseFormRegister } from 'react-hook-form'
import type { CreateCatalogItemFormValues } from '../schema'

export function AttributesEditor({
  control,
  register,
}: {
  control: Control<CreateCatalogItemFormValues>
  register: UseFormRegister<CreateCatalogItemFormValues>
}) {
  const { fields, append, remove } = useFieldArray({ control, name: 'attributes' })

  return (
    <div>
      <label className="block text-sm font-medium text-foreground">Attributes</label>
      <p className="text-xs text-muted-foreground">Free-form key/value pairs — e.g. size, color, ingredients.</p>

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
  )
}