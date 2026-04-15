'use client'
import React, { useRef } from 'react'
import { SIZES, DOCUMENTS, FormData, StepErrors } from './constants'

interface Props {
  data: FormData
  errors: StepErrors
  onChange: (field: string, value: string) => void
  files: Record<string, File | null>
  onFileChange: (key: string, file: File | null) => void
}

export default function StepSizing({ data, errors, onChange, files, onFileChange }: Props) {
  return (
    <>
      <h3 className="reg-section-header">Sizing</h3>
      <div className="reg-grid reg-grid-4">
        <div className="reg-field">
          <label className="reg-label">Weight (kg)</label>
          <input type="number" className="reg-input" value={data.weight}
            onChange={e => onChange('weight', e.target.value)} placeholder="kg" min="0" />
        </div>
        <div className="reg-field">
          <label className="reg-label">Shoe Size</label>
          <input className="reg-input" value={data.shoeSize}
            onChange={e => onChange('shoeSize', e.target.value)} placeholder="e.g. 9" />
        </div>
        <div className="reg-field">
          <label className="reg-label">Track Suit Size</label>
          <select className="reg-select" value={data.trackSuitSize}
            onChange={e => onChange('trackSuitSize', e.target.value)}>
            <option value="">Select</option>
            {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="reg-field">
          <label className="reg-label">T-Shirt Size</label>
          <select className="reg-select" value={data.tshirtSize}
            onChange={e => onChange('tshirtSize', e.target.value)}>
            <option value="">Select</option>
            {SIZES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="reg-spacer" />

      <h3 className="reg-section-header">Document Upload</h3>
      <div className="reg-uploads">
        {DOCUMENTS.map(doc => (
          <UploadCard
            key={doc.key}
            doc={doc}
            file={files[doc.key] || null}
            error={errors[doc.key]}
            onFileChange={onFileChange}
          />
        ))}
      </div>
    </>
  )
}

interface UploadCardProps {
  doc: typeof DOCUMENTS[number]
  file: File | null
  error?: string
  onFileChange: (key: string, file: File | null) => void
}

function UploadCard({ doc, file, error, onFileChange }: UploadCardProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  const accept = doc.imageOnly ? 'image/jpeg,image/png,image/jpg' : 'image/jpeg,image/png,image/jpg,.pdf'
  const maxBytes = doc.maxMB * 1024 * 1024

  const handleFile = (f: File | null) => {
    if (!f) return
    if (f.size > maxBytes) {
      alert(`File exceeds ${doc.maxMB}MB limit`)
      return
    }
    onFileChange(doc.key, f)
  }

  return (
    <div className={`reg-upload-card ${file ? 'has-file' : ''}`}>
      <div className="reg-upload-name">
        {doc.required ? '✦' : '○'} {doc.name}
        {doc.required && <span className="reg-upload-badge">REQUIRED</span>}
      </div>

      {file ? (
        <div className="reg-upload-result">
          <span style={{ color: '#4ade80', fontSize: '1.1rem' }}>✓</span>
          <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.78rem' }}>
            {file.name.length > 28 ? file.name.slice(0, 25) + '...' : file.name}
          </span>
          <button type="button" onClick={() => onFileChange(doc.key, null)}
            style={{ background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '0.75rem', marginLeft: 'auto' }}>
            Remove
          </button>
        </div>
      ) : (
        <div className="reg-upload-zone" onClick={() => inputRef.current?.click()}>
          <div style={{ fontSize: '1.5rem', marginBottom: 4 }}>📁</div>
          <div>Click to upload</div>
          <div style={{ fontSize: '0.68rem', marginTop: 4 }}>
            {doc.imageOnly ? 'JPG, PNG' : 'PDF, JPG, PNG'} • Max {doc.maxMB}MB
          </div>
          <input ref={inputRef} type="file" accept={accept}
            onChange={e => handleFile(e.target.files?.[0] || null)} />
        </div>
      )}

      {error && <span className="reg-error-msg" style={{ marginTop: 6 }}>⚠ {error}</span>}
    </div>
  )
}
