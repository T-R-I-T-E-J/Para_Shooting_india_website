'use client'

import { useState, useEffect, useCallback } from 'react'

interface CollectionImage {
  id: number
  image_url: string
  caption?: string
  uploaded_at: string
}

interface Props {
  images: CollectionImage[]
}

export default function ImageLightbox({ images }: Props) {
  const [active, setActive] = useState<number | null>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (active === null) return
      if (e.key === 'Escape') {
        setActive(null)
      } else if (e.key === 'ArrowLeft') {
        setActive((prev) => (prev !== null ? (prev - 1 + images.length) % images.length : null))
      } else if (e.key === 'ArrowRight') {
        setActive((prev) => (prev !== null ? (prev + 1) % images.length : null))
      }
    },
    [active, images.length]
  )

  useEffect(() => {
    if (active !== null) {
      window.addEventListener('keydown', handleKeyDown)
      // Prevent body scrolling when lightbox is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [active, handleKeyDown])

  if (images.length === 0) return null

  const current = active !== null ? images[active] : null

  return (
    <>
      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => setActive(idx)}
            className="group relative aspect-square overflow-hidden bg-neutral-100 border border-neutral-200 hover:border-[#C8A415] transition-colors cursor-pointer"
          >
            <img
              src={img.image_url}
              alt={img.caption || `Photo ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {img.caption && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/60 text-white text-[10px] px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity truncate">
                {img.caption}
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Lightbox overlay */}
      {active !== null && current && (
        <div
          className="fixed inset-0 z-[9999] bg-black/90 flex items-center justify-center p-4"
          onClick={() => setActive(null)}
        >
          <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            {/* Close */}
            <button
              onClick={() => setActive(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm font-bold flex items-center gap-1"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              Close
            </button>

            {/* Image */}
            <img
              src={current.image_url}
              alt={current.caption || `Photo ${active + 1}`}
              className="w-full max-h-[75vh] object-contain"
            />

            {/* Caption */}
            {current.caption && (
              <p className="text-white/70 text-sm text-center mt-3">{current.caption}</p>
            )}

            {/* Nav */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setActive((active - 1 + images.length) % images.length)}
                disabled={images.length <= 1}
                className="px-4 py-2 bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors disabled:opacity-30"
              >
                ← Prev
              </button>
              <span className="text-white/50 text-xs">{active + 1} / {images.length}</span>
              <button
                onClick={() => setActive((active + 1) % images.length)}
                disabled={images.length <= 1}
                className="px-4 py-2 bg-white/10 text-white text-sm font-bold hover:bg-white/20 transition-colors disabled:opacity-30"
              >
                Next →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
