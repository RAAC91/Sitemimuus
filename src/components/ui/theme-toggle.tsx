"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { Sun, Moon } from "lucide-react"

export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) {
    return (
        <button className={`p-3 rounded-full shadow-lg transition-all bg-white/40 text-gray-600 border border-white/50 backdrop-blur-2xl ${className}`}>
           <Sun className="w-6 h-6" />
        </button>
    )
  }

  const isDark = resolvedTheme === 'dark'

  return (
    <button
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className={`p-3 rounded-full shadow-lg transition-all ${
        isDark 
          ? 'bg-gray-800/60 text-gray-300 border border-white/10' 
          : 'bg-white/40 text-gray-600 border border-white/50'
      } backdrop-blur-2xl hover:text-[#FF9E9E] ${className}`}
      aria-label="Toggle Theme"
    >
      {isDark ? (
        <Moon className="w-6 h-6" />
      ) : (
        <Sun className="w-6 h-6" />
      )}
    </button>
  )
}
