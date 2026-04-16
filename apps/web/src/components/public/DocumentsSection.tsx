import Link from 'next/link'
import { DOC_CATEGORY_META, DEFAULT_DOC_META } from '@/data/documents-dummy'

interface DocumentItem {
  id: string
  title: string
  category: string
  fileType?: string
  size?: string
  href: string
  updatedAt?: string
  isActive: boolean
}

async function getLatestDocuments(): Promise<DocumentItem[]> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') ||
      'http://localhost:4000'
    const res = await fetch(`${apiUrl}/api/v1/downloads?limit=6`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error('API unavailable')
    const json = await res.json()
    const items: DocumentItem[] = json?.data ?? json ?? []
    const active = items.filter((d) => d.isActive)
    if (active.length === 0) throw new Error('No data')
    return active
      .sort((a, b) => {
        const da = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
        const db = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
        return db - da
      })
      .slice(0, 6)
  } catch {
    return []
  }
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

export default async function DocumentsSection() {
  const docs = await getLatestDocuments()

  return (
    <section className="py-16 px-6 bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[#C8A415] text-[10px] font-bold tracking-[0.35em] uppercase mb-2">
              Resources
            </p>
            <h2 className="font-heading text-3xl font-bold text-neutral-900">
              Documents & Downloads
            </h2>
          </div>
          <Link
            href="/classification/documents"
            className="hidden sm:inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-primary border border-primary/30 px-4 py-2 hover:bg-primary/5 transition-colors"
          >
            Browse All
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>

        {/* List */}
        <div className="border border-neutral-200 divide-y divide-neutral-100">
          {docs.length === 0 ? (
            <div className="py-12 text-center text-neutral-500 font-body">
              No documents available
            </div>
          ) : (
            docs.map((d) => {
              const meta = DOC_CATEGORY_META[d.category] ?? DEFAULT_DOC_META
              return (
                <div
                  key={d.id}
                  className="group flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-neutral-50 transition-colors duration-150"
                >
                  {/* Left */}
                  <div className="flex-1 min-w-0">
                    <span
                      className="inline-block text-[9px] font-extrabold tracking-[0.22em] uppercase px-2 py-0.5 mb-1.5 leading-none"
                      style={{ color: meta.color, backgroundColor: `${meta.color}12`, border: `1px solid ${meta.color}25` }}
                    >
                      {meta.label}
                    </span>
                    <h3 className="font-heading text-[14px] font-bold text-neutral-900 leading-snug group-hover:text-primary transition-colors duration-150 truncate">
                      {d.title}
                    </h3>
                  </div>

                  {/* Right */}
                  <div className="flex items-center gap-4 flex-shrink-0">
                    {d.updatedAt && (
                      <span className="text-neutral-400 text-[11px] tabular-nums hidden lg:block">
                        {formatDate(d.updatedAt)}
                      </span>
                    )}
                    {d.size && (
                      <span className="text-neutral-400 text-[11px] font-mono hidden sm:block">
                        {d.size}
                      </span>
                    )}
                    {d.fileType && (
                      <span className="text-[9px] font-bold tracking-[0.15em] uppercase px-1.5 py-0.5 bg-neutral-100 text-neutral-500 border border-neutral-200 hidden md:inline-block">
                        {d.fileType}
                      </span>
                    )}
                    {d.href && d.href !== '#' ? (
                      <a
                        href={d.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-widest uppercase px-3 py-1.5 border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer flex-shrink-0"
                      >
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                          <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                        </svg>
                        Download
                      </a>
                    ) : (
                      <span className="text-neutral-300 text-[10px] tracking-wider uppercase px-3 py-1.5 border border-neutral-200 flex-shrink-0">
                        Soon
                      </span>
                    )}
                  </div>
                </div>
              )
            })
          )}
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/classification/documents"
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-primary border border-primary/30 px-5 py-2.5 hover:bg-primary/5 transition-colors"
          >
            Browse All Documents
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
            </svg>
          </Link>
        </div>

      </div>
    </section>
  )
}
