export default function AwardsLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="h-64 bg-navy/80" />

      <section className="py-16 px-6 bg-neutral-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Section heading */}
          <div className="mb-8 pb-4 border-b border-neutral-200">
            <div className="h-8 bg-neutral-200 rounded w-64" />
          </div>
          {/* Athlete card grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
                <div className="h-48 bg-neutral-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-3 bg-neutral-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
          {/* Second section heading */}
          <div className="mb-8 pb-4 border-b border-neutral-200">
            <div className="h-8 bg-neutral-200 rounded w-48" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-neutral-200">
                <div className="h-48 bg-neutral-200" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-neutral-200 rounded w-3/4" />
                  <div className="h-3 bg-neutral-200 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
