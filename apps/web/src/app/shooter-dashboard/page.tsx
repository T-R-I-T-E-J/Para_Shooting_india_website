'use client'

import React, { useState } from 'react'
import {
  Home, User, Trophy, Award, FileText, Settings,
  LogOut, Download, Eye, Upload, CheckCircle, AlertCircle, RefreshCw, ChevronRight, Copy, Check, Target
} from 'lucide-react'
import Image from 'next/image'
import './dashboard.css'

/* ─── MOCK DATA ─── */
const SHOOTER_DATA = {
  name: 'RUDRANSH KHANDELWAL',
  state: 'RAJASTHAN',
  competitorNo: 2005,
  pciId: 'PCI/PSAI/2025/0042',
  status: 'approved', // try changing to 'pending' to test the other UI
  category: 'SH1, Pistol shooter',
  stats: { gold: 6, other: 1, events: 8, championships: 1 },
  results: [
    { id: 1, event: 'P1 Final', score: '240.5', rank: 1 },
    { id: 2, event: 'P1 Qual', score: '575', rank: 7 },
    { id: 3, event: 'P1J', score: '575', rank: 1 },
    { id: 4, event: 'P4 Final', score: '235.2', rank: 1 },
    { id: 5, event: 'P4 Qual', score: '560', rank: 2 },
    { id: 6, event: 'P4J', score: '560', rank: 1 },
    { id: 7, event: 'P5 Final', score: '370', rank: 1 },
    { id: 8, event: 'P5J', score: '370', rank: 1 },
  ],
  documents: [
    { id: 'doc1', name: 'Passport Photo', status: 'uploaded', file: 'photo.jpg', size: '1.2 MB', date: '01/12/2025' },
    { id: 'doc2', name: 'Aadhar Card', status: 'uploaded', file: 'aadhar.pdf', size: '2.4 MB', date: '01/12/2025' },
    { id: 'doc3', name: 'Birth Certificate', status: 'missing' },
    { id: 'doc4', name: 'PAN Card', status: 'uploaded', file: 'pan.pdf', size: '800 KB', date: '05/12/2025' },
    { id: 'doc5', name: 'Passport', status: 'missing' },
    { id: 'doc6', name: 'Arms License', status: 'rejected', reason: 'Unclear scan, please re-upload' },
    { id: 'doc7', name: 'Affidavit', status: 'uploaded', file: 'affidavit.pdf', size: '1.1 MB', date: '05/12/2025' },
    { id: 'doc8', name: 'IPC Card', status: 'uploaded', file: 'ipc.pdf', size: '500 KB', date: '06/12/2025' },
  ]
}

/* ─── SUB-COMPONENTS ─── */

