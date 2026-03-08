'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const filters = ['Ver Tudo', 'Fashion', 'Vibrantes', 'Clássicos', 'Pastel']

export default function FindYourBottle() {
  const [activeFilter, setActiveFilter] = useState('Ver Tudo')

  return (
    <section className="py-24 md:py-32 lg:py-40 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.h2
          initial={{ y: 40, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-4xl md:text-6xl font-black mb-12"
        >
          Encontre a sua <span className="text-zinc-900">companheira<span className="text-brand-cyan">.</span></span>
        </motion.h2>

        <div className="flex flex-wrap justify-center gap-4 mb-20">
          {filters.map((filter, i) => (
            <motion.button
              key={filter}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setActiveFilter(filter)}
              className={`px-8 py-3 rounded-full font-bold transition-all ${
                activeFilter === filter 
                  ? 'bg-brand-pink text-white shadow-xl shadow-brand-pink/20 scale-105' 
                  : 'bg-white text-zinc-600 hover:bg-zinc-100'
              }`}
            >
              {filter}
            </motion.button>
          ))}
        </div>

        {/* Product Grid placeholder - we will build the ProductCard separately */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-[2.5rem] p-8 group cursor-pointer hover:shadow-3xl transition-all h-[400px] relative overflow-hidden flex flex-col items-center justify-center border border-zinc-100"
            >
              <Link href="/editor" className="w-full h-full flex items-center justify-center group-hover:scale-110 transition-transform duration-500">
                <img src={`https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/${i}.png`} className="max-h-[300px] object-contain drop-shadow-2xl" />
              </Link>
              <div className="absolute inset-x-0 bottom-0 p-8 transform translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                <Link href="/editor" className="block w-full bg-brand-black text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest text-center">
                  PERSONALIZE
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
