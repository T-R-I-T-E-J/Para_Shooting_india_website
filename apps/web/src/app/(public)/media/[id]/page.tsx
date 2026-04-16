import Link from 'next/link'
import { notFound } from 'next/navigation'
import ImageLightbox from '@/components/public/ImageLightbox'

interface CollectionImage {
  id: number
  image_url: string
  caption?: string
  uploaded_at: string
}

interface MediaCollection {
  id: number
  title: string
  short_description?: string
  full_description?: string
  featured_image?: string
  event_date?: string
  created_at: string
  images: CollectionImage[]
}

async function getCollection(id: string): Promise<MediaCollection | null> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') ||
      'http://localhost:4000'
    const res = await fetch(`${apiUrl}/api/v1/media-collections/${id}`, {
      cache: 'no-store',
    })
    if (res.status === 404) return null
    if (!res.ok) return null
    const json = await res.json()
    return json.data || json
  } catch {
    return null
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

export default async function CollectionDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const collection = await getCollection(params.id)
  if (!collection) notFound()

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
            <span className="text-white/70 truncate max-w-[200px]">{collection.title}</span>
          </div>

          {collection.event_date && (
            <p className="text-[#C8A415] text-[11px] font-bold tracking-[0.35em] uppercase mb-3">
              {formatDate(collection.event_date)}
            </p>
          )}
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white leading-tight mb-4">
            {collection.title}
          </h1>
          {collection.short_description && (
            <p className="text-white/60 text-base max-w-2xl leading-relaxed">
              {collection.short_description}
            </p>
          )}

          {/* Meta */}
          <div className="flex items-center gap-6 mt-8 pt-6 border-t border-white/10">
            <div>
              <span className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase block mb-1">Photos</span>
              <span className="text-white font-heading text-xl font-black">{collection.images?.length ?? 0}</span>
            </div>
            {collection.event_date && (
              <>
                <div className="w-px h-8 bg-white/10" />
                <div>
                  <span className="text-white/30 text-[10px] font-bold tracking-[0.2em] uppercase block mb-1">Event Date</span>
                  <span className="text-white text-sm font-semibold">{formatDate(collection.event_date)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </section>

      {/* ── Gold accent ─────────────────────────────────────────── */}
      <div className="h-1 bg-gradient-to-r from-[#001A4D] via-[#C8A415] to-[#001A4D]" />

      {/* ── Event Description ────────────────────────────────────── */}
      {collection.full_description && (
        <section className="py-12 px-6 bg-white border-b border-neutral-200">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-[10px] font-black tracking-[0.3em] uppercase text-neutral-400 mb-4">
              About This Event
            </h2>
            <div className="max-w-3xl prose prose-neutral text-neutral-600 text-sm leading-relaxed">
              {collection.full_description.split('\n').map((para, i) =>
                para.trim() ? <p key={i}>{para}</p> : null
              )}
            </div>
          </div>
        </section>
      )}

      {/* ── Gallery Grid ─────────────────────────────────────────── */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <h2 className="font-heading text-xl font-black text-[#001A4D]">
              Gallery
            </h2>
            <span className="px-2.5 py-0.5 bg-[#001A4D] text-white text-[10px] font-bold tracking-wider">
              {collection.images?.length ?? 0} PHOTOS
            </span>
          </div>

          {(!collection.images || collection.images.length === 0) ? (
            <div className="text-center py-20 border border-dashed border-neutral-300 bg-white">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="1.5" className="mx-auto mb-3" strokeLinecap="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              <p className="text-neutral-400 text-sm">No photos have been uploaded to this collection yet.</p>
            </div>
          ) : (
            <ImageLightbox images={collection.images} />
          )}
        </div>
      </section>

      {/* ── Back link ────────────────────────────────────────────── */}
      <div className="pb-16 px-6">
        <div className="max-w-7xl mx-auto border-t border-neutral-200 pt-8">
          <Link
            href="/media"
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] uppercase text-neutral-500 hover:text-[#001A4D] transition-colors"
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
            Back to Gallery
          </Link>
        </div>
      </div>

    </div>
  )
}
