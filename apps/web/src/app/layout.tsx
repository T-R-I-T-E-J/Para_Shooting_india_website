import type { Metadata } from 'next'
import { Playfair_Display, DM_Sans, DM_Mono } from 'next/font/google'
import './globals.css'
import CookieConsent from '@/components/common/CookieConsent'
import { AuthProvider } from '@/context/AuthContext'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const dmMono = DM_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Para Shooting Committee of India',
    template: '%s | Para Shooting India',
  },
  description:
    'Official website of the Para Shooting Committee of India - Promoting and developing para shooting sports across India.',
  keywords: [
    'para shooting',
    'India',
    'Paralympic',
    'shooting sports',
    'WSPS',
    'disabled athletes',
  ],
  referrer: 'strict-origin-when-cross-origin',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://parashootingindia.org',
    siteName: 'Para Shooting Committee of India',
    title: 'Para Shooting Committee of India',
    description:
      'Official website of the Para Shooting Committee of India - Promoting and developing para shooting sports across India.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Para Shooting Committee of India',
    description: 'Official website of the Para Shooting Committee of India',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

type RootLayoutProps = {
  children: React.ReactNode
}

const RootLayout = ({ children }: RootLayoutProps) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${playfair.variable} ${dmSans.variable} ${dmMono.variable}`}
    >
      <head>
        <meta httpEquiv="Content-Security-Policy" content="upgrade-insecure-requests" />
      </head>

      <body
        className="min-h-screen bg-neutral-50 text-neutral-700 font-body"
        suppressHydrationWarning
      >
        <a href="#main-content" className="skip-link sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[9999] focus:px-4 focus:py-2 focus:bg-navy focus:text-white focus:rounded-md">
          Skip to main content
        </a>

        <CookieConsent />

        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}

export default RootLayout
