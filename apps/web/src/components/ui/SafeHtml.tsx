'use client'

import { useEffect, useState } from 'react'

interface SafeHtmlProps {
  html: string
  className?: string
}

export default function SafeHtml({ html, className }: SafeHtmlProps) {
  const [clean, setClean] = useState('')

  useEffect(() => {
    // DOMPurify is browser-only — runs after hydration, never on the server
    import('dompurify').then(({ default: DOMPurify }) => {
      setClean(DOMPurify.sanitize(html))
    })
  }, [html])

  if (!clean) {
    // SSR/pre-hydration: render nothing to avoid mismatch (content appears after hydration)
    return <div className={className} />
  }

  return <div className={className} dangerouslySetInnerHTML={{ __html: clean }} />
}
