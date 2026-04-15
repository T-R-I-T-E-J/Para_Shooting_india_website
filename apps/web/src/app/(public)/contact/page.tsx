<<<<<<< Updated upstream
import HeroSection from '@/components/public/HeroSection'
import ContactForm from '@/components/public/ContactForm'
import Link from 'next/link'

const leadershipCards = [
  {
    role: 'Para Shooting Administration',
    name: 'Mr. Pramod Raje',
    credential: 'Administrative · Range Coordination',
    phone: '+91 95827 43138',
    phoneTel: '+919582743138',
    email: 'theparashootingindia@gmail.com',
  },
  {
    role: 'Administrative — Office Queries',
    name: 'Mr. Pavittar',
    credential: 'Administrative Support',
    phone: '+91 70152 64709',
    phoneTel: '+917015264709',
    email: 'theparashootingindia@gmail.com',
  },
  {
    role: 'Technical Rules & Conduct — Rifle/Pistol',
    name: 'Mr. Hardik Rajput',
    credential: 'Equipment Technical Rules & Conduct · ISSF Coach C&D · WSPS & ISSF Jury · Director Sports Ops-PCI · 8th PEFI National Awardee',
    phone: '+91 98106 44202',
    phoneTel: '+919810644202',
    email: 'theparashootingindia@gmail.com',
  },
  {
    role: 'Media Incharge',
    name: 'Mr. Vivek Saini',
    credential: 'NS-NIS & ISSF Coach D License · WSPS & ISSF Judge',
    phone: '+91 88025 62883',
    phoneTel: '+918802562883',
    email: 'theparashootingindia@gmail.com',
  },
  {
    role: 'Competition Incharge',
    name: 'Mr. Charanjeet Singh Ghuman',
    credential: 'WSPS & ISSF Jury · Founder and Treasurer Para Target Shooting Association Pune',
    phone: '+91 93555 97111',
    phoneTel: '+919355597111',
    email: 'theparashootingindia@gmail.com',
  },
  {
    role: 'Medical Classification Incharge',
    name: 'Mr. Amit Panwar',
    credential: 'Medical Classifier · International Medalist in Para Sports',
    phone: '+91 83077 12992',
    phoneTel: '+918307712992',
    email: 'medicalclassification@gmail.com',
  },
  {
    role: 'Medical Classification Co-ordinator',
    name: 'Mr. Shantnu Thakur',
    credential: 'WSPS Judge',
    phone: '+91 94666 67417',
    phoneTel: '+919466667417',
    email: 'medicalclassification@gmail.com',
  },
  {
    role: 'Education Program Incharge',
    name: 'Wing Comdr. Shantanu',
    credential: 'WSPS & ISSF Judge',
    phone: '+91 80079 12900',
    phoneTel: '+918007912900',
    email: 'stcparashooting@gmail.com',
  },
]

const zoneIncharges = [
  { zone: 'East Zone', name: 'Ms. Sanjana Baruah', phone: '+91 96129 05586', phoneTel: '+919612905586' },
  { zone: 'West Zone', name: 'Mr. Aakash Kumbhar', phone: '+91 76665 20812', phoneTel: '+917666520812' },
  { zone: 'South Zone', name: 'Mr. Varanasi Sandeep', phone: '+91 90521 26394', phoneTel: '+919052126394' },
  { zone: 'North Zone', name: 'Mr. Shiva Kkaranwal', phone: '+91 91050 35678', phoneTel: '+919105035678' },
]

const directoryRows = [
  { role: 'Chairperson — STC Para Shooting', name: 'Mr. Jaiprakash Nautiyal', phone: '+91 95600 50909', phoneTel: '+919560050909', email: 'chairmanparashooting@paralympicindia.com', badge: 'Chairman', badgeStyle: 'bg-gold/10 text-[#7A6008] border border-gold/30' },
  { role: 'Para Shooting Administration', name: 'Mr. Pramod Raje', phone: '+91 95827 43138', phoneTel: '+919582743138', email: 'theparashootingindia@gmail.com', badge: 'Administration', badgeStyle: 'bg-navy/8 text-navy border border-navy/15' },
  { role: 'Administrative — Office Queries', name: 'Mr. Pavittar', phone: '+91 70152 64709', phoneTel: '+917015264709', email: 'theparashootingindia@gmail.com', badge: 'Administration', badgeStyle: 'bg-navy/8 text-navy border border-navy/15' },
  { role: 'Technical Rules & Conduct — Rifle/Pistol', name: 'Mr. Hardik Rajput', phone: '+91 98106 44202', phoneTel: '+919810644202', email: 'theparashootingindia@gmail.com', badge: 'Technical', badgeStyle: 'bg-green/8 text-green border border-green/20' },
  { role: 'Media Incharge', name: 'Mr. Vivek Saini', phone: '+91 88025 62883', phoneTel: '+918802562883', email: 'theparashootingindia@gmail.com', badge: 'Media', badgeStyle: 'bg-navy/8 text-navy border border-navy/15' },
  { role: 'Competition Incharge', name: 'Mr. Charanjeet Singh Ghuman', phone: '+91 93555 97111', phoneTel: '+919355597111', email: 'theparashootingindia@gmail.com', badge: 'Competition', badgeStyle: 'bg-green/8 text-green border border-green/20' },
  { role: 'East Zone Incharge', name: 'Ms. Sanjana Baruah', phone: '+91 96129 05586', phoneTel: '+919612905586', email: 'theparashootingindia@gmail.com', badge: 'East Zone', badgeStyle: 'bg-orange/8 text-orange border border-orange/20' },
  { role: 'West Zone Incharge', name: 'Mr. Aakash Kumbhar', phone: '+91 76665 20812', phoneTel: '+917666520812', email: 'theparashootingindia@gmail.com', badge: 'West Zone', badgeStyle: 'bg-orange/8 text-orange border border-orange/20' },
  { role: 'South Zone Incharge', name: 'Mr. Varanasi Sandeep', phone: '+91 90521 26394', phoneTel: '+919052126394', email: 'theparashootingindia@gmail.com', badge: 'South Zone', badgeStyle: 'bg-orange/8 text-orange border border-orange/20' },
  { role: 'North Zone Incharge', name: 'Mr. Shiva Kkaranwal', phone: '+91 91050 35678', phoneTel: '+919105035678', email: 'theparashootingindia@gmail.com', badge: 'North Zone', badgeStyle: 'bg-orange/8 text-orange border border-orange/20' },
  { role: 'Medical Classification Incharge', name: 'Mr. Amit Panwar', phone: '+91 83077 12992', phoneTel: '+918307712992', email: 'medicalclassification@gmail.com', badge: 'Medical', badgeStyle: 'bg-red-50 text-red-700 border border-red-200' },
  { role: 'Medical Classification Co-ordinator', name: 'Mr. Shantnu Thakur', phone: '+91 94666 67417', phoneTel: '+919466667417', email: 'medicalclassification@gmail.com', badge: 'Medical', badgeStyle: 'bg-red-50 text-red-700 border border-red-200' },
  { role: 'Education Program Incharge', name: 'Wing Comdr. Shantanu', phone: '+91 80079 12900', phoneTel: '+918007912900', email: 'stcparashooting@gmail.com', badge: 'Education', badgeStyle: 'bg-green/8 text-green border border-green/20' },
  { role: 'Additional Member', name: 'Ms. Guranchal Pawar', phone: '+91 98136 49016', phoneTel: '+919813649016', email: 'stcparashooting@gmail.com', badge: 'Member', badgeStyle: 'bg-navy/8 text-navy border border-navy/15' },
  { role: 'Additional Member', name: 'Mr. Ishwar Singh', phone: '—', phoneTel: '', email: 'stcparashooting@gmail.com', badge: 'Member', badgeStyle: 'bg-navy/8 text-navy border border-navy/15' },
]

