'use client'

import React, { useState, useEffect, useMemo, useRef } from 'react'

/* ── Types ── */
type ResultRow = {
  id: number
  title: string
  description?: string
  file_name: string
  file_url: string
  file_size: string
  venue?: string
  content_date: string
  content_year: number
  created_at: string
  // Legacy field mappings from API
  date?: string
  fileName?: string
  fileSize?: number | string
  uploadedAt?: string
  url?: string
}

/* ── Date helpers (UTC-safe — never show raw ISO) ── */
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

function formatFileSize(size: number | string | undefined): string {
  if (!size) return '\u2014'
  const num = typeof size === 'string' ? parseFloat(size) : size
  if (isNaN(num)) return typeof size === 'string' ? size : '\u2014'
  if (num > 1024 * 1024) return `${(num / 1024 / 1024).toFixed(2)} MB`
  if (num > 1024) return `${(num / 1024).toFixed(1)} KB`
  return `${num} B`
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
const AdminScoresPage = () => {
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

  /* ── Normalize API response rows ── */
  function normalizeResult(r: Record<string, unknown>): ResultRow {
    return {
      id: (r.id as number) ?? 0,
      title: (r.title as string) ?? '',
      description: (r.description as string) ?? undefined,
      file_name: (r.file_name as string) ?? (r.fileName as string) ?? '',
      file_url: (r.file_url as string) ?? (r.url as string) ?? '',
      file_size: String(r.file_size ?? r.fileSize ?? ''),
      venue: (r.venue as string) ?? undefined,
      content_date: (r.content_date as string) ?? (r.date as string) ?? '',
      content_year: (r.content_year as number) ?? 0,
      created_at: (r.created_at as string) ?? (r.uploadedAt as string) ?? '',
    }
  }

  /* ── API: Fetch ── */
  const fetchResults = async () => {
    try {
      const r = await fetch('/api/v1/results', { cache: 'no-store', credentials: 'include' })
      const j = await r.json()
      const raw = Array.isArray(j) ? j : j.data ?? []
      setResults(raw.map((item: Record<string, unknown>) => normalizeResult(item)))
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
    if (fileRef.current) fileRef.current.value = ''
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
      fd.append('date', new Date(contentDate).toISOString())
      if (desc.trim()) fd.append('description', desc.trim())
      if (fileMode === 'upload' && selectedFile) fd.append('file', selectedFile)
      if (fileMode === 'link') fd.append('external_url', extUrl.trim())

      const r = await fetch('/api/v1/results/upload', { method: 'POST', body: fd, credentials: 'include' })
      if (!r.ok) {
        const e = await r.json().catch(() => ({}))
        throw new Error((e as { message?: string }).message || `Error ${r.status}`)
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
      const r = await fetch(`/api/v1/results/${delTarget.id}`, { method: 'DELETE', credentials: 'include' })
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

  /* Helper: resolve download URL */
  const resolveFileUrl = (r: ResultRow) => {
    const url = r.file_url
    if (!url) return '#'
    if (url.startsWith('/')) {
      const base = (process.env.NEXT_PUBLIC_API_URL || '').replace(/\/api\/v1\/?$/, '')
      return `${base}${url}`
    }
    return url
  }

  /* ══════════════════════════════════════════════════════════
     RENDER
     ══════════════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen" style={{ background: '#F4F6FB' }}>
      {/* Keyframe animations + font imports */}
      <style dangerouslySetInnerHTML={{ __html: `
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700&family=DM+Mono:wght@400;500&display=swap');
        @keyframes toastSlideIn{from{transform:translateX(120%);opacity:0}to{transform:translateX(0);opacity:1}}
        .toast-anim{animation:toastSlideIn .3s ease}
      `}} />

      {/* ── Toasts ── */}
      <div className="fixed top-6 right-6 z-[999] flex flex-col gap-3" style={{ pointerEvents: 'none' }}>
        {toasts.map(t => (
          <div
            key={t.id}
            className="toast-anim flex items-center gap-2"
            style={{
              pointerEvents: 'auto',
              background: '#ffffff',
              borderRadius: 12,
              padding: '14px 18px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
              borderLeft: `4px solid ${t.ok ? '#046A38' : '#DC2626'}`,
              minWidth: 280,
              fontSize: 13,
              fontWeight: 600,
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
            onClick={e => e.stopPropagation()}
            style={{
              background: '#ffffff',
              borderRadius: 20,
              maxWidth: 400,
              width: '100%',
              padding: 32,
            }}
          >
            <h3
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 20,
                fontWeight: 700,
                color: '#0F172A',
                marginBottom: 12,
              }}
            >
              Delete Result
            </h3>
            <p style={{ color: '#334155', fontSize: 14, marginBottom: 24, lineHeight: 1.6 }}>
              Are you sure you want to delete <strong>&quot;{delTarget.title}&quot;</strong>?
              This action cannot be undone and the file will be removed from the public website immediately.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setDelTarget(null)}
                disabled={deleting}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #E2E8F0',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 600,
                  color: '#334155',
                  background: '#ffffff',
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                style={{
                  padding: '10px 20px',
                  background: '#DC2626',
                  color: '#ffffff',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 700,
                  border: 'none',
                  cursor: deleting ? 'not-allowed' : 'pointer',
                  opacity: deleting ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}
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
      <div style={{ background: '#ffffff', borderBottom: '1px solid #E2E8F0', padding: '24px 32px' }}>
        <h1
          style={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 24,
            fontWeight: 700,
            color: '#003DA5',
            margin: 0,
          }}
        >
          Results Management
        </h1>
        <p style={{ fontSize: 13, color: '#94A3B8', marginTop: 4 }}>
          Upload and manage official competition result sheets
        </p>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 24px' }}>

        {/* ═══════════════════════════════════════════════════════
            SECTION 2 — UPLOAD FORM CARD
            ═══════════════════════════════════════════════════════ */}
        <div
          style={{
            background: '#ffffff',
            borderRadius: 20,
            border: '1px solid #E2E8F0',
            boxShadow: '0 2px 12px rgba(0,61,165,0.06)',
            overflow: 'hidden',
            marginBottom: 32,
          }}
        >
          {/* Card Header — dark navy gradient */}
          <div
            style={{
              background: 'linear-gradient(135deg, #001A4D, #003DA5)',
              padding: '24px 28px',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
            }}
          >
            <div
              style={{
                width: 44,
                height: 44,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="17,8 12,3 7,8"/>
                <line x1="12" y1="3" x2="12" y2="15"/>
              </svg>
            </div>
            <div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: '#ffffff' }}>
                Upload New Result
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
                Add a new championship or selection trial result
              </div>
            </div>
          </div>

          {/* Form Body */}
          <div style={{ padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>

            {/* ROW 1 — Title + Venue */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                  Competition Title *
                </label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. 68th National Championship"
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    border: '1px solid #E2E8F0',
                    borderRadius: 8,
                    fontSize: 14,
                    color: '#0F172A',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                  Venue / Location
                </label>
                <input
                  value={venue}
                  onChange={e => setVenue(e.target.value)}
                  placeholder="e.g. Dr. Karni Singh Ranges, Delhi"
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    border: '1px solid #E2E8F0',
                    borderRadius: 8,
                    fontSize: 14,
                    color: '#0F172A',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>
            </div>

            {/* ROW 2 — Description */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                Description
              </label>
              <textarea
                value={desc}
                onChange={e => setDesc(e.target.value)}
                placeholder="Brief description of the competition..."
                style={{
                  width: '100%',
                  padding: '10px 16px',
                  border: '1px solid #E2E8F0',
                  borderRadius: 8,
                  fontSize: 14,
                  color: '#0F172A',
                  outline: 'none',
                  resize: 'none',
                  minHeight: 90,
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {/* ── ISSUED DATE BLOCK (gold-highlighted) ── */}
            <div
              style={{
                background: 'rgba(200,164,21,0.05)',
                border: '1.5px solid rgba(200,164,21,0.22)',
                borderRadius: 14,
                padding: '18px 20px',
                marginBottom: 18,
              }}
            >
              {/* Section label */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#C8A415" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="4" width="18" height="18" rx="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
                <span style={{ color: '#C8A415', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                  Championship / Issued Date
                </span>
              </div>

              {/* Two-column: Date input + Year display */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5" style={{ marginBottom: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 6 }}>
                    Issued Date *
                  </label>
                  <input
                    type="date"
                    value={contentDate}
                    onChange={e => onDateChange(e.target.value)}
                    max={todayStr()}
                    style={{
                      width: '100%',
                      padding: '10px 16px',
                      border: '1px solid #E2E8F0',
                      borderRadius: 8,
                      fontSize: 14,
                      color: '#0F172A',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                  />
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#F4F6FB',
                    border: '1.5px solid #E2E8F0',
                    borderRadius: 10,
                    padding: '10px 18px',
                    textAlign: 'center',
                  }}
                >
                  <span style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: '#003DA5' }}>
                    {contentYear ?? '\u2014'}
                  </span>
                  <span style={{ fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' }}>
                    Year
                  </span>
                </div>
              </div>

              {/* Warning box (always visible) */}
              <div
                style={{
                  background: 'rgba(245,124,0,0.07)',
                  border: '1px solid rgba(245,124,0,0.2)',
                  borderRadius: 10,
                  padding: '12px 14px',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 10,
                  marginBottom: 12,
                }}
              >
                <svg style={{ marginTop: 2, flexShrink: 0 }} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/>
                  <line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
                <span style={{ fontSize: 12, color: '#92400E', lineHeight: 1.6 }}>
                  Set the date the competition was actually held &mdash; NOT today&apos;s date.
                  A December 2025 championship should have Issued Date: Dec 2025, even if uploaded in 2026.
                </span>
              </div>

              {/* Confirmation row (visible only when date selected) */}
              {contentDate && (
                <div
                  style={{
                    background: 'rgba(4,106,56,0.07)',
                    border: '1px solid rgba(4,106,56,0.2)',
                    borderRadius: 10,
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#046A38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20,6 9,17 4,12"/>
                  </svg>
                  <span style={{ fontSize: 12, color: '#065F46' }}>
                    Issued: <strong>{formatLocalDate(contentDate)}</strong> &middot; Uploading today: <strong>{todayFormatted()}</strong>
                  </span>
                </div>
              )}
            </div>

            {/* ── FILE UPLOAD ── */}
            <div>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                Result File (PDF) *
              </label>

              {/* Toggle tabs */}
              <div style={{ display: 'flex', marginBottom: 16, border: '1px solid #E2E8F0', borderRadius: 8, overflow: 'hidden', width: 'fit-content' }}>
                {(['upload', 'link'] as const).map(m => (
                  <button
                    key={m}
                    onClick={() => setFileMode(m)}
                    style={{
                      padding: '8px 20px',
                      fontSize: 13,
                      fontWeight: 700,
                      border: 'none',
                      cursor: 'pointer',
                      background: fileMode === m ? '#003DA5' : '#ffffff',
                      color: fileMode === m ? '#ffffff' : '#94A3B8',
                      transition: 'all 0.15s',
                    }}
                  >
                    {m === 'upload' ? 'Upload File' : 'External Link'}
                  </button>
                ))}
              </div>

              {fileMode === 'upload' ? (
                selectedFile ? (
                  /* File selected state */
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      borderRadius: 12,
                      padding: 16,
                      background: 'rgba(4,106,56,0.06)',
                      border: '1px solid rgba(4,106,56,0.2)',
                    }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#046A38" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20,6 9,17 4,12"/>
                    </svg>
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#065F46', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {selectedFile.name}
                    </span>
                    <span style={{ fontSize: 11, color: '#94A3B8', fontFamily: "'DM Mono', monospace" }}>
                      {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                    </span>
                    <button
                      onClick={() => setSelectedFile(null)}
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#DC2626', padding: 0, display: 'flex' }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                ) : (
                  /* Drag-and-drop zone */
                  <div
                    style={{
                      position: 'relative',
                      border: `2px dashed ${dragOver ? '#003DA5' : '#E2E8F0'}`,
                      borderRadius: 12,
                      padding: '32px 20px',
                      textAlign: 'center',
                      cursor: 'pointer',
                      background: dragOver ? 'rgba(0,61,165,0.03)' : 'transparent',
                      transition: 'all 0.15s',
                    }}
                    onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={e => { e.preventDefault(); setDragOver(false); onFilePick(e.dataTransfer.files[0]) }}
                    onClick={() => fileRef.current?.click()}
                  >
                    <input
                      ref={fileRef}
                      type="file"
                      accept=".pdf"
                      style={{ display: 'none' }}
                      onChange={e => onFilePick(e.target.files?.[0] ?? null)}
                    />
                    <div
                      style={{
                        width: 48,
                        height: 48,
                        borderRadius: 12,
                        background: '#003DA5',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 12px',
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                        <polyline points="14,2 14,8 20,8"/>
                      </svg>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 600, color: '#0F172A', margin: 0 }}>Drop PDF here or click to browse</p>
                    <p style={{ fontSize: 12, color: '#94A3B8', marginTop: 4 }}>PDF only &middot; Max size 10MB</p>
                  </div>
                )
              ) : (
                /* External link input */
                <input
                  value={extUrl}
                  onChange={e => setExtUrl(e.target.value)}
                  placeholder="https://example.com/result.pdf"
                  style={{
                    width: '100%',
                    padding: '10px 16px',
                    border: '1px solid #E2E8F0',
                    borderRadius: 8,
                    fontSize: 14,
                    color: '#0F172A',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              )}
            </div>

            {/* ── Form Footer ── */}
            <div
              className="flex flex-col sm:flex-row items-center justify-between gap-4"
              style={{ paddingTop: 16, borderTop: '1px solid #E2E8F0' }}
            >
              <span style={{ fontSize: 12, color: '#94A3B8' }}>
                Result will be published immediately after upload
              </span>
              <button
                onClick={handleUpload}
                disabled={uploading || !title.trim() || !contentDate}
                className="w-full sm:w-auto"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                  padding: '12px 28px',
                  background: '#003DA5',
                  color: '#ffffff',
                  borderRadius: 12,
                  fontSize: 14,
                  fontWeight: 700,
                  border: 'none',
                  cursor: uploading || !title.trim() || !contentDate ? 'not-allowed' : 'pointer',
                  opacity: uploading || !title.trim() || !contentDate ? 0.5 : 1,
                  boxShadow: '0 4px 14px rgba(0,61,165,0.3)',
                  transition: 'all 0.15s',
                }}
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
        <div
          style={{
            background: '#ffffff',
            borderRadius: 20,
            border: '1px solid #E2E8F0',
            overflow: 'hidden',
          }}
        >
          {/* Table header bar */}
          <div
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            style={{ padding: '20px 28px', borderBottom: '1px solid #E2E8F0' }}
          >
            <h2
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: 18,
                fontWeight: 700,
                color: '#003DA5',
                margin: 0,
              }}
            >
              Published Results
            </h2>
            <div style={{ position: 'relative' }}>
              <svg
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#94A3B8', pointerEvents: 'none' }}
                width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="8"/>
                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <input
                value={tableSearch}
                onChange={e => setTableSearch(e.target.value)}
                placeholder="Search results..."
                style={{
                  width: 220,
                  paddingLeft: 36,
                  paddingRight: 12,
                  paddingTop: 8,
                  paddingBottom: 8,
                  border: '1px solid #E2E8F0',
                  borderRadius: 8,
                  fontSize: 13,
                  color: '#0F172A',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', textAlign: 'left', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#F0F4FF' }}>
                  <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#003DA5', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Issued Date</th>
                  <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#003DA5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Title</th>
                  <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#003DA5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>File</th>
                  <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#003DA5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Size</th>
                  <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#003DA5', textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>Uploaded At</th>
                  <th style={{ padding: '12px 20px', fontSize: 11, fontWeight: 700, color: '#003DA5', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '48px 20px', color: '#94A3B8', fontSize: 14 }}>
                      Loading...
                    </td>
                  </tr>
                ) : filteredResults.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '48px 20px', color: '#94A3B8', fontSize: 14 }}>
                      No results found
                    </td>
                  </tr>
                ) : (
                  filteredResults.map(r => (
                    <tr
                      key={r.id}
                      style={{ borderBottom: '1px solid #E2E8F0', transition: 'background 0.15s' }}
                      onMouseEnter={e => (e.currentTarget.style.background = '#F8FAFF')}
                      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                      {/* Issued Date badge */}
                      <td style={{ padding: '14px 20px' }}>
                        <span
                          style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: 5,
                            background: '#F0F4FF',
                            color: '#003DA5',
                            fontFamily: "'DM Mono', monospace",
                            fontSize: 11,
                            padding: '4px 10px',
                            borderRadius: 6,
                            whiteSpace: 'nowrap',
                          }}
                        >
                          <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <rect x="3" y="4" width="18" height="18" rx="2"/>
                            <line x1="16" y1="2" x2="16" y2="6"/>
                            <line x1="8" y1="2" x2="8" y2="6"/>
                            <line x1="3" y1="10" x2="21" y2="10"/>
                          </svg>
                          {formatDate(r.content_date)}
                        </span>
                      </td>

                      {/* Title */}
                      <td style={{ padding: '14px 20px', fontFamily: "'Playfair Display', serif", fontSize: 14, fontWeight: 700, color: '#003DA5' }}>
                        {r.title}
                      </td>

                      {/* File name */}
                      <td style={{ padding: '14px 20px', fontFamily: "'DM Mono', monospace", fontSize: 11, color: '#94A3B8', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {r.file_name || '\u2014'}
                      </td>

                      {/* Size */}
                      <td style={{ padding: '14px 20px', fontFamily: "'DM Mono', monospace", fontSize: 12, color: '#334155' }}>
                        {formatFileSize(r.file_size)}
                      </td>

                      {/* Uploaded At */}
                      <td style={{ padding: '14px 20px', fontSize: 12, color: '#94A3B8', whiteSpace: 'nowrap' }}>
                        {formatDate(r.created_at)}
                      </td>

                      {/* Actions */}
                      <td style={{ padding: '14px 20px' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          {/* Download */}
                          <a
                            href={resolveFileUrl(r)}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 8,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(0,61,165,0.08)',
                              color: '#003DA5',
                              transition: 'all 0.15s',
                              textDecoration: 'none',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#003DA5'; e.currentTarget.style.color = '#ffffff' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(0,61,165,0.08)'; e.currentTarget.style.color = '#003DA5' }}
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
                            style={{
                              width: 34,
                              height: 34,
                              borderRadius: 8,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              background: 'rgba(220,38,38,0.08)',
                              color: '#DC2626',
                              border: 'none',
                              cursor: 'pointer',
                              transition: 'all 0.15s',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#DC2626'; e.currentTarget.style.color = '#ffffff' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; e.currentTarget.style.color = '#DC2626' }}
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

export default AdminScoresPage
