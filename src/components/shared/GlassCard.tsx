'use client'

import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface GlassCardProps {
  children: React.ReactNode
  className?: string
  hover?: boolean
}

export default function GlassCard({ children, className, hover = false }: GlassCardProps) {
  return (
    <motion.div
      className={cn(
        'glass rounded-3xl p-8',
        hover && 'transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.div>
  )
}
