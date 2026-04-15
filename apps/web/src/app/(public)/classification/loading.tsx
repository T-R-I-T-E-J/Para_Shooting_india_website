export default function ClassificationLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="h-64 bg-navy/80" />

      <section className="py-16 px-6 bg-neutral-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          {/* Section intro */}
          <div className="mb-12 space-y-3">
            <div className="h-7 bg-neutral-200 rounded w-56" />
            <div className="h-4 bg-neutral-200 rounded w-2/3" />
            <div className="h-4 bg-neutral-200 rounded w-1/2" />
          </div>

          {/* Class cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-neutral-200 space-y-4">
                <div className="w-16 h-8 bg-neutral-200 rounded-full" />
                <div className="h-6 bg-neutral-200 rounded w-1/2" />
                <div className="space-y-2">
                  <div className="h-3 bg-neutral-200 rounded w-full" />
                  <div className="h-3 bg-neutral-200 rounded w-5/6" />
                </div>
              </div>
            ))}
          </div>

          {/* Table skeleton */}
          <div className="bg-white rounded-2xl p-8 border border-neutral-200">
            <div className="h-7 bg-neutral-200 rounded w-60 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex gap-6">
                  <div className="h-4 bg-neutral-200 rounded w-1/4" />
                  <div className="h-4 bg-neutral-200 rounded w-1/3" />
                  <div className="h-4 bg-neutral-200 rounded w-1/4" />
                  <div className="h-8 bg-neutral-200 rounded w-20 ml-auto" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
