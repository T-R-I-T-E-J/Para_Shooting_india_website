'use client'

<<<<<<< Updated upstream
import React, { useState, useMemo, useRef } from 'react'
import * as XLSX from 'xlsx'

interface EventResult {
  name: string
  score: string | null
  position: string | null
}

interface AthleteRow {
  certNo: string
  compNo: string
=======
import React, { useState, useRef, useEffect } from 'react'
import {
  Upload, CheckCircle, AlertTriangle, ChevronDown, ChevronRight,
  Search, Play, RefreshCcw, Download, Activity, FileText, Check, Database, XCircle
} from 'lucide-react'
import './results-import.css'

/* ─── TYPES ─── */
type EventResult = {
  name: string
  score: string
  position: string
  isDecimal: boolean
}

type ParsedAthlete = {
  id: string
  certNo: string
  competitorNo: string
>>>>>>> Stashed changes
  name: string
  state: string
  events: EventResult[]
}

<<<<<<< Updated upstream
export default function AdminResultsImportPage() {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  
  // Step 1 State
  const [champName, setChampName] = useState('6th National Para Shooting Championship 2025')
  const [champVenue, setChampVenue] = useState('Dr. Karni Singh Shooting Range, Tuglakabad, Delhi')
  const [champDates, setChampDates] = useState('5th to 10th December 2025')
  const [file, setFile] = useState<File | null>(null)
  const [isParsing, setIsParsing] = useState(false)

  // Step 2 State
  const [data, setData] = useState<AthleteRow[]>([])
  const [searchQ, setSearchQ] = useState('')
  const [stateFilter, setStateFilter] = useState('')
  const [isPublishing, setIsPublishing] = useState(false)

  // Toasts
  const [toast, setToast] = useState<{ msg: string, type: 'success' | 'error' } | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const showToast = (msg: string, type: 'success' | 'error') => {
    setToast({ msg, type })
    if (timerRef.current) clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setToast(null), 3500)
  }

  // Handle Drag & Drop
=======
type ParseSummary = {
  totalRows: number
  uniqueAthletes: number
  totalEvents: number
  warnings: string[]
}

const SAMPLE_TSV = `PCI/PSAI/6NPSC/2025/0042	2005	RUDRANSH KHANDELWAL	RAJASTHAN	P1 Final	P1 Qual	P1J	P4 Final	P4 Qual	P4J	P5 Final	P5J	240.5	575	575	235.2	560	560	370	370	1	7	1	1	2	1	1	1
PCI/PSAI/6NPSC/2025/0014	2018	MONA AGARWAL	RAJASTHAN	R2 Final	R2 Qual	R3 Final	R3 Qual	R6 Final	R6 Qual	R8 Final	R8 Qual	250.7	620.5	254.1	632.4	248.5	620.1	450	1150	1	3	1	1	3	4	1	2
PCI/PSAI/6NPSC/2025/0088	2012	HIMANSHU SINGH	HARYANA	P1 Qual	x----x----x----x	x----x----x----x	x----x----x----x	x----x----x----x	x----x----x----x	x----x----x----x	x----x----x----x	558	x--x--x	x--x--x	x--x--x	x--x--x	x--x--x	x--x--x	x--x--x	12	x--x--x	x--x--x	x--x--x	x--x--x	x--x--x	x--x--x	x--x--x
PCI/PSAI/6NPSC/2025/0022	2101	HARSHIT	DELHI	P3 Qual	x----x----x----x	x----x----x----x	x----x----x----x	x----x----x----x	x----x----x----x	x----x----x----x	x----x----x----x	562	x--x--x	x--x--x	x--x--x	x--x--x	x--x--x	x--x--x	x--x--x	4	x--x--x	x--x--x	x--x--x	x--x--x	x--x--x	x--x--x	x--x--x
PCI/PSAI/6NPSC/2025/0055	2210	ANGREJ	PUNJAB	R1 Qual	R1J	x----x----x----x	x----x----x----x	x----x----x----x	x----x----x----x	x----x----x----x	x----x----x----x	601	601	x--x--x	x--x--x	x--x--x	x--x--x	x--x--x	x--x--x	8	2	x--x--x	x--x--x	x--x--x	x--x--x	x--x--x	x--x--x`

export default function ResultsImportPage() {
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)

  // Step 1 State
  const [importMode, setImportMode] = useState<'paste' | 'upload'>('paste')
  const [rawText, setRawText] = useState('')
  const [competition, setCompetition] = useState('6th NPSC 2025')
  
