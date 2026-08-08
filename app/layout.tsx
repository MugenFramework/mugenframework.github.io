import type { Metadata } from 'next'
import { Space_Mono, Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const spaceMono = Space_Mono({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-mono',
})

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mugenframework.github.io'

export const metadata: Metadata = {
  metadataBase: new URL(BASE_URL),
  title: {
    template: '%s - Mugen',
    default: '無限 Mugen - C2 Framework',
  },
  description: 'Open-source C2 framework. Fork of Havoc (GPL-3.0), extended with the Tengu Linux agent, a Python module API, and additional post-exploitation tooling.',
  keywords: ['C2', 'command and control', 'red team', 'post-exploitation', 'Mugen', 'Havoc', 'Tengu', 'Demon', 'pentesting'],
  authors: [{ name: '0xbbuddha', url: 'https://github.com/0xbbuddha' }],
  creator: '0xbbuddha',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: BASE_URL,
    siteName: 'Mugen C2',
    title: '無限 Mugen - C2 Framework',
    description: 'Open-source C2 framework. Fork of Havoc (GPL-3.0), extended with the Tengu Linux agent, a Python module API, and additional post-exploitation tooling.',
    images: [
      {
        url: '/logomugen-hero.png',
        width: 512,
        height: 512,
        alt: 'Mugen C2 Framework',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: '無限 Mugen - C2 Framework',
    description: 'Open-source C2 framework. Fork of Havoc (GPL-3.0), extended with the Tengu Linux agent, a Python module API, and additional post-exploitation tooling.',
    creator: '@0xbbuddha',
    images: ['/logomugen-hero.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
    },
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${inter.variable} ${spaceMono.variable}`}>{children}</body>
    </html>
  )
}
