'use client'

import { ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StickyCTAProps {
  productName: string
  price: number
  onAddToCart: () => void
  isLoading?: boolean
}

export function StickyCTA({ productName, price, onAddToCart, isLoading }: StickyCTAProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-2xl p-4 z-50 md:hidden">
      <div className="flex items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">{productName}</p>
          <p className="text-lg font-bold text-gray-900">
            R$ {price.toFixed(2).replace('.', ',')}
          </p>
        </div>
        <Button
          size="lg"
          onClick={onAddToCart}
          disabled={isLoading}
          className="min-w-[180px] bg-linear-to-r from-pink-500 to-orange-500 text-white hover:from-pink-600 hover:to-orange-600"
        >
          {isLoading ? (
            <span>Adicionando...</span>
          ) : (
            <>
              <ShoppingCart className="h-5 w-5 mr-2" />
              Adicionar ao Carrinho
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
