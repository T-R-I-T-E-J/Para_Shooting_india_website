'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'
import Cookies from 'js-cookie'
import {
  Home, User, Trophy, Award, History,
  LogOut, ChevronRight, ChevronDown,
  Menu, X, Shield, Settings
} from 'lucide-react'

type NavItem = {
  label: string
  href: string
  icon: typeof Home
  badge?: number
  subItems?: { label: string; href: string }[]
}

type ShooterSidebarProps = {
  items: NavItem[]
  user: { name: string; role: string; avatar?: string }
}

const ShooterSidebar = ({ items, user }: ShooterSidebarProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const handleLogout = async () => {
    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1'
      await fetch(`${API_URL}/auth/logout`, { method: 'POST', credentials: 'include' })
    } catch {}
    finally {
      Cookies.remove('auth_token')
      router.push('/login')
    }
  }

  const toggleExpand = (label: string) => {
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    )
  }

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive =
      pathname === item.href ||
      (item.subItems
        ? item.subItems.some(s => pathname === s.href)
        : item.href !== '/shooter' && pathname.startsWith(item.href + '/'))
    const isExpanded = expandedItems.includes(item.label)
    const hasSubItems = item.subItems && item.subItems.length > 0

    return (
      <div className="space-y-0.5">
        {hasSubItems ? (
          <button
            onClick={() => toggleExpand(item.label)}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-sm',
              isActive
                ? 'bg-white/10 text-white font-semibold'
                : 'text-slate-300 hover:bg-white/8 hover:text-white font-medium'
            )}
          >
            <item.icon className={clsx('w-4 h-4 flex-shrink-0', isActive ? 'text-[#C8A415]' : 'text-slate-400')} />
            <span className="flex-1 text-left text-[13px]">{item.label}</span>
            {isExpanded
              ? <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              : <ChevronRight className="w-3.5 h-3.5 text-slate-400" />}
          </button>
        ) : (
          <Link
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 text-[13px]',
              isActive
                ? 'bg-white/10 text-white font-semibold border-l-2 border-[#C8A415] pl-[10px]'
                : 'text-slate-300 hover:bg-white/8 hover:text-white font-medium'
            )}
          >
            <item.icon className={clsx('w-4 h-4 flex-shrink-0', isActive ? 'text-[#C8A415]' : 'text-slate-400')} />
            <span className="flex-1">{item.label}</span>
            {item.badge && item.badge > 0 && (
              <span className="bg-[#0369A1] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        )}

        {hasSubItems && isExpanded && (
          <div className="ml-7 pl-3 border-l border-white/10 space-y-0.5 py-1">
            {item.subItems!.map(sub => {
              const subActive = pathname === sub.href
              return (
                <Link
                  key={sub.href}
                  href={sub.href}
                  onClick={() => setMobileOpen(false)}
                  className={clsx(
                    'block px-3 py-2 text-[12px] rounded-md transition-all',
                    subActive
                      ? 'text-[#C8A415] font-semibold bg-white/5'
                      : 'text-slate-400 hover:text-white hover:bg-white/5'
                  )}
                >
                  {sub.label}
                </Link>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  const initials = user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()

  return (
    <>
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-[#0F172A] border border-slate-700 rounded-lg shadow-lg"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-white" />}
      </button>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/60 z-40" onClick={() => setMobileOpen(false)} />
      )}

      <aside className={clsx(
        'fixed lg:sticky top-0 left-0 h-screen w-64 flex flex-col z-40 transition-transform duration-300',
        'bg-[#0F172A]',
        mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      )}>

        {/* Logo */}
        <div className="px-5 h-16 flex items-center border-b border-white/8 flex-shrink-0">
          <Link href="/" className="flex items-center gap-3 w-full">
            <div className="w-8 h-8 rounded bg-[#C8A415] flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4 text-[#0F172A]" />
            </div>
            <div className="min-w-0">
              <p className="text-white text-[13px] font-bold leading-tight truncate">Para Shooting India</p>
              <p className="text-slate-500 text-[10px] leading-tight">Athlete Portal</p>
            </div>
          </Link>
        </div>

        {/* User card */}
        <div className="px-4 py-4 border-b border-white/8 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0369A1] flex items-center justify-center flex-shrink-0 text-white text-xs font-bold overflow-hidden">
              {user.avatar
                ? <img src={user.avatar} alt="" className="w-full h-full object-cover" />
                : initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-semibold truncate leading-tight">{user.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                <p className="text-slate-400 text-[11px] truncate">{user.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 pb-2">Navigation</p>
          {items.map(item => <NavLink key={item.href} item={item} />)}
        </nav>

        {/* Bottom */}
        <div className="px-3 py-3 border-t border-white/8 space-y-0.5 flex-shrink-0">
          <Link
            href="/shooter/settings"
            className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-slate-400 hover:text-white hover:bg-white/8 rounded-lg transition-all font-medium"
          >
            <Settings className="w-4 h-4 flex-shrink-0" />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 text-[13px] text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all w-full font-medium cursor-pointer"
          >
            <LogOut className="w-4 h-4 flex-shrink-0" />
            Sign Out
          </button>
        </div>
      </aside>
    </>
  )
}

export default ShooterSidebar
