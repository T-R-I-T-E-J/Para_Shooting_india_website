export default function ResultsLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="h-64 bg-navy/80" />

      <section className="py-16 px-6 bg-neutral-100 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Filter pills */}
          <div className="flex gap-2 mb-8">
            {[80, 64, 64, 64, 64].map((w, i) => (
              <div key={i} style={{ width: w }} className="h-9 rounded-full bg-neutral-200" />
            ))}
          </div>
          {/* Result cards */}
          <div className="flex flex-col gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-neutral-200">
                <div className="flex justify-between items-start">
                  <div className="flex-1 space-y-3">
                    <div className="h-3 bg-neutral-200 rounded w-1/4" />
                    <div className="h-5 bg-neutral-200 rounded w-3/4" />
                    <div className="h-3 bg-neutral-200 rounded w-1/2" />
                  </div>
                  <div className="w-28 h-10 bg-neutral-200 rounded-xl ml-6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
