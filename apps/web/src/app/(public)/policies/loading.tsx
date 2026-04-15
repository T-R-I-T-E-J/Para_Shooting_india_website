export default function PoliciesLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="h-64 bg-navy/80" />

      <section className="py-16 px-6 bg-neutral-100 min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-neutral-200">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-12 h-12 bg-neutral-200 rounded-xl shrink-0" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 bg-neutral-200 rounded w-1/4" />
                    <div className="h-5 bg-neutral-200 rounded w-3/4" />
                  </div>
                </div>
                <div className="space-y-2 mb-6">
                  <div className="h-3 bg-neutral-200 rounded w-full" />
                  <div className="h-3 bg-neutral-200 rounded w-5/6" />
                  <div className="h-3 bg-neutral-200 rounded w-2/3" />
                </div>
                <div className="flex gap-3 pt-4 border-t border-neutral-100">
                  <div className="h-9 bg-neutral-200 rounded-xl flex-1" />
                  <div className="h-9 w-9 bg-neutral-200 rounded-xl" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
