'use client'

import { motion } from 'framer-motion'
import { Instagram } from 'lucide-react'
import Image from 'next/image'

const instaPosts = [
  { url: 'https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/1.png', size: 'large' },
  { url: 'https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/2.png', size: 'small' },
  { url: 'https://images.unsplash.com/photo-1544145945-f904253d0c71?q=80&w=800', size: 'small' },
  { url: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=800', size: 'medium' },
  { url: 'https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/3.png', size: 'small' },
]

export default function SocialFeed() {
  return (
    <section className="py-32 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Instagram className="w-5 h-5 text-brand-pink" />
              <span className="text-brand-pink font-black tracking-widest text-xs uppercase">@mimuus<span className="text-brand-cyan">.</span>oficial</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-zinc-900 leading-none">
              Use <span className="text-brand-pink">#MeuMimuus</span> para aparecer aqui.
            </h2>
          </div>
          <a 
            href="https://instagram.com/mimuus.oficial" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="px-8 py-4 bg-zinc-900 text-white rounded-full font-black text-[10px] uppercase tracking-widest hover:bg-brand-pink transition-all text-center inline-block"
          >
            SEGUIR NO INSTAGRAM
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 h-[600px] md:h-[500px]">
          {/* Main Large Image */}
          <motion.a 
            href="https://instagram.com/mimuus.oficial"
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="col-span-2 md:row-span-2 relative rounded-[3rem] overflow-hidden group block"
          >
             <Image 
               src={instaPosts[3].url} 
               alt="Lifestyle"
               fill
               className="object-cover transform group-hover:scale-110 transition-transform duration-700" 
               sizes="(max-width: 768px) 100vw, 50vw"
             />
             <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Instagram className="text-white w-10 h-10" />
             </div>
          </motion.a>

          {/* Grid items */}
          <div className="grid grid-cols-1 md:grid-cols-2 col-span-2 gap-6">
            {/* Displaying indexes 0, 1, 2, 4 (skipping 3 which is the large image) */}
            {[instaPosts[0], instaPosts[1], instaPosts[2], instaPosts[4]].map((post, i) => (
              <motion.a
                href="https://instagram.com/mimuus.oficial"
                target="_blank"
                rel="noopener noreferrer"
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="relative aspect-square rounded-[2rem] overflow-hidden group block"
              >
                <Image 
                  src={post.url} 
                  alt="Instagram post"
                  fill
                  className="object-cover transform group-hover:scale-110 transition-transform duration-700" 
                  sizes="(max-width: 768px) 50vw, 25vw"
                />
                <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Instagram className="text-white w-6 h-6" />
                </div>
              </motion.a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
