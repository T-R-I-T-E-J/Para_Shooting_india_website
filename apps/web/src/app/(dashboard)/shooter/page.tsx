'use client'

import Link from 'next/link'
import {
  Trophy, User, Award, History, Target,
  TrendingUp, Shield, AlertCircle, Medal,
  ChevronRight, Bell, Calendar, Activity,
  FileText, Star
} from 'lucide-react'
import { useAuth } from '@/context/AuthContext'

const ShooterDashboardPage = () => {
  const { user } = useAuth()
  const profileCompletion = 85

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Top bar */}
      <header className="bg-white border-b border-slate-200 px-6 h-16 flex items-center justify-between sticky top-0 z-30">
        <div>
          <h1 className="text-base font-bold text-[#0F172A]">Athlete Dashboard</h1>
          <p className="text-xs text-slate-500">Welcome back, <span className="text-[#0369A1] font-semibold">{user?.firstName || 'Athlete'}</span></p>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer" aria-label="Notifications">
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full" />
          </button>
          <div className="w-8 h-8 rounded-full bg-[#0369A1] flex items-center justify-center text-white text-xs font-bold">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto space-y-6">

        {/* Welcome banner */}
        <div className="bg-[#0F172A] rounded-xl overflow-hidden relative">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #0369A1 0%, transparent 60%)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-64 opacity-5"
            style={{ backgroundImage: 'repeating-linear-gradient(45deg, #C8A415 0, #C8A415 1px, transparent 0, transparent 50%)', backgroundSize: '16px 16px' }} />
          <div className="relative p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-400 text-xs font-semibold uppercase tracking-widest">Season 2025 Active</span>
              </div>
              <h2 className="text-2xl font-bold text-white mb-1">
                {user?.firstName || 'Athlete'} {user?.lastName || ''}
              </h2>
              <p className="text-slate-400 text-sm">10m Air Rifle SH1 · Maharashtra</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">Nat. Rank</p>
                <p className="text-xl font-bold text-[#C8A415]">#02</p>
              </div>
              <div className="text-center px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">MQS</p>
                <p className="text-xl font-bold text-emerald-400">MET</p>
              </div>
              <div className="text-center px-4 py-2 bg-white/5 rounded-lg border border-white/10">
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">PCI ID</p>
                <p className="text-sm font-bold text-white">PCI-2021</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Competitions', value: '14', sub: 'Career total', icon: Trophy, color: 'text-[#0369A1]', bg: 'bg-[#0369A1]/8', border: 'border-[#0369A1]/15' },
            { label: 'Gold Medals', value: '3', sub: '2 Silver · 2 Bronze', icon: Medal, color: 'text-[#C8A415]', bg: 'bg-[#C8A415]/8', border: 'border-[#C8A415]/15' },
            { label: 'Best Score', value: '628.4', sub: '10m Air Rifle SH1', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
            { label: 'Profile', value: `${profileCompletion}%`, sub: 'Complete', icon: User, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100' },
          ].map(stat => (
            <div key={stat.label} className={`bg-white rounded-xl border ${stat.border} p-4 flex items-start gap-3 shadow-sm`}>
              <div className={`w-9 h-9 rounded-lg ${stat.bg} flex items-center justify-center flex-shrink-0`}>
                <stat.icon className={`w-4 h-4 ${stat.color}`} />
              </div>
              <div>
                <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
                <p className="text-xs font-semibold text-slate-700">{stat.label}</p>
                <p className="text-[11px] text-slate-400">{stat.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main column */}
          <div className="lg:col-span-2 space-y-5">

            {/* Upcoming competitions */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-[#0369A1]" />
                  Upcoming Competitions
                </h3>
                <Link href="/shooter/competitions" className="text-xs text-[#0369A1] font-semibold hover:underline cursor-pointer">
                  View all →
                </Link>
              </div>
              <div className="divide-y divide-slate-100">
                {[
                  { title: '68th National Championship — Para Rifle', status: 'Registration Open', statusColor: 'text-emerald-600 bg-emerald-50', date: 'Closes in 4 days' },
                  { title: '68th National Championship — Para Pistol', status: 'Upcoming', statusColor: 'text-[#0369A1] bg-blue-50', date: 'Jan 08, 2026' },
                ].map((ev, i) => (
                  <Link key={i} href="/shooter/competitions" className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50 transition-colors group cursor-pointer">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0 group-hover:bg-[#0369A1]/10 transition-colors">
                      <Calendar className="w-4 h-4 text-slate-400 group-hover:text-[#0369A1]" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#0F172A] truncate">{ev.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{ev.date}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${ev.statusColor}`}>{ev.status}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#0369A1]" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Quick access grid */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#0369A1]" />
                  Quick Access
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y divide-slate-100">
                {[
                  { label: 'My Profile', sub: 'View & edit', icon: User, href: '/shooter/profile', color: 'text-[#0369A1]', bg: 'bg-blue-50' },
                  { label: 'Certificates', sub: 'Download', icon: Award, href: '/shooter/certificates', color: 'text-amber-600', bg: 'bg-amber-50' },
                  { label: 'Athlete History', sub: 'Competition record', icon: History, href: '/shooter/history', color: 'text-violet-600', bg: 'bg-violet-50' },
                  { label: 'ID Card', sub: 'Digital card', icon: Shield, href: '/shooter/profile/id-card', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                ].map((item) => (
                  <Link key={item.label} href={item.href} className="flex flex-col items-center justify-center gap-2 p-5 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center group-hover:scale-105 transition-transform`}>
                      <item.icon className={`w-5 h-5 ${item.color}`} />
                    </div>
                    <div className="text-center">
                      <p className="text-xs font-bold text-[#0F172A]">{item.label}</p>
                      <p className="text-[10px] text-slate-400">{item.sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Recent results table */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
                <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-[#0369A1]" />
                  Recent Results
                </h3>
                <Link href="/shooter/history" className="text-xs text-[#0369A1] font-semibold hover:underline cursor-pointer">
                  Full history →
                </Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-100">
                      <th className="text-left px-5 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Competition</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Score</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Rank</th>
                      <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">MQS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { comp: '68th National · Para Rifle', score: '628.4', rank: '#1', mqs: true },
                      { comp: '67th National · Para Rifle', score: '621.7', rank: '#2', mqs: true },
                      { comp: 'WSPS World Cup 2024', score: '619.2', rank: '#3', mqs: true },
                    ].map((r, i) => (
                      <tr key={i} className="hover:bg-slate-50 transition-colors">
                        <td className="px-5 py-3 text-xs font-medium text-[#0F172A]">{r.comp}</td>
                        <td className="px-4 py-3 text-xs font-bold text-[#0369A1]">{r.score}</td>
                        <td className="px-4 py-3 text-xs font-bold text-[#0F172A]">{r.rank}</td>
                        <td className="px-4 py-3">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${r.mqs ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
                            {r.mqs ? 'MET' : 'NOT MET'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Right sidebar */}
          <div className="space-y-5">

            {/* Profile completion */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h4 className="text-sm font-bold text-[#0F172A] mb-4">Profile Completion</h4>
              <div className="flex items-center gap-4 mb-3">
                <div className="relative w-16 h-16 flex-shrink-0">
                  <svg className="w-full h-full -rotate-90" viewBox="0 0 64 64">
                    <circle cx="32" cy="32" r="26" className="fill-none stroke-slate-100" strokeWidth="6" />
                    <circle cx="32" cy="32" r="26" className="fill-none" stroke="#0369A1"
                      strokeWidth="6" strokeLinecap="round"
                      strokeDasharray={`${(profileCompletion / 100) * 163} 163`} />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-sm font-bold text-[#0F172A]">{profileCompletion}%</span>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-slate-500">2 items remaining</p>
                  <Link href="/shooter/profile" className="text-xs text-[#0369A1] font-semibold mt-1 inline-block hover:underline cursor-pointer">
                    Complete profile →
                  </Link>
                </div>
              </div>
              <div className="space-y-2">
                {[
                  { label: 'Personal Info', done: true },
                  { label: 'Documents Uploaded', done: true },
                  { label: 'Medical Certificate', done: false },
                  { label: 'Photo Verified', done: false },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-2">
                    <div className={`w-3.5 h-3.5 rounded-full flex items-center justify-center flex-shrink-0 ${item.done ? 'bg-emerald-500' : 'bg-slate-200'}`}>
                      {item.done && (
                        <svg className="w-2 h-2 text-white" fill="none" viewBox="0 0 8 8">
                          <path d="M1.5 4l1.5 1.5L6.5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      )}
                    </div>
                    <span className={`text-xs ${item.done ? 'text-slate-500 line-through' : 'text-[#0F172A] font-medium'}`}>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
              <h4 className="text-sm font-bold text-[#0F172A] mb-4 flex items-center gap-2">
                <Star className="w-4 h-4 text-[#C8A415]" />
                Achievements
              </h4>
              <div className="space-y-3">
                {[
                  { label: 'Gold Medals', value: '3', color: 'text-[#C8A415]', bg: 'bg-amber-50 border-amber-100' },
                  { label: 'Silver Medals', value: '2', color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' },
                  { label: 'Bronze Medals', value: '2', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100' },
                  { label: 'National Appearances', value: '8', color: 'text-[#0369A1]', bg: 'bg-blue-50 border-blue-100' },
                ].map(a => (
                  <div key={a.label} className={`flex items-center justify-between px-3 py-2 rounded-lg border ${a.bg}`}>
                    <span className="text-xs text-slate-600">{a.label}</span>
                    <span className={`text-sm font-bold ${a.color}`}>{a.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Notice */}
            <div className="bg-amber-50 rounded-xl border border-amber-200 p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold text-amber-800">Notice Board</p>
                  <p className="text-[11px] text-amber-700 mt-1 leading-relaxed">
                    Firearms License renewal for 2026 is open. Submit documents by Nov 30.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default ShooterDashboardPage
