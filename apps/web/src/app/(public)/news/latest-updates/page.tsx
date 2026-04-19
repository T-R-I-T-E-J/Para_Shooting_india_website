import React from 'react'
import Link from 'next/link'
import { FileText, Download, Calendar, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'

export const dynamic = 'force-dynamic'
export const revalidate = 0

async function getLatestUpdates() {
  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/api\/v1\/?$/, '') || 'http://localhost:4000'
    const res = await fetch(`${apiUrl}/api/v1/latest-updates`, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return Array.isArray(data) ? data : (data.data || [])
  } catch (error) {
    console.error(error)
    return []
  }
}

export default async function LatestUpdatesPage() {
  const updates = await getLatestUpdates()

  return (
    <div className="bg-white min-h-screen">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-[#001A4D]">
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <span className="absolute -top-8 right-[-5%] font-heading text-[22vw] font-bold text-white/[0.04] leading-none tracking-tighter w-full text-right">
            UPDATES
          </span>
        </div>
        <div className="max-w-4xl mx-auto relative">
          <Link href="/news" className="inline-flex items-center text-xs font-bold tracking-widest uppercase text-white/50 hover:text-white mb-8 transition-colors">
            <ArrowLeft className="w-3 h-3 mr-2" /> Back to News
          </Link>
          <p className="text-[#C8A415] font-body text-[11px] font-bold tracking-[0.35em] uppercase mb-4">
            Notice Board
          </p>
          <h1 className="font-heading text-5xl md:text-7xl font-black text-white leading-[1.05] mb-6">
            Latest <em className="text-[#C8A415] italic">Updates</em>
          </h1>
          <p className="text-white/70 font-body text-lg max-w-2xl leading-relaxed">
            Important announcements, roster updates, and circulars directly from the sports authority.
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="max-w-4xl mx-auto px-6 py-20 min-h-[40vh]">
        {updates.length === 0 ? (
          <div className="py-20 text-center text-neutral-400 border border-neutral-200 bg-neutral-50 rounded-xl">
            <FileText className="w-10 h-10 mx-auto mb-4 text-neutral-300" />
            <p className="font-heading text-lg font-bold text-neutral-600 mb-1">No updates found</p>
            <p className="text-sm">There are currently no circulars or updates to display.</p>
          </div>
        ) : (
          <div className="space-y-6">
            {updates.map((update: any) => (
              <div 
                key={update.id} 
                className="group relative bg-white border border-neutral-200 rounded-xl p-6 hover:shadow-[0_20px_40px_-15px_rgba(0,0,0,0.1)] hover:border-gold/30 transition-all duration-300 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between overflow-hidden"
              >
                {/* Decorative left accent */}
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gold opacity-0 group-hover:opacity-100 transition-opacity" />

                <div className="flex-1 pr-4">
                  <div className="flex items-center gap-2 text-[11px] font-bold text-neutral-400 uppercase tracking-widest mb-3">
                    <Calendar className="w-3.5 h-3.5 text-gold" />
                    {format(new Date(update.date || update.created_at), 'MMMM dd, yyyy')}
                  </div>
                  <h3 className="text-xl font-heading font-black text-[#001A4D] group-hover:text-gold transition-colors leading-tight">
                    {update.title}
                  </h3>
                </div>

                {update.document && (
                  <a
                    href={update.document.url}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex flex-shrink-0 items-center justify-center gap-2 px-6 py-3.5 bg-neutral-50 hover:bg-[#001A4D] text-[#001A4D] hover:text-white border border-neutral-200 hover:border-[#001A4D] font-bold text-[12px] uppercase tracking-wider rounded-none transition-all duration-300 w-full md:w-auto"
                  >
                    <FileText className="w-4 h-4" />
                    Read Document
                    <Download className="w-4 h-4 ml-1 opacity-50" />
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
