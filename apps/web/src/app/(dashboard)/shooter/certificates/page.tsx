'use client'

import React, { useState, useEffect, useRef } from 'react'
import CertificateDocument from '@/components/certificates/CertificateDocument'

interface CertificateData {
  id: number
  certNo: string
  compNo: string
  championshipName: string
  venue: string
  dates: string
  issuedDate: string
  athleteName: string
  state: string
  events: {
    name: string
    score: string | null
    position: string | null
    mqs: string | null
  }[]
}

export default function ShooterCertificatesPage() {
  const [certificates, setCertificates] = useState<CertificateData[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCert, setSelectedCert] = useState<CertificateData | null>(null)
  const [downloadingId, setDownloadingId] = useState<number | null>(null)
  
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let mounted = true
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
    fetch(`${API_URL}/certificates`, { credentials: 'include' })
      .then(res => res.ok ? res.json() : Promise.reject(res.status))
      .then(data => { if (mounted) setCertificates(data.data || data) })
      .catch(() => { if (mounted) setCertificates([]) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [])

  // Modal handlers
  const closeModal = () => setSelectedCert(null)

  useEffect(() => {
    if (selectedCert) {
      document.body.style.overflow = 'hidden'
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === 'Escape') closeModal()
      }
      window.addEventListener('keydown', handleEsc)
      return () => {
        window.removeEventListener('keydown', handleEsc)
        document.body.style.overflow = ''
      }
    }
  }, [selectedCert])

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === overlayRef.current) closeModal()
  }

  const handleDownloadClick = (id: number) => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
    setDownloadingId(id)
    window.open(`${API_URL}/certificates/${id}/download`, '_blank')
    setTimeout(() => setDownloadingId(null), 800)
  }

  // Render loading skeleton
  if (loading) {
    return (
      <div className="max-w-[1100px] mx-auto p-6 md:p-9 space-y-8">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#003da5] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            My Certificates
          </h1>
          <p className="text-slate-500">View and download your official certificates of merit and participation</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2].map(i => (
            <div key={i} className="bg-white rounded-[18px] border border-slate-200 overflow-hidden min-h-[300px] animate-pulse">
              <div className="h-32 bg-slate-200" />
              <div className="p-5 space-y-4">
                <div className="h-3 w-1/3 bg-slate-200 rounded" />
                <div className="h-5 w-4/5 bg-slate-200 rounded" />
                <div className="h-4 w-2/3 bg-slate-200 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1100px] mx-auto p-6 md:p-9 space-y-8 pb-20">
      
      {/* PAGE HEADER */}
      <div className="bg-white border-b border-slate-200 -mx-6 md:-mx-9 px-6 md:px-9 pb-6 mb-8 pt-2">
        <h1 className="text-2xl font-bold text-[#003da5] mb-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
          My Certificates
        </h1>
        <p className="text-slate-500">
          View and download your official certificates of merit and participation
        </p>
      </div>

      {(() => {
        // Filter strictly for "achieved" shooters (i.e. medalists from Rank 1 to 3)
        const achievedCertificates = certificates.filter(cert => {
          return cert.events.some(e => {
            if (!e.position) return false
            const pos = String(e.position).toLowerCase()
            return ['gold', 'silver', 'bronze', '1', '2', '3'].includes(pos)
          })
        })

        if (achievedCertificates.length === 0) {
          return (
            <div className="bg-white rounded-xl border border-slate-200 p-16 text-center shadow-[0_2px_10px_rgba(0,0,0,0.02)]">
              <div className="w-[72px] h-[72px] bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-5 border border-slate-100 text-slate-400">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="16" y1="2" x2="16" y2="6"></line>
                  <line x1="8" y1="2" x2="8" y2="6"></line>
                  <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-slate-900 mb-2">No certificates yet</h3>
              <p className="text-slate-500 max-w-sm mx-auto">
                You haven't been awarded any official achievement certificates yet. Certificates will appear here after official championship results are published.
              </p>
            </div>
          )
        }

        return (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[22px]">
            {achievedCertificates.map((cert) => {
              const hasGold = cert.events.some(e => e.position && String(e.position).toLowerCase().includes('gold') || String(e.position) === '1')
              const isMerit = true // filtered above

            return (
              <div 
                key={cert.id} 
                className="group relative bg-white rounded-[18px] border border-slate-200 shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(0,0,0,0.08)] hover:border-slate-300"
              >
                {/* 3px Top Gradient Pseudo */}
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#003da5] to-[#c8a415] opacity-0 group-hover:opacity-100 transition-opacity z-10"></div>

                {/* TOP BANNER */}
                <div 
                  className={`relative p-7 px-5 text-center overflow-hidden shrink-0 flex flex-col items-center`}
                  style={{
                    background: hasGold 
                      ? 'linear-gradient(135deg, #001A4D 0%, #003DA5 60%, #1a54c8)' 
                      : (isMerit 
                          ? 'linear-gradient(135deg, #002B7A 0%, #003DA5 60%, #2062d4)'
                          : 'linear-gradient(135deg, #1a3a1a 0%, #046A38 60%, #0a8a4a)')
                  }}
                >
                  {/* Watermark text */}
                  <div className="absolute -bottom-2 left-0 right-0 text-[42px] font-black italic opacity-[0.05] text-white pointer-events-none select-none" style={{ fontFamily: "'Playfair Display', serif" }}>
                    CERTIFICATE
                  </div>

                  {/* Center icon */}
                  <div className="w-[52px] h-[52px] rounded-full bg-white/12 border-2 border-white/20 flex items-center justify-center mb-3 relative z-10 shadow-inner">
                    {isMerit ? (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="8" r="6"/>
                        <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
                      </svg>
                    ) : (
                      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14 2 14 8 20 8"/>
                        <line x1="16" y1="13" x2="8" y2="13"/>
                        <line x1="16" y1="17" x2="8" y2="17"/>
                        <polyline points="10 9 9 9 8 9"/>
                      </svg>
                    )}
                  </div>
                  
                  {/* Medal badge pill */}
                  <div className={`text-[10px] font-bold uppercase tracking-wide px-3 py-1 rounded-full inline-block relative z-10 ${
                    hasGold ? 'bg-[#c8a415]/20 text-[#fef08a] border border-[#c8a415]/40' : 
                    isMerit ? 'bg-white/20 text-white border border-white/30' :
                    'bg-white/20 text-green-100 border border-white/30'
                  }`}>
                    {hasGold ? 'Gold Medalist' : isMerit ? 'Merit Certificate' : 'Certificate of Participation'}
                  </div>

                  {/* Gradient line bottom edge */}
                  <div className={`absolute bottom-0 left-0 right-0 h-[3px] ${isMerit ? 'bg-gradient-to-r from-transparent via-[#c8a415] to-transparent' : 'bg-gradient-to-r from-transparent via-[#4ade80] to-transparent opacity-60'}`}></div>
                </div>

                {/* CARD BODY */}
                <div className="p-5 flex-1 flex flex-col bg-white">
                  <div className="text-xs font-bold uppercase text-[#94a3b8] tracking-wider mb-2">
                    {isMerit ? 'Certificate of Merit' : 'Certificate of Participation'}
                  </div>
                  <h3 className="text-[17px] font-bold text-[#0f172a] leading-tight mb-2 line-clamp-2" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
                    {cert.championshipName}
                  </h3>
                  <p className="text-[13px] text-[#334155] mb-[14px] flex-1">
                    {cert.venue}
                  </p>

                  <div className="space-y-2 mt-auto">
                    <div className="flex items-center text-[12px] text-[#94a3b8]">
                      <svg className="w-4 h-4 mr-2 text-[#94a3b8]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                      </svg>
                      Issued: {new Date(cert.issuedDate).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                    <div className="flex items-center text-[12px] text-[#94a3b8]">
                      <svg className="w-4 h-4 mr-2 text-[#94a3b8]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                      Cert No: <span className="ml-[6px] px-[6px] py-[2px] bg-[#f0f4ff] text-[#003da5] rounded-[4px] font-mono text-[11px] font-semibold">{cert.certNo}</span>
                    </div>
                  </div>
                </div>

                {/* CARD ACTIONS */}
                <div className="grid grid-cols-2 border-t border-slate-200">
                  <button 
                    onClick={() => setSelectedCert(cert)}
                    className="flex justify-center items-center py-3.5 bg-white text-[#003da5] text-[13px] font-semibold border-r border-slate-200 hover:bg-[#f8faff] transition-colors cursor-pointer"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                      <circle cx="12" cy="12" r="3"/>
                    </svg>
                    View
                  </button>
                  <button 
                    onClick={() => handleDownloadClick(cert.id)}
                    disabled={downloadingId === cert.id}
                    className={`flex justify-center items-center py-3.5 text-white text-[13px] font-semibold transition-colors
                      ${isMerit ? 'bg-[#003da5] hover:bg-[#002b7a]' : 'bg-[#046a38] hover:bg-[#03522b]'}
                      ${downloadingId === cert.id ? 'opacity-80 cursor-wait' : 'cursor-pointer'}
                    `}
                  >
                    {downloadingId === cert.id ? (
                      <svg className="animate-spin w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                        <polyline points="7,10 12,15 17,10"/>
                        <line x1="12" y1="15" x2="12" y2="3"/>
                      </svg>
                    )}
                    {downloadingId === cert.id ? 'Downloading...' : 'PDF'}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
        )
      })()}

      {/* MODAL */}
      {selectedCert && (
        <div 
          ref={overlayRef}
          onClick={handleOverlayClick}
          className="fixed inset-0 bg-black/65 backdrop-blur-sm z-[500] overflow-y-auto p-4 md:p-6 flex items-start justify-center"
        >
          <div className="bg-white rounded shadow-[0_24px_80px_rgba(0,0,0,0.4)] max-w-[820px] w-full my-auto relative animate-in fade-in zoom-in-95 duration-200">
            
            <button
              onClick={closeModal}
              className="absolute -top-3.5 -right-3.5 w-9 h-9 rounded-full bg-white text-slate-500 shadow-lg border border-slate-100 flex items-center justify-center hover:bg-[#dc2626] hover:text-white hover:border-[#dc2626] transition-all hover:scale-110 z-[501]"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>

            <div className="overflow-x-auto overflow-y-hidden max-w-full">
              <div className="min-w-[600px]">
                <CertificateDocument {...selectedCert} />
              </div>
            </div>

            <div className="p-4 bg-[#f8faff] border-t border-[#e2e8f0] rounded-b flex justify-end">
               <button 
                  onClick={() => window.print()}
                  className="flex items-center px-5 py-2.5 bg-[#003da5] text-white hover:bg-[#002b7a] rounded shadow-sm text-[13px] font-semibold transition-colors"
                >
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                    <polyline points="7,10 12,15 17,10"/>
                    <line x1="12" y1="15" x2="12" y2="3"/>
                  </svg>
                  Print / Save as PDF
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}
