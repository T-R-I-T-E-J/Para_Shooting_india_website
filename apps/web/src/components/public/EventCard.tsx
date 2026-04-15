export default function EventCard({
  day,
  month,
  title,
  location,
  status
}: {
  day: string
  month: string
  title: string
  location: string
  status: 'upcoming' | 'completed' | 'ongoing'
}) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white border border-neutral-200 rounded-2xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group cursor-pointer">
      <div className="flex flex-col items-center justify-center flex-shrink-0 w-16 h-16 bg-neutral-50 border border-neutral-100 rounded-xl">
        <span className="font-heading text-2xl font-bold tracking-tight text-navy leading-none mb-0.5">{day}</span>
        <span className="font-mono text-[9px] font-bold uppercase tracking-widest text-neutral-500 leading-none">{month}</span>
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm text-navy mb-1 truncate">{title}</h4>
        <div className="flex flex-wrap items-center gap-2 text-xs text-neutral-500">
           <span className="flex items-center gap-1">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
             <span className="truncate">{location}</span>
           </span>
        </div>
      </div>
      
      {/* Badge */}
      <div className="hidden sm:block">
        {status === 'upcoming' && (
          <span className="px-3 py-1 bg-gold/10 text-gold border border-gold/20 rounded-full text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">Upcoming</span>
        )}
        {status === 'completed' && (
          <span className="px-3 py-1 bg-green/10 text-green border border-green/20 rounded-full text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">Completed</span>
        )}
        {status === 'ongoing' && (
          <span className="px-3 py-1 bg-orange/10 text-orange border border-orange/20 rounded-full text-[9px] font-bold uppercase tracking-wider whitespace-nowrap">Ongoing</span>
        )}
      </div>
      
      <div className="text-neutral-300 group-hover:text-gold transition-colors">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
      </div>
    </div>
  )
}
