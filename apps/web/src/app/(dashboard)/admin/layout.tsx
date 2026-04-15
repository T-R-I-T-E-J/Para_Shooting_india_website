'use client'

import {
  Calendar, FileText, Settings, Activity, Users
} from 'lucide-react'
import { Sidebar } from '@/components/dashboard'

const adminNavItems = [
  {
    label: 'Registration System',
    href: '/admin/competitions',
    icon: Calendar,
    subItems: [
      { label: 'Manage Competitions', href: '/admin/competitions' },
      { label: 'Score Management', href: '/admin/scores' },
      { label: 'Match Reports', href: '/admin/events/reports' },
    ]
  },
  {
    label: 'Content Management',
    href: '/admin/content',
    icon: FileText,
    subItems: [
      { label: 'Policies', href: '/admin/policies' },
      { label: 'Classification', href: '/admin/classification' },
      { label: 'News & Updates', href: '/admin/news' },
      { label: 'Results List', href: '/admin/scores' },
      { label: 'Results Import', href: '/admin/results-import' },
      { label: 'Gallery', href: '/admin/gallery' },
      { label: 'Categories', href: '/admin/categories' },
    ]
  },
  { label: 'Shooter Management', href: '/admin/shooters', icon: Users },
  { label: 'Audit Logs', href: '/admin/audit', icon: Activity },
  { label: 'System Settings', href: '/admin/settings', icon: Settings },
]

type AdminLayoutProps = {
  children: React.ReactNode
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
  const user = {
    name: 'Admin User',
    role: 'Super Admin',
    avatar: undefined,
  }

  return (
    <div className="flex min-h-screen bg-neutral-100">
      <Sidebar items={adminNavItems} user={user} />
      <div className="flex-1 flex flex-col min-w-0">
        {children}
      </div>
    </div>
  )
}

export default AdminLayout

