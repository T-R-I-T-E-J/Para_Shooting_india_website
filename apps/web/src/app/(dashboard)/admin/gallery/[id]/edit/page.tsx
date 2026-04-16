'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { Upload, X, Loader2, ArrowLeft } from 'lucide-react'

const API_URL = '/api/v1'

export default function EditCollectionPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [featuredFile, setFeaturedFile] = useState<File | null>(null)
  const [featuredPreview, setFeaturedPreview] = useState<string | null>(null)
  const [form, setForm] = useState({
    title: '',
    short_description: '',
    full_description: '',
    event_date: '',
  })
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true
    const fetchCollection = async () => {
      try {
        const res = await fetch(`${API_URL}/media-collections/${id}`, {
          credentials: 'include',
          cache: 'no-store',
        })
        if (!res.ok) throw new Error('Collection not found')
        const json = await res.json()
        const data = json.data || json

        if (isMounted) {
          setForm({
            title: data.title || '',
            short_description: data.short_description || '',
            full_description: data.full_description || '',
            event_date: data.event_date ? new Date(data.event_date).toISOString().split('T')[0] : '',
          })
          if (data.featured_image) {
            setFeaturedPreview(data.featured_image)
          }
          setLoading(false)
        }
      } catch (err: any) {
        if (isMounted) {
          setError(err.message)
          setLoading(false)
        }
      }
    }
    fetchCollection()
    return () => { isMounted = false }
  }, [id])

  const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFeaturedFile(file)
    setFeaturedPreview(URL.createObjectURL(file))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.title.trim()) {
      setError('Title is required')
      return
    }

    setSaving(true)

    try {
      // 1. Update collection details
      const updateRes = await fetch(`${API_URL}/media-collections/${id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          short_description: form.short_description.trim() || null,
          full_description: form.full_description.trim() || null,
          event_date: form.event_date || null,
        }),
      })

      if (!updateRes.ok) {
        const err = await updateRes.json().catch(() => ({}))
        throw new Error(err.message || 'Failed to update collection')
      }

      // 2. Upload new featured image if selected
      if (featuredFile) {
        const fd = new FormData()
        fd.append('image', featuredFile)
        await fetch(`${API_URL}/media-collections/${id}/featured-image`, {
          method: 'POST',
          credentials: 'include',
          body: fd,
        })
      }

      router.push(`/admin/gallery/${id}`)
      router.refresh()
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <>
      <DashboardHeader
        title="Edit Collection"
        subtitle="Update the details or featured image of this collection"
      />

      <div className="p-6 max-w-3xl">
        <Link
          href={`/admin/gallery/${id}`}
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Collection Details
        </Link>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-3 bg-error/10 border border-error/30 text-error text-sm rounded">
              {error}
            </div>
          )}

          {/* Featured Image */}
          <div className="card">
            <h3 className="font-heading font-semibold text-primary mb-4">Featured Image</h3>
            <div className="flex gap-4 items-start">
              <div
                className="relative w-40 h-28 border-2 border-dashed border-neutral-300 flex items-center justify-center overflow-hidden bg-neutral-50 shrink-0 cursor-pointer hover:bg-neutral-100 transition-colors rounded"
                onClick={() => document.getElementById('featured-input')?.click()}
              >
                {featuredPreview ? (
                  <>
                    <img src={featuredPreview} alt="Preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); setFeaturedFile(null); setFeaturedPreview(null) }}
                      className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-0.5"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </>
                ) : (
                  <div className="text-center p-2">
                    <Upload className="w-6 h-6 mx-auto text-neutral-400 mb-1" />
                    <span className="text-xs text-neutral-400">Click to replace</span>
                  </div>
                )}
                <input
                  id="featured-input"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFeaturedChange}
                />
              </div>
              <p className="text-xs text-neutral-500 leading-relaxed mt-2">
                This image will be displayed on the gallery listing cards.<br />
                Recommended: 16:9 ratio, at least 800×450px.
              </p>
            </div>
          </div>

          {/* Details */}
          <div className="card space-y-5">
            <h3 className="font-heading font-semibold text-primary">Collection Details</h3>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">
                Title <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="input w-full"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">
                Short Description <span className="text-neutral-400 font-normal">(card preview)</span>
              </label>
              <textarea
                value={form.short_description}
                onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                rows={2}
                className="input w-full resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">
                Full Description <span className="text-neutral-400 font-normal">(detail page)</span>
              </label>
              <textarea
                value={form.full_description}
                onChange={(e) => setForm({ ...form, full_description: e.target.value })}
                rows={5}
                className="input w-full resize-y"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">
                Event Date
              </label>
              <input
                type="date"
                value={form.event_date}
                onChange={(e) => setForm({ ...form, event_date: e.target.value })}
                className="input"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex items-center gap-2 disabled:opacity-60"
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Changes'
              )}
            </button>
            <Link href={`/admin/gallery/${id}`} className="btn-outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
