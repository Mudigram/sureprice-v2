'use client'

import { useState, useTransition } from 'react'
import { Trash2, AlertTriangle, Loader2, X } from 'lucide-react'
import { deleteCatalogItem } from '../actions'

interface DeleteItemButtonProps {
  itemId: string
  businessId: string
  itemName: string
}

export function DeleteItemButton({ itemId, businessId, itemName }: DeleteItemButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      await deleteCatalogItem(itemId, businessId)
    })
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        id="delete-item-trigger-btn"
        className="inline-flex items-center justify-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-3 text-xs font-black text-rose-700 hover:bg-rose-100 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-400 dark:hover:bg-rose-900/50 transition-all active:scale-95"
      >
        <Trash2 size={16} />
        <span>Delete Product Item</span>
      </button>

      {/* Confirmation Modal */}
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="delete-modal-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md"
        >
          <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl space-y-4 text-slate-900 dark:border-slate-800 dark:bg-slate-900 dark:text-white">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 dark:border-slate-800">
              <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-black text-base">
                <AlertTriangle size={20} />
                <h3 id="delete-modal-title">Delete Product Item</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-xl text-slate-400 hover:text-slate-900 hover:bg-slate-100 dark:hover:text-white dark:hover:bg-slate-800"
              >
                <X size={16} />
              </button>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-medium">
              Are you sure you want to delete <strong className="text-slate-900 dark:text-white font-black">&ldquo;{itemName}&rdquo;</strong>? This item will be archived and removed from your active store storefront and QR tags.
            </p>

            <div className="flex gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                disabled={isPending}
                className="flex-1 rounded-2xl border border-slate-200 bg-slate-50 py-3 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isPending}
                id="confirm-delete-item-btn"
                className="flex flex-1 items-center justify-center gap-2 rounded-2xl bg-rose-600 py-3 text-xs font-black text-white shadow-md hover:bg-rose-700 active:scale-95 transition-all disabled:opacity-50"
              >
                {isPending ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Deleting…</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={15} />
                    <span>Confirm Delete</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
