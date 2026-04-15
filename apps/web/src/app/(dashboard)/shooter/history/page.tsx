'use client'

import { useAuth } from '@/context/AuthContext'
import { User, Shield, Hash, Activity, Trophy, Star, Medal, Target } from 'lucide-react'

type CompetitionRecord = {
  competition: string
  eventName: string
  compCode: string
  se: string
  scoreAchieved: number | string
  mixedEventPart2: string
  scores: string
  semifinal: string
  medalMatch: string
  teamScore: string
  rank: number | string
  remarksInFinals: string
  mqsSegment: string
}

const COMPETITION_HISTORY: CompetitionRecord[] = [
  {
    competition: '68th National Championship',
    eventName: '10m Air Rifle SH1',
    compCode: 'NSCC-2025-PR-01',
    se: 'SH1',
    scoreAchieved: 628.4,
    mixedEventPart2: '—',
    scores: '104.2 / 103.8 / 105.1 / 104.9 / 105.3 / 105.1',
    semifinal: '628.4',
    medalMatch: 'Gold',
    teamScore: '—',
    rank: 1,
    remarksInFinals: 'WR Attempt',
    mqsSegment: 'MET',
  },
  {
    competition: '67th National Championship',
    eventName: '10m Air Rifle SH1',
    compCode: 'NSCC-2024-PR-01',
    se: 'SH1',
    scoreAchieved: 621.7,
    mixedEventPart2: '—',
    scores: '103.1 / 104.2 / 103.5 / 104.0 / 103.8 / 103.1',
    semifinal: '621.7',
    medalMatch: 'Silver',
    teamScore: '—',
    rank: 2,
    remarksInFinals: '—',
    mqsSegment: 'MET',
  },
  {
    competition: 'WSPS World Cup 2024',
    eventName: '10m Air Rifle SH1',
    compCode: 'WSPS-WC-2024-01',
    se: 'SH1',
    scoreAchieved: 619.2,
    mixedEventPart2: '—',
    scores: '103.0 / 103.4 / 102.9 / 103.7 / 103.3 / 102.9',
    semifinal: '619.2',
    medalMatch: 'Bronze',
    teamScore: '1847.3',
    rank: 3,
    remarksInFinals: '—',
    mqsSegment: 'MET',
  },
  {
    competition: 'Para Asian Games 2023',
    eventName: '10m Air Rifle SH1 Mixed',
    compCode: 'PAG-2023-AR-M',
    se: 'SH1',
    scoreAchieved: 614.8,
    mixedEventPart2: '308.2',
    scores: '102.4 / 102.8 / 103.2 / 102.1 / 102.8 / 101.5',
    semifinal: '614.8',
    medalMatch: '4th',
    teamScore: '—',
    rank: 4,
    remarksInFinals: 'Close finish',
    mqsSegment: 'MET',
  },
]

const personalData = [
  { label: 'PCI ID', value: 'PCI-2021-AR-0042' },
  { label: 'Date of Birth', value: '15 Mar 1995' },
  { label: 'Gender', value: 'Male' },
  { label: 'Nationality', value: 'Indian' },
  { label: 'State', value: 'Maharashtra' },
  { label: 'Disability Class', value: 'SH1' },
  { label: 'Discipline', value: '10m Air Rifle' },
  { label: 'Coach', value: 'TBD' },
  { label: 'Member Since', value: '2021' },
]

const medalStyle: Record<string, string> = {
  Gold: 'text-amber-700 bg-amber-50 border-amber-200',
  Silver: 'text-slate-600 bg-slate-100 border-slate-200',
  Bronze: 'text-orange-700 bg-orange-50 border-orange-200',
}

