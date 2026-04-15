'use client'
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import './shooters.css'

/* ─── Types ─── */
<<<<<<< Updated upstream
type ShooterStatus = 'pending' | 'approved' | 'rejected' | 'incomplete' | 'needs_changes'
=======
type ShooterStatus = 'pending' | 'approved' | 'rejected'
>>>>>>> Stashed changes

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

<<<<<<< Updated upstream
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
=======
/* ─── Sample Data ─── */
const SAMPLE_SHOOTERS: Shooter[] = [
  { id: 1, competitorNo: 2001, name: 'Avani Lekhara', state: 'Rajasthan', eventType: 'RIFLE', category: 'SH1', status: 'approved', pciId: 'PCI/PSAI/2025/0001', registeredAt: '2025-12-01', contact: '+91 98765 43210', email: 'avani.lekhara@email.com', dob: '2001-11-08', gender: 'Female', guardianName: 'Praveen Lekhara', classificationDate: '2024-06-15', equipmentAdaptations: 'Wheelchair-mounted shooting stand, custom grip', documents: [{ name: 'Aadhaar Card', uploaded: true }, { name: 'Medical Certificate', uploaded: true }, { name: 'Classification Card', uploaded: true }, { name: 'Passport Photo', uploaded: true }] },
  { id: 2, competitorNo: 2002, name: 'Manish Narwal', state: 'Haryana', eventType: 'PISTOL', category: 'SH1', status: 'approved', pciId: 'PCI/PSAI/2025/0002', registeredAt: '2025-12-02', contact: '+91 99876 54321', email: 'manish.narwal@email.com', dob: '2002-03-15', gender: 'Male', guardianName: 'Dilbagh Narwal', classificationDate: '2024-07-20', equipmentAdaptations: 'Custom pistol grip, wrist support brace', documents: [{ name: 'Aadhaar Card', uploaded: true }, { name: 'Medical Certificate', uploaded: true }, { name: 'Classification Card', uploaded: true }, { name: 'Passport Photo', uploaded: true }] },
  { id: 3, competitorNo: 2003, name: 'Singhraj Adhana', state: 'Haryana', eventType: 'PISTOL', category: 'SH1', status: 'approved', pciId: 'PCI/PSAI/2025/0003', registeredAt: '2025-12-03', contact: '+91 97654 32109', email: 'singhraj.adhana@email.com', dob: '1989-07-26', gender: 'Male', guardianName: 'Ranbir Adhana', classificationDate: '2024-05-10', equipmentAdaptations: 'Adapted trigger mechanism', documents: [{ name: 'Aadhaar Card', uploaded: true }, { name: 'Medical Certificate', uploaded: true }, { name: 'Classification Card', uploaded: true }, { name: 'Passport Photo', uploaded: true }] },
  { id: 4, competitorNo: 2004, name: 'Deepika Sharma', state: 'Madhya Pradesh', eventType: 'RIFLE', category: 'SH2', status: 'pending', pciId: null, registeredAt: '2025-12-05', contact: '+91 96543 21098', email: 'deepika.sharma@email.com', dob: '1999-04-22', gender: 'Female', guardianName: 'Rajendra Sharma', classificationDate: '2025-01-12', equipmentAdaptations: 'Standing shooting frame, elbow rest', documents: [{ name: 'Aadhaar Card', uploaded: true }, { name: 'Medical Certificate', uploaded: true }, { name: 'Classification Card', uploaded: false }, { name: 'Passport Photo', uploaded: true }] },
  { id: 5, competitorNo: 2005, name: 'Siddharth Babu', state: 'Tamil Nadu', eventType: 'RIFLE', category: 'SH-VI', status: 'pending', pciId: null, registeredAt: '2025-12-06', contact: '+91 95432 10987', email: 'siddharth.babu@email.com', dob: '1997-09-14', gender: 'Male', guardianName: 'P. Babu', classificationDate: '2025-02-08', equipmentAdaptations: 'Audio-guided sighting system, tactile markings', documents: [{ name: 'Aadhaar Card', uploaded: true }, { name: 'Medical Certificate', uploaded: true }, { name: 'Classification Card', uploaded: true }, { name: 'Passport Photo', uploaded: true }] },
  { id: 6, competitorNo: 2006, name: 'Priya Patel', state: 'Gujarat', eventType: 'PISTOL', category: 'SH2', status: 'approved', pciId: 'PCI/PSAI/2025/0006', registeredAt: '2025-12-07', contact: '+91 94321 09876', email: 'priya.patel@email.com', dob: '2000-01-30', gender: 'Female', guardianName: 'Vikas Patel', classificationDate: '2024-09-05', equipmentAdaptations: 'Custom trigger weight adjustment', documents: [{ name: 'Aadhaar Card', uploaded: true }, { name: 'Medical Certificate', uploaded: true }, { name: 'Classification Card', uploaded: true }, { name: 'Passport Photo', uploaded: true }] },
  { id: 7, competitorNo: 2007, name: 'Rahul Khanna', state: 'Punjab', eventType: 'SHOTGUN', category: 'SH1', status: 'rejected', pciId: null, registeredAt: '2025-12-08', contact: '+91 93210 98765', email: 'rahul.khanna@email.com', dob: '1995-06-18', gender: 'Male', guardianName: 'Suresh Khanna', classificationDate: '2025-01-25', equipmentAdaptations: 'Seated shooting platform', documents: [{ name: 'Aadhaar Card', uploaded: true }, { name: 'Medical Certificate', uploaded: false }, { name: 'Classification Card', uploaded: false }, { name: 'Passport Photo', uploaded: true }] },
  { id: 8, competitorNo: 2008, name: 'Ananya Singh', state: 'Uttar Pradesh', eventType: 'RIFLE', category: 'SH1', status: 'pending', pciId: null, registeredAt: '2025-12-09', contact: '+91 92109 87654', email: 'ananya.singh@email.com', dob: '2003-12-05', gender: 'Female', guardianName: 'Vikram Singh', classificationDate: '2025-03-01', equipmentAdaptations: 'Wheelchair rest, scope magnifier', documents: [{ name: 'Aadhaar Card', uploaded: true }, { name: 'Medical Certificate', uploaded: true }, { name: 'Classification Card', uploaded: true }, { name: 'Passport Photo', uploaded: false }] },
  { id: 9, competitorNo: 2009, name: 'Vikram Deshmukh', state: 'Maharashtra', eventType: 'PISTOL', category: 'SH2', status: 'approved', pciId: 'PCI/PSAI/2025/0009', registeredAt: '2025-12-10', contact: '+91 91098 76543', email: 'vikram.deshmukh@email.com', dob: '1998-08-11', gender: 'Male', guardianName: 'Ashok Deshmukh', classificationDate: '2024-11-20', equipmentAdaptations: 'Modified pistol rest, trigger guard extension', documents: [{ name: 'Aadhaar Card', uploaded: true }, { name: 'Medical Certificate', uploaded: true }, { name: 'Classification Card', uploaded: true }, { name: 'Passport Photo', uploaded: true }] },
  { id: 10, competitorNo: 2010, name: 'Kavya Reddy', state: 'Telangana', eventType: 'RIFLE', category: 'SH-VI', status: 'pending', pciId: null, registeredAt: '2025-12-12', contact: '+91 90987 65432', email: 'kavya.reddy@email.com', dob: '2001-05-27', gender: 'Female', guardianName: 'Suresh Reddy', classificationDate: '2025-02-15', equipmentAdaptations: 'Braille-marked equipment, tactile rifle stock', documents: [{ name: 'Aadhaar Card', uploaded: true }, { name: 'Medical Certificate', uploaded: true }, { name: 'Classification Card', uploaded: false }, { name: 'Passport Photo', uploaded: true }] },
  { id: 11, competitorNo: 2011, name: 'Arjun Mehta', state: 'Delhi', eventType: 'SHOTGUN', category: 'SH1', status: 'approved', pciId: 'PCI/PSAI/2025/0011', registeredAt: '2025-12-14', contact: '+91 89876 54321', email: 'arjun.mehta@email.com', dob: '1996-10-03', gender: 'Male', guardianName: 'Rakesh Mehta', classificationDate: '2024-08-30', equipmentAdaptations: 'Custom recoil pad, adapted stock', documents: [{ name: 'Aadhaar Card', uploaded: true }, { name: 'Medical Certificate', uploaded: true }, { name: 'Classification Card', uploaded: true }, { name: 'Passport Photo', uploaded: true }] },
  { id: 12, competitorNo: 2012, name: 'Nisha Kumari', state: 'Bihar', eventType: 'PISTOL', category: 'SH2', status: 'pending', pciId: null, registeredAt: '2025-12-16', contact: '+91 88765 43210', email: 'nisha.kumari@email.com', dob: '2002-07-19', gender: 'Female', guardianName: 'Ramesh Kumar', classificationDate: '2025-03-10', equipmentAdaptations: 'Wrist brace, lightweight pistol frame', documents: [{ name: 'Aadhaar Card', uploaded: true }, { name: 'Medical Certificate', uploaded: true }, { name: 'Classification Card', uploaded: true }, { name: 'Passport Photo', uploaded: true }] },
  { id: 13, competitorNo: 2013, name: 'Rohan Verma', state: 'Uttarakhand', eventType: 'RIFLE', category: 'SH1', status: 'approved', pciId: 'PCI/PSAI/2025/0013', registeredAt: '2025-12-18', contact: '+91 87654 32109', email: 'rohan.verma@email.com', dob: '1994-02-14', gender: 'Male', guardianName: 'Ajay Verma', classificationDate: '2024-04-22', equipmentAdaptations: 'None required', documents: [{ name: 'Aadhaar Card', uploaded: true }, { name: 'Medical Certificate', uploaded: true }, { name: 'Classification Card', uploaded: true }, { name: 'Passport Photo', uploaded: true }] },
  { id: 14, competitorNo: 2014, name: 'Pooja Nair', state: 'Kerala', eventType: 'PISTOL', category: 'SH1', status: 'rejected', pciId: null, registeredAt: '2025-12-20', contact: '+91 86543 21098', email: 'pooja.nair@email.com', dob: '2000-11-08', gender: 'Female', guardianName: 'Gopal Nair', classificationDate: '2025-01-05', equipmentAdaptations: 'Modified trigger pull weight', documents: [{ name: 'Aadhaar Card', uploaded: true }, { name: 'Medical Certificate', uploaded: false }, { name: 'Classification Card', uploaded: false }, { name: 'Passport Photo', uploaded: false }] },
  { id: 15, competitorNo: 2015, name: 'Amit Joshi', state: 'Karnataka', eventType: 'SHOTGUN', category: 'SH2', status: 'pending', pciId: null, registeredAt: '2025-12-22', contact: '+91 85432 10987', email: 'amit.joshi@email.com', dob: '1997-03-25', gender: 'Male', guardianName: 'Sanjay Joshi', classificationDate: '2025-03-18', equipmentAdaptations: 'Adapted shotgun stock, recoil dampener', documents: [{ name: 'Aadhaar Card', uploaded: true }, { name: 'Medical Certificate', uploaded: true }, { name: 'Classification Card', uploaded: true }, { name: 'Passport Photo', uploaded: true }] },
]

