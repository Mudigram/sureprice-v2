'use client'

import { useState, useTransition } from 'react'
import { updateCategory, setCategoryStatus, moveCategorySortOrder } from '../actions'
import type { Category } from '../types'

export function CategoryRow({
  category,
  businessId,
  isFirst,
  isLast,
}: {
  category: Category
  businessId: string
  isFirst: boolean
  isLast: boolean
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(category.name)
  const [isPending, startTransition] = useTransition()
  const isArchived = category.status === 'archived'

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-card px-4 py-2">
      {isEditing ? (
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="rounded border border-input bg-background px-2 py-1 text-sm text-foreground"
          autoFocus
        />
      ) : (
        <span className={isArchived ? 'text-muted-foreground line-through' : 'text-card-foreground'}>
          {category.name}
        </span>
      )}

      <div className="flex items-center gap-2 text-sm">
        {!isArchived && (
          <>
            <button
              disabled={isFirst || isPending}
              onClick={() => startTransition(() => moveCategorySortOrder(businessId, category.id, 'up'))}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              ↑
            </button>
            <button
              disabled={isLast || isPending}
              onClick={() => startTransition(() => moveCategorySortOrder(businessId, category.id, 'down'))}
              className="text-muted-foreground hover:text-foreground disabled:opacity-30"
            >
              ↓
            </button>
          </>
        )}

        {isEditing ? (
          <button
            onClick={() => startTransition(async () => { await updateCategory(category.id, businessId, { name }); setIsEditing(false) })}
            disabled={isPending}
            className="text-primary"
          >
            Save
          </button>
        ) : (
          !isArchived && (
            <button onClick={() => setIsEditing(true)} className="text-muted-foreground hover:text-foreground">
              Edit
            </button>
          )
        )}

        <button
          onClick={() => startTransition(() => setCategoryStatus(category.id, businessId, isArchived ? 'active' : 'archived'))}
          disabled={isPending}
          className="text-muted-foreground hover:text-destructive"
        >
          {isArchived ? 'Restore' : 'Archive'}
        </button>
      </div>
    </div>
  )
}