export default function AboutLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="h-64 bg-navy/80" />

      <section className="py-20 px-6 bg-white">
        <div className="max-w-4xl mx-auto flex flex-col gap-16">
          {/* Text + image block */}
          <div className="flex flex-col md:flex-row gap-10 items-start">
            <div className="flex-1 space-y-4">
              <div className="h-4 bg-neutral-200 rounded w-full" />
              <div className="h-4 bg-neutral-200 rounded w-5/6" />
              <div className="h-4 bg-neutral-200 rounded w-4/6" />
              <div className="h-4 bg-neutral-200 rounded w-full" />
              <div className="h-4 bg-neutral-200 rounded w-3/4" />
            </div>
            <div className="w-full md:w-1/3 aspect-square bg-neutral-200 rounded-2xl" />
          </div>

          {/* Mission / Vision / Reach cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-neutral-50 p-6 rounded-2xl border border-neutral-200 space-y-4">
                <div className="w-12 h-12 bg-neutral-200 rounded-xl" />
                <div className="h-5 bg-neutral-200 rounded w-3/4" />
                <div className="space-y-2">
                  <div className="h-3 bg-neutral-200 rounded w-full" />
                  <div className="h-3 bg-neutral-200 rounded w-5/6" />
                  <div className="h-3 bg-neutral-200 rounded w-4/6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
