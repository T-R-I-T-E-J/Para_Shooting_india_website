'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'

type NavChild = { name: string; path: string }
type NavLink = {
  name: string
  path: string
  children?: NavChild[]
}

const navLinks: NavLink[] = [
  { name: 'ABOUT US', path: '/about' },
  {
    name: 'NEWS',
    path: '/news',
    children: [
      { name: 'Latest News', path: '/news' },
      { name: 'Latest Updates', path: '/news/latest-updates' },
    ],
  },
  { name: 'EVENTS', path: '/events' },
  { name: 'AWARDS', path: '/awards' },
  { name: 'RESULTS', path: '/results' },
  { name: 'MEDIA', path: '/media' },
  { name: 'POLICIES', path: '/policies' },
  { name: 'CLASSIFICATION', path: '/classification' },
  { name: 'CONTACT', path: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null)
  const pathname = usePathname()

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [pathname])

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [mobileOpen])

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-[900] backdrop-blur-md border-b border-white/10 transition-all duration-300 ${
          scrolled ? 'bg-[#003DA5] shadow-lg' : 'bg-[#001A4D]/95'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline group cursor-pointer" aria-label="Para Shooting India – Home">
            <div className="bg-white rounded-md p-1 flex-shrink-0">
              <Image
                src="/psai-logo.png"
                alt="Para Shooting India"
                width={28}
                height={56}
                className="object-contain h-10 w-auto"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-[13px] font-bold text-white leading-none tracking-wide">
                STC PARA SHOOTING
              </span>
              <span className="text-[10px] font-semibold tracking-[0.18em] uppercase text-white/50 mt-1">
                PARA OLYMPIC COMMITTEE
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center h-full">
            {navLinks.map((link) => {
              const isActive = pathname === link.path || pathname.startsWith(link.path + '/')
              if (link.children) {
                return (
                  <div key={link.name} className="relative h-full group flex items-center">
                    <button
                      className={`h-full px-3 flex items-center gap-1 text-[11.5px] font-semibold tracking-wider uppercase transition-colors duration-200 cursor-pointer ${
                        isActive ? 'text-white' : 'text-white/60 hover:text-white'
                      }`}
                    >
                      {link.name}
                      <svg className="w-3 h-3 opacity-60 group-hover:opacity-100 transition-transform group-hover:rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                      {isActive && <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gold" />}
                    </button>

                    {/* Dropdown */}
                    <div className="absolute top-full left-0 pt-1 hidden group-hover:block z-[1000] min-w-[200px]">
                      <ul className="bg-white shadow-[0_8px_30px_rgba(0,0,0,0.15)] border border-neutral-100 rounded-md overflow-hidden">
                        {link.children.map((child) => (
                          <li key={child.path} className="border-b border-neutral-50 last:border-0">
                            <Link
                              href={child.path}
                              className="block px-4 py-3 text-[12px] font-semibold text-neutral-700 hover:bg-[#001A4D] hover:text-white transition-colors tracking-wide"
                            >
                              {child.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )
              }
              return (
                <Link
                  key={link.name}
                  href={link.path}
                  className={`relative h-full px-3 flex items-center text-[11.5px] font-semibold tracking-wider uppercase transition-colors duration-200 ${
                    isActive ? 'text-white' : 'text-white/60 hover:text-white'
                  }`}
                >
                  {link.name}
                  {isActive && <span className="absolute bottom-0 left-3 right-3 h-[2px] bg-gold" />}
                </Link>
              )
            })}

            <Link
              href="/registration"
              className="ml-3 px-4 py-2 bg-gold text-[#001A4D] rounded-md font-body text-[11px] font-extrabold tracking-wider uppercase hover:bg-[#d4b020] transition-transform hover:-translate-y-[1px] whitespace-nowrap"
            >
              Registration
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-[5px] rounded-md hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label={mobileOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileOpen}
          >
            <span className={`block w-5 h-[2px] bg-white transition-all duration-300 ${mobileOpen ? 'rotate-45 translate-y-[7px]' : ''}`} />
            <span className={`block w-5 h-[2px] bg-white transition-all duration-300 ${mobileOpen ? 'opacity-0 scale-x-0' : ''}`} />
            <span className={`block w-5 h-[2px] bg-white transition-all duration-300 ${mobileOpen ? '-rotate-45 -translate-y-[7px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-[850] bg-black/60 md:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile Drawer */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Mobile Navigation Menu"
        className={`fixed top-0 right-0 bottom-0 z-[900] w-[300px] bg-[#001A4D] flex flex-col transition-transform duration-300 ease-in-out md:hidden ${
          mobileOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        aria-hidden={!mobileOpen}
      >
        {/* Drawer Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-white/10">
          <Image src="/psai-logo.png" alt="Para Shooting India" width={100} height={40} className="object-contain h-8 w-auto" />
          <button
            onClick={() => setMobileOpen(false)}
            className="w-8 h-8 flex items-center justify-center rounded-md hover:bg-white/10 text-white/60 hover:text-white transition-colors"
            aria-label="Close menu"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Drawer Links */}
        <nav className="flex-1 flex flex-col py-4 overflow-y-auto">
          {navLinks.map((link) => {
            const isActive = pathname === link.path || pathname.startsWith(link.path + '/')
            if (link.children) {
              const expanded = mobileExpanded === link.name
              return (
                <div key={link.name}>
                  <button
                    onClick={() => setMobileExpanded(expanded ? null : link.name)}
                    className={`w-full flex items-center justify-between px-6 py-3.5 text-sm font-semibold tracking-wider uppercase transition-colors border-l-2 ${
                      isActive ? 'text-white border-gold bg-white/5' : 'text-white/60 hover:text-white border-transparent hover:border-white/20 hover:bg-white/5'
                    }`}
                  >
                    {link.name}
                    <svg className={`w-4 h-4 transition-transform ${expanded ? 'rotate-180' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="6 9 12 15 18 9"/></svg>
                  </button>
                  {expanded && (
                    <div className="bg-white/5 border-l-2 border-gold/30 ml-6">
                      {link.children.map((child) => (
                        <Link
                          key={child.path}
                          href={child.path}
                          className="block px-6 py-3 text-sm text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )
            }
            return (
              <Link
                key={link.name}
                href={link.path}
                className={`px-6 py-3.5 text-sm font-semibold tracking-wider uppercase transition-colors border-l-2 ${
                  isActive
                    ? 'text-white border-gold bg-white/5'
                    : 'text-white/60 hover:text-white border-transparent hover:border-white/20 hover:bg-white/5'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </nav>

        {/* Drawer CTA */}
        <div className="p-6 border-t border-white/10">
          <Link
            href="/registration"
            className="block w-full text-center px-4 py-3 bg-gold text-[#001A4D] rounded-xl font-extrabold text-[12px] tracking-wider uppercase hover:bg-[#d4b020] transition-colors"
          >
            Athlete Registration
          </Link>
          <p className="text-[10px] text-white/30 text-center mt-3 tracking-wide">
            © 2026 STC Para Shooting · PCI India
          </p>
        </div>
      </div>
    </>
  )
}
