'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronRight } from 'lucide-react'

const categories = [
  { id: 1, name: 'Térmicas', slug: 'garrafas-termicas', image: 'https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/2.png' },
  { id: 2, name: 'Tote Bags', slug: 'tote-bags', image: 'https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/7.png' },
  { id: 3, name: 'Kids', slug: 'kids', image: 'https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/4.png' },
  { id: 4, name: 'Mochilas', slug: 'mochilas', image: 'https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/5.png' },
  { id: 5, name: 'Pastel', slug: 'pastel', image: 'https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/6.png' },
  { id: 6, name: 'Corporate', slug: 'corporate', image: 'https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/3.png' },
]

export default function CategoryCircles() {
  return (
    <section className="py-24 md:py-32 lg:py-40 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <span className="text-brand-pink font-black tracking-widest text-[10px] uppercase mb-2 block">CATEGORIAS</span>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-zinc-900">Explore por estilo.</h2>
          </div>
          <Link href="/garrafas-personalizadas" className="text-sm font-bold border-b border-zinc-200 pb-1 hover:border-brand-pink transition-colors">
            VER TODA A COLEÇÃO →
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex overflow-x-auto pb-10 space-x-6 scrollbar-none snap-x"
        >
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="shrink-0 snap-center"
            >
              <Link href={`/categorias/${cat.slug}`} className="group relative block w-48 h-64 overflow-hidden rounded-lg transition-all duration-500 hover:scale-[1.02]">
                {/* Background Gradient & Image */}
                <div className="absolute inset-0 bg-linear-to-b from-zinc-50 to-zinc-100 group-hover:from-brand-pink/5 group-hover:to-brand-pink/10 transition-colors duration-500" />
                
                <div className="absolute inset-0 p-6 flex flex-col items-center justify-between z-10">
                  <div className="w-full flex justify-end">
                    <div className="w-8 h-8 rounded-full bg-white/50 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-4 h-4 text-brand-pink" />
                    </div>
                  </div>
                  
                  <div className="relative w-32 h-32 transition-transform duration-700 group-hover:scale-110 drop-shadow-lg">
                    <Image 
                      src={cat.image} 
                      alt={cat.name} 
                      fill
                      className="object-contain"
                      sizes="128px"
                    />
                  </div>
                  
                  <div className="text-center">
                    <span className="font-black text-sm uppercase tracking-widest text-zinc-900 group-hover:text-brand-pink transition-colors">
                      {cat.name}
                    </span>
                  </div>
                </div>

                {/* Glass Border */}
                <div className="absolute inset-0 border border-zinc-100 group-hover:border-brand-pink/20 rounded-lg transition-colors" />
              </Link>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
