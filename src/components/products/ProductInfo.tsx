'use client'

import { motion } from 'framer-motion'
import { ShoppingBag, Sparkles, ShieldCheck, Truck } from 'lucide-react'
import Link from 'next/link'
import { formatPrice } from '@/lib/utils'

interface ProductInfoProps {
  product: any
}

export default function ProductInfo({ product }: ProductInfoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8 }}
      className="flex flex-col h-full"
    >
      <div className="mb-8">
        <span className="text-brand-pink font-black tracking-widest text-xs uppercase mb-4 block">
          {product.category || 'COLEÇÃO 2026'}
        </span>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 mb-4 uppercase">
          {product.name}
        </h1>
        <div className="flex items-center space-x-4">
           <span className="text-3xl font-black text-zinc-900">{formatPrice(product.sale_price || product.base_price)}</span>
           {product.sale_price && (
             <span className="text-zinc-400 line-through font-bold">{formatPrice(product.base_price)}</span>
           )}
        </div>
      </div>

      {/* PACCO-Style Block Swatches (Mock) */}
      <div className="mb-8">
        <span className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 block">
          Cor Selecionada: <span className="text-zinc-900">Origens</span>
        </span>
        <div className="flex gap-2">
           {[
             { name: 'Origens', color: 'bg-[#e5dcd3]', selected: true },
             { name: 'Onyx', color: 'bg-zinc-800', selected: false },
             { name: 'Seashell', color: 'bg-[#f4efe9]', selected: false },
             { name: 'Granite', color: 'bg-[#8b939c]', selected: false },
             { name: 'Monaco', color: 'bg-[#2b59c3]', selected: false },
           ].map((c) => (
             <button
               key={c.name}
               title={c.name}
               className={`w-10 h-10 rounded-lg ${c.color} relative transition-all duration-300 hover:scale-105 ${
                 c.selected ? 'ring-[1.5px] ring-zinc-900 ring-offset-2 ring-offset-[#fcfbf9]' : 'border border-black/5 hover:border-black/20'
               }`}
             />
           ))}
        </div>
      </div>

      <p className="text-zinc-500 text-lg mb-10 leading-relaxed font-medium">
        {product.description || 'Uma garrafa térmica premium feita para durar. Personalização exclusiva com tecnologia laser para um acabamento irretocável.'}
      </p>

      {/* "Stories" Style Features (PACCO Reference) */}
      <div className="flex gap-4 mb-12 overflow-x-auto no-scrollbar pb-2">
        {[
          { icon: '❄️', label: '24h Frio' },
          { icon: '🔥', label: '12h Quente' },
          { icon: '💧', label: 'BPA Free' },
          { icon: '🛡️', label: 'Inox 304' },
          { icon: '✨', label: 'Premium' },
        ].map((story, i) => (
          <div key={i} className="flex flex-col items-center gap-2 shrink-0 group cursor-pointer">
            <div className="w-16 h-16 rounded-2xl bg-white border border-zinc-100 flex items-center justify-center text-2xl shadow-sm transition-all duration-300 group-hover:scale-105 group-hover:shadow-md ring-[1.5px] ring-transparent group-hover:ring-zinc-200 ring-offset-2 ring-offset-[#fcfbf9]">
              {story.icon}
            </div>
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-500 group-hover:text-zinc-900 transition-colors">
              {story.label}
            </span>
          </div>
        ))}
      </div>

      {/* CTAs */}
      <div className="flex flex-col gap-4 mb-12">
        <button className="flex items-center justify-center space-x-3 bg-brand-pink text-white py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] shadow-2xl shadow-brand-pink/20 hover:scale-[1.02] active:scale-95 transition-all">
          <ShoppingBag className="w-5 h-5" />
          <span>GARANTIR A MINHA</span>
        </button>
        
        <Link 
          href={`/editor?sku=${product.metadata?.sku || product.sku || 'Branco'}&productId=${product.id}`}
          className="flex items-center justify-center space-x-3 bg-white text-black border-2 border-zinc-100 py-6 rounded-3xl font-black text-sm uppercase tracking-[0.2em] hover:bg-brand-cyan hover:border-brand-cyan hover:text-black transition-all"
        >
          <Sparkles className="w-5 h-5" />
          <span>PERSONALIZAR EM 3D</span>
        </Link>
      </div>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-6 mt-auto pt-12 border-t border-zinc-50">
         <div className="flex items-center space-x-3">
            <ShieldCheck className="text-zinc-400 w-5 h-5" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Garantia Vitalícia</span>
         </div>
         <div className="flex items-center space-x-3">
            <Truck className="text-zinc-400 w-5 h-5" />
            <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Frete Grátis Brasil</span>
         </div>
      </div>
    </motion.div>
  )
}
