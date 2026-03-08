'use client'

import { motion } from 'framer-motion'

export function MarqueeBrand() {
  return (
    <div className="relative w-full overflow-hidden bg-brand-black/[0.02] border-y border-brand-black/5 py-8">
      <div className="flex whitespace-nowrap">
        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
          className="flex items-center gap-12"
        >
          {[...Array(8)].map((_, i) => (
             <span key={i} className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-black/10 to-brand-black/30 tracking-tighter uppercase select-none">
                #MimuusYourWay
             </span>
          ))}
        </motion.div>

        <motion.div
          animate={{ x: [0, -1000] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
          className="flex items-center gap-12 ml-12"
        >
          {[...Array(8)].map((_, i) => (
             <span key={i} className="text-4xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-black/10 to-brand-black/30 tracking-tighter uppercase select-none">
                #MimuusYourWay
             </span>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
