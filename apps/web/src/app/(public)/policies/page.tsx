import Link from 'next/link'

// ---------------------------------------------------------------------------
// Types & metadata
// ---------------------------------------------------------------------------

interface Download {
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

const CATEGORY_META: Record<string, { label: string; accent: string; icon: string }> = {
  rules: {
    label: 'Rules',
    accent: '#C8A415',
    icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
  },
  selection: {
    label: 'Selection',
    accent: '#003DA5',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4',
  },
  calendar: {
    label: 'Calendar',
    accent: '#046A38',
    icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z',
  },
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
  match: {
    label: 'Match',
    accent: '#475569',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
}

const DEFAULT_META = {
  label: 'Document',
  accent: '#C8A415',
  icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
}

// ---------------------------------------------------------------------------
// Terms
// ---------------------------------------------------------------------------

const terms = [
  {
    title: 'Membership & Registration',
    body: 'All athletes, coaches, and officials must register with STC Para Shooting through the official portal. Registration is subject to verification of medical documentation, classification certificates, and identity proof. Annual renewal is mandatory.',
  },
  {
    title: 'Classification Requirements',
    body: 'Athletes must hold a valid IPC/WSPS functional classification (SH1, SH2, or SH3) issued by a licensed classifier. Classification is reviewed every four years or following a significant change in impairment. Failure to maintain valid classification results in suspension.',
  },
  {
    title: 'Competition Integrity',
    body: 'All participants must compete honestly and ethically. Match-fixing, result manipulation, unsportsmanlike conduct, or abuse of officials constitutes a serious breach and may result in permanent disqualification from all STC Para Shooting sanctioned events.',
  },
  {
    title: 'Data & Privacy',
    body: "Personal data collected during registration is processed in accordance with India's Personal Data Protection Act. Data is used solely for administrative, selection, and communication purposes. Athletes may request access to or deletion of their data at any time.",
  },
]

// ---------------------------------------------------------------------------
// Data fetch
// ---------------------------------------------------------------------------

const CLASSIFICATION_ONLY = [
  'classification',
  'medical_classification',
  'national_classification',
  'ipc_license',
]

async function getDownloads(): Promise<Download[]> {
  try {
    const apiUrl =
      process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') || 'http://localhost:4000'
    const res = await fetch(`${apiUrl}/api/v1/downloads`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return []
    const json = await res.json()
    const items: Download[] = json?.data ?? json ?? []
    return items.filter((d) => d.isActive && !CLASSIFICATION_ONLY.includes(d.category))
  } catch {
    return []
  }
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export const metadata = {
  title: 'Policies & Documents — Para Shooting India',
  description:
    'Official rules, selection criteria, calendars, and governance documents for Para Shooting India.',
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function PoliciesPage() {
  const allDocs = await getDownloads()

  // Sort newest-first, show latest 6
  const sorted = [...allDocs].sort((a, b) => {
    const dA = a.updatedAt ? new Date(a.updatedAt).getTime() : 0
    const dB = b.updatedAt ? new Date(b.updatedAt).getTime() : 0
    return dB - dA
  })
  const preview = sorted.slice(0, 6)
  const totalCount = allDocs.length
  const hasMore = totalCount > 6

  return (
    <div className="bg-white min-h-screen">

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-primary">
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <span className="absolute -top-8 right-[-5%] font-heading text-[22vw] font-bold text-white/[0.04] leading-none tracking-tighter">
            RULES
          </span>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <p className="text-[#C8A415] font-body text-[11px] font-bold tracking-[0.35em] uppercase mb-4">
            Governance
          </p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h1 className="font-heading text-5xl md:text-7xl font-bold text-white leading-[1.05]">
              Official<br />
              <em className="text-[#C8A415] not-italic">Policies</em>
            </h1>
            {totalCount > 0 && (
              <div className="flex items-center gap-3 pb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-[#C8A415] animate-pulse" />
                <span className="text-white/60 text-[13px]">
                  <span className="text-white font-semibold">{totalCount}</span> documents available
                </span>
              </div>
            )}
          </div>
          <p className="text-white/70 font-body text-lg max-w-2xl leading-relaxed mt-6">
            Access the constitution, administrative guidelines, anti-doping regulations, and codes
            of conduct governing Para Shooting in India.
          </p>
        </div>
      </section>

      {/* ── Documents preview strip ───────────────────────────────────────── */}
      <section className="py-16 px-6 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto">

          {/* Section header */}
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[#C8A415] font-body text-[10px] font-bold tracking-[0.35em] uppercase mb-2">
                Document Library
              </p>
              <h2 className="font-heading text-3xl font-bold text-neutral-900">
                Latest Documents
              </h2>
            </div>
            <Link
              href="/policies/documents"
              className="hidden md:inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-[#C8A415] border border-[#C8A415]/40 px-5 py-2.5 hover:bg-[#C8A415]/10 transition-colors"
            >
              Browse Full Library
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* List */}
          {preview.length > 0 ? (
            <div className="border border-neutral-200 divide-y divide-neutral-100">
              {preview.map((d) => {
                const meta = CATEGORY_META[d.category] ?? DEFAULT_META
                const dateLabel = d.updatedAt
                  ? new Date(d.updatedAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : null

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
                      {d.description && (
                        <p className="text-neutral-500 text-[12px] mt-0.5 line-clamp-1">{d.description}</p>
                      )}
                    </div>

                    {/* Right: meta + download */}
                    <div className="flex items-center gap-4 flex-shrink-0">
                      {dateLabel && (
                        <span className="text-neutral-400 text-[12px] tabular-nums hidden md:block">{dateLabel}</span>
                      )}
                      {d.size && (
                        <span className="text-neutral-400 text-[11px] font-mono hidden sm:block">{d.size}</span>
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
                        <span className="text-neutral-300 text-[10px] tracking-wider uppercase px-4 py-2 border border-neutral-200 flex-shrink-0">Unavailable</span>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-12 text-center text-neutral-400 border border-neutral-200 bg-neutral-50 mb-6">
              No policies documents available at this time.
            </div>
          )}

          {/* Footer: count + CTA */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-neutral-200">
            <p className="text-neutral-400 text-[12px]">
              {totalCount > 0 ? (
                <>Showing <span className="text-neutral-600 font-semibold">{preview.length}</span> of{' '}<span className="text-neutral-600 font-semibold">{totalCount}</span> documents</>
              ) : 'No documents found'}
            </p>
            <Link
              href="/policies/documents"
              className="inline-flex items-center gap-2 bg-[#C8A415] text-white font-body font-extrabold text-[11px] tracking-widest uppercase px-7 py-3 hover:bg-[#b8940f] transition-colors"
            >
              Browse Full Library
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ── Terms & Conditions ────────────────────────────────────────────── */}
      <section className="py-16 px-6 mt-8 border-t border-neutral-200 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-3">Terms &amp; Conditions</h2>
          <p className="text-neutral-500 text-sm mb-10 max-w-2xl">
            By registering with STC Para Shooting you agree to the following terms. Please read
            carefully before completing your registration.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-neutral-200">
            {terms.map((t, i) => (
              <div key={i} className="bg-white p-8">
                <div className="flex items-start gap-4">
                  <span className="font-heading text-4xl font-bold text-neutral-200 leading-none flex-shrink-0 mt-1">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <h3 className="font-heading text-base font-bold text-neutral-900 mb-3">{t.title}</h3>
                    <p className="text-neutral-500 text-sm leading-relaxed">{t.body}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact ──────────────────────────────────────────────────────── */}
      <section className="py-16 px-6 border-t border-neutral-200">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-neutral-400 text-sm mb-3">Questions about our policies?</p>
          <h2 className="font-heading text-3xl font-bold text-neutral-900 mb-6">Contact the STC Office</h2>
          <Link
            href="/contact"
            className="inline-block bg-primary text-white font-body font-extrabold text-[13px] tracking-widest uppercase px-8 py-3.5 hover:bg-primary-light transition-colors"
          >
            Get in Touch
          </Link>
        </div>
      </section>

    </div>
  )
}
