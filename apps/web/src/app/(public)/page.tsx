<<<<<<< Updated upstream
import React from 'react'
import Link from 'next/link'
import NewsCard from '@/components/public/NewsCard'
import NewsCarousel from '@/components/public/NewsCarousel'
import EventCard from '@/components/public/EventCard'
import MediaCard from '@/components/public/MediaCard'
import RevealSection from '@/components/public/RevealSection'
import DocumentsSection from '@/components/public/DocumentsSection'

const featuredNews = [
  {
    category: 'Championship',
    date: '24 Feb 2026',
    title: 'Indian Team Secures 5 Medals at World Cup',
    snippet:
      'In an outstanding display of skill, the Indian para shooting contingent brought home three gold and two silver medals from the recent World Cup in Cheongju.',
    imageGradientFrom: '#001A4D',
    imageGradientTo: '#003DA5',
    slug: 'world-cup-medals',
  },
  {
    category: 'Announcement',
    date: '18 Feb 2026',
    title: 'New Coaching Camp Dates Revealed',
    snippet:
      'The upcoming National Technical and Coaches Course will be held at Dr. Karni Singh Shooting Range from March 10th to March 15th.',
    imageGradientFrom: '#C8A415',
    imageGradientTo: '#8B7005',
    slug: 'new-camp-dates',
  },
  {
    category: 'General',
    date: '05 Feb 2026',
    title: 'Updated Classification Roster',
    snippet:
      'The master national classification roster has been updated for Q1 2026. Athletes are requested to check their statuses before upcoming regionals.',
    imageGradientFrom: '#046A38',
    imageGradientTo: '#014022',
    slug: 'updated-roster',
  },
]

const upcomingEvents = [
  { day: '10', month: 'Mar', title: 'National Technical and Coaches Course', location: 'Dr. Karni Singh Shooting Range', status: 'upcoming' as const },
  { day: '22', month: 'Apr', title: 'Zonal Para Shooting Championship', location: 'Pune Balewadi Stadium', status: 'upcoming' as const },
  { day: '05', month: 'May', title: 'Medical Classification Seminar', location: 'Virtual / Zoom', status: 'completed' as const },
  { day: '14', month: 'Jun', title: 'National Selection Trials', location: 'Dr. Karni Singh Shooting Range', status: 'upcoming' as const },
]

const featuredMedia = [
  { type: 'video' as const, title: 'Highlights from the 5th National Para Shooting Championship', date: '20 Dec 2025', videoDuration: '04:12', thumbnailFrom: '#1E293B', thumbnailTo: '#0F172A' },
  { type: 'gallery' as const, title: 'Training Camp - New Delhi', date: '15 Nov 2025', thumbnailFrom: '#C8A415', thumbnailTo: '#A5840D' },
  { type: 'gallery' as const, title: 'International Classification Workshop', date: '10 Oct 2025', thumbnailFrom: '#046A38', thumbnailTo: '#024D28' },
]

const stats = [
  { value: '450+', label: 'Registered Athletes' },
  { value: '26', label: 'States Represented' },
  { value: '12', label: 'Intl. Medals (2025)' },
  { value: '8', label: 'National Tournaments' },
]

const partners = [
  { name: 'Ministry of Youth Affairs & Sports', short: 'MYAS' },
  { name: 'Sports Authority of India', short: 'SAI' },
  { name: 'Paralympic Committee of India', short: 'PCI' },
  { name: 'World Para Shooting', short: 'WPS' },
]

async function getLatestNews() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://final-production-q1yw.onrender.com/api/v1';
    const fetchUrl = API_URL.startsWith('http') ? `${API_URL}/news?status=published&limit=3` : `https://final-production-q1yw.onrender.com/api/v1/news?status=published&limit=3`;
    const res = await fetch(fetchUrl, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    const data = Array.isArray(json) ? json : json.data || [];
    
    if (data.length === 0) return null;

    return data.map((item: any, i: number) => ({
      category: item.category || 'NEWS',
      date: new Date(item.published_at || item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      title: item.title,
      snippet: item.excerpt || item.title,
      featured_image_url: item.featured_image_url || item.preview_image_url || '',
      imageGradientFrom: ['#001A4D', '#C8A415', '#046A38'][i % 3],
      imageGradientTo: ['#003DA5', '#8B7005', '#014022'][i % 3],
      slug: item.slug || item.id.toString(),
    }));
  } catch (error) {
    console.error('Home News Error:', error);
    return null;
  }
}

