'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { Upload, X, Loader2, ArrowLeft } from 'lucide-react'

const API_URL = '/api/v1'

export default function CreateCollectionPage() {
  const router = useRouter()
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
      // 1. Create collection
      const createRes = await fetch(`${API_URL}/media-collections`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: form.title.trim(),
          short_description: form.short_description.trim() || undefined,
          full_description: form.full_description.trim() || undefined,
          event_date: form.event_date || undefined,
        }),
      })

      if (!createRes.ok) {
        const err = await createRes.json().catch(() => ({}))
        throw new Error(err.message || 'Failed to create collection')
      }

      const created = await createRes.json()
      const collectionId: number = created.id

      // 2. Upload featured image if selected
      if (featuredFile) {
        const fd = new FormData()
        fd.append('image', featuredFile)
        await fetch(`${API_URL}/media-collections/${collectionId}/featured-image`, {
          method: 'POST',
          credentials: 'include',
          body: fd,
        })
      }

      router.push(`/admin/gallery/${collectionId}`)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <DashboardHeader
        title="Create Collection"
        subtitle="Set up a new photo collection for an event or activity"
      />

      <div className="p-6 max-w-3xl">
        {/* Back */}
        <Link
          href="/admin/gallery"
          className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Gallery
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
                className="relative w-40 h-28 border-2 border-dashed border-neutral-300 flex items-center justify-center overflow-hidden bg-neutral-50 shrink-0 cursor-pointer hover:bg-neutral-100 transition-colors"
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
                    <span className="text-xs text-neutral-400">Click to upload</span>
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

            {/* Title */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">
                Title <span className="text-error">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. National Para Shooting Championship 2025"
                className="input w-full"
                required
              />
            </div>

            {/* Short description */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">
                Short Description <span className="text-neutral-400 font-normal">(card preview)</span>
              </label>
              <textarea
                value={form.short_description}
                onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                rows={2}
                placeholder="Brief summary displayed on gallery cards (1–2 sentences)"
                className="input w-full resize-none"
              />
            </div>

            {/* Full description */}
            <div>
              <label className="block text-xs font-bold text-neutral-700 mb-1.5 uppercase tracking-wide">
                Full Description <span className="text-neutral-400 font-normal">(detail page)</span>
              </label>
              <textarea
                value={form.full_description}
                onChange={(e) => setForm({ ...form, full_description: e.target.value })}
                rows={5}
                placeholder="Full description of the event shown on the collection detail page..."
                className="input w-full resize-y"
              />
            </div>

            {/* Event date */}
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
                  Creating...
                </>
              ) : (
                'Create Collection'
              )}
            </button>
            <Link href="/admin/gallery" className="btn-outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </>
  )
}
