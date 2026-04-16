'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { DashboardHeader } from '@/components/dashboard'
import { ArrowLeft, Loader2, Save, FileText, Plus, X } from 'lucide-react'

const API_URL = '/api/v1'

export default function CreateLatestUpdatePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    title: '',
    document: null as { url: string; name: string } | null,
  })

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
      if (!res.ok) throw new Error(`Upload error ${res.status}`)
      const json = await res.json()
      const url: string | undefined = json?.data?.file?.url
      if (!url) throw new Error('No URL in response')
      setFormData((prev) => ({
        ...prev,
        document: { url, name: file.name },
      }))
    } catch {
      alert('Document upload failed.')
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
      const res = await fetch(`${API_URL}/latest-updates`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (res.ok) {
        router.push('/admin/latest-updates')
        router.refresh()
      } else {
        const err = await res.json()
        alert(`Failed to create: ${err.message || 'Unknown error'}`)
      }
    } catch {
      alert('An error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <DashboardHeader title="Create Latest Update" subtitle="Add a new update to the ticker and list" />
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
              Create Update
            </button>
          </div>
        </form>
      </div>
    </>
  )
}
