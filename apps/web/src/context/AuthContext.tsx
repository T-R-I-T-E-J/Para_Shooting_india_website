'use client'
import { createContext, useContext, useEffect, useState } from 'react'

interface User {
  id: number
  email: string
  firstName: string
  lastName: string
  role?: string
  roles?: string[]
  shooterId?: number
  avatarUrl?: string | null
  isVerified?: boolean
  pciId?: string | null
  memberSince?: string | null
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // On mount, fetch current user from API
    refreshUser()
  }, [])

  async function refreshUser() {
    try {
      setIsLoading(true)
      const res = await fetch('/api/v1/auth/me', {
        credentials: 'include', 
      })
      
      if (res.ok) {
        const data = await res.json()
        setUser({
          id: data.id || data.user?.id,
          email: data.email || data.user?.email,
          firstName: data.firstName || data.user?.firstName || '',
          lastName: data.lastName || data.user?.lastName || '',
          role: data.role,
          roles: data.roles || data.user?.roles,
          shooterId: data.shooterId,
          avatarUrl: data.avatarUrl,
          isVerified: data.isVerified,
          pciId: data.pciId,
          memberSince: data.memberSince,
        })
      } else {
        // Not logged in or token expired
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setIsLoading(false)
    }
  }

  async function login(email: string, password: string) {
    const res = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    })
    
    if (!res.ok) {
      const err = await res.json()
      throw new Error(err.message ?? 'Login failed')
    }
    
    // After login, fetch the ACTUAL user
    await refreshUser()
  }

  async function logout() {
    await fetch('/api/v1/auth/logout', {
      method: 'POST',
      credentials: 'include',
    })
    document.cookie = 'auth_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;'
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
