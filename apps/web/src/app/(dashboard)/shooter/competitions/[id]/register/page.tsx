'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ArrowLeft, CheckCircle, User, Target, CreditCard,
  ChevronRight, ChevronLeft, Loader2, AlertCircle,
  Upload, Calendar, MapPin, Trophy, Check
} from 'lucide-react'

interface CompEvent { id: number; event_no: string; event_name: string; fee: number }
interface Competition {
  id: number; code: string; name: string;
  duration_start: string; duration_end: string;
  place: string; payment_mode: string; is_active: boolean;
  events: CompEvent[]
}
interface ShooterProfile {
  id: number; first_name: string; last_name: string;
  psi_id: string; state: string; disability_category: string
}

const fmt = (d: string) =>
  new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' })

const STEPS = [
  { label: 'Review Details', icon: User },
  { label: 'Select Events', icon: Target },
  { label: 'Payment', icon: CreditCard },
]

function StepIndicator({ step }: { step: number }) {
  return (
    <div className="flex items-center gap-0 mb-8">
      {STEPS.map((s, i) => {
        const done = i < step
        const active = i === step
        return (
          <React.Fragment key={i}>
            <div className="flex flex-col items-center gap-1.5">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all text-sm font-bold ${
                done
                  ? 'bg-[#0F172A] border-[#0F172A] text-white'
                  : active
                  ? 'bg-white border-[#0369A1] text-[#0369A1]'
                  : 'bg-white border-slate-200 text-slate-300'
              }`}>
                {done ? <Check className="w-4 h-4" /> : <s.icon className="w-4 h-4" />}
              </div>
              <span className={`text-[11px] font-semibold whitespace-nowrap ${
                active ? 'text-[#0369A1]' : done ? 'text-[#0F172A]' : 'text-slate-300'
              }`}>{s.label}</span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`h-0.5 flex-1 mx-2 mb-5 transition-colors ${i < step ? 'bg-[#0F172A]' : 'bg-slate-200'}`} />
            )}
          </React.Fragment>
        )
      })}
    </div>
  )
}

export default function RegisterPage() {
  const params = useParams()
  const router = useRouter()
  const competitionId = Number(params.id)

  const [competition, setCompetition] = useState<Competition | null>(null)
  const [profile, setProfile] = useState<ShooterProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [step, setStep] = useState(0)
  const [selectedEventIds, setSelectedEventIds] = useState<number[]>([])
  const [paymentMethod, setPaymentMethod] = useState<'offline' | 'rayzorpay'>('offline')
  const [proofFile, setProofFile] = useState<File | null>(null)
  const [transactionId, setTransactionId] = useState('')
  const [termsAccepted, setTermsAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [successReg, setSuccessReg] = useState<{ id: number; competition_no: string | null } | null>(null)

  const fetchData = useCallback(async () => {
    try {
      const [compRes, profileRes] = await Promise.all([
        fetch(`/api/v1/competitions/${competitionId}`),
        fetch(`/api/v1/shooters/me`),
      ])
      if (!compRes.ok) throw new Error('Competition not found or is not active')
      const compData = await compRes.json()
      setCompetition(compData.data || compData)
      if (profileRes.ok) {
        const pd = await profileRes.json()
        setProfile(pd.data || pd)
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [competitionId])

  useEffect(() => { fetchData() }, [fetchData])

  const selectedEvents = competition?.events?.filter(e => selectedEventIds.includes(e.id)) ?? []
  const totalFee = selectedEvents.reduce((sum, e) => sum + Number(e.fee), 0)
  const showOffline = competition?.payment_mode === 'offline' || competition?.payment_mode === 'both'
  const showOnline = competition?.payment_mode === 'rayzorpay' || competition?.payment_mode === 'both'
  const toggleEvent = (id: number) =>
    setSelectedEventIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const handleSubmit = async () => {
    if (!termsAccepted) { alert('Please accept the terms and conditions.'); return }
    if (selectedEventIds.length === 0) { alert('Please select at least one event.'); return }
    setSubmitting(true)
    try {
      let proofUrl: string | undefined
      if (proofFile) {
        const fd = new FormData()
        fd.append('file', proofFile)
        // URL uses singular 'upload' to match @Controller('upload') in the API
        const upRes = await fetch('/api/v1/upload/payment-proof', { method: 'POST', body: fd })
        if (upRes.ok) {
          const upData = await upRes.json()
          proofUrl = upData.url || upData.data?.url
        }
      }
      // Map UI payment method values to backend DTO enum values:
      // 'offline' (RTGS/bank transfer + screenshot) → 'screenshot'
      // 'rayzorpay' (online payment gateway)        → 'gateway'
      const mappedPaymentMethod = paymentMethod === 'offline' ? 'screenshot' : 'gateway'
      const res = await fetch('/api/v1/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competition_id: competitionId,
          event_ids: selectedEventIds,
          payment_method: mappedPaymentMethod,
          transaction_id: transactionId || undefined,
          payment_proof_url: proofUrl,
          terms_accepted: termsAccepted,
        }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Registration failed')
      }
      const data = await res.json()
      setSuccessReg({ id: data.id || data.data?.id, competition_no: data.competition_no || data.data?.competition_no })
    } catch (e: any) {
      alert(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  // Loading
  if (loading) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 animate-spin text-[#0369A1]" />
        <p className="text-sm text-slate-500">Loading competition…</p>
      </div>
    </div>
  )

  // Error
  if (error || !competition) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="max-w-sm w-full bg-white rounded-xl border border-red-200 shadow-sm p-8 text-center">
        <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-6 h-6 text-red-500" />
        </div>
        <h2 className="text-base font-bold text-[#0F172A] mb-2">Unable to Load</h2>
        <p className="text-sm text-slate-500 mb-5">{error || 'Competition not found'}</p>
        <Link href="/shooter/competitions"
          className="inline-flex items-center gap-2 px-4 py-2 bg-[#0369A1] text-white rounded-lg text-sm font-semibold hover:bg-[#0284C7] transition cursor-pointer">
          <ArrowLeft className="w-4 h-4" /> Back to Competitions
        </Link>
      </div>
    </div>
  )

  // Success
  if (successReg) return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="bg-[#0F172A] px-8 py-10 text-center relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle at 50% 80%, #22C55E, transparent 60%)' }} />
          <div className="relative">
            <div className="w-14 h-14 bg-emerald-400/20 border border-emerald-400/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-7 h-7 text-emerald-400" />
            </div>
            <h2 className="text-2xl font-bold text-white">Registration Submitted!</h2>
            <p className="text-slate-400 text-sm mt-1">Your application is under review.</p>
          </div>
        </div>
        <div className="p-8 text-center space-y-4">
          <div className="bg-slate-50 rounded-lg p-4 border border-slate-100">
            <p className="text-xs text-slate-400 mb-1">Registration ID</p>
            <p className="text-2xl font-mono font-bold text-[#0F172A]">#{successReg.id}</p>
          </div>
          {successReg.competition_no && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-xs text-slate-400 mb-1">Competition Number</p>
              <p className="text-lg font-mono font-bold text-[#0369A1]">{successReg.competition_no}</p>
            </div>
          )}
          <p className="text-sm text-slate-400">You will be notified once your registration and payment are verified.</p>
          <Link href="/shooter/competitions"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0369A1] text-white rounded-lg text-sm font-semibold hover:bg-[#0284C7] transition cursor-pointer">
            Back to Competitions
          </Link>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-[#F8FAFC]">

      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 h-16 flex items-center sticky top-0 z-30">
        <Link href="/shooter/competitions"
          className="flex items-center gap-2 text-sm text-slate-500 hover:text-[#0F172A] transition-colors cursor-pointer mr-4">
          <ArrowLeft className="w-4 h-4" /> Competitions
        </Link>
        <div className="h-4 w-px bg-slate-200 mr-4" />
        <div>
          <h1 className="text-base font-bold text-[#0F172A]">Competition Registration</h1>
        </div>
      </header>

      <div className="p-6 max-w-2xl mx-auto">

        {/* Competition banner */}
        <div className="bg-[#0F172A] rounded-xl p-5 mb-6 relative overflow-hidden">
          <div className="absolute inset-0 opacity-5"
            style={{ backgroundImage: 'radial-gradient(circle at 80% 50%, #0369A1, transparent 60%)' }} />
          <div className="relative flex items-start gap-4">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
              <Trophy className="w-5 h-5 text-[#C8A415]" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-500 tracking-widest uppercase mb-0.5">{competition.code}</p>
              <h2 className="text-lg font-bold text-white leading-snug">{competition.name}</h2>
              <div className="flex flex-wrap gap-4 mt-2">
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <Calendar className="w-3.5 h-3.5" />
                  {fmt(competition.duration_start)} – {fmt(competition.duration_end)}
                </span>
                <span className="flex items-center gap-1.5 text-xs text-slate-400">
                  <MapPin className="w-3.5 h-3.5" />
                  {competition.place}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Step indicator */}
        <StepIndicator step={step} />

        {/* ── Step 0: Review Details ── */}
        {step === 0 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0F172A]">Review Your Details</h3>
              <p className="text-xs text-slate-400 mt-0.5">This information will be used for your registration.</p>
            </div>
            <div className="p-6">
              {profile ? (
                <div className="space-y-0">
                  {[
                    { label: 'Full Name', value: `${profile.first_name} ${profile.last_name}` },
                    { label: 'PSI ID', value: profile.psi_id || '—' },
                    { label: 'State', value: profile.state || '—' },
                    { label: 'Disability Category', value: profile.disability_category || '—' },
                  ].map(row => (
                    <div key={row.label} className="flex justify-between items-center py-3 border-b border-slate-100 last:border-0">
                      <span className="text-sm text-slate-400">{row.label}</span>
                      <span className="text-sm font-semibold text-[#0F172A]">{row.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-amber-700">Profile not found. Please complete your profile before registering.</p>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center">
              <Link href="/shooter/profile" className="text-xs text-[#0369A1] font-semibold hover:underline cursor-pointer">
                Edit Profile →
              </Link>
              <button
                disabled={!profile}
                onClick={() => setStep(1)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0369A1] text-white rounded-lg font-semibold text-sm hover:bg-[#0284C7] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Next: Select Events <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 1: Events ── */}
        {step === 1 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0F172A]">Select Events</h3>
              <p className="text-xs text-slate-400 mt-0.5">Choose the events you wish to participate in.</p>
            </div>
            <div className="p-6 space-y-3">
              {competition.events && competition.events.length > 0 ? (
                competition.events.map(ev => {
                  const checked = selectedEventIds.includes(ev.id)
                  return (
                    <label
                      key={ev.id}
                      className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        checked
                          ? 'border-[#0369A1] bg-blue-50'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className={`w-5 h-5 rounded flex items-center justify-center border-2 flex-shrink-0 transition-all ${
                        checked ? 'bg-[#0369A1] border-[#0369A1]' : 'border-slate-300'
                      }`}>
                        {checked && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleEvent(ev.id)}
                        className="sr-only"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono font-bold text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded">{ev.event_no}</span>
                          <span className={`text-sm font-semibold ${checked ? 'text-[#0F172A]' : 'text-slate-700'}`}>{ev.event_name}</span>
                        </div>
                      </div>
                      <span className={`text-sm font-bold flex-shrink-0 ${checked ? 'text-[#0369A1]' : 'text-slate-500'}`}>₹{ev.fee}</span>
                    </label>
                  )
                })
              ) : (
                <div className="py-8 text-center text-slate-400 text-sm bg-slate-50 rounded-lg">
                  No events have been configured for this competition yet.
                </div>
              )}

              {selectedEventIds.length > 0 && (
                <div className="flex items-center justify-between p-4 bg-[#0F172A] rounded-lg mt-2">
                  <span className="text-sm text-slate-300">
                    {selectedEventIds.length} event{selectedEventIds.length > 1 ? 's' : ''} selected
                  </span>
                  <span className="text-xl font-bold text-white">₹{totalFee}</span>
                </div>
              )}
            </div>
            <div className="px-6 py-4 border-t border-slate-100 flex justify-between">
              <button onClick={() => setStep(0)}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition cursor-pointer">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                disabled={selectedEventIds.length === 0}
                onClick={() => setStep(2)}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#0369A1] text-white rounded-lg font-semibold text-sm hover:bg-[#0284C7] disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                Next: Payment <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Payment ── */}
        {step === 2 && (
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-sm font-bold text-[#0F172A]">Payment Details</h3>
            </div>
            <div className="p-6 space-y-5">

              {/* Order summary */}
              <div>
                <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Order Summary</p>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  {selectedEvents.map(ev => (
                    <div key={ev.id} className="flex justify-between items-center px-4 py-3 border-b border-slate-100 last:border-0">
                      <span className="text-sm text-slate-600">{ev.event_name}</span>
                      <span className="text-sm font-semibold text-[#0F172A]">₹{ev.fee}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center px-4 py-3 bg-slate-50">
                    <span className="text-sm font-bold text-[#0F172A]">Total Amount</span>
                    <span className="text-lg font-bold text-[#0369A1]">₹{totalFee}</span>
                  </div>
                </div>
              </div>

              {/* Payment method */}
              {(showOffline || showOnline) && (
                <div>
                  <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Payment Method</p>
                  <div className="flex flex-wrap gap-3">
                    {showOffline && (
                      <label className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all flex-1 min-w-[160px] ${
                        paymentMethod === 'offline' ? 'border-[#0369A1] bg-blue-50' : 'border-slate-200'
                      }`}>
                        <input type="radio" name="payment_method" value="offline"
                          checked={paymentMethod === 'offline'} onChange={() => setPaymentMethod('offline')}
                          className="text-[#0369A1] w-4 h-4" />
                        <span className="text-sm font-semibold text-slate-700">RTGS / Bank Transfer</span>
                      </label>
                    )}
                    {showOnline && (
                      <label className={`flex items-center gap-3 px-4 py-3 rounded-lg border-2 cursor-pointer transition-all flex-1 min-w-[160px] ${
                        paymentMethod === 'rayzorpay' ? 'border-[#0369A1] bg-blue-50' : 'border-slate-200'
                      }`}>
                        <input type="radio" name="payment_method" value="rayzorpay"
                          checked={paymentMethod === 'rayzorpay'} onChange={() => setPaymentMethod('rayzorpay')}
                          className="text-[#0369A1] w-4 h-4" />
                        <span className="text-sm font-semibold text-slate-700">Online (Razorpay)</span>
                      </label>
                    )}
                  </div>
                </div>
              )}

              {/* Offline fields */}
              {paymentMethod === 'offline' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Transaction / UTR ID <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <input
                      type="text"
                      value={transactionId}
                      onChange={e => setTransactionId(e.target.value)}
                      placeholder="e.g. UTR123456789012"
                      className="w-full px-4 py-2.5 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-[#0369A1]/20 focus:border-[#0369A1] outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                      Payment Proof <span className="text-slate-400 font-normal">(optional)</span>
                    </label>
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-slate-200 rounded-lg cursor-pointer hover:border-[#0369A1] hover:bg-blue-50/30 transition-colors">
                      <Upload className="w-5 h-5 text-slate-400 mb-1" />
                      <span className="text-xs text-slate-500">{proofFile ? proofFile.name : 'Click to upload screenshot'}</span>
                      <span className="text-[10px] text-slate-400 mt-0.5">PNG, JPG, PDF — max 5MB</span>
                      <input type="file" accept="image/*,.pdf" className="hidden"
                        onChange={e => setProofFile(e.target.files?.[0] ?? null)} />
                    </label>
                  </div>
                </div>
              )}

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer p-4 bg-slate-50 rounded-lg border border-slate-200">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all ${
                  termsAccepted ? 'bg-[#0369A1] border-[#0369A1]' : 'border-slate-300'
                }`}>
                  {termsAccepted && <Check className="w-3 h-3 text-white" />}
                </div>
                <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="sr-only" />
                <span className="text-xs text-slate-600 leading-relaxed">
                  I confirm that the information provided is accurate and I accept the terms and conditions for participating in this competition.
                </span>
              </label>
            </div>

            <div className="px-6 py-4 border-t border-slate-100 flex justify-between items-center">
              <button onClick={() => setStep(1)}
                className="flex items-center gap-1.5 px-4 py-2.5 border border-slate-200 text-slate-600 rounded-lg text-sm font-semibold hover:bg-slate-50 transition cursor-pointer">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting || !termsAccepted}
                className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 text-white rounded-lg font-semibold text-sm hover:bg-emerald-700 disabled:opacity-40 disabled:cursor-not-allowed transition cursor-pointer"
              >
                {submitting
                  ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting…</>
                  : <><CheckCircle className="w-4 h-4" /> Submit Registration</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
