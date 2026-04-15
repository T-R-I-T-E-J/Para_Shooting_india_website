'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'

export default function NewsFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  
  const initialCategory = searchParams.get('category') || 'All News'
  const initialSearch = searchParams.get('q') || ''
  
  const [activeCategory, setActiveCategory] = useState(initialCategory)
  const [searchQuery, setSearchQuery] = useState(initialSearch)

  const categories = ['All News', 'Championships', 'Press Releases', 'Classification', 'General']

  useEffect(() => {
    setActiveCategory(searchParams.get('category') || 'All News')
    setSearchQuery(searchParams.get('q') || '')
  }, [searchParams])

  const handleCategoryClick = (cat: string) => {
    setActiveCategory(cat)
    updateUrl(cat, searchQuery)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrl(activeCategory, searchQuery)
  }

  const updateUrl = (cat: string, q: string) => {
    const params = new URLSearchParams()
    if (cat !== 'All News') params.set('category', cat)
    if (q.trim()) params.set('q', q.trim())
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="flex flex-wrap items-center gap-2 mb-8">
      {categories.map(cat => (
        <button
          key={cat}
          onClick={() => handleCategoryClick(cat)}
          className={`px-4 py-2 rounded-full text-[11px] font-bold tracking-wider uppercase transition-all duration-300 ${
            activeCategory === cat 
              ? 'bg-navy text-white shadow-md' 
              : 'bg-white text-neutral-500 border border-neutral-200 hover:border-navy hover:text-navy'
          }`}
        >
          {cat}
        </button>
      ))}
      {/* Search Input visually appended to filters */}
      <form onSubmit={handleSearchSubmit} className="ml-auto relative w-full md:w-[300px] mt-4 md:mt-0">
        <svg className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search news…" 
          name="q"
          aria-label="Search news articles"
          className="w-full pl-10 pr-4 py-2.5 text-sm bg-white border border-neutral-200 rounded-full focus:outline-none focus:border-navy focus:ring-1 focus:ring-navy transition-all"
        />
      </form>
    </div>
  )
}
