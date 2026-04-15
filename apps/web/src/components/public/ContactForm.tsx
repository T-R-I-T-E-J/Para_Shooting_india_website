'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'

interface ContactSchema {
  fullName: string
  email: string
  phone?: string
  subject: string
  state?: string
  message: string
}

export default function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const { register, handleSubmit, formState: { errors } } = useForm<ContactSchema>()

  const onSubmit = async (data: ContactSchema) => {
    setStatus('loading')
    try {
      // ✅ Keep this exact call per instructions
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })

      if (res.ok) {
        setStatus('success')
      } else {
        setStatus('error')
      }
    } catch (e) {
      console.error('Failed to submit contact form:', e)
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="bg-white border text-center border-neutral-200 rounded-xl p-8 shadow-sm flex flex-col items-center justify-center">
        <div className="text-green-600 mb-4 bg-green-50 p-4 rounded-full">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
        </div>
        <div className="text-2xl font-bold font-heading text-primary mb-2">Message Sent!</div>
        <div className="text-neutral-500 text-sm">Thank you for reaching out. We'll get back to you within 2 working days.</div>
      </div>
    )
  }

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-6 md:p-8 shadow-sm">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1 flex flex-col gap-1.5">
            <label htmlFor="fullName" className="text-sm font-semibold text-neutral-700">Full Name <span className="text-orange">*</span></label>
            <input 
              id="fullName"
              autoComplete="name"
              {...register('fullName', { required: true })} 
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm bg-neutral-50/50 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
              placeholder="Your full name" 
            />
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-semibold text-neutral-700">Email <span className="text-orange">*</span></label>
            <input 
              id="email"
              type="email"
              autoComplete="email"
              spellCheck={false}
              {...register('email', { required: true })} 
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm bg-neutral-50/50 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
              placeholder="your@email.com" 
            />
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1 flex flex-col gap-1.5">
            <label htmlFor="phone" className="text-sm font-semibold text-neutral-700">Phone</label>
            <input 
              id="phone"
              type="tel"
              autoComplete="tel"
              {...register('phone')} 
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm bg-neutral-50/50 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
              placeholder="+91 XXXXX XXXXX" 
            />
          </div>
          <div className="flex-1 flex flex-col gap-1.5">
            <label htmlFor="subject" className="text-sm font-semibold text-neutral-700">Subject <span className="text-orange">*</span></label>
            <select 
              id="subject"
              {...register('subject', { required: true })} 
              className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm bg-neutral-50/50 text-neutral-700 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
            >
              <option value="" disabled>Select subject…</option>
              <option value="Classification Enquiry">Classification Enquiry</option>
              <option value="Athlete Registration">Athlete Registration</option>
              <option value="Results & Certificates">Results & Certificates</option>
              <option value="Media Request">Media Request</option>
              <option value="General Enquiry">General Enquiry</option>
            </select>
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="state" className="text-sm font-semibold text-neutral-700">State / UT</label>
          <input 
            id="state"
            {...register('state')} 
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm bg-neutral-50/50 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all" 
            placeholder="Your state" 
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="message" className="text-sm font-semibold text-neutral-700">Message <span className="text-orange">*</span></label>
          <textarea 
            id="message"
            rows={4}
            {...register('message', { required: true })} 
            className="w-full px-4 py-3 border border-neutral-300 rounded-lg text-sm bg-neutral-50/50 focus:bg-white focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all resize-y" 
            placeholder="Write your message here…" 
          />
        </div>

        <button 
          disabled={status === 'loading'}
          className="mt-2 inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-navy text-white font-bold text-[13px] rounded-lg tracking-wide hover:bg-navy-deep active:scale-[0.98] transition-all disabled:opacity-75 disabled:cursor-not-allowed"
        >
          {status === 'loading' ? (
            <span className="animate-spin inline-block">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>
            </span>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
          )}
          {status === 'loading' ? 'Sending…' : 'Send Message'}
        </button>
      </form>
    </div>
  )
}