async function getUpcomingEvents() {
  try {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://final-production-q1yw.onrender.com/api/v1';
    const fetchUrl = API_URL.startsWith('http') ? `${API_URL}/events?limit=4` : `https://final-production-q1yw.onrender.com/api/v1/events?limit=4`;
    const res = await fetch(fetchUrl, { cache: 'no-store' });
    if (!res.ok) return null;
    const json = await res.json();
    const data = Array.isArray(json) ? json : json.data || [];

    if (data.length === 0) return null;

    return data.map((event: any) => {
      const date = new Date(event.start_date);
      return {
        day: date.getDate().toString(),
        month: date.toLocaleDateString('en-GB', { month: 'short' }),
        title: event.title,
        location: event.venue?.name || event.location || 'TBA',
        status: (event.status || 'upcoming').toLowerCase() as 'upcoming' | 'completed' | 'ongoing',
      };
    });
  } catch (error) {
    console.error('Home Events Error:', error);
    return null;
  }
}

export default async function HomePage() {
  const latestNews = await getLatestNews() || featuredNews;
  const realEvents = await getUpcomingEvents() || upcomingEvents;
  return (
    <div className="w-full overflow-x-hidden">

      {/* ══════════════════════════════════════════
          HERO — Full-viewport cinematic opener
      ══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex flex-col justify-center overflow-hidden bg-[#000D26]">

        {/* Deep layered background */}
        <div className="absolute inset-0 z-0">
          {/* Primary radial glow */}
          <div className="absolute inset-0" style={{
            background: 'radial-gradient(ellipse 120% 80% at 60% 40%, rgba(0,61,165,0.55) 0%, rgba(0,26,77,0.8) 50%, #000D26 80%)',
          }} />
          {/* Gold light leak top-right */}
          <div className="absolute top-0 right-0 w-[800px] h-[500px] opacity-10" style={{
            background: 'radial-gradient(ellipse at top right, #C8A415 0%, transparent 70%)',
          }} />
          {/* Fine diagonal grid */}
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: 'repeating-linear-gradient(45deg, rgba(255,255,255,0.5) 0, rgba(255,255,255,0.5) 1px, transparent 0, transparent 50%)',
            backgroundSize: '30px 30px',
          }} />
          {/* Horizontal scan lines */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.4) 2px, rgba(255,255,255,0.4) 3px)',
          }} />
        </div>

        {/* Gold vertical accent line */}
        <div className="absolute left-[10%] top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent z-10 hidden xl:block" />

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 lg:px-16 pt-28 pb-20">

          {/* Eyebrow */}
          <div className="flex items-center gap-3 mb-8">
            <div className="flex gap-1">
              <span className="w-6 h-1 bg-[#FF9933] rounded-full" />
              <span className="w-6 h-1 bg-white rounded-full" />
              <span className="w-6 h-1 bg-[#138808] rounded-full" />
            </div>
            <span className="text-[11px] font-bold tracking-[0.3em] uppercase text-white/50">
              Paralympic Committee of India
            </span>
          </div>

          {/* Main Headline — editorial split */}
          <div className="mb-10 max-w-5xl">
            <h1 className="font-heading leading-[0.95] tracking-tight">
              <span className="block text-[clamp(52px,8vw,110px)] font-black text-white">
                Shoot for
              </span>
              <span className="block text-[clamp(52px,8vw,110px)] font-black italic text-gold" style={{
                textShadow: '0 0 80px rgba(200,164,21,0.3)',
              }}>
                India.
              </span>
              <span className="block text-[clamp(28px,4vw,56px)] font-bold text-white/40 mt-2">
                Para Shooting National Federation
              </span>
            </h1>
          </div>

          {/* Sub-headline */}
          <p className="text-lg md:text-xl text-white/55 max-w-xl leading-relaxed mb-12 font-body">
            The governing body for Paralympic shooting sports in India — classifying, developing, and fielding world-class para-athletes since 2015.
          </p>

          {/* CTA Row */}
          <div className="flex flex-col sm:flex-row gap-4 items-start mb-16">
            <Link
              href="/registration"
              className="group inline-flex items-center gap-3 px-8 py-4 bg-gold text-[#001A4D] font-extrabold text-[13px] tracking-[0.1em] uppercase rounded-none hover:bg-white transition-all duration-200 shadow-[0_0_40px_rgba(200,164,21,0.25)] hover:shadow-[0_0_60px_rgba(200,164,21,0.4)]"
            >
              Register as Athlete
              <svg className="group-hover:translate-x-1 transition-transform" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
              </svg>
            </Link>
            <a
              href="#events"
              className="inline-flex items-center gap-3 px-8 py-4 border border-white/20 text-white font-bold text-[13px] tracking-[0.1em] uppercase rounded-none hover:border-white/60 hover:bg-white/5 transition-all duration-200"
            >
              View Championships
            </a>
          </div>

          {/* Stats Pills */}
          <div className="flex flex-wrap gap-px border border-white/10 w-fit">
            {stats.map((s, i) => (
              <div key={s.label} className={`px-6 py-4 flex flex-col ${i < stats.length - 1 ? 'border-r border-white/10' : ''} bg-white/[0.03] hover:bg-white/[0.07] transition-colors`}>
                <span className="font-heading text-2xl font-black text-gold leading-none">{s.value}</span>
                <span className="text-[10px] text-white/40 uppercase tracking-widest mt-1 font-bold">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom accent — diagonal gold slash */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-10 opacity-30">
          <div className="w-px h-12 bg-white animate-pulse" />
          <span className="text-[9px] text-white uppercase tracking-[0.3em]">Scroll</span>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          MARQUEE TICKER — momentum between sections
      ══════════════════════════════════════════ */}
      <div className="bg-gold py-3 overflow-hidden border-y-2 border-[#A8880F]">
        <div className="flex items-center gap-8 animate-marquee whitespace-nowrap" style={{ animationDuration: '30s' }}>
          {['5th National Para Shooting Championship', 'Athlete Registration Now Open', 'National Selection Trials — June 2026', 'Medical Classification Camps Available', '450+ Registered Athletes Nationwide', 'India — 12 International Medals in 2025'].concat(
            ['5th National Para Shooting Championship', 'Athlete Registration Now Open', 'National Selection Trials — June 2026', 'Medical Classification Camps Available', '450+ Registered Athletes Nationwide', 'India — 12 International Medals in 2025']
          ).map((item, i) => (
            <span key={i} className="inline-flex items-center gap-6 text-[11px] font-black tracking-[0.25em] uppercase text-[#001A4D]">
              {item}
              <span className="w-1 h-1 rounded-full bg-[#001A4D]/40" />
            </span>
          ))}
        </div>
      </div>


      {/* ══════════════════════════════════════════
          WHY REGISTER — Bold benefit cards
      ══════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-white relative overflow-hidden">
        {/* Background number watermark */}
        <div className="absolute -right-8 top-1/2 -translate-y-1/2 font-heading text-[300px] font-black text-neutral-50 leading-none select-none pointer-events-none hidden xl:block">01</div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-16 items-start">

            {/* Left — label + title */}
            <RevealSection>
              <div className="lg:sticky lg:top-24">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-8 h-[2px] bg-gold" />
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-orange">Membership</span>
                </div>
                <h2 className="font-heading text-[clamp(32px,4vw,52px)] font-black text-[#001A4D] leading-[1.05] mb-6">
                  Why Become a<br />
                  <em className="text-gold italic">Registered</em><br />
                  Athlete?
                </h2>
                <p className="text-neutral-500 text-base leading-relaxed mb-8 max-w-xs">
                  Join India&apos;s national para shooting roster and unlock official competition access, classification, and international selection pathways.
                </p>
                <Link href="/registration" className="inline-flex items-center gap-2 text-[12px] font-black tracking-[0.2em] uppercase text-[#001A4D] border-b-2 border-gold pb-1 hover:text-gold transition-colors">
                  Register Now
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                </Link>
              </div>
            </RevealSection>

            {/* Right — 3 benefit cards */}
            <div className="flex flex-col gap-px border border-neutral-100">
              {[
                {
                  num: '01',
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                  ),
                  title: 'Official Eligibility',
                  desc: 'Gain the official credentials required to compete in sanctioned regional and national Para Shooting championships across India.',
                  color: 'bg-[#001A4D]',
                },
                {
                  num: '02',
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  ),
                  title: 'Medical Classification',
                  desc: 'Get placed on the master national classification roster, ensuring you compete fairly within your designated athlete category.',
                  color: 'bg-gold',
                },
                {
                  num: '03',
                  icon: (
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>
                  ),
                  title: 'National Selection',
                  desc: 'Access national training camps and become eligible for team selection to represent India in international World Cups.',
                  color: 'bg-[#046A38]',
                },
              ].map((b, i) => (
                <RevealSection key={b.num} delay={i * 100}>
                  <div className="group flex items-start gap-6 p-8 bg-white hover:bg-neutral-50 transition-colors border-l-[3px] border-transparent hover:border-gold cursor-default">
                    <div className={`w-12 h-12 ${b.color} text-white flex items-center justify-center flex-shrink-0 rounded-sm`}>
                      {b.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-heading text-xl font-bold text-[#001A4D]">{b.title}</h3>
                        <span className="font-mono text-[11px] text-neutral-300 font-bold">{b.num}</span>
                      </div>
                      <p className="text-neutral-500 text-sm leading-relaxed">{b.desc}</p>
                    </div>
                  </div>
                </RevealSection>
              ))}
            </div>
          </div>
=======
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight, X, Calendar } from 'lucide-react'
import { EventCard, FeaturedCard, NewsCard } from '@/components/ui'

const galleryImages = [
  {
    src: '/highlight_1.jpg',
    alt: 'World Championships Debut',
    title: 'World Championships Debut',
    subtitle: "After a successful World Championships debut, India's 16-year-old shooter makes history.",
    className: 'object-top',
  },
  {
    src: '/highlight_2.jpg',
    alt: 'Mona Agarwal - Paris Paralympics 2024',
    title: 'Mona Agarwal',
    subtitle: "Mona Agarwal brings home India's first medal at the Paris Paralympics 2024.",
    className: 'object-center',
  },
  {
    src: '/highlight_3.jpg',
    alt: 'Avani Lekhara - Paris Paralympics 2024',
    title: 'Avani Lekhara',
    subtitle: "Avani Lekhara wins India's first gold in women's 10m air rifle (SH1) shooting event at the Paralympics 2024, in Paris, France.",
    className: 'object-top',
  },
]

type GalleryImage = {
  src: string
  alt: string
  title: string
  subtitle: string
  className?: string
}

type NewsItem = {
  id: number
  title: string
  slug: string
  excerpt: string
  category: string
  created_at: string
  featured_image_url?: string
  preview_image_url?: string
}

type EventItem = {
  id: number
  title: string
  slug: string
  location: string
  start_date: string
  end_date: string
  status: 'upcoming' | 'ongoing' | 'completed'
  description?: string
}

const HomePage = () => {
  const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
  console.log('Current API URL:', API_URL);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null)
  const [latestNews, setLatestNews] = useState<NewsItem[]>([])
  const [loadingNews, setLoadingNews] = useState(true)
  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)

  useEffect(() => {
    const fetchLatestNews = async () => {
      try {
        const res = await fetch(`${API_URL}/news?status=published&limit=3`)
        if (res.ok) {
          const json = await res.json()
          const data = json.data || json
          if (Array.isArray(data)) {
            setLatestNews(data.slice(0, 3))
          }
        }
      } catch (error) {
        console.error('Failed to fetch news:', error)
      } finally {
        setLoadingNews(false)
      }
    }

    const fetchUpcomingEvents = async () => {
      try {
        const res = await fetch(`${API_URL}/events`)
        if (res.ok) {
          const json = await res.json()
          const data = json.data || json
          if (Array.isArray(data)) {
            // Filter for upcoming events and sort by start date
            const upcoming = data
              .filter((event: EventItem) => event.status === 'upcoming' || event.status === 'ongoing')
              .sort((a: EventItem, b: EventItem) => 
                new Date(a.start_date).getTime() - new Date(b.start_date).getTime()
              )
              .slice(0, 3)
            setUpcomingEvents(upcoming)
          }
        }
      } catch (error) {
        console.error('Failed to fetch events:', error)
      } finally {
        setLoadingEvents(false)
      }
    }

    fetchLatestNews()
    fetchUpcomingEvents()
  }, [])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatEventDate = (startDate: string, endDate: string) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    
    if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
      return start.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    }
    return `${start.toLocaleDateString('en-US', { month: 'short' })} - ${end.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}`
  }

  return (
    <>
      {/* Image Lightbox Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
          <div
            className="relative max-w-5xl max-h-[90vh] w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedImage.src.startsWith('http') ? (
              <img
                src={selectedImage.src.replace('sz=w1000', 'sz=w2000')}
                alt={selectedImage.alt}
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg mx-auto"
              />
            ) : (
              <Image
                src={selectedImage.src}
                alt={selectedImage.alt}
                width={1200}
                height={800}
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
            )}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 rounded-b-lg">
              <h3 className="font-heading font-bold text-white text-xl">{selectedImage.title}</h3>
              <p className="text-white/80 text-sm mt-1">{selectedImage.subtitle}</p>
            </div>
          </div>
        </div>
      )}




      {/* Latest News & Updates Section */}
      <section className="section bg-white pb-2 md:pb-4">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="section-title">Latest News & Updates</h2>
            <Link
              href="/news"
              className="group inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View All News
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          {loadingNews ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 h-[400px] bg-neutral-100 rounded-2xl animate-pulse"></div>
              <div className="h-[400px] bg-neutral-100 rounded-2xl animate-pulse"></div>
            </div>
          ) : latestNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestNews.slice(0, 3).map((article) => (
                <NewsCard
                  key={article.id}
                  title={String(article.title || '')}
                  excerpt={String(article.excerpt || '')}
                  category={typeof article.category === 'string' ? article.category : 'News'}
                  date={formatDate(article.created_at || new Date().toISOString())}
                  imageUrl={article.preview_image_url || article.featured_image_url || '/news-hero-placeholder.png'}
                  href={`/news/${article.slug || article.id}`}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500">
              <p>No news articles available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* Upcoming Events Section */}
      <section className="section bg-neutral-50 pb-2 md:pb-4">
        <div className="container-main">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="section-title">Upcoming Events</h2>
            <Link
              href="/events"
              className="group inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
            >
              View Calendar
              <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>
          
          {loadingEvents ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-48 bg-neutral-100 rounded-xl animate-pulse"></div>
              ))}
            </div>
          ) : upcomingEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => {
                 const startDate = new Date(event.start_date);
                 return (
                    <EventCard 
                      key={event.id} 
                      title={event.title}
                      date={formatEventDate(event.start_date, event.end_date)}
                      location={event.location}
                      status={event.status}
                      href={`/events/${event.slug || event.id}`}
                      day={startDate.getDate().toString()}
                      month={startDate.toLocaleString('default', { month: 'short' }).toUpperCase()}
                    />
                 )
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-neutral-500">
              <p>No upcoming events at the moment. Check back soon!</p>
            </div>
          )}
