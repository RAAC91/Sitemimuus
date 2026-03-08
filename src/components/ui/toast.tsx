'use client'

import { X, CheckCircle, AlertCircle, Info, Loader2 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { cn } from '@/lib/utils'

type ToastType = 'success' | 'error' | 'info' | 'loading'

interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number
}

const toastStore: Toast[] = []
const listeners: Array<() => void> = []

function emitChange() {
  listeners.forEach((listener) => listener())
}

export const toast = {
  success: (message: string, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9)
    toastStore.push({ id, type: 'success', message, duration })
    emitChange()
    if (duration > 0) {
      setTimeout(() => toast.dismiss(id), duration)
    }
  },
  error: (message: string, duration = 4000) => {
    const id = Math.random().toString(36).substr(2, 9)
    toastStore.push({ id, type: 'error', message, duration })
    emitChange()
    if (duration > 0) {
      setTimeout(() => toast.dismiss(id), duration)
    }
  },
  info: (message: string, duration = 3000) => {
    const id = Math.random().toString(36).substr(2, 9)
    toastStore.push({ id, type: 'info', message, duration })
    emitChange()
    if (duration > 0) {
      setTimeout(() => toast.dismiss(id), duration)
    }
  },
  loading: (message: string) => {
    const id = Math.random().toString(36).substr(2, 9)
    toastStore.push({ id, type: 'loading', message, duration: 0 })
    emitChange()
    return id
  },
  dismiss: (id: string) => {
    const index = toastStore.findIndex((t) => t.id === id)
    if (index > -1) {
      toastStore.splice(index, 1)
      emitChange()
    }
  },
}

export function Toaster() {
  const [, forceUpdate] = useState({})

  useEffect(() => {
    const listener = () => forceUpdate({})
    listeners.push(listener)
    return () => {
      const index = listeners.indexOf(listener)
      if (index > -1) listeners.splice(index, 1)
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none">
      {toastStore.map((t) => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>
  )
}

function ToastItem({ id, type, message }: Toast) {
  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
    loading: Loader2,
  }

  const Icon = icons[type]

  return (
    <div
      className={cn(
        'flex items-center gap-3 min-w-[300px] max-w-md p-4 rounded-lg shadow-xl',
        'bg-white border pointer-events-auto',
        'animate-in slide-in-from-right-full duration-300',
        type === 'success' && 'border-green-200 bg-green-50',
        type === 'error' && 'border-red-200 bg-red-50',
        type === 'info' && 'border-blue-200 bg-blue-50',
        type === 'loading' && 'border-gray-200'
      )}
    >
      <Icon
        className={cn(
          'h-5 w-5 shrink-0',
          type === 'success' && 'text-green-600',
          type === 'error' && 'text-red-600',
          type === 'info' && 'text-blue-600',
          type === 'loading' && 'text-gray-600 animate-spin'
        )}
      />
      <p className="text-sm font-medium text-gray-900 flex-1">{message}</p>
      {type !== 'loading' && (
        <button
          onClick={() => toast.dismiss(id)}
          className="shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
