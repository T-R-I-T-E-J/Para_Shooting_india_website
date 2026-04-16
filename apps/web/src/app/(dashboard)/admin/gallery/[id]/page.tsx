'use client'

import { useEffect, useState, useRef } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import {
  Upload,
  Trash2,
  ArrowLeft,
  Loader2,
  Images,
  ExternalLink,
  Edit,
} from 'lucide-react'
import { format } from 'date-fns'

const API_URL = '/api/v1'

interface CollectionImage {
  id: number
  image_url: string
  caption?: string
  uploaded_at: string
}

interface Collection {
  id: number
  title: string
  short_description?: string
  full_description?: string
  featured_image?: string
  event_date?: string
  created_at: string
  images: CollectionImage[]
}

export default function AdminCollectionDetailPage() {
  const { id } = useParams<{ id: string }>()
  const [collection, setCollection] = useState<Collection | null>(null)
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const fetchCollection = async () => {
    try {
      const res = await fetch(`${API_URL}/media-collections/${id}`, {
        credentials: 'include',
        cache: 'no-store',
      })
      if (!res.ok) throw new Error(`API error: ${res.status} ${res.statusText}`)
      const json = await res.json()
      setCollection(json.data || json)
    } catch (e) {
      console.error('fetchCollection failed:', e)
    } finally {
      setLoading(false)
    }
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return
    setUploading(true)

    try {
      for (const file of Array.from(files)) {
        const fd = new FormData()
        fd.append('image', file)
        const res = await fetch(`${API_URL}/media-collections/${id}/images`, {
          method: 'POST',
          credentials: 'include',
          body: fd,
        })
        if (!res.ok) {
          alert(`Failed to upload: ${file.name}`)
        }
      }
      await fetchCollection()
    } catch (e) {
      console.error(e)
      alert('Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleDeleteImage = async (imgId: number) => {
    if (!confirm('Remove this photo from the collection?')) return
    setDeletingId(imgId)
    try {
      const res = await fetch(`${API_URL}/media-collections/images/${imgId}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        await fetchCollection()
      } else {
        alert('Failed to delete photo')
      }
    } catch (e) {
      console.error(e)
    } finally {
      setDeletingId(null)
    }
  }

  useEffect(() => {
    if (id) fetchCollection()
  }, [id])

  if (loading) {
    return (
      <>
        <DashboardHeader title="Loading..." subtitle=" " />
        <div className="p-6 flex items-center gap-2 text-neutral-500">
          <Loader2 className="w-4 h-4 animate-spin" />
          Loading collection...
        </div>
      </>
    )
  }

  if (!collection) {
    return (
      <>
        <DashboardHeader title="Not Found" subtitle="Collection does not exist" />
        <div className="p-6">
          <Link href="/admin/gallery" className="text-primary hover:underline text-sm">
            ← Back to Gallery
          </Link>
        </div>
      </>
    )
  }

  return (
    <>
      <DashboardHeader
        title={collection.title}
        subtitle={`${collection.images?.length || 0} photo${(collection.images?.length || 0) !== 1 ? 's' : ''} in this collection`}
      />

      <div className="p-6 space-y-6">
        {/* Top bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/admin/gallery"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-primary transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Gallery
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={`/admin/gallery/${collection.id}/edit`}
              className="btn-outline flex items-center gap-2 text-xs"
            >
              <Edit className="w-3.5 h-3.5" />
              Edit Details
            </Link>
            <Link
              href={`/media/${collection.id}`}
              target="_blank"
              className="btn-outline flex items-center gap-2 text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Preview Public Page
            </Link>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="btn-primary flex items-center gap-2 disabled:opacity-60"
            >
              {uploading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="w-4 h-4" />
                  Add Photos
                </>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
            />
          </div>
        </div>

        {/* Collection info */}
        <div className="card grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          {collection.featured_image && (
            <div className="relative h-32 md:h-full overflow-hidden rounded border border-neutral-100">
              <img
                src={collection.featured_image}
                alt="Featured"
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className={`space-y-3 ${collection.featured_image ? 'md:col-span-2' : 'md:col-span-3'}`}>
            {collection.event_date && (
              <div>
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-400 block mb-0.5">Event Date</span>
                <span className="text-neutral-700">{format(new Date(collection.event_date), 'dd MMMM yyyy')}</span>
              </div>
            )}
            {collection.short_description && (
              <div>
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-400 block mb-0.5">Short Description</span>
                <p className="text-neutral-700">{collection.short_description}</p>
              </div>
            )}
            {collection.full_description && (
              <div>
                <span className="text-[10px] font-bold tracking-[0.15em] uppercase text-neutral-400 block mb-0.5">Full Description</span>
                <p className="text-neutral-600 text-xs leading-relaxed line-clamp-3">{collection.full_description}</p>
              </div>
            )}
          </div>
        </div>

        {/* Photos grid */}
        <div className="card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="font-heading font-semibold text-primary flex items-center gap-2">
              <Images className="w-4 h-4" />
              Photos ({collection.images?.length || 0})
            </h3>
            {(collection.images?.length || 0) > 0 && (
              <p className="text-xs text-neutral-400">Click the trash icon to remove a photo</p>
            )}
          </div>

          {!collection.images || collection.images.length === 0 ? (
            <div
              className="border-2 border-dashed border-neutral-300 py-16 text-center cursor-pointer hover:bg-neutral-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="w-10 h-10 mx-auto text-neutral-300 mb-3" />
              <p className="text-neutral-500 font-medium text-sm">No photos uploaded yet</p>
              <p className="text-neutral-400 text-xs mt-1">Click here or use "Add Photos" to begin</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {collection.images?.map((img) => (
                <div
                  key={img.id}
                  className="group relative aspect-square overflow-hidden border border-neutral-200 bg-neutral-100"
                >
                  <img
                    src={img.image_url}
                    alt={img.caption || 'Photo'}
                    className="w-full h-full object-cover"
                  />
                  {/* Delete overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <button
                      onClick={() => handleDeleteImage(img.id)}
                      disabled={deletingId === img.id}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-error text-white rounded-full hover:bg-error/80 disabled:opacity-50"
                      title="Remove photo"
                    >
                      {deletingId === img.id ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                  {/* Caption */}
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[9px] px-1.5 py-1 truncate opacity-0 group-hover:opacity-100 transition-opacity">
                      {img.caption}
                    </div>
                  )}
                </div>
              ))}

              {/* Upload more tile */}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="aspect-square border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center text-neutral-400 hover:bg-neutral-50 hover:border-primary hover:text-primary transition-colors disabled:opacity-50"
              >
                <Upload className="w-5 h-5 mb-1" />
                <span className="text-[10px] font-bold">Add More</span>
              </button>
            </div>
          )}
        </div>

        {/* Upload guidelines */}
        <div className="card">
          <h3 className="font-heading font-semibold text-primary mb-3 text-sm">Upload Guidelines</h3>
          <ul className="list-disc list-inside space-y-1 text-xs text-neutral-500">
            <li>Supported formats: JPG, PNG, WebP</li>
            <li>Maximum file size: 10MB per image</li>
            <li>You can select and upload multiple photos at once</li>
            <li>Use descriptive filenames for better organisation</li>
            <li>Compress images before uploading for faster load times</li>
          </ul>
        </div>
      </div>
    </>
  )
}
