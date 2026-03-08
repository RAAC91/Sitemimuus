"use client"

import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

export function BackgroundEffects() {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  // Prevent hydration mismatch
  if (!mounted) return null

  const isDark = resolvedTheme === 'dark'

  return (
    <>
      {/* Mesh Background */}
      <div className="fixed inset-0 -z-50 pointer-events-none">
        <div className={`w-full h-full transition-colors duration-500 ${
          isDark 
            ? 'bg-[#0f172a]' 
            : 'bg-[#ffedeb]'
        }`}>
          <div className={`absolute inset-0 ${
            isDark
              ? 'bg-[radial-gradient(at_0%_0%,#1e1b4b_0,transparent_50%),radial-gradient(at_100%_0%,#312e81_0,transparent_50%),radial-gradient(at_50%_50%,#1e293b_0,transparent_50%)]'
              : 'bg-[radial-gradient(at_0%_0%,#e0f2f1_0,transparent_50%),radial-gradient(at_50%_0%,#f3e5f5_0,transparent_50%),radial-gradient(at_100%_0%,#fff3e0_0,transparent_50%),radial-gradient(at_0%_100%,#fff3e0_0,transparent_50%),radial-gradient(at_50%_100%,#f3e5f5_0,transparent_50%),radial-gradient(at_100%_100%,#e0f2f1_0,transparent_50%)]'
          }`} />
        </div>
      </div>

      {/* Background Orbs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-40 overflow-hidden">
        <div className={`absolute top-[10%] left-[15%] w-72 h-72 blur-3xl rounded-full transition-colors duration-500 ${
          isDark ? 'bg-primary/5' : 'bg-[#ffedd5]/30'
        }`} />
        <div className={`absolute bottom-[20%] right-[10%] w-96 h-96 blur-3xl rounded-full transition-colors duration-500 ${
          isDark ? 'bg-teal-500/5' : 'bg-[#dcfce7]/30'
        }`} />
      </div>
    </>
  )
}