  // Step 2 State
  const [parsedData, setParsedData] = useState<ParsedAthlete[]>([])
  const [summary, setSummary] = useState<ParseSummary>({ totalRows: 0, uniqueAthletes: 0, totalEvents: 0, warnings: [] })
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set())
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set())
  const [showWarnings, setShowWarnings] = useState(false)
  
  // Step 3 State
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<{msg: string, type: 'success' | 'error' | 'warning' | 'info'}[]>([])
  
  // Ref for auto-scrolling logs
  const logRef = useRef<HTMLDivElement>(null)

  // --- LOGIC: Parsing --- //
  const parseResults = () => {
    if (!rawText.trim()) return

    const lines = rawText.trim().split('\n')
    const athletesMap = new Map<string, ParsedAthlete>()
    let totalEvents = 0
    let warnings: string[] = []

    lines.forEach((line, index) => {
      if (!line.trim()) return
      const cols = line.split('\t')

      if (cols.length < 28) {
        warnings.push(`Row ${index + 1}: Found ${cols.length} columns, expected minimum 28. Row may be malformed.`)
        return
      }

      const certNo = cols[0].trim()
      const competitorNo = cols[1].trim()
      const name = cols[2].trim().toUpperCase()
      const state = cols[3].trim().toUpperCase()

      // Unique identifier for athlete
      const uid = `uid-${competitorNo}-${name}`

      let athlete = athletesMap.get(uid)
      if (!athlete) {
        athlete = { id: uid, certNo, competitorNo, name, state, events: [] }
        athletesMap.set(uid, athlete)
      } else {
        if (athlete.certNo !== certNo) {
          warnings.push(`Athlete ${name} (Comp No: ${competitorNo}) has conflicting Cert Nos on different rows.`)
        }
      }

      // Parse 8 events max per row
      for (let i = 0; i < 8; i++) {
        const evName = cols[4 + i]?.trim()
        const evScore = cols[12 + i]?.trim()
        const evPos = cols[20 + i]?.trim()

        if (evName && evName !== 'x----x----x----x' && evName !== '' && evScore !== 'x--x--x') {
          // Check for duplication
          const exists = athlete.events.some(e => e.name === evName)
          if (exists) {
            warnings.push(`Row ${index + 1}: Athlete ${name} has duplicate event "${evName}". Ignored second occurrence.`)
            continue
          }

          const isDecimal = !isNaN(parseFloat(evScore)) && evScore.includes('.')

          athlete.events.push({
            name: evName,
            score: evScore,
            position: evPos,
            isDecimal,
          })
          totalEvents++
        }
      }
    })

    const parsedArray = Array.from(athletesMap.values())
    setParsedData(parsedArray)
    setSelectedRows(new Set(parsedArray.map(a => a.id)))
    setSummary({
      totalRows: lines.length,
      uniqueAthletes: parsedArray.length,
      totalEvents,
      warnings
    })

    setStep(2)
  }

  // --- LOGIC: Table Interactions --- //
  const toggleRow = (id: string) => {
    const next = new Set(expandedRows)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setExpandedRows(next)
  }

  const toggleSelect = (id: string) => {
    const next = new Set(selectedRows)
    if (next.has(id)) next.delete(id)
    else next.add(id)
    setSelectedRows(next)
  }

  const toggleSelectAll = () => {
    if (selectedRows.size === parsedData.length) setSelectedRows(new Set())
    else setSelectedRows(new Set(parsedData.map(a => a.id)))
  }

  // --- LOGIC: Importing --- //
  const startImport = () => {
    if (selectedRows.size === 0) return
    setStep(3)
    setProgress(0)
    setLogs([{ msg: 'Starting import sequence...', type: 'info' }])

    const toImport = parsedData.filter(a => selectedRows.has(a.id))
    
    let currentIndex = 0

    const importNext = () => {
      if (currentIndex >= toImport.length) {
        setLogs(prev => [...prev, { msg: '✅ All selections processed successfully.', type: 'success' }])
        setTimeout(() => setStep(4), 1000)
        return
      }

      const athlete = toImport[currentIndex]
      
      // Simulate import validation and persistence
      setLogs(prev => {
        const newLogs = [...prev]
        if (athlete.events.length === 0) {
          newLogs.push({ msg: `⚠️  ${athlete.name} — no events found, skipped`, type: 'warning' })
        } else {
          newLogs.push({ msg: `✅ ${athlete.name} (${athlete.state}) — ${athlete.events.length} events imported to ${competition}`, type: 'success' })
        }
        return newLogs
      })

      currentIndex++
      setProgress(Math.round((currentIndex / toImport.length) * 100))

      // Simulate network delay
      setTimeout(importNext, 100) 
    }

    importNext()
  }

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight
    }
  }, [logs])

  // --- HELPERS --- //
  const renderMedalBadge = (position: string) => {
    const pos = parseInt(position, 10)
    if (pos === 1) return <span className="rank-gold">🥇 1st</span>
    if (pos === 2) return <span className="rank-silver">🥈 2nd</span>
    if (pos === 3) return <span className="rank-bronze">🥉 3rd</span>
    if (!isNaN(pos)) return <span>{pos}th</span>
    return <span>{position}</span> // DNF, DNS, etc
  }

