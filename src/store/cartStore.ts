import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { CartItem } from '@/types'

interface CartStore {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  updateItemThumbnail: (id: string, thumbnail: string) => void
  clearCart: () => void
  total: () => number
  itemCount: () => number
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item) => {
        set((state) => {
          const existing = state.items.find(i => i.id === item.id)
          if (existing) {
            return {
              items: state.items.map(i =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
              isOpen: true // Auto-open cart on add
            }
          }
          return { items: [...state.items, item], isOpen: true }
        })
      },
      
      removeItem: (id) => {
        set((state) => ({
          items: state.items.filter(i => i.id !== id)
        }))
      },
      
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id)
          return
        }
        set((state) => ({
          items: state.items.map(i =>
            i.id === id ? { ...i, quantity } : i
          )
        }))
      },

      updateItemThumbnail: (id, thumbnail) => {
        set((state) => ({
          items: state.items.map(i =>
            i.id === id ? { ...i, thumbnail } : i
          )
        }))
      },
      
      clearCart: () => set({ items: [] }),
      
      total: () => {
        return get().items.reduce((sum, item) => sum + (item.price * item.quantity), 0)
      },
      
      itemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0)
      },

      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen }))
    }),
    { 
      name: 'mimuus-cart',
      partialize: (state) => ({ items: state.items }), // Don't persist isOpen
    }
  )
)
