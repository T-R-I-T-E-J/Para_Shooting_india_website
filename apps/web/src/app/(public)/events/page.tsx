'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, MapPin, AlertCircle } from 'lucide-react'

interface Event {
  id: number
  title: string
  slug: string
  description?: string
  location: string
  start_date: string
  end_date: string
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled'
  registration_link?: string
  circular_link?: string
  is_featured: boolean
}

const statusConfig = {
  upcoming: { label: 'Upcoming', color: '#C8A415', bg: '#C8A41510', border: '#C8A41530' },
  ongoing: { label: 'Live Now', color: '#046A38', bg: '#046A3810', border: '#046A3830' },
  completed: { label: 'Completed', color: '#475569', bg: '#47556910', border: '#47556930' },
  cancelled: { label: 'Cancelled', color: '#DC2626', bg: '#DC262610', border: '#DC262630' },
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://final-production-q1yw.onrender.com/api/v1'
      const res = await fetch(`${API_URL}/events`)
      if (res.ok) {
        const json = await res.json()
        setEvents(json.data || json)
      } else {
        setError('Failed to load events')
      }
    } catch (err) {
      console.error('Failed to fetch events:', err)
      setError('An error occurred while loading events')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
  }

  const formatDateShort = (dateString: string) => {
    const date = new Date(dateString)
    return {
      day: date.getDate().toString().padStart(2, '0'),
      month: date.toLocaleString('default', { month: 'short' }).toUpperCase(),
      year: date.getFullYear(),
    }
  }

  const upcomingEvents = events.filter((e) => e.status === 'upcoming' || e.status === 'ongoing')
  const pastEvents = events.filter((e) => e.status === 'completed')
  const cancelledEvents = events.filter((e) => e.status === 'cancelled')

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-primary">
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <span className="absolute -top-8 right-[-5%] font-heading text-[22vw] font-bold text-white/[0.04] leading-none tracking-tighter">
            EVENTS
          </span>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <p className="text-[#C8A415] font-body text-[11px] font-bold tracking-[0.35em] uppercase mb-4">Calendar</p>
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6">
            Competitions &<br />
            <em className="text-[#C8A415] not-italic">Championships</em>
          </h1>
          <p className="text-white/70 font-body text-lg max-w-2xl leading-relaxed">
            National and international para shooting competitions, qualifying trials, and coaching camps. Stay updated on all sanctioned events.
          </p>
        </div>
      </section>

      {/* Upcoming */}
      <section className="px-6 py-12 pb-16">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-heading text-2xl font-bold text-neutral-900">Upcoming Competitions</h2>
            {!loading && upcomingEvents.length > 0 && (
              <span className="text-[10px] font-bold tracking-widest uppercase text-[#C8A415] bg-[#C8A415]/10 border border-[#C8A415]/25 px-3 py-1.5">
                {upcomingEvents.length} Event{upcomingEvents.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 bg-neutral-100 border border-neutral-200 animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="py-16 text-center border border-neutral-200 bg-neutral-50">
              <AlertCircle className="w-10 h-10 text-red-400 mx-auto mb-4" />
              <p className="text-neutral-500 mb-6">{error}</p>
              <button
                onClick={fetchEvents}
                className="bg-primary text-white font-extrabold text-[12px] tracking-widest uppercase px-6 py-3 hover:bg-primary-light transition-colors cursor-pointer"
              >
                Try Again
              </button>
            </div>
          ) : upcomingEvents.length === 0 ? (
            <div className="py-16 text-center border border-neutral-200 bg-neutral-50">
              <Calendar className="w-10 h-10 text-neutral-300 mx-auto mb-4" />
              <p className="text-neutral-500 mb-2">No upcoming events at the moment</p>
              <p className="text-neutral-400 text-sm">Check back soon for new competitions and championships</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {upcomingEvents.map((event) => {
                const d = formatDateShort(event.start_date)
                const cfg = statusConfig[event.status] || statusConfig.upcoming
                return (
                  <div
                    key={event.id}
                    className="group bg-white border border-neutral-200 hover:border-[#C8A415]/40 hover:bg-neutral-50 transition-all duration-300"
                  >
                    <div className="flex gap-0">
                      {/* Date block */}
                      <div className="flex-shrink-0 w-20 bg-[#C8A415]/10 border-r border-neutral-200 flex flex-col items-center justify-center py-6">
                        <span className="font-heading text-3xl font-bold text-[#C8A415] leading-none">{d.day}</span>
                        <span className="text-[9px] font-bold tracking-widest uppercase text-[#C8A415]/70 mt-1">{d.month}</span>
                        <span className="text-[10px] text-neutral-400 mt-0.5">{d.year}</span>
                      </div>
                      {/* Info */}
                      <div className="flex-1 p-5">
                        <div className="flex items-center gap-2 mb-3">
                          <span
                            className="text-[9px] font-bold tracking-wider uppercase px-2 py-0.5"
                            style={{ color: cfg.color, backgroundColor: cfg.bg, border: `1px solid ${cfg.border}` }}
                          >
                            {cfg.label}
                          </span>
                        </div>
                        <h3 className="font-heading text-sm font-bold text-neutral-900 leading-snug mb-2 group-hover:text-[#C8A415] transition-colors">
                          {event.title}
                        </h3>
                        <p className="flex items-center gap-1.5 text-neutral-500 text-[12px]">
                          <MapPin className="w-3 h-3 flex-shrink-0" />
                          {event.location}
                        </p>
                        {event.registration_link && (
                          <a
                            href={event.registration_link}
                            className="inline-block mt-3 text-[10px] font-bold tracking-widest uppercase text-[#C8A415] hover:underline"
                          >
                            Register →
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </section>

      {/* Past Events */}
      {!loading && pastEvents.length > 0 && (
        <section className="px-6 pb-16 border-t border-neutral-200 pt-12 bg-neutral-50">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-2xl font-bold text-neutral-900">Recent Results</h2>
              <Link
                href="/results"
                className="text-[11px] font-bold tracking-widest uppercase text-[#C8A415] hover:text-[#b8940f] transition-colors"
              >
                View All Results →
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pastEvents.slice(0, 4).map((event) => (
                <div
                  key={event.id}
                  className="bg-white border border-neutral-200 p-6 flex items-start gap-5 hover:border-neutral-300 transition-colors"
                >
                  <div className="flex-shrink-0 w-12 h-12 bg-neutral-100 border border-neutral-200 flex items-center justify-center">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5">
                      <path d="M22 11.08V12a10 10 0 11-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold tracking-widest uppercase text-neutral-400">
                      Completed · {formatDate(event.end_date)}
                    </span>
                    <h3 className="font-heading text-base font-bold text-neutral-900 mt-1 mb-1 leading-snug">{event.title}</h3>
                    <p className="flex items-center gap-1.5 text-neutral-500 text-[12px]">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {event.location}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Cancelled */}
      {!loading && cancelledEvents.length > 0 && (
        <section className="px-6 pb-16 border-t border-neutral-200 pt-12">
          <div className="max-w-7xl mx-auto">
            <h2 className="font-heading text-xl font-bold text-neutral-400 mb-6">Cancelled Events</h2>
            <div className="space-y-2">
              {cancelledEvents.map((event) => (
                <div key={event.id} className="bg-neutral-50 border border-neutral-200 px-6 py-4 flex items-center gap-4">
                  <span className="text-[9px] font-bold tracking-widest uppercase text-red-500 bg-red-50 border border-red-200 px-2 py-0.5">Cancelled</span>
                  <span className="text-neutral-400 text-sm line-through">{event.title}</span>
                  <span className="ml-auto text-neutral-300 text-[11px]">{formatDate(event.start_date)}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  )
}