>>>>>>> Stashed changes
        </div>
      </section>


<<<<<<< Updated upstream
      {/* ══════════════════════════════════════════
          NEWS — Carousel
      ══════════════════════════════════════════ */}
      <NewsCarousel articles={latestNews} />


      {/* ══════════════════════════════════════════
          EVENTS — Dark section with bold grid
      ══════════════════════════════════════════ */}
      <section id="events" className="py-28 px-6 bg-[#001A4D] relative overflow-hidden">
        {/* Background texture */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
          backgroundSize: '32px 32px',
        }} />
        {/* Gold diagonal accent */}
        <div className="absolute top-0 right-0 w-px h-full bg-gradient-to-b from-gold/0 via-gold/30 to-gold/0 hidden xl:block" style={{ right: '15%' }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-end justify-between mb-14">
            <RevealSection>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-[2px] bg-gold" />
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gold/60">Calendar</span>
                </div>
                <h2 className="font-heading text-[clamp(28px,4vw,48px)] font-black text-white leading-tight">
                  Upcoming Championships
                </h2>
              </div>
            </RevealSection>
            <RevealSection>
              <Link href="/events" className="hidden sm:inline-flex items-center gap-2 text-[12px] font-black tracking-[0.2em] uppercase text-gold border-b-2 border-gold/40 pb-1 hover:border-gold transition-colors">
                Full Calendar
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </RevealSection>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-white/10">
            {realEvents.map((event: any, i: number) => (
              <RevealSection key={`${event.day}-${event.month}-${i}`} delay={i * 80}>
                <EventCard {...event} />
              </RevealSection>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          STATS — Giant typographic numbers
      ══════════════════════════════════════════ */}
      <section className="py-24 px-6 bg-white border-y border-neutral-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-100">
            {stats.map((stat, i) => (
              <RevealSection key={stat.label} delay={i * 80} className="flex flex-col items-center py-10 px-6 text-center group">
                <div className="font-heading text-[clamp(40px,6vw,72px)] font-black text-[#001A4D] leading-none mb-2 group-hover:text-gold transition-colors duration-300">
                  {stat.value}
                </div>
                <div className="w-6 h-[2px] bg-gold mb-3" />
                <div className="text-[10px] font-black tracking-[0.2em] uppercase text-neutral-400">{stat.label}</div>
              </RevealSection>
            ))}
          </div>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          MEDIA — Cinematic dark cards
      ══════════════════════════════════════════ */}
      <section className="py-28 px-6 bg-[#0A0F1E] relative overflow-hidden">
        <div className="absolute inset-0 opacity-20" style={{
          background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,61,165,0.6) 0%, transparent 70%)',
        }} />

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="flex items-end justify-between mb-14">
            <RevealSection>
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-[2px] bg-gold" />
                  <span className="text-[10px] font-black tracking-[0.3em] uppercase text-gold/50">Coverage</span>
                </div>
                <h2 className="font-heading text-[clamp(28px,4vw,48px)] font-black text-white leading-tight">
                  Featured Media
                </h2>
              </div>
            </RevealSection>
            <RevealSection>
              <Link href="/media" className="hidden sm:inline-flex items-center gap-2 text-[12px] font-black tracking-[0.2em] uppercase text-gold border-b-2 border-gold/40 pb-1 hover:border-gold transition-colors">
                Media Gallery
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
              </Link>
            </RevealSection>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredMedia.map((item, i) => (
              <RevealSection key={item.title} delay={i * 100}>
                <MediaCard {...item} />
              </RevealSection>
=======

      {/* Highlights & Achievements Gallery */}
       <section className="section bg-white pb-2 md:pb-4">
        <div className="container-main">
          <div className="flex justify-between items-center mb-12">
             <h2 className="section-title mb-0">Highlights & Achievements</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {galleryImages.map((image, idx) => (
               <NewsCard
                  key={idx}
                  title={image.title}
                  excerpt={image.subtitle}
                  date="Featured" 
                  imageUrl={image.src} 
                  imageClassName={image.className}
                  href="#"
               />
>>>>>>> Stashed changes
            ))}
          </div>
        </div>
      </section>

<<<<<<< Updated upstream

      {/* ══════════════════════════════════════════
          DOCUMENTS — Latest downloads
      ══════════════════════════════════════════ */}
      <DocumentsSection />


      {/* ══════════════════════════════════════════
          CTA — Full-bleed dramatic registration push
      ══════════════════════════════════════════ */}
      <section className="relative py-32 px-6 overflow-hidden bg-[#001A4D]">
        {/* Radial glow */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse 80% 100% at 50% 100%, rgba(200,164,21,0.12) 0%, transparent 70%)',
        }} />
        {/* Grid */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />
        {/* Top gold line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-gold to-transparent" />

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <RevealSection>
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-gold/30 bg-gold/5 rounded-none mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-gold/80">Applications Open — 2026</span>
            </div>
          </RevealSection>

          <RevealSection delay={100}>
            <h2 className="font-heading text-[clamp(36px,6vw,80px)] font-black text-white leading-[0.95] mb-6">
              Ready to Step Up<br />
              <em className="text-gold italic">to the Firing Line?</em>
            </h2>
          </RevealSection>

          <RevealSection delay={200}>
            <p className="text-lg text-white/50 max-w-xl mx-auto mb-12 leading-relaxed">
              Join the national roster and begin your journey toward sporting excellence. Takes only 5 minutes. Have your ID ready.
            </p>
          </RevealSection>

          <RevealSection delay={300}>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/registration"
                className="group inline-flex items-center justify-center gap-3 px-10 py-5 bg-gold text-[#001A4D] font-extrabold text-[13px] tracking-[0.12em] uppercase hover:bg-white transition-all duration-200 shadow-[0_0_40px_rgba(200,164,21,0.3)] hover:shadow-[0_0_60px_rgba(200,164,21,0.5)]"
              >
                Start Your Registration
                <svg className="group-hover:translate-x-1 transition-transform" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
              <Link
                href="/classification"
                className="inline-flex items-center justify-center gap-3 px-10 py-5 border border-white/20 text-white font-bold text-[13px] tracking-[0.12em] uppercase hover:border-white/60 hover:bg-white/5 transition-all"
              >
                View Classification
              </Link>
            </div>
          </RevealSection>
        </div>
      </section>


      {/* ══════════════════════════════════════════
          PARTNERS — Clean authority strip
      ══════════════════════════════════════════ */}
      <section className="py-16 px-6 bg-white border-t border-neutral-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-[10px] font-black tracking-[0.35em] uppercase text-neutral-300 text-center mb-12">
            Recognised &amp; Supported By
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-neutral-100 border border-neutral-100">
            {partners.map(({ name, short }) => (
              <div key={short} className="py-8 px-6 flex flex-col items-center justify-center text-center group hover:bg-neutral-50 transition-colors">
                <span className="font-heading text-[28px] md:text-[32px] font-black text-neutral-150 group-hover:text-[#001A4D] transition-colors leading-none mb-2" style={{ color: '#D8DEE9' }}>
                  {short}
                </span>
                <span className="text-[9px] text-neutral-400 tracking-[0.15em] uppercase font-bold leading-tight">{name}</span>
=======
      {/* Featured Videos Section */}
      <section className="section bg-neutral-50">
        <div className="container-main">
          <h2 className="section-title text-center mb-12">Featured Videos</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[
              'PVKBcmWnlHw',
              'CC5oe68AkqE',
              'dxT_9RBQpjc',
              'Hmffj6csbr8'
            ].map((videoId) => (
              <div key={videoId} className="aspect-video rounded-card overflow-hidden shadow-card">
                <iframe
                  className="w-full h-full"
                  src={`https://www.youtube.com/embed/${videoId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
>>>>>>> Stashed changes
              </div>
            ))}
          </div>
        </div>
      </section>
<<<<<<< Updated upstream

    </div>
  )
}
=======
    </>
  )
}

export default HomePage
>>>>>>> Stashed changes
