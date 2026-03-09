export default function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-[100dvh] w-full overflow-hidden overscroll-contain">
      {children}
    </div>
  )
}
