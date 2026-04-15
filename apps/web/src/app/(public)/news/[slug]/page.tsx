import type { Metadata } from 'next'
import Link from 'next/link'
<<<<<<< Updated upstream
import SanitizedHtml from '@/components/SanitizedHtml'
import { DUMMY_NEWS, getArticleBySlug, getRelatedArticles, CATEGORY_COLORS } from '@/data/news-dummy'

export const dynamic = 'force-dynamic'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Params = Promise<{ slug: string }>

interface Article {
  id: number
  title: string
  slug?: string
  excerpt?: string
  content: string
  category: string
  created_at?: string
  published_at?: string
  featured_image_url?: string
  gradientFrom?: string
  gradientTo?: string
  author?: string | { first_name?: string; last_name?: string }
  documents?: { url: string; name: string }[]
}

// ---------------------------------------------------------------------------
// Data fetching
// ---------------------------------------------------------------------------

async function getArticle(slug: string): Promise<Article | null> {
  // Try API first
  try {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || 'https://final-production-q1yw.onrender.com/api/v1'
    const url = API_URL.startsWith('http')
      ? `${API_URL}/news/${slug}`
      : `https://final-production-q1yw.onrender.com/api/v1/news/${slug}`
    const res = await fetch(url, { cache: 'no-store' })
    if (res.ok) {
      const json = await res.json()
      return json.data || json
    }
  } catch {
    // fall through to dummy
  }
  // Fallback to dummy data
  const dummy = getArticleBySlug(slug)
  if (dummy) {
    return {
      ...dummy,
      created_at: dummy.published_at,
    }
  }
  return null
}

async function getRelated(currentId: number): Promise<Article[]> {
  try {
    const API_URL =
      process.env.NEXT_PUBLIC_API_URL || 'https://final-production-q1yw.onrender.com/api/v1'
    const url = API_URL.startsWith('http')
      ? `${API_URL}/news?status=published&limit=4`
      : `https://final-production-q1yw.onrender.com/api/v1/news?status=published&limit=4`
    const res = await fetch(url, { cache: 'no-store' })
    if (res.ok) {
      const json = await res.json()
      const data = json.data || json
      if (Array.isArray(data) && data.length > 0) {
        return data.filter((n: Article) => n.id !== currentId).slice(0, 3)
      }
    }
  } catch {
    // fall through
  }
  return getRelatedArticles(currentId, 3) as unknown as Article[]
}

// ---------------------------------------------------------------------------
// Metadata
// ---------------------------------------------------------------------------

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  if (!article) return { title: 'Article Not Found' }
  return {
    title: `${article.title} — Para Shooting India`,
=======
import { Calendar, ArrowLeft, Share2, Facebook, Twitter, Linkedin, FileText, Download } from 'lucide-react'

export const dynamic = 'force-dynamic'


async function getArticle(slug: string) {
  try {
    let API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://parashooting.in/api/v1';
    
    // Ensure API_URL is absolute for server-side fetches
    if (API_URL.startsWith('/')) {
       // If running on server (which this component does), we need a base URL.
       // However, since we don't easily know the host, we rely on the production URL fallback or a configured env var.
       // The best approach is to force the production URL if the env var is relative.
       API_URL = 'https://parashooting.in/api/v1';
    }

    const res = await fetch(`${API_URL}/news/${slug}`, {
      cache: 'no-store'
    })
    if (!res.ok) {
      console.error('Fetch failed:', res.status, res.statusText, API_URL);
      return { error: `API Error: ${res.status} ${res.statusText} at ${API_URL}`, status: res.status };
    }
    const json = await res.json()
    return json.data || json
  } catch (error: any) {
    console.error('Error fetching article:', error)
    return { error: error.message || 'Unknown Error', status: 500 };
  }
}

async function getRelatedArticles(currentId: number) {
  try {
    // Use API URL from environment or default to localhost for development
    let API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://parashooting.in/api/v1';

    // Ensure API_URL is absolute for server-side fetches
    if (API_URL.startsWith('/')) {
       API_URL = 'https://parashooting.in/api/v1';
    }
    const res = await fetch(`${API_URL}/news?limit=4`, {
       next: { revalidate: 3600 } 
    })
    if (!res.ok) return []
    const json = await res.json()
    const data = json.data || json
    if (!Array.isArray(data)) return []
    return data.filter((n: any) => n.id !== currentId).slice(0, 3)
  } catch (error) {
    return []
  }
}

type Params = Promise<{ slug: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticle(slug)
  
  if (!article || article.error) {
    return {
      title: 'Article Not Found',
    }
  }
  
  return {
    title: article.title,
>>>>>>> Stashed changes
    description: article.excerpt || article.title,
  }
}

<<<<<<< Updated upstream
// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatDate(dateString?: string) {
  if (!dateString) return ''
  try {
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  } catch {
    return ''
  }
}

