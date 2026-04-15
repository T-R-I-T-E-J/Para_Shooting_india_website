export default function MediaLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="h-64 bg-navy/80" />

      <section className="py-16 px-6 bg-neutral-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Filter pills */}
          <div className="flex gap-2 mb-8">
            {[96, 64, 120, 80].map((w, i) => (
              <div key={i} style={{ width: w }} className="h-9 rounded-full bg-neutral-200" />
            ))}
          </div>
          {/* Media card grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
                <div className="aspect-video bg-neutral-200" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-neutral-200 rounded w-1/4" />
                  <div className="h-4 bg-neutral-200 rounded w-full" />
                  <div className="h-3 bg-neutral-200 rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
