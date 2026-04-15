import Link from 'next/link'
import { DUMMY_DOCUMENTS, DOC_CATEGORY_META, DEFAULT_DOC_META } from '@/data/documents-dummy'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ClassificationDoc {
  id: string
  title: string
  description?: string
  category: string
  fileType?: string
  size?: string
  href: string
  updatedAt?: string
  isActive: boolean
}

const CLASSIFICATION_CATEGORIES = [
  'classification',
  'medical_classification',
  'ipc_license',
  'national_classification',
] as const

type CategoryKey = (typeof CLASSIFICATION_CATEGORIES)[number]

const FILTER_TABS = [
  { key: '', label: 'All Documents' },
  { key: 'classification', label: 'Classification' },
  { key: 'medical_classification', label: 'Medical' },
  { key: 'ipc_license', label: 'IPC License' },
  { key: 'national_classification', label: 'National' },
]

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function getAllClassificationDocs(): Promise<ClassificationDoc[]> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') ||
      'http://localhost:4000'
    const res = await fetch(`${apiUrl}/api/v1/downloads`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) throw new Error('API unavailable')
    const json = await res.json()
    const items: ClassificationDoc[] = json?.data ?? json ?? []
    const filtered = items.filter(
      (d) => d.isActive && CLASSIFICATION_CATEGORIES.includes(d.category as CategoryKey),
    )
    return filtered
  } catch {
    return []
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = {
  title: 'Classification Documents — Para Shooting India',
  description:
    'Browse and download official classification rules, medical forms, and IPC licence documents for Para Shooting India.',
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ClassificationDocumentsPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const sq = ((searchParams.q as string) || '').toLowerCase().trim()
  const activeCat = (searchParams.cat as string) || ''
  const sortOrder = (searchParams.sort as string) || 'newest'

  const allDocs = await getAllClassificationDocs()

  let docs = allDocs
  if (activeCat) docs = docs.filter((d) => d.category === activeCat)
  if (sq)
    docs = docs.filter(
      (d) =>
        d.title.toLowerCase().includes(sq) ||
        (d.description || '').toLowerCase().includes(sq) ||
        d.category.toLowerCase().includes(sq),
    )

  docs = [...docs].sort((a, b) => {
    if (sortOrder === 'az') return a.title.localeCompare(b.title)
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
    return dateB - dateA
  })

  const totalAll = allDocs.length
  const totalFiltered = docs.length

  function buildUrl(overrides: Record<string, string>) {
    const params = new URLSearchParams()
    if (sq) params.set('q', sq)
    if (activeCat) params.set('cat', activeCat)
    if (sortOrder && sortOrder !== 'newest') params.set('sort', sortOrder)
    Object.entries(overrides).forEach(([k, v]) => {
      if (v) params.set(k, v)
      else params.delete(k)
    })
    const str = params.toString()
    return `/classification/documents${str ? `?${str}` : ''}`
  }

  return (
    <div className="bg-white min-h-screen">

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-16 px-6 overflow-hidden bg-primary">
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <span className="absolute -top-8 right-[-5%] font-heading text-[22vw] font-bold text-white/[0.04] leading-none tracking-tighter">
            DOCS
          </span>
        </div>
        <div className="max-w-7xl mx-auto relative">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-[11px] font-bold tracking-[0.15em] uppercase text-white/40 mb-6">
            <Link href="/classification" className="hover:text-[#C8A415] transition-colors">
              Classification
            </Link>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
            <span className="text-white/60">Documents</span>
          </nav>

          <p className="text-[#C8A415] font-body text-[11px] font-bold tracking-[0.35em] uppercase mb-4">
            Document Library
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="font-heading text-5xl md:text-6xl font-bold text-white leading-[1.05]">
              Classification<br />
              <em className="text-[#C8A415] not-italic">Documents</em>
            </h1>
            <div className="flex items-center gap-3 pb-2">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C8A415] animate-pulse" />
              <span className="text-white/50 text-[13px]">
                <span className="text-white font-semibold">{totalAll}</span> documents available
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Filter toolbar ────────────────────────────────────────────── */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-neutral-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row gap-4">

          {/* Search */}
          <form method="GET" action="/classification/documents" className="relative flex-1 max-w-md">
            {activeCat && <input type="hidden" name="cat" value={activeCat} />}
            {sortOrder !== 'newest' && <input type="hidden" name="sort" value={sortOrder} />}
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-neutral-400 pointer-events-none" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              name="q"
              defaultValue={sq}
              placeholder="Search documents..."
              className="w-full bg-neutral-50 border border-neutral-300 text-neutral-900 placeholder-neutral-400 pl-9 pr-4 py-2.5 text-[13px] focus:outline-none focus:border-primary/50 focus:bg-white transition-colors"
            />
            {sq && (
              <Link
                href={buildUrl({ q: '' })}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
                title="Clear search"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M18 6L6 18M6 6l12 12"/>
                </svg>
              </Link>
            )}
          </form>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-400 text-[10px] font-bold tracking-[0.2em] uppercase hidden sm:block">Sort</span>
            <Link
              href={buildUrl({ sort: 'newest' })}
              className={`text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-2 border transition-colors cursor-pointer ${
                sortOrder !== 'az'
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-neutral-200 text-neutral-400 hover:text-neutral-600 hover:border-neutral-300'
              }`}
            >
              Newest
            </Link>
            <Link
              href={buildUrl({ sort: 'az' })}
              className={`text-[10px] font-bold tracking-[0.15em] uppercase px-3 py-2 border transition-colors cursor-pointer ${
                sortOrder === 'az'
                  ? 'border-primary text-primary bg-primary/5'
                  : 'border-neutral-200 text-neutral-400 hover:text-neutral-600 hover:border-neutral-300'
              }`}
            >
              A – Z
            </Link>
          </div>
        </div>

        {/* Category pills */}
        <div className="max-w-7xl mx-auto px-6 pb-4 flex items-center gap-2 overflow-x-auto no-scrollbar">
          {FILTER_TABS.map((tab) => {
            const isActive = activeCat === tab.key
            const count = tab.key
              ? allDocs.filter((d) => d.category === tab.key).length
              : allDocs.length
            return (
              <Link
                key={tab.key}
                href={buildUrl({ cat: tab.key })}
                className={`inline-flex items-center gap-2 px-4 py-1.5 text-[11px] font-bold tracking-[0.15em] uppercase whitespace-nowrap border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-primary border-primary text-white'
                    : 'border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-700 bg-white'
                }`}
              >
                {tab.label}
                <span
                  className={`text-[9px] font-extrabold px-1.5 py-0.5 leading-none ${
                    isActive ? 'bg-white/20 text-white' : 'bg-neutral-100 text-neutral-400'
                  }`}
                >
                  {count}
                </span>
              </Link>
            )
          })}
        </div>
      </div>

      {/* ── Document list ─────────────────────────────────────────────── */}
      <section className="px-6 py-10 pb-24">
        <div className="max-w-7xl mx-auto">

          {/* Results summary */}
          <div className="flex items-center justify-between mb-4">
            <p className="text-neutral-500 text-[12px]">
              {sq || activeCat ? (
                <>
                  <span className="text-neutral-800 font-semibold">{totalFiltered}</span>{' '}
                  {totalFiltered === 1 ? 'result' : 'results'}
                  {sq && <> for &ldquo;<span className="text-primary">{sq}</span>&rdquo;</>}
                  {activeCat && (
                    <> in <span className="text-neutral-700">{DOC_CATEGORY_META[activeCat]?.label ?? activeCat}</span></>
                  )}
                </>
              ) : (
                <>
                  <span className="text-neutral-800 font-semibold">{totalFiltered}</span> documents
                </>
              )}
            </p>
            {(sq || activeCat) && (
              <Link
                href="/classification/documents"
                className="text-[11px] font-bold tracking-wider uppercase text-neutral-400 hover:text-primary transition-colors"
              >
                Clear filters
              </Link>
            )}
          </div>

          {/* List */}
          {docs.length > 0 ? (
            <div className="border border-neutral-200 divide-y divide-neutral-100">
              {docs.map((d) => {
                const meta = DOC_CATEGORY_META[d.category] ?? DEFAULT_DOC_META
                return (
                  <div
                    key={d.id}
                    className="group flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-neutral-50 transition-colors duration-150"
                  >
                    {/* Left: category + title */}
                    <div className="flex-1 min-w-0">
                      <span
                        className="inline-block text-[9px] font-extrabold tracking-[0.22em] uppercase px-2 py-0.5 mb-2 leading-none"
                        style={{ color: meta.color, backgroundColor: `${meta.color}12`, border: `1px solid ${meta.color}25` }}
                      >
                        {meta.label}
                      </span>
                      <h2 className="font-heading text-[15px] font-bold text-neutral-900 leading-snug group-hover:text-primary transition-colors duration-150 truncate">
                        {d.title}
                      </h2>
                      {d.description && (
                        <p className="text-neutral-500 text-[12px] mt-0.5 line-clamp-1">{d.description}</p>
                      )}
                    </div>

                    {/* Right: meta + download */}
                    <div className="flex items-center gap-5 flex-shrink-0">
                      {d.updatedAt && (
                        <span className="text-neutral-400 text-[12px] tabular-nums hidden md:block">
                          {formatDate(d.updatedAt)}
                        </span>
                      )}
                      {d.size && (
                        <span className="text-neutral-400 text-[11px] font-mono hidden sm:block">
                          {d.size}
                        </span>
                      )}
                      {d.fileType && (
                        <span className="text-[9px] font-bold tracking-[0.15em] uppercase px-1.5 py-0.5 bg-neutral-100 text-neutral-500 border border-neutral-200 hidden sm:inline-block">
                          {d.fileType}
                        </span>
                      )}
                      {d.href && d.href !== '#' ? (
                        <a
                          href={d.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-[10px] font-extrabold tracking-widest uppercase px-4 py-2 border border-primary text-primary hover:bg-primary hover:text-white transition-all duration-200 cursor-pointer flex-shrink-0"
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                          </svg>
                          Download
                        </a>
                      ) : (
                        <span className="text-neutral-300 text-[10px] tracking-wider uppercase px-4 py-2 border border-neutral-200 flex-shrink-0">
                          Unavailable
                        </span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-24 flex flex-col items-center justify-center text-center border border-neutral-200 bg-neutral-50">
              <svg className="w-10 h-10 text-neutral-300 mb-4" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <p className="font-heading text-lg font-bold text-neutral-600 mb-1">No documents found</p>
              {sq ? (
                <p className="text-neutral-400 text-sm mb-6">
                  No documents matched &ldquo;<span className="text-neutral-600">{sq}</span>&rdquo;
                  {activeCat && <> in {DOC_CATEGORY_META[activeCat]?.label ?? activeCat}</>}.
                </p>
              ) : (
                <p className="text-neutral-400 text-sm mb-6">
                  No {activeCat ? DOC_CATEGORY_META[activeCat]?.label : ''} documents are available yet.
                </p>
              )}
              <Link
                href="/classification/documents"
                className="text-[11px] font-bold tracking-widest uppercase text-primary border border-primary/30 px-5 py-2.5 hover:bg-primary/5 transition-colors"
              >
                Clear filters
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#C8A415] text-[11px] font-bold tracking-[0.35em] uppercase mb-4">Need Help?</p>
          <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-4">Questions about documents?</h2>
          <p className="text-neutral-500 text-sm mb-8">
            Contact our classification officer for guidance on forms, eligibility, and submission requirements.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="inline-block bg-primary text-white font-body font-extrabold text-[13px] tracking-widest uppercase px-8 py-3.5 hover:bg-primary/90 transition-colors"
            >
              Contact Officer
            </Link>
            <Link
              href="/classification"
              className="inline-flex items-center gap-2 text-neutral-500 text-[12px] font-bold tracking-widest uppercase hover:text-neutral-800 transition-colors"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M19 12H5M12 19l-7-7 7-7"/>
              </svg>
              Back to Classification
            </Link>
          </div>
        </div>
      </section>

    </div>
  )
}
