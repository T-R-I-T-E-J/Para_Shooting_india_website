'use client'

import React, { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, Edit3, Target, Users, CreditCard, FileText,
  CheckCircle, XCircle, Download, Plus, Trash2, RefreshCw, RotateCcw,
  AlertCircle, Clock, DollarSign, BarChart2, Image as ImageIcon, Eye,
} from 'lucide-react'
import '../competitions.css'

/* ─── Types ─────────────────────────────────────────────────────────── */
interface Competition {
  id: number; code: string; name: string;
  duration_start: string; duration_end: string;
  place: string; payment_mode: string;
  is_active: boolean; events: CompEvent[];
}
interface CompEvent { id: number; event_no: string; event_name: string; fee: number }
interface Stats { total: number; approved: number; pending: number; rejected: number; revenue: string }
interface Registration {
  id: number; competition_no: string | null; status: string;
  payment_status: string; amount: number; payment_method: string;
  payment_proof_url: string | null; created_at: string;
  shooter: { id: number; user: { first_name: string; last_name: string } | null; state_association: { name: string } | null }
  registration_events: { event_name_snapshot: string; fee_snapshot: number }[]
}
interface EventBreakdown { event_no: string; event_name: string; participant_count: number; total_fees: string }
interface Toast { id: number; type: 'success' | 'error' | 'info'; message: string }

/* ─── Small helpers ─────────────────────────────────────────────────── */
const fmt = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
const statusBadge = (s: string) => {
  const map: Record<string, string> = {
    submitted: 'comp-badge bg-yellow-100 text-yellow-700',
    under_review: 'comp-badge bg-blue-100 text-blue-700',
    approved: 'comp-badge comp-badge-success',
    rejected: 'comp-badge comp-badge-danger',
    pending: 'comp-badge bg-gray-100 text-gray-600',
    uploaded: 'comp-badge bg-purple-100 text-purple-700',
    verified: 'comp-badge comp-badge-success',
    failed: 'comp-badge comp-badge-danger',
  }
  return map[s] ?? 'comp-badge bg-gray-100 text-gray-700'
}