const AthleteHistoryPage = () => {
  const { user } = useAuth()
  const fullName = user ? `${user.firstName} ${user.lastName}` : 'Athlete'

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 h-16 flex items-center sticky top-0 z-30">
        <div>
          <h1 className="text-base font-bold text-[#0F172A]">Athletes History</h1>
          <p className="text-xs text-slate-500">Competition record and personal data</p>
        </div>
      </header>

      <div className="p-6 max-w-7xl mx-auto space-y-6">

        {/* Profile + Personal Data row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Profile card */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {/* Card header */}
            <div className="h-20 bg-[#0F172A] relative">
              <div className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #0369A1, transparent 70%)' }} />
              <div className="absolute inset-0 opacity-5"
                style={{ backgroundImage: 'repeating-linear-gradient(45deg, #C8A415 0, #C8A415 1px, transparent 0, transparent 50%)', backgroundSize: '12px 12px' }} />
            </div>

            <div className="flex flex-col items-center -mt-10 px-5 pb-5">
              <div className="w-20 h-20 rounded-full border-4 border-white bg-slate-100 flex items-center justify-center shadow-md overflow-hidden">
                {user?.avatarUrl
                  ? <img src={user.avatarUrl} alt={fullName} className="w-full h-full object-cover" />
                  : <User className="w-9 h-9 text-slate-400" />}
              </div>

              <h2 className="mt-2 text-base font-bold text-[#0F172A] text-center">{fullName}</h2>
              <p className="text-xs text-slate-500 text-center">Para Shooting Athlete · SH1</p>

              <div className="mt-2 flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-[11px] font-semibold px-3 py-1 rounded-full">
                <Shield className="w-3 h-3" />
                {user?.isVerified ? 'Verified Athlete' : 'Pending Verification'}
              </div>

              {/* Medal counts */}
              <div className="mt-4 w-full grid grid-cols-3 gap-2">
                {[
                  { label: 'Gold', value: '3', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-100' },
                  { label: 'Silver', value: '2', color: 'text-slate-500', bg: 'bg-slate-50 border-slate-200' },
                  { label: 'Bronze', value: '2', color: 'text-orange-600', bg: 'bg-orange-50 border-orange-100' },
                ].map(m => (
                  <div key={m.label} className={`rounded-lg border py-2 text-center ${m.bg}`}>
                    <p className={`text-lg font-bold ${m.color}`}>{m.value}</p>
                    <p className="text-[10px] text-slate-400">{m.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Personal Data */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <Hash className="w-4 h-4 text-[#0369A1]" />
              Personal Data
            </h3>
            <div className="space-y-2.5">
              {personalData.map(item => (
                <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-slate-50 last:border-0">
                  <span className="text-xs text-slate-400 font-medium">{item.label}</span>
                  <span className="text-xs text-[#0F172A] font-semibold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Career milestones */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#0369A1]" />
              Career Milestones
            </h3>
            <div className="relative border-l-2 border-slate-100 ml-1 space-y-4 pb-1">
              {[
                { year: '2024', title: 'World Record Attempt', desc: 'Near-WR at Paris Paralympics qualification.', dot: 'bg-amber-400' },
                { year: '2023', title: 'Para Asian Games', desc: 'Represented India, finished 4th.', dot: 'bg-[#0369A1]' },
                { year: '2021', title: 'International Debut', desc: 'WSPS World Cup debut.', dot: 'bg-emerald-500' },
                { year: '2020', title: 'National Champion', desc: 'First Gold at National Championship.', dot: 'bg-violet-500' },
              ].map((item, i) => (
                <div key={i} className="relative pl-6">
                  <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ${item.dot} ring-2 ring-white`} />
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0 mt-0.5">{item.year}</span>
                    <div>
                      <p className="text-xs font-bold text-[#0F172A]">{item.title}</p>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Competition History Table */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <h3 className="text-sm font-bold text-[#0F172A] flex items-center gap-2">
              <Trophy className="w-4 h-4 text-[#0369A1]" />
              Competition History
            </h3>
            <span className="text-xs bg-slate-100 text-slate-500 px-2.5 py-1 rounded-full font-semibold">
              {COMPETITION_HISTORY.length} records
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[1100px]">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {[
                    'Competition', 'Event Name', 'Comp Code', 'SE',
                    'Score Achieved', 'Mixed Event Part 2', 'Scores',
                    'Semifinal', 'Medal Match', 'Team Score',
                    'Rank', 'Remarks In Finals', 'MQS Segment'
                  ].map(col => (
                    <th key={col} className="px-4 py-3 text-left text-[11px] font-semibold text-slate-500 uppercase tracking-wider whitespace-nowrap">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {COMPETITION_HISTORY.map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="text-xs font-semibold text-[#0F172A] max-w-[160px]">{row.competition}</p>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-600 whitespace-nowrap">{row.eventName}</td>
                    <td className="px-4 py-3.5">
                      <span className="text-[11px] font-mono text-[#0369A1] bg-blue-50 px-2 py-0.5 rounded">
                        {row.compCode}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                        {row.se}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className="text-sm font-bold text-[#0369A1]">{row.scoreAchieved}</span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-400 text-center">{row.mixedEventPart2}</td>
                    <td className="px-4 py-3.5 text-[11px] text-slate-500 font-mono max-w-[180px] truncate" title={row.scores}>
                      {row.scores}
                    </td>
                    <td className="px-4 py-3.5 text-xs font-semibold text-slate-600">{row.semifinal}</td>
                    <td className="px-4 py-3.5">
                      {medalStyle[row.medalMatch] ? (
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${medalStyle[row.medalMatch]}`}>
                          {row.medalMatch}
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">{row.medalMatch}</span>
                      )}
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">{row.teamScore}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-sm font-bold ${row.rank === 1 ? 'text-amber-600' : row.rank === 2 ? 'text-slate-500' : row.rank === 3 ? 'text-orange-600' : 'text-slate-400'}`}>
                        #{row.rank}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-400">{row.remarksInFinals}</td>
                    <td className="px-4 py-3.5">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${
                        row.mqsSegment === 'MET'
                          ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                          : 'text-red-600 bg-red-50 border-red-200'
                      }`}>
                        {row.mqsSegment}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {COMPETITION_HISTORY.length === 0 && (
            <div className="py-14 text-center">
              <Trophy className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-slate-400 text-sm">No competition records found.</p>
            </div>
          )}
        </div>

      </div>
    </div>
  )
}

export default AthleteHistoryPage
