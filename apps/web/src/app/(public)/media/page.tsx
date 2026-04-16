import Link from 'next/link'
import Image from 'next/image'

interface MediaCollection {
  id: number
  title: string
  short_description?: string
  featured_image?: string
  event_date?: string
  created_at: string
  images: { id: number; image_url: string }[]
}

async function getCollections(): Promise<MediaCollection[]> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') ||
      'http://localhost:4000'
    const res = await fetch(`${apiUrl}/api/v1/media-collections`, {
      cache: 'no-store',
    })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : data.data || []
  } catch {
    return []
  }
}

function formatDate(dateStr?: string | null): string {
  if (!dateStr) return ''
  try {
    return new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

export default async function MediaPage() {
  const collections = await getCollections()

  return (
    <div className="min-h-screen bg-[#F7F8FA]">

      {/* ── Page Header ─────────────────────────────────────────── */}
      <section className="bg-[#001A4D] pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-[#C8A415] text-[11px] font-bold tracking-[0.35em] uppercase mb-3">
            STC Para Shooting
          </p>
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            Media &amp; Gallery
          </h1>
          <p className="text-white/60 text-base max-w-2xl leading-relaxed">
            Photography and visual records from national championships, training camps, classification events, and official ceremonies of Para Shooting India.
          </p>

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

      {/* ── Collections Grid ─────────────────────────────────────── */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">

          {collections.length === 0 ? (
            <div className="text-center py-24 border border-neutral-200 bg-white">
              <div className="w-16 h-16 mx-auto mb-4 border-2 border-dashed border-neutral-300 flex items-center justify-center">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="1.5" strokeLinecap="round"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              </div>
              <p className="text-neutral-500 text-sm font-semibold">No media collections available yet.</p>
              <p className="text-neutral-400 text-xs mt-1">Check back after events are uploaded by the admin.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h2 className="font-heading text-2xl font-black text-[#001A4D]">Photo Collections</h2>
                  <p className="text-neutral-500 text-sm mt-1">{collections.length} collection{collections.length !== 1 ? 's' : ''} available</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {collections.map((col) => (
                  <article
                    key={col.id}
                    className="bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all duration-200 group flex flex-col"
                  >
                    {/* Thumbnail */}
                    <div className="relative h-52 overflow-hidden bg-[#001A4D]/10">
                      {col.featured_image ? (
                        <img
                          src={col.featured_image}
                          alt={col.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#001A4D] to-[#003DA5]">
                          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        </div>
                      )}
                      {/* Image count badge */}
                      {col.images?.length > 0 && (
                        <div className="absolute top-3 right-3 bg-black/60 text-white text-[10px] font-bold px-2 py-1 flex items-center gap-1">
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          {col.images.length}
                        </div>
                      )}
                      {/* Gold accent bar on hover */}
                      <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-[#C8A415] scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-5">
                      {col.event_date && (
                        <p className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#C8A415] mb-2">
                          {formatDate(col.event_date)}
                        </p>
                      )}
                      <h3 className="font-heading text-base font-black text-[#001A4D] leading-snug mb-2 group-hover:text-[#003DA5] transition-colors">
                        {col.title}
                      </h3>
                      {col.short_description && (
                        <p className="text-neutral-500 text-[13px] leading-relaxed mb-4 flex-1 line-clamp-3">
                          {col.short_description}
                        </p>
                      )}

                      <Link
                        href={`/media/${col.id}`}
                        className="mt-auto inline-flex items-center gap-2 px-5 py-3 bg-[#001A4D] text-white text-[11px] font-bold tracking-[0.15em] uppercase hover:bg-[#003DA5] transition-colors self-start"
                      >
                        View Gallery
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>

    </div>
  )
}
