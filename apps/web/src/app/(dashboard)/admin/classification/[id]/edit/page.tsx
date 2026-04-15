'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { ArrowLeft, Loader2, Upload as UploadIcon, Link as LinkIcon, FileText, Calendar, CheckCircle, Trash2, AlertTriangle } from 'lucide-react'
import clsx from 'clsx'

export default function EditClassificationPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [uploadType, setUploadType] = useState<'file' | 'url'>('url')
  const [file, setFile] = useState<File | null>(null)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [docMeta, setDocMeta] = useState({ createdAt: '', updatedAt: '' })

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentDate: '',
    categoryId: '',
    fileType: 'PDF',
    size: '',
    href: '',
  })

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/v1/categories?page=classification', { credentials: 'include' })
        if (res.ok) {
          const data = await res.json()
          const categoriesArray = Array.isArray(data) ? data : (data.data || [])
          setCategories(categoriesArray)
        }
      } catch (e) {
        console.error("Failed to fetch categories", e)
      }
    }
    fetchCategories()
  }, [])

  // Fetch existing document data
  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const res = await fetch(`/api/v1/downloads/${id}`, { credentials: 'include' })
        if (res.ok) {
          const doc = await res.json()
          setFormData({
            title: doc.title || '',
            description: doc.description || '',
            contentDate: doc.contentDate ? doc.contentDate.split('T')[0] : '',
            categoryId: doc.categoryId || '',
            fileType: doc.fileType || 'PDF',
            size: doc.size || '',
            href: doc.href || '',
          })
          setDocMeta({
            createdAt: doc.createdAt || '',
            updatedAt: doc.updatedAt || '',
          })
          // If it has an href that starts with http, it's likely an external link
          if (doc.href && doc.href.startsWith('http')) {
            setUploadType('url')
          } else {
            setUploadType('file')
          }
        } else {
          alert('Document not found')
          router.push('/admin/classification')
        }
      } catch (e) {
        console.error('Failed to fetch document:', e)
        alert('Failed to load document')
        router.push('/admin/classification')
      } finally {
        setFetching(false)
      }
    }
    if (id) fetchDocument()
  }, [id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      const MAX_SIZE_BYTES = 10 * 1024 * 1024
      if (selectedFile.size > MAX_SIZE_BYTES) {
        alert('File size exceeds 10MB limit. Please choose a smaller file.')
        e.target.value = ''
        setFile(null)
        return
      }

      setFile(selectedFile)
      const sizeInMB = (selectedFile.size / (1024 * 1024)).toFixed(2)
      setFormData(prev => ({
        ...prev,
        size: `${sizeInMB} MB`,
        fileType: getFileType(selectedFile.name)
      }))
    }
  }

  const getFileType = (filename: string) => {
    const ext = filename.split('.').pop()?.toUpperCase() || 'FILE'
    return ext === 'DOCX' || ext === 'DOC' ? 'DOC' : ext
  }

  const uploadDocument = async (apiUrl: string) => {
    if (!file) return null

    const uploadFormData = new FormData()
    uploadFormData.append('document', file)

    const uploadRes = await fetch(`${apiUrl}/upload/document`, {
      method: 'POST',
      credentials: 'include',
      body: uploadFormData
    })

    if (!uploadRes.ok) throw new Error('File upload failed')

    const uploadJson = await uploadRes.json()
    let filename: string | undefined
    if (uploadJson.data?.file?.filename) {
      filename = uploadJson.data.file.filename
    } else if (uploadJson.file?.filename) {
      filename = uploadJson.file.filename
    }

    if (!filename) throw new Error('Upload successful but filename missing in response')
    return `/uploads/documents/${filename}`
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.contentDate) {
      alert('Please set the Document Issue Date before saving.')
      return
    }

    setLoading(true)

    try {
      const apiUrl = '/api/v1'
      let finalHref = formData.href

      // Upload new file if selected
      if (uploadType === 'file' && file) {
        const uploadedPath = await uploadDocument(apiUrl)
        if (uploadedPath) finalHref = uploadedPath
      }

      const { category: _, ...cleanFormData } = formData as any

      const payload = {
        ...cleanFormData,
        href: finalHref,
        category: 'classification',
      }

      const res = await fetch(`${apiUrl}/downloads/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload),
      })

      if (res.ok) {
        alert('✅ Document updated successfully')
        router.push('/admin/classification')
      } else {
        const error = await res.text()
        alert(`Failed to update: ${error}`)
      }
    } catch (error) {
      console.error('Error updating document:', error)
      alert(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      const res = await fetch(`/api/v1/downloads/${id}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
      })
      if (res.ok) {
        alert('Document deleted successfully')
        router.push('/admin/classification')
      } else {
        alert('Failed to delete document')
      }
    } catch (e) {
      alert('An error occurred while deleting')
    } finally {
      setDeleting(false)
      setShowDeleteModal(false)
    }
  }

  // Computed
  const issueYear = formData.contentDate
    ? new Date(formData.contentDate).getFullYear()
    : null

  const formattedIssueDate = formData.contentDate
    ? new Date(formData.contentDate).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : null

  const todayISO = new Date().toISOString().split('T')[0]

  const formatMetaDate = (d: string) => {
    if (!d) return '—'
    return new Date(d).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  if (fetching) {
    return (
      <>
        <DashboardHeader title="Edit Document" subtitle="Loading..." />
        <div className="p-6 flex justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </>
    )
  }

  return (
    <>
      <DashboardHeader
        title="Edit Document"
        subtitle="Update an existing classification document"
      />

      <div className="p-6 max-w-2xl">
        <Link
          href="/admin/classification"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to list
        </Link>

        {/* Meta */}
        <div className="flex flex-wrap gap-6 mb-4 text-xs text-neutral-400">
          <div>📤 <strong>Uploaded:</strong> {formatMetaDate(docMeta.createdAt)}</div>
          <div>✏️ <strong>Last updated:</strong> {formatMetaDate(docMeta.updatedAt)}</div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Title */}
            <div>
              <label className="label" htmlFor="title">Document Title</label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g. National Shooting Rules 2025"
              />
            </div>

            {/* Description */}
            <div>
              <label className="label" htmlFor="description">Description</label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleChange}
                className="input w-full min-h-[100px]"
                placeholder="Brief description of the document..."
              />
            </div>

            {/* ── DOCUMENT ISSUE DATE ── */}
            <div
              style={{
                background: 'rgba(200,164,21,0.06)',
                border: '1.5px solid rgba(200,164,21,0.20)',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" style={{ color: '#C8A415' }} />
                  <span
                    style={{
                      color: '#C8A415',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                    }}
                  >
                    Document Issue Date
                  </span>
                </div>
                <span
                  style={{
                    color: '#C8A415',
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  Required
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5">Issue Date *</label>
                  <input
                    id="contentDate"
                    name="contentDate"
                    type="date"
                    required
                    max={todayISO}
                    value={formData.contentDate}
                    onChange={handleChange}
                    style={{
                      background: 'rgba(0,0,0,0.3)',
                      border: '1px solid rgba(255,255,255,0.12)',
                      borderRadius: '8px',
                      color: '#fff',
                      padding: '10px 14px',
                      width: '100%',
                      fontSize: '14px',
                    }}
                    className="focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs text-neutral-400 mb-1.5">Year (auto-filled)</label>
                  <div
                    style={{
                      background: 'rgba(0,0,0,0.15)',
                      border: '1px solid rgba(255,255,255,0.08)',
                      borderRadius: '8px',
                      padding: '10px 14px',
                      color: '#C8A415',
                      fontSize: '18px',
                      fontFamily: "'DM Mono', Consolas, monospace",
                      fontWeight: 600,
                    }}
                  >
                    {issueYear || '—'}
                  </div>
                </div>
              </div>

              {/* Warning */}
              <div
                style={{
                  background: 'rgba(245,124,0,0.08)',
                  border: '1px solid rgba(245,124,0,0.2)',
                  borderRadius: '8px',
                  padding: '10px 14px',
                  fontSize: '12px',
                  color: 'rgba(255,255,255,0.65)',
                  lineHeight: '1.5',
                }}
              >
                ⚠️ Set the date this document was <strong style={{ color: '#F57C00' }}>ORIGINALLY issued or published</strong> — NOT today&apos;s date.
              </div>

              {formattedIssueDate && (
                <div
                  style={{
                    background: 'rgba(46,125,50,0.10)',
                    border: '1px solid rgba(46,125,50,0.25)',
                    borderRadius: '8px',
                    padding: '10px 14px',
                    fontSize: '12px',
                    color: 'rgba(255,255,255,0.75)',
                    marginTop: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                  }}
                >
                  <CheckCircle className="w-4 h-4 shrink-0" style={{ color: '#2E7D32' }} />
                  <span>
                    <strong>Issue Date:</strong> {formattedIssueDate}
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="label" htmlFor="categoryId">Subcategory (Optional)</label>
                <select
                  id="categoryId"
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className="input w-full"
                >
                  <option value="">No subcategory</option>
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="fileType">File Type</label>
                <input
                  id="fileType"
                  name="fileType"
                  type="text"
                  required
                  value={formData.fileType}
                  onChange={handleChange}
                  className="input w-full uppercase"
                  placeholder="e.g. PDF, DOCX"
                />
              </div>
            </div>

            {/* Upload Type Toggle */}
            <div>
              <label className="label">Document Source</label>
              <div className="flex gap-4 mb-4">
                <button
                  type="button"
                  onClick={() => setUploadType('file')}
                  className={clsx(
                    'flex-1 flex items-center justify-center gap-2 py-3 border rounded-lg transition-all',
                    uploadType === 'file'
                      ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                      : 'border-neutral-200 hover:bg-neutral-50 text-neutral-600'
                  )}
                >
                  <UploadIcon className="w-4 h-4" />
                  Upload File
                </button>
                <button
                  type="button"
                  onClick={() => setUploadType('url')}
                  className={clsx(
                    'flex-1 flex items-center justify-center gap-2 py-3 border rounded-lg transition-all',
                    uploadType === 'url'
                      ? 'border-primary bg-primary/5 text-primary ring-1 ring-primary'
                      : 'border-neutral-200 hover:bg-neutral-50 text-neutral-600'
                  )}
                >
                  <LinkIcon className="w-4 h-4" />
                  External Link
                </button>
              </div>

              {uploadType === 'file' ? (
                <div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="input w-full p-2"
                    accept=".pdf,.doc,.docx,.xls,.xlsx"
                  />
                  <p className="text-xs text-neutral-500 mt-1">Leave empty to keep existing file. Max 10MB.</p>
                </div>
              ) : (
                <div>
                  <input
                    type="url"
                    name="href"
                    value={formData.href}
                    onChange={handleChange}
                    className="input w-full"
                    placeholder="https://example.com/document.pdf"
                    required
                  />
                </div>
              )}
            </div>

            {/* Size */}
            <div>
              <label className="label" htmlFor="size">Size (Optional)</label>
              <input
                id="size"
                name="size"
                type="text"
                value={formData.size}
                onChange={handleChange}
                className="input w-full"
                placeholder="e.g. 2.5 MB"
              />
            </div>

            {/* Submit */}
            <div className="flex justify-end pt-4">
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full md:w-auto min-w-[150px]"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Updating...
                  </>
                ) : 'Update Document'}
              </button>
            </div>

          </form>
        </div>

        {/* Danger Zone — Delete */}
        <div
          className="mt-8 p-5 rounded-xl"
          style={{
            background: 'rgba(211,47,47,0.06)',
            border: '1.5px solid rgba(211,47,47,0.2)',
          }}
        >
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="text-sm font-semibold text-red-400">Danger Zone</h3>
          </div>
          <p className="text-xs text-neutral-400 mb-4">
            Permanently delete this document. This action cannot be undone.
          </p>
          <button
            type="button"
            onClick={() => setShowDeleteModal(true)}
            className="px-4 py-2 text-sm font-medium text-red-400 border border-red-400/30 rounded-lg hover:bg-red-500/10 transition-colors"
          >
            <Trash2 className="w-4 h-4 inline mr-2" />
            Delete Document
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div
            className="rounded-xl p-6 max-w-md w-full shadow-2xl"
            style={{ background: '#1a2332', border: '1px solid rgba(255,255,255,0.1)' }}
          >
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <h3 className="text-lg font-semibold text-white">Delete Document?</h3>
            </div>
            <p className="text-sm text-neutral-400 mb-6">
              Are you sure you want to permanently delete <strong className="text-white">&quot;{formData.title}&quot;</strong>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 text-sm rounded-lg border border-neutral-600 text-neutral-300 hover:bg-neutral-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {deleting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin inline mr-1" />
                    Deleting...
                  </>
                ) : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
