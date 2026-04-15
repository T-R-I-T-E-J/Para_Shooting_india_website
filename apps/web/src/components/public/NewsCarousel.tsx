'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { DUMMY_NEWS, CATEGORY_COLORS } from '@/data/news-dummy'

interface CarouselItem {
  id: number
  slug: string
  title: string
  excerpt: string
  category: string
  published_at: string
  featured_image_url?: string
  gradientFrom: string
  gradientTo: string
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

function ArrowIcon({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      {dir === 'left'
        ? <><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></>
        : <><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></>
      }
    </svg>
  )
}

export default function NewsCarousel({ articles }: { articles?: CarouselItem[] }) {
  const items: CarouselItem[] = articles?.length ? articles : []
  const trackRef = useRef<HTMLDivElement>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  // Determine how many cards are visible based on container width
  const getVisible = useCallback(() => {
    if (typeof window === 'undefined') return 3
    if (window.innerWidth < 640) return 1
    if (window.innerWidth < 1024) return 2
    return 3
  }, [])

  const [visible, setVisible] = useState(3)

  useEffect(() => {
    setVisible(getVisible())
    const handler = () => setVisible(getVisible())
    window.addEventListener('resize', handler)
    return () => window.removeEventListener('resize', handler)
  }, [getVisible])

  const maxIndex = Math.max(0, items.length - visible)

  const scrollTo = useCallback((index: number) => {
    const clamped = Math.max(0, Math.min(index, maxIndex))
    setActiveIndex(clamped)
    const track = trackRef.current
    if (!track || items.length === 0) return
    const cardWidth = track.scrollWidth / items.length
    track.scrollTo({ left: clamped * cardWidth, behavior: 'smooth' })
  }, [maxIndex, items.length])

  // Auto-scroll every 4 seconds
  useEffect(() => {
    if (isPaused || items.length === 0) return
    const timer = setInterval(() => {
      setActiveIndex((prev) => {
        const next = prev >= maxIndex ? 0 : prev + 1
        scrollTo(next)
        return next
      })
    }, 4000)
    return () => clearInterval(timer)
  }, [isPaused, maxIndex, scrollTo, items.length])

  // Don't render the section at all if there's no content
  if (items.length === 0) return null

  return (
    <section className="py-16 px-6 bg-white border-t border-neutral-100">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex items-end justify-between mb-8">
          <div>
            <p className="text-[#C8A415] text-[10px] font-bold tracking-[0.35em] uppercase mb-2">
              Latest Updates
            </p>
            <h2 className="font-heading text-3xl font-bold text-neutral-900">
              News & Announcements
            </h2>
          </div>
          <div className="flex items-center gap-3">
            {/* Arrow buttons */}
            <button
              onClick={() => scrollTo(activeIndex - 1)}
              disabled={activeIndex === 0}
              aria-label="Previous news"
              className="w-10 h-10 flex items-center justify-center border border-neutral-200 text-neutral-400 hover:border-primary hover:text-primary hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
            >
              <ArrowIcon dir="left" />
            </button>
            <button
              onClick={() => scrollTo(activeIndex + 1)}
              disabled={activeIndex >= maxIndex}
              aria-label="Next news"
              className="w-10 h-10 flex items-center justify-center border border-neutral-200 text-neutral-400 hover:border-primary hover:text-primary hover:bg-primary/5 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200 cursor-pointer"
            >
              <ArrowIcon dir="right" />
            </button>
            <Link
              href="/news"
              className="hidden sm:inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-primary border border-primary/30 px-4 py-2 hover:bg-primary/5 transition-colors ml-2"
            >
              All News
              <ArrowIcon dir="right" />
            </Link>
          </div>
        </div>

        {/* Carousel Track */}
        <div
          ref={trackRef}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="flex gap-4 overflow-x-auto scroll-smooth hide-scrollbar"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {items.map((item) => {
            const catColor = CATEGORY_COLORS[item.category] ?? '#003DA5'
            return (
              <Link
                key={item.id}
                href={`/news/${item.slug}`}
                className="group flex-shrink-0 flex flex-col bg-white border border-neutral-200 hover:border-neutral-300 hover:shadow-md transition-all duration-300 overflow-hidden cursor-pointer"
                style={{
                  scrollSnapAlign: 'start',
                  width: visible === 1 ? '100%' : visible === 2 ? 'calc(50% - 8px)' : 'calc(33.333% - 11px)',
                  minWidth: visible === 1 ? '100%' : visible === 2 ? 'calc(50% - 8px)' : 'calc(33.333% - 11px)',
                }}
              >
                {/* Thumbnail */}
                <div className="relative h-48 overflow-hidden flex-shrink-0">
                  {item.featured_image_url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={item.featured_image_url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div
                      className="w-full h-full group-hover:scale-105 transition-transform duration-500"
                      style={{ background: `linear-gradient(135deg, ${item.gradientFrom}, ${item.gradientTo})` }}
                    />
                  )}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
                  {/* Category badge */}
                  <div className="absolute top-3 left-3">
                    <span
                      className="text-[9px] font-extrabold tracking-[0.2em] uppercase px-2 py-0.5 bg-white"
                      style={{ color: catColor }}
                    >
                      {item.category.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex flex-col flex-1">
                  <p className="text-neutral-400 text-[11px] mb-2">{formatDate(item.published_at)}</p>
                  <h3 className="font-heading text-[0.95rem] font-bold text-neutral-900 leading-snug mb-3 group-hover:text-primary transition-colors line-clamp-2 flex-1">
                    {item.title}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-primary/70 group-hover:text-primary transition-colors mt-auto">
                    Read More
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
                    </svg>
                  </span>
                </div>
              </Link>
            )
          })}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-1.5 mt-6">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <button
              key={i}
              onClick={() => scrollTo(i)}
              aria-label={`Go to slide ${i + 1}`}
              className={`transition-all duration-300 cursor-pointer ${
                i === activeIndex
                  ? 'w-6 h-1.5 bg-primary'
                  : 'w-1.5 h-1.5 bg-neutral-300 hover:bg-neutral-400'
              }`}
            />
          ))}
        </div>

        {/* Mobile CTA */}
        <div className="mt-6 text-center sm:hidden">
          <Link
            href="/news"
            className="inline-flex items-center gap-2 text-[11px] font-bold tracking-widest uppercase text-primary border border-primary/30 px-5 py-2.5 hover:bg-primary/5 transition-colors"
          >
            View All News <ArrowIcon dir="right" />
          </Link>
        </div>
      </div>
    </section>
  )
}
