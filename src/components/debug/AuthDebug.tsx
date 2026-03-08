"use client"

import { useAuth } from "@/providers/AuthProvider"
import { useEffect, useState } from "react"
import { useAdmin } from "@/hooks/useAdmin";

export function AuthDebug() {
  const { user, loading } = useAuth();
  const { isAdmin } = useAdmin();
  const [mounted, setMounted] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted || process.env.NODE_ENV !== 'development' || !isVisible || !user || !isAdmin) return null

  return (
    <div className="fixed bottom-4 right-4 z-10000 bg-black/80 text-white p-4 rounded-lg text-xs font-mono max-w-sm shadow-2xl border border-white/20 backdrop-blur-md">
      <div className="flex justify-between items-center mb-2 border-b border-white/20 pb-1">
        <span className="font-bold text-brand-pink">AUTH DEBUGGER</span>
        <button onClick={() => setIsVisible(false)} className="text-gray-400 hover:text-white">✕</button>
      </div>
      <div className="space-y-1">
        <div className="flex justify-between">
          <span className="text-gray-400">Loading:</span>
          <span className={loading ? "text-yellow-400" : "text-green-400"}>{String(loading)}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-400">User:</span>
          <span className={user ? "text-green-400" : "text-red-400"}>{user ? "LOGGED IN" : "NULL"}</span>
        </div>
        {user && (
          <>
            <div className="pt-2 border-t border-white/10 mt-1">
              <span className="text-gray-400 block mb-0.5">ID:</span>
              <span className="break-all text-gray-300">{user.id}</span>
            </div>
            <div className="mt-1">
              <span className="text-gray-400 block mb-0.5">Email:</span>
              <span className="break-all text-gray-300">{user.email}</span>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