export default function ContactPage() {
  return (
    <div>
      <HeroSection
        eyebrow="Paralympic Committee of India"
        titlePart1="Contact"
        titlePart2Em="STC Para Shooting"
        subtitle="Reach out to our national leadership team, zone coordinators, and support staff."
      />

      {/* ── Quick Contact Bar ── */}
      <div className="bg-white border-b-[3px] border-navy shadow-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center divide-x divide-neutral-100">
            <a href="tel:+919560050909" className="flex items-center gap-3 px-8 py-5 hover:bg-neutral-50 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16z"/></svg>
              </div>
              <div>
                <span className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-neutral-400 mb-0.5">Chairman&apos;s Office</span>
                <span className="block text-sm font-semibold text-navy group-hover:text-primary transition-colors">+91 95600 50909</span>
              </div>
            </a>
            <a href="mailto:chairmanparashooting@paralympicindia.com" className="flex items-center gap-3 px-8 py-5 hover:bg-neutral-50 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <span className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-neutral-400 mb-0.5">Official Email</span>
                <span className="block text-sm font-semibold text-navy group-hover:text-primary transition-colors">chairmanparashooting@paralympicindia.com</span>
              </div>
            </a>
            <a href="mailto:stcparashooting@gmail.com" className="flex items-center gap-3 px-8 py-5 hover:bg-neutral-50 transition-colors group">
              <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <div>
                <span className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-neutral-400 mb-0.5">STC Communication</span>
                <span className="block text-sm font-semibold text-navy group-hover:text-primary transition-colors">stcparashooting@gmail.com</span>
              </div>
            </a>
            <div className="flex items-center gap-3 px-8 py-5">
              <div className="w-10 h-10 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <span className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-neutral-400 mb-0.5">Head Office</span>
                <span className="block text-sm font-semibold text-navy">Jaisalmer House, New Delhi – 110011</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Leadership Section ── */}
      <section className="py-18 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-orange mb-2">STC Leadership</p>
          <h2 className="font-heading text-3xl font-bold text-navy mb-10">Committee Members</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {/* Chairman — full-width featured card */}
            <div className="md:col-span-2 xl:col-span-3 bg-gradient-to-br from-[#001A4D] to-[#003DA5] rounded-2xl p-8 border border-transparent grid grid-cols-1 md:grid-cols-2 gap-6 items-center group hover:-translate-y-1 transition-transform duration-300">
              <div>
                <span className="inline-block text-[11px] font-bold tracking-[0.1em] bg-gold/15 border border-gold/30 text-gold px-3 py-1 rounded-full mb-3">
                  Dronacharya Awardee
                </span>
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gold mb-2">Chairperson — STC Para Shooting</p>
                <h3 className="font-heading text-3xl font-bold text-white mb-1">Mr. Jaiprakash Nautiyal</h3>
                <p className="text-sm text-white/55">Dronacharya Awardee · Paralympic Committee of India · WSPS & ISSF Judge</p>
              </div>
              <div className="flex flex-col gap-2 pt-4 border-t border-white/10 md:border-t-0 md:pt-0">
                <a href="tel:+919560050909" className="flex items-center gap-2 text-sm text-white/65 hover:text-white transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 flex-shrink-0" />
                  +91 95600 50909
                </a>
                <a href="mailto:chairmanparashooting@paralympicindia.com" className="flex items-center gap-2 text-sm text-white/65 hover:text-white transition-colors break-all">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 flex-shrink-0" />
                  chairmanparashooting@paralympicindia.com
                </a>
                <a href="mailto:stcparashooting@gmail.com" className="flex items-center gap-2 text-sm text-white/65 hover:text-white transition-colors">
                  <span className="w-1.5 h-1.5 rounded-full bg-white/20 flex-shrink-0" />
                  stcparashooting@gmail.com
                </a>
              </div>
            </div>

            {/* Regular leader cards */}
            {leadershipCards.map((leader) => (
              <div key={leader.name} className="bg-white rounded-2xl p-6 border border-neutral-100 shadow-sm hover:-translate-y-1 hover:shadow-md transition-all duration-300 relative overflow-hidden group">
                <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-navy to-gold opacity-0 group-hover:opacity-100 transition-opacity" />
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-orange mb-2">{leader.role}</p>
                <h3 className="font-heading text-lg font-bold text-navy mb-1">{leader.name}</h3>
                <p className="text-xs text-neutral-400 mb-4 leading-relaxed">{leader.credential}</p>
                <div className="flex flex-col gap-1.5 pt-3 border-t border-neutral-100">
                  <a href={`tel:${leader.phoneTel}`} className="flex items-center gap-2 text-xs text-neutral-600 hover:text-navy transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-200 flex-shrink-0" />
                    {leader.phone}
                  </a>
                  <a href={`mailto:${leader.email}`} className="flex items-center gap-2 text-xs text-neutral-600 hover:text-navy transition-colors">
                    <span className="w-1.5 h-1.5 rounded-full bg-neutral-200 flex-shrink-0" />
                    {leader.email}
                  </a>
=======
'use client';

import React, { useState, useEffect } from 'react';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    subject: '',
    stateAssociation: '',
    message: '',
  });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/v1/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        setStatus('success');
        setFormData({ fullName: '', email: '', phone: '', subject: '', stateAssociation: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            (e.target as HTMLElement).style.opacity = '1';
            (e.target as HTMLElement).style.transform = 'translateY(0)';
          }
        });
      },
      { threshold: 0.1 }
    );

    const isScreenshotMode = window.innerHeight > 2500;

    document.querySelectorAll('.animate').forEach((el) => {
      const element = el as HTMLElement;
      
      if (isScreenshotMode) {
        // If a full-page screenshot tool stretched the window, immediately show elements
        element.style.opacity = '1';
        element.style.transform = 'translateY(0)';
        return;
      }

      element.style.opacity = '0';
      element.style.transform = 'translateY(20px)';
      element.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
      if (element.dataset.delay) {
        element.style.transitionDelay = element.dataset.delay;
      }
      observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const playfair = "'Playfair Display', Georgia, serif";
  const dmSans = "'DM Sans', system-ui, sans-serif";
  const dmMono = "'DM Mono', Consolas, monospace";

  return (
    <div style={{ fontFamily: dmSans, backgroundColor: '#F8F9FB', color: '#0F172A', minHeight: '100vh', paddingBottom: '40px' }}>
      
      {/* ── HERO BANNER ── */}
      <section 
        className="relative px-6 py-20 text-center overflow-hidden border-b-[4px] border-[#C8A415]"
        style={{ backgroundImage: 'linear-gradient(135deg, #001A4D, #003DA5, #1A54B8)' }}
      >
        <div 
          className="absolute inset-0 opacity-[0.02] pointer-events-none" 
          style={{ backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 40px, #ffffff 40px, #ffffff 41px), repeating-linear-gradient(90deg, transparent, transparent 40px, #ffffff 40px, #ffffff 41px)' }}
        />
        <div className="relative z-10 flex flex-col items-center">
          <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 text-white/90 text-[11px] font-semibold tracking-[0.2em] uppercase px-4 py-1.5 rounded-full mb-5">
            📍 Paralympic Committee of India
          </div>
          <h1 className="text-white text-3xl md:text-5xl font-bold leading-tight mb-4" style={{ fontFamily: playfair }}>
            Contact <span className="text-[#C8A415]">STC Para Shooting</span>
          </h1>
          <p className="text-white/70 max-w-lg text-base mx-auto">
            Reach out to our national leadership team, zone coordinators, and support staff
          </p>
        </div>
      </section>

      {/* ── QUICK CONTACT BAR ── */}
      <div className="bg-white border-b-[3px] border-[#003DA5] shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row flex-wrap items-center justify-center">
          
          <a href="tel:+919560050909" className="flex items-center gap-3 px-8 py-5 border-b md:border-b-0 md:border-r border-[#EEF1F6] w-full md:w-auto hover:bg-[#F8F9FB] transition-colors">
            <div className="w-10 h-10 rounded-[10px] bg-[#003DA5] flex items-center justify-center text-lg shrink-0 shadow-sm text-white">📞</div>
            <div>
              <span className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[#94A3B8] mb-0.5">Chairman's Office</span>
              <span className="block text-sm font-semibold text-[#003DA5]">+91 95600 50909</span>
            </div>
          </a>

          <a href="mailto:chairmanparashooting@paralympicindia.com" className="flex items-center gap-3 px-8 py-5 border-b md:border-b-0 md:border-r border-[#EEF1F6] w-full md:w-auto hover:bg-[#F8F9FB] transition-colors">
            <div className="w-10 h-10 rounded-[10px] bg-[#003DA5] flex items-center justify-center text-lg shrink-0 shadow-sm text-white">✉️</div>
            <div>
              <span className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[#94A3B8] mb-0.5">Official Email</span>
              <span className="block text-sm font-semibold text-[#003DA5]">chairmanparashooting@paralympicindia.com</span>
            </div>
          </a>

          <a href="mailto:stcparashooting@gmail.com" className="flex items-center gap-3 px-8 py-5 border-b md:border-b-0 md:border-r border-[#EEF1F6] w-full md:w-auto hover:bg-[#F8F9FB] transition-colors">
            <div className="w-10 h-10 rounded-[10px] bg-[#003DA5] flex items-center justify-center text-lg shrink-0 shadow-sm text-white">📧</div>
            <div>
              <span className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[#94A3B8] mb-0.5">STC Communication</span>
              <span className="block text-sm font-semibold text-[#003DA5]">stcparashooting@gmail.com</span>
            </div>
          </a>

          <div className="flex items-center gap-3 px-8 py-5 w-full md:w-auto hover:bg-[#F8F9FB] transition-colors">
            <div className="w-10 h-10 rounded-[10px] bg-[#003DA5] flex items-center justify-center text-lg shrink-0 shadow-sm text-white">📍</div>
            <div>
              <span className="block text-[10px] font-semibold tracking-[0.12em] uppercase text-[#94A3B8] mb-0.5">Head Office</span>
              <span className="block text-sm font-semibold text-[#003DA5]">Jaisalmer House, New Delhi – 110011</span>
            </div>
          </div>

        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 mt-16 space-y-20">
        
        {/* ── SECTION 3: LEADERSHIP CARDS ── */}
        <section>
          <div className="mb-10 text-center md:text-left">
            <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#FF671F] mb-2 animate">STC LEADERSHIP</div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#003DA5] animate" style={{ fontFamily: playfair }}>Working Committee Members</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Chairman - Full Width */}
            <div className="col-span-1 md:col-span-2 lg:col-span-3 rounded-2xl p-6 md:p-8 animate flex flex-col md:flex-row gap-6 items-start md:items-center justify-between" style={{ backgroundImage: 'linear-gradient(135deg, #001A4D, #003DA5)', boxShadow: '0 4px 12px rgba(0,0,0,0.06)' }}>
              <div>
                <div className="inline-flex items-center gap-1.5 bg-[#C8A415]/15 border border-[#C8A415]/30 text-[#C8A415] text-[11px] font-bold tracking-[0.1em] px-3 py-1 rounded-full mb-3">
                  🏆 Dronacharya Awardee
                </div>
                <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#C8A415] mb-2">Chairperson — STC Para Shooting</div>
                <h3 className="text-white text-2xl md:text-3xl font-bold mb-1" style={{ fontFamily: playfair }}>Mr. Jaiprakash Nautiyal</h3>
                <p className="text-white/55 text-xs">Dronacharya Awardee · Paralympic Committee of India</p>
              </div>
              <div className="border-t md:border-t-0 md:border-l border-white/10 pt-4 md:pt-0 md:pl-6 w-full md:w-auto flex flex-col gap-2">
                <a href="tel:+919560050909" className="text-white/65 hover:text-white text-xs flex items-center gap-2 transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0"></span>+91 95600 50909</a>
                <a href="mailto:chairmanparashooting@paralympicindia.com" className="text-white/65 hover:text-white text-xs flex items-center gap-2 transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0"></span>chairmanparashooting@paralympicindia.com</a>
                <a href="mailto:stcparashooting@gmail.com" className="text-white/65 hover:text-white text-xs flex items-center gap-2 transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0"></span>stcparashooting@gmail.com</a>
              </div>
            </div>

            {/* Regular Members mapping */}
            {[
              { role: "Administration", name: "Mr. Pramod Raje", credential: "NS-NIS & ISSF Coach D License and WSPS & ISSF Judge", phone: "95827 43138", email: "stcparashooting@gmail.com" },
              { role: "Administrative - Range Coordination", name: "Mr. Pavittar", credential: "ISSF Coach C and D", phone: "70152 64709", email: "theparashootingindia@gmail.com" },
              { role: "Administrative - Office Queries", name: "Mr. Hardik Rajput", credential: "", phone: "98106 44202", email: "theparashootingindia@gmail.com" },
              { role: "Technical rules & Conduct - Rifle/Pistol", name: "Mr. Vivek Saini", credential: "WSPS & ISSF Jury; Director Sports Ops-PCI, 8th PEFI National Awardee", phone: "88025 62883", email: "theparashootingindia@gmail.com" },
              { role: "Equipment Technical Rules & Conduct", name: "Mr. Charanjeet Singh Ghuman", credential: "WSPS & ISSF Jury", phone: "93555 97111", email: "theparashootingindia@gmail.com" },
              { role: "Medical Classification Incharge", name: "Ms. Guranchal Pawar", credential: "Medical Classifier", phone: "98151 11552", email: "medicalclassification@gmail.com" },
              { role: "Medical Classification Co-ordinator", name: "Mr. Ishwar Singh", credential: "", phone: "98136 49016", email: "medicalclassification@gmail.com" },
              { role: "Education Program Incharge", name: "Wing Comdr. Shantanu", credential: "International Medalist in Para Sports", phone: "80079 12900", email: "theparashootingindia@gmail.com" },
              { role: "Media Incharge", name: "Mr. Shantnu Thakur", credential: "WSPS & ISSF Judge", phone: "94666 67417", email: "stcparashooting@gmail.com" },
              { role: "Competition Incharge", name: "Mr. Amit Panwar", credential: "WSPS Judge", phone: "83077 12992", email: "theparashootingindia@gmail.com" },
            ].map((m, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-[0_2px_12px_rgba(0,61,165,0.08),_0_0_0_1px_rgba(0,61,165,0.05)] hover:shadow-[0_16px_48px_rgba(0,61,165,0.14),_0_4px_12px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1 relative overflow-hidden group animate" data-delay={`${(i%3)*0.1}s`}>
                <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#003DA5] to-[#C8A415] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="text-[10px] font-bold tracking-[0.15em] uppercase text-[#FF671F] mb-1.5">{m.role}</div>
                <h3 className="text-lg font-bold text-[#003DA5] mb-1 leading-snug" style={{ fontFamily: playfair }}>{m.name}</h3>
                {m.credential && <p className="text-xs text-[#94A3B8] mb-4 leading-relaxed">{m.credential}</p>}
                {!m.credential && <div className="h-4"></div>}
                <div className="mt-auto pt-3 border-t border-[#EEF1F6] flex flex-col gap-1.5">
                  <a href={`tel:+91${m.phone.replace(' ', '')}`} className="text-xs text-[#4A5568] hover:text-[#003DA5] flex items-center gap-1.5 transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-[#D8DEE9] shrink-0"></span>+91 {m.phone}</a>
                  <a href={`mailto:${m.email}`} className="text-xs text-[#4A5568] hover:text-[#003DA5] flex items-center gap-1.5 transition-colors"><span className="w-1.5 h-1.5 rounded-full bg-[#D8DEE9] shrink-0"></span>{m.email}</a>
>>>>>>> Stashed changes
                </div>
              </div>
            ))}
          </div>
<<<<<<< Updated upstream
        </div>
      </section>

      {/* ── Zone Incharges ── */}
      <section className="py-16 px-6 bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-orange mb-2">Regional Coverage</p>
          <h2 className="font-heading text-3xl font-bold text-navy mb-8">Zone Incharges</h2>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {zoneIncharges.map((z) => (
              <div key={z.zone} className="bg-white rounded-2xl p-5 border border-neutral-100 shadow-sm text-center hover:-translate-y-1 hover:border-navy hover:shadow-md transition-all duration-200">
                <div className="w-12 h-12 rounded-xl bg-navy mx-auto mb-3 flex items-center justify-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>
                </div>
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-orange mb-1">{z.zone}</p>
                <h3 className="font-heading text-[15px] font-bold text-navy mb-2">{z.name}</h3>
                <a href={`tel:${z.phoneTel}`} className="text-xs text-neutral-600 font-mono hover:text-navy transition-colors">{z.phone}</a>
              </div>
            ))}
          </div>

          {/* Additional members */}
          <div className="mt-5 bg-neutral-50 rounded-2xl p-5 border border-neutral-100 flex flex-wrap items-center gap-6">
            <div className="flex items-center gap-4">
              <div className="w-11 h-11 rounded-xl bg-navy flex items-center justify-center flex-shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-orange mb-0.5">Additional Member</p>
                <p className="font-heading text-base font-bold text-navy">Ms. Guranchal Pawar</p>
                <p className="text-xs text-neutral-400">WSPS & ISSF Jury · <a href="tel:+919813649016" className="text-navy hover:underline">+91 98136 49016</a></p>
              </div>
            </div>
            <div className="flex items-center gap-4 ml-auto">
              <div>
                <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-orange mb-0.5">Additional Member</p>
                <p className="font-heading text-base font-bold text-navy">Mr. Ishwar Singh</p>
                <p className="text-xs text-neutral-400">WSPS & ISSF Judge · Contact via STC email</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Full Directory Table ── */}
      <section className="py-16 px-6 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-orange mb-2">Complete Directory</p>
          <h2 className="font-heading text-3xl font-bold text-navy mb-8">Full Contact List — STC Para Shooting</h2>

          <div className="rounded-2xl overflow-hidden border border-neutral-100 shadow-sm">
            <div className="bg-navy px-7 py-5 flex items-center justify-between">
              <h3 className="font-heading text-lg font-bold text-white">STC Para Shooting — Contact Directory</h3>
              <span className="text-[11px] text-white/50 tracking-[0.1em] uppercase">Paralympic Committee of India</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px]">
                <thead>
                  <tr className="bg-[#F0F4FF]">
                    <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-navy border-b-2 border-neutral-100">Role</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-navy border-b-2 border-neutral-100">Name</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-navy border-b-2 border-neutral-100">Phone</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-navy border-b-2 border-neutral-100">Email</th>
                    <th className="text-left px-5 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-navy border-b-2 border-neutral-100">Category</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-neutral-100">
                  {directoryRows.map((row) => (
                    <tr key={`${row.name}-${row.role}`} className="hover:bg-[#F8F9FF] transition-colors">
                      <td className="px-5 py-3.5 text-sm font-semibold text-neutral-800">{row.role}</td>
                      <td className="px-5 py-3.5 font-heading text-sm font-bold text-navy">{row.name}</td>
                      <td className="px-5 py-3.5 text-xs font-mono text-neutral-600">
                        {row.phoneTel ? (
                          <a href={`tel:${row.phoneTel}`} className="hover:text-navy transition-colors">{row.phone}</a>
                        ) : row.phone}
                      </td>
                      <td className="px-5 py-3.5 text-xs text-neutral-600">
                        <a href={`mailto:${row.email}`} className="hover:text-navy transition-colors">{row.email}</a>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-block text-[10px] font-bold tracking-[0.05em] px-2.5 py-1 rounded-full ${row.badgeStyle}`}>{row.badge}</span>
                      </td>
=======
        </section>

        {/* ── SECTION 4: ZONE INCHARGES ── */}
        <section className="bg-white rounded-3xl p-6 md:p-10 shadow-[0_2px_12px_rgba(0,61,165,0.08),_0_0_0_1px_rgba(0,61,165,0.05)]">
          <div className="mb-8 text-center md:text-left">
            <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#FF671F] mb-2 animate">REGIONAL COVERAGE</div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#003DA5] animate" style={{ fontFamily: playfair }}>Zone Incharges</h2>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { zone: "East Zone", name: "Ms. Sanjana Baruah", phone: "96129 05586" },
              { zone: "West Zone", name: "Mr. Aakash Kumbhar", phone: "76665 20812" },
              { zone: "South Zone", name: "Mr. Varanasi Sandeep", phone: "90521 26394" },
              { zone: "North Zone", name: "Mr. Shiva Kkaranwal", phone: "91050 35678" }
            ].map((z, i) => (
              <div key={i} className="bg-white rounded-[14px] p-5 border border-[#EEF1F6] text-center hover:border-[#003DA5] hover:-translate-y-0.5 hover:shadow-[0_16px_48px_rgba(0,61,165,0.14),_0_4px_12px_rgba(0,0,0,0.06)] transition-all animate" data-delay={`${i*0.1}s`}>
                <div className="w-12 h-12 rounded-xl bg-[#003DA5] text-white flex items-center justify-center text-xl mx-auto mb-3 shadow-sm">🧭</div>
                <div className="text-[11px] font-bold tracking-[0.15em] uppercase text-[#FF671F] mb-1.5">{z.zone}</div>
                <div className="text-[15px] font-bold text-[#003DA5] mb-2" style={{ fontFamily: playfair }}>{z.name}</div>
                <div className="text-xs text-[#4A5568]" style={{ fontFamily: dmMono }}>+91 {z.phone}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SECTION 5: FULL DIRECTORY TABLE ── */}
        <section>
          <div className="mb-8 text-center md:text-left">
            <div className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#FF671F] mb-2 animate">COMPLETE DIRECTORY</div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#003DA5] animate" style={{ fontFamily: playfair }}>Full Contact List — STC Para Shooting</h2>
          </div>

          <div className="bg-white rounded-[20px] shadow-[0_2px_12px_rgba(0,61,165,0.08),_0_0_0_1px_rgba(0,61,165,0.05)] border border-[#EEF1F6] overflow-hidden animate">
            <div className="bg-[#003DA5] p-5 md:px-7 md:py-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
              <h3 className="text-white text-lg font-bold" style={{ fontFamily: playfair }}>STC Para Shooting</h3>
              <span className="text-white/50 text-[11px] tracking-[0.1em] uppercase">Paralympic Committee of India</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[750px]">
                <thead>
                  <tr className="bg-[#F0F4FF] border-b-2 border-[#EEF1F6]">
                    <th className="px-5 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-[#003DA5]">Role</th>
                    <th className="px-5 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-[#003DA5]">Name</th>
                    <th className="px-5 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-[#003DA5]">Phone</th>
                    <th className="px-5 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-[#003DA5]">Email</th>
                    <th className="px-5 py-3 text-[10px] font-bold tracking-[0.15em] uppercase text-[#003DA5]">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { role: "Chairperson - STC - Para Shooting", name: "Mr. Jaiprakash Nautiyal", phone: "95600 50909", email: "chairmanparashooting@paralympicindia.com", cat: "Chairman", style: "bg-[#C8A415]/10 text-[#7A6008] border-[#C8A415]/30" },
                    { role: "Administration", name: "Mr. Pramod Raje", phone: "95827 43138", email: "stcparashooting@gmail.com", cat: "Administration", style: "bg-[#003DA5]/10 text-[#003DA5] border-[#003DA5]/15" },
                    { role: "Administrative - Range Coordination", name: "Mr. Pavittar", phone: "70152 64709", email: "theparashootingindia@gmail.com", cat: "Administration", style: "bg-[#003DA5]/10 text-[#003DA5] border-[#003DA5]/15" },
                    { role: "Administrative - Office Queries", name: "Mr. Hardik Rajput", phone: "98106 44202", email: "theparashootingindia@gmail.com", cat: "Administration", style: "bg-[#003DA5]/10 text-[#003DA5] border-[#003DA5]/15" },
                    { role: "Technical rules & Conduct - Rifle/Pistol", name: "Mr. Vivek Saini", phone: "88025 62883", email: "theparashootingindia@gmail.com", cat: "Technical", style: "bg-[#046A38]/10 text-[#046A38] border-[#046A38]/20" },
                    { role: "Equipment Technical Rules & Conduct", name: "Mr. Charanjeet Singh Ghuman", phone: "93555 97111", email: "theparashootingindia@gmail.com", cat: "Technical", style: "bg-[#046A38]/10 text-[#046A38] border-[#046A38]/20" },
                    { role: "East Zone Incharge", name: "Ms. Sanjana Baruah", phone: "96129 05586", email: "theparashootingindia@gmail.com", cat: "Zone", style: "bg-[#FF671F]/10 text-[#E85510] border-[#FF671F]/20" },
                    { role: "West Zone Incharge", name: "Mr. Aakash Kumbhar", phone: "76665 20812", email: "theparashootingindia@gmail.com", cat: "Zone", style: "bg-[#FF671F]/10 text-[#E85510] border-[#FF671F]/20" },
                    { role: "South Zone Incharge", name: "Mr. Varanasi Sandeep", phone: "90521 26394", email: "stcparashooting@gmail.com", cat: "Zone", style: "bg-[#FF671F]/10 text-[#E85510] border-[#FF671F]/20" },
                    { role: "North Zone Incharge", name: "Mr. Shiva Kkaranwal", phone: "91050 35678", email: "stcparashooting@gmail.com", cat: "Zone", style: "bg-[#FF671F]/10 text-[#E85510] border-[#FF671F]/20" },
                    { role: "Medical Classification Incharge", name: "Ms. Guranchal Pawar", phone: "98151 11552", email: "medicalclassification@gmail.com", cat: "Medical", style: "bg-[#ef4444]/10 text-[#dc2626] border-[#ef4444]/20" },
                    { role: "Medical Classification Co-ordinator", name: "Mr. Ishwar Singh", phone: "98136 49016", email: "medicalclassification@gmail.com", cat: "Medical", style: "bg-[#ef4444]/10 text-[#dc2626] border-[#ef4444]/20" },
                    { role: "Education Program Incharge", name: "Wing Comdr. Shantanu", phone: "80079 12900", email: "theparashootingindia@gmail.com", cat: "Education", style: "bg-[#9333ea]/10 text-[#7e22ce] border-[#9333ea]/20" },
                    { role: "Media Incharge", name: "Mr. Shantnu Thakur", phone: "94666 67417", email: "stcparashooting@gmail.com", cat: "Media", style: "bg-[#14b8a6]/10 text-[#0f766e] border-[#14b8a6]/20" },
                    { role: "Competition Incharge", name: "Mr. Amit Panwar", phone: "83077 12992", email: "theparashootingindia@gmail.com", cat: "Technical", style: "bg-[#046A38]/10 text-[#046A38] border-[#046A38]/20" }
                  ].map((row, i) => (
                    <tr key={i} className="border-b border-[#EEF1F6] hover:bg-[#F0F4FF] transition-colors group">
                      <td className="px-5 py-3.5 text-[13px] font-semibold text-[#0F172A]">{row.role}</td>
                      <td className="px-5 py-3.5 text-sm font-bold text-[#003DA5]" style={{ fontFamily: playfair }}>{row.name}</td>
                      <td className="px-5 py-3.5 text-xs text-[#4A5568]" style={{ fontFamily: dmMono }}>{row.phone !== "—" ? <a href={`tel:+91${row.phone.replace(' ', '')}`} className="hover:text-[#003DA5]">+91 {row.phone}</a> : "—"}</td>
                      <td className="px-5 py-3.5 text-xs text-[#4A5568]"><a href={`mailto:${row.email}`} className="hover:text-[#003DA5]">{row.email}</a></td>
                      <td className="px-5 py-3.5"><span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-[0.05em] border ${row.style}`}>{row.cat}</span></td>
>>>>>>> Stashed changes
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
<<<<<<< Updated upstream
        </div>
      </section>

      {/* ── Contact Form + Office ── */}
      <section className="py-16 px-6 bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <p className="text-[10px] font-bold tracking-[0.25em] uppercase text-orange mb-2">Get In Touch</p>
          <h2 className="font-heading text-3xl font-bold text-navy mb-10">Send Us a Message</h2>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10">
            {/* Office Info Card */}
            <div className="bg-gradient-to-br from-[#001A4D] to-[#003DA5] rounded-2xl p-9 text-white h-fit">
              <h3 className="font-heading text-2xl font-bold text-white mb-1">Our Office</h3>
              <p className="text-sm text-white/50 mb-8">Paralympic Committee of India — Para Shooting Division</p>

              <div className="flex items-start gap-3.5 mb-5">
                <div className="w-[38px] h-[38px] rounded-xl bg-white/8 border border-white/12 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gold mb-1">Address</p>
                  <p className="text-sm text-white/85 leading-relaxed">Jaisalmer House<br />26 Mansingh Road<br />New Delhi — 110011</p>
                </div>
              </div>

              <div className="h-px bg-white/10 my-5" />

              <div className="flex items-start gap-3.5 mb-5">
                <div className="w-[38px] h-[38px] rounded-xl bg-white/8 border border-white/12 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.59a16 16 0 0 0 6 6l.96-.96a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 21.5 16z"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gold mb-1">Phone</p>
                  <a href="tel:+911123075126" className="text-sm text-white/85 hover:text-white transition-colors">+91-11-23075126</a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 mb-5">
                <div className="w-[38px] h-[38px] rounded-xl bg-white/8 border border-white/12 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gold mb-1">Official Communication</p>
                  <a href="mailto:stcparashooting@gmail.com" className="block text-sm text-white/85 hover:text-white transition-colors">stcparashooting@gmail.com</a>
                  <a href="mailto:theparashootingindia@gmail.com" className="block text-sm text-white/85 hover:text-white transition-colors">theparashootingindia@gmail.com</a>
                </div>
              </div>

              <div className="flex items-start gap-3.5">
                <div className="w-[38px] h-[38px] rounded-xl bg-white/8 border border-white/12 flex items-center justify-center flex-shrink-0">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                </div>
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.15em] uppercase text-gold mb-1">Chairman&apos;s Direct</p>
                  <a href="mailto:chairmanparashooting@paralympicindia.com" className="text-sm text-white/85 hover:text-white transition-colors break-all">chairmanparashooting@paralympicindia.com</a>
                </div>
              </div>

              <div className="h-px bg-white/10 my-6" />
              <p className="text-xs text-white/40 italic leading-relaxed">
                &ldquo;Empowering Para-Athletes to Achieve Excellence&rdquo;<br />
                — Mr. Jaiprakash Nautiyal, Chairperson STC
              </p>
            </div>

            {/* Contact Form */}
            <ContactForm />
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="py-16 px-6 bg-gradient-to-br from-[#001A4D] to-[#003DA5] text-center">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">Ready to Join Para Shooting?</h2>
        <p className="text-base text-white/55 mb-8 max-w-lg mx-auto">Register as a shooter, check classifications, or explore upcoming championships across India.</p>
        <div className="flex gap-3 justify-center flex-wrap">
          <Link href="/registration" className="px-7 py-3.5 bg-orange text-white font-bold text-sm rounded-xl hover:bg-orange/90 hover:-translate-y-0.5 transition-all shadow-[0_4px_16px_rgba(255,103,31,0.4)]">
            Register as Shooter
          </Link>
          <Link href="/classification" className="px-7 py-3.5 bg-transparent text-white border border-white/30 font-semibold text-sm rounded-xl hover:border-white hover:bg-white/8 transition-all">
            View Classification
          </Link>
          <Link href="/events" className="px-7 py-3.5 bg-transparent text-white border border-white/30 font-semibold text-sm rounded-xl hover:border-white hover:bg-white/8 transition-all">
            Championships
          </Link>
        </div>
      </section>
    </div>
  )
=======
        </section>

        {/* ── SECTION 6: CONTACT FORM + OFFICE INFO ── */}
        <section className="bg-white rounded-3xl shadow-[0_2px_12px_rgba(0,61,165,0.08),_0_0_0_1px_rgba(0,61,165,0.05)] border border-[#EEF1F6] p-6 md:p-10 mb-20 animate">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.4fr] gap-10 lg:gap-14">
            
            {/* Left Box */}
            <div className="rounded-[20px] p-8 text-white h-fit" style={{ backgroundImage: 'linear-gradient(135deg, #001A4D, #003DA5)' }}>
              <h3 className="text-2xl font-bold mb-1.5" style={{ fontFamily: playfair }}>Our Office</h3>
              <p className="text-[13px] text-white/50 mb-8">Paralympic Committee of India — Para Shooting Division</p>

              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-lg shrink-0">📍</div>
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#C8A415] mb-1">Address</div>
                  <div className="text-sm text-white/85 leading-relaxed">Jaisalmer House<br/>26 Mansingh Road<br/>New Delhi — 110011</div>
                </div>
              </div>

              <div className="h-px bg-white/10 my-6"></div>

              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-lg shrink-0">📞</div>
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#C8A415] mb-1">Phone</div>
                  <div className="text-sm text-white/85 leading-relaxed"><a href="tel:+911123075126" className="hover:text-white hover:underline transition-all">+91-11-23075126</a></div>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-lg shrink-0">✉️</div>
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#C8A415] mb-1">Official Communication</div>
                  <div className="text-sm text-white/85 leading-relaxed">
                    <a href="mailto:stcparashooting@gmail.com" className="hover:text-white hover:underline transition-all block">stcparashooting@gmail.com</a>
                    <a href="mailto:theparashootingindia@gmail.com" className="hover:text-white hover:underline transition-all block">theparashootingindia@gmail.com</a>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 mb-5">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center text-lg shrink-0">🏆</div>
                <div>
                  <div className="text-[10px] font-semibold tracking-[0.15em] uppercase text-[#C8A415] mb-1">Chairman's Direct</div>
                  <div className="text-sm text-white/85 leading-relaxed">
                    <a href="mailto:chairmanparashooting@paralympicindia.com" className="hover:text-white hover:underline transition-all block break-all">chairmanparashooting@paralympicindia.com</a>
                  </div>
                </div>
              </div>

              <div className="h-px bg-white/10 my-6"></div>

              <div className="text-xs text-white/40 leading-relaxed italic">
                "Empowering Para-Athletes to Achieve Excellence"<br/>
                — Mr. Jaiprakash Nautiyal, Chairperson STC
              </div>
            </div>

            {/* Right Form */}
            <div>
              <h3 className="text-2xl font-bold text-[#003DA5] mb-1.5" style={{ fontFamily: playfair }}>Send a Message</h3>
              <p className="text-sm text-[#94A3B8] mb-7">We typically respond within 2 working days</p>

              {status === 'success' && (
                <div className="mb-6 p-4 rounded-xl bg-[#046A38]/10 border border-[#046A38]/20 text-[#046A38] text-sm font-medium flex gap-3 animate">
                  <span>✅</span> Your message has been sent. We'll respond within 2 working days.
                </div>
              )}
              {status === 'error' && (
                <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm flex gap-3 animate">
                  <span>❌</span> Something went wrong. Please email us directly at stcparashooting@gmail.com
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4A5568] mb-1.5">Full Name <span className="text-[#FF671F]">*</span></label>
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-4 py-3 bg-white border-2 border-[#D8DEE9] rounded-[10px] text-sm text-[#0F172A] focus:border-[#003DA5] focus:outline-none focus:ring-4 focus:ring-[#003DA5]/10 transition-all placeholder:text-[#94A3B8]" placeholder="Your full name" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4A5568] mb-1.5">Email Address <span className="text-[#FF671F]">*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-4 py-3 bg-white border-2 border-[#D8DEE9] rounded-[10px] text-sm text-[#0F172A] focus:border-[#003DA5] focus:outline-none focus:ring-4 focus:ring-[#003DA5]/10 transition-all placeholder:text-[#94A3B8]" placeholder="your@email.com" suppressHydrationWarning />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4A5568] mb-1.5">Phone Number</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className="w-full px-4 py-3 bg-white border-2 border-[#D8DEE9] rounded-[10px] text-sm text-[#0F172A] focus:border-[#003DA5] focus:outline-none focus:ring-4 focus:ring-[#003DA5]/10 transition-all placeholder:text-[#94A3B8]" placeholder="+91 XXXXX XXXXX" />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4A5568] mb-1.5">Subject <span className="text-[#FF671F]">*</span></label>
                    <select name="subject" value={formData.subject} onChange={handleChange} required className="w-full px-4 py-3 bg-white border-2 border-[#D8DEE9] rounded-[10px] text-sm text-[#0F172A] focus:border-[#003DA5] focus:outline-none focus:ring-4 focus:ring-[#003DA5]/10 transition-all appearance-none">
                      <option value="" disabled>Select a subject</option>
                      <option>Registration & Membership</option>
                      <option>Classification Query</option>
                      <option>Competition Enquiry</option>
                      <option>Medical Classification</option>
                      <option>Equipment & Technical Rules</option>
                      <option>Zone Coordination</option>
                      <option>Media & Press</option>
                      <option>Education Programme</option>
                      <option>General Enquiry</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4A5568] mb-1.5">State / Association</label>
                  <input type="text" name="stateAssociation" value={formData.stateAssociation} onChange={handleChange} className="w-full px-4 py-3 bg-white border-2 border-[#D8DEE9] rounded-[10px] text-sm text-[#0F172A] focus:border-[#003DA5] focus:outline-none focus:ring-4 focus:ring-[#003DA5]/10 transition-all placeholder:text-[#94A3B8]" placeholder="Your state or association name" />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold tracking-[0.1em] uppercase text-[#4A5568] mb-1.5">Message <span className="text-[#FF671F]">*</span></label>
                  <textarea name="message" value={formData.message} onChange={handleChange} required className="w-full px-4 py-3 bg-white border-2 border-[#D8DEE9] rounded-[10px] text-sm text-[#0F172A] focus:border-[#003DA5] focus:outline-none focus:ring-4 focus:ring-[#003DA5]/10 transition-all placeholder:text-[#94A3B8] min-h-[120px] resize-y" placeholder="Describe your query in detail..."></textarea>
                </div>

                <button 
                  type="submit" 
                  disabled={status === 'loading'}
                  className="w-full flex items-center justify-center gap-2 bg-[#003DA5] hover:bg-[#002B7A] text-white py-3.5 px-6 rounded-[12px] font-bold text-[15px] tracking-[0.03em] transition-all hover:-translate-y-0.5 shadow-[0_4px_16px_rgba(0,61,165,0.3)] hover:shadow-[0_8px_24px_rgba(0,61,165,0.4)] disabled:opacity-70 disabled:hover:translate-y-0 mt-2"
                >
                  {status === 'loading' ? (
                    <><span>⏳</span> Sending...</>
                  ) : status === 'success' ? (
                    <><span>✅</span> Sent!</>
                  ) : (
                    <><span>📨</span> Send Message</>
                  )}
                </button>
              </form>
            </div>

          </div>
        </section>

      </div>
    </div>
  );
>>>>>>> Stashed changes
}
