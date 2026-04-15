'use client'

import React, { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, Target, CreditCard, Trophy, ArrowRight, RefreshCw } from 'lucide-react'

interface CompEvent { id: number; event_no: string; event_name: string; fee: number }
interface Competition {
  id: number; code: string; name: string;
  duration_start: string; duration_end: string;
  place: string; payment_mode: string; is_active: boolean;
  events: CompEvent[]
}

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

const payLabel: Record<string, string> = {
  offline: 'RTGS / Bank Transfer',
  rayzorpay: 'Online — Razorpay',
  both: 'Online + Bank Transfer',
}

const SkeletonCard = () => (
  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
    <div className="h-28 bg-slate-100" />
    <div className="p-5 space-y-3">
      <div className="h-3 w-1/4 bg-slate-100 rounded" />
      <div className="h-4 w-3/4 bg-slate-100 rounded" />
      <div className="h-3 w-1/2 bg-slate-100 rounded" />
      <div className="h-3 w-2/5 bg-slate-100 rounded" />
      <div className="h-10 bg-slate-100 rounded-lg mt-4" />
    </div>
  </div>
)

export default function ShooterCompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    setError(''); setLoading(true)
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
      const res = await fetch(`${API_URL}/competitions`, { credentials: 'include' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const data = await res.json()
      setCompetitions(data.data || data)
    } catch {
      setError('Could not load competitions. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { load() }, [load])

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 h-16 flex items-center sticky top-0 z-30">
        <div>
          <h1 className="text-base font-bold text-[#0F172A]">Open Competitions</h1>
          <p className="text-xs text-slate-500">Browse active competitions and register for events</p>
        </div>
      </header>

      <div className="p-6 max-w-6xl mx-auto">

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {[1, 2, 3, 4].map(i => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="max-w-md mx-auto mt-20 text-center">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-6 h-6 text-red-400" />
            </div>
            <h2 className="text-base font-bold text-[#0F172A] mb-1">Failed to load</h2>
            <p className="text-sm text-slate-500 mb-5">{error}</p>
            <button
              onClick={load}
              className="inline-flex items-center gap-2 px-4 py-2 bg-[#0369A1] text-white rounded-lg text-sm font-semibold hover:bg-[#0284C7] transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && competitions.length === 0 && (
          <div className="max-w-md mx-auto mt-20 text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trophy className="w-7 h-7 text-slate-300" />
            </div>
            <h2 className="text-base font-bold text-[#0F172A] mb-1">No active competitions</h2>
            <p className="text-sm text-slate-400">Competitions will appear here once they open for registration.</p>
          </div>
        )}

        {/* Cards grid */}
        {!loading && !error && competitions.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {competitions.map(comp => (
              <div
                key={comp.id}
                className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 overflow-hidden flex flex-col"
              >
                {/* Card header */}
                <div className="bg-[#0F172A] px-6 py-5 relative overflow-hidden">
                  <div className="absolute right-0 top-0 bottom-0 w-32 opacity-5"
                    style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #0369A1, transparent 70%)' }} />
                  <div className="relative flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-mono text-slate-500 tracking-widest uppercase">{comp.code}</span>
                      <h2 className="text-lg font-bold text-white leading-snug mt-0.5 pr-2">{comp.name}</h2>
                    </div>
                    <span className="flex-shrink-0 bg-emerald-400/20 text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-400/30 mt-0.5">
                      OPEN
                    </span>
                  </div>
                </div>

                {/* Card body */}
                <div className="p-5 flex-1 flex flex-col gap-4">

                  {/* Meta info */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Calendar className="w-3.5 h-3.5 text-[#0369A1]" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Dates</p>
                        <p className="text-xs font-semibold text-[#0F172A] leading-snug mt-0.5">
                          {fmt(comp.duration_start)}<br />to {fmt(comp.duration_end)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-[#0369A1]" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Venue</p>
                        <p className="text-xs font-semibold text-[#0F172A] mt-0.5">{comp.place}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <CreditCard className="w-3.5 h-3.5 text-[#0369A1]" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Payment</p>
                        <p className="text-xs font-semibold text-[#0F172A] mt-0.5">{payLabel[comp.payment_mode] || comp.payment_mode}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Target className="w-3.5 h-3.5 text-[#0369A1]" />
                      </div>
                      <div>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Events</p>
                        <p className="text-xs font-semibold text-[#0F172A] mt-0.5">{comp.events?.length || 0} available</p>
                      </div>
                    </div>
                  </div>

                  {/* Events list */}
                  {comp.events && comp.events.length > 0 && (
                    <div>
                      <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Available Events</p>
                      <div className="flex flex-wrap gap-1.5">
                        {comp.events.map(ev => (
                          <span
                            key={ev.id}
                            className="inline-flex items-center gap-1 text-[11px] bg-slate-50 text-slate-600 border border-slate-200 px-2.5 py-1 rounded-full font-medium"
                          >
                            {ev.event_name}
                            <span className="text-[#0369A1] font-semibold">· ₹{ev.fee}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA */}
                  <div className="mt-auto pt-2">
                    <Link
                      href={`/shooter/competitions/${comp.id}/register`}
                      className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#0369A1] text-white rounded-lg font-semibold text-sm hover:bg-[#0284C7] transition-colors cursor-pointer"
                    >
                      Register Now <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