const STATES = Array.from(new Set(SAMPLE_SHOOTERS.map(s => s.state))).sort()
const EVENT_TYPES = ['RIFLE', 'PISTOL', 'SHOTGUN']
const CATEGORIES = Array.from(new Set(SAMPLE_SHOOTERS.map(s => s.category))).sort()
>>>>>>> Stashed changes
const PAGE_SIZE = 10

/* ─── Component ─── */
export default function ShooterManagementPage() {
<<<<<<< Updated upstream
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
=======
  const [shooters, setShooters] = useState<Shooter[]>(SAMPLE_SHOOTERS)
  const [search, setSearch] = useState('')
>>>>>>> Stashed changes
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [stateFilter, setStateFilter] = useState<string>('all')
  const [eventTypeFilter, setEventTypeFilter] = useState<string>('all')
  const [categoryFilter, setCategoryFilter] = useState<string>('all')
  const [currentPage, setCurrentPage] = useState(1)
<<<<<<< Updated upstream

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
=======
>>>>>>> Stashed changes
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set())
  const [slideOverShooter, setSlideOverShooter] = useState<Shooter | null>(null)
  const [slideOverTab, setSlideOverTab] = useState<'profile' | 'documents' | 'classification' | 'actions'>('profile')
  const [assignModalShooter, setAssignModalShooter] = useState<Shooter | null>(null)
  const [assignIdValue, setAssignIdValue] = useState('')
  const [toasts, setToasts] = useState<Toast[]>([])
  const [loading, setLoading] = useState<Record<string, boolean>>({})
  const [deleteConfirm, setDeleteConfirm] = useState<Shooter | null>(null)
