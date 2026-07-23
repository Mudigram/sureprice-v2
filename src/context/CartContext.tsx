'use client'

import { createContext, useContext, useEffect, useState, useCallback, type ReactNode } from 'react'

// ─── Types ─────────────────────────────────────────────────────────────────

export interface ListItem {
  id: string
  name: string
  base_price: number | null
  image_url: string | null
  businessSlug: string
  businessName: string
  quantity: number
  addedAt: string
  collected?: boolean
}

interface CartContextValue {
  items: ListItem[]
  totalCount: number
  addItem: (item: Omit<ListItem, 'quantity' | 'addedAt'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  toggleCollected: (id: string) => void
  clearList: () => void
  clearStoreItems: (businessSlug: string) => void
  isInList: (id: string) => boolean
  getQuantity: (id: string) => number
}

// ─── Storage key ───────────────────────────────────────────────────────────

const KEY = 'sureprice_cart'

function readStorage(): ListItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]') as ListItem[]
  } catch {
    return []
  }
}

function writeStorage(items: ListItem[]) {
  localStorage.setItem(KEY, JSON.stringify(items))
}

// ─── Context ───────────────────────────────────────────────────────────────

const CartContext = createContext<CartContextValue | null>(null)

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ListItem[]>([])

  // Hydrate from localStorage on mount
  useEffect(() => {
    setItems(readStorage())
  }, [])

  // Sync when another tab/window changes localStorage
  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === KEY) setItems(readStorage())
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  const persist = useCallback((next: ListItem[]) => {
    setItems(next)
    writeStorage(next)
  }, [])

  const addItem = useCallback(
    (item: Omit<ListItem, 'quantity' | 'addedAt'>) => {
      setItems((prev) => {
        const existing = prev.find((i) => i.id === item.id)
        const next = existing
          ? prev.map((i) => (i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i))
          : [...prev, { ...item, quantity: 1, addedAt: new Date().toISOString(), collected: false }]
        writeStorage(next)
        return next
      })
    },
    []
  )

  const removeItem = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.id !== id)
      writeStorage(next)
      return next
    })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id)
      return
    }
    setItems((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, quantity } : i))
      writeStorage(next)
      return next
    })
  }, [removeItem])

  const toggleCollected = useCallback((id: string) => {
    setItems((prev) => {
      const next = prev.map((i) => (i.id === id ? { ...i, collected: !i.collected } : i))
      writeStorage(next)
      return next
    })
  }, [])

  const clearList = useCallback(() => persist([]), [persist])

  const clearStoreItems = useCallback((businessSlug: string) => {
    setItems((prev) => {
      const next = prev.filter((i) => i.businessSlug !== businessSlug)
      writeStorage(next)
      return next
    })
  }, [])

  const isInList = useCallback((id: string) => items.some((i) => i.id === id), [items])

  const getQuantity = useCallback(
    (id: string) => items.find((i) => i.id === id)?.quantity ?? 0,
    [items]
  )

  const totalCount = items.reduce((sum, i) => sum + i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        totalCount,
        addItem,
        removeItem,
        updateQuantity,
        toggleCollected,
        clearList,
        clearStoreItems,
        isInList,
        getQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart must be used inside <CartProvider>')
  return ctx
}
