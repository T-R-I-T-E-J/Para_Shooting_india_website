<<<<<<< Updated upstream
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
        if (data.length === 0) throw new Error('No data')
        setArticles(data)
      } catch {
        setArticles(DUMMY_NEWS as unknown as NewsArticle[])
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
=======
import Link from 'next/link'
import { Calendar, ArrowRight, Tag } from 'lucide-react'
import { FeaturedCard, NewsCard } from '@/components/ui'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'News & Updates',
  description: 'Latest news, announcements, and updates from Para Shooting Committee of India.',
}

async function getNews() {
  try {
    const backendUrl = 'https://parashooting.in';
    let apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || backendUrl;
    
    // Ensure absolute URL for server-side
    if (apiUrl.startsWith('/')) {
      apiUrl = `${backendUrl}${apiUrl}`;
    }
    
    // Normalize /api/v1
    if (!apiUrl.includes('/api/v1')) {
       apiUrl = `${apiUrl}/api/v1`;
    }
    apiUrl = apiUrl.replace(/\/api\/v1\/api\/v1$/, '/api/v1');

    console.log('[NewsPage] Fetching news from:', apiUrl);

    const res = await fetch(`${apiUrl}/news?status=published`, {
      cache: 'no-store',
    })
    
    if (!res.ok) {
       console.error('[NewsPage] Fetch failed:', res.status, res.statusText, apiUrl);
       return []
    }

    const json = await res.json()
    const data = json.data || json
    const articles = Array.isArray(data) ? data : [];

    // Sanitize image URLs in the data directly
    return articles.map((article: any) => {
       const sanitize = (url: string) => {
          if (!url) return null;
          let clean = url
            .replace('http://localhost:8080', backendUrl)
            .replace('http://localhost:4000', backendUrl)
            .replace('http://localhost:10000', backendUrl)
            .replace('https://webtesters.in', backendUrl); // Fix legacy URLs
          
          if (clean.startsWith('/')) {
             clean = `${backendUrl}${clean}`;
          }
          return clean;
       };
       
       return {
          ...article,
          featured_image_url: sanitize(article.featured_image_url),
          preview_image_url: sanitize(article.preview_image_url)
       };
    });
  } catch (error) {
    console.error('Error fetching news:', error)
    return []
  }
}

