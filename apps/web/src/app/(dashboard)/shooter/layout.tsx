'use client'

import { Home, User, Trophy, Award, History } from 'lucide-react'
import ShooterSidebar from '@/components/dashboard/ShooterSidebar'
import { useAuth } from '@/context/AuthContext'

const shooterNavItems = [
  { label: 'Dashboard', href: '/shooter', icon: Home },
  {
    label: 'My Profile',
    href: '/shooter/profile',
    icon: User,
    subItems: [
      { label: 'My Profile', href: '/shooter/profile' },
      { label: 'My ID Card', href: '/shooter/profile/id-card' },
    ]
  },
  {
    label: 'Competitions',
    href: '/shooter/competitions',
    icon: Trophy,
    subItems: [
      { label: 'Browse & Register', href: '/shooter/competitions' },
    ]
  },
  { label: 'Athletes History', href: '/shooter/history', icon: History },
  { label: 'Certificates', href: '/shooter/certificates', icon: Award },
]

const ShooterLayout = ({ children }: { children: React.ReactNode }) => {
  const { user: authUser } = useAuth()

  const user = {
    name: authUser ? `${authUser.firstName} ${authUser.lastName}` : 'Loading...',
    role: authUser?.isVerified ? 'Verified Athlete' : 'Athlete',
    avatar: authUser?.avatarUrl || undefined,
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]" style={{ fontFamily: "'Barlow', sans-serif" }}>
      <ShooterSidebar items={shooterNavItems} user={user} />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {children}
      </div>
    </div>
  )
}

export default ShooterLayout
