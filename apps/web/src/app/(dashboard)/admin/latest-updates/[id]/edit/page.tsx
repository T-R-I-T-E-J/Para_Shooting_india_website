'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { ArrowLeft, Loader2, Save, FileText, Plus, X } from 'lucide-react'

const API_URL = '/api/v1'

export default function EditLatestUpdatePage() {
  const router = useRouter()
  const params = useParams()
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)

  const [formData, setFormData] = useState({
    title: '',
    document: null as { url: string; name: string } | null,
    date: '',
  })

  useEffect(() => {
    const fetchUpdate = async () => {
      try {
        const res = await fetch(`${API_URL}/latest-updates/${params.id}`, { cache: 'no-store' })
        if (!res.ok) throw new Error('Fetch failed')
        const data = await res.json()
        const updateData = data.data || data
        
        let dateVal = ''
        if (updateData.date) {
            const d = new Date(updateData.date)
            d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
            dateVal = d.toISOString().slice(0, 16)
        } else if (updateData.created_at) {
            const d = new Date(updateData.created_at)
            d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
            dateVal = d.toISOString().slice(0, 16)
        }

        setFormData({
          title: updateData.title,
          document: updateData.document,
          date: dateVal,
        })
      } catch (e) {
        console.error(e)
        alert('Failed to load update details.')
      } finally {
        setFetching(false)
      }
    }
    fetchUpdate()
  }, [params.id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
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
      if (!res.ok) {
        const errBody = await res.text()
        throw new Error(`Upload failed: server returned ${res.status}`)
      }
      const json = await res.json()
      const url: string | undefined = json?.data?.file?.url ?? json?.file?.url
      if (!url) {
        throw new Error('No URL in server response')
      }
      setFormData((prev) => ({
        ...prev,
        document: { url, name: file.name },
      }))
    } catch (err) {
      console.error('[upload] Document upload failed:', err)
      alert(`Document upload failed: ${err instanceof Error ? err.message : 'Unknown error'}`)
    }
  }

  const removeDocument = () => {
    setFormData((prev) => ({
      ...prev,
      document: null,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const payload: any = { ...formData };
      if (!payload.date) {
        delete payload.date;
      } else {
        payload.date = new Date(payload.date).toISOString();
      }

      const res = await fetch(`${API_URL}/latest-updates/${params.id}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (res.ok) {
        router.push('/admin/latest-updates')
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

  if (fetching) {
    return (
      <>
        <DashboardHeader title="Edit Latest Update" subtitle="Update an existing ticker item" />
        <div className="p-6 max-w-4xl mx-auto flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>
      </>
    )
  }

  return (
    <>
      <DashboardHeader title="Edit Latest Update" subtitle="Update an existing ticker item" />
      <div className="p-6 max-w-4xl mx-auto">
        <Link href="/admin/latest-updates" className="flex items-center text-sm text-neutral-500 hover:text-primary mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back to Latest Updates
        </Link>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card space-y-6">
            <h3 className="section-title text-lg border-b pb-2">Update Details</h3>

            <div className="grid grid-cols-1 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Title <span className="text-error">*</span></label>
                <input type="text" name="title" required value={formData.title} onChange={handleChange} className="input w-full" placeholder="Enter update title" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Publish Date (Optional)</label>
                <input type="datetime-local" name="date" value={formData.date} onChange={handleChange} className="input w-full" />
                <p className="text-xs text-neutral-500">Leave blank to use the current date and time.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-neutral-700">Related Document (PDF)</label>
                <div className="space-y-3">
                  {formData.document ? (
                    <div className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg border border-neutral-200">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center border border-neutral-200 flex-shrink-0">
                          <FileText className="w-5 h-5 text-primary" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-sm truncate text-neutral-900">{formData.document.name}</p>
                          <a href={formData.document.url} target="_blank" rel="noreferrer" className="text-xs text-primary hover:underline truncate block">View / Download</a>
                        </div>
                      </div>
                      <button type="button" onClick={removeDocument} className="text-neutral-400 hover:text-error p-1 cursor-pointer">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="btn-secondary flex items-center gap-2 cursor-pointer w-fit">
                      <Plus className="w-4 h-4" />
                      <span>Upload Document</span>
                      <input type="file" className="hidden" accept=".pdf"
                        onChange={(e) => { handleDocumentUpload(e.target.files?.[0]); e.target.value = '' }} />
                    </label>
                  )}
                </div>
                <p className="text-xs text-neutral-500">Attach a PDF document to be displayed on the updates page.</p>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Link href="/admin/latest-updates" className="btn-secondary">Cancel</Link>
            <button type="submit" disabled={loading} className="btn-primary flex items-center gap-2 cursor-pointer">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
              Save Update
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
