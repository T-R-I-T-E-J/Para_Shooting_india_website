export default function ResultCard({
  championship,
  date,
  location,
  matchCount,
  fileUrl
}: {
  championship: string
  date: string
  location: string
  matchCount: number
  fileUrl: string
}) {
  return (
    <div className="p-5 bg-white border border-neutral-200 rounded-2xl flex flex-col md:flex-row md:items-center gap-5 hover:shadow-md transition-shadow">
      <div className="flex-1">
        <h3 className="font-heading text-lg font-bold text-navy mb-2">{championship}</h3>
        <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-semibold text-neutral-500 uppercase tracking-wide">
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            {date}
          </span>
          <span className="flex items-center gap-1.5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
            {location}
          </span>
        </div>
      </div>
      
      <div className="flex items-center gap-4 shrink-0">
        <div className="hidden sm:flex flex-col items-end">
          <span className="font-mono text-lg font-bold text-navy leading-none">{matchCount}</span>
          <span className="text-[9px] font-bold uppercase tracking-widest text-neutral-400">Events</span>
        </div>
        <div className="w-px h-10 bg-neutral-200 hidden sm:block"></div>
        <a href={fileUrl} download className="flex items-center gap-2 px-6 py-3 bg-navy text-white rounded-lg text-xs font-bold hover:bg-navy-deep active:scale-95 transition-all w-full md:w-auto justify-center">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
          Results Book
        </a>
      </div>
    </div>
  )
}
