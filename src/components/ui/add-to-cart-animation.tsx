'use client'

import { motion } from 'framer-motion'
import { ShoppingCart } from 'lucide-react'
import { toast } from './toast'

interface AddToCartAnimationProps {
  productImage: string
  productName: string
  onAnimationComplete?: () => void
}

export function useAddToCartAnimation() {
  const triggerAddToCart = (product: { image: string; name: string }) => {
    // Show success toast
    toast.success(`${product.name} adicionado ao carrinho!`)

    // You could trigger a flying animation here with framer-motion
    // For now, we just show the toast
    
    // Optional: Add confetti for first purchase
    const purchases = parseInt(localStorage.getItem('purchaseCount') || '0')
    if (purchases === 0) {
      // First purchase celebration
      localStorage.setItem('purchaseCount', '1')
    }
  }

  return { triggerAddToCart }
}

// Animated Cart Icon Component
export function AnimatedCartIcon({ onClick }: { onClick?: () => void }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      className="relative"
    >
      <ShoppingCart className="h-6 w-6" />
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.2, 1] }}
        transition={{ duration: 0.3 }}
        className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold"
      >
        1
      </motion.div>
    </motion.button>
  )
}

// Product to Cart Visual Feedback
export function ProductToCartAnimation({ productImage, productName }: AddToCartAnimationProps) {
  return (
    <motion.div
      initial={{ opacity: 1, scale: 1, x: 0, y: 0 }}
      animate={{
        opacity: [1, 1, 0],
        scale: [1, 0.5, 0.2],
        x: [0, 200, 400],
        y: [0, -100, -200],
      }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      className="fixed top-1/2 left-1/2 z-[9999] pointer-events-none"
    >
      <div className="flex items-center gap-3 bg-white rounded-lg shadow-2xl p-4 border-2 border-green-500">
        <img
          src={productImage}
          alt={productName}
          className="w-12 h-12 rounded object-cover"
        />
        <ShoppingCart className="h-8 w-8 text-green-600" />
      </div>
    </motion.div>
  )
}
