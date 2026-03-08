'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface ProductGalleryProps {
  images: string[]
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [selected, setSelected] = useState(0)
  const [showZoom, setShowZoom] = useState(false)

  // Filter out any null/undefined images
  const validImages = images.filter(Boolean)

  if (validImages.length === 0) return null

  return (
    <div className="flex flex-col-reverse md:flex-row gap-6">
      {/* Thumbnails */}
      <div className="flex md:flex-col gap-4 overflow-x-auto md:overflow-y-auto no-scrollbar py-2 px-1">
        {validImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`shrink-0 w-20 h-20 rounded-2xl overflow-hidden bg-white/60 backdrop-blur-sm transition-all duration-300 relative ${
              selected === i 
                ? 'border-transparent scale-95 ring-[1.5px] ring-zinc-900 ring-offset-2 ring-offset-[#fcfbf9]' 
                : 'border border-zinc-200/50 hover:border-zinc-300 opacity-70 hover:opacity-100'
            }`}
          >
            <img src={img} className="w-full h-full object-contain p-2" alt={`Thumbnail ${i + 1}`} />
          </button>
        ))}
      </div>

      {/* Main Image */}
      <div 
        className="flex-1 relative aspect-4/5 rounded-2xl bg-zinc-50 border border-zinc-100 overflow-hidden flex items-center justify-center group cursor-zoom-in"
        onClick={() => setShowZoom(true)}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={selected}
            src={validImages[selected]}
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            exit={{ opacity: 0, scale: 0.9, rotate: 2 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full h-full object-cover drop-shadow-2xl"
            alt="Product view"
          />
        </AnimatePresence>

        {/* Zoom Hint */}
        <div className="absolute bottom-8 right-8 w-12 h-12 rounded-full glass border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
           <span className="text-zinc-600 font-black text-xs">ZOOM</span>
        </div>
      </div>

      {/* Zoom Modal */}
      <AnimatePresence>
        {showZoom && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-100 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 md:p-12 cursor-zoom-out"
            onClick={() => setShowZoom(false)}
          >
            <motion.button
              className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
              onClick={() => setShowZoom(false)}
            >
              <span className="text-4xl font-light">×</span>
            </motion.button>

            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              src={validImages[selected]}
              className="max-h-full max-w-full object-contain"
              alt="Zoomed view"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
