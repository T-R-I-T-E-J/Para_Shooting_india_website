'use client'
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import './shooters.css'

/* ─── Types ─── */
type ShooterStatus = 'pending' | 'approved' | 'rejected' | 'incomplete' | 'needs_changes'

interface Shooter {
  id: number
  competitorNo: number
  name: string
  state: string
  eventType: 'RIFLE' | 'PISTOL' | 'SHOTGUN'
  category: string
  status: ShooterStatus
  pciId: string | null
  registeredAt: string
  contact: string
  email: string
  dob: string
  gender: string
  guardianName: string
  classificationDate: string
  equipmentAdaptations: string
  documents: { name: string; uploaded: boolean }[]
}

interface Toast {
  id: number
  type: 'success' | 'error' | 'info'
  message: string
}

/* ─── API Hooks ─── */
function useShooterStats() {
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0, needs_changes: 0 })
  const [loading, setLoading] = useState(true)

  const fetchStats = useCallback(async () => {
    try {
      const res = await fetch('/api/v1/admin/shooters/stats', { credentials: 'include' })
      if (res.ok) {
        const json = await res.json()
        setStats(json.data || json)
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchStats()
    const interval = setInterval(fetchStats, 30000)
    return () => clearInterval(interval)
  }, [fetchStats])

  return { stats, loading, refetch: fetchStats }
}

function useShooterList(filters: any) {
  const [shooters, setShooters] = useState<Shooter[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date())

  const fetchShooters = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.search) params.set('search', filters.search)
      if (filters.status && filters.status !== 'all') params.set('status', filters.status)
      if (filters.state && filters.state !== 'all') params.set('state', filters.state)
      if (filters.eventType && filters.eventType !== 'all') params.set('eventType', filters.eventType)
      if (filters.category && filters.category !== 'all') params.set('category', filters.category)
      params.set('page', filters.page.toString())
      params.set('limit', filters.limit.toString())

      const res = await fetch(`/api/v1/admin/shooters?${params.toString()}`, {
        credentials: 'include'
      })
      if (res.ok) {
        const json = await res.json()
        const payload = json.data || json
        setShooters((payload.shooters || []).map((s: any) => ({
          id: s.id,
          competitorNo: s.shooter_id,
          name: `${s.user?.first_name || ''} ${s.user?.last_name || ''}`.trim(),
          state: s.state_association?.name || '',
          eventType: s.event_type || '',
          category: s.category || '',
          status: s.registration_status || 'pending',
          pciId: s.pci_id,
          registeredAt: s.created_at,
          contact: s.user?.phone || '',
          email: s.user?.email || '',
          dob: s.date_of_birth,
          gender: s.gender,
          guardianName: s.emergency_contact_name || s.guardian_name || '',
          classificationDate: s.approved_at,
          equipmentAdaptations: s.equipment_adaptations || '',
          documents: [] // Can load on demand
        })))
        setTotal(payload.total || 0)
        setLastUpdated(new Date())
      }
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => {
    fetchShooters()
    const interval = setInterval(fetchShooters, 60000)
    return () => clearInterval(interval)
  }, [fetchShooters])

  return { shooters, setShooters, total, loading, lastUpdated, refetch: fetchShooters }
}

