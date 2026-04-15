'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import clsx from 'clsx'
import Cookies from 'js-cookie'
import Image from 'next/image'
import {
  Home, User, Trophy, Calendar, CreditCard, Settings, LogOut,
  Menu, X, ChevronRight, ChevronDown, Bell, Target
} from 'lucide-react'

type NavItem = {
  label: string
  href: string
  icon: typeof Home
  badge?: number
  subItems?: { label: string; href: string }[]
}

type SidebarProps = {
  items: NavItem[]
  user: {
    name: string
    role: string
    avatar?: string
  }
}

const Sidebar = ({ items, user }: SidebarProps) => {
  const pathname = usePathname()
  const router = useRouter()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const handleToggle = () => setCollapsed(!collapsed)
  const handleMobileToggle = () => setMobileOpen(!mobileOpen)

  const handleLogout = async () => {
    try {
      // Call backend to clear HttpOnly cookie
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1';
      await fetch(`${API_URL}/auth/logout`, { 
        method: 'POST',
        credentials: 'include', // Send cookies with request
      });
    } catch (error) {
      console.error('Logout failed', error);
    } finally {
      // Clean up any potential client-side leftovers (if any existed previously)
      Cookies.remove('auth_token');
      router.push('/login');
    }
  }

  const toggleExpand = (label: string) => {
    if (collapsed) setCollapsed(false)
    setExpandedItems(prev =>
      prev.includes(label) ? prev.filter(i => i !== label) : [...prev, label]
    )
  }

  const NavLink = ({ item }: { item: NavItem }) => {
    const isActive = pathname === item.href || (item.subItems ? item.subItems.some(sub => pathname === sub.href) : pathname.startsWith(item.href + '/'))
    const isExpanded = expandedItems.includes(item.label)
    const hasSubItems = item.subItems && item.subItems.length > 0

    return (
      <div className="space-y-1 font-['DM_Sans',sans-serif]">
        {hasSubItems ? (
          <button
            onClick={() => toggleExpand(item.label)}
            className={clsx(
              'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 text-[#334155]',
              isActive
                ? 'bg-[#EBF1FF] text-[#003DA5] font-semibold'
                : 'hover:bg-[#F4F6FB] hover:text-[#003DA5]'
            )}
          >
            <item.icon className={clsx("w-5 h-5 flex-shrink-0", isActive ? "text-[#003DA5]" : "text-[#64748B]")} />
            {!collapsed && (
              <>
                <span className="flex-1 text-left">{item.label}</span>
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4 transition-transform text-[#003DA5]" />
                ) : (
                  <ChevronRight className="w-4 h-4 transition-transform text-[#64748B]" />
                )}
              </>
            )}
          </button>
        ) : (
          <Link
            href={item.href}
            onClick={() => setMobileOpen(false)}
            className={clsx(
              'flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors duration-200 text-[#334155]',
              isActive
                ? 'bg-[#003DA5] text-white shadow-md font-semibold'
                : 'hover:bg-[#F4F6FB] hover:text-[#003DA5]'
            )}
          >
            <item.icon className={clsx("w-5 h-5 flex-shrink-0", isActive ? "text-white" : "text-[#64748B]")} />
            {!collapsed && (
              <>
                <span className="flex-1">{item.label}</span>
                {item.badge && item.badge > 0 && (
                  <span className="bg-[#FF671F] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {item.badge}
                  </span>
                )}
              </>
            )}
          </Link>
        )}

        {!collapsed && hasSubItems && isExpanded && (
          <div className="ml-9 space-y-1 mt-1 border-l border-[#E2E8F0] pl-3 py-1">
            {item.subItems!.map((sub) => {
              const subActive = pathname === sub.href;
              return (
              <Link
                key={sub.href}
                href={sub.href}
                onClick={() => setMobileOpen(false)}
                className={clsx(
                  'block px-3 py-2 text-sm rounded-lg transition-colors',
                  subActive
                    ? 'bg-[#F4F6FB] text-[#003DA5] font-medium'
                    : 'text-[#475569] hover:text-[#003DA5] hover:bg-[#F4F6FB]'
                )}
              >
                {sub.label}
              </Link>
            )})}
          </div>
        )}
      </div>
    )
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={handleMobileToggle}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-card shadow-card"
        aria-label="Toggle menu"
      >
        {mobileOpen ? <X className="w-6 h-6 text-[#0F172A]" /> : <Menu className="w-6 h-6 text-[#0F172A]" />}
      </button>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setMobileOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed lg:sticky top-0 left-0 h-screen bg-white border-r border-[#E2E8F0] z-40 transition-[width,transform] duration-300',
          collapsed ? 'w-20' : 'w-[280px]',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        <div className="flex flex-col h-full font-['DM_Sans',sans-serif]">
          {/* Logo */}
          <div className={clsx("py-5 border-b border-[#E2E8F0] flex justify-center items-center h-[88px]", collapsed ? "px-2" : "px-6")}>
            <Link href="/" className="flex items-center justify-center w-full">
              <Image
                src="/logo.png"
                alt="Paralympic Committee India"
                width={200}
                height={80}
                className={clsx(
                  "object-contain transition-[width,height] duration-300",
                  collapsed ? "w-10 h-10" : "w-full max-w-[160px] h-12"
                )}
                priority
              />
            </Link>
          </div>

          {/* User Info */}
          <div className={clsx('p-4 py-6 border-b border-[#E2E8F0]', collapsed && 'px-2')}>
            <div className="flex items-center gap-3 px-2">
              <div className="w-12 h-12 bg-[#F4F6FB] rounded-full flex items-center justify-center flex-shrink-0 border border-[#E2E8F0]">
                {user.avatar ? (
                  <img src={user.avatar} alt="" className="w-full h-full rounded-full object-cover" />
                ) : (
                  <User className="w-6 h-6 text-[#94A3B8]" />
                )}
              </div>
              {!collapsed && (
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[#003DA5] truncate text-base leading-tight">{user.name}</p>
                  <p className="text-sm text-[#64748B] mt-0.5">{user.role}</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {items.map((item) => (
              <NavLink key={item.href} item={item} />
            ))}
          </nav>

          {/* Bottom Actions */}
          <div className="p-4 border-t border-[#E2E8F0] space-y-2">
            <Link
              href="/shooter/settings"
              className="flex items-center gap-3 px-3 py-2.5 text-[#475569] hover:bg-[#F4F6FB] hover:text-[#003DA5] rounded-lg transition-colors"
            >
              <Settings className="w-5 h-5 flex-shrink-0 text-[#64748B]" />
              {!collapsed && <span className="font-medium text-[15px]">Settings</span>}
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 text-[#DC2626] hover:bg-[#FEF2F2] rounded-lg transition-colors w-full"
            >
              <LogOut className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span className="font-medium text-[15px]">Logout</span>}
            </button>
          </div>

          {/* Collapse Button (Desktop) */}
          <button
            onClick={handleToggle}
            className="hidden lg:flex items-center justify-center p-3 border-t border-[#E2E8F0] text-[#94A3B8] hover:text-[#003DA5] hover:bg-[#F4F6FB] transition-colors"
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronRight className={clsx('w-5 h-5 transition-transform', !collapsed && 'rotate-180')} />
          </button>
        </div>
      </aside>
    </>
  )
}

export default Sidebar


