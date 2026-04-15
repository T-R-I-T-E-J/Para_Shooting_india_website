'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { Plus, Edit, Trash, FileText, Loader2, Download, Pencil } from 'lucide-react'
import clsx from 'clsx'

type ClassificationItem = {
  id: string
  title: string
  category: string
  categoryId: string | null
  categoryRel?: { id: string; name: string; slug: string } | null
  fileType: string
  size: string
  href: string
  createdAt: string
  contentDate: string | null
  contentYear: number | null
  isActive: boolean
}

const AdminClassificationPage = () => {
  const [items, setItems] = useState<ClassificationItem[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [filterYear, setFilterYear] = useState<string>('')
  const [filterSubcategory, setFilterSubcategory] = useState<string>('')
  const [availableYears, setAvailableYears] = useState<number[]>([])

  useEffect(() => {
    fetchClassification()
    fetchYears()
  }, [])

  useEffect(() => {
    fetchClassification()
  }, [filterYear])

  const fetchClassification = async () => {
    try {
      const baseUrl = '/api/v1'
      const params = new URLSearchParams()
      if (filterYear) params.set('year', filterYear)
      const queryStr = params.toString() ? `?${params.toString()}` : ''
      const res = await fetch(`${baseUrl}/downloads${queryStr}`, {
        credentials: 'include',
      })
      if (res.ok) {
        const json = await res.json()
        const data = Array.isArray(json) ? json : (json.data || [])
        const classItems = data.filter((item: ClassificationItem) =>
          ['classification', 'medical_classification', 'ipc_license', 'national_classification'].includes(item.category)
        )
        setItems(classItems)
      }
    } catch (error) {
      console.error('Failed to fetch classification:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchYears = async () => {
    try {
      const res = await fetch('/api/v1/downloads/years', { credentials: 'include' })
      if (res.ok) {
        const years = await res.json()
        setAvailableYears(Array.isArray(years) ? years : [])
      }
    } catch (e) {
      console.error('Failed to fetch years:', e)
    }
  }

  const handleDelete = async (event: React.MouseEvent, id: string) => {
    event.stopPropagation()
    
    if (!id) {
      alert('Error: Missing ID')
      return
    }

    if (typeof window !== 'undefined' && !window.confirm('Are you sure you want to delete this document?')) {
      return
    }

    setDeletingId(id)
    
    try {
      const baseUrl = '/api/v1'
      const apiUrl = `${baseUrl}/downloads/${id}`
      
      const res = await fetch(apiUrl, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      
      if (res.ok) {
        setItems((prev) => prev.filter(item => item.id !== id))
        alert('Document deleted successfully')
      } else {
        const errorText = await res.text()
        console.error('Delete failed:', res.status, errorText)
        alert(`Failed to delete: ${res.status}`)
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('An error occurred while deleting')
    } finally {
      setDeletingId(null)
    }
  }

  const formatIssueDate = (dateStr: string | null) => {
    if (!dateStr) return null
    const d = new Date(dateStr)
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`
  }

  // Get unique subcategories from loaded items
  const uniqueSubcategories = Array.from(
    new Map(
      items
        .filter(i => i.categoryRel)
        .map(i => [i.categoryRel!.id, i.categoryRel!.name])
    ).entries()
  )

  // Apply client-side subcategory filter
  const filteredItems = filterSubcategory
    ? items.filter(item => item.categoryId === filterSubcategory)
    : items

  return (
    <>
      <DashboardHeader
        title="Classification"
        subtitle="Manage shooter classification documents and guidelines"
      />

      <div className="p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          {/* Filter Bar */}
          <div className="flex items-center gap-3 flex-wrap">
            <select
              value={filterYear}
              onChange={(e) => setFilterYear(e.target.value)}
              className="input text-sm py-1.5 px-3 min-w-[140px]"
            >
              <option value="">All Years</option>
              {availableYears.map(y => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={filterSubcategory}
              onChange={(e) => setFilterSubcategory(e.target.value)}
              className="input text-sm py-1.5 px-3 min-w-[160px]"
            >
              <option value="">All Subcategories</option>
              {uniqueSubcategories.map(([id, name]) => (
                <option key={id} value={id}>{name}</option>
              ))}
            </select>
          </div>
          <Link
            href="/admin/classification/create"
            className="btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Document
          </Link>
        </div>

        <div className="card overflow-hidden">
          {loading ? (
            <div className="flex justify-center p-8">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="text-center p-8 text-neutral-500">
              No documents found. Add one to get started.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-sm">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-sm">Category</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-sm">Subcategory</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-sm">Type</th>
                    <th className="text-left py-3 px-4 font-semibold text-neutral-600 text-sm">Issue Date</th>
                    <th className="text-right py-3 px-4 font-semibold text-neutral-600 text-sm">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center text-primary">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-medium text-neutral-700">{item.title}</p>
                            {item.size && <p className="text-xs text-neutral-500">{item.size}</p>}
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 capitalize">
                          {item.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-neutral-600">
                        {item.categoryRel?.name || '—'}
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-sm text-neutral-600 uppercase font-medium">
                          {item.fileType}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {item.contentDate ? (
                          <div>
                            <p className="text-sm text-neutral-700">{formatIssueDate(item.contentDate)}</p>
                            {item.contentYear && (
                              <p className="text-xs text-neutral-400">{item.contentYear}</p>
                            )}
                          </div>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-amber-50 text-amber-700 border border-amber-200">
                            ⚠ Date not set
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={item.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 text-neutral-500 hover:text-primary transition-colors rounded-md hover:bg-neutral-100"
                            title="Download/View"
                          >
                            <Download className="w-4 h-4" />
                          </a>
                          <Link
                            href={`/admin/classification/${item.id}/edit`}
                            className="p-1.5 text-neutral-500 hover:text-primary transition-colors rounded-md hover:bg-neutral-100"
                            title="Edit"
                          >
                            <Pencil className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(e, item.id)}
                            disabled={deletingId === item.id}
                            className="p-1.5 text-neutral-500 hover:text-red-600 transition-colors rounded-md hover:bg-neutral-100 disabled:opacity-50"
                            title="Delete"
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <Trash className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default AdminClassificationPage