<<<<<<< Updated upstream
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

=======
  const toastIdRef = useRef(0)

>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const paginated = shooters // The API already paginates

  // Since we use API stats, we could remove the useMemo stats and just use what API returns, but let's just make sure.
  const apiStats = stats
=======
  /* ─── Filtering ─── */
  const filtered = useMemo(() => {
    return shooters.filter(s => {
      const q = search.toLowerCase()
      const matchesSearch = !q ||
        s.name.toLowerCase().includes(q) ||
        s.pciId?.toLowerCase().includes(q) ||
        s.state.toLowerCase().includes(q) ||
        String(s.competitorNo).includes(q)
      const matchesStatus = statusFilter === 'all' || s.status === statusFilter
      const matchesState = stateFilter === 'all' || s.state === stateFilter
      const matchesEvent = eventTypeFilter === 'all' || s.eventType === eventTypeFilter
      const matchesCat = categoryFilter === 'all' || s.category === categoryFilter
      return matchesSearch && matchesStatus && matchesState && matchesEvent && matchesCat
    })
  }, [shooters, search, statusFilter, stateFilter, eventTypeFilter, categoryFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  useEffect(() => { setCurrentPage(1) }, [search, statusFilter, stateFilter, eventTypeFilter, categoryFilter])

  /* ─── Stats ─── */
  const stats = useMemo(() => ({
    total: shooters.length,
    pending: shooters.filter(s => s.status === 'pending').length,
    approved: shooters.filter(s => s.status === 'approved').length,
    rejected: shooters.filter(s => s.status === 'rejected').length,
  }), [shooters])
>>>>>>> Stashed changes

  /* ─── Actions ─── */
  const handleApprove = async (shooter: Shooter) => {
    await simulateAsync(`approve-${shooter.id}`)
<<<<<<< Updated upstream
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
=======
    setShooters(prev => prev.map(s => s.id === shooter.id ? { ...s, status: 'approved' as const } : s))
    if (slideOverShooter?.id === shooter.id) setSlideOverShooter(prev => prev ? { ...prev, status: 'approved' } : null)
    addToast('success', `${shooter.name} has been approved`)
>>>>>>> Stashed changes
  }

  const handleReject = async (shooter: Shooter) => {
    await simulateAsync(`reject-${shooter.id}`)
<<<<<<< Updated upstream
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
=======
    setShooters(prev => prev.map(s => s.id === shooter.id ? { ...s, status: 'rejected' as const } : s))
    if (slideOverShooter?.id === shooter.id) setSlideOverShooter(prev => prev ? { ...prev, status: 'rejected' } : null)
    addToast('error', `${shooter.name} has been rejected`)
>>>>>>> Stashed changes
  }

  const handleDelete = async (shooter: Shooter) => {
    await simulateAsync(`delete-${shooter.id}`)
<<<<<<< Updated upstream
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
=======
    setShooters(prev => prev.filter(s => s.id !== shooter.id))
    setSelectedIds(prev => { const next = new Set(prev); next.delete(shooter.id); return next })
    if (slideOverShooter?.id === shooter.id) setSlideOverShooter(null)
    setDeleteConfirm(null)
    addToast('info', `${shooter.name} has been removed`)
>>>>>>> Stashed changes
  }

  const handleAssignId = async () => {
    if (!assignModalShooter || !assignIdValue.trim()) return
    const regex = /^PCI\/PSAI\/\d{4}\/\d{4}$/
    if (!regex.test(assignIdValue.trim())) {
      addToast('error', 'Invalid PCI ID format. Use PCI/PSAI/YYYY/XXXX')
      return
    }
    await simulateAsync('assign-id')
<<<<<<< Updated upstream
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
=======
    setShooters(prev => prev.map(s => s.id === assignModalShooter.id ? { ...s, pciId: assignIdValue.trim() } : s))
    if (slideOverShooter?.id === assignModalShooter.id) setSlideOverShooter(prev => prev ? { ...prev, pciId: assignIdValue.trim() } : null)
    addToast('success', `PCI ID ${assignIdValue.trim()} assigned to ${assignModalShooter.name}`)
    setAssignModalShooter(null)
    setAssignIdValue('')
  }

  const openAssignModal = (shooter: Shooter) => {
    const maxNum = shooters
      .map(s => s.pciId ? parseInt(s.pciId.split('/').pop() || '0') : 0)
      .reduce((a, b) => Math.max(a, b), 0)
    setAssignIdValue(`PCI/PSAI/2025/${String(maxNum + 1).padStart(4, '0')}`)
    setAssignModalShooter(shooter)
>>>>>>> Stashed changes
  }

  /* ─── Bulk Actions ─── */
  const handleBulkApprove = async () => {
    await simulateAsync('bulk-approve')
<<<<<<< Updated upstream
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
=======
    setShooters(prev => prev.map(s => selectedIds.has(s.id) && s.status === 'pending' ? { ...s, status: 'approved' as const } : s))
    addToast('success', `${selectedIds.size} shooters approved`)
    setSelectedIds(new Set())
>>>>>>> Stashed changes
  }

  const handleBulkReject = async () => {
    await simulateAsync('bulk-reject')
<<<<<<< Updated upstream
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
=======
    setShooters(prev => prev.map(s => selectedIds.has(s.id) && s.status === 'pending' ? { ...s, status: 'rejected' as const } : s))
    addToast('error', `${selectedIds.size} shooters rejected`)
    setSelectedIds(new Set())
>>>>>>> Stashed changes
  }

  const handleBulkDelete = async () => {
    await simulateAsync('bulk-delete')
<<<<<<< Updated upstream
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
=======
    setShooters(prev => prev.filter(s => !selectedIds.has(s.id)))
    addToast('info', `${selectedIds.size} shooters removed`)
    setSelectedIds(new Set())
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
  const exportCSV = () => {
    const headers = ['#', 'Competitor No', 'Name', 'State', 'Event Type', 'Category', 'Status', 'PCI ID', 'Registered', 'Contact', 'Email', 'DOB']
    const rows = filtered.map((s, i) => [
      i + 1, s.competitorNo, s.name, s.state, s.eventType, s.category, s.status,
      s.pciId || 'N/A', s.registeredAt, s.contact, s.email, s.dob
    ])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `shooters_export_${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
    addToast('success', `Exported ${filtered.length} records to CSV`)
>>>>>>> Stashed changes
  }

  /* ─── Helpers ─── */
  const formatDate = (d: string) => new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })
  const isLoading = (key: string) => loading[key] || false

  const statusBadge = (status: ShooterStatus) => {
<<<<<<< Updated upstream
    const map: Record<string, { cls: string; label: string }> = {
      incomplete: { cls: 'sm-badge-pending', label: '📝 Incomplete' },
      pending: { cls: 'sm-badge-pending', label: '⏳ Pending' },
      approved: { cls: 'sm-badge-approved', label: '✅ Approved' },
      rejected: { cls: 'sm-badge-rejected', label: '❌ Rejected' },
      needs_changes: { cls: 'sm-badge-changes', label: '🔄 Needs Changes' },
    }
    const entry = map[status] || { cls: 'sm-badge-pending', label: status }
    return <span className={`sm-badge ${entry.cls}`}>{entry.label}</span>
=======
    const map = {
      pending: { cls: 'sm-badge-pending', label: '⏳ Pending' },
      approved: { cls: 'sm-badge-approved', label: '✅ Approved' },
      rejected: { cls: 'sm-badge-rejected', label: '❌ Rejected' },
    }
    return <span className={`sm-badge ${map[status].cls}`}>{map[status].label}</span>
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
          <div className="sm-stat">
            <span className="sm-stat-label">Needs Changes</span>
            <span className="sm-stat-value">{stats.needs_changes}</span>
          </div>
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
            <option value="needs_changes">Needs Changes</option>
=======
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
                          <button className="sm-action-btn sm-action-proof" title="View Proof / Documents" onClick={() => handleViewProof(shooter)}>📎</button>
                          {(shooter.status === 'pending' || shooter.status === 'needs_changes') && (
=======
                          {shooter.status === 'pending' && (
>>>>>>> Stashed changes
                            <button
                              className="sm-action-btn sm-action-approve"
                              title="Approve"
                              disabled={isLoading(`approve-${shooter.id}`)}
                              onClick={() => handleApprove(shooter)}
                            >
                              {isLoading(`approve-${shooter.id}`) ? <span className="sm-spinner" /> : '✅'}
                            </button>
                          )}
<<<<<<< Updated upstream
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
=======
                          {(shooter.status === 'pending' || (shooter.status === 'approved' && !shooter.pciId)) && (
                            <button className="sm-action-btn sm-action-assign" title="Assign PCI ID" onClick={() => openAssignModal(shooter)}>🆔</button>
                          )}
                          {shooter.status === 'pending' && (
                            <button
                              className="sm-action-btn sm-action-reject"
                              title="Reject"
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
              Showing {total === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, total)} of {total}
=======
              Showing {filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filtered.length)} of {filtered.length}
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
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
=======
                  {slideOverShooter.documents.map((doc, i) => (
                    <div key={i} className={`sm-doc-item ${doc.uploaded ? '' : 'sm-doc-missing'}`}>
                      <div className="sm-doc-info">
                        <span className="sm-doc-icon">{doc.uploaded ? '📄' : '⚠️'}</span>
                        <span className="sm-doc-name">{doc.name}</span>
                      </div>
                      <div className="sm-doc-status">
                        {doc.uploaded ? (
                          <>
                            <span className="sm-doc-uploaded">Uploaded</span>
                            <button className="sm-doc-preview" title="Preview">👁</button>
                          </>
                        ) : (
                          <span className="sm-doc-pending">Missing</span>
                        )}
                      </div>
                    </div>
                  ))}
>>>>>>> Stashed changes
                </div>
              )}

              {slideOverTab === 'classification' && (
                <div className="sm-class-section">
<<<<<<< Updated upstream
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
=======
                  <div className="sm-class-grid">
                    <div className="sm-profile-item"><span className="sm-profile-label">Category</span><span className="sm-profile-value">{slideOverShooter.category}</span></div>
                    <div className="sm-profile-item"><span className="sm-profile-label">Classification Date</span><span className="sm-profile-value">{formatDate(slideOverShooter.classificationDate)}</span></div>
                    <div className="sm-profile-item sm-profile-full"><span className="sm-profile-label">Equipment Adaptations</span><span className="sm-profile-value">{slideOverShooter.equipmentAdaptations}</span></div>
                  </div>
>>>>>>> Stashed changes
                </div>
              )}

              {slideOverTab === 'actions' && (
                <div className="sm-actions-tab">
<<<<<<< Updated upstream

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
=======
                  {slideOverShooter.status === 'pending' && (
                    <div className="sm-actions-group">
                      <h3 className="sm-actions-title">Review Application</h3>
                      <div className="sm-actions-btns">
                        <button
                          className="sm-panel-btn sm-panel-approve"
                          onClick={() => handleApprove(slideOverShooter)}
                          disabled={isLoading(`approve-${slideOverShooter.id}`)}
                        >
                          {isLoading(`approve-${slideOverShooter.id}`) ? <span className="sm-spinner" /> : '✅'} Approve Shooter
                        </button>
                        <button
                          className="sm-panel-btn sm-panel-reject"
                          onClick={() => handleReject(slideOverShooter)}
                          disabled={isLoading(`reject-${slideOverShooter.id}`)}
                        >
                          {isLoading(`reject-${slideOverShooter.id}`) ? <span className="sm-spinner" /> : '❌'} Reject Shooter
>>>>>>> Stashed changes
                        </button>
                      </div>
                    </div>
                  )}
<<<<<<< Updated upstream

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
=======
                  <div className="sm-actions-group">
                    <h3 className="sm-actions-title">Assign PCI ID</h3>
                    <p className="sm-actions-desc">Current: {slideOverShooter.pciId || 'Not assigned'}</p>
                    <button
                      className="sm-panel-btn sm-panel-assign"
                      onClick={() => openAssignModal(slideOverShooter)}
                    >🆔 Assign PCI ID</button>
>>>>>>> Stashed changes
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

<<<<<<< Updated upstream
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

=======
>>>>>>> Stashed changes
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
