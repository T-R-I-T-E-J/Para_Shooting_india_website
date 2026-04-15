export default function SectionHeader({
  eyebrow,
  titlePart1,
  titlePart2Em,
  viewAllLink
}: {
  eyebrow: string
  titlePart1: string
  titlePart2Em?: string
  viewAllLink?: string
}) {
  return (
    <div className="flex items-end justify-between mb-10 flex-wrap gap-4">
      <div>
        <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-orange mb-1.5">{eyebrow}</div>
        <div className="font-heading text-2xl md:text-[34px] font-bold text-navy leading-tight">
          {titlePart1} {titlePart2Em && <em className="italic text-gold">{titlePart2Em}</em>}
        </div>
      </div>
      {viewAllLink && (
        <a href={viewAllLink} className="inline-flex items-center gap-1.5 text-navy text-[13px] font-bold hover:gap-2.5 transition-all">
          View All
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </a>
      )}
    </div>
  )
}