>>>>>>> Stashed changes
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
<<<<<<< Updated upstream
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setFile(e.dataTransfer.files[0])
    }
  }

  // Parsing Logic
  const doParseFile = async () => {
    if (!file) return
    setIsParsing(true)
    
    try {
      const arrayBuffer = await file.arrayBuffer()
      const workbook = XLSX.read(arrayBuffer, { type: 'array' })
      const worksheet = workbook.Sheets[workbook.SheetNames[0]]
      const rows = XLSX.utils.sheet_to_json(worksheet, {
        header: 1,
        defval: ''
      }) as any[][]

      const EMPTY_VALS = ['x----x----x----x', 'x--x--x', 'x-x-x', '']
      const isEmpty = (v: unknown) => !v || EMPTY_VALS.some(e => String(v).trim().toLowerCase() === e.toLowerCase())

      const parsedData: AthleteRow[] = []

      // Skip header row
      for (let i = 1; i < rows.length; i++) {
        const row = rows[i]
        const certNoStr = String(row[0]).trim()
        const nameStr = String(row[2]).trim()

        if (!certNoStr || !nameStr || certNoStr.toLowerCase() === 'undefined' || nameStr.toLowerCase() === 'undefined') {
          continue
        }

        const events: EventResult[] = []
        for (let j = 0; j < 8; j++) {
          if (!isEmpty(row[4 + j])) {
            events.push({
              name: String(row[4 + j]).trim(),
              score: isEmpty(row[12 + j]) ? null : String(row[12 + j]).trim(),
              position: isEmpty(row[20 + j]) ? null : String(row[20 + j]).trim()
            })
          }
        }

        parsedData.push({
          certNo: certNoStr,
          compNo: String(row[1] || '').trim(),
          name: nameStr,
          state: String(row[3] || '').trim(),
          events
        })
      }

      setData(parsedData)
      setStep(2)
      showToast(`✓ Parsed ${parsedData.length} athletes successfully`, 'success')
      
    } catch (err: any) {
      console.error(err)
      showToast('Error parsing file: ' + err.message, 'error')
    } finally {
      setIsParsing(false)
    }
  }

  // Derived State (Step 2)
  const uniqueStates = useMemo(() => Array.from(new Set(data.map(d => d.state))).sort(), [data])
  
  const filteredData = useMemo(() => {
    let d = data
    if (searchQ) {
      const q = searchQ.toLowerCase()
      d = d.filter(a => a.name.toLowerCase().includes(q) || a.certNo.toLowerCase().includes(q) || a.compNo.toLowerCase().includes(q))
    }
    if (stateFilter) {
      d = d.filter(a => a.state === stateFilter)
    }
    return d
  }, [data, searchQ, stateFilter])

  const stats = useMemo(() => {
    let events = 0
    let golds = 0
    data.forEach(a => {
      events += a.events.length
      a.events.forEach(e => {
        if (e.position && (e.position.toLowerCase() === 'gold' || e.position === '1')) golds++
      })
    })
    return { athletes: data.length, events, golds, states: uniqueStates.length }
  }, [data, uniqueStates])

  // Publishing Logic
  const doPublish = async () => {
    setIsPublishing(true)

    try {
      // MOCK API REQUEST
      await new Promise(res => setTimeout(res, 1500))
      
      /* 
      await fetch('/api/v1/results-import/publish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          championship: { name: champName, venue: champVenue, dates: champDates },
          athletes: data
        })
      })
      */
      
      setStep(3)
      showToast(`${data.length} certificates published!`, 'success')
      
    } catch (err: any) {
      showToast('Failed to publish: ' + err.message, 'error')
    } finally {
      setIsPublishing(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#F4F6FB] pb-32">
      
      {/* TOAST */}
      {toast && (
        <div 
          className={`fixed top-[22px] right-[22px] z-[999] bg-white rounded-[10px] shadow-lg border-l-4 p-4 animate-in slide-in-from-right-4 duration-300
            ${toast.type === 'success' ? 'border-[#046A38]' : 'border-[#DC2626]'}`}
        >
          <div className="text-[12px] font-semibold font-['DM_Sans',sans-serif] text-slate-800">
            {toast.msg}
=======
    const file = e.dataTransfer.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (event) => {
        setRawText(event.target?.result as string || '')
        setImportMode('paste') // switch to paste tab to show text
      }
      reader.readAsText(file)
    }
  }


  /* ─── RENDER ─── */
  return (
    <div className="import-container bg-neutral-900 min-h-screen p-6">
      <div className="flex items-center gap-3 mb-6">
        <Activity className="w-8 h-8 text-[var(--accent)]" />
        <h1 className="text-3xl font-bold font-heading">Championship Results Import</h1>
      </div>

      {/* ─── STEP 1: UPLOAD/PASTE ─── */}
      {step === 1 && (
        <div className="import-card fade-in">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold flex items-center justify-center gap-2">
              <Database size={24} className="text-[var(--primary)]" />
              Import Result Data (TSV Format)
            </h2>
            <p className="text-neutral-400 mt-2">Paste Excel/Sheets data or upload a tab-separated file.</p>
          </div>

          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1">
              <div className="tab-container">
                <button 
                  className={`tab-btn ${importMode === 'paste' ? 'active' : ''}`}
                  onClick={() => setImportMode('paste')}
                >
                  <FileText size={18} className="inline mr-2" />
                  Paste Data
                </button>
                <button 
                  className={`tab-btn ${importMode === 'upload' ? 'active' : ''}`}
                  onClick={() => setImportMode('upload')}
                >
                  <Upload size={18} className="inline mr-2" />
                  Upload File
                </button>
              </div>

              {importMode === 'paste' ? (
                <>
                  <textarea 
                    className="paste-area" 
                    placeholder="Paste TSV data here..."
                    value={rawText}
                    onChange={(e) => setRawText(e.target.value)}
                  ></textarea>
                  <button 
                    className="btn-text mt-2" 
                    onClick={() => setRawText(SAMPLE_TSV)}
                  >
                    Load Sample NPSC Data
                  </button>
                </>
              ) : (
                <div 
                  className="upload-zone"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  <Upload className="upload-icon" />
                  <div>
                    <p className="font-bold text-lg">Drag & Drop .tsv, .csv or .txt file</p>
                    <p className="text-sm text-neutral-400 mt-2">or click here to browse</p>
                  </div>
                  <input type="file" className="hidden" accept=".tsv,.csv,.txt" />
                  <button className="btn-outline">Browse Files</button>
                </div>
              )}
            </div>

            <div className="md:w-1/3 flex flex-col justify-between">
              <div>
                <label className="block text-sm font-bold mb-2">Assign to Competition:</label>
                <select 
                  className="gold-select mb-4"
                  value={competition}
                  onChange={(e) => setCompetition(e.target.value)}
                >
                  <option value="6th NPSC 2025">📝 6th National Para Shooting Championship 2025</option>
                  <option value="5th NPSC 2024">📝 5th National Para Shooting Championship 2024</option>
                  <option value="new">+ Create New Competition...</option>
                </select>

                <div className="info-box">
                  <h4 className="font-bold mb-2 flex items-center gap-2 text-[var(--accent)] text-xs uppercase tracking-wider">
                     Column Format Rules
                  </h4>
                  <ul className="text-xs space-y-2 list-disc pl-4 text-neutral-300">
                    <li>28 columns minimum expected per row</li>
                    <li>Tab-separated (standard Excel copy-paste)</li>
                    <li>Columns 1-4: Cert No, Comp No, Name, State</li>
                    <li>Columns 5-12: Event Names (up to 8)</li>
                    <li>Columns 13-20: Scores (up to 8)</li>
                    <li>Columns 21-28: Positions (up to 8)</li>
                    <li>Use <code className="bg-black/30 px-1 text-amber-300">x----x----x----x</code> for empty events</li>
                    <li>Same athlete on multiple rows will be merged</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex justify-end">
                <button 
                  className="btn-gold-gradient w-full md:w-auto"
                  onClick={parseResults}
                  disabled={!rawText.trim()}
                >
                  <Play size={18} /> Parse & Preview
                </button>
              </div>
            </div>
>>>>>>> Stashed changes
          </div>
        </div>
      )}

<<<<<<< Updated upstream
      {/* HEADER PAGE OUTSIDE CONTENT */}
      <div className="bg-white border-b border-[#E2E8F0] px-6 py-6 md:px-10 md:py-8 flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#003DA5] to-[#002B7A] flex items-center justify-center shrink-0 shadow-sm">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="22,12 18,12 15,21 9,3 6,12 2,12"/>
          </svg>
        </div>
        <div>
          <h1 className="text-[21px] text-[#003DA5] font-bold" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>
            Championship Results Import
          </h1>
          <p className="text-[#94A3B8] text-sm mt-1">Upload Excel → Review data → Publish certificates to all athletes</p>
        </div>
      </div>

      {/* STEPS BAR */}
      <div className="bg-white border-b border-[#E2E8F0] sticky top-0 z-40 px-6 py-4 shadow-sm">
        <div className="max-w-[580px] mx-auto relative flex justify-between">
          <div className="absolute top-[14px] left-[30px] right-[30px] h-0.5 bg-[#E2E8F0] z-0"></div>
          
          <div className="text-center relative z-10 w-[100px] flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 mb-2 bg-white transition-colors duration-300
              ${step === 1 ? 'border-[#003DA5] bg-[#003DA5] text-white' : 
                step > 1 ? 'border-[#046A38] bg-[#046A38] text-white' : ''}`}>
              {step > 1 ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : '1'}
            </div>
            <span className={`text-[12px] font-semibold ${step >= 1 ? 'text-[#003DA5]' : 'text-[#94A3B8]'}`}>Upload Excel</span>
          </div>

          <div className="text-center relative z-10 w-[100px] flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 mb-2 bg-white transition-colors duration-300
              ${step === 2 ? 'border-[#003DA5] bg-[#003DA5] text-white' : 
                step > 2 ? 'border-[#046A38] bg-[#046A38] text-white' : 'border-[#E2E8F0] text-[#94A3B8]'}`}>
              {step > 2 ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : '2'}
            </div>
            <span className={`text-[12px] font-semibold ${step >= 2 ? 'text-[#003DA5]' : 'text-[#94A3B8]'}`}>Review Data</span>
          </div>

          <div className="text-center relative z-10 w-[100px] flex flex-col items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 mb-2 bg-white transition-colors duration-300
              ${step === 3 ? 'border-[#046A38] bg-[#046A38] text-white' : 'border-[#E2E8F0] text-[#94A3B8]'}`}>
              {step > 3 ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              ) : '3'}
            </div>
            <span className={`text-[12px] font-semibold ${step === 3 ? 'text-[#046A38]' : 'text-[#94A3B8]'}`}>Published</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto mt-8 px-4 md:px-8">

        {step === 1 && (
          <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden animate-in fade-in zoom-in-95 duration-200 block">
            
            {/* CARD HEADER */}
            <div className="bg-gradient-to-r from-[#001A4D] to-[#003DA5] p-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/>
                  <line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
              </div>
              <div>
                <h2 className="text-white text-[18px] font-bold tracking-tight">Upload Championship Excel</h2>
                <p className="text-white/70 text-[13px] mt-0.5">Standard 28-column NPSC certified data format</p>
              </div>
            </div>

            <div className="p-6 md:p-8">
              
              {/* FORM ROW */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#334155] uppercase tracking-wider">Championship Name *</label>
                  <input type="text" value={champName} onChange={e => setChampName(e.target.value)}
                    className="w-full text-[14px] text-[#0F172A] border border-[#E2E8F0] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#003DA5] focus:border-transparent transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#334155] uppercase tracking-wider">Venue *</label>
                  <input type="text" value={champVenue} onChange={e => setChampVenue(e.target.value)}
                    className="w-full text-[14px] text-[#0F172A] border border-[#E2E8F0] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#003DA5] focus:border-transparent transition-all shadow-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[13px] font-bold text-[#334155] uppercase tracking-wider">Dates *</label>
                  <input type="text" value={champDates} onChange={e => setChampDates(e.target.value)}
                    className="w-full text-[14px] text-[#0F172A] border border-[#E2E8F0] rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#003DA5] focus:border-transparent transition-all shadow-sm" />
                </div>
              </div>

              {/* DROP ZONE */}
              <div 
                className="relative border-2 border-dashed border-[#E2E8F0] rounded-[13px] bg-[#F4F6FB] overflow-hidden group hover:border-[#003DA5] hover:bg-[rgba(0,61,165,0.03)] transition-all flex flex-col items-center justify-center p-12 text-center"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <input 
                  type="file" 
                  accept=".xlsx,.xls,.csv" 
                  onChange={e => e.target.files && setFile(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div className="w-[52px] h-[52px] rounded-xl bg-[rgba(0,61,165,0.08)] flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#003DA5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2"/>
                    <path d="M3 9h18"/><path d="M9 21V9"/>
                  </svg>
                </div>
                <h3 className="text-[16px] font-bold text-[#0F172A] mb-1">Drop Excel file here or click to browse</h3>
                <p className="text-[13px] text-[#94A3B8] mb-5">Standard 28-column NPSC certified data format</p>
                <div className="flex gap-2">
                  <span className="px-2.5 py-1 rounded bg-green-100 text-[#046A38] text-[11px] font-bold">.XLSX</span>
                  <span className="px-2.5 py-1 rounded bg-blue-100 text-[#003DA5] text-[11px] font-bold">.XLS</span>
                  <span className="px-2.5 py-1 rounded bg-slate-200 text-[#334155] text-[11px] font-bold">.CSV</span>
                </div>
              </div>

              {/* FILE SELECTED STATE */}
              {file && (
                <div className="mt-4 p-4 rounded-xl flex items-center justify-between"
                  style={{ backgroundColor: 'rgba(4,106,56,.06)', border: '1px solid rgba(4,106,56,.2)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#046A38] text-white flex items-center justify-center">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-[14px] font-bold text-[#046A38]">{file.name}</div>
                      <div className="text-[12px] text-[#046A38]/70">{(file.size / 1024).toFixed(1)} KB</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => setFile(null)} 
                    className="w-8 h-8 rounded-full hover:bg-[#046A38]/10 flex items-center justify-center text-[#046A38] transition-colors"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/>
                      <line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              )}

              {/* FORMAT GUIDE BOX */}
              <div className="mt-8 rounded-[12px] overflow-hidden" style={{ backgroundColor: 'rgba(200,164,21,.05)', border: '1.5px solid rgba(200,164,21,.2)' }}>
                <div className="bg-[rgba(200,164,21,.1)] px-5 py-3 border-b border-[rgba(200,164,21,.2)] flex items-center gap-2">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#C8A415" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <span className="text-[14px] font-bold text-[#7A6008]">Expected Column Format (28 columns)</span>
                </div>
                <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-[13px] text-[#7A6008]">
                  <ul className="space-y-2">
                    <li className="flex items-start"><span className="mr-2">→</span> <span className="font-semibold w-16">Col 1</span> Certificate No (Sr. No.)</li>
                    <li className="flex items-start"><span className="mr-2">→</span> <span className="font-semibold w-16">Col 2</span> Competitor Number</li>
                    <li className="flex items-start"><span className="mr-2">→</span> <span className="font-semibold w-16">Col 3</span> Athlete Name</li>
                    <li className="flex items-start"><span className="mr-2">→</span> <span className="font-semibold w-16">Col 4</span> State</li>
                  </ul>
                  <ul className="space-y-2">
                    <li className="flex items-start"><span className="mr-2">→</span> <span className="font-semibold w-16">Col 5–12</span> Event Names (up to 8)</li>
                    <li className="flex items-start"><span className="mr-2">→</span> <span className="font-semibold w-16">Col 13–20</span> Scores (up to 8)</li>
                    <li className="flex items-start"><span className="mr-2">→</span> <span className="font-semibold w-16">Col 21–28</span> Positions / Ranks</li>
                    <li className="flex items-start"><span className="mr-2">→</span> <span>Empty slots: <code className="bg-[#FFFDE7] px-1 py-0.5 rounded text-[#C8A415]/70 text-xs">x----x----x----x</code></span></li>
                  </ul>
                </div>
              </div>

            </div>

            {/* FOOTER ROW */}
            <div className="bg-[#F8FAFF] px-6 md:px-8 py-4 border-t border-[#E2E8F0] flex flex-col md:flex-row justify-between items-center gap-4">
              <div className="flex items-center text-[12px] text-[#334155]">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
                Data shown for review before publishing
              </div>
              <button
                disabled={!file || isParsing || !champName || !champVenue || !champDates}
                onClick={doParseFile}
                className="flex items-center justify-center px-6 py-3 rounded-lg text-[14px] font-bold text-white bg-[#003DA5] hover:bg-[#002B7A] disabled:opacity-50 disabled:cursor-not-allowed transition-all w-full md:w-auto shadow-sm"
              >
                {isParsing ? (
                  <>
                    <svg className="animate-spin w-5 h-5 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Parsing…
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                      <polygon points="5,3 19,12 5,21 5,3"/>
                    </svg>
                    Parse &amp; Preview
                  </>
                )}
              </button>
            </div>
          </div>
        )}


        {step === 2 && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            
            {/* REVIEW HEADER CARD */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] p-6 shadow-sm flex flex-col lg:flex-row justify-between lg:items-center gap-6">
              <div>
                <div className="text-[#FF671F] font-bold text-[10px] uppercase tracking-wider mb-2">Review Before Publishing</div>
                <h3 className="text-[#003DA5] text-[18px] font-bold mb-1" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{champName}</h3>
                <p className="text-[#94A3B8] text-[12px]">{champVenue} · {champDates}</p>
              </div>
              <div className="flex gap-6 lg:gap-8 flex-wrap">
                <div className="text-center">
                  <div className="text-[22px] font-bold text-[#0F172A]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{stats.athletes}</div>
                  <div className="text-[9px] uppercase font-bold text-[#94A3B8] tracking-widest leading-none mt-1">Athletes</div>
                </div>
                <div className="text-center border-l pl-6 lg:pl-8 border-[#E2E8F0]">
                  <div className="text-[22px] font-bold text-[#0F172A]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{stats.events}</div>
                  <div className="text-[9px] uppercase font-bold text-[#94A3B8] tracking-widest leading-none mt-1">Events</div>
                </div>
                <div className="text-center border-l pl-6 lg:pl-8 border-[#E2E8F0]">
                  <div className="text-[22px] font-bold text-[#C8A415]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{stats.golds}</div>
                  <div className="text-[9px] uppercase font-bold text-[#C8A415]/70 tracking-widest leading-none mt-1">Gold Medals</div>
                </div>
                <div className="text-center border-l pl-6 lg:pl-8 border-[#E2E8F0]">
                  <div className="text-[22px] font-bold text-[#0F172A]" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{stats.states}</div>
                  <div className="text-[9px] uppercase font-bold text-[#94A3B8] tracking-widest leading-none mt-1">States</div>
                </div>
              </div>
            </div>

            {/* TABLE CARD */}
            <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden flex flex-col">
              
              <div className="p-4 border-b border-[#E2E8F0] flex flex-col md:flex-row justify-between items-center gap-4 bg-[#F8FAFF]">
                <h4 className="text-[14px] font-bold text-[#334155]">Athlete Results — <span className="text-[#003DA5]">{filteredData.length}</span> athletes</h4>
                <div className="flex gap-3">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Search athletes or cert no..." 
                      value={searchQ}
                      onChange={e => setSearchQ(e.target.value)}
                      className="pl-9 pr-4 py-2 w-[175px] focus:w-[205px] border border-[#E2E8F0] rounded-lg text-[13px] outline-none focus:ring-2 focus:ring-[#003DA5]/20 focus:border-[#003DA5] transition-all"
                    />
                    <svg className="absolute left-3 top-2.5 text-[#94A3B8]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="11" cy="11" r="8"/>
                      <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                    </svg>
                  </div>
                  <select 
                    value={stateFilter} 
                    onChange={e => setStateFilter(e.target.value)}
                    className="border border-[#E2E8F0] rounded-lg py-2 pl-3 pr-8 text-[13px] outline-none max-w-[150px] bg-white text-[#334155] focus:ring-2 focus:ring-[#003DA5]/20"
                  >
                    <option value="">All States</option>
                    {uniqueStates.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F0F4FF] border-b border-[#E2E8F0]">
                      <th className="py-3 px-4 text-[11px] font-bold text-[#003DA5] uppercase tracking-wider">Cert No</th>
                      <th className="py-3 px-4 text-[11px] font-bold text-[#003DA5] uppercase tracking-wider">Comp No</th>
                      <th className="py-3 px-4 text-[11px] font-bold text-[#003DA5] uppercase tracking-wider">Athlete</th>
                      <th className="py-3 px-4 text-[11px] font-bold text-[#003DA5] uppercase tracking-wider">State</th>
                      <th className="py-3 px-4 text-[11px] font-bold text-[#003DA5] uppercase tracking-wider">Events &amp; Results</th>
                      <th className="py-3 px-4 text-[11px] font-bold text-[#003DA5] uppercase tracking-wider text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.slice(0, 50).map((row, i) => (
                      <tr key={i} className="border-b border-[#E2E8F0] hover:bg-[#F8FAFF] transition-colors group">
                        <td className="py-3 px-4 align-top pt-4">
                          <code className="text-[#94A3B8] font-['DM_Mono',monospace] text-[10px]">{row.certNo}</code>
                        </td>
                        <td className="py-3 px-4 align-top pt-4">
                          <code className="text-[#94A3B8] font-['DM_Mono',monospace] text-[10px]">{row.compNo}</code>
                        </td>
                        <td className="py-3 px-4 align-top pt-[14px]">
                          <strong className="text-[13px] text-[#003DA5] font-black" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{row.name}</strong>
                        </td>
                        <td className="py-3 px-4 align-top pt-3">
                          <div className="inline-flex bg-[rgba(0,61,165,.08)] text-[#003DA5] text-[10px] px-2 py-0.5 rounded font-bold uppercase whitespace-nowrap">
                            {row.state}
                          </div>
                        </td>
                        <td className="py-3 px-4 align-top">
                          <div className="flex flex-col gap-1.5">
                            {row.events.map((ev, ei) => {
                              const r = (ev.position || '').toLowerCase()
                              let rankClass = "bg-[#F0F4FF] text-[#003DA5]" // other
                              if (r === 'gold' || r === '1') rankClass = "bg-[#FEF9C3] text-[#7A6008]"
                              else if (r === 'silver' || r === '2') rankClass = "bg-[#F1F5F9] text-[#475569]"
                              else if (r === 'bronze' || r === '3') rankClass = "bg-[#FEF3C7] text-[#92400E]"

                              return (
                                <div key={ei} className="flex flex-wrap items-center gap-2 text-[12px] bg-white border border-[#E2E8F0] rounded p-1.5 shadow-sm group-hover:border-[#cbd5e1]">
                                  <span className="flex-1 truncate text-[#334155] max-w-[200px]" title={ev.name}>{ev.name}</span>
                                  {ev.score && <code className="font-['DM_Mono',monospace] text-[11px] px-1 bg-slate-50 border border-slate-200 rounded">{ev.score}</code>}
                                  {ev.position && <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${rankClass}`}>{ev.position}</span>}
                                </div>
                              )
                            })}
                          </div>
                        </td>
                        <td className="py-3 px-4 align-top pt-3 text-right">
                          <span className="inline-flex items-center gap-1 bg-[#dcfce7] text-[#166534] text-[10px] font-bold uppercase px-2 py-0.5 rounded-full whitespace-nowrap shadow-sm border border-[#166534]/10">
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12"/>
                            </svg>
                            Ready
                          </span>
                        </td>
                      </tr>
                    ))}
                    {filteredData.length > 50 && (
                      <tr className="bg-[#f8fafc]">
                        <td colSpan={6} className="py-3 px-4 text-center text-[12px] text-[#94A3B8] font-semibold italic">
                          Showing first 50 results... (Total: {filteredData.length})
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* WARNING BOX */}
            <div className="bg-[#FEF9C3]/40 border-[1.5px] border-[#C8A415]/40 rounded-xl p-5 flex gap-4 mt-6 items-start">
              <div className="mt-0.5 w-6 h-6 rounded-full bg-[#C8A415]/20 flex items-center justify-center shrink-0">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#92400E" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <line x1="12" y1="8" x2="12" y2="12"/>
                  <line x1="12" y1="16" x2="12.01" y2="16"/>
                </svg>
              </div>
              <div>
                <h4 className="text-[14px] font-bold text-[#92400E] mb-1">Ready to Publish Certificates</h4>
                <p className="text-[13px] text-[#92400E]/80 leading-relaxed">
                  Once published, each athlete will see their individual certificate in their secured shooter portal. Certificates are generated automatically from this data. This action cannot be undone.
                </p>
              </div>
            </div>

            {/* ACTION ROW */}
            <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 mt-8 pt-6 border-t border-[#E2E8F0]">
              <button 
                disabled={isPublishing}
                onClick={() => setStep(1)}
                className="flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-[#E2E8F0] bg-white text-[#334155] hover:bg-[#F8FAFF] hover:text-[#003DA5] hover:border-[#003DA5]/50 transition-all font-semibold text-[14px] w-full md:w-auto shadow-sm"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12"/>
                  <polyline points="12 19 5 12 12 5"/>
                </svg>
                Back to Upload
              </button>
              
              <button 
                disabled={isPublishing}
                onClick={doPublish}
                className="flex items-center justify-center gap-2 px-6 py-2.5 rounded-lg bg-green-600 hover:bg-green-700 text-white transition-all font-bold text-[14px] w-full md:w-auto shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {isPublishing ? (
                  <>
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M21 12a9 9 0 1 1-6.219-8.56"/>
                    </svg>
                    Publishing…
                  </>
                ) : (
                  <>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Publish All Certificates
                  </>
                )}
              </button>
            </div>

          </div>
        )}


        {step === 3 && (
          <div className="flex flex-col items-center text-center max-w-lg mx-auto py-16 animate-in zoom-in-95 duration-500">
            <div className="w-[80px] h-[80px] rounded-full justify-center bg-[#dcfce7] flex items-center shadow-inner mb-6 relative">
              <div className="absolute inset-0 border-[4px] border-[#166534]/10 rounded-full animate-pulse"></div>
              <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#166534" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </div>
            
            <h1 className="text-[28px] text-[#003DA5] font-bold mb-3" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>Certificates Published!</h1>
            <p className="text-[#334155] text-[15px] mb-8 leading-relaxed">
              All athlete certificates are now live in the shooter portals. Players can log in anytime to view and download their documents securely.
            </p>

            <div className="flex justify-center flex-wrap gap-4 mb-10 w-full">
              <div className="bg-white border text-center border-[#E2E8F0] shadow-sm flex-1 p-4 py-5 rounded-2xl min-w-[120px]">
                <div className="text-[28px] font-bold text-[#0F172A] leading-none mb-1.5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{data.length}</div>
                <div className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-widest leading-none">Certificates</div>
              </div>
              <div className="bg-white border text-center border-[#E2E8F0] shadow-sm flex-1 p-4 py-5 rounded-2xl min-w-[120px]">
                <div className="text-[28px] font-bold text-[#0F172A] leading-none mb-1.5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{stats.events}</div>
                <div className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-widest leading-none">Events</div>
              </div>
              <div className="bg-white border text-center border-[#E2E8F0] shadow-sm flex-1 p-4 py-5 rounded-2xl min-w-[120px]">
                <div className="text-[28px] font-bold text-[#C8A415] leading-none mb-1.5" style={{ fontFamily: "'Playfair Display', Georgia, serif" }}>{stats.golds}</div>
                <div className="text-[10px] uppercase font-bold text-[#C8A415]/70 tracking-widest leading-none">Gold Medals</div>
              </div>
            </div>

            <button 
              onClick={() => {
                setStep(1)
                setFile(null)
                setData([])
              }}
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-2 border-[#E2E8F0] bg-white text-[#003DA5] hover:bg-[#F8FAFF] hover:border-[#003DA5] transition-all font-bold text-[14px] shadow-sm group"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="group-hover:-rotate-90 transition-transform duration-300">
                <polyline points="1,4 1,10 7,10"/>
                <path d="M3.51 15a9 9 0 1 0 .49-3.18"/>
              </svg>
              Import Another Championship
            </button>
          </div>
        )}

      </div>
=======
      {/* ─── STEP 2: PREVIEW ─── */}
      {step === 2 && (
        <div className="fade-in">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">Data Preview & Validation</h2>
            <button className="btn-outline" onClick={() => setStep(1)}>
              <RefreshCcw size={16} /> Re-import
            </button>
          </div>

          <div className="import-stats">
            <div className="import-stat-card">
              <div className="value">{summary.totalRows}</div>
              <div className="label">Rows Parsed</div>
            </div>
            <div className="import-stat-card">
              <div className="value">{summary.uniqueAthletes}</div>
              <div className="label">Unique Athletes</div>
            </div>
            <div className="import-stat-card">
              <div className="value">{summary.totalEvents}</div>
              <div className="label">Events Recorded</div>
            </div>
            <div className="import-stat-card" style={{ borderColor: summary.warnings.length > 0 ? 'var(--warning)' : 'var(--success)' }}>
              <div className="value" style={{ color: summary.warnings.length > 0 ? 'var(--warning)' : 'var(--success)' }}>
                {summary.warnings.length}
              </div>
              <div className="label">Warnings</div>
            </div>
          </div>

          {summary.warnings.length > 0 && (
            <div className="warnings-panel">
              <div className="warnings-header" onClick={() => setShowWarnings(!showWarnings)}>
                <AlertTriangle size={20} />
                <span>Found {summary.warnings.length} issues during parsing. Review recommended.</span>
                {showWarnings ? <ChevronDown className="ml-auto" /> : <ChevronRight className="ml-auto" />}
              </div>
              {showWarnings && (
                <ul className="warnings-list">
                  {summary.warnings.map((w, i) => <li key={i}>{w}</li>)}
                </ul>
              )}
            </div>
          )}

          <div className="import-card p-0 overflow-hidden mb-6">
            <div className="p-4 border-b border-[var(--card-border)] flex flex-wrap gap-4 items-center justify-between bg-black/20">
              <div className="flex gap-4 items-center">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                  <input type="text" placeholder="Search athletes..." className="bg-white/5 border border-white/10 rounded-md py-2 pl-9 pr-4 text-sm w-64 focus:border-[var(--accent)] outline-none" />
                </div>
                <span className="text-sm font-bold text-[var(--accent)]">{selectedRows.size} selected</span>
              </div>
              
              <div className="flex gap-3">
                <button className="btn-outline text-sm py-2" onClick={() => setSelectedRows(new Set())}>Clear Selection</button>
                <button className="btn-gold-gradient py-2" onClick={startImport} disabled={selectedRows.size === 0}>
                  <Download size={16} /> Import Selected ({selectedRows.size})
                </button>
              </div>
            </div>

            <div className="preview-table-container rounded-none border-x-0 border-b-0">
              <table className="preview-table">
                <thead>
                  <tr>
                    <th className="w-12 text-center">
                      <input type="checkbox" checked={selectedRows.size === parsedData.length} onChange={toggleSelectAll} className="w-4 h-4 accent-[var(--accent)]" />
                    </th>
                    <th className="w-12 text-center"></th>
                    <th>Competitor No</th>
                    <th>Name</th>
                    <th>State</th>
                    <th>Cert No</th>
                    <th>Events Count</th>
                  </tr>
                </thead>
                <tbody>
                  {parsedData.map((athlete) => (
                    <React.Fragment key={athlete.id}>
                      <tr className={selectedRows.has(athlete.id) ? 'bg-[var(--accent)]/5' : ''}>
                        <td className="text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedRows.has(athlete.id)} 
                            onChange={() => toggleSelect(athlete.id)} 
                            className="w-4 h-4 accent-[var(--accent)]"
                          />
                        </td>
                        <td className="text-center cursor-pointer text-neutral-400 hover:text-white" onClick={() => toggleRow(athlete.id)}>
                          {expandedRows.has(athlete.id) ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                        </td>
                        <td className="font-mono">{athlete.competitorNo}</td>
                        <td className="font-bold">{athlete.name}</td>
                        <td>{athlete.state}</td>
                        <td className="font-mono text-sm text-neutral-400">{athlete.certNo}</td>
                        <td className="font-bold text-[var(--accent)]">{athlete.events.length} Events</td>
                      </tr>
                      
                      {expandedRows.has(athlete.id) && (
                        <tr>
                          <td colSpan={2}></td>
                          <td colSpan={5} className="pb-4 pt-0">
                            <table className="events-nested-table">
                              <thead>
                                <tr>
                                  <th>Event Name</th>
                                  <th>Score / Value</th>
                                  <th>Position</th>
                                </tr>
                              </thead>
                              <tbody>
                                {athlete.events.map((ev, i) => (
                                  <tr key={i}>
                                    <td className="font-medium">{ev.name}</td>
                                    <td className="font-mono">{ev.score}</td>
                                    <td>{renderMedalBadge(ev.position)}</td>
                                  </tr>
                                ))}
                                {athlete.events.length === 0 && (
                                  <tr><td colSpan={3} className="text-center text-neutral-500 italic py-2">No valid events found to import.</td></tr>
                                )}
                              </tbody>
                            </table>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                  {parsedData.length === 0 && (
                     <tr><td colSpan={7} className="text-center py-8 text-neutral-400">No valid records parsed.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ─── STEP 3: IMPORTING PROGRESS ─── */}
      {step === 3 && (
        <div className="import-card fade-in text-center max-w-3xl border-[var(--accent)]">
          <Activity size={48} className="mx-auto text-[var(--accent)] mb-4 animate-pulse" />
          <h2 className="text-2xl font-bold mb-2">Importing Results to Dataset</h2>
          <p className="text-neutral-400 mb-6">Committing rows to database for '{competition}'...</p>

          <div className="progress-container">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            <div className="progress-text text-white">{progress}% Complete</div>
          </div>

          <div className="live-log text-left" ref={logRef}>
            {logs.map((log, idx) => (
              <div key={idx} className={`log-entry ${log.type}`}>
                {log.msg}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── STEP 4: COMPLETE ─── */}
      {step === 4 && (
        <div className="import-card fade-in text-center max-w-2xl py-12">
          <div className="success-checkmark">
            <Check size={48} strokeWidth={3} />
          </div>
          
          <h2 className="text-4xl font-bold font-heading mb-2">Import Complete!</h2>
          <p className="text-lg text-neutral-300 mb-8">Successfully committed {selectedRows.size} athlete records and their events to the database.</p>
          
          <div className="bg-black/20 border border-[var(--card-border)] rounded-lg p-6 flex justify-around mb-8">
            <div>
              <div className="text-3xl font-bold text-[var(--accent)]">{selectedRows.size}</div>
              <div className="text-sm font-medium text-neutral-400 uppercase tracking-wider mt-1">Athletes</div>
            </div>
            <div className="w-px bg-[var(--card-border)]"></div>
            <div>
              <div className="text-3xl font-bold text-green-400">
                {parsedData.filter(a => selectedRows.has(a.id)).reduce((acc, a) => acc + a.events.length, 0)}
              </div>
              <div className="text-sm font-medium text-neutral-400 uppercase tracking-wider mt-1">Events Stored</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="btn-gold-gradient shadow-lg">
              <FileText size={18} /> Generate Certificates Now
            </button>
            <button className="btn-outline">
              <Database size={18} /> View Database
            </button>
            <button className="btn-outline border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary)] hover:text-white mt-4 sm:mt-0" onClick={() => {
              setStep(1); setRawText(''); setParsedData([]); setProgress(0); setLogs([]);
            }}>
               Upload Another Target
            </button>
          </div>
        </div>
      )}
>>>>>>> Stashed changes
    </div>
  )
}
