'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save } from 'lucide-react'
import '../competitions.css'

export default function CreateCompetitionPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    duration_start: '',
    duration_end: '',
    place: '',
    payment_mode: 'screenshot',
    is_active: true
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    // TypeScript needs narrowing for checkbox
    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const payload = {
        ...formData,
        duration_start: new Date(formData.duration_start).toISOString(),
        duration_end: new Date(formData.duration_end).toISOString(),
      }

      const res = await fetch('/api/v1/admin/competitions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to create competition')
      }

      const json = await res.json()
      const newCompetitionId = json.data?.id || json.id

      // Redirect back to list, or to the newly created competition dashboard
      if (newCompetitionId) {
        router.push(`/admin/competitions/${newCompetitionId}`)
      } else {
        router.push('/admin/competitions')
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="comp-page">
      <div className="comp-header">
        <div className="comp-titles">
          <Link href="/admin/competitions" className="comp-btn comp-btn-outline" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="comp-title">Create Competition</h1>
            <p className="comp-subtitle">Set up a new event for shooters to register</p>
          </div>
        </div>
      </div>

      <div className="comp-card" style={{ maxWidth: '800px', padding: '2rem' }}>
        {error && (
          <div className="comp-toast comp-toast-error" style={{ position: 'relative', marginBottom: '1.5rem', animation: 'none' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="comp-form">
          <div className="form-group mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">Competition Name</label>
            <input 
              type="text" 
              name="name"
              required 
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. 21st KSSCC 2026"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Code (Prefix)</label>
              <input 
                type="text" 
                name="code"
                required 
                maxLength={20}
                value={formData.code}
                onChange={handleChange}
                placeholder="e.g. 21KSSCC"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">Used for shooter IDs (e.g., COMP-21KSSCC-001)</p>
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Location/Venue</label>
              <input 
                type="text" 
                name="place"
                required 
                value={formData.place}
                onChange={handleChange}
                placeholder="Dr. Karni Singh Shooting Range"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
              <input 
                type="date" 
                name="duration_start"
                required 
                value={formData.duration_start}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
              <input 
                type="date" 
                name="duration_end"
                required 
                value={formData.duration_end}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="form-group">
              <label className="block text-sm font-medium text-gray-700 mb-2">Payment Mode</label>
              <select 
                name="payment_mode"
                value={formData.payment_mode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white"
              >
                <option value="screenshot">Offline / RTGS</option>
                <option value="gateway">Online (Gateway)</option>
              </select>
            </div>
            <div className="form-group flex justify-start items-center pt-8">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleChange}
                  className="w-5 h-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="ml-2 text-sm font-medium text-gray-700">Set as Active immediately</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200 gap-4">
            <button 
              type="button" 
              onClick={() => router.push('/admin/competitions')} 
              className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <div className="comp-spinner" style={{ width: '1rem', height: '1rem', margin: 0, borderWidth: '2px' }}></div>
              ) : (
                <Save size={18} />
              )}
              {loading ? 'Saving...' : 'Create Competition'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
