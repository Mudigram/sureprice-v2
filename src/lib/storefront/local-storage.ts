// Shared localStorage utilities for the customer-facing storefront app.
// Cart and history are client-only (V1 — payments are physical).

export interface CartItem {
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

export interface HistoryItem {
  id: string
  name: string
  base_price: number | null
  image_url: string | null
  businessSlug: string
  businessName: string
  viewedAt: string
}

export interface SavedTrip {
  id: string
  title: string
  createdAt: string
  items: CartItem[]
  total: number
}

const CART_KEY = 'sureprice_cart'
const HISTORY_KEY = 'sureprice_history'
const SAVED_TRIPS_KEY = 'sureprice_saved_trips'
const MAX_HISTORY = 30

// ─── Cart ────────────────────────────────────────────────────────────────────

export function getCart(): CartItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(CART_KEY) ?? '[]') as CartItem[]
  } catch {
    return []
  }
}

export function addToCart(item: Omit<CartItem, 'quantity' | 'addedAt'>): void {
  const cart = getCart()
  const existing = cart.find((c) => c.id === item.id)
  if (existing) {
    existing.quantity += 1
  } else {
    cart.push({ ...item, quantity: 1, addedAt: new Date().toISOString() })
  }
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export function removeFromCart(id: string): void {
  const cart = getCart().filter((c) => c.id !== id)
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export function updateCartQuantity(id: string, quantity: number): void {
  if (quantity < 1) {
    removeFromCart(id)
    return
  }
  const cart = getCart().map((c) => (c.id === id ? { ...c, quantity } : c))
  localStorage.setItem(CART_KEY, JSON.stringify(cart))
}

export function clearCart(): void {
  localStorage.setItem(CART_KEY, '[]')
}

export function getCartCount(): number {
  return getCart().reduce((sum, c) => sum + c.quantity, 0)
}

// ─── History ─────────────────────────────────────────────────────────────────

export function getHistory(): HistoryItem[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(HISTORY_KEY) ?? '[]') as HistoryItem[]
  } catch {
    return []
  }
}

export function addToHistory(item: Omit<HistoryItem, 'viewedAt'>): void {
  const history = getHistory().filter((h) => h.id !== item.id)
  history.unshift({ ...item, viewedAt: new Date().toISOString() })
  localStorage.setItem(HISTORY_KEY, JSON.stringify(history.slice(0, MAX_HISTORY)))
}

export function clearHistory(): void {
  localStorage.setItem(HISTORY_KEY, '[]')
}

// ─── Saved Trips ─────────────────────────────────────────────────────────────

export function getSavedTrips(): SavedTrip[] {
  if (typeof window === 'undefined') return []
  try {
    return JSON.parse(localStorage.getItem(SAVED_TRIPS_KEY) ?? '[]') as SavedTrip[]
  } catch {
    return []
  }
}

export function saveTrip(title: string, items: CartItem[]): SavedTrip {
  const trips = getSavedTrips()
  const total = items.reduce((sum, i) => sum + (i.base_price ?? 0) * i.quantity, 0)
  const newTrip: SavedTrip = {
    id: 'trip_' + Date.now() + '_' + Math.random().toString(36).slice(2, 7),
    title,
    createdAt: new Date().toISOString(),
    items,
    total,
  }
  trips.unshift(newTrip)
  localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(trips))
  return newTrip
}

export function deleteSavedTrip(id: string): void {
  const trips = getSavedTrips().filter((t) => t.id !== id)
  localStorage.setItem(SAVED_TRIPS_KEY, JSON.stringify(trips))
}
