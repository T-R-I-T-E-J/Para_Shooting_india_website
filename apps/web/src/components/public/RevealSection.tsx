'use client'

import { useScrollReveal } from '@/hooks/useScrollReveal'

/**
 * Wraps children in a div that animates in when scrolled into view.
 * Attach this around any block that should fade+slide up on scroll.
 */
export default function RevealSection({
  children,
  delay = 0,
  className = '',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  const ref = useScrollReveal<HTMLDivElement>()
  return (
    <div
      ref={ref}
      className={`reveal ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}