function getAuthorName(author: Article['author']): string | null {
  if (!author) return null
  if (typeof author === 'string') return author
  return `${author.first_name || ''} ${author.last_name || ''}`.trim() || null
}

// ---------------------------------------------------------------------------
// Icon components
// ---------------------------------------------------------------------------

function IconArrowLeft() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/>
    </svg>
  )
}
function IconArrowRight() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>
    </svg>
  )
}
function IconDownload() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
    </svg>
  )
}
function IconFile() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
      <path d="M13 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V9z"/><polyline points="13 2 13 9 20 9"/>
    </svg>
  )
}
function IconFacebook() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/>
    </svg>
  )
}
function IconTwitter() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"/>
    </svg>
  )
}
function IconLinkedin() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/>
    </svg>
  )
}

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default async function NewsArticlePage({ params }: { params: Params }) {
  const { slug } = await params
  const article = await getArticle(slug)

  // ── 404 ────────────────────────────────────────────────────────────────
  if (!article) {
    return (
      <div className="bg-white min-h-screen flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-neutral-100 border border-neutral-200 flex items-center justify-center mx-auto mb-6">
            <svg width="24" height="24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
            </svg>
          </div>
          <p className="text-[#C8A415] text-[11px] font-bold tracking-[0.35em] uppercase mb-3">Not Found</p>
          <h1 className="font-heading text-3xl font-bold text-neutral-900 mb-3">Article Not Found</h1>
          <p className="text-neutral-500 text-sm mb-8">The article you&apos;re looking for doesn&apos;t exist or may have been removed.</p>
          <Link
            href="/news"
            className="inline-flex items-center gap-2 bg-primary text-white font-body font-extrabold text-[12px] tracking-widest uppercase px-7 py-3 hover:bg-primary-light transition-colors"
          >
            <IconArrowLeft /> Back to News
=======
export default async function NewsArticlePage({ params }: { params: Params }) {
  try {
    const { slug } = await params
    const article = await getArticle(slug)
    
    if (!article || article.error) {
      return (
        <div className="min-h-screen flex items-center justify-center p-4">
          <div className="text-center max-w-lg">
            <h1 className="font-heading text-4xl font-bold text-primary mb-4">Article Not Found</h1>
            <p className="text-neutral-600 mb-6">The article you're looking for doesn't exist or an error occurred.</p>
            
            {/* Debug Information for Troubleshooting */}
            <div className="bg-neutral-100 p-4 rounded-lg text-left text-xs font-mono mb-8 overflow-auto">
              <p className="font-bold mb-2">Debug Info:</p>
              <p>Slug: {slug}</p>
              <p>Status: {article?.status || 'Unknown'}</p>
              <p>Error: {article?.error || 'N/A'}</p>
              <p>Timestamp: {new Date().toISOString()}</p>
            </div>

            <Link href="/news" className="btn-primary">
              Back to News
            </Link>
          </div>
        </div>
      )
    }

    const relatedArticles = article.id ? await getRelatedArticles(article.id) : []
    
    const formatDate = (dateString: string) => {
      try {
        return new Date(dateString).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })
      } catch {
        return 'Date unavailable'
      }
    }

    // Check if content contains HTML tags
    const isHtmlContent = article.content && (article.content.includes('<') || article.content.includes('>'))
    const contentParagraphs = !isHtmlContent && article.content ? article.content.split('\n').filter((p: string) => p.trim().length > 0) : []

  return (
    <>
      {/* Hero Section */}
      <section className="gradient-hero py-12 md:py-16 text-white">
        <div className="container-main">
          <Link 
            href="/news" 
            className="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to News
          </Link>
          <div className="max-w-3xl">
            <span className="inline-block bg-accent text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
              {article.category}
            </span>
            <h1 className="font-heading text-3xl md:text-4xl font-bold mb-4">
              {article.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                {formatDate(article.created_at)}
              </span>
              {/* Author if available, else omit */}
              {article.author && (
                  <>
                  <span>•</span>
                  <span>By {typeof article.author === 'object' ? `${article.author.first_name || ''} ${article.author.last_name || ''}`.trim() : article.author}</span>
                  </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Breadcrumb */}
      <nav className="bg-neutral-100 py-3 text-sm" aria-label="Breadcrumb">
        <div className="container-main">
          <ol className="flex items-center gap-2 flex-wrap">
            <li><Link href="/" className="text-interactive hover:text-primary">Home</Link></li>
            <li className="text-neutral-400">/</li>
            <li><Link href="/news" className="text-interactive hover:text-primary">News</Link></li>
            <li className="text-neutral-400">/</li>
            <li className="text-neutral-600 truncate max-w-[200px]">{article.title}</li>
          </ol>
        </div>
      </nav>

      {/* Article Content */}
      <section className="section bg-white">
        <div className="container-main">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2">
              {/* Featured Image(s) */}
              <div className="space-y-4 mb-8">
                {/* Display all images from image_urls array */}
                {/* Display all images from image_urls array */}
                {(() => {
                  // Helper within render to sanitize URLs
                  const sanitizeUrl = (url: string) => {
                    if (!url) return '';
                    let cleanUrl = url;
                    // Fix localhost leakage
                    const backendUrl = 'https://parashooting.in';
                    cleanUrl = cleanUrl
                      .replace('http://localhost:8080', backendUrl)
                      .replace('http://localhost:4000', backendUrl)
                      .replace('http://localhost:10000', backendUrl)
                      .replace('https://webtesters.in', backendUrl); // Fix legacy URLs
                    
                    // Handle relative paths (e.g. from /uploads)
                    if (cleanUrl.startsWith('/')) {
                       cleanUrl = `${backendUrl}${cleanUrl}`;
                    }
                    return cleanUrl;
                  };

                  const images = article.image_urls && Array.isArray(article.image_urls) ? article.image_urls : [];
                  const mainImage = article.featured_image_url || article.preview_image_url;

                  if (images.length > 0) {
                    return (
                      <div className="grid grid-cols-1 gap-4">
                        {images.map((imageUrl: string, index: number) => (
                          <div key={index} className="aspect-[16/9] rounded-card overflow-hidden bg-neutral-100">
                            <img 
                              src={sanitizeUrl(imageUrl)} 
                              alt={`${article.title} - Image ${index + 1}`} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        ))}
                      </div>
                    );
                  } else if (mainImage) {
                    return (
                      <div className="aspect-[16/9] rounded-card overflow-hidden bg-neutral-100">
                        <img 
                          src={sanitizeUrl(mainImage)} 
                          alt={article.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                    );
                  } else {
                    return (
                      <div className="aspect-[16/9] rounded-card overflow-hidden bg-neutral-100">
                        <div className="w-full h-full bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center">
                          <span className="text-8xl">📰</span>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>

              {/* Article Body */}
              <div className="prose prose-lg max-w-none text-neutral-700">
                {isHtmlContent ? (
                  <div dangerouslySetInnerHTML={{ __html: article.content }} />
                ) : (
                  contentParagraphs.map((paragraph: string, index: number) => (
                    <p key={index} className="mb-6 leading-relaxed">
                      {paragraph}
                    </p>
                  ))
                )}
              </div>

              {/* Documents Section */}
              {article.documents && Array.isArray(article.documents) && article.documents.length > 0 && (
                <div className="mt-8 mb-8 p-6 bg-neutral-50 rounded-xl border border-neutral-200">
                  <h3 className="font-heading font-bold text-lg text-primary mb-4 flex items-center gap-2">
                    <Download className="w-5 h-5" />
                    Related Documents
                  </h3>
                  <div className="space-y-3">
                    {article.documents.filter((doc: any) => doc && doc.url && doc.name).map((doc: any, index: number) => (
                      <a
                        key={index}
                        href={doc.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-neutral-200 hover:border-primary/50 hover:shadow-sm transition-all group"
                      >
                        <div className="w-10 h-10 bg-primary/5 rounded-md flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                          <FileText className="w-5 h-5" />
                        </div>
                         <div className="min-w-0 flex-1">
                            <p className="font-medium text-sm text-neutral-900 truncate group-hover:text-primary transition-colors">
                              {doc.name || 'Document'}
                            </p>
                            <span className="text-xs text-neutral-500">Click to view/download</span>
                         </div>
                         <Download className="w-4 h-4 text-neutral-400 group-hover:text-primary transition-colors" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Share Section */}
              <div className="mt-12 pt-8 border-t border-neutral-200">
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-2 text-neutral-600 font-medium">
                    <Share2 className="w-5 h-5" />
                    Share this article:
                  </span>
                  <div className="flex gap-2">
                    {/* Share Links */}
                    <a
                      href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`https://parashootingindia.org/news/${slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-[#1877f2] rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                      aria-label="Share on Facebook"
                    >
                      <Facebook className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(`https://parashootingindia.org/news/${slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-[#1da1f2] rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                      aria-label="Share on Twitter"
                    >
                      <Twitter className="w-5 h-5" />
                    </a>
                    <a
                      href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(`https://parashootingindia.org/news/${slug}`)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 bg-[#0077b5] rounded-full flex items-center justify-center text-white hover:opacity-90 transition-opacity"
                      aria-label="Share on LinkedIn"
                    >
                      <Linkedin className="w-5 h-5" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              {/* Related Articles */}
              {relatedArticles.length > 0 && (
                  <div className="card">
                    <h3 className="font-heading font-bold text-lg text-primary mb-4">Related Articles</h3>
                    <div className="space-y-4">
                      {relatedArticles.map((related: any) => (
                        <Link
                          key={related.id}
                          href={`/news/${related.slug || related.id}`}
                          className="block group"
                        >
                          <h4 className="font-medium text-neutral-700 group-hover:text-primary transition-colors line-clamp-2">
                            {related.title}
                          </h4>
                          <span className="text-xs text-neutral-400 mt-1 block">{formatDate(related.created_at)}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
              )}

              {/* Quick Links */}
              <div className="card mt-6">
                <h3 className="font-heading font-bold text-lg text-primary mb-4">Quick Links</h3>
                <ul className="space-y-2">
                  <li>
                    <Link href="/events" className="text-neutral-600 hover:text-primary transition-colors text-sm">
                      → Upcoming Events
                    </Link>
                  </li>
                  <li>
                    <Link href="/results" className="text-neutral-600 hover:text-primary transition-colors text-sm">
                      → Competition Results
                    </Link>
                  </li>
                  <li>
                    <Link href="/policies" className="text-neutral-600 hover:text-primary transition-colors text-sm">
                      → Policies & Documents
                    </Link>
                  </li>
                  <li>
                    <Link href="/contact" className="text-neutral-600 hover:text-primary transition-colors text-sm">
                      → Contact Us
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
  } catch (error) {
    console.error('Error rendering news article:', error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-heading text-4xl font-bold text-primary mb-4">Error Loading Article</h1>
          <p className="text-neutral-600 mb-8">There was an error loading this article. Please try again later.</p>
          <Link href="/news" className="btn-primary">
            Back to News
>>>>>>> Stashed changes
          </Link>
        </div>
      </div>
    )
  }
<<<<<<< Updated upstream

  const related = article.id ? await getRelated(article.id) : []
  const authorName = getAuthorName(article.author)
  const publishedDate = article.created_at || article.published_at
  const catColor = CATEGORY_COLORS[article.category] ?? '#003DA5'
  const shareUrl = `https://parashooting.in/news/${slug}`
  const docs = Array.isArray(article.documents)
    ? article.documents.filter((d) => d?.url && d?.name)
    : []
  const gradientFrom = (article as any).gradientFrom || '#001A4D'
  const gradientTo = (article as any).gradientTo || '#003DA5'

  const isHtml = article.content?.includes('<')
  const paragraphs = !isHtml && article.content
    ? article.content.split('\n').filter((p) => p.trim().length > 0)
    : []

  return (
    <div className="bg-white min-h-screen">

      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <section className="relative h-[65vh] min-h-[420px] max-h-[680px] overflow-hidden">

        {/* Background: real image or gradient */}
        {article.featured_image_url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={article.featured_image_url}
            alt={article.title}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div
            className="absolute inset-0"
            style={{ background: `linear-gradient(135deg, ${gradientFrom}, ${gradientTo})` }}
          />
        )}

        {/* Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/30 to-transparent" />

        {/* Watermark */}
        <span className="absolute -bottom-2 right-0 font-heading text-[18vw] font-bold text-white/[0.04] leading-none select-none pointer-events-none">
          NEWS
        </span>

        {/* Back nav */}
        <div className="absolute top-0 left-0 right-0 px-6 pt-24">
          <div className="max-w-7xl mx-auto">
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-white/60 hover:text-white text-[11px] font-bold tracking-[0.25em] uppercase transition-colors cursor-pointer"
            >
              <IconArrowLeft /> All News
            </Link>
          </div>
        </div>

        {/* Article meta + title */}
        <div className="absolute bottom-0 left-0 right-0 px-6 pb-10 md:pb-14">
          <div className="max-w-7xl mx-auto">
            {/* Category + date row */}
            <div className="flex flex-wrap items-center gap-3 mb-4">
              {article.category && (
                <span
                  className="text-[9px] font-extrabold tracking-[0.3em] uppercase px-3 py-1.5 bg-white"
                  style={{ color: catColor }}
                >
                  {article.category.replace('_', ' ')}
                </span>
              )}
              {publishedDate && (
                <span className="text-white/60 text-[12px]">{formatDate(publishedDate)}</span>
              )}
              {authorName && (
                <>
                  <span className="w-1 h-1 rounded-full bg-white/30 flex-shrink-0" />
                  <span className="text-white/50 text-[12px]">By {authorName}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h1 className="font-heading text-2xl sm:text-3xl md:text-5xl lg:text-[3.2rem] font-bold text-white leading-[1.06] max-w-4xl">
              {article.title}
            </h1>
          </div>
        </div>
      </section>

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-12 xl:gap-20">

        {/* ── Main column ────────────────────────────────────────────────── */}
        <main className="min-w-0">

          {/* Excerpt pull-quote */}
          {article.excerpt && (
            <p className="font-heading text-[1.15rem] text-neutral-600 leading-relaxed border-l-[3px] border-[#C8A415] pl-6 mb-10">
              {article.excerpt}
            </p>
          )}

          {/* Article content */}
          <div className="text-neutral-700 text-[15px] leading-[1.9]">
            {isHtml ? (
              <SanitizedHtml
                html={article.content}
                className="
                  [&_h1]:font-heading [&_h1]:text-3xl [&_h1]:font-bold [&_h1]:text-neutral-900 [&_h1]:mt-10 [&_h1]:mb-5
                  [&_h2]:font-heading [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-neutral-900 [&_h2]:mt-10 [&_h2]:mb-4 [&_h2]:pb-2 [&_h2]:border-b [&_h2]:border-neutral-200
                  [&_h3]:font-heading [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-neutral-900 [&_h3]:mt-8 [&_h3]:mb-3
                  [&_p]:mb-5 [&_p]:text-neutral-700
                  [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2 [&_a]:hover:text-primary-light
                  [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:mb-5 [&_ul>li]:mb-1.5 [&_ul>li]:text-neutral-700
                  [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:mb-5 [&_ol>li]:mb-1.5
                  [&_strong]:text-neutral-900 [&_strong]:font-semibold
                  [&_em]:text-neutral-600
                  [&_blockquote]:border-l-[3px] [&_blockquote]:border-[#C8A415] [&_blockquote]:pl-5 [&_blockquote]:text-neutral-500 [&_blockquote]:italic [&_blockquote]:my-6
                  [&_img]:w-full [&_img]:my-6 [&_img]:border [&_img]:border-neutral-200
                  [&_table]:w-full [&_table]:text-sm [&_table]:border [&_table]:border-neutral-200
                  [&_th]:text-left [&_th]:text-neutral-900 [&_th]:font-bold [&_th]:pb-3 [&_th]:border-b [&_th]:border-neutral-200 [&_th]:px-4 [&_th]:py-3 [&_th]:bg-neutral-50
                  [&_td]:py-3 [&_td]:px-4 [&_td]:border-b [&_td]:border-neutral-100 [&_td]:text-neutral-700
                  [&_hr]:border-neutral-200 [&_hr]:my-8
                "
              />
            ) : (
              <div className="space-y-5">
                {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
            )}
          </div>

          {/* Attachments */}
          {docs.length > 0 && (
            <div className="mt-12 pt-10 border-t border-neutral-200">
              <p className="text-[#C8A415] text-[10px] font-bold tracking-[0.35em] uppercase mb-3">Attachments</p>
              <h3 className="font-heading text-xl font-bold text-neutral-900 mb-6">Related Documents</h3>
              <div className="space-y-3">
                {docs.map((doc, i) => (
                  <a
                    key={i}
                    href={doc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-4 bg-neutral-50 border border-neutral-200 hover:border-primary/30 hover:bg-primary/[0.03] p-4 transition-all duration-200 cursor-pointer"
                    style={{ borderLeftColor: '#C8A415', borderLeftWidth: '2px' }}
                  >
                    <div className="w-9 h-9 flex items-center justify-center flex-shrink-0 text-[#C8A415] bg-[#C8A415]/10 border border-[#C8A415]/20">
                      <IconFile />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-neutral-900 text-[13px] font-semibold truncate group-hover:text-primary transition-colors">{doc.name}</p>
                      <p className="text-neutral-400 text-[11px] mt-0.5">Click to download</p>
                    </div>
                    <span className="text-[#C8A415] opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                      <IconDownload />
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Share + back */}
          <div className="mt-12 pt-10 border-t border-neutral-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
            <div>
              <p className="text-neutral-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-3">Share this article</p>
              <div className="flex gap-2">
                {[
                  {
                    href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
                    icon: <IconFacebook />,
                    label: 'Facebook',
                  },
                  {
                    href: `https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=${encodeURIComponent(shareUrl)}`,
                    icon: <IconTwitter />,
                    label: 'Twitter',
                  },
                  {
                    href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
                    icon: <IconLinkedin />,
                    label: 'LinkedIn',
                  },
                ].map(({ href, icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Share on ${label}`}
                    className="w-10 h-10 flex items-center justify-center border border-neutral-200 text-neutral-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 cursor-pointer"
                  >
                    {icon}
                  </a>
                ))}
              </div>
            </div>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 text-[11px] font-bold tracking-[0.2em] uppercase text-neutral-400 hover:text-primary transition-colors cursor-pointer"
            >
              <IconArrowLeft /> All Articles
            </Link>
          </div>
        </main>

        {/* ── Sidebar ──────────────────────────────────────────────────────── */}
        <aside className="space-y-8 lg:pt-2">

          {/* More stories */}
          {related.length > 0 && (
            <div>
              <p className="text-[#C8A415] text-[10px] font-bold tracking-[0.35em] uppercase mb-5">More Stories</p>
              <div className="divide-y divide-neutral-100">
                {related.map((r) => (
                  <Link
                    key={r.id}
                    href={`/news/${(r as any).slug || r.id}`}
                    className="group flex items-start justify-between gap-3 py-5 cursor-pointer"
                  >
                    <div className="min-w-0">
                      {r.category && (
                        <span
                          className="text-[8px] font-bold tracking-[0.2em] uppercase block mb-1.5"
                          style={{ color: CATEGORY_COLORS[r.category] ?? '#003DA5' }}
                        >
                          {r.category.replace('_', ' ')}
                        </span>
                      )}
                      <h4 className="font-heading text-[13px] font-bold text-neutral-600 group-hover:text-neutral-900 transition-colors leading-snug line-clamp-2 mb-2">
                        {r.title}
                      </h4>
                      {(r.created_at || r.published_at) && (
                        <p className="text-neutral-400 text-[11px]">
                          {formatDate(r.created_at || r.published_at)}
                        </p>
                      )}
                    </div>
                    <span className="flex-shrink-0 text-neutral-300 group-hover:text-primary transition-colors mt-1">
                      <IconArrowRight />
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                href="/news"
                className="mt-4 inline-flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-primary/70 hover:text-primary transition-colors"
              >
                View all news <IconArrowRight />
              </Link>
            </div>
          )}

          {/* Quick Links */}
          <div
            className="border border-neutral-200 p-6 bg-white"
            style={{ borderTopColor: '#C8A415', borderTopWidth: '2px' }}
          >
            <p className="text-[#C8A415] text-[10px] font-bold tracking-[0.35em] uppercase mb-5">Quick Links</p>
            <ul className="space-y-0.5">
              {[
                { href: '/events', label: 'Upcoming Events' },
                { href: '/results', label: 'Competition Results' },
                { href: '/classification', label: 'Classifications' },
                { href: '/policies', label: 'Policies & Documents' },
                { href: '/contact', label: 'Contact Us' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="group flex items-center justify-between py-2.5 text-[12px] text-neutral-500 hover:text-primary border-b border-neutral-100 last:border-0 transition-colors cursor-pointer"
                  >
                    <span>{label}</span>
                    <span className="opacity-0 group-hover:opacity-100 text-primary transition-opacity">
                      <IconArrowRight />
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Stay Updated CTA */}
          <div className="bg-primary p-6 text-center">
            <p className="text-[#C8A415] text-[10px] font-bold tracking-[0.3em] uppercase mb-3">Stay Updated</p>
            <p className="text-white/70 text-[12px] leading-relaxed mb-5">
              Latest news from Para Shooting India delivered to your feed.
            </p>
            <Link
              href="/news"
              className="inline-flex items-center gap-2 bg-[#C8A415] text-white font-body font-extrabold text-[10px] tracking-widest uppercase px-5 py-2.5 hover:bg-[#b8940f] transition-colors"
            >
              Browse All News <IconArrowRight />
            </Link>
          </div>

        </aside>
      </div>

    </div>
  )
}
=======
}

>>>>>>> Stashed changes
