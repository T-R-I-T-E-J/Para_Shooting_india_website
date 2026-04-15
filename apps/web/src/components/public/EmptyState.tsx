export default function EmptyState({ message, iconName = "calendar" }: { message: string, iconName?: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 bg-white border border-neutral-200 border-dashed rounded-2xl text-center">
      <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center text-neutral-400 mb-4">
        {iconName === 'calendar' ? (
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
        ) : (
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
        )}
      </div>
      <h3 className="font-heading text-xl font-bold text-navy mb-2">Nothing found</h3>
      <p className="text-sm text-neutral-500 max-w-sm">{message}</p>
    </div>
  )
}
