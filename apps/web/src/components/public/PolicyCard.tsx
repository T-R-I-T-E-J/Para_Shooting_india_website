export default function PolicyCard({
  category,
  title,
  description,
  date,
  fileSize,
  fileUrl,
  colorScheme
}: {
  category: string
  title: string
  description: string
  date: string
  fileSize: string
  fileUrl: string
  colorScheme: 'navy' | 'danger' | 'green' | 'gold'
}) {
  const schemeIcons = {
    navy: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-navy, #003DA5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10,9 9,9 8,9"/></svg>
    ),
    danger: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-danger, #DC2626)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>
    ),
    green: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-green, #046A38)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>
    ),
    gold: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--color-gold, #C8A415)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
    )
  }

  const bgStyles = {
    navy: 'bg-[#003DA5]/10',
    danger: 'bg-red-600/10',
    green: 'bg-[#046A38]/10',
    gold: 'bg-[#C8A415]/10'
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl flex flex-col h-full hover:shadow-lg transition-shadow">
      <div className="p-5 flex items-start gap-4 border-b border-neutral-100">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${bgStyles[colorScheme]}`}>
          {schemeIcons[colorScheme]}
        </div>
        <div>
          <div className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 mb-1">{category}</div>
          <h3 className="font-heading text-lg font-bold text-navy leading-tight">{title}</h3>
        </div>
      </div>
      <div className="p-5 grow flex flex-col justify-between gap-4">
        <p className="text-sm text-neutral-500 leading-relaxed">
          {description}
        </p>
        <div className="flex items-center justify-between text-[11px] font-semibold text-neutral-400">
          <span className="flex items-center gap-1.5">
             <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
             {date}
          </span>
          <span>PDF &middot; {fileSize}</span>
        </div>
      </div>
      <div className="p-4 bg-neutral-50 border-t border-neutral-100 rounded-b-2xl flex gap-3">
        <a href={fileUrl} target="_blank" rel="noopener noreferrer" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white border border-neutral-200 rounded-lg text-[11px] font-bold text-navy hover:bg-neutral-100 transition-colors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
          View
        </a>
        <a href={fileUrl} download className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-navy text-white rounded-lg text-[11px] font-bold hover:bg-navy-deep transition-colors">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7,10 12,15 17,10"/></svg>
          Download
        </a>
      </div>
    </div>
  )
}
