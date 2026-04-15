'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import Link from 'next/link'
import { Calendar, Plus, Eye, MoreVertical, Search, CheckCircle, XCircle, Clock } from 'lucide-react'
import './competitions.css'

interface Competition {
  id: number;
  code: string;
  name: string;
  startDate: string;
  endDate: string;
  location: string;
  isActive: boolean;
  registrationOpen: boolean;
  registrationDeadline: string;
  createdAt: string;
}

interface Toast {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}

export default function CompetitionsListPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toasts, setToasts] = useState<Toast[]>([])
  const toastIdRef = useRef(0)

  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = ++toastIdRef.current
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  const fetchCompetitions = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/v1/admin/competitions', { credentials: 'include' })
      if (res.ok) {
        const json = await res.json()
        setCompetitions(json.data || json)
      } else {
        throw new Error('Failed to fetch')
      }
    } catch (e) {
      addToast('error', 'Failed to load competitions')
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [addToast])

  useEffect(() => {
    fetchCompetitions()
  }, [fetchCompetitions])

  const filteredCompetitions = competitions.filter(comp => 
    comp.name.toLowerCase().includes(search.toLowerCase()) || 
    comp.code.toLowerCase().includes(search.toLowerCase())
  )

  const toggleIsActive = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/v1/admin/competitions/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus })
      })
      if (res.ok) {
        addToast('success', 'Competition status updated')
        fetchCompetitions()
      } else {
        throw new Error('Update failed')
      }
    } catch {
      addToast('error', 'Failed to update competition status')
    }
  }

  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

  return (
    <div className="comp-page">
      {/* ─── Toasts ─── */}
      <div className="comp-toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`comp-toast comp-toast-${t.type}`}>
            {t.message}
          </div>
        ))}
      </div>

      <div className="comp-header">
        <div className="comp-titles">
          <Calendar className="comp-icon text-blue-600" size={32} />
          <div>
            <h1 className="comp-title">Registration System</h1>
            <p className="comp-subtitle">Manage all shooter competitions, registrations, and sub-events</p>
          </div>
        </div>
        <div className="comp-actions">
          <Link href="/admin/competitions/new" className="comp-btn comp-btn-primary">
            <Plus size={18} />
            Create Competition
          </Link>
        </div>
      </div>

      <div className="comp-content">
        <div className="comp-toolbar">
          <div className="comp-search-wrap">
            <Search className="comp-search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search competitions by name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="comp-search-input"
            />
          </div>
        </div>

        <div className="comp-card">
          <div className="comp-table-container">
            {loading ? (
              <div className="comp-loading">
                <div className="comp-spinner"></div>
                <p>Loading competitions...</p>
              </div>
            ) : filteredCompetitions.length === 0 ? (
              <div className="comp-empty">
                <Calendar size={48} className="text-gray-300 mb-4" />
                <h3>No competitions found</h3>
                <p>Get started by creating a new competition.</p>
                <Link href="/admin/competitions/new" className="comp-btn comp-btn-outline mt-4">
                  Create Competition
                </Link>
              </div>
            ) : (
              <table className="comp-table">
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Competition details</th>
                    <th>Duration</th>
                    <th>Registrations</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCompetitions.map(comp => (
                    <tr key={comp.id}>
                      <td className="font-semibold text-gray-700">{comp.code}</td>
                      <td>
                        <div className="font-medium text-gray-900">{comp.name}</div>
                        <div className="text-xs text-gray-500 mt-1">{comp.location}</div>
                      </td>
                      <td>
                        <div className="text-sm">{formatDate(comp.startDate)}</div>
                        <div className="text-xs text-gray-500">to {formatDate(comp.endDate)}</div>
                      </td>
                      <td>
                        {comp.registrationOpen ? (
                           <div className="comp-badge comp-badge-success flex items-center gap-1 w-max">
                             <CheckCircle size={14} /> Open
                           </div>
                        ) : (
                           <div className="comp-badge comp-badge-danger flex items-center gap-1 w-max">
                             <XCircle size={14} /> Closed
                           </div>
                        )}
                        <div className="text-xs text-gray-500 mt-1">Deadline: {formatDate(comp.registrationDeadline)}</div>
                      </td>
                      <td>
                        <button 
                          onClick={() => toggleIsActive(comp.id, comp.isActive)}
                          className={`comp-status-toggle ${comp.isActive ? 'active' : 'inactive'}`}
                        >
                          <div className={`comp-status-dot ${comp.isActive ? 'bg-green-500' : 'bg-gray-400'}`}></div>
                          {comp.isActive ? 'Active' : 'Inactive'}
                        </button>
                      </td>
                      <td>
                        <Link href={`/admin/competitions/${comp.id}`} className="comp-action-btn" title="Manage">
                          <Eye size={18} />
                          <span>Manage</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
