"use client"

import dynamic from "next/dynamic"

const BottleEditor = dynamic(
  () => import("./BottleEditor").then((mod) => mod.BottleEditor),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-full min-h-[500px] flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-3xl border border-dashed border-brand-pink/20">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-brand-pink border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium text-muted-foreground animate-pulse">Carregando Editor Visual...</p>
        </div>
      </div>
    ),
  }
)

import { useRouter } from "next/navigation"
import { EditorErrorBoundary } from "./EditorErrorBoundary"

interface EditorClientWrapperProps {
  initialSku?: string
  productId?: string
}

export function EditorClientWrapper({ initialSku, productId }: EditorClientWrapperProps) {
  const router = useRouter()

  return (
    <EditorErrorBoundary>
      <BottleEditor 
        initialSku={initialSku} 
        productId={productId} 
        onBack={() => router.back()} 
      />
    </EditorErrorBoundary>
  )
}