const NewsPage = async ({ searchParams }: { searchParams: { category?: string } }) => {
  const allNews = await getNews()
  const categoryFilter = searchParams?.category
  
  // Sort by date (newest first)
  const sortedNews = [...allNews].sort((a: any, b: any) => 
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  )

  const displayedNews = categoryFilter && categoryFilter !== 'All'
    ? sortedNews.filter((n: any) => n.category?.toUpperCase() === categoryFilter.toUpperCase())
    : sortedNews

  // Determine Hero and Side articles
  // Prioritize featured items for top section
  const featuredItems = displayedNews.filter((n: any) => n.is_featured)
  const regularItems = displayedNews.filter((n: any) => !n.is_featured)
  
  // Hero is first featured, or first regular if no featured
  const heroArticle = featuredItems.length > 0 ? featuredItems[0] : displayedNews[0]
  
  // Side articles are next 2 featured, or empty if we ran out of featured
  // (We won't fill side entries with regular items to maintain "Featured" semantic, 
  // unless we want to fill layout. Let's keep it strict for now).
  const sideArticles = featuredItems.length > 1 ? featuredItems.slice(1, 3) : []

  // Remaining articles go to grid
  const gridArticles = displayedNews.filter(
    (n: any) => n.id !== heroArticle?.id && !sideArticles.find((s: any) => s.id === n.id)
  )
  
  const categories = ['All', 'NEWS', 'ANNOUNCEMENT', 'RESULT', 'ACHIEVEMENT', 'EVENT', 'PRESS_RELEASE']

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const getCategoryImage = (category: string) => {
      // Fallback emoji based on category if no image
      switch(category) {
          case 'RESULT': return '🏆'
          case 'ACHIEVEMENT': return '🥇'
          case 'EVENT': return '📅'
          default: return '📰'
      }
  }

  return (
    <>


      {/* Breadcrumb */}
      <nav className="bg-neutral-50 border-b border-neutral-200 py-4 text-sm" aria-label="Breadcrumb">
        <div className="container-main">
          <ol className="flex items-center gap-2 text-neutral-500">
            <li><Link href="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li>/</li>
            <li className="text-neutral-900 font-medium">News</li>
          </ol>
        </div>
      </nav>

      {/* Category Filter */}
      <section className="py-6 bg-white border-b border-neutral-200">
        <div className="container-main">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Link
                key={category}
                href={category === 'All' ? '/news' : `/news?category=${category}`}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  (category === 'All' && !categoryFilter) || category === categoryFilter
                    ? 'bg-primary text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-primary/10 hover:text-primary'
                }`}
              >
                {category.charAt(0) + category.slice(1).toLowerCase().replace('_', ' ')}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="section bg-white">
         <div className="container-main">
            {!heroArticle ? (
                <div className="text-center py-12 text-neutral-500">
                    No news articles found in this category.
                </div>
            ) : (
                <>
                {/* Featured Section */}
                 <h2 className="section-title mb-8">Featured News</h2>
                 <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                   {/* Main Hero Article */}
                   <div className={sideArticles.length > 0 ? "lg:col-span-2" : "lg:col-span-3"}>
                      <FeaturedCard
                        title={String(heroArticle.title || '')}
                        excerpt={String(heroArticle.excerpt || '')}
                        category={typeof heroArticle.category === 'string' ? heroArticle.category : 'NEWS'}
                        date={formatDate(heroArticle.created_at)}
                        imageUrl={heroArticle.featured_image_url || heroArticle.preview_image_url || '/news-hero-placeholder.png'}
                        href={`/news/${heroArticle.slug || heroArticle.id}`}
                      />
                   </div>

                   {/* Side Featured Articles */}
                   {sideArticles.length > 0 && (
                       <div className="flex flex-col gap-6">
                         {sideArticles.map((article: any) => (
                           <Link key={article.id} href={`/news/${article.slug || article.id}`} className="group relative flex flex-col gap-4 rounded-xl bg-white p-4 shadow-sm transition-all hover:shadow-md border border-neutral-100 h-full">
                             <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-neutral-200">
                               {article.preview_image_url || article.featured_image_url ? (
                                  <img src={article.preview_image_url || article.featured_image_url} alt={article.title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />
                               ) : (
                                  <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                                    <span className="text-2xl">{getCategoryImage(String(article.category))}</span>
                                  </div>
                               )}
                             </div>
                             <div className="flex flex-1 flex-col">
                               <div className="flex items-center justify-between mb-2">
                                   <span className="text-xs font-bold text-blue-600 px-2 py-0.5 rounded bg-blue-50">{String(article.category)}</span>
                                   <span className="text-xs text-neutral-400">{formatDate(article.created_at)}</span>
                               </div>
                               <h4 className="font-heading font-semibold text-neutral-800 group-hover:text-blue-700 transition-colors line-clamp-2 leading-tight">
                                  {String(article.title)}
                               </h4>
                             </div>
                           </Link>
                         ))}
                       </div>
                   )}
                 </div>

                 {/* All News Grid */}
                 {gridArticles.length > 0 && (
                     <>
                        <h2 className="section-title mb-8">All News</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {gridArticles.map((article: any) => (
                               <NewsCard
                                  key={article.id}
                                  title={String(article.title || '')}
                                  excerpt={String(article.excerpt || '')}
                                  category={typeof article.category === 'string' ? article.category : 'NEWS'}
                                  date={formatDate(article.created_at)}
                                  imageUrl={article.preview_image_url || article.featured_image_url || '/news-hero-placeholder.png'}
                                  href={`/news/${article.slug || article.id}`}
                               />
                            ))}
                        </div>
                     </>
                 )}
               </>
            )}
         </div>
      </section>


    </>
  )
}


export default NewsPage
>>>>>>> Stashed changes
