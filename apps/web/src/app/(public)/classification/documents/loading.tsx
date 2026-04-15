export default function ClassificationDocumentsLoading() {
  return (
    <div className="bg-[#000D26] min-h-screen animate-pulse">

      {/* Hero skeleton */}
      <section className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="h-3 w-32 bg-white/[0.06] mb-6" />
          <div className="h-3 w-24 bg-white/[0.04] mb-4" />
          <div className="h-12 w-80 bg-white/[0.07] mb-2" />
          <div className="h-12 w-56 bg-white/[0.04]" />
        </div>
      </section>

      {/* Toolbar skeleton */}
      <div className="border-b border-white/[0.06] px-6 py-4">
        <div className="max-w-7xl mx-auto flex gap-4">
          <div className="h-10 flex-1 max-w-md bg-white/[0.05] border border-white/[0.08]" />
          <div className="h-10 w-20 bg-white/[0.04] border border-white/[0.06]" />
          <div className="h-10 w-16 bg-white/[0.04] border border-white/[0.06]" />
        </div>
        <div className="max-w-7xl mx-auto flex gap-2 mt-4">
          {[90, 110, 80, 100, 90].map((w, i) => (
            <div key={i} className={`h-7 bg-white/[0.05] border border-white/[0.06]`} style={{ width: w }} />
          ))}
        </div>
      </div>

      {/* Grid skeleton */}
      <section className="px-6 py-12">
        <div className="max-w-7xl mx-auto">
          <div className="h-3 w-28 bg-white/[0.04] mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <div
                key={i}
                className="bg-white/[0.03] border border-white/[0.07] p-6 flex flex-col gap-4"
                style={{ borderTopWidth: '2px', borderTopColor: 'rgba(255,255,255,0.06)' }}
              >
                <div className="flex items-start justify-between">
                  <div className="w-10 h-10 bg-white/[0.06]" />
                  <div className="w-12 h-5 bg-white/[0.04]" />
                </div>
                <div className="w-20 h-4 bg-white/[0.05]" />
                <div className="space-y-2">
                  <div className="h-4 bg-white/[0.07] w-full" />
                  <div className="h-4 bg-white/[0.05] w-4/5" />
                  <div className="h-3 bg-white/[0.04] w-3/5 mt-1" />
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-white/[0.06]">
                  <div className="h-3 w-20 bg-white/[0.04]" />
                  <div className="h-7 w-24 bg-white/[0.05] border border-white/[0.07]" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
