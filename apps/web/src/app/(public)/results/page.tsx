'use client'

import React, { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import HeroSection from '@/components/public/HeroSection'
import ResultCard from '@/components/public/ResultCard'
import PageSearchInput from '@/components/public/PageSearchInput'
import Link from 'next/link'

interface Result {
  id: string
  title: string
  date: string
  description?: string
  url: string
  uploadedAt: string
}

export default function ResultsPage() {
  const searchParams = useSearchParams()
  const activeYear = searchParams.get('year') || 'All Time'
  const sq = searchParams.get('q')?.toLowerCase() || ''
  
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadResults() {
      try {
        setLoading(true)
        // Fetch from the local proxy path
        const res = await fetch('/api/v1/results')
        if (!res.ok) throw new Error('Failed to load results from server')
        const json = await res.json()
        const data = Array.isArray(json) ? json : json.data || []
        setResults(data)
        setError(null)
      } catch (err) {
        console.error('[Results] Fetch error:', err)
        setError('Unable to fetch results at this time.')
      } finally {
        setLoading(false)
      }
    }
    loadResults()
  }, [])
  
  const filteredResults = results.filter(r => {
    const matchesYear = activeYear === 'All Time' || r.date.includes(activeYear);
    const matchesQuery = !sq || 
      r.title.toLowerCase().includes(sq) || 
      (r.description || '').toLowerCase().includes(sq);
    return matchesYear && matchesQuery;
  }).sort((a, b) => {
    return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
  })

  return (
    <div>
      <HeroSection 
        eyebrow="Competitions"
        titlePart1="Results &"
        titlePart2Em="Standings"
        subtitle="Download official result books, ranking lists, and certificates from all national and zonal para shooting championships."
      />
      
      <section className="py-16 px-6 bg-neutral-100 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {/* Filters & Search */}
          <div className="flex flex-col md:flex-row gap-4 mb-8 justify-between items-start md:items-center">
            <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 hide-scrollbar w-full md:w-auto">
              {['All Time', '2026', '2025', '2024', '2023'].map((year) => (
                <Link 
                  href={year === 'All Time' ? '/results' : `/results?year=${year}`}
                  key={year}
                  className={`flex-shrink-0 px-5 py-2.5 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-300 ${
                    activeYear === year ? 'bg-navy text-white shadow-md' : 'bg-white text-neutral-500 border border-neutral-200 hover:border-navy hover:text-navy'
                  }`}
                >
                  {year}
                </Link>
              ))}
            </div>
            <PageSearchInput placeholder="Search results..." />
          </div>

          <div className="flex flex-col gap-4">
            {loading ? (
              [1, 2, 3].map(i => (
                <div key={i} className="h-24 w-full bg-white animate-pulse rounded-2xl border border-neutral-200" />
              ))
            ) : error ? (
              <div className="py-12 text-center text-red-500 bg-white border border-red-100 rounded-2xl">
                {error}
              </div>
            ) : filteredResults.length > 0 ? (
              filteredResults.map((result) => (
                <ResultCard 
                  key={result.id} 
                  championship={result.title}
                  date={result.date}
                  location={result.description || 'Championship Venue'}
                  matchCount={12}
                  fileUrl={result.url}
                />
              ))
            ) : (
              <div className="py-12 text-center text-neutral-500 bg-white border border-neutral-200 rounded-2xl">
                No results found {sq && `for "${sq}"`} {activeYear !== 'All Time' && `in ${activeYear}`}.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
