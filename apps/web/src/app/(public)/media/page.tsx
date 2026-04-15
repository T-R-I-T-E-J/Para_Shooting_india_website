import Link from 'next/link'
import MediaCard from '@/components/public/MediaCard'

const dummyMedia = [
  {
    type: 'video' as const,
    title: 'Highlights from the 5th National Para Shooting Championship',
    date: '20 Dec 2025',
    videoDuration: '04:12',
    thumbnailFrom: '#1E293B',
    thumbnailTo: '#0F172A',
  },
  {
    type: 'gallery' as const,
    title: 'International Classification Workshop 2025',
    date: '10 Oct 2025',
    thumbnailFrom: '#C8A415',
    thumbnailTo: '#A5840D',
  },
  {
    type: 'gallery' as const,
    title: 'Asian Para Games — Team India Arrival',
    date: '05 Oct 2025',
    thumbnailFrom: '#046A38',
    thumbnailTo: '#024D28',
  },
  {
    type: 'video' as const,
    title: "Athlete Spotlight: The Journey of Singhraj",
    date: '15 Sep 2025',
    videoDuration: '08:45',
    thumbnailFrom: '#DC2626',
    thumbnailTo: '#991B1B',
  },
  {
    type: 'gallery' as const,
    title: 'National Selectors Committee Meeting',
    date: '01 Aug 2025',
    thumbnailFrom: '#475569',
    thumbnailTo: '#334155',
  },
  {
    type: 'video' as const,
    title: 'Basics of Air Rifle Stances for SH2 Class',
    date: '20 Jul 2025',
    videoDuration: '12:30',
    thumbnailFrom: '#001A4D',
    thumbnailTo: '#003DA5',
  },
]

const categories = ['All Media', 'Videos', 'Image Galleries', 'Interviews']

export default function MediaPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const activeCategory = (searchParams.category as string) || 'All Media'

  let filteredMedia = dummyMedia
  if (activeCategory === 'Videos') {
    filteredMedia = dummyMedia.filter((m) => m.type === 'video')
  } else if (activeCategory === 'Image Galleries') {
    filteredMedia = dummyMedia.filter((m) => m.type === 'gallery')
  }

  const videoCount = dummyMedia.filter((m) => m.type === 'video').length
  const galleryCount = dummyMedia.filter((m) => m.type === 'gallery').length

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-primary">
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <span className="absolute -top-8 right-[-5%] font-heading text-[22vw] font-bold text-white/[0.04] leading-none tracking-tighter">
            MEDIA
          </span>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <p className="text-[#C8A415] font-body text-[11px] font-bold tracking-[0.35em] uppercase mb-4">Coverage &amp; Press</p>
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6">
            Media<br />
            <em className="text-[#C8A415] not-italic">Gallery</em>
          </h1>
          <p className="text-white/70 font-body text-lg max-w-2xl leading-relaxed mb-10">
            Explore our library of highlight videos, interviews, and photo galleries from events across India and the globe.
          </p>

          {/* Stats */}
          <div className="flex items-center gap-8">
            <div>
              <span className="font-heading text-3xl font-bold text-white">{videoCount}</span>
              <p className="text-white/50 text-[11px] font-bold tracking-widest uppercase mt-0.5">Videos</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <span className="font-heading text-3xl font-bold text-white">{galleryCount}</span>
              <p className="text-white/50 text-[11px] font-bold tracking-widest uppercase mt-0.5">Galleries</p>
            </div>
            <div className="w-px h-10 bg-white/20" />
            <div>
              <span className="font-heading text-3xl font-bold text-white">{dummyMedia.length}</span>
              <p className="text-white/50 text-[11px] font-bold tracking-widest uppercase mt-0.5">Total Items</p>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <section className="px-6 py-8 border-b border-neutral-200 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex gap-1 overflow-x-auto pb-1 hide-scrollbar">
            {categories.map((cat) => (
              <Link
                key={cat}
                href={cat === 'All Media' ? '/media' : `/media?category=${encodeURIComponent(cat)}`}
                className={`flex-shrink-0 px-5 py-2.5 text-[11px] font-bold tracking-wider uppercase transition-all duration-200 cursor-pointer ${
                  activeCategory === cat
                    ? 'bg-primary text-white'
                    : 'bg-white text-neutral-500 border border-neutral-200 hover:bg-neutral-100 hover:text-neutral-700'
                }`}
              >
                {cat}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Grid */}
      <section className="px-6 py-12 pb-24">
        <div className="max-w-7xl mx-auto">
          {filteredMedia.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredMedia.map((media) => (
                <div
                  key={media.title}
                  className="group border border-neutral-200 hover:border-neutral-300 hover:shadow-card transition-all duration-300 overflow-hidden cursor-pointer"
                >
                  {/* Thumbnail */}
                  <div
                    className="relative h-48 overflow-hidden"
                    style={{ background: `linear-gradient(135deg, ${media.thumbnailFrom}, ${media.thumbnailTo})` }}
                  >
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />

                    {/* Type badge */}
                    <div className="absolute top-3 left-3">
                      {media.type === 'video' ? (
                        <span className="flex items-center gap-1.5 bg-[#C8A415] text-white text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="currentColor"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                          Video
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 bg-white/20 text-white text-[9px] font-extrabold tracking-widest uppercase px-2.5 py-1 backdrop-blur-sm border border-white/30">
                          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                          Gallery
                        </span>
                      )}
                    </div>

                    {/* Duration for videos */}
                    {media.type === 'video' && 'videoDuration' in media && (
                      <span className="absolute bottom-3 right-3 bg-black/70 text-white text-[11px] font-mono font-bold px-2 py-0.5">
                        {media.videoDuration}
                      </span>
                    )}

                    {/* Play button for videos */}
                    {media.type === 'video' && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-white/20 border border-white/40 flex items-center justify-center group-hover:bg-[#C8A415]/90 group-hover:border-[#C8A415] transition-all duration-300">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="bg-white p-5 border-t border-neutral-100">
                    <h3 className="font-heading text-sm font-bold text-neutral-900 leading-snug mb-2 group-hover:text-primary transition-colors">
                      {media.title}
                    </h3>
                    <p className="text-neutral-400 text-[11px]">{media.date}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-neutral-400 border border-neutral-200 bg-neutral-50">
              No media items available for this category.
            </div>
          )}
        </div>
      </section>

    </div>
  )
}
