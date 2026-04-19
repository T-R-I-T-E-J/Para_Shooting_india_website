'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { Plus, Trash2, Edit2 } from 'lucide-react'
import { format } from 'date-fns'

const API_URL = '/api/v1'

export default function AdminLatestUpdatesPage() {
  const [updates, setUpdates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchUpdates = async () => {
    try {
      const res = await fetch(`${API_URL}/latest-updates`, { cache: 'no-store' })
      if (!res.ok) throw new Error('Fetch failed')
      const responseData = await res.json()
      const updatesArray = Array.isArray(responseData) ? responseData : (responseData.data || [])
      setUpdates(updatesArray)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this update?')) return
    try {
      const res = await fetch(`${API_URL}/latest-updates/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      })
      if (res.ok) {
        fetchUpdates()
      } else {
        alert('Failed to delete')
      }
    } catch (e) {
      console.error(e)
    }
  }

  useEffect(() => {
    fetchUpdates()
  }, [])

  return (
    <>
      <DashboardHeader 
        title="Latest Updates" 
        subtitle="Manage ticker and updates page"
      />
      <div className="p-6">
        <div className="flex justify-end mb-6">
          <Link href="/admin/latest-updates/create" className="btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Update
          </Link>
        </div>
        <div className="card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs text-neutral-500 bg-neutral-50/50 uppercase border-b border-neutral-100">
                <tr>
                  <th className="px-6 py-4 font-bold">Title</th>
                  <th className="px-6 py-4 font-bold">Document</th>
                  <th className="px-6 py-4 font-bold">Date</th>
                  <th className="px-6 py-4 font-bold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                      Loading...
                    </td>
                  </tr>
                ) : updates.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-neutral-500">
                      No latest updates found.
                    </td>
                  </tr>
                ) : (
                  updates.map((update) => (
                    <tr key={update.id} className="hover:bg-neutral-50/50 transition-colors">
                      <td className="px-6 py-4 font-medium text-neutral-900">
                        {update.title}
                      </td>
                      <td className="px-6 py-4">
                        {update.document ? (
                          <a href={update.document.url} target="_blank" rel="noreferrer" className="text-primary hover:underline">
                            {update.document.name}
                          </a>
                        ) : (
                          <span className="text-neutral-400">No document</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-neutral-500">
                        {format(new Date(update.date || update.created_at), 'dd MMM yyyy, HH:mm')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                        <Link
                          href={`/admin/latest-updates/${update.id}/edit`}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer inline-block"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => handleDelete(update.id)}
                          className="p-2 text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer inline-block"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
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
