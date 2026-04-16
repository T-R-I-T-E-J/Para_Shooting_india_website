import Link from 'next/link'

export default function MediaLoading() {
  return (
    <div className="min-h-screen bg-[#F7F8FA]">
      {/* ── Page Header ─────────────────────────────────────────── */}
      <section className="bg-[#001A4D] pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-4 w-32 bg-white/20 rounded animate-pulse mb-3" />
          <div className="h-12 md:h-14 w-64 bg-white/20 rounded animate-pulse mb-4" />
          <div className="h-4 w-full max-w-2xl bg-white/20 rounded animate-pulse" />
          <div className="h-4 w-3/4 max-w-lg bg-white/20 rounded animate-pulse mt-2" />

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 mt-8 text-[11px] text-white/40">
            <Link href="/" className="hover:text-white/70 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-white/70">Media &amp; Gallery</span>
          </div>
        </div>
      </section>

      {/* ── Divider accent ────────────────────────────────────────── */}
      <div className="h-1 bg-gradient-to-r from-[#001A4D] via-[#C8A415] to-[#001A4D]" />

      {/* ── Collections Grid Skeleton ─────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-10">
            <div>
              <div className="h-8 w-48 bg-neutral-200 rounded animate-pulse mb-2" />
              <div className="h-4 w-32 bg-neutral-200 rounded animate-pulse" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <article
                key={i}
                className="bg-white border border-neutral-200 flex flex-col"
              >
                {/* Thumbnail Skeleton */}
                <div className="h-52 bg-neutral-200 animate-pulse" />

                {/* Content Skeleton */}
                <div className="flex flex-col flex-1 p-5">
                  <div className="h-3 w-24 bg-neutral-200 rounded animate-pulse mb-3" />
                  <div className="h-5 w-full bg-neutral-200 rounded animate-pulse mb-2" />
                  <div className="h-5 w-3/4 bg-neutral-200 rounded animate-pulse mb-4" />
                  
                  <div className="space-y-2 mb-6">
                    <div className="h-3 w-full bg-neutral-200 rounded animate-pulse" />
                    <div className="h-3 w-full bg-neutral-200 rounded animate-pulse" />
                    <div className="h-3 w-2/3 bg-neutral-200 rounded animate-pulse" />
                  </div>

                  <div className="mt-auto h-10 w-32 bg-neutral-200 rounded animate-pulse" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
