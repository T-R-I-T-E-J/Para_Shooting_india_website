'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Mail, Lock, Eye, EyeOff, LogIn, AlertCircle } from 'lucide-react'


// Use Next.js proxy to ensure cookies are set on the same domain
const API_URL = '/api/v1'



const LoginPage = () => {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  })

  // Form state
  // No debouncing needed for local state updates


  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })
    setError('')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccessMessage('')

    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      })

      // Safely parse the response — the server might return HTML on a 500 error
      let responseData: any = null
      const contentType = res.headers.get('content-type') || ''
      if (contentType.includes('application/json')) {
        responseData = await res.json()
      } else {
        // Non-JSON body (HTML error page from server or proxy)
        const text = await res.text()
        console.error('Non-JSON response from server:', text.substring(0, 200))
        throw new Error(
          res.status === 503
            ? 'Service temporarily unavailable. Please try again.'
            : res.status >= 500
            ? 'Server error. Please try again in a moment.'
            : 'Unexpected response from server. Please try again.'
        )
      }

      if (!res.ok) {
        let errorMessage = responseData?.message || 'Login failed. Please check your credentials.'
        if (Array.isArray(errorMessage)) {
          errorMessage = errorMessage.join(', ')
        }
        throw new Error(errorMessage)
      }

      // Login successful — extract user from either wrapped or flat response
      const { user, access_token } = responseData.data || responseData

      if (!user) {
        throw new Error('Invalid response from server')
      }

      setSuccessMessage('Login successful! Redirecting...')

      // Explicitly set cookie for cross-domain and Next.js proxy reliability
      if (access_token) {
        const maxAge = 7 * 24 * 60 * 60
        document.cookie = `auth_token=${access_token}; path=/; max-age=${maxAge}; samesite=lax`
      }

      // Redirect based on role or callbackUrl
      const urlParams = new URLSearchParams(window.location.search)
      let callbackUrl = urlParams.get('callbackUrl')
      
      // Prevent open redirect vulnerabilities
      if (callbackUrl && (!callbackUrl.startsWith('/') || callbackUrl.startsWith('//'))) {
        callbackUrl = null
      }

      const roles = user.roles || []
      let redirectPath = '/'
      if (callbackUrl) {
        redirectPath = callbackUrl
      } else if (roles.includes('admin')) {
        redirectPath = '/admin'
      } else if (roles.includes('shooter')) {
        redirectPath = '/shooter'
      }

      console.log('[Login] Redirecting to:', redirectPath)
      setTimeout(() => {
        window.location.href = redirectPath
      }, 500)

    } catch (err: any) {
      console.error('Login error:', err)
      setError(err.message || 'An unexpected error occurred. Please try again.')
      setIsLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <div className="card">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="font-heading text-2xl font-bold text-primary mb-2">
            Welcome Back
          </h1>
          <p className="text-neutral-600">
            Sign in to access your portal
          </p>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/20 rounded-card flex items-start gap-3">
            <AlertCircle aria-hidden="true" className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-green-600 font-medium">{successMessage}</p>
          </div>
        )}

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-card flex items-start gap-3">
            <AlertCircle aria-hidden="true" className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
            <p className="text-sm text-error">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-neutral-700 mb-2">
              Email Address
            </label>
            <div className="relative">
              <Mail aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
                className="input pl-12"
                placeholder="name@example.com"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-neutral-700 mb-2">
              Password
            </label>
            <div className="relative">
              <Lock aria-hidden="true" className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
                className="input pl-12 pr-12"
                placeholder="Enter your password…"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff aria-hidden="true" className="w-5 h-5" /> : <Eye aria-hidden="true" className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formData.rememberMe}
                onChange={handleChange}
                className="w-4 h-4 rounded border-neutral-300 text-primary focus:ring-primary"
              />
              <span className="text-sm text-neutral-600">Remember me</span>
            </label>
            <Link
              href="/forgot-password"
              className="text-sm font-medium text-interactive hover:text-primary"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                {successMessage ? 'Redirecting…' : 'Signing in…'}
              </>
            ) : (
              <>
                <LogIn aria-hidden="true" className="w-5 h-5 mr-2" />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-4 text-neutral-500">or</span>
          </div>
        </div>

        {/* Register Link */}
        <p className="text-center text-neutral-600">
          Don't have an account?{' '}
          <Link
            href="/register"
            className="font-semibold text-primary hover:text-accent"
          >
            Register here
          </Link>
        </p>
      </div>

      {/* Demo Credentials Removed - Use real accounts */
        /* <div className="mt-6 p-4 bg-neutral-100 rounded-card text-center text-sm">
           ...
        </div> */
      }
    </div>
  )
}

export default LoginPage