/* ─── EventRow (inline editable) ────────────────────────────────────── */
function EventRow({
  ev, competitionId, onSaved, onDeleted,
}: { ev: CompEvent; competitionId: number; onSaved: () => void; onDeleted: () => void }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ event_no: ev.event_no, event_name: ev.event_name, fee: String(ev.fee) })
  const [busy, setBusy] = useState(false)

  const save = async () => {
    setBusy(true)
    const res = await fetch(`/api/v1/admin/competitions/${competitionId}/events/${ev.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_no: form.event_no, event_name: form.event_name, fee: Number(form.fee) }),
    })
    setBusy(false)
    if (res.ok) { setEditing(false); onSaved() }
  }
  const del = async () => {
    if (!confirm('Delete this event?')) return
    setBusy(true)
    await fetch(`/api/v1/admin/competitions/${competitionId}/events/${ev.id}`, { method: 'DELETE' })
    setBusy(false)
    onDeleted()
  }

  if (!editing) return (
    <tr>
      <td className="font-semibold text-gray-700">{ev.event_no}</td>
      <td>{ev.event_name}</td>
      <td>₹{ev.fee}</td>
      <td>
        <div className="flex gap-2">
          <button title="Edit" onClick={() => setEditing(true)} className="text-blue-600 hover:text-blue-800"><Edit3 size={16} /></button>
          <button title="Delete" onClick={del} disabled={busy} className="text-red-600 hover:text-red-800 disabled:opacity-50"><Trash2 size={16} /></button>
        </div>
      </td>
    </tr>
  )

  return (
    <tr className="bg-blue-50">
      <td><input value={form.event_no} onChange={e => setForm(p => ({ ...p, event_no: e.target.value }))} className="border rounded px-2 py-1 w-20 text-sm" /></td>
      <td><input value={form.event_name} onChange={e => setForm(p => ({ ...p, event_name: e.target.value }))} className="border rounded px-2 py-1 w-full text-sm" /></td>
      <td><input type="number" value={form.fee} onChange={e => setForm(p => ({ ...p, fee: e.target.value }))} className="border rounded px-2 py-1 w-24 text-sm" /></td>
      <td>
        <div className="flex gap-2">
          <button onClick={save} disabled={busy} className="comp-btn comp-btn-primary text-xs py-1 px-3">{busy ? '...' : 'Save'}</button>
          <button onClick={() => setEditing(false)} className="comp-btn comp-btn-outline text-xs py-1 px-3">Cancel</button>
        </div>
      </td>
    </tr>
  )
}

/* ─── Main Component ─────────────────────────────────────────────────── */
export default function CompetitionDashboard() {
  const router = useRouter()
  const params = useParams()
  const cid = Number(params.id)

  const [competition, setCompetition] = useState<Competition | null>(null)
  const [stats, setStats] = useState<Stats | null>(null)
  const [registrations, setRegistrations] = useState<Registration[]>([])
  const [breakdown, setBreakdown] = useState<EventBreakdown[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('registrations')
  const [regFilter, setRegFilter] = useState('')
  const [payFilter, setPayFilter] = useState('')
  const [error, setError] = useState('')
  const [newEvent, setNewEvent] = useState({ event_no: '', event_name: '', fee: '' })
  const [addingEvent, setAddingEvent] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [selectedScreenshotUrl, setSelectedScreenshotUrl] = useState<string | null>(null)
  const [selectedRegistration, setSelectedRegistration] = useState<Registration | null>(null)
  const [revokeTarget, setRevokeTarget] = useState<number | null>(null)
  const [changesTarget, setChangesTarget] = useState<number | null>(null)
  const [changesFeedback, setChangesFeedback] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null)
  const [actionBusy, setActionBusy] = useState(false)

  const toastIdRef = useRef(0)
  const [toasts, setToasts] = useState<Toast[]>([])

  const toast = useCallback((type: Toast['type'], message: string) => {
    const id = ++toastIdRef.current
    setToasts(prev => [...prev, { id, type, message }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500)
  }, [])

  const fetchAll = useCallback(async () => {
    try {
      const [compRes, statsRes, regRes, breakdownRes] = await Promise.all([
        fetch(`/api/v1/admin/competitions/${cid}`),
        fetch(`/api/v1/admin/competitions/${cid}/stats`),
        fetch(`/api/v1/admin/registrations/competition/${cid}`),
        fetch(`/api/v1/admin/registrations/competition/${cid}/reports`),
      ])
      if (!compRes.ok) throw new Error('Failed to load competition')
      const compData = await compRes.json()
      setCompetition(compData.data || compData)
      if (statsRes.ok) { const d = await statsRes.json(); setStats(d.data || d) }
      if (regRes.ok) { const d = await regRes.json(); setRegistrations(d.data || d) }
      if (breakdownRes.ok) { const d = await breakdownRes.json(); setBreakdown(d.data || d) }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [cid])

  useEffect(() => { fetchAll() }, [fetchAll])

  // Keep selectedRegistration in sync when registrations list refreshes
  useEffect(() => {
    if (selectedRegistration) {
      const updated = registrations.find(r => r.id === selectedRegistration.id)
      if (updated) setSelectedRegistration(updated)
    }
  }, [registrations])

  /* ── Approve / Reject / Changes / Revoke / Delete ── */
  const approve = async (regId: number) => {
    setActionBusy(true)
    const res = await fetch(`/api/v1/admin/registrations/${regId}/approve`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({}),
    })
    setActionBusy(false)
    if (res.ok) { toast('success', 'Registration approved'); fetchAll() }
    else toast('error', 'Approval failed')
  }
  const reject = async (regId: number) => {
    setActionBusy(true)
    const res = await fetch(`/api/v1/admin/registrations/${regId}/reject`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason: 'Rejected by admin' }),
    })
    setActionBusy(false)
    if (res.ok) { toast('success', 'Registration rejected'); fetchAll() }
    else toast('error', 'Reject failed')
  }
  const confirmRevoke = async () => {
    if (!revokeTarget) return
    setActionBusy(true)
    const res = await fetch(`/api/v1/admin/registrations/${revokeTarget}/revoke`, { method: 'PATCH' })
    setActionBusy(false)
    setRevokeTarget(null)
    if (res.ok) { toast('success', 'Approval revoked'); fetchAll() }
    else toast('error', 'Failed to revoke approval')
  }
  const confirmRequestChanges = async () => {
    if (!changesTarget || !changesFeedback.trim()) return
    setActionBusy(true)
    const res = await fetch(`/api/v1/admin/registrations/${changesTarget}/request-changes`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ feedback: changesFeedback.trim() }),
    })
    setActionBusy(false)
    setChangesTarget(null); setChangesFeedback('')
    if (res.ok) { toast('success', 'Changes requested'); fetchAll() }
    else toast('error', 'Failed to request changes')
  }
  const confirmDelete = async () => {
    if (!deleteTarget) return
    setActionBusy(true)
    const res = await fetch(`/api/v1/admin/registrations/${deleteTarget}`, { method: 'DELETE' })
    setActionBusy(false)
    setDeleteTarget(null)
    if (res.ok) { toast('info', 'Registration deleted'); fetchAll() }
    else toast('error', 'Failed to delete')
  }
  const deleteRegistration = (regId: number) => setDeleteTarget(regId)
  const revokeApproval = (regId: number) => setRevokeTarget(regId)
  const requestChanges = (regId: number) => { setChangesTarget(regId); setChangesFeedback('') }
  /* ── Verify / Fail Payment ── */
  const verifyPay = async (regId: number) => {
    const remarks = prompt('Verification remarks (optional):') ?? undefined
    const res = await fetch(`/api/v1/admin/registrations/${regId}/verify-payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ remarks }),
    })
    if (res.ok) { toast('success', 'Payment verified'); fetchAll() }
    else toast('error', 'Verification failed')
  }
  const failPay = async (regId: number) => {
    const reason = prompt('Reason:')
    if (!reason) return
    const res = await fetch(`/api/v1/admin/registrations/${regId}/fail-payment`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reason }),
    })
    if (res.ok) { toast('success', 'Payment marked failed'); fetchAll() }
    else toast('error', 'Failed')
  }

  /* ── Add Event ── */
  const addEvent = async () => {
    if (!newEvent.event_no || !newEvent.event_name || !newEvent.fee) {
      toast('error', 'All fields required'); return
    }
    const res = await fetch(`/api/v1/admin/competitions/${cid}/events`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event_no: newEvent.event_no, event_name: newEvent.event_name, fee: Number(newEvent.fee) }),
    })
    if (res.ok) {
      toast('success', 'Event added')
      setNewEvent({ event_no: '', event_name: '', fee: '' })
      setAddingEvent(false)
      fetchAll()
    } else toast('error', 'Failed to add event')
  }

  /* ── CSV Export ── */
  const exportCsv = async () => {
    setExportLoading(true)
    const res = await fetch(`/api/v1/admin/registrations/competition/${cid}/export`)
    if (res.ok) {
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url; a.download = `registrations_comp_${cid}.csv`; a.click()
      URL.revokeObjectURL(url)
    } else toast('error', 'Export failed')
    setExportLoading(false)
  }

  /* ── Filtered lists ── */
  const shooterName = (r: Registration) => r.shooter?.user
    ? `${r.shooter.user.first_name} ${r.shooter.user.last_name}`.trim()
    : `Shooter #${r.shooter?.id}`

  const filteredRegs = registrations.filter(r => {
    if (!regFilter) return true
    const f = regFilter.toLowerCase()
    return shooterName(r).toLowerCase().includes(f) || (r.competition_no ?? '').toLowerCase().includes(f) || r.status.includes(f)
  })

  const filteredPays = registrations.filter(r => {
    if (!payFilter) return true
    const f = payFilter.toLowerCase()
    return shooterName(r).toLowerCase().includes(f) || r.payment_status.includes(f)
  })

  /* ─── Render ──────────────────────────────────────────────────────── */
  if (loading) return (
    <div className="comp-page flex justify-center items-center h-screen">
      <div className="comp-spinner w-10 h-10 border-4" />
    </div>
  )

  if (error || !competition) return (
    <div className="comp-page">
      <div className="comp-card p-8 text-center text-red-600">
        <AlertCircle size={40} className="mx-auto mb-3" />
        <h2 className="text-lg font-semibold mb-1">Error</h2>
        <p>{error || 'Competition not found'}</p>
        <button onClick={() => router.push('/admin/competitions')} className="comp-btn comp-btn-outline mt-4 mx-auto">
          Back to Competitions
        </button>
      </div>
    </div>
  )

  const tabs = [
    { id: 'registrations', icon: Users, label: 'Registrations' },
    { id: 'payments', icon: CreditCard, label: 'Payments' },
    { id: 'events', icon: Target, label: 'Sub-Events' },
    { id: 'reports', icon: BarChart2, label: 'Reports' },
  ]

  return (
    <div className="comp-page">
      {/* Toasts */}
      <div className="comp-toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`comp-toast comp-toast-${t.type}`}>{t.message}</div>
        ))}
      </div>

      {/* Header */}
      <div className="comp-header" style={{ marginBottom: '1.5rem' }}>
        <div className="comp-titles">
          <Link href="/admin/competitions" className="comp-btn comp-btn-outline" style={{ padding: '0.5rem' }}>
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="comp-title">{competition.name}</h1>
            <div className="flex flex-wrap items-center gap-3 mt-1">
              <span className="comp-subtitle font-mono bg-gray-100 px-2 rounded">{competition.code}</span>
              <span className={`comp-badge ${competition.is_active ? 'comp-badge-success' : 'comp-badge-danger'}`}>
                {competition.is_active ? 'Active' : 'Inactive'}
              </span>
              <span className="text-sm text-gray-500">{fmt(competition.duration_start)} – {fmt(competition.duration_end)}</span>
              <span className="text-sm text-gray-500">{competition.place}</span>
            </div>
          </div>
        </div>
        <div className="comp-actions">
          <button onClick={fetchAll} className="comp-btn comp-btn-outline" title="Refresh">
            <RefreshCw size={16} />
          </button>
          <button onClick={exportCsv} disabled={exportLoading} className="comp-btn comp-btn-outline">
            <Download size={16} /> {exportLoading ? 'Exporting…' : 'Export CSV'}
          </button>
        </div>
      </div>

      {/* Stats Strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          { label: 'Total', value: stats?.total ?? 0, color: 'text-gray-900' },
          { label: 'Approved', value: stats?.approved ?? 0, color: 'text-green-600' },
          { label: 'Pending', value: stats?.pending ?? 0, color: 'text-yellow-600' },
          { label: 'Rejected', value: stats?.rejected ?? 0, color: 'text-red-600' },
          { label: 'Revenue', value: `₹${stats?.revenue ?? 0}`, color: 'text-blue-700' },
        ].map(s => (
          <div key={s.label} className="comp-card p-4">
            <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">{s.label}</p>
            <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
        {tabs.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${activeTab === tab.id
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'}`}
            >
              <Icon size={16} />{tab.label}
            </button>
          )
        })}
      </div>

      {/* ── Tab: REGISTRATIONS ─────────────────────────────────────── */}
      {activeTab === 'registrations' && (
        <div className="comp-card">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3 flex-wrap">
            <input
              placeholder="Search name, comp no, status…"
              value={regFilter}
              onChange={e => setRegFilter(e.target.value)}
              className="comp-search-input flex-1 min-w-[200px]"
            />
            <span className="text-sm text-gray-500">{filteredRegs.length} registrations</span>
          </div>
          <div className="comp-table-container">
            {filteredRegs.length === 0 ? (
              <div className="comp-empty">
                <Users size={40} className="text-gray-300 mb-3" />
                <p className="text-gray-500">No registrations found.</p>
              </div>
            ) : (
              <table className="comp-table">
                <thead>
                  <tr>
                    <th>Comp No</th>
                    <th>Shooter</th>
                    <th>State</th>
                    <th>Events</th>
                    <th>Amount</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRegs.map(r => (
                    <tr key={r.id}>
                      <td className="font-mono text-sm font-semibold text-gray-700">{r.competition_no ?? '—'}</td>
                      <td>
                        <div className="font-medium text-gray-900">{shooterName(r)}</div>
                        <div className="text-xs text-gray-400">{new Date(r.created_at).toLocaleDateString('en-IN')}</div>
                      </td>
                      <td className="text-sm text-gray-600">{r.shooter?.state_association?.name ?? '—'}</td>
                      <td>
                        <div className="flex flex-wrap gap-1">
                          {r.registration_events?.map((re, i) => (
                            <span key={i} className="comp-badge bg-blue-50 text-blue-700 text-xs">{re.event_name_snapshot}</span>
                          ))}
                        </div>
                      </td>
                      <td className="font-medium">₹{r.amount}</td>
                      <td><span className={statusBadge(r.payment_status)}>{r.payment_status}</span></td>
                      <td><span className={statusBadge(r.status)}>{r.status}</span></td>
                      <td>
                        <div className="flex gap-2 flex-wrap items-center">
                          {r.payment_proof_url ? (
                             <button onClick={() => setSelectedScreenshotUrl(r.payment_proof_url)} className="flex items-center gap-1 text-sm comp-btn comp-btn-outline py-1 px-2 border-blue-500 text-blue-600 hover:bg-blue-50" title="View Payment Proof">
                               <ImageIcon size={14} /> View Proof
                             </button>
                          ) : (
                             <span className="text-xs text-gray-400">No Proof</span>
                          )}
                          <div className="flex gap-2">
                            <button onClick={() => setSelectedRegistration(r)} className="text-gray-500 hover:text-blue-700" title="View Details">
                              <Eye size={18} />
                            </button>
                            {(r.status === 'submitted' || r.status === 'under_review') && (
                              <button onClick={() => approve(r.id)} className="text-green-600 hover:text-green-800" title="Approve">
                                <CheckCircle size={18} />
                              </button>
                            )}
                            {r.status === 'approved' && (
                              <button onClick={() => revokeApproval(r.id)} className="text-yellow-600 hover:text-yellow-800" title="Revoke Approval">
                                <RotateCcw size={18} />
                              </button>
                            )}
                            {(r.status === 'submitted' || r.status === 'under_review') && (
                              <button onClick={() => requestChanges(r.id)} className="text-blue-600 hover:text-blue-800" title="Request Changes">
                                <RefreshCw size={18} />
                              </button>
                            )}
                            {(r.status === 'submitted' || r.status === 'under_review') && (
                              <button onClick={() => reject(r.id)} className="text-red-600 hover:text-red-800" title="Reject">
                                <XCircle size={18} />
                              </button>
                            )}
                            <button onClick={() => deleteRegistration(r.id)} className="text-gray-500 hover:text-red-700" title="Delete">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: PAYMENTS ─────────────────────────────────────────── */}
      {activeTab === 'payments' && (
        <div className="comp-card">
          <div className="p-4 border-b border-gray-100 flex items-center gap-3 flex-wrap">
            <input
              placeholder="Search name or payment status…"
              value={payFilter}
              onChange={e => setPayFilter(e.target.value)}
              className="comp-search-input flex-1 min-w-[200px]"
            />
          </div>
          <div className="comp-table-container">
            {filteredPays.length === 0 ? (
              <div className="comp-empty">
                <CreditCard size={40} className="text-gray-300 mb-3" />
                <p className="text-gray-500">No payment records.</p>
              </div>
            ) : (
              <table className="comp-table">
                <thead>
                  <tr>
                    <th>Shooter</th>
                    <th>Amount</th>
                    <th>Method</th>
                    <th>Proof</th>
                    <th>Payment Status</th>
                    <th>Reg Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPays.map(r => (
                    <tr key={r.id}>
                      <td>
                        <div className="font-medium text-gray-900">{shooterName(r)}</div>
                        {r.competition_no && <div className="text-xs font-mono text-gray-400">{r.competition_no}</div>}
                      </td>
                      <td className="font-semibold">₹{r.amount}</td>
                      <td>
                        <span className="comp-badge bg-gray-100 text-gray-700 capitalize">{r.payment_method || '—'}</span>
                      </td>
                      <td>
                        {r.payment_proof_url ? (
                          <button onClick={() => setSelectedScreenshotUrl(r.payment_proof_url)}
                            className="flex items-center gap-1 text-blue-600 hover:underline text-sm">
                            <ImageIcon size={14} /> View
                          </button>
                        ) : (
                          <span className="text-gray-400 text-sm">No proof</span>
                        )}
                      </td>
                      <td><span className={statusBadge(r.payment_status)}>{r.payment_status}</span></td>
                      <td><span className={statusBadge(r.status)}>{r.status}</span></td>
                      <td>
                        <div className="flex gap-2">
                          {r.payment_status !== 'verified' && r.payment_status !== 'failed' && (
                            <>
                              <button onClick={() => verifyPay(r.id)} title="Verify" className="text-green-600 hover:text-green-800">
                                <CheckCircle size={18} />
                              </button>
                              <button onClick={() => failPay(r.id)} title="Mark Failed" className="text-red-600 hover:text-red-800">
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      )}

      {/* ── Tab: SUB-EVENTS ───────────────────────────────────────── */}
      {activeTab === 'events' && (
        <div className="comp-card">
          <div className="p-5 border-b border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Sub-Events</h3>
              <p className="text-sm text-gray-500">Define match types and assign individual fees</p>
            </div>
            <button onClick={() => setAddingEvent(true)} className="comp-btn comp-btn-primary">
              <Plus size={16} /> Add Event
            </button>
          </div>
          <div className="comp-table-container">
            <table className="comp-table">
              <thead>
                <tr>
                  <th>Code</th><th>Event Name</th><th>Fee (₹)</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {addingEvent && (
                  <tr className="bg-green-50">
                    <td><input placeholder="E01" value={newEvent.event_no} onChange={e => setNewEvent(p => ({ ...p, event_no: e.target.value }))} className="border rounded px-2 py-1 w-20 text-sm" /></td>
                    <td><input placeholder="10M Air Pistol (Men)" value={newEvent.event_name} onChange={e => setNewEvent(p => ({ ...p, event_name: e.target.value }))} className="border rounded px-2 py-1 w-full text-sm" /></td>
                    <td><input type="number" placeholder="500" value={newEvent.fee} onChange={e => setNewEvent(p => ({ ...p, fee: e.target.value }))} className="border rounded px-2 py-1 w-24 text-sm" /></td>
                    <td>
                      <div className="flex gap-2">
                        <button onClick={addEvent} className="comp-btn comp-btn-primary text-xs py-1 px-3">Save</button>
                        <button onClick={() => setAddingEvent(false)} className="comp-btn comp-btn-outline text-xs py-1 px-3">Cancel</button>
                      </div>
                    </td>
                  </tr>
                )}
                {competition.events && competition.events.length > 0 ? (
                  competition.events.map(ev => (
                    <EventRow
                      key={ev.id}
                      ev={ev}
                      competitionId={cid}
                      onSaved={fetchAll}
                      onDeleted={fetchAll}
                    />
                  ))
                ) : !addingEvent ? (
                  <tr><td colSpan={4} className="text-center py-10 text-gray-400">
                    No events yet — click "Add Event" to get started.
                  </td></tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Tab: REPORTS ─────────────────────────────────────────── */}
      {activeTab === 'reports' && (
        <div className="space-y-6">
          {/* Summary cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Users, label: 'Total Shooters', value: stats?.total ?? 0, color: 'text-blue-700' },
              { icon: CheckCircle, label: 'Approved', value: stats?.approved ?? 0, color: 'text-green-600' },
              { icon: Clock, label: 'Pending', value: stats?.pending ?? 0, color: 'text-yellow-600' },
              { icon: DollarSign, label: 'Confirmed Revenue', value: `₹${stats?.revenue ?? 0}`, color: 'text-purple-700' },
            ].map(s => {
              const Icon = s.icon
              return (
                <div key={s.label} className="comp-card p-5">
                  <div className="flex items-center gap-3 mb-2">
                    <Icon size={20} className={s.color} />
                    <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{s.label}</p>
                  </div>
                  <p className={`text-2xl font-bold ${s.color}`}>{s.value}</p>
                </div>
              )
            })}
          </div>

          {/* Event breakdown table */}
          <div className="comp-card">
            <div className="p-5 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-semibold text-gray-900">Event-wise Breakdown</h3>
              <button onClick={exportCsv} disabled={exportLoading} className="comp-btn comp-btn-outline">
                <Download size={14} /> {exportLoading ? 'Exporting…' : 'Export CSV'}
              </button>
            </div>
            <div className="comp-table-container">
              {breakdown.length === 0 ? (
                <div className="comp-empty">
                  <BarChart2 size={40} className="text-gray-300 mb-3" />
                  <p className="text-gray-500">No data yet. Registrations or approvals will appear here.</p>
                </div>
              ) : (
                <table className="comp-table">
                  <thead>
                    <tr>
                      <th>Event Code</th>
                      <th>Event Name</th>
                      <th>Participants</th>
                      <th>Total Fees (₹)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {breakdown.map(b => (
                      <tr key={b.event_no}>
                        <td className="font-mono font-semibold text-gray-700">{b.event_no}</td>
                        <td>{b.event_name}</td>
                        <td>
                          <span className="comp-badge bg-blue-50 text-blue-700">{b.participant_count}</span>
                        </td>
                        <td className="font-semibold">₹{Number(b.total_fees).toFixed(2)}</td>
                      </tr>
                    ))}
                    {/* Totals row */}
                    <tr className="bg-gray-50 font-semibold">
                      <td colSpan={2} className="text-right text-gray-700 pr-4">Total</td>
                      <td className="text-blue-700">{breakdown.reduce((a, b) => a + b.participant_count, 0)}</td>
                      <td className="text-purple-700">₹{breakdown.reduce((a, b) => a + Number(b.total_fees), 0).toFixed(2)}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── Revoke Confirm Modal ── */}
      {revokeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={() => setRevokeTarget(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-800 mb-2">↩ Revoke Approval</h2>
            <p className="text-sm text-gray-500 mb-5">This will move the registration back to <strong>Under Review</strong>. The shooter can be re-approved.</p>
            <div className="flex gap-3">
              <button onClick={() => setRevokeTarget(null)} className="flex-1 comp-btn comp-btn-outline text-sm py-2">Cancel</button>
              <button onClick={confirmRevoke} disabled={actionBusy} className="flex-1 comp-btn comp-btn-primary text-sm py-2 bg-yellow-500 border-yellow-500 hover:bg-yellow-600">{actionBusy ? '...' : 'Revoke'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Request Changes Modal ── */}
      {changesTarget !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={() => setChangesTarget(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-800 mb-1">🔄 Request Changes</h2>
            <p className="text-xs text-gray-500 mb-3">The shooter will be notified to fix and resubmit.</p>
            <textarea
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:border-blue-400"
              rows={4}
              placeholder="e.g. Please upload a clearer payment screenshot..."
              value={changesFeedback}
              onChange={e => setChangesFeedback(e.target.value)}
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => setChangesTarget(null)} className="flex-1 comp-btn comp-btn-outline text-sm py-2">Cancel</button>
              <button onClick={confirmRequestChanges} disabled={!changesFeedback.trim() || actionBusy} className="flex-1 comp-btn comp-btn-primary text-sm py-2">{actionBusy ? '...' : 'Send Request'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Delete Confirm Modal ── */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={() => setDeleteTarget(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
            <h2 className="text-lg font-bold text-gray-800 mb-2">🗑 Delete Registration</h2>
            <p className="text-sm text-gray-500 mb-5">This action cannot be undone. The shooter will need to re-register.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteTarget(null)} className="flex-1 comp-btn comp-btn-outline text-sm py-2">Cancel</button>
              <button onClick={confirmDelete} disabled={actionBusy} className="flex-1 comp-btn comp-btn-outline text-sm py-2 border-red-400 text-red-600 hover:bg-red-50">{actionBusy ? '...' : 'Delete'}</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Registration Detail Modal ── */}
      {selectedRegistration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4" onClick={() => setSelectedRegistration(null)}>
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b">
              <h2 className="text-lg font-bold text-gray-800">Registration Details</h2>
              <button onClick={() => setSelectedRegistration(null)} className="text-gray-400 hover:text-gray-700"><XCircle size={22} /></button>
            </div>
            <div className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div><span className="text-gray-500 block">Shooter Name</span><span className="font-medium">{selectedRegistration.shooter?.user ? `${selectedRegistration.shooter.user.first_name} ${selectedRegistration.shooter.user.last_name}` : '—'}</span></div>
                <div><span className="text-gray-500 block">State</span><span className="font-medium">{selectedRegistration.shooter?.state_association?.name || '—'}</span></div>
                <div><span className="text-gray-500 block">Competition No</span><span className="font-medium font-mono">{selectedRegistration.competition_no || '—'}</span></div>
                <div><span className="text-gray-500 block">Registered On</span><span className="font-medium">{fmt(selectedRegistration.created_at)}</span></div>
                <div><span className="text-gray-500 block">Status</span><span className={statusBadge(selectedRegistration.status)}>{selectedRegistration.status}</span></div>
                <div><span className="text-gray-500 block">Payment Status</span><span className={statusBadge(selectedRegistration.payment_status)}>{selectedRegistration.payment_status}</span></div>
                <div><span className="text-gray-500 block">Amount</span><span className="font-semibold text-green-700">₹{selectedRegistration.amount}</span></div>
                <div><span className="text-gray-500 block">Payment Method</span><span className="font-medium capitalize">{selectedRegistration.payment_method || '—'}</span></div>
              </div>
              {selectedRegistration.registration_events?.length > 0 && (
                <div>
                  <p className="text-gray-500 text-sm mb-2">Events Registered</p>
                  <div className="space-y-1">
                    {selectedRegistration.registration_events.map((e, i) => (
                      <div key={i} className="flex justify-between text-sm bg-gray-50 rounded px-3 py-2">
                        <span>{e.event_name_snapshot}</span>
                        <span className="font-semibold text-green-700">₹{e.fee_snapshot}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div>
                <p className="text-gray-500 text-sm mb-2">Payment Proof</p>
                {selectedRegistration.payment_proof_url ? (
                  <button onClick={() => { setSelectedScreenshotUrl(selectedRegistration.payment_proof_url); setSelectedRegistration(null) }}
                    className="flex items-center gap-2 text-blue-600 hover:underline text-sm border border-blue-200 rounded px-3 py-2 w-full justify-center">
                    <ImageIcon size={16} /> View Payment Screenshot
                  </button>
                ) : (
                  <p className="text-gray-400 text-sm text-center py-2 bg-gray-50 rounded">No payment proof uploaded</p>
                )}
              </div>
              <div className="flex gap-2 pt-2 border-t flex-wrap">
                {(selectedRegistration.status === 'submitted' || selectedRegistration.status === 'under_review') && (
                  <button onClick={() => { approve(selectedRegistration.id); setSelectedRegistration(null) }} className="flex-1 comp-btn comp-btn-primary text-sm py-2">✅ Approve</button>
                )}
                {(selectedRegistration.status === 'submitted' || selectedRegistration.status === 'under_review' || selectedRegistration.status === 'approved') && (
                  <button onClick={() => { requestChanges(selectedRegistration.id); setSelectedRegistration(null) }} className="flex-1 comp-btn comp-btn-outline text-sm py-2 border-blue-400 text-blue-600">🔄 Request Changes</button>
                )}
                {(selectedRegistration.status === 'submitted' || selectedRegistration.status === 'under_review') && (
                  <button onClick={() => { reject(selectedRegistration.id); setSelectedRegistration(null) }} className="flex-1 comp-btn comp-btn-outline text-sm py-2 border-red-400 text-red-600">❌ Reject</button>
                )}
                {selectedRegistration.status === 'approved' && (
                  <button onClick={() => { revokeApproval(selectedRegistration.id); setSelectedRegistration(null) }} className="flex-1 comp-btn comp-btn-outline text-sm py-2 border-yellow-400 text-yellow-600">↩ Revoke</button>
                )}
                <button onClick={() => { deleteRegistration(selectedRegistration.id); setSelectedRegistration(null) }} className="comp-btn comp-btn-outline text-sm py-2 border-red-300 text-red-500 px-3">🗑</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Image Modal overlay */}
      {selectedScreenshotUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75 p-4" onClick={() => setSelectedScreenshotUrl(null)}>
          <div className="relative max-w-4xl max-h-full" onClick={e => e.stopPropagation()}>
            <button
              onClick={() => setSelectedScreenshotUrl(null)}
              className="absolute -top-10 right-0 text-white hover:text-gray-300"
            >
              <XCircle size={32} />
            </button>
            <img src={selectedScreenshotUrl} alt="Payment Proof" className="max-w-full max-h-[80vh] rounded shadow-lg object-contain bg-white" />
          </div>
        </div>
      )}
    </div>
  )
}
