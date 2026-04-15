'use client'

import React, { useState, useEffect } from 'react'
import NewsCard from '@/components/public/NewsCard'
import NewsFilter from '@/components/public/NewsFilter'
import { DUMMY_NEWS } from '@/data/news-dummy'
import { useSearchParams } from 'next/navigation'

interface NewsArticle {
  id: number
  title: string
  slug: string
  excerpt?: string
  content: string
  category: string
  published_at: string
  featured_image_url?: string
  gradientFrom?: string
  gradientTo?: string
}

const categoryMap: Record<string, string> = {
  Championships: 'EVENT',
  'Press Releases': 'PRESS_RELEASE',
  Classification: 'ANNOUNCEMENT',
  General: 'NEWS',
  Announcement: 'ANNOUNCEMENT',
}

const formatDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })

const GRADIENTS = [
  ['#001A4D', '#003DA5'],
  ['#C8A415', '#8B7005'],
  ['#046A38', '#014022'],
]

export default function NewsPage() {
  const searchParams = useSearchParams()
  const categoryParam = searchParams.get('category')
  const qParam = searchParams.get('q')

  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadNews() {
      try {
        setLoading(true)
        const res = await fetch('/api/v1/news?status=published')
        if (!res.ok) throw new Error('API unavailable')
        const json = await res.json()
        const data: NewsArticle[] = Array.isArray(json) ? json : json.data || []
        setArticles(data)
      } catch {
        setArticles([])
      } finally {
        setLoading(false)
      }
    }
    loadNews()
  }, [])

  let news = articles.map((n, i) => ({
    id: n.id,
    slug: n.slug,
    category: n.category,
    date: formatDate(n.published_at || new Date().toISOString()),
    title: n.title,
    snippet: n.excerpt || (n.content ? n.content.replace(/<[^>]+>/g, '').substring(0, 160) + '…' : ''),
    imageGradientFrom: (n as any).gradientFrom || GRADIENTS[i % 3][0],
    imageGradientTo: (n as any).gradientTo || GRADIENTS[i % 3][1],
    featuredImage: n.featured_image_url,
  }))

  if (categoryParam && categoryParam !== 'All News') {
    const catSearch = categoryMap[categoryParam] || categoryParam.toUpperCase().replace(/\s+/g, '_')
    news = news.filter((n) => n.category === catSearch)
  }

  if (qParam) {
    const q = qParam.toLowerCase()
    news = news.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.snippet.toLowerCase().includes(q) ||
        n.category.toLowerCase().includes(q),
    )
  }

  return (
    <div className="bg-white min-h-screen">

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-primary">
        <div className="absolute inset-0 pointer-events-none select-none overflow-hidden">
          <span className="absolute -top-8 right-[-5%] font-heading text-[22vw] font-bold text-white/[0.04] leading-none tracking-tighter">
            NEWS
          </span>
        </div>
        <div className="max-w-7xl mx-auto relative">
          <p className="text-[#C8A415] font-body text-[11px] font-bold tracking-[0.35em] uppercase mb-4">
            Media Centre
          </p>
          <h1 className="font-heading text-5xl md:text-7xl font-bold text-white leading-[1.05] mb-6">
            News &<br />
            <em className="text-[#C8A415] not-italic">Announcements</em>
          </h1>
          <p className="text-white/70 font-body text-lg max-w-2xl leading-relaxed">
            Latest press releases, championship reports, and official notices from STC Para Shooting India.
          </p>
        </div>
      </section>

      {/* Filter bar */}
      <section className="px-6 py-6 border-b border-neutral-200 bg-neutral-50">
        <div className="max-w-7xl mx-auto">
          <NewsFilter />
        </div>
      </section>

      {/* Content */}
      <section className="max-w-7xl mx-auto px-6 py-12 pb-24">

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="border border-neutral-200 overflow-hidden">
                <div className="h-52 bg-neutral-100 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-3 w-20 bg-neutral-100 animate-pulse" />
                  <div className="h-5 bg-neutral-100 animate-pulse" />
                  <div className="h-4 w-3/4 bg-neutral-100 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : news.length === 0 ? (
          <div className="py-20 text-center text-neutral-400 border border-neutral-200 bg-neutral-50">
            <svg className="w-10 h-10 mx-auto mb-4 text-neutral-300" fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
            <p className="font-heading text-lg font-bold text-neutral-600 mb-1">No articles found</p>
            <p className="text-sm">Try adjusting your filter or search query.</p>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading text-xl font-bold text-neutral-900">
                {categoryParam && categoryParam !== 'All News' ? categoryParam : 'All Articles'}
              </h2>
              <span className="text-[11px] text-neutral-400">
                {news.length} article{news.length !== 1 ? 's' : ''}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {news.map((item) => (
                <NewsCard
                  key={item.slug}
                  category={item.category}
                  date={item.date}
                  title={item.title}
                  snippet={item.snippet}
                  imageGradientFrom={item.imageGradientFrom}
                  imageGradientTo={item.imageGradientTo}
                  featuredImage={item.featuredImage}
                  slug={item.slug}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  )
}
