'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

interface TickerItem {
  title: string
}

interface TickerBarProps {
  items: TickerItem[]
}

export default function TickerBar({ items }: TickerBarProps) {
  const trackRef = useRef<HTMLDivElement>(null)
  const pausedRef = useRef(false)
  
  // Ensure we only use the latest 3 if more are provided, 
  // or use defaults if none are provided
  const displayItems = items.length > 0 
    ? items.slice(0, 3) 
    : [
        { title: 'Welcome to Para Shooting India' },
        { title: '900+ Registered Athletes' },
        { title: '150+ International Medals' }
      ]

  // Repeat items to fill space and enable seamless looping
  // 12 copies is enough to cover even the widest screens with 3 items
  const repeated = Array(12).fill(displayItems).flat()

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let pos = 0
    let animId: number
    let halfWidth = 0

    const updateDimensions = () => {
      // The content repeats displayItems.length times to make 'repeated'
      // We want to reset when we've scrolled exactly the width of ONE full set of displayItems
      // Since we repeat 12 times, the "reset point" is (total width / 12)
      halfWidth = track.scrollWidth / 12
    }

    const tick = () => {
      if (!pausedRef.current && halfWidth > 0) {
        pos -= 0.6 // Speed: pixels per frame
        
        // When we've scrolled past one full set of items, reset position
        if (pos <= -halfWidth) {
          pos += halfWidth
        }
        
        track.style.transform = `translate3d(${pos}px, 0, 0)`
      }
      animId = requestAnimationFrame(tick)
    }

    // Initial measurement after a small delay to ensure rendering
    const timer = setTimeout(() => {
      updateDimensions()
      animId = requestAnimationFrame(tick)
    }, 100)

    // Handle window resizing
    window.addEventListener('resize', updateDimensions)

    return () => {
      clearTimeout(timer)
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', updateDimensions)
    }
  }, [displayItems.length]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
      className="ticker-container"
      style={{
        backgroundColor: '#C8A415',
        borderBottom: '2px solid #A8880F',
        overflow: 'hidden',
        position: 'relative',
        zIndex: 40,
        padding: '10px 0',
        width: '100%',
        userSelect: 'none'
      }}
    >
      <div
        ref={trackRef}
        style={{
          display: 'inline-flex',
          whiteSpace: 'nowrap',
          willChange: 'transform',
        }}
      >
        {repeated.map((item, i) => (
          <Link
            href="/news/latest-updates"
            key={i}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              flexShrink: 0,
              padding: '0 40px',
              fontSize: '11px',
              fontWeight: 900,
              letterSpacing: '0.22em',
              textTransform: 'uppercase',
              color: '#001A4D',
              textDecoration: 'none',
              cursor: 'pointer',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#ffffff'
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.color = '#001A4D'
            }}
          >
            {item.title}
            <span
              style={{
                display: 'inline-block',
                marginLeft: '40px',
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0,26,77,0.3)',
                flexShrink: 0,
              }}
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
