'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'

/* ── Types ── */
type ResultRow = {
  id: string
  title: string
  description?: string
  file_name: string
  url: string
  file_size: number | string
  venue?: string
  date: string
  uploadedAt: string
}

/* ── Date helpers (UTC-safe) ── */
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatDate(iso: string | null | undefined): string {
  if (!iso) return 'Date not specified'
  const d = new Date(iso)
  if (isNaN(d.getTime())) return 'Date not specified'
  return `${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`
}

function formatLocalDate(dateStr: string): string {
  if (!dateStr) return ''
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr
  const day = parseInt(parts[2], 10)
  const monthIdx = parseInt(parts[1], 10) - 1
  const year = parseInt(parts[0], 10)
  return `${day} ${MONTHS[monthIdx]} ${year}`
}

function todayStr(): string {
  const d = new Date()
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function todayFormatted(): string {
  const d = new Date()
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`
}

/* ── Toast System ── */
type Toast = { id: number; msg: string; ok: boolean }
let toastId = 0

function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const push = (msg: string, ok = true) => {
    const id = ++toastId
    setToasts(p => [...p, { id, msg, ok }])
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500)
  }
  return { toasts, push }
}

/* ══════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════════ */
export default function AdminResultsPage() {
  const [results, setResults] = useState<ResultRow[]>([])
  const [loading, setLoading] = useState(true)
  const [tableSearch, setTableSearch] = useState('')

  /* Form state */
  const [title, setTitle] = useState('')
  const [venue, setVenue] = useState('')
  const [desc, setDesc] = useState('')
  const [contentDate, setContentDate] = useState('')
  const [contentYear, setContentYear] = useState<number | null>(null)
  const [fileMode, setFileMode] = useState<'upload' | 'link'>('upload')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [extUrl, setExtUrl] = useState('')
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  /* Delete state */
  const [delTarget, setDelTarget] = useState<ResultRow | null>(null)
  const [deleting, setDeleting] = useState(false)

  const { toasts, push } = useToast()

  /* ── API: Fetch ── */
  const fetchResults = async () => {
    try {
      const r = await fetch('/api/v1/results', { cache: 'no-store' })
      const j = await r.json()
      const data = Array.isArray(j) ? j : j.data ?? []
      setResults(data)
    } catch {
      /* silent */
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => { fetchResults() }, [])

  /* ── Date change handler ── */
  const onDateChange = (v: string) => {
    setContentDate(v)
    if (v) {
      const parts = v.split('-')
      setContentYear(parseInt(parts[0], 10))
    } else {
      setContentYear(null)
    }
  }

  /* ── Reset form ── */
  const resetForm = () => {
    setTitle('')
    setVenue('')
    setDesc('')
    setContentDate('')
    setContentYear(null)
    setSelectedFile(null)
    setExtUrl('')
  }

  /* ── API: Upload ── */
  const handleUpload = async () => {
    if (!title.trim() || !contentDate) return
    if (fileMode === 'upload' && !selectedFile) return
    if (fileMode === 'link' && !extUrl.trim()) return

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('title', title.trim())
      // Prepend venue to description if provided
      const descText = venue.trim() 
        ? `Venue: ${venue.trim()}\n\n${desc.trim()}`
        : desc.trim()
      
      if (descText) fd.append('description', descText)
      fd.append('date', contentDate) // matches @IsNotEmpty() date string in DTO
      
      if (fileMode === 'upload' && selectedFile) {
        fd.append('file', selectedFile)
      } else if (fileMode === 'link') {
        // If the backend doesn't support direct link creation, 
        // it may need an adjustment. Most robust is local upload.
        // For now, only 'upload' is fully supported by Multipart logic in API.
        if (fileMode === 'link') throw new Error('External link creation is not directly supported via multi-part upload. Please upload the PDF file.')
      }

      const r = await fetch('/api/v1/results/upload', { 
        method: 'POST', 
        body: fd 
      })
      if (!r.ok) {
        const e = await r.json().catch(() => ({}))
        throw new Error(e.message || `Error ${r.status}`)
      }
      push('Result uploaded successfully!')
      resetForm()
      fetchResults()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Upload failed'
      push(msg, false)
    } finally {
      setUploading(false)
    }
  }

  /* ── API: Delete ── */
  const handleDelete = async () => {
    if (!delTarget) return
    setDeleting(true)
    try {
      const r = await fetch(`/api/v1/results/${delTarget.id}`, { method: 'DELETE' })
      if (!r.ok) throw new Error('Delete failed')
      push('Result deleted successfully')
      setDelTarget(null)
      fetchResults()
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Delete failed'
      push(msg, false)
    } finally {
      setDeleting(false)
    }
  }

  /* ── Filtered results ── */
  const filteredResults = useMemo(() => {
    if (!tableSearch) return results
    const q = tableSearch.toLowerCase()
    return results.filter(
      r => r.title.toLowerCase().includes(q) || r.file_name?.toLowerCase().includes(q)
    )
  }, [results, tableSearch])

  /* ── File pick handler ── */
  const onFilePick = (f: File | null) => {
    if (f && f.type === 'application/pdf') setSelectedFile(f)
  }

  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#F4F6FB]">
      {/* Keyframe animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes slideIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}
        .toast-in{animation:slideIn .3s ease}
      `}} />

      {/* ── Toasts ── */}
      <div className="fixed top-6 right-6 z-[999] flex flex-col gap-3">
        {toasts.map(t => (
          <div
            key={t.id}
            className="toast-in bg-white rounded-xl px-[18px] py-[14px] min-w-[280px] text-[13px] font-semibold flex items-center gap-2"
            style={{
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              borderLeft: `4px solid ${t.ok ? '#046A38' : '#DC2626'}`,
            }}
          >
            {t.ok ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#046A38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20,6 9,17 4,12"/></svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
            )}
            {t.msg}
          </div>
        ))}
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {delTarget && (
        <div
          className="fixed inset-0 z-[900] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.5)' }}
          onClick={() => !deleting && setDelTarget(null)}
        >
          <div
            className="bg-white rounded-[20px] max-w-[400px] w-full p-8"
            onClick={e => e.stopPropagation()}
          >
            <h3
              className="text-[20px] font-bold text-[#0F172A] mb-3"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Delete Result
            </h3>
            <p className="text-[#334155] text-[14px] mb-6 leading-relaxed">
              Are you sure you want to delete <strong>&quot;{delTarget.title}&quot;</strong>?
              This action cannot be undone and the file will be removed from the public website immediately.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDelTarget(null)}
                disabled={deleting}
                className="px-5 py-2.5 border border-[#E2E8F0] rounded-lg text-[13px] font-semibold text-[#334155] hover:bg-[#F4F6FB] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-5 py-2.5 bg-[#DC2626] text-white rounded-lg text-[13px] font-bold hover:bg-[#B91C1C] transition-colors flex items-center gap-2"
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3,6 5,6 21,6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                </svg>
                {deleting ? 'Deleting...' : 'Delete Result'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          SECTION 1 — PAGE HEADER
          ═══════════════════════════════════════════════════════ */}
      <div className="bg-white border-b border-[#E2E8F0]" style={{ padding: '24px 32px' }}>
        <h1
          className="text-[24px] font-bold text-[#003DA5]"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Results Management
        </h1>
        <p className="text-[13px] text-[#94A3B8] mt-1">
          Upload and manage official competition result sheets
        </p>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 py-8 space-y-8">

        {/* ═══════════════════════════════════════════════════════
            SECTION 2 — UPLOAD FORM CARD
            ═══════════════════════════════════════════════════════ */}
        <div
          className="bg-white rounded-[20px] border border-[#E2E8F0] overflow-hidden"
          style={{ boxShadow: '0 2px 12px rgba(0,61,165,0.06)', marginBottom: '32px' }}
        >
          {/* Card Header — dark navy gradient */}
          <div
            className="flex items-center gap-4"
            style={{ background: 'linear-gradient(135deg, #001A4D, #003DA5)', padding: '24px 28px' }}
          >
            <div
              className="flex items-center justify-center rounded-xl"
              style={{
                width: 44, height: 44,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17,8 12,3 7,8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div>
              <div className="text-white text-[18px] font-bold" style={{ fontFamily: "'Playfair Display', serif" }}>
                Upload New Result
              </div>
              <div className="text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Add a new championship or selection trial result
              </div>
            </div>
          </div>

          {/* Form Body */}
          <div style={{ padding: 28 }} className="space-y-5">

            {/* ROW 1 — Title + Venue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-[12px] font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                  Competition Title *
                </label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. 68th National Championship"
                  className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-[14px] text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#003DA5] focus:ring-4 focus:ring-[#003DA5]/10 transition-colors"
                />
              </div>
              <div>
                <label className="block text-[12px] font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                  Venue / Location
                </label>
                <input
                  value={venue}
                  onChange={e => setVenue(e.target.value)}
                  placeholder="e.g. Dr. Karni Singh Ranges, Delhi"
                  className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-[14px] text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#003DA5] focus:ring-4 focus:ring-[#003DA5]/10 transition-colors"
                />
              </div>
            </div>

            {/* ROW 2 — Description */}
            <div>
              <label className="block text-[12px] font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                Description
              </label>
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Brief description of the competition..."
                className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-[14px] text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#003DA5] focus:ring-4 focus:ring-[#003DA5]/10 resize-none transition-colors"
                style={{ minHeight: 90 }}
              />
            </div>

            {/* ── ISSUED DATE BLOCK (gold-highlighted) ── */}
            <div
              className="rounded-[14px]"
              style={{
                background: 'rgba(200,164,21,0.05)',
                border: '1.5px solid rgba(200,164,21,0.22)',
                padding: '18px 20px',
                marginBottom: 18,
              }}
            >
              {/* Section label */}
              <div className="flex items-center gap-2 mb-4">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8A415" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span className="text-[#C8A415] text-[10px] font-bold uppercase" style={{ letterSpacing: '0.2em' }}>
                  Championship / Issued Date
                </span>
              </div>

              {/* Two-column: Date input + Year display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4">
                <div>
                  <label className="block text-[12px] font-bold text-[#334155] uppercase tracking-wider mb-1.5">
                    Issued Date *
                  </label>
                  <input
                    type="date"
                    value={contentDate}
                    onChange={e => onDateChange(e.target.value)}
                    max={todayStr()}
                    className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-[14px] text-[#0F172A] outline-none focus:border-[#003DA5] transition-colors"
                  />
                </div>
                <div
                  className="flex flex-col items-center justify-center bg-[#F4F6FB] rounded-[10px]"
                  style={{ border: '1.5px solid #E2E8F0', padding: '10px 18px', textAlign: 'center' }}
                >
                  <span
                    className="text-[22px] font-bold text-[#003DA5]"
                    style={{ fontFamily: "'Playfair Display', serif" }}
                  >
                    {contentYear ?? '\u2014'}
                  </span>
                  <span className="text-[9px] text-[#94A3B8] uppercase font-bold tracking-wider">
                    Year
                  </span>
                </div>
              </div>

              {/* Warning box (always visible) */}
              <div
                className="flex items-start gap-2.5 mb-3"
                style={{
                  background: 'rgba(245,124,0,0.07)',
                  border: '1px solid rgba(245,124,0,0.2)',
                  borderRadius: 10,
                  padding: '12px 14px',
                }}
              >
                <svg className="mt-0.5 shrink-0" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span className="text-[12px] leading-relaxed" style={{ color: '#92400E' }}>
                  Set the date the competition was actually held — NOT today&apos;s date.
                  A December 2025 championship should have Issued Date: Dec 2025, even if uploaded in 2026.
                </span>
              </div>

              {/* Confirmation row (visible only when date selected) */}
              {contentDate && (
                <div
                  className="flex items-center gap-2.5"
                  style={{
                    background: 'rgba(4,106,56,0.07)',
                    border: '1px solid rgba(4,106,56,0.2)',
                    borderRadius: 10,
                    padding: '12px 14px',
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#046A38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                  <span className="text-[12px]" style={{ color: '#065F46' }}>
                    Issued: <strong>{formatLocalDate(contentDate)}</strong> &middot; Uploading today: <strong>{todayFormatted()}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* ── FILE UPLOAD ── */}
            <div>
              <label className="block text-[12px] font-bold text-[#334155] uppercase tracking-wider mb-2">
                Result File (PDF) *
              </label>

              {/* Toggle tabs */}
              <div className="flex mb-4 border border-[#E2E8F0] rounded-lg overflow-hidden w-fit">
                {(['upload', 'link'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setFileMode(m)}
                    className={`px-5 py-2 text-[13px] font-bold transition-colors ${
                      fileMode === m
                        ? 'bg-[#003DA5] text-white'
                        : 'bg-white text-[#94A3B8] hover:text-[#0F172A]'
                    }`}
                  >
                    {m === 'upload' ? 'Upload File' : 'External Link'}
                  </button>
                ))}
              </div>

              {fileMode === 'upload' ? (
                selectedFile ? (
                  /* File selected state */
                  <div
                    className="flex items-center gap-3 rounded-xl p-4"
                    style={{
                      background: 'rgba(4,106,56,0.06)',
                      border: '1px solid rgba(4,106,56,0.2)',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#046A38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                    <span className="text-[13px] font-semibold text-[#065F46] flex-1 truncate">
                      {selectedFile.name}
                    </span>
                    <span className="text-[11px] text-[#94A3B8]" style={{ fontFamily: "'DM Mono', monospace" }}>
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <button onClick={() => setSelectedFile(null)} className="text-[#DC2626] hover:text-[#B91C1C] transition-colors">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  /* Drag-and-drop zone */
                  <div
                    className={`relative border-2 border-dashed rounded-xl text-center transition-colors cursor-pointer ${
                      dragOver
                        ? 'border-[#003DA5] bg-[rgba(0,61,165,0.03)]'
                        : 'border-[#E2E8F0] hover:border-[#003DA5]'
                    }`}
                    style={{ padding: '32px 20px' }}
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); onFilePick(e.dataTransfer.files[0]) }}
                    onClick={() => fileRef.current?.click()}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf"
                      className="hidden"
                      onChange={e => onFilePick(e.target.files?.[0] ?? null)}
                    />
                    <div className="w-12 h-12 rounded-xl bg-[#003DA5] flex items-center justify-center mx-auto mb-3">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                      </svg>
                    </div>
                    <p className="text-[14px] font-semibold text-[#0F172A]">Drop PDF here or click to browse</p>
                    <p className="text-[12px] text-[#94A3B8] mt-1">PDF only &middot; Max size 10MB</p>
                  </div>
                )
              ) : (
                /* External link input */
                <input
                  value={extUrl}
                  onChange={e => setExtUrl(e.target.value)}
                  placeholder="https://example.com/result.pdf"
                  className="w-full px-4 py-2.5 border border-[#E2E8F0] rounded-lg text-[14px] text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#003DA5] focus:ring-4 focus:ring-[#003DA5]/10 transition-colors"
                />
              )}
            </div>

            {/* ── Form Footer ── */}
            <div className="flex flex-col sm:flex-row items-center justify-between pt-4 border-t border-[#E2E8F0] gap-4">
              <span className="text-[12px] text-[#94A3B8]">
                Result will be published immediately after upload
              </span>
              <button
                onClick={handleUpload}
                disabled={uploading || !title.trim() || !contentDate}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3 bg-[#003DA5] text-white rounded-xl text-[14px] font-bold hover:bg-[#002B7A] hover:-translate-y-px transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ boxShadow: '0 4px 14px rgba(0,61,165,0.3)' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17,8 12,3 7,8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                {uploading ? 'Uploading...' : 'Upload Result'}
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            SECTION 3 — PUBLISHED RESULTS TABLE
            ═══════════════════════════════════════════════════════ */}
        <div className="bg-white rounded-[20px] border border-[#E2E8F0] overflow-hidden">
          {/* Table header bar */}
          <div className="px-7 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#E2E8F0]">
            <h2
              className="text-[18px] font-bold text-[#003DA5]"
              style={{ fontFamily: "'Playfair Display', serif" }}
            >
              Published Results
            </h2>
            <div className="relative">
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 text-[#94A3B8] pointer-events-none"
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                value={tableSearch}
                onChange={e => setTableSearch(e.target.value)}
                placeholder="Search results..."
                className="w-[220px] pl-9 pr-3 py-2 border border-[#E2E8F0] rounded-lg text-[13px] text-[#0F172A] placeholder-[#94A3B8] outline-none focus:border-[#003DA5] transition-colors"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-[#F0F4FF]">
                  <th className="px-5 py-3 text-[11px] font-bold text-[#003DA5] uppercase tracking-wider whitespace-nowrap">Issued Date</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-[#003DA5] uppercase tracking-wider">Title</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-[#003DA5] uppercase tracking-wider">File</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-[#003DA5] uppercase tracking-wider">Size</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-[#003DA5] uppercase tracking-wider whitespace-nowrap">Uploaded At</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-[#003DA5] uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-[#94A3B8] text-[14px]">
                      Loading...
                    </td>
                  </tr>
                ) : filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-12 text-[#94A3B8] text-[14px]">
                      No results found
                    </td>
                  </tr>
                ) : (
                  filteredResults.map(r => (
                    <tr key={r.id} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFF] transition-colors">
                      {/* Issued Date badge */}
                      <td className="px-5 py-3.5">
                        <span
                          className="inline-flex items-center gap-[5px] bg-[#F0F4FF] text-[#003DA5] rounded-md whitespace-nowrap"
                          style={{
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 11,
                            padding: '4px 10px',
                            borderRadius: 6,
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          {formatDate(r.date)}
                        </span>
                      </td>

                      {/* Title */}
                      <td
                        className="px-5 py-3.5 text-[14px] font-bold text-[#003DA5]"
                        style={{ fontFamily: "'Playfair Display', serif" }}
                      >
                        {r.title}
                      </td>

                      {/* File name */}
                      <td
                        className="px-5 py-3.5 text-[11px] text-[#94A3B8] max-w-[160px] truncate"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {r.file_name || '\u2014'}
                      </td>

                      {/* Size */}
                      <td
                        className="px-5 py-3.5 text-[12px] text-[#334155]"
                        style={{ fontFamily: "'DM Mono', monospace" }}
                      >
                        {r.file_size ? `${(Number(r.file_size) / 1024 / 1024).toFixed(2)} MB` : '\u2014'}
                      </td>

                      {/* Uploaded At */}
                      <td className="px-5 py-3.5 text-[12px] text-[#94A3B8] whitespace-nowrap">
                        {formatDate(r.uploadedAt)}
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-3.5">
                        <div className="flex gap-2">
                          {/* Download */}
                          <a
                            href={
                              r.url?.startsWith('/')
                                ? `${(process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/v1\/?$/, '')}${r.url}`
                                : r.url
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-[34px] h-[34px] rounded-lg flex items-center justify-center transition-colors text-[#003DA5] hover:bg-[#003DA5] hover:text-white"
                            style={{ background: 'rgba(0,61,165,0.08)' }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7,10 12,15 17,10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                          </a>

                          {/* Delete */}
                          <button
                            onClick={() => setDelTarget(r)}
                            className="w-[34px] h-[34px] rounded-lg flex items-center justify-center transition-colors text-[#DC2626] hover:bg-[#DC2626] hover:text-white"
                            style={{ background: 'rgba(220,38,38,0.08)' }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="3,6 5,6 21,6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
