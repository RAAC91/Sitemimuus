'use client'

import { motion } from 'framer-motion'
import { Star, Play } from 'lucide-react'
import { useState } from 'react'

export interface TestimonialItem {
  type: 'video' | 'text'
  thumbnail?: string
  videoUrl?: string
  user?: string // For video type
  name?: string // For text type
  role?: string // For text type
  content: string
  rating?: number
}

interface TestimonialsProps {
  title?: string
  subtitle?: string
  stats?: string
  items?: TestimonialItem[]
}

const DEFAULT_ITEMS: TestimonialItem[] = [
  {
    type: 'video',
    thumbnail: 'https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/video-thumb-1.jpg',
    videoUrl: '#',
    user: '@mariclara',
    content: 'Nunca imaginei que uma garrafa pudesse ser tão estilosa.'
  },
  {
    type: 'text',
    name: 'Thiago Lima',
    role: 'CROSSFIT ATHLETE',
    content: 'Já derrubei minha Blackout umas 10 vezes no box. Nem um arranhão na pintura. Tanque de guerra com estilo.',
    rating: 5
  },
  {
    type: 'text',
    name: 'Ana Paula',
    role: 'MEDICINA USP',
    content: 'Café quente por 12h seguidas. Salvou meus plantões.',
    rating: 5
  },
  {
    type: 'video',
    thumbnail: 'https://ik.imagekit.io/x2or5thkzy/Stocks%20samples/video-thumb-2.jpg',
    videoUrl: '#',
    user: '@pedro_fit',
    content: 'Unboxing da minha Mimuus Neon!'
  }
]

export default function Testimonials({
  title = "Avaliações chegando",
  subtitle = "de todos os lados.",
  stats = "4.9/5 em 1200+ reviews",
  items = DEFAULT_ITEMS
}: TestimonialsProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [playing, setPlaying] = useState<number | null>(null);

  return (
    <section className="py-32 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="mb-16">
           <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-6">
             {title} <br/>
             <span className="text-primary">{subtitle}</span>
           </h2>
           <div className="flex gap-1 text-review-star">
              {[1,2,3,4,5].map(s => <Star key={s} fill="currentColor" size={20} />)}
              <span className="ml-2 text-muted-foreground font-bold">{stats}</span>
           </div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-4 gap-6 space-y-6">
          {items.map((t, i) => (
             <motion.div
               key={i}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               className="break-inside-avoid"
             >
                {t.type === 'video' ? (
                   <div className="relative aspect-9/16 rounded-3xl overflow-hidden group cursor-pointer shadow-lg">
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors z-10" />
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={t.thumbnail} alt="" className="w-full h-full object-cover" />
                      
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                          <button className="w-14 h-14 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center text-white border border-white/40 hover:scale-110 transition-transform">
                             <Play fill="currentColor" className="ml-1" />
                          </button>
                      </div>

                      <div className="absolute bottom-6 left-6 z-20">
                          <span className="text-white font-bold text-sm bg-black/20 px-3 py-1 rounded-full backdrop-blur-md">
                            {t.user}
                          </span>
                      </div>
                   </div>
                ) : (
                   <div className="bg-card p-8 rounded-3xl shadow-sm border border-border hover:shadow-xl transition-shadow relative overflow-hidden">
                       <div className="flex gap-1 mb-4 text-review-star">
                           {[...Array(t.rating || 5)].map((_, s) => <Star key={s} size={14} fill="currentColor" />)}
                       </div>
                       <p className="text-foreground font-medium leading-relaxed mb-6">"{t.content}"</p>
                       <div className="flex items-center gap-3">
                           <div className="w-10 h-10 rounded-full bg-muted" />
                           <div>
                               <p className="font-bold text-xs uppercase tracking-wider text-foreground">{t.name}</p>
                               {t.role && <p className="text-[10px] font-bold text-muted-foreground">{t.role}</p>}
                           </div>
                       </div>
                   </div>
                )}
             </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