const DashboardView = ({ changeTab }: { changeTab: (tab: string) => void }) => {
  const [copied, setCopied] = useState(false)

  const handleCopyId = () => {
    navigator.clipboard.writeText(SHOOTER_DATA.pciId)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6 fade-in h-auto pb-10">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Welcome back, {SHOOTER_DATA.name.split(' ')[0]} 👋</h1>
          <p className="text-neutral-400">Today is {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="glass-card flex items-center gap-4 border-l-4 border-[#ffd700]">
          <div className="p-4 rounded-full bg-[#ffd700]/10 text-[#ffd700]">
            <Trophy size={32} />
          </div>
          <div className="stat-card">
            <span className="stat-value">{SHOOTER_DATA.stats.gold}</span>
            <span className="stat-label">Gold Medals</span>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4 border-l-4 border-[#e5e4e2]">
          <div className="p-4 rounded-full bg-[#e5e4e2]/10 text-[#e5e4e2]">
            <Award size={32} />
          </div>
          <div className="stat-card">
            <span className="stat-value">{SHOOTER_DATA.stats.other}</span>
            <span className="stat-label">Silver/Bronze</span>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4 border-l-4 border-blue-400">
          <div className="p-4 rounded-full bg-blue-400/10 text-blue-400">
            <Target size={32} />
          </div>
          <div className="stat-card">
            <span className="stat-value">{SHOOTER_DATA.stats.events}</span>
            <span className="stat-label">Events Competed</span>
          </div>
        </div>
        <div className="glass-card flex items-center gap-4 border-l-4 border-[#C8A415]">
          <div className="p-4 rounded-full bg-[#C8A415]/10 text-[#C8A415]">
            <Award size={32} />
          </div>
          <div className="stat-card">
            <span className="stat-value">{SHOOTER_DATA.stats.championships}</span>
            <span className="stat-label">Championships</span>
          </div>
        </div>
      </div>

      {/* Registration Status */}
      {SHOOTER_DATA.status === 'pending' ? (
        <div className="glass-card flex flex-col items-center justify-center p-8 border-amber-500/30 bg-amber-500/5 text-center">
          <div className="w-16 h-16 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center mb-4">
            <RefreshCw size={32} className="animate-spin-slow" />
          </div>
          <h2 className="text-xl font-bold text-amber-400 mb-2">⏳ Your registration is under review</h2>
          <p className="text-neutral-300 max-w-lg mb-8">
            The PCI Admin team is currently reviewing your uploaded documents. 
            Your PCI ID will be assigned within 7 working days.
          </p>
          
          <div className="flex items-center justify-center w-full max-w-2xl text-sm font-medium">
            <div className="flex flex-col items-center text-green-400">
              <div className="w-8 h-8 rounded-full bg-green-400/20 border border-green-400 flex items-center justify-center mb-2"><Check size={16} /></div>
              <span>Submitted</span>
            </div>
            <div className="flex-1 h-px bg-green-400/50 -mt-6 mx-2"></div>
            <div className="flex flex-col items-center text-amber-400">
              <div className="w-8 h-8 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center mb-2"><RefreshCw size={16} /></div>
              <span>Under Review</span>
            </div>
            <div className="flex-1 h-px bg-white/10 -mt-6 mx-2"></div>
            <div className="flex flex-col items-center text-neutral-500">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/20 flex items-center justify-center mb-2">3</div>
              <span>Approved</span>
            </div>
            <div className="flex-1 h-px bg-white/10 -mt-6 mx-2"></div>
            <div className="flex flex-col items-center text-neutral-500">
              <div className="w-8 h-8 rounded-full bg-white/5 border border-white/20 flex items-center justify-center mb-2">4</div>
              <span>ID Assigned</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="glass-card flex flex-col md:flex-row gap-6 items-center justify-between border-green-500/30 bg-green-500/5 p-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center">
              <CheckCircle size={28} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-green-400 mb-1">✅ Registration Approved</h2>
              <div className="flex items-center gap-3">
                <p className="text-neutral-300">PCI ID:</p>
                <code className="px-3 py-1 bg-black/40 rounded text-green-300 font-mono text-sm border border-green-500/30">
                  {SHOOTER_DATA.pciId}
                </code>
                <button 
                  onClick={handleCopyId}
                  className="p-1.5 hover:bg-white/10 rounded text-neutral-400 hover:text-white transition-colors"
                  title="Copy ID"
                >
                  {copied ? <Check size={16} className="text-green-400" /> : <Copy size={16} />}
                </button>
              </div>
            </div>
          </div>
          <div className="text-right flex flex-col md:items-end gap-3">
            <p className="text-sm text-neutral-400">Your certificates for 6th NPSC are ready.</p>
            <button onClick={() => changeTab('certificates')} className="btn-gold">
              <Download size={18} /> Download Certificates
            </button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Results */}
        <div className="glass-card lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold">Recent Results (NPSC 2025)</h3>
            <button onClick={() => changeTab('results')} className="text-sm text-[var(--accent)] hover:underline flex items-center gap-1">
              View All <ChevronRight size={16} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="results-table">
              <thead>
                <tr>
                  <th>Event</th>
                  <th>Score</th>
                  <th>Rank</th>
                </tr>
              </thead>
              <tbody>
                {SHOOTER_DATA.results.slice(0, 4).map(res => (
                  <tr key={res.id}>
                    <td>{res.event}</td>
                    <td>{res.score}</td>
                    <td className={res.rank === 1 ? 'rank-gold' : res.rank === 2 ? 'rank-silver' : res.rank === 3 ? 'rank-bronze' : ''}>
                      {res.rank === 1 ? '🥇 1st' : res.rank === 2 ? '🥈 2nd' : res.rank === 3 ? '🥉 3rd' : `${res.rank}th`}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="glass-card">
          <h3 className="text-lg font-bold mb-6">Quick Actions</h3>
          <div className="flex flex-col gap-3">
            <button onClick={() => changeTab('certificates')} className="btn-outline w-full justify-center">
              <Download size={18} /> Download Certificates
            </button>
            <button onClick={() => changeTab('profile')} className="btn-outline w-full justify-center">
              <User size={18} /> Edit Profile
            </button>
            <button onClick={() => changeTab('documents')} className="btn-outline w-full justify-center">
              <Upload size={18} /> Upload Documents
            </button>
            <button className="btn-outline w-full justify-center text-error border-error/50 hover:bg-error/10 hover:border-error">
              <Settings size={18} /> Account Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProfileView = () => {
  return (
    <div className="space-y-6 fade-in h-auto pb-10">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">My Profile</h2>
        <button className="btn-gold"><User size={18} /> Edit Profile</button>
      </div>

      <div className="glass-card">
        <h3 className="text-lg font-bold mb-4 text-[var(--accent)] border-b border-white/10 pb-2">Personal Details</h3>
        <div className="info-grid">
          <span className="info-label">Full Name</span><span className="info-value">{SHOOTER_DATA.name}</span>
          <span className="info-label">Date of Birth</span><span className="info-value">15 August 1999</span>
          <span className="info-label">Gender</span><span className="info-value">Male</span>
          <span className="info-label">Blood Group</span><span className="info-value">O+</span>
          <span className="info-label">Father's Name</span><span className="info-value">Mr. Rajendra Khandelwal</span>
        </div>
      </div>

      <div className="glass-card">
        <h3 className="text-lg font-bold mb-4 text-[var(--accent)] border-b border-white/10 pb-2">Sport Details</h3>
        <div className="info-grid">
          <span className="info-label">State Representation</span><span className="info-value">{SHOOTER_DATA.state}</span>
          <span className="info-label">Competitor Number</span><span className="info-value">{SHOOTER_DATA.competitorNo}</span>
          <span className="info-label">PCI ID</span><span className="info-value">{SHOOTER_DATA.pciId || 'Pending'}</span>
          <span className="info-label">Category</span><span className="info-value">{SHOOTER_DATA.category}</span>
          <span className="info-label">Primary Club/Academy</span><span className="info-value">Eklavya Shooting Academy, Rajasthan</span>
        </div>
      </div>

      <div className="glass-card">
        <h3 className="text-lg font-bold mb-4 text-[var(--accent)] border-b border-white/10 pb-2">Contact & Address</h3>
        <div className="info-grid">
          <span className="info-label">Email</span><span className="info-value">rudransh.k@example.com</span>
          <span className="info-label">Phone</span><span className="info-value">+91 98765 43210</span>
          <span className="info-label">Permanent Address</span><span className="info-value">123, Civil Lines, Jaipur, Rajasthan - 302001</span>
        </div>
      </div>
    </div>
  )
}

const ResultsView = () => {
  return (
    <div className="space-y-6 fade-in h-auto pb-10">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-4 gap-4">
        <h2 className="text-2xl font-bold">My Results</h2>
        <select className="bg-[#0d1f3c] border border-white/20 rounded-md px-4 py-2 text-white outline-none focus:border-[var(--accent)]">
          <option>6th National Para Shooting Championship 2025</option>
        </select>
      </div>

      {/* Summary Card */}
      <div className="glass-card border-l-4 border-[var(--primary)] bg-gradient-to-r from-[var(--primary)]/20 to-transparent">
        <h3 className="text-xl font-bold mb-2">6th National Para Shooting Championship 2025</h3>
        <p className="text-neutral-400 mb-4 flex items-center gap-2">
          <Target size={16} /> Dr. Karni Singh Shooting Range, Delhi | 5-10 Dec 2025
        </p>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg">
            <span className="text-2xl">🥇</span>
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-wider">Gold</p>
              <p className="font-bold text-xl">{SHOOTER_DATA.stats.gold}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg">
            <span className="text-2xl">🥈</span>
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-wider">Silver</p>
              <p className="font-bold text-xl">1</p>
            </div>
          </div>
          <div className="flex items-center gap-2 bg-black/30 px-4 py-2 rounded-lg">
            <span className="text-2xl">🥉</span>
            <div>
              <p className="text-xs text-neutral-400 uppercase tracking-wider">Bronze</p>
              <p className="font-bold text-xl">0</p>
            </div>
          </div>
        </div>
      </div>

      <div className="glass-card">
        <div className="overflow-x-auto">
          <table className="results-table">
            <thead>
              <tr>
                <th>Sr.</th>
                <th>Event Name</th>
                <th>Score</th>
                <th>Rank</th>
                <th>Remarks</th>
              </tr>
            </thead>
            <tbody>
              {SHOOTER_DATA.results.map((res, idx) => (
                <tr key={res.id} className="hover:bg-white/5 transition-colors">
                  <td className="text-neutral-400">{idx + 1}</td>
                  <td className="font-medium text-[var(--accent)]">{res.event}</td>
                  <td className="font-mono text-lg">{res.score}</td>
                  <td>
                    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${
                      res.rank === 1 ? 'bg-[#ffd700]/20 text-[#ffd700]' : 
                      res.rank === 2 ? 'bg-[#e5e4e2]/20 text-[#e5e4e2]' : 
                      res.rank === 3 ? 'bg-[#cd7f32]/20 text-[#cd7f32]' : 'bg-white/10 text-white'
                    }`}>
                      {res.rank === 1 ? '🥇 1st' : res.rank === 2 ? '🥈 2nd' : res.rank === 3 ? '🥉 3rd' : `${res.rank}th`}
                    </div>
                  </td>
                  <td className="text-neutral-400 text-sm">
                    {res.event.includes('Final') ? 'Qualified for Finals' : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

const CertificatesView = () => {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div className="space-y-6 fade-in h-auto pb-10">
      <h2 className="text-2xl font-bold mb-4">My Certificates</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="glass-card flex flex-col justify-between hover:border-[var(--accent)] transition-all group">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-white rounded flex items-center justify-center p-1">
                {/* Fallback for PCI Logo */}
                <span className="text-[var(--primary)] font-bold text-xs text-center border-b-2 border-[#128807]">PCI<br/>INDIA</span>
              </div>
              <span className="status-badge approved">✅ Available</span>
            </div>
            <h3 className="text-xl font-bold text-[var(--accent)] mb-1">6th National Para Shooting Championship 2025</h3>
            <p className="text-neutral-400 text-sm mb-4">Dr. Karni Singh Shooting Range, Delhi<br/>5th – 10th December 2025</p>
            
            <div className="bg-black/40 rounded p-3 mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-neutral-400">Cert No:</span>
                <span className="font-mono text-[var(--accent)]">PCI/PSAI/6NPSC/2025/0005</span>
              </div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-neutral-400">Events:</span>
                <span>8</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-400">Medals:</span>
                <span>🥇🥇🥇🥇🥇🥇</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={() => setModalOpen(true)} className="btn-outline flex-1 justify-center group-hover:bg-white/10">
              <Eye size={18} /> Preview
            </button>
            <button className="btn-gold flex-1 justify-center">
              <Download size={18} /> Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {modalOpen && (
        <div className="modal-overlay" onClick={() => setModalOpen(false)}>
          <div className="cert-preview-card" onClick={e => e.stopPropagation()}>
            {/* Very rough mockup of a cert */}
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-[var(--primary)] uppercase tracking-widest">Certificate of Merit</h2>
              <h3 className="text-lg font-bold mt-2">6th National Para Shooting Championship 2025</h3>
            </div>
            <p className="text-center font-serif text-lg leading-relaxed mb-6">
              This is to certify that<br/>
              <span className="text-2xl font-bold text-[var(--primary)] border-b border-black inline-block px-8 py-2 my-2">{SHOOTER_DATA.name}</span><br/>
              representing <span className="font-bold">{SHOOTER_DATA.state}</span> has participated in the championship<br/>
              and achieved the following results:
            </p>
            <table className="w-full text-center border-collapse border border-neutral-300 mb-8 font-serif">
              <thead>
                <tr className="bg-neutral-100 uppercase text-xs">
                  <th className="border border-neutral-300 p-2">Event</th>
                  <th className="border border-neutral-300 p-2">Score</th>
                  <th className="border border-neutral-300 p-2">Rank</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-neutral-300 p-2">P1 Final</td>
                  <td className="border border-neutral-300 p-2">240.5</td>
                  <td className="border border-neutral-300 p-2 font-bold">1st</td>
                </tr>
              </tbody>
            </table>
            <div className="flex justify-between items-end mt-16 pt-8 text-center text-sm font-bold uppercase border-t border-neutral-300">
              <div><div className="w-32 h-px bg-black mb-2"></div>President</div>
              <div><div className="w-32 h-px bg-black mb-2"></div>Secretary</div>
              <div><div className="w-32 h-px bg-black mb-2"></div>Coordinator</div>
            </div>
            
            <button onClick={() => setModalOpen(false)} className="absolute top-4 right-4 text-neutral-400 hover:text-black">
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const DocumentsView = () => {
  return (
    <div className="space-y-6 fade-in h-auto pb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">My Documents</h2>
        <button className="btn-gold"><Upload size={18} /> Batch Upload</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SHOOTER_DATA.documents.map(doc => (
          <div key={doc.id} className={`glass-card relative overflow-hidden ${
            doc.status === 'missing' ? 'border-amber-500/30 bg-amber-500/5' : 
            doc.status === 'rejected' ? 'border-red-500/30 bg-red-500/5' : ''
          }`}>
            <div className="flex justify-between items-start mb-3">
              <h3 className="font-bold pr-6">{doc.name}</h3>
              {doc.status === 'uploaded' && <CheckCircle size={20} className="text-green-400 flex-shrink-0" />}
              {doc.status === 'missing' && <AlertCircle size={20} className="text-amber-400 flex-shrink-0" />}
              {doc.status === 'rejected' && <AlertCircle size={20} className="text-red-400 flex-shrink-0" />}
            </div>
            
            {doc.status === 'uploaded' ? (
              <div className="text-sm text-neutral-400 mb-4 space-y-1">
                <p>File: <span className="text-neutral-300">{doc.file}</span></p>
                <p>Size: {doc.size} • Uploaded: {doc.date}</p>
              </div>
            ) : doc.status === 'rejected' ? (
              <div className="text-sm text-red-300 mb-4">
                <p>Rejected: {doc.reason}</p>
              </div>
            ) : (
              <div className="text-sm text-amber-300/80 mb-4">
                <p>Required document missing.</p>
              </div>
            )}
            
            <div className="flex gap-2">
              {doc.status === 'uploaded' ? (
                <>
                  <button className="btn-outline text-xs px-3 py-1 flex-1 justify-center"><Eye size={14} /> View</button>
                  <button className="btn-outline text-xs px-3 py-1 flex-1 justify-center"><Upload size={14} /> Replace</button>
                </>
              ) : (
                <button className="btn-gold text-xs px-3 py-1 w-full justify-center text-black font-bold">
                  <Upload size={14} /> Upload Now
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ─── MAIN APP CONTENT ─── */

export default function ShooterPortal() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const TABS = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'profile', label: 'My Profile', icon: User },
    { id: 'results', label: 'My Results', icon: Trophy },
    { id: 'certificates', label: 'My Certificates', icon: Award },
    { id: 'documents', label: 'Documents', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
  ]

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').substring(0, 2)
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <DashboardView changeTab={setActiveTab} />
      case 'profile': return <ProfileView />
      case 'results': return <ResultsView />
      case 'certificates': return <CertificatesView />
      case 'documents': return <DocumentsView />
      case 'settings': return <div className="p-8 text-center text-neutral-400 glass-card">Settings configuration available soon.</div>
      default: return <DashboardView changeTab={setActiveTab} />
    }
  }

  return (
    <div className="shooter-portal">
      {/* Sidebar */}
      <aside className="shooter-sidebar">
        <div className="shooter-sidebar-header">
          {/* Mock Logo */}
          <div className="w-8 h-8 rounded bg-white flex items-center justify-center p-0.5">
            <div className="w-full border-b-[3px] border-[#128807] text-[8px] leading-tight font-black text-[#003087] text-center">PCI</div>
          </div>
          <span className="font-bold text-lg tracking-wider">PSAI Portal</span>
        </div>
        
        <div className="shooter-avatar-container">
          <div className="shooter-avatar">
            {getInitials(SHOOTER_DATA.name)}
          </div>
          <h2 className="font-bold text-sm tracking-wide mb-1">{SHOOTER_DATA.name}</h2>
          <p className="text-xs text-neutral-400 mb-3">{SHOOTER_DATA.state}</p>
          <span className={`status-badge ${SHOOTER_DATA.status}`}>
            {SHOOTER_DATA.status === 'approved' ? '✅ Approved' : '⏳ Pending'}
          </span>
        </div>

        <nav className="shooter-nav">
          {TABS.map(tab => (
            <div 
              key={tab.id}
              className={`shooter-nav-item ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={20} />
              <span className="font-medium text-sm">{tab.label}</span>
            </div>
          ))}
        </nav>

        <div className="p-4 mt-auto">
          <button className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors w-full px-2 py-2">
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="shooter-main">
        <div className="max-w-6xl mx-auto w-full">
          {renderContent()}
        </div>
      </main>
    </div>
  )
}
