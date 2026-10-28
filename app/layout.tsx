import type { Metadata, Viewport } from 'next'
import { DM_Sans, Playfair_Display } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-dm-sans',
})

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
})

export const metadata: Metadata = {
  title: 'Ayushman Elder Care Service | Trusted Elder Care Services',
  description:
    'Premium elder care services providing companionship, medical support, home nursing, and complete care management for your loved ones. We are your presence in your absence.',
  generator: 'v0.app',
  keywords: [
    'elder care',
    'senior care',
    'home nursing',
    'companion care',
    'elderly support',
  ],
  icons: {
    icon: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
}

export const viewport: Viewport = {
  themeColor: '#201060',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${dmSans.variable} ${playfair.variable}`}>
      <body className="font-sans antialiased">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
