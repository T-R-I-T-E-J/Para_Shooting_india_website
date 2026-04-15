export default function ContactLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="h-64 bg-navy/80" />

      <section className="py-20 px-6 bg-neutral-100 min-h-screen">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Contact info col */}
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-3">
                <div className="h-8 bg-neutral-200 rounded w-48" />
                <div className="h-4 bg-neutral-200 rounded w-full" />
                <div className="h-4 bg-neutral-200 rounded w-4/5" />
              </div>
              <div className="bg-white p-6 rounded-2xl border border-neutral-200 space-y-5">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-neutral-200 rounded-full shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="h-3 bg-neutral-200 rounded w-1/3" />
                      <div className="h-4 bg-neutral-200 rounded w-2/3" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Form col */}
            <div className="lg:col-span-3 bg-white p-8 rounded-2xl border border-neutral-200 space-y-5">
              <div className="h-6 bg-neutral-200 rounded w-40" />
              <div className="grid grid-cols-2 gap-4">
                <div className="h-12 bg-neutral-200 rounded-xl" />
                <div className="h-12 bg-neutral-200 rounded-xl" />
              </div>
              <div className="h-12 bg-neutral-200 rounded-xl" />
              <div className="h-12 bg-neutral-200 rounded-xl" />
              <div className="h-36 bg-neutral-200 rounded-xl" />
              <div className="h-12 bg-navy/20 rounded-xl" />
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
