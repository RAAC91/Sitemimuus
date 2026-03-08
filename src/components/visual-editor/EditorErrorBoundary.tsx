'use client'

import React, { Component, ErrorInfo } from 'react'
import posthog from 'posthog-js'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: React.ReactNode
  fallbackMessage?: string
}

interface State {
  hasError: boolean
  error?: Error
}

export class EditorErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('WebGL/Editor Error Caught:', error, errorInfo)
    
    // Send to PostHog
    posthog.capture('editor_webgl_crash', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full min-h-[500px] flex flex-col items-center justify-center bg-gray-50/80 dark:bg-slate-900/80 backdrop-blur-md rounded-3xl p-8 border-2 border-red-500/20 text-center">
          <AlertTriangle className="w-16 h-16 text-red-500 mb-4" />
          <h2 className="text-xl font-bold mb-2">Ops! O Editor 3D encontrou um problema.</h2>
          <p className="text-sm text-gray-500 mb-6">
            {this.props.fallbackMessage || 'Isso pode ser devido à falta de memória de vídeo no dispositivo ou instabilidade no navegador limpe o cache e tente novamente.'}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-500 text-white rounded-lg font-bold hover:bg-red-600 transition-colors"
          >
            Recarregar Página
          </button>
        </div>
      )
    }

    return this.props.children
  }
}
