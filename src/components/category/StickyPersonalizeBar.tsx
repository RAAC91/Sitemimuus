export function StickyPersonalizeBar() {
  return (
    <div
      className="fixed bottom-6 left-1/2 -translate-x-1/2 px-6 py-3 shadow-xl backdrop-blur z-30 cursor-pointer transition hover:scale-105"
      style={{
        background: "var(--color-text-primary)",
        color: "#fff",
        borderRadius: "var(--radius-full)",
      }}
    >
      🎨 Criar garrafa personalizada em 3D
    </div>
  )
}
