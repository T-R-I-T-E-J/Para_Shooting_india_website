import Link from 'next/link'

export default function CollectionLoading() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <section className="bg-[#001A4D] pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mb-6 text-[11px] text-white/40">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/media" className="hover:text-white/70 transition-colors">Media &amp; Gallery</Link>
            <span>/</span>
            <div className="h-3 w-24 bg-white/20 rounded animate-pulse" />
          </div>

          <div className="h-3 w-20 bg-[#C8A415]/70 rounded animate-pulse mb-3" />
          <div className="h-10 md:h-12 w-3/4 max-w-2xl bg-white/20 rounded animate-pulse mb-4" />
          <div className="h-4 w-full max-w-xl bg-white/20 rounded animate-pulse mb-2" />
          <div className="h-4 w-2/3 max-w-md bg-white/20 rounded animate-pulse" />

          {/* Meta */}
          <div className="flex items-center gap-6 mt-8 pt-6 border-t border-white/10">
            <div>
              <span className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase block mb-2">Photos</span>
              <div className="h-6 w-12 bg-white/20 rounded animate-pulse" />
            </div>
            <div className="w-px h-8 bg-white/10" />
            <div>
              <span className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase block mb-2">Event Date</span>
              <div className="h-5 w-28 bg-white/20 rounded animate-pulse" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Gold accent ─────────────────────────────────────────── */}
      <div className="h-1 bg-gradient-to-r from-[#001A4D] via-[#C8A415] to-[#001A4D]" />

      {/* ── Event Description ────────────────────────────────────── */}
      <section className="py-12 px-6 bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto">
          <div className="h-3 w-32 bg-neutral-200 rounded animate-pulse mb-6" />
          <div className="max-w-3xl space-y-3">
            <div className="h-4 w-full bg-neutral-100 rounded animate-pulse" />
            <div className="h-4 w-full bg-neutral-100 rounded animate-pulse" />
            <div className="h-4 w-5/6 bg-neutral-100 rounded animate-pulse" />
            <div className="h-4 w-3/4 bg-neutral-100 rounded animate-pulse mt-4" />
            <div className="h-4 w-full bg-neutral-100 rounded animate-pulse" />
          </div>
        </div>
      </section>

      {/* ── Gallery Grid ─────────────────────────────────────────── */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <div className="h-7 w-24 bg-[#001A4D]/20 rounded animate-pulse" />
            <div className="h-5 w-16 bg-[#001A4D]/20 rounded animate-pulse" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className="aspect-square bg-neutral-200 animate-pulse border border-neutral-300"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
