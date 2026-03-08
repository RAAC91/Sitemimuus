import { EditorClientWrapper } from "@/components/visual-editor/EditorClientWrapper"
import { GamificationProvider } from "@/context/GamificationContext"

export default async function EditorPage({ searchParams }: { searchParams: Promise<{ sku?: string; productId?: string }> }) {
  const resolvedParams = await searchParams;
  return (
    <GamificationProvider>
      <EditorClientWrapper initialSku={resolvedParams.sku} productId={resolvedParams.productId} />
    </GamificationProvider>
  )
}
