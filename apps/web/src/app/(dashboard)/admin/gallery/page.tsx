'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { Plus, Trash2, Eye, Images, Edit } from 'lucide-react'
import { format } from 'date-fns'

const API_URL = '/api/v1'

interface Collection {
  id: number
  title: string
  short_description?: string
  event_date?: string
  created_at: string
  images: { id: number }[]
}

export default function AdminGalleryPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)

  const fetchCollections = async () => {
    try {
      const res = await fetch(`${API_URL}/media-collections`, {
        credentials: 'include',
        cache: 'no-store',
      })
      if (!res.ok) throw new Error('Fetch failed')
      const data = await res.json()
      setCollections(Array.isArray(data) ? data : data.data || [])
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this collection? This will also remove all its photos.')) return
    try {
      const res = await fetch(`${API_URL}/media-collections/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        fetchCollections()
      } else {
        alert('Failed to delete collection')
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchCollections()
  }, [])

  return (
    <>
      <DashboardHeader
        title="Media & Gallery"
        subtitle="Manage photo collections for events and activities"
      />

      <div className="p-6 space-y-6">
        {/* Actions */}
        <div className="flex justify-end">
          <Link
            href="/admin/gallery/create"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Collection
          </Link>
        </div>

        {/* Table */}
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-500 bg-neutral-50/50 uppercase border-b border-neutral-100">
                <tr>
                  <th className="px-6 py-4 font-bold">Collection Title</th>
                  <th className="px-6 py-4 font-bold">Event Date</th>
                  <th className="px-6 py-4 font-bold text-center">Photos</th>
                  <th className="px-6 py-4 font-bold">Created</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-10 text-center text-neutral-500">
                      Loading collections...
                    </td>
                  </tr>
                ) : collections.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center">
                      <Images className="w-10 h-10 mx-auto text-neutral-300 mb-3" />
                      <p className="text-neutral-500 font-medium">No collections yet</p>
                      <p className="text-neutral-400 text-xs mt-1">
                        Create your first media collection to get started.
                      </p>
                    </td>
                  </tr>
                ) : (
                  collections.map((col) => (
                    <tr
                      key={col.id}
                      className="hover:bg-neutral-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <p className="font-semibold text-neutral-900">{col.title}</p>
                        {col.short_description && (
                          <p className="text-neutral-400 text-xs mt-0.5 line-clamp-1 max-w-xs">
                            {col.short_description}
                          </p>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-neutral-600">
                        {col.event_date
                          ? format(new Date(col.event_date), 'dd MMM yyyy')
                          : <span className="text-neutral-400">—</span>
                        }
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center gap-1 text-primary font-bold">
                          <Images className="w-3.5 h-3.5" />
                          {col.images?.length ?? 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-neutral-500 text-xs">
                        {format(new Date(col.created_at), 'dd MMM yyyy, HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/gallery/${col.id}`}
                            className="p-2 text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Manage collection"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/gallery/${col.id}/edit`}
                            className="p-2 text-neutral-500 hover:text-primary hover:bg-primary/10 rounded-lg transition-colors"
                            title="Edit collection details"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(col.id)}
                            className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete collection"
                          >
                            <Trash2 className="w-4 h-4" />
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
    </>
  )
}
