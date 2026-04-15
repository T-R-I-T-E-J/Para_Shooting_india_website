export default function Loading() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-6 w-full">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-neutral-100"></div>
        <div className="absolute inset-0 rounded-full border-2 border-gold border-t-transparent animate-spin"></div>
        <div className="w-4 h-4 bg-navy rounded-full animate-pulse"></div>
      </div>
      <div className="mt-6 text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400">Loading Content</div>
    </div>
  )
}
