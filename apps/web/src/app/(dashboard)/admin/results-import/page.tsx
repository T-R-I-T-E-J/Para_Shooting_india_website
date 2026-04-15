'use client'

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
  name: string
  state: string
  events: EventResult[]
}

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
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
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
          </div>
        </div>
      )}

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
    </div>
  )
}
