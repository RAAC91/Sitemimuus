"use client"

import Link from "next/link"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"

interface BreadcrumbItem {
  label: string
  href?: string
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumb({ items, className = "" }: BreadcrumbProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return (
    <nav 
      aria-label="Breadcrumb"
      className={`flex items-center gap-2 text-[10px] md:text-[11px] font-bold tracking-widest uppercase ${className}`}
    >
      <Link 
        href="/" 
        className={`transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-black'}`}
      >
        INÍCIO
      </Link>
      
      {items.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          <span className={isDark ? "text-gray-700" : "text-gray-300"}>/</span>
          {item.href ? (
            <Link 
              href={item.href}
              className={`transition-colors ${isDark ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-black'}`}
            >
              {item.label}
            </Link>
          ) : (
            <span className={isDark ? "text-gray-200" : "text-gray-600"}>
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  )
}
