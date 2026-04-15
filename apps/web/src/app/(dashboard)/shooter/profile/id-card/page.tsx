'use client'

import { DashboardHeader } from '@/components/dashboard'
import { Download, Printer, Share2, Shield, User, RotateCcw, RotateCw } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'

import { useAuth } from '@/context/AuthContext'

const ShooterIDCardPage = () => {
  const { user } = useAuth()
  const [showBack, setShowBack] = useState(false)

  const shooter = {
    name: user ? `${user.firstName} ${user.lastName}`.toUpperCase() : 'LOADING...',
    id: user?.pciId || 'Not assigned',
    state: 'UNKNOWN',
    dob: 'Unknown',
    validUntil: 'Pending',
    event: 'Unknown',
    classification: 'Unknown',
    photoUrl: user?.avatarUrl || null,
    isProfileComplete: !!user?.isVerified
  }

  return (
    <>
      <DashboardHeader
        title="My Shooter ID Card"
        subtitle="Digital version of your PSAI institutional identity"
      />

      <div className="p-6 space-y-8">
        {/* Profile Incomplete Warning */}
        {!shooter.isProfileComplete && (
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-md flex items-start gap-3">
            <Shield className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 font-medium">Complete your profile to generate ID card</p>
              <p className="text-amber-700 text-sm mt-1">Your ID card will be fully valid once your profile is completed and verified.</p>
            </div>
          </div>
        )}

        {/* Flip Toggle */}
        <div className="flex justify-center gap-3">
          <button
            onClick={() => setShowBack(false)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              !showBack ? 'bg-navy text-white shadow-md' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
            }`}
          >
            <User className="w-4 h-4" />
            Front
          </button>
          <button
            onClick={() => setShowBack(true)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              showBack ? 'bg-navy text-white shadow-md' : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
            }`}
          >
            <RotateCw className="w-4 h-4" />
            Back
          </button>
        </div>

        {/* Card Display */}
        <div className="flex justify-center">
          {!showBack ? (
            /* ── FRONT SIDE ── */
            <div className="relative w-full max-w-md bg-gradient-to-br from-[#001A4D] to-[#003DA5] rounded-xl shadow-2xl overflow-hidden text-white aspect-[1.58/1]">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full -ml-32 -mb-32" />
              </div>
              {/* Tricolor stripe at bottom */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] flex">
                <div className="flex-1 bg-[#FF9933]" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-[#138808]" />
              </div>

              <div className="relative h-full p-6 flex flex-col justify-between">
                {/* Header */}
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white rounded p-1">
                      <Image src="/logo.png" alt="Logo" width={40} height={40} className="object-contain" />
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-xs leading-tight">PARA SHOOTING<br />INDIA — PSAI</h3>
                      <p className="text-[9px] opacity-75">Paralympic Committee of India</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[9px] font-bold bg-gold/80 text-[#001A4D] px-2 py-0.5 rounded">ATHLETE ID</span>
                    <p className="font-mono text-sm mt-1 tracking-wider">{shooter.id}</p>
                  </div>
                </div>

                {/* Body */}
                <div className="flex gap-5 items-center">
                  <div className="w-20 h-28 bg-white rounded-lg border-2 border-white/20 overflow-hidden flex-shrink-0 relative">
                    {shooter.photoUrl ? (
                      <Image src={shooter.photoUrl} alt="Athlete Photo" fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-neutral-200 flex flex-col items-center justify-center text-center p-2">
                        <User className="w-7 h-7 text-neutral-400 mb-1" />
                        <span className="text-[7px] text-neutral-500 leading-tight font-medium">Upload photo to complete ID</span>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <div>
                      <p className="text-[9px] opacity-70 uppercase font-semibold tracking-wider">Athlete Name</p>
                      <h4 className="font-heading font-bold text-base leading-tight">{shooter.name}</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1.5">
                      <div>
                        <p className="text-[9px] opacity-70 uppercase font-semibold tracking-wider">State</p>
                        <p className="text-xs font-bold">{shooter.state}</p>
                      </div>
                      <div>
                        <p className="text-[9px] opacity-70 uppercase font-semibold tracking-wider">Event</p>
                        <p className="text-xs font-bold">{shooter.event}</p>
                      </div>
                      <div>
                        <p className="text-[9px] opacity-70 uppercase font-semibold tracking-wider">DOB</p>
                        <p className="text-xs font-bold font-mono">{shooter.dob}</p>
                      </div>
                      <div>
                        <p className="text-[9px] opacity-70 uppercase font-semibold tracking-wider">Class</p>
                        <p className="text-xs font-bold">{shooter.classification}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex justify-between items-end border-t border-white/20 pt-3">
                  <div className="flex items-center gap-2">
                    <Shield className="w-3.5 h-3.5 text-gold" />
                    <span className="text-[9px] font-semibold tracking-wider">VERIFIED NATIONAL SHOOTER</span>
                  </div>
                  <div className="text-right">
                    <p className="text-[9px] opacity-70">VALID UNTIL</p>
                    <p className="text-xs font-bold font-mono">{shooter.validUntil}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            /* ── BACK SIDE ── */
            <div className="relative w-full max-w-md bg-gradient-to-br from-[#001A4D] to-[#003DA5] rounded-xl shadow-2xl overflow-hidden text-white aspect-[1.58/1]">
              {/* Subtle grid pattern */}
              <div
                className="absolute inset-0 opacity-[0.06] pointer-events-none"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
                  backgroundSize: '20px 20px',
                }}
              />
              {/* Tricolor stripe at top */}
              <div className="absolute top-0 left-0 right-0 h-[3px] flex">
                <div className="flex-1 bg-[#FF9933]" />
                <div className="flex-1 bg-white" />
                <div className="flex-1 bg-[#138808]" />
              </div>

              <div className="relative h-full p-5 flex gap-5">
                {/* Left — QR + ID */}
                <div className="flex flex-col items-center justify-between flex-shrink-0 w-28">
                  {/* QR Code placeholder */}
                  <div className="w-24 h-24 bg-white rounded-lg flex flex-col items-center justify-center p-1.5">
                    {/* Mini QR pattern made from divs */}
                    <div className="w-full h-full grid grid-cols-7 gap-px p-0.5">
                      {/* Row-based QR-like pattern */}
                      {[
                        [1,1,1,0,1,1,1],
                        [1,0,1,0,1,0,1],
                        [1,1,1,0,1,1,1],
                        [0,0,0,0,0,0,0],
                        [1,1,1,0,1,1,1],
                        [1,0,1,0,0,1,0],
                        [1,1,1,0,0,0,1],
                      ].map((row, ri) =>
                        row.map((cell, ci) => (
                          <div
                            key={`${ri}-${ci}`}
                            className={`rounded-[1px] ${cell ? 'bg-[#001A4D]' : 'bg-transparent'}`}
                          />
                        ))
                      )}
                    </div>
                  </div>
                  <div className="text-center mt-2">
                    <p className="text-[8px] opacity-60 uppercase tracking-wider mb-0.5">Scan to verify</p>
                    <p className="font-mono text-[9px] font-bold opacity-90">{shooter.id}</p>
                  </div>
                  {/* Magnetic stripe simulation */}
                  <div className="w-full h-5 bg-black/50 rounded mt-auto" />
                </div>

                {/* Right — Info */}
                <div className="flex-1 flex flex-col justify-between py-1">
                  {/* Org info */}
                  <div>
                    <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-gold mb-0.5">Para Shooting India — PSAI</p>
                    <p className="text-[8px] text-white/50 leading-relaxed">Under Parliamentary Committee of India (PCI)<br />Affiliated: WSPS · ISSF · IPC</p>
                  </div>

                  {/* Emergency/Contact */}
                  <div className="bg-white/8 border border-white/12 rounded-lg p-2.5 space-y-1.5">
                    <p className="text-[8px] font-bold tracking-[0.15em] uppercase text-gold mb-1">Emergency Contact</p>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-gold/60" />
                      <p className="text-[9px] text-white/80">STC Office: +91-11-23075126</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-gold/60" />
                      <p className="text-[9px] text-white/80">stcparashooting@gmail.com</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-1 h-1 rounded-full bg-gold/60" />
                      <p className="text-[9px] text-white/80">Jaisalmer House, 26 Mansingh Road, New Delhi</p>
                    </div>
                  </div>

                  {/* Rules */}
                  <div className="space-y-1">
                    <p className="text-[8px] font-bold tracking-[0.15em] uppercase text-white/50 mb-1">Important Notes</p>
                    <p className="text-[8px] text-white/55 leading-relaxed">
                      1. This card is non-transferable and property of PSAI.<br />
                      2. Must be carried to all sanctioned events.<br />
                      3. Does not replace a valid Arms Licence.<br />
                      4. Report loss immediately to the STC office.
                    </p>
                  </div>

                  {/* Signature line */}
                  <div className="flex justify-between items-end border-t border-white/15 pt-2">
                    <div>
                      <div className="w-20 h-[1px] bg-white/30 mb-0.5" />
                      <p className="text-[7px] text-white/40 uppercase tracking-wider">Chairperson Signature</p>
                    </div>
                    <div className="text-right">
                      <p className="text-[7px] text-white/40 uppercase tracking-wider">Official Seal</p>
                      <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center mt-0.5 ml-auto">
                        <Shield className="w-4 h-4 text-white/20" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-center gap-4 flex-wrap">
          <button className="btn-primary">
            <Download className="w-4 h-4 mr-2" />
            Download PDF
          </button>
          <button className="btn-outline">
            <Printer className="w-4 h-4 mr-2" />
            Print Card
          </button>
          <button className="btn-ghost">
            <Share2 className="w-4 h-4 mr-2" />
            Share Digital ID
          </button>
          <button
            onClick={() => setShowBack(v => !v)}
            className="btn-ghost"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Flip Card
          </button>
        </div>

        {/* Info Box */}
        <div className="max-w-2xl mx-auto card bg-neutral-50 border-neutral-200">
          <h4 className="font-heading font-semibold text-primary mb-3">Important Instructions</h4>
          <ul className="text-sm text-neutral-600 space-y-2 list-disc pl-5">
            <li>This is a digital version of your official shooter ID card.</li>
            <li>Carry a printed copy or digital version to all PSAI sanctioned matches.</li>
            <li>Possession of this card does not replace the requirement for a valid Arms License.</li>
            <li>Identity verification may be requested at any range entry.</li>
          </ul>
        </div>
      </div>
    </>
  )
}

export default ShooterIDCardPage
