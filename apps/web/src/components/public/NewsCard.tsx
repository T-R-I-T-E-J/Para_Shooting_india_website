import Link from 'next/link'

const CATEGORY_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  NEWS:         { bg: '#EFF6FF', text: '#003DA5', border: '#BFDBFE' },
  ANNOUNCEMENT: { bg: '#FFF7ED', text: '#C2410C', border: '#FED7AA' },
  RESULT:       { bg: '#F0FDF4', text: '#15803D', border: '#BBF7D0' },
  EVENT:        { bg: '#FEFCE8', text: '#92400E', border: '#FDE68A' },
  ACHIEVEMENT:  { bg: '#F5F3FF', text: '#6D28D9', border: '#DDD6FE' },
  PRESS_RELEASE:{ bg: '#FEF2F2', text: '#B91C1C', border: '#FECACA' },
}

const DEFAULT_CATEGORY = { bg: '#F8FAFC', text: '#003DA5', border: '#BFDBFE' }

export default function NewsCard({
  category,
  date,
  title,
  snippet,
  imageGradientFrom,
  imageGradientTo,
  featuredImage,
  slug,
}: {
  category: string
  date: string
  title: string
  snippet: string
  imageGradientFrom: string
  imageGradientTo: string
  featuredImage?: string
  slug: string
}) {
  const catStyle = CATEGORY_COLORS[category] ?? DEFAULT_CATEGORY

  return (
    <Link
      href={`/news/${slug}`}
      className="group flex flex-col h-full bg-white rounded-none overflow-hidden border border-neutral-200 hover:border-neutral-300 hover:shadow-lg transition-all duration-300 cursor-pointer"
    >
      {/* Thumbnail */}
      <div className="w-full h-[220px] relative overflow-hidden flex-shrink-0">
        {featuredImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={featuredImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div
            className="w-full h-full group-hover:scale-105 transition-transform duration-500"
            style={{ background: `linear-gradient(135deg, ${imageGradientFrom}, ${imageGradientTo})` }}
          >
            {/* Pattern overlay */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.1) 10px, rgba(255,255,255,0.1) 11px)`,
              }}
            />
          </div>
        )}
        {/* Dark overlay on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        {/* Category badge on image */}
        <div className="absolute top-4 left-4">
          <span
            className="px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-[0.2em]"
            style={{ backgroundColor: catStyle.bg, color: catStyle.text, border: `1px solid ${catStyle.border}` }}
          >
            {category.replace('_', ' ')}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="p-6 flex flex-col flex-1">
        {/* Date */}
        <div className="flex items-center gap-1.5 text-[11px] text-neutral-400 font-medium mb-3">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
          </svg>
          {date}
        </div>

        {/* Title */}
        <h3 className="font-heading text-[1.05rem] font-bold text-neutral-900 leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Snippet */}
        <p className="text-[13px] text-neutral-500 leading-relaxed flex-1 line-clamp-3 mb-5">
          {snippet}
        </p>

        {/* Footer CTA */}
        <div className="mt-auto flex items-center justify-between pt-4 border-t border-neutral-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-primary group-hover:text-primary-light transition-colors">
            Read Article
          </span>
          <div className="w-8 h-8 flex items-center justify-center border border-neutral-200 text-neutral-400 group-hover:border-primary group-hover:text-primary group-hover:bg-primary/5 transition-all duration-200">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </div>
        </div>
      </div>
    </Link>
  )
}
