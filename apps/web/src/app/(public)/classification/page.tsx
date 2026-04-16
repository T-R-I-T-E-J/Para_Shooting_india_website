import Link from 'next/link'

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

// ---------------------------------------------------------------------------
// Static data
// ---------------------------------------------------------------------------

const CLASSIFICATION_CATEGORIES = [
  'classification',
  'medical_classification',
  'ipc_license',
  'national_classification',
]

const CATEGORY_META: Record<string, { label: string; accent: string; icon: string }> = {
  classification: {
    label: 'Classification',
    accent: '#FF671F',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  medical_classification: {
    label: 'Medical',
    accent: '#DC2626',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  national_classification: {
    label: 'Natl. Class.',
    accent: '#7C3AED',
    icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
  },
  ipc_license: {
    label: 'IPC License',
    accent: '#0891B2',
    icon: 'M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2',
  },
}

const DEFAULT_META = {
  label: 'Document',
  accent: '#C8A415',
  icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
}

const functionalClasses = [
  {
    grade: 'SH1',
    name: 'Pistol & Rifle',
    description:
      'Athletes able to support their firearm without a stand. Typically involves athletes with lower limb impairments — amputations, leg length difference, leg muscle weakness, or impaired range of movement.',
    events: [
      'P1 — 10m Air Pistol',
      'P2 — 10m Air Pistol Women',
      'P3 — 25m Pistol',
      'P4 — 50m Pistol',
      'R1 — 10m Air Rifle',
      'R2 — 10m Air Rifle Women',
    ],
    accent: '#C8A415',
    symbol: 'SH1',
  },
  {
    grade: 'SH2',
    name: 'Rifle Only',
    description:
      'Athletes with upper limb impairments necessitating a shooting stand to support the weight of the rifle. Covers impairments of arm amputees and those with limited arm function.',
    events: [
      'R5 — 10m Air Rifle (Stand)',
      'R6 — 10m Air Rifle Women (Stand)',
      'R7 — 50m Rifle 3 Positions',
      'R8 — 50m Rifle Prone',
      'R9 — 10m Air Rifle (Bench Rest)',
      'R10 — 10m Air Rifle Women (Bench Rest)',
    ],
    accent: '#FF671F',
    symbol: 'SH2',
  },
  {
    grade: 'SH3',
    name: 'Visual Impairment',
    description:
      'A specialized category for athletes with visual impairment who compete using an audio-aiming system attached to standard air rifle equipment. Requires B2/B3 IPC visual classification.',
    events: [
      'V1 — 10m Air Rifle (Vision Impaired)',
      'V2 — 10m Air Rifle Women (VI)',
      'V3 — 50m Rifle 3 Positions (VI)',
      'V4 — 50m Rifle Prone (VI)',
    ],
    accent: '#046A38',
    symbol: 'SH3',
  },
]

const upcomingCamps = [
  {
    date: '15 – 17 May 2026',
    location: 'Dr. Karni Singh Shooting Range, New Delhi',
    type: 'National Medical Classification',
    spots: '24 spots',
  },
  {
    date: '20 – 22 Aug 2026',
    location: 'Pune Balewadi Sports Complex, Maharashtra',
    type: 'Zonal Technical Assessment',
    spots: '30 spots',
  },
]

const steps = [
  {
    num: '01',
    title: 'Submit Medical Evidence',
    body: 'Provide documentation from a licensed physician confirming your eligible impairment type according to IPC minimum disability criteria.',
  },
  {
    num: '02',
    title: 'Attend Classification Camp',
    body: 'A licensed WSPS classifier will assess your impairment in a technical and observational evaluation at an official classification camp.',
  },
  {
    num: '03',
    title: 'Receive Sport Class',
    body: 'Upon passing evaluation you will receive your sport class (SH1, SH2, or SH3) and a classification card valid for national events.',
  },
  {
    num: '04',
    title: 'International Confirmation',
    body: 'For international competition, classification must be confirmed by two WSPS international classifiers at an official international event.',
  },
]

// ---------------------------------------------------------------------------
// Data fetching (server-side, revalidated every 60 s)
// ---------------------------------------------------------------------------

async function getClassificationDocs(): Promise<ClassificationDoc[]> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') ||
      'http://localhost:4000'
    const res = await fetch(`${apiUrl}/api/v1/downloads`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const json = await res.json()
    const items: ClassificationDoc[] = json?.data ?? json ?? []
    return items.filter(
      (d) => d.isActive && CLASSIFICATION_CATEGORIES.includes(d.category),
    )
  } catch {
    return []
  }
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function ClassificationPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  const sq = ((searchParams.q as string) || '').toLowerCase()
  const docs = await getClassificationDocs()

  // Sort newest-first so the latest 6 are always shown
  const sortedDocs = [...docs].sort((a, b) => {
    const dateA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
    const dateB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
    return dateB - dateA
  })
  const totalDocs = sortedDocs.length
  const DOCS_LIMIT = 6

  const filteredClasses = functionalClasses.filter(
    (c) =>
      !sq ||
      c.grade.toLowerCase().includes(sq) ||
      c.name.toLowerCase().includes(sq) ||
      c.description.toLowerCase().includes(sq),
  )

  const filteredCamps = upcomingCamps.filter(
    (c) =>
      !sq ||
      c.location.toLowerCase().includes(sq) ||
      c.type.toLowerCase().includes(sq) ||
      c.date.toLowerCase().includes(sq),
  )

  // When searching, search across all docs; otherwise preview latest 6
  const docsPool = sq ? sortedDocs : sortedDocs.slice(0, DOCS_LIMIT)
  const filteredDocs = docsPool.filter(
    (d) =>
      !sq ||
      d.title.toLowerCase().includes(sq) ||
      (d.description || '').toLowerCase().includes(sq) ||
      d.category.toLowerCase().includes(sq),
  )

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-primary">
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <span className="absolute -top-8 right-[-5%] font-heading text-[22vw] font-bold text-white/[0.04] leading-none tracking-tighter">
            CLASS
          </span>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <p className="text-[#C8A415] font-body text-[11px] font-bold tracking-[0.35em] uppercase mb-4">Athlete Pathway</p>
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6">
            Classification &<br />
            <em className="text-[#C8A415] not-italic">Categories</em>
          </h1>
          <p className="text-white/70 font-body text-lg max-w-2xl leading-relaxed">
            Understanding the WSPS/IPC classification system that ensures equal and fair competition opportunities for para shooters across all impairment profiles.
          </p>
        </div>
      </section>

      {/* Search */}
      <section className="px-6 py-8 border-b border-neutral-200 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <form method="GET" className="relative max-w-md">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <input
              name="q"
              defaultValue={sq}
              placeholder="Search classifications, documents or camps..."
              className="w-full bg-white border border-neutral-300 text-neutral-800 placeholder-neutral-400 pl-11 pr-4 py-3 text-sm focus:outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10 transition-colors"
            />
          </form>
        </div>
      </section>

      {/* Sport Classes */}
      <section className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-2">Functional Classes</h2>
          <p className="text-neutral-500 text-sm mb-8 max-w-2xl">Athletes compete in one of three sport classes based on the impact of their impairment on shooting performance.</p>

          {filteredClasses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-px bg-neutral-200">
              {filteredClasses.map((c) => (
                <div
                  key={c.grade}
                  className="bg-white p-8 group hover:bg-neutral-50 transition-colors"
                  style={{ borderTop: `3px solid ${c.accent}` }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <span
                      className="font-heading text-5xl font-bold"
                      style={{ color: c.accent }}
                    >
                      {c.symbol}
                    </span>
                    <span
                      className="text-[9px] font-bold tracking-[0.2em] uppercase px-2 py-1"
                      style={{ color: c.accent, backgroundColor: `${c.accent}10`, border: `1px solid ${c.accent}25` }}
                    >
                      {c.name}
                    </span>
                  </div>
                  <p className="text-neutral-500 text-[13px] leading-relaxed mb-6">{c.description}</p>
                  <div className="space-y-1.5">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-neutral-400 mb-3">Competition Events</p>
                    {c.events.map((ev) => (
                      <div key={ev} className="flex items-center gap-2">
                        <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ backgroundColor: c.accent }} />
                        <span className="text-neutral-500 text-[12px]">{ev}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-neutral-400 border border-neutral-200 bg-neutral-50">
              No classification categories matched &ldquo;{sq}&rdquo;.
            </div>
          )}
        </div>
      </section>

      {/* Classification Process */}
      <section className="py-16 px-6 border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-2">Classification Process</h2>
          <p className="text-neutral-500 text-sm mb-10 max-w-2xl">How to get officially classified to compete in sanctioned national and international events.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-neutral-200">
            {steps.map((s) => (
              <div key={s.num} className="bg-white p-8">
                <span className="font-heading text-5xl font-bold text-neutral-200 block mb-4 leading-none">{s.num}</span>
                <h3 className="font-heading text-base font-bold text-neutral-900 mb-3">{s.title}</h3>
                <p className="text-neutral-500 text-[13px] leading-relaxed">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Documents & Guidelines — latest 6 preview */}
      <section className="py-16 px-6 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
            <div>
              <p className="text-[#C8A415] text-[10px] font-bold tracking-[0.3em] uppercase mb-2">Official Documents</p>
              <h2 className="font-heading text-2xl font-bold text-neutral-900">Documents &amp; Guidelines</h2>
              <p className="text-neutral-500 text-sm mt-1 max-w-xl">
                Classification rules, medical forms, and IPC licence documents.
              </p>
            </div>
            <Link
              href="/classification/documents"
              className="group inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-500 hover:text-[#C8A415] transition-colors whitespace-nowrap"
            >
              {totalDocs > DOCS_LIMIT && <span className="text-neutral-300 group-hover:text-[#C8A415]/40 transition-colors">{totalDocs} total</span>}
              <span>Browse Full Library</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="translate-x-0 group-hover:translate-x-1 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

          {/* List preview */}
          {docs.length > 0 ? (
            <div className="border border-neutral-200 divide-y divide-neutral-100 mb-6">
              {sortedDocs.slice(0, DOCS_LIMIT).map((d) => {
                const meta = CATEGORY_META[d.category] ?? DEFAULT_META
                const dateLabel = d.updatedAt
                  ? new Date(d.updatedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                  : ''
                return (
                  <div
                    key={d.id}
                    className="group flex flex-col sm:flex-row sm:items-center gap-4 px-5 py-4 hover:bg-neutral-50 transition-colors duration-150"
                  >
                    {/* Left: category + title */}
                    <div className="flex-1 min-w-0">
                      <span
                        className="inline-block text-[9px] font-extrabold tracking-[0.22em] uppercase px-2 py-0.5 mb-1.5 leading-none"
                        style={{ color: meta.accent, backgroundColor: `${meta.accent}12`, border: `1px solid ${meta.accent}25` }}
                      >
                        {meta.label}
                      </span>
                      <h3 className="font-heading text-[15px] font-bold text-neutral-900 leading-snug group-hover:text-primary transition-colors duration-150 truncate">
                        {d.title}
                      </h3>
                    </div>

                    {/* Right: meta + download */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      {dateLabel && (
                        <span className="text-neutral-400 text-[12px] tabular-nums hidden md:block">{dateLabel}</span>
                      )}
                      {d.size && (
                        <span className="text-neutral-400 text-[11px] font-mono hidden sm:block">{d.size}</span>
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
                        <span className="text-neutral-300 text-[10px] tracking-wider uppercase px-4 py-2 border border-neutral-200 flex-shrink-0">Unavailable</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-neutral-400 border border-neutral-200 bg-neutral-50 mb-6">
              No classification documents available at this time.
            </div>
          )}

          {/* Footer CTA bar */}
          <div className="flex items-center justify-between py-4 px-6 border border-neutral-200 bg-neutral-50">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-[#C8A415]" />
              <span className="text-neutral-500 text-[12px]">
                {totalDocs > 0 ? (
                  totalDocs > DOCS_LIMIT
                    ? <>Showing <span className="text-neutral-700 font-semibold">{DOCS_LIMIT}</span> of <span className="text-neutral-700 font-semibold">{totalDocs}</span> documents</>
                    : <><span className="text-neutral-700 font-semibold">{totalDocs}</span> document{totalDocs !== 1 ? 's' : ''} total</>
                ) : (
                  'No documents found'
                )}
              </span>
            </div>
            <Link
              href="/classification/documents"
              className="group inline-flex items-center gap-2.5 bg-[#C8A415] text-white text-[11px] font-extrabold tracking-widest uppercase px-5 py-2.5 hover:bg-[#b8940f] transition-colors"
            >
              Browse Full Library
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="translate-x-0 group-hover:translate-x-0.5 transition-transform">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
          </div>

        </div>
      </section>



      {/* CTA */}
      <section className="py-16 px-6 border-t border-neutral-200">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-[#C8A415] text-[11px] font-bold tracking-[0.35em] uppercase mb-4">Need Help?</p>
          <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-4">Questions about classification?</h2>
          <p className="text-neutral-500 text-sm mb-8">Our classification officer is available to assist with documentation, eligibility queries, and camp registrations.</p>
          <Link href="/contact" className="inline-block bg-primary text-white font-body font-extrabold text-[13px] tracking-widest uppercase px-8 py-3.5 hover:bg-primary-light transition-colors">
            Contact Classification Officer
          </Link>
        </div>
      </section>

    </div>
  )
}
