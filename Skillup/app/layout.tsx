import React from "react"
import "./globals.css"
import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })
import ConvexClientProvider from '@/components/ConvexClientProvider'
import SyncUser from '@/components/SyncUser'
import QueryProvider from '@/components/providers/QueryProvider'

export const metadata: Metadata = {
  title: 'SkillUp | Intelligence AI',
  description: 'Industrial-grade Career Intelligence Engine. Analyze skills, identify gaps, and master your career path with AI-driven insights.',
  icons: {
    icon: '/favicon.svg',
    apple: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#1e3a5f',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${geistMono.variable} font-sans antialiased`} suppressHydrationWarning>
        <ConvexClientProvider>
          <QueryProvider>
            <SyncUser />
            {children}
          </QueryProvider>
        </ConvexClientProvider>
        <Analytics />
      </body>
    </html>
  )
}
