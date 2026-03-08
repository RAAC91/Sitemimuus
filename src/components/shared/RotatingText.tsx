'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface RotatingTextProps {
  words: string[]
  className?: string
}

export default function RotatingText({ words, className }: RotatingTextProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length)
    }, 3000)
    return () => clearInterval(interval)
  }, [words.length])

  return (
    <span className="inline-block relative h-[1em] min-w-[3ch]">
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className={className}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
