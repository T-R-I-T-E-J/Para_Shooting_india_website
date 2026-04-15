'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { ArrowLeft, Loader2, Save, Plus, X, FileText, Image } from 'lucide-react'
import RichTextEditor from '@/components/admin/RichTextEditor'

const API_URL = '/api/v1'

export default function EditNewsPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [imageUploading, setImageUploading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    excerpt: '',
    category: 'NEWS',
    status: 'draft',
    featured_image_url: '',
    documents: [] as { url: string; name: string }[],
    tags: '',
    is_featured: false,
    is_pinned: false,
  })

  // ── Load article ─────────────────────────────────────────────────────────

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await fetch(`${API_URL}/news/${params.id}`, { credentials: 'include' })
        if (res.ok) {
          const json = await res.json()
          const data = json.data || json
          setFormData({
            title: data.title || '',
            content: data.content || '',
            excerpt: data.excerpt || '',
            category: data.category || 'NEWS',
            status: data.status || 'draft',
            featured_image_url: data.featured_image_url || data.preview_image_url || '',
            documents: Array.isArray(data.documents) ? data.documents : [],
            tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
            is_featured: data.is_featured || false,
            is_pinned: data.is_pinned || false,
          })
        } else {
          alert('Failed to fetch article details')
          router.push('/admin/news')
        }
      } catch {
        alert('An error occurred while loading the article.')
      } finally {
        setFetching(false)
      }
    }
    fetchArticle()
  }, [params.id, router])

  // ── Handlers ─────────────────────────────────────────────────────────────

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value, type } = e.target
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    setFormData((prev) => ({ ...prev, [name]: val }))
  }

  const handleFeaturedImageUpload = async (file: File | undefined) => {
    if (!file) return
    setImageUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(`${API_URL}/upload/file`, {
        method: 'POST',
        credentials: 'include',
        body: fd,
      })
      if (!res.ok) throw new Error(`Upload error ${res.status}`)
      const json = await res.json()
      const url: string | undefined = json?.data?.file?.url
      if (!url) throw new Error('No URL in response')
      setFormData((prev) => ({ ...prev, featured_image_url: url }))
    } catch {
      alert('Featured image upload failed.')
    } finally {
      setImageUploading(false)
    }
  }

  const handleDocumentUpload = async (file: File | undefined) => {
    if (!file) return
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch(`${API_URL}/upload/file`, {
        method: 'POST',
        credentials: 'include',
        body: fd,
      })
      if (!res.ok) throw new Error(`Upload error ${res.status}`)
      const json = await res.json()
      const url: string | undefined = json?.data?.file?.url
      if (!url) throw new Error('No URL in response')
      setFormData((prev) => ({
        ...prev,
        documents: [...prev.documents, { url, name: file.name }],
      }))
    } catch {
      alert('Document upload failed.')
    }
  }

  const removeDocument = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      documents: prev.documents.filter((_, i) => i !== index),
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload = {
        ...formData,
        tags: formData.tags.split(',').map((t) => t.trim()).filter(Boolean),
        image_urls: [],
        preview_image_url: formData.featured_image_url,
      }
      const res = await fetch(`${API_URL}/news/${params.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        router.push('/admin/news')
        router.refresh()
      } else {
        const err = await res.json()
        alert(`Failed to update: ${err.message || 'Unknown error'}`)
      }
    } catch {
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // ── Loading state ─────────────────────────────────────────────────────────

  if (fetching) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <>
      <DashboardHeader title="Edit News" subtitle={`Editing article #${params.id}`} />
      <div className="p-6 max-w-4xl mx-auto">
        <Link href="/admin/news" className="flex items-center text-sm text-neutral-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to News
        </Link>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* ── Core fields ──────────────────────────────────────────────── */}
          <div className="card space-y-6">
            <h3 className="section-title text-lg border-b pb-2">Article Details</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Title */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Title <span className="text-error">*</span></label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} className="input w-full" placeholder="Enter article title" />
              </div>

              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Category <span className="text-error">*</span></label>
                <select name="category" value={formData.category} onChange={handleChange} className="input w-full">
                  <option value="NEWS">News</option>
                  <option value="ANNOUNCEMENT">Announcement</option>
                  <option value="RESULT">Result</option>
                  <option value="ACHIEVEMENT">Achievement</option>
                  <option value="EVENT">Event</option>
                  <option value="PRESS_RELEASE">Press Release</option>
                </select>
              </div>

              {/* Excerpt */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-neutral-700">Excerpt</label>
                <textarea name="excerpt" value={formData.excerpt} onChange={handleChange} className="input w-full h-20 resize-none" placeholder="Short summary shown in cards and listing page" />
              </div>

              {/* Featured image */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-neutral-700">Featured Image</label>
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Upload area */}
                  <label className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-lg cursor-pointer transition-colors h-40 flex-1 ${formData.featured_image_url ? 'border-primary/40 bg-primary/5' : 'border-neutral-300 bg-neutral-50 hover:border-primary/40 hover:bg-primary/5'}`}>
                    {imageUploading ? (
                      <div className="flex flex-col items-center gap-2 text-neutral-400">
                        <Loader2 className="w-6 h-6 animate-spin text-primary" />
                        <span className="text-xs">Uploading…</span>
                      </div>
                    ) : formData.featured_image_url ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={formData.featured_image_url}
                        alt="Featured"
                        className="h-full w-full object-cover rounded-lg"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-neutral-400">
                        <Image className="w-8 h-8" />
                        <span className="text-sm font-medium">Upload featured image</span>
                        <span className="text-xs text-neutral-400">JPG, PNG, WebP — max 5MB</span>
                      </div>
                    )}
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => { handleFeaturedImageUpload(e.target.files?.[0]); e.target.value = '' }}
                    />
                  </label>

                  {/* Remove */}
                  {formData.featured_image_url && (
                    <div className="flex flex-col justify-center gap-2">
                      <button
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, featured_image_url: '' }))}
                        className="flex items-center gap-1 text-xs text-error hover:underline cursor-pointer w-fit"
                      >
                        <X className="w-3 h-3" /> Remove image
                      </button>
                      <p className="text-xs text-neutral-400">
                        This image will appear on the homepage carousel, news listing, and article hero banner.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Content */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-neutral-700">Content <span className="text-error">*</span></label>
                <RichTextEditor
                  value={formData.content}
                  onChange={(html) => setFormData((p) => ({ ...p, content: html }))}
                  minHeight="360px"
                />
              </div>

              {/* Documents */}
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-medium text-neutral-700">Related Documents</label>
                <div className="space-y-3">
                  {formData.documents.map((doc, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center border border-neutral-200 flex-shrink-0">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate text-neutral-900">{doc.name}</p>
                          <a href={doc.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline truncate block">View / Download</a>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeDocument(idx)} className="text-neutral-400 hover:text-error p-1 cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  <label className="btn-secondary flex items-center gap-2 cursor-pointer w-fit">
                    <Plus className="w-4 h-4" />
                    <span>Upload Document</span>
                    <input type="file" className="hidden" accept=".pdf,.doc,.docx,.xls,.xlsx,.txt,.csv"
                      onChange={(e) => { handleDocumentUpload(e.target.files?.[0]); e.target.value = '' }} />
                  </label>
                </div>
                <p className="text-xs text-neutral-500">Attach PDFs, results sheets, or policy documents.</p>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Tags</label>
                <input type="text" name="tags" value={formData.tags} onChange={handleChange} className="input w-full" placeholder="Comma separated, e.g. Rifle, Gold, 2025" />
              </div>
            </div>

            {/* Publishing settings */}
            <h3 className="section-title text-lg border-b pb-2 pt-4">Publishing Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Status</label>
                <select name="status" value={formData.status} onChange={handleChange} className="input w-full">
                  <option value="draft">Draft</option>
                  <option value="pending_review">Pending Review</option>
                  <option value="published">Published</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Link href="/admin/news" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 cursor-pointer">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Update News
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
