import Link from 'next/link'

export default function MediaCard({
  type,
  title,
  date,
  thumbnailFrom,
  thumbnailTo,
  videoDuration
}: {
  type: 'gallery' | 'video'
  title: string
  date: string
  thumbnailFrom: string
  thumbnailTo: string
  videoDuration?: string
}) {
  return (
    <Link href="#" aria-label={title} className="group block cursor-pointer">
      <div 
        className="w-full aspect-video rounded-2xl overflow-hidden relative mb-4 shadow-sm"
        style={{ background: `linear-gradient(135deg, ${thumbnailFrom}, ${thumbnailTo})` }}
      >
        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
        
        {/* Play Button Overlay for Video */}
        {type === 'video' && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div aria-hidden="true" className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm border border-white/40 flex items-center justify-center text-white group-hover:bg-gold group-hover:border-gold group-hover:text-navy-deep transition-all duration-300 group-hover:scale-110">
               <svg aria-label="Play video" className="ml-1" width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="none"><polygon points="5 3 19 12 5 21 5 3"/></svg>
             </div>
          </div>
        )}
        
        {/* Bottom Bar */}
        <div className="absolute bottom-3 right-3 flex gap-2">
          {type === 'gallery' && (
            <span className="px-2.5 py-1 bg-black/50 backdrop-blur-md rounded border border-white/20 text-white text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
              Gallery
            </span>
          )}
          {type === 'video' && videoDuration && (
            <span className="px-2.5 py-1 bg-black/50 backdrop-blur-md rounded border border-white/20 text-white font-mono text-[10px] font-bold">
              {videoDuration}
            </span>
          )}
        </div>
      </div>
      <div>
        <div className="text-[11px] font-semibold text-neutral-400 mb-1.5">{date}</div>
        <h4 className="font-bold text-navy leading-tight group-hover:text-gold transition-colors line-clamp-2">
          {title}
        </h4>
      </div>
    </Link>
  )
}
