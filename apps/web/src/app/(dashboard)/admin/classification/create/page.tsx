'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { ArrowLeft, Loader2, Upload as UploadIcon, Link as LinkIcon, FileText, Calendar, CheckCircle } from 'lucide-react'
import clsx from 'clsx'
import { useDebounce } from '@/hooks/use-debounce'



export default function CreateClassificationPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [uploadType, setUploadType] = useState<'file' | 'url'>('file')
  const [file, setFile] = useState<File | null>(null)
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([])


  const [formData, setFormData] = useState({
    title: '',
    description: '',
    contentDate: '',
    categoryId: '',
    fileType: 'PDF',
    size: '',
    href: '',
  })

  // Debounced title for potential side effects or validation
  const debouncedTitle = useDebounce(formData.title, 500)

  // Fetch categories that belong to classification page
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const apiUrl = '/api/v1'
        const res = await fetch(`${apiUrl}/categories?page=classification`, { credentials: 'include' })
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]

      // Client-side size validation (10MB)
      const MAX_SIZE_BYTES = 10 * 1024 * 1024; // 10MB
      if (selectedFile.size > MAX_SIZE_BYTES) {
        alert('File size exceeds 10MB limit. Please choose a smaller file.');
        e.target.value = ''; // Clear input
        setFile(null);
        setFormData(prev => ({ ...prev, size: '', fileType: '' }));
        return;
      }

      setFile(selectedFile)

      // Auto-fill details
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
    if (!file) return null;

    const uploadFormData = new FormData()
    uploadFormData.append('document', file)

    const uploadRes = await fetch(`${apiUrl}/upload/document`, {
      method: 'POST',
      headers: {
        // No Authorization header needed, using cookie
      },
      credentials: 'include',
      body: uploadFormData
    })

    if (!uploadRes.ok) {
      throw new Error('File upload failed');
    }

    const uploadJson = await uploadRes.json();

    // Defensive validation of response shape
    if (typeof uploadJson !== 'object' || !uploadJson) {
      throw new Error('Invalid response from upload server');
    }

    // Check for direct URL or nested file object
    let filename: string | undefined;

    if (uploadJson.data?.file?.filename) {
      filename = uploadJson.data.file.filename;
    } else if (uploadJson.file?.filename) {
      filename = uploadJson.file.filename;
    }

    if (!filename) {
      console.error('Unexpected upload response:', uploadJson);
      throw new Error('Upload successful but filename missing in response');
    }

    return `/uploads/documents/${filename}`;
  }

  const createDownloadEntry = async (finalHref: string, apiUrl: string) => {
    // Explicitly exclude any 'category' field that might be in formData
    const { category: _, ...cleanFormData } = formData as any

    const payload = {
      ...cleanFormData,
      href: finalHref,
      category: 'classification', // Hardcode section type - always classification!
      isActive: true
    }

    console.log('🔍 PAYLOAD BEING SENT:', JSON.stringify(payload, null, 2))

    const res = await fetch(`${apiUrl}/downloads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // No Authorization header needed
      },
      credentials: 'include', // Send cookies with request
      body: JSON.stringify(payload)
    })

    if (res.ok) {
      alert('Document added successfully!')
      router.push('/admin/classification')
    } else {
      const error = await res.text()
      alert(`Failed to create: ${error}`)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validate content date
    if (!formData.contentDate) {
      alert('Please set the Document Issue Date before saving.')
      return
    }

    setLoading(true)

    try {
      // Cookies are HttpOnly, so we can't read them via JS.
      // We rely on the browser sending them via credentials: 'include'.
      const apiUrl = '/api/v1'

      let finalHref = formData.href

      // 1. Upload File if selected
      if (uploadType === 'file' && file) {
        const uploadedPath = await uploadDocument(apiUrl);
        if (uploadedPath) finalHref = uploadedPath;
      }

      // 2. Create Download Entry
      await createDownloadEntry(finalHref, apiUrl);

    } catch (error) {
      console.error('Error creating document:', error)
      alert(error instanceof Error ? error.message : 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  // Compute year from content_date
  const issueYear = formData.contentDate
    ? new Date(formData.contentDate).getFullYear()
    : null

  // Format the date for display
  const formattedIssueDate = formData.contentDate
    ? new Date(formData.contentDate).toLocaleDateString('en-GB', {
        day: 'numeric', month: 'long', year: 'numeric'
      })
    : null

  // Today's date for max attribute
  const todayISO = new Date().toISOString().split('T')[0]

  return (
    <>
      <DashboardHeader
        title="Add New Document"
        subtitle="Upload a new document or add a link"
      />

      <div className="p-6 max-w-2xl">
        <Link
          href="/admin/classification"
          className="inline-flex items-center gap-2 text-sm text-neutral-500 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to list
        </Link>

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
                ⚠️ Set the date this document was <strong style={{ color: '#F57C00' }}>ORIGINALLY issued or published</strong> — NOT today&apos;s date. A 2024 rulebook should have Issue Date: 2024, even if uploaded in 2026.
              </div>

              {/* Confirmation (only when date is set) */}
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
                    <strong>Issue Date:</strong> {formattedIssueDate} &nbsp;&nbsp;|&nbsp;&nbsp;
                    <strong>📤 Uploading:</strong> Today
                  </span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Subcategory */}
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
                <p className="text-xs text-neutral-500 mt-1">All documents will appear in Classification section</p>
              </div>

              {/* File Type */}
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
                    required
                  />
                  <p className="text-xs text-neutral-500 mt-1">Accepted formats: PDF, Word, Excel (Max 10MB)</p>
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

            {/* Size (Auto or Manual) */}
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
                    Saving...
                  </>
                ) : 'Save Document'}
              </button>
            </div>

          </form>
        </div>
      </div>
    </>
  )
}