/* ─── Static Data ─── */
const STATES = ['Andaman and Nicobar Islands', 'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chandigarh', 'Chhattisgarh', 'Dadra and Nagar Haveli and Daman and Diu', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jammu and Kashmir', 'Jharkhand', 'Karnataka', 'Kerala', 'Ladakh', 'Lakshadweep', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Puducherry', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal']
const EVENT_TYPES = ['RIFLE', 'PISTOL', 'SHOTGUN']
const CATEGORIES = ['SH1', 'SH2', 'SH3', 'SH-VI', 'Deaf', 'Open']
const PAGE_SIZE = 10

/* ─── Component ─── */
export default function ShooterManagementPage() {
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [stateFilter, setStateFilter] = useState<string>('all')
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)

  // Debounce search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search)
    }, 500)
    return () => clearTimeout(handler)
  }, [search])

  const apiFilters = useMemo(() => ({
    search: debouncedSearch,
    status: statusFilter,
    state: stateFilter,
    eventType: eventTypeFilter,
    category: categoryFilter,
    page: currentPage,
    limit: PAGE_SIZE
  }), [debouncedSearch, statusFilter, stateFilter, eventTypeFilter, categoryFilter, currentPage])

  const { stats, loading: statsLoading, refetch: refetchStats } = useShooterStats()
  const { shooters, setShooters, total, loading: listLoading, lastUpdated, refetch: refetchList } = useShooterList(apiFilters)

  useEffect(() => { setCurrentPage(1) }, [debouncedSearch, statusFilter, stateFilter, eventTypeFilter, categoryFilter])
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [slideOverShooter, setSlideOverShooter] = useState<Shooter | null>(null)
  const [slideOverTab, setSlideOverTab] = useState<'profile' | 'documents' | 'classification' | 'actions'>('profile')
  const [assignModalShooter, setAssignModalShooter] = useState<Shooter | null>(null)
  const [assignIdValue, setAssignIdValue] = useState('')
  const [toasts, setToasts] = useState<Toast[]>([])
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [deleteConfirm, setDeleteConfirm] = useState<Shooter | null>(null)
  const [requestChangesShooter, setRequestChangesShooter] = useState<Shooter | null>(null)
  const [requestChangesFeedback, setRequestChangesFeedback] = useState('')
  
  const [slideOverDocuments, setSlideOverDocuments] = useState<any[]>([])
  const [slideOverClassification, setSlideOverClassification] = useState<any>(null)
  const [loadingSlideOverData, setLoadingSlideOverData] = useState(false)

  const toastIdRef = useRef(0)

  useEffect(() => {
    if (!slideOverShooter) return
    
    const fetchData = async () => {
      setLoadingSlideOverData(true)
      try {
        if (slideOverTab === 'documents' && slideOverDocuments.length === 0) {
          const res = await fetch(`/api/v1/admin/shooters/${slideOverShooter.id}/documents`)
          if (res.ok) {
            const json = await res.json()
            setSlideOverDocuments(json.data || json || [])
          }
        }
        if (slideOverTab === 'classification' && !slideOverClassification) {
          const res = await fetch(`/api/v1/admin/shooters/${slideOverShooter.id}/classification`)
          if (res.ok) {
            const json = await res.json()
            setSlideOverClassification(json.data || json)
          }
        }
      } catch (e) {
        console.error("Failed to fetch slide-over data", e)
      } finally {
        setLoadingSlideOverData(false)
      }
    }
    fetchData()
  }, [slideOverShooter?.id, slideOverTab])

  // Reset slide-over data when shooter changes
  useEffect(() => {
    setSlideOverDocuments([])
    setSlideOverClassification(null)
  }, [slideOverShooter?.id])

  /* ─── Toast System ─── */
  const addToast = useCallback((type: Toast['type'], message: string) => {
    const id = ++toastIdRef.current
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3000)
  }, [])

  /* ─── Simulated Async ─── */
  const simulateAsync = useCallback((key: string): Promise<void> => {
    setLoading(prev => ({ ...prev, [key]: true }))
    return new Promise(resolve => {
      setTimeout(() => {
        setLoading(prev => ({ ...prev, [key]: false }))
        resolve()
      }, 500)
    })
  }, [])

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const paginated = shooters // The API already paginates

  // Since we use API stats, we could remove the useMemo stats and just use what API returns, but let's just make sure.
  const apiStats = stats

  /* ─── Actions ─── */
  const handleApprove = async (shooter: Shooter) => {
    await simulateAsync(`approve-${shooter.id}`)
    try {
      const res = await fetch(`/api/v1/admin/shooters/${shooter.id}/approve`, { 
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) // Matches backend ApproveDto (all optional)
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Approve failed:', err);
        throw new Error(err.message || 'Failed to approve');
      }
      
      setShooters(prev => prev.map(s => s.id === shooter.id ? { ...s, status: 'approved' as const } : s))
      if (slideOverShooter?.id === shooter.id) setSlideOverShooter(prev => prev ? { ...prev, status: 'approved' } : null)
      addToast('success', `${shooter.name} has been approved`)
      refetchStats()
      refetchList()
    } catch (e: any) {
      addToast('error', e.message || `Failed to approve ${shooter.name}`)
    }
  }

  const handleReject = async (shooter: Shooter) => {
    await simulateAsync(`reject-${shooter.id}`)
    try {
      const res = await fetch(`/api/v1/admin/shooters/${shooter.id}/reject`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          reason: 'Application does not meet requirements',
          notes: 'Rejected from administrative dashboard' 
        }) // Matches backend RejectDto (reason is required)
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        console.error('Reject failed:', err);
        throw new Error(err.message || 'Failed to reject');
      }
      
      setShooters(prev => prev.map(s => s.id === shooter.id ? { ...s, status: 'rejected' as const } : s))
      if (slideOverShooter?.id === shooter.id) setSlideOverShooter(prev => prev ? { ...prev, status: 'rejected' } : null)
      addToast('error', `${shooter.name} has been rejected`)
      refetchStats()
      refetchList()
    } catch (e: any) {
      addToast('error', e.message || `Failed to reject ${shooter.name}`)
    }
  }

  const handleRevokeApproval = async (shooter: Shooter) => {
    await simulateAsync(`revoke-${shooter.id}`)
    try {
      const res = await fetch(`/api/v1/admin/shooters/${shooter.id}/revoke`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Approval revoked from admin dashboard' })
      })
      if (!res.ok) throw new Error('Failed to revoke approval')
      setShooters(prev => prev.map(s => s.id === shooter.id ? { ...s, status: 'pending' as const } : s))
      if (slideOverShooter?.id === shooter.id) setSlideOverShooter(prev => prev ? { ...prev, status: 'pending' } : null)
      addToast('info', `Approval revoked for ${shooter.name}`)
      refetchStats()
      refetchList()
    } catch (e: any) {
      addToast('error', e.message || `Failed to revoke approval`)
    }
  }

  const handleRequestChanges = async (shooter: Shooter, feedback: string) => {
    if (!feedback.trim()) return
    await simulateAsync(`request-changes-${shooter.id}`)
    try {
      const res = await fetch(`/api/v1/admin/shooters/${shooter.id}/request-changes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback: feedback.trim() })
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Failed to request changes')
      }
      setShooters(prev => prev.map(s => s.id === shooter.id ? { ...s, status: 'needs_changes' as const } : s))
      if (slideOverShooter?.id === shooter.id) setSlideOverShooter(prev => prev ? { ...prev, status: 'needs_changes' } : null)
      addToast('info', `Changes requested for ${shooter.name}`)
      setRequestChangesShooter(null)
      setRequestChangesFeedback('')
      refetchStats()
      refetchList()
    } catch (e: any) {
      addToast('error', e.message || `Failed to request changes for ${shooter.name}`)
    }
  }

  const handleViewProof = (shooter: Shooter) => {
    openSlideOver(shooter)
    setSlideOverTab('documents')
  }

  const handleDelete = async (shooter: Shooter) => {
    await simulateAsync(`delete-${shooter.id}`)
    try {
      const res = await fetch(`/api/v1/admin/shooters/${shooter.id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      
      setShooters(prev => prev.filter(s => s.id !== shooter.id))
      setSelectedIds(prev => { const next = new Set(prev); next.delete(shooter.id); return next })
      if (slideOverShooter?.id === shooter.id) setSlideOverShooter(null)
      setDeleteConfirm(null)
      addToast('info', `${shooter.name} has been removed`)
      refetchStats()
      refetchList()
    } catch {
      addToast('error', `Failed to delete ${shooter.name}`)
    }
  }

  const handleAssignId = async () => {
    if (!assignModalShooter || !assignIdValue.trim()) return
    const regex = /^PCI\/PSAI\/\d{4}\/\d{4}$/
    if (!regex.test(assignIdValue.trim())) {
      addToast('error', 'Invalid PCI ID format. Use PCI/PSAI/YYYY/XXXX')
      return
    }
    await simulateAsync('assign-id')
    try {
      const res = await fetch(`/api/v1/admin/shooters/${assignModalShooter.id}/assign-pci-id`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pciId: assignIdValue.trim() })
      })
      if (!res.ok) throw new Error()
      
      setShooters(prev => prev.map(s => s.id === assignModalShooter.id ? { ...s, pciId: assignIdValue.trim() } : s))
      if (slideOverShooter?.id === assignModalShooter.id) setSlideOverShooter(prev => prev ? { ...prev, pciId: assignIdValue.trim() } : null)
      addToast('success', `PCI ID ${assignIdValue.trim()} assigned to ${assignModalShooter.name}`)
      setAssignModalShooter(null)
      setAssignIdValue('')
      refetchList()
    } catch {
      addToast('error', `Failed to assign PCI ID`)
    }
  }

  const openAssignModal = async (shooter: Shooter) => {
    setAssignModalShooter(shooter)
    try {
      const res = await fetch('/api/v1/admin/shooters/next-pci-id', { credentials: 'include' })
      if (res.ok) {
        const data = await res.json()
        setAssignIdValue(data.suggested)
      } else {
        setAssignIdValue(`PCI/PSAI/2025/0001`)
      }
    } catch {
      setAssignIdValue(`PCI/PSAI/2025/0001`)
    }
  }

  /* ─── Bulk Actions ─── */
  const handleBulkApprove = async () => {
    await simulateAsync('bulk-approve')
    try {
      // Backend currently lacks bulk endpoints, so we iterate for now
      // A future optimization should add bulk endpoints to the NestJS API
      const promises = Array.from(selectedIds).map(id => 
        fetch(`/api/v1/admin/shooters/${id}/approve`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({})
        })
      )
      await Promise.all(promises)
      addToast('success', `${selectedIds.size} shooters approved`)
      setSelectedIds(new Set())
      refetchStats()
      refetchList()
    } catch {
      addToast('error', 'Failed to complete some bulk approvals')
    }
  }

  const handleBulkReject = async () => {
    await simulateAsync('bulk-reject')
    try {
      const promises = Array.from(selectedIds).map(id => 
        fetch(`/api/v1/admin/shooters/${id}/reject`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reason: 'Bulk rejection from dashboard' })
        })
      )
      await Promise.all(promises)
      addToast('error', `${selectedIds.size} shooters rejected`)
      setSelectedIds(new Set())
      refetchStats()
      refetchList()
    } catch {
      addToast('error', 'Failed to complete some bulk rejections')
    }
  }

  const handleBulkDelete = async () => {
    await simulateAsync('bulk-delete')
    try {
      const promises = Array.from(selectedIds).map(id => 
        fetch(`/api/v1/admin/shooters/${id}`, { method: 'DELETE' })
      )
      await Promise.all(promises)
      addToast('info', `${selectedIds.size} shooters removed`)
      setSelectedIds(new Set())
      refetchStats()
      refetchList()
    } catch {
      addToast('error', 'Failed to complete some bulk deletions')
    }
  }

  /* ─── Checkbox Handling ─── */
  const toggleSelect = (id: number) => {
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === paginated.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(paginated.map(s => s.id)))
    }
  }

  /* ─── Export CSV ─── */
  const exportCSV = async () => {
    addToast('info', 'Preparing CSV export...')
    try {
      const params = new URLSearchParams()
      if (apiFilters.search) params.set('search', apiFilters.search)
      if (apiFilters.status && apiFilters.status !== 'all') params.set('status', apiFilters.status)
      if (apiFilters.state && apiFilters.state !== 'all') params.set('state', apiFilters.state)
      if (apiFilters.eventType && apiFilters.eventType !== 'all') params.set('eventType', apiFilters.eventType)
      if (apiFilters.category && apiFilters.category !== 'all') params.set('category', apiFilters.category)

      const res = await fetch(`/api/v1/admin/shooters/export?${params.toString()}`)
      if (!res.ok) throw new Error()
      
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `PSAI_Shooters_${apiFilters.status || 'All'}_${new Date().toISOString().split('T')[0]}.csv`
      a.click()
      URL.revokeObjectURL(url)
      addToast('success', 'Export successful')
    } catch {
      addToast('error', 'Failed to export CSV')
    }
  }

  /* ─── Helpers ─── */
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  const isLoading = (key: string) => loading[key] || false

  const statusBadge = (status: ShooterStatus) => {
    const map: Record<string, { cls: string; label: string }> = {
      incomplete: { cls: 'sm-badge-pending', label: '📝 Incomplete' },
      pending: { cls: 'sm-badge-pending', label: '⏳ Pending' },
      approved: { cls: 'sm-badge-approved', label: '✅ Approved' },
      rejected: { cls: 'sm-badge-rejected', label: '❌ Rejected' },
      needs_changes: { cls: 'sm-badge-changes', label: '🔄 Needs Changes' },
    }
    const entry = map[status] || { cls: 'sm-badge-pending', label: status }
    return <span className={`sm-badge ${entry.cls}`}>{entry.label}</span>
  }

  /* ─── Slide-Over ─── */
  const openSlideOver = (shooter: Shooter) => {
    setSlideOverShooter(shooter)
    setSlideOverTab('profile')
  }

  return (
    <div className="sm-page">
      {/* ─── Sticky Toolbar ─── */}
      <div className="sm-toolbar">
        <div className="sm-toolbar-top">
          <h1 className="sm-toolbar-title">👥 Shooter Management</h1>
          <button className="sm-btn-export" onClick={exportCSV}>📥 Export CSV</button>
        </div>

        <div className="sm-stats-row">
          <div className="sm-stat">
            <span className="sm-stat-label">Total</span>
            <span className="sm-stat-value">{stats.total}</span>
          </div>
          <div className="sm-stat">
            <span className="sm-stat-label">Pending</span>
            <span className="sm-stat-value">{stats.pending}</span>
          </div>
          <div className="sm-stat">
            <span className="sm-stat-label">Approved</span>
            <span className="sm-stat-value">{stats.approved}</span>
          </div>
          <div className="sm-stat">
            <span className="sm-stat-label">Rejected</span>
            <span className="sm-stat-value">{stats.rejected}</span>
          </div>
          <div className="sm-stat">
            <span className="sm-stat-label">Needs Changes</span>
            <span className="sm-stat-value">{stats.needs_changes}</span>
          </div>
        </div>

        <div className="sm-filters">
          <div className="sm-search-wrap">
            <span className="sm-search-icon">🔍</span>
            <input
              type="text"
              className="sm-search"
              placeholder="Search by name, PCI ID, state, competitor no..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="sm-select" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="needs_changes">Needs Changes</option>
          </select>
          <select className="sm-select" value={stateFilter} onChange={e => setStateFilter(e.target.value)}>
            <option value="all">All States</option>
            {STATES.map(st => <option key={st} value={st}>{st}</option>)}
          </select>
          <select className="sm-select" value={eventTypeFilter} onChange={e => setEventTypeFilter(e.target.value)}>
            <option value="all">All Events</option>
            {EVENT_TYPES.map(et => <option key={et} value={et}>{et}</option>)}
          </select>
          <select className="sm-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
            <option value="all">All Categories</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>

      {/* ─── Data Table ─── */}
      <div className="sm-table-wrap">
        <div className="sm-card">
          <div className="sm-table-scroll">
            <table className="sm-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      className="sm-checkbox"
                      checked={paginated.length > 0 && selectedIds.size === paginated.length}
                      onChange={toggleSelectAll}
                    />
                  </th>
                  <th>#</th>
                  <th>Competitor No</th>
                  <th>Name &amp; State</th>
                  <th>Event Type</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>PCI ID</th>
                  <th>Registered</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={10} className="sm-empty">No shooters match your filters.</td>
                  </tr>
                ) : (
                  paginated.map((shooter, idx) => (
                    <tr key={shooter.id} className={idx % 2 === 0 ? 'sm-row-even' : 'sm-row-odd'}>
                      <td>
                        <input
                          type="checkbox"
                          className="sm-checkbox"
                          checked={selectedIds.has(shooter.id)}
                          onChange={() => toggleSelect(shooter.id)}
                        />
                      </td>
                      <td className="sm-td-num">{(currentPage - 1) * PAGE_SIZE + idx + 1}</td>
                      <td className="sm-td-comp">{shooter.competitorNo}</td>
                      <td>
                        <div className="sm-name-cell">
                          <span className="sm-name">{shooter.name}</span>
                          <span className="sm-state">{shooter.state}</span>
                        </div>
                      </td>
                      <td>
                        <span className={`sm-event-badge sm-event-${shooter.eventType.toLowerCase()}`}>{shooter.eventType}</span>
                      </td>
                      <td><span className="sm-category">{shooter.category}</span></td>
                      <td>{statusBadge(shooter.status)}</td>
                      <td className="sm-td-pci">{shooter.pciId || <span className="sm-na">—</span>}</td>
                      <td className="sm-td-date">{formatDate(shooter.registeredAt)}</td>
                      <td>
                        <div className="sm-actions">
                          <button className="sm-action-btn sm-action-view" title="View Details" onClick={() => openSlideOver(shooter)}>👁</button>
                          <button className="sm-action-btn sm-action-proof" title="View Proof / Documents" onClick={() => handleViewProof(shooter)}>📎</button>
                          {(shooter.status === 'pending' || shooter.status === 'needs_changes') && (
                            <button
                              className="sm-action-btn sm-action-approve"
                              title="Approve"
                              disabled={isLoading(`approve-${shooter.id}`)}
                              onClick={() => handleApprove(shooter)}
                            >
                              {isLoading(`approve-${shooter.id}`) ? <span className="sm-spinner" /> : '✅'}
                            </button>
                          )}
                          {(shooter.status === 'pending' || shooter.status === 'approved') && (
                            <button className="sm-action-btn sm-action-assign" title="Assign PCI ID" onClick={() => openAssignModal(shooter)}>🆔</button>
                          )}
                          {shooter.status === 'approved' && (
                            <button
                              className="sm-action-btn sm-action-changes"
                              title="Revoke Approval"
                              onClick={() => handleRevokeApproval(shooter)}
                              disabled={isLoading(`revoke-${shooter.id}`)}
                            >
                              {isLoading(`revoke-${shooter.id}`) ? <span className="sm-spinner" /> : '↩'}
                            </button>
                          )}
                          {(shooter.status === 'pending' || shooter.status === 'needs_changes') && (
                            <button
                              className="sm-action-btn sm-action-changes"
                              title="Request Changes"
                              onClick={() => { setRequestChangesShooter(shooter); setRequestChangesFeedback('') }}
                            >🔄</button>
                          )}
                          {(shooter.status === 'pending' || shooter.status === 'needs_changes') && (
                            <button
                              className="sm-action-btn sm-action-reject"
                              title="Reject (Final)"
                              disabled={isLoading(`reject-${shooter.id}`)}
                              onClick={() => handleReject(shooter)}
                            >
                              {isLoading(`reject-${shooter.id}`) ? <span className="sm-spinner" /> : '❌'}
                            </button>
                          )}
                          <button
                            className="sm-action-btn sm-action-delete"
                            title="Delete"
                            onClick={() => setDeleteConfirm(shooter)}
                          >🗑</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ─── Pagination ─── */}
          <div className="sm-pagination">
            <span className="sm-pagination-info">
              Showing {total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, total)} of {total}
            </span>
            <div className="sm-pagination-btns">
              <button
                className="sm-page-btn"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >← Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button
                  key={p}
                  className={`sm-page-btn ${p === currentPage ? 'sm-page-active' : ''}`}
                  onClick={() => setCurrentPage(p)}
                >{p}</button>
              ))}
              <button
                className="sm-page-btn"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >Next →</button>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Bulk Actions Bar ─── */}
      {selectedIds.size >= 2 && (
        <div className="sm-bulk-bar">
          <span className="sm-bulk-count">{selectedIds.size} shooters selected</span>
          <div className="sm-bulk-actions">
            <button className="sm-bulk-btn sm-bulk-approve" onClick={handleBulkApprove} disabled={isLoading('bulk-approve')}>
              {isLoading('bulk-approve') ? <span className="sm-spinner" /> : '✅'} Approve All
            </button>
            <button className="sm-bulk-btn sm-bulk-reject" onClick={handleBulkReject} disabled={isLoading('bulk-reject')}>
              {isLoading('bulk-reject') ? <span className="sm-spinner" /> : '❌'} Reject All
            </button>
            <button className="sm-bulk-btn sm-bulk-delete" onClick={handleBulkDelete} disabled={isLoading('bulk-delete')}>
              {isLoading('bulk-delete') ? <span className="sm-spinner" /> : '🗑'} Delete All
            </button>
          </div>
        </div>
      )}

      {/* ─── Slide-Over Panel ─── */}
      {slideOverShooter && (
        <>
          <div className="sm-overlay" onClick={() => setSlideOverShooter(null)} />
          <div className="sm-slideover">
            <div className="sm-slideover-header">
              <div>
                <h2 className="sm-slideover-name">{slideOverShooter.name}</h2>
                <div className="sm-slideover-meta">
                  <span>{slideOverShooter.state}</span>
                  <span>•</span>
                  {statusBadge(slideOverShooter.status)}
                  <span>•</span>
                  <span>#{slideOverShooter.competitorNo}</span>
                </div>
              </div>
              <button className="sm-close-btn" onClick={() => setSlideOverShooter(null)}>✕</button>
            </div>

            <div className="sm-slideover-tabs">
              {(['profile', 'documents', 'classification', 'actions'] as const).map(tab => (
                <button
                  key={tab}
                  className={`sm-tab ${slideOverTab === tab ? 'sm-tab-active' : ''}`}
                  onClick={() => setSlideOverTab(tab)}
                >{tab.charAt(0).toUpperCase() + tab.slice(1)}</button>
              ))}
            </div>

            <div className="sm-slideover-content">
              {slideOverTab === 'profile' && (
                <div className="sm-profile-grid">
                  <div className="sm-profile-item"><span className="sm-profile-label">Full Name</span><span className="sm-profile-value">{slideOverShooter.name}</span></div>
                  <div className="sm-profile-item"><span className="sm-profile-label">Competitor No</span><span className="sm-profile-value">{slideOverShooter.competitorNo}</span></div>
                  <div className="sm-profile-item"><span className="sm-profile-label">State</span><span className="sm-profile-value">{slideOverShooter.state}</span></div>
                  <div className="sm-profile-item"><span className="sm-profile-label">Date of Birth</span><span className="sm-profile-value">{formatDate(slideOverShooter.dob)}</span></div>
                  <div className="sm-profile-item"><span className="sm-profile-label">Gender</span><span className="sm-profile-value">{slideOverShooter.gender}</span></div>
                  <div className="sm-profile-item"><span className="sm-profile-label">Guardian</span><span className="sm-profile-value">{slideOverShooter.guardianName}</span></div>
                  <div className="sm-profile-item"><span className="sm-profile-label">Contact</span><span className="sm-profile-value">{slideOverShooter.contact}</span></div>
                  <div className="sm-profile-item"><span className="sm-profile-label">Email</span><span className="sm-profile-value">{slideOverShooter.email}</span></div>
                  <div className="sm-profile-item"><span className="sm-profile-label">Event Type</span><span className="sm-profile-value">{slideOverShooter.eventType}</span></div>
                  <div className="sm-profile-item"><span className="sm-profile-label">Category</span><span className="sm-profile-value">{slideOverShooter.category}</span></div>
                  <div className="sm-profile-item"><span className="sm-profile-label">PCI ID</span><span className="sm-profile-value">{slideOverShooter.pciId || '—'}</span></div>
                  <div className="sm-profile-item"><span className="sm-profile-label">Registered</span><span className="sm-profile-value">{formatDate(slideOverShooter.registeredAt)}</span></div>
                </div>
              )}

              {slideOverTab === 'documents' && (
                <div className="sm-docs-list">
                  {loadingSlideOverData ? (
                    <div className="sm-spinner-container"><span className="sm-spinner sm-spinner-dark" /> Loading docs...</div>
                  ) : slideOverDocuments.length > 0 ? (
                    slideOverDocuments.map((doc, i) => (
                      <div key={i} className={`sm-doc-item sm-doc-uploaded`}>
                        <div className="sm-doc-info">
                          <span className="sm-doc-icon">📄</span>
                          <span className="sm-doc-name">{doc.document_type || 'Document'}</span>
                        </div>
                        <div className="sm-doc-status">
                          <span className="sm-doc-uploaded">Uploaded</span>
                          {doc.file_url && (
                            <a href={doc.file_url} target="_blank" rel="noopener noreferrer" className="sm-doc-preview" title="Preview">👁</a>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="sm-no-docs">No documents found for this shooter.</div>
                  )}
                </div>
              )}

              {slideOverTab === 'classification' && (
                <div className="sm-class-section">
                  {loadingSlideOverData ? (
                    <div className="sm-spinner-container"><span className="sm-spinner sm-spinner-dark" /> Loading info...</div>
                  ) : slideOverClassification ? (
                    <div className="sm-class-grid">
                      <div className="sm-profile-item"><span className="sm-profile-label">Category</span><span className="sm-profile-value">{slideOverClassification.category || slideOverShooter.category || '—'}</span></div>
                      <div className="sm-profile-item"><span className="sm-profile-label">Classification Date</span><span className="sm-profile-value">{formatDate(slideOverClassification.classification_date || slideOverShooter.classificationDate)}</span></div>
                      <div className="sm-profile-item sm-profile-full"><span className="sm-profile-label">Equipment Adaptations</span><span className="sm-profile-value">{slideOverClassification.equipment_adaptations || slideOverShooter.equipmentAdaptations || 'None reported'}</span></div>
                    </div>
                  ) : (
                    <div className="sm-class-grid">
                      <div className="sm-profile-item"><span className="sm-profile-label">Category</span><span className="sm-profile-value">{slideOverShooter.category || '—'}</span></div>
                      <div className="sm-profile-item"><span className="sm-profile-label">Classification Date</span><span className="sm-profile-value">{formatDate(slideOverShooter.classificationDate)}</span></div>
                      <div className="sm-profile-item sm-profile-full"><span className="sm-profile-label">Equipment Adaptations</span><span className="sm-profile-value">{slideOverShooter.equipmentAdaptations || 'None reported'}</span></div>
                    </div>
                  )}
                </div>
              )}

              {slideOverTab === 'actions' && (
                <div className="sm-actions-tab">

                  {/* ── Pending / Needs Changes ── */}
                  {(slideOverShooter.status === 'pending' || slideOverShooter.status === 'needs_changes') && (
                    <div className="sm-actions-group">
                      <h3 className="sm-actions-title">Review Application</h3>
                      <div className="sm-actions-btns">
                        <button className="sm-panel-btn sm-panel-approve" onClick={() => handleApprove(slideOverShooter)} disabled={isLoading(`approve-${slideOverShooter.id}`)}>
                          {isLoading(`approve-${slideOverShooter.id}`) ? <span className="sm-spinner" /> : '✅'} Approve Shooter
                        </button>
                        <button className="sm-panel-btn sm-panel-changes" onClick={() => { setRequestChangesShooter(slideOverShooter); setRequestChangesFeedback('') }}>
                          🔄 Request Changes
                        </button>
                        <button className="sm-panel-btn sm-panel-reject" onClick={() => handleReject(slideOverShooter)} disabled={isLoading(`reject-${slideOverShooter.id}`)}>
                          {isLoading(`reject-${slideOverShooter.id}`) ? <span className="sm-spinner" /> : '❌'} Reject (Final)
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── Approved ── */}
                  {slideOverShooter.status === 'approved' && (
                    <div className="sm-actions-group">
                      <h3 className="sm-actions-title">Approved Shooter</h3>
                      <div className="sm-actions-btns">
                        <button className="sm-panel-btn sm-panel-changes" onClick={() => handleRevokeApproval(slideOverShooter)} disabled={isLoading(`revoke-${slideOverShooter.id}`)}>
                          {isLoading(`revoke-${slideOverShooter.id}`) ? <span className="sm-spinner" /> : '↩'} Revoke Approval
                        </button>
                        <button className="sm-panel-btn sm-panel-changes" onClick={() => { setRequestChangesShooter(slideOverShooter); setRequestChangesFeedback('') }}>
                          🔄 Request Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ── Rejected ── */}
                  {slideOverShooter.status === 'rejected' && (
                    <div className="sm-actions-group">
                      <h3 className="sm-actions-title">Rejected Application</h3>
                      <p className="sm-actions-desc" style={{color:'#c62828'}}>This application has been finally rejected.</p>
                    </div>
                  )}

                  {/* ── Incomplete ── */}
                  {slideOverShooter.status === 'incomplete' && (
                    <div className="sm-actions-group">
                      <h3 className="sm-actions-title">Incomplete Profile</h3>
                      <p className="sm-actions-desc">Shooter has not submitted their profile for review yet.</p>
                    </div>
                  )}

                  {/* ── Always visible ── */}
                  <div className="sm-actions-group">
                    <h3 className="sm-actions-title">Documents &amp; Proof</h3>
                    <button className="sm-panel-btn sm-panel-assign" onClick={() => setSlideOverTab('documents')}>📎 View Uploaded Documents</button>
                  </div>
                  <div className="sm-actions-group">
                    <h3 className="sm-actions-title">Assign PCI ID</h3>
                    <p className="sm-actions-desc">Current: {slideOverShooter.pciId || 'Not assigned'}</p>
                    <button className="sm-panel-btn sm-panel-assign" onClick={() => openAssignModal(slideOverShooter)}>🆔 Assign PCI ID</button>
                  </div>
                  <div className="sm-actions-group">
                    <h3 className="sm-actions-title" style={{color:'#c62828'}}>Danger Zone</h3>
                    <button className="sm-panel-btn sm-panel-reject" onClick={() => setDeleteConfirm(slideOverShooter)}>🗑 Delete Shooter</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* ─── Assign PCI ID Modal ─── */}
      {assignModalShooter && (
        <>
          <div className="sm-modal-overlay" onClick={() => { setAssignModalShooter(null); setAssignIdValue('') }} />
          <div className="sm-modal">
            <h2 className="sm-modal-title">🆔 Assign PCI ID</h2>
            <p className="sm-modal-subtitle">Assigning ID to <strong>{assignModalShooter.name}</strong></p>
            <div className="sm-modal-field">
              <label className="sm-modal-label">Enter PCI ID</label>
              <input
                type="text"
                className="sm-modal-input"
                placeholder="PCI/PSAI/2025/____"
                value={assignIdValue}
                onChange={e => setAssignIdValue(e.target.value)}
              />
              <span className="sm-modal-hint">Format: PCI/PSAI/YYYY/XXXX</span>
            </div>
            <div className="sm-modal-btns">
              <button className="sm-modal-cancel" onClick={() => { setAssignModalShooter(null); setAssignIdValue('') }}>Cancel</button>
              <button className="sm-modal-confirm" onClick={handleAssignId} disabled={isLoading('assign-id')}>
                {isLoading('assign-id') ? <span className="sm-spinner" /> : null} Assign &amp; Notify
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── Delete Confirmation Modal ─── */}
      {deleteConfirm && (
        <>
          <div className="sm-modal-overlay" onClick={() => setDeleteConfirm(null)} />
          <div className="sm-modal sm-modal-delete">
            <h2 className="sm-modal-title">⚠️ Confirm Deletion</h2>
            <p className="sm-modal-subtitle">Are you sure you want to delete <strong>{deleteConfirm.name}</strong>? This action cannot be undone.</p>
            <div className="sm-modal-btns">
              <button className="sm-modal-cancel" onClick={() => setDeleteConfirm(null)}>Cancel</button>
              <button
                className="sm-modal-delete-btn"
                onClick={() => handleDelete(deleteConfirm)}
                disabled={isLoading(`delete-${deleteConfirm.id}`)}
              >
                {isLoading(`delete-${deleteConfirm.id}`) ? <span className="sm-spinner" /> : '🗑'} Delete Permanently
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── Request Changes Modal ─── */}
      {requestChangesShooter && (
        <>
          <div className="sm-modal-overlay" onClick={() => { setRequestChangesShooter(null); setRequestChangesFeedback('') }} />
          <div className="sm-modal">
            <h2 className="sm-modal-title">🔄 Request Changes</h2>
            <p className="sm-modal-subtitle">Requesting corrections from <strong>{requestChangesShooter.name}</strong></p>
            <p className="sm-modal-hint-text">The shooter will be notified and can edit &amp; resubmit their application. This is not a final rejection.</p>
            <div className="sm-modal-field">
              <label className="sm-modal-label">Feedback / Reason for Changes</label>
              <textarea
                className="sm-modal-textarea"
                placeholder="e.g. Please upload a clearer payment proof. The Aadhar card image is blurry."
                rows={4}
                value={requestChangesFeedback}
                onChange={e => setRequestChangesFeedback(e.target.value)}
              />
            </div>
            <div className="sm-modal-btns">
              <button className="sm-modal-cancel" onClick={() => { setRequestChangesShooter(null); setRequestChangesFeedback('') }}>Cancel</button>
              <button
                className="sm-modal-confirm sm-modal-changes-btn"
                onClick={() => handleRequestChanges(requestChangesShooter, requestChangesFeedback)}
                disabled={!requestChangesFeedback.trim() || isLoading(`request-changes-${requestChangesShooter.id}`)}
              >
                {isLoading(`request-changes-${requestChangesShooter.id}`) ? <span className="sm-spinner" /> : null} Send &amp; Request Changes
              </button>
            </div>
          </div>
        </>
      )}

      {/* ─── Toast Notifications ─── */}
      <div className="sm-toast-container">
        {toasts.map(toast => (
          <div key={toast.id} className={`sm-toast sm-toast-${toast.type}`}>
            <span className="sm-toast-icon">
              {toast.type === 'success' ? '✓' : toast.type === 'error' ? '✕' : 'ℹ'}
            </span>
            <span className="sm-toast-msg">{toast.message}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
