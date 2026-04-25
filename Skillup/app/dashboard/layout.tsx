'use client'

import React from "react"
import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useUser, UserButton } from '@clerk/nextjs'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import { ProgressiveBlur } from '@/components/ui/progressive-blur'
import {
  BrainCircuit,
  Gauge,
  Scale,
  Lightbulb,
  Crosshair,
  Map,
  Clock,
  ScrollText,
  LogOut,
  Menu,
  ScanSearch,
  X,
  PanelLeftClose,
  PanelLeftOpen,
  Star,
  Trophy
} from 'lucide-react'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Gauge },
  { href: '/dashboard/comparison', label: 'You vs Industry', icon: Scale },
  { href: '/dashboard/explain', label: 'Why This Score?', icon: Lightbulb },
  { href: '/dashboard/gaps', label: 'Skill Gaps', icon: ScanSearch },
  { href: '/dashboard/roadmap', label: '30-Day Roadmap', icon: Map },
  { href: '/dashboard/tests', label: 'Skill Tests', icon: BrainCircuit },
  { href: '/dashboard/history', label: 'Analysis History', icon: Clock },
  { href: '/dashboard/summary', label: 'Summary', icon: ScrollText },
  { href: '/dashboard/leaderboard', label: 'Leaderboard', icon: Trophy },
  { href: '/dashboard/membership', label: 'Membership', icon: Star },
]


import { IsometricBackground } from '@/components/ui/isometric-background'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoaded } = useUser()
  const router = useRouter()
  const pathname = usePathname()
  const currentAnalysis = useQuery(api.analysis.getLatestAnalysis)
  const userProfile = useQuery(api.users.getProfile)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isAtBottom, setIsAtBottom] = useState(false)
  
  const credits = userProfile?.credits ?? 0
  const maxCredits = 3
  const creditPercentage = (credits / maxCredits) * 100
  const membership = userProfile?.membership ?? 'free'

  const handleScroll = (e: React.UIEvent<HTMLElement>) => {
    const target = e.currentTarget
    const isBottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) < 150
    setIsAtBottom(isBottom)
  }

  const scrollRef = React.useRef<HTMLElement>(null)
  
  useEffect(() => {
    const checkScroll = () => {
      if (scrollRef.current) {
        const target = scrollRef.current
        const isBottom = Math.abs(target.scrollHeight - target.clientHeight - target.scrollTop) < 150
        setIsAtBottom(isBottom)
      }
    }

    checkScroll()

    const currentRef = scrollRef.current
    if (!currentRef) return

    const observer = new ResizeObserver(() => {
      checkScroll()
    })
    
    observer.observe(currentRef)
    Array.from(currentRef.children).forEach(child => {
      observer.observe(child)
    })

    return () => observer.disconnect()
  }, [pathname])

  useEffect(() => {
    if (isLoaded && !user) {
      router.push('/login')
    }
  }, [isLoaded, user, router])

  if (!isLoaded || !user) {
    return null
  }

  return (
    <div className="h-screen bg-background flex overflow-hidden">
      {/* Mobile Sidebar Toggle & Theme */}
      <div className="fixed top-4 left-4 z-50 lg:hidden flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="bg-background/80 backdrop-blur"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
        <AnimatedThemeToggler className="w-10 h-10 flex items-center justify-center rounded-md bg-background/80 backdrop-blur hover:bg-background/90 transition-colors border shadow-sm" />
      </div>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed lg:sticky lg:top-0 lg:h-screen inset-y-0 left-0 z-40
        ${isCollapsed ? 'lg:w-20' : 'lg:w-64'} w-64 bg-sidebar border-r border-sidebar-border
        transform transition-all duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="flex flex-col h-full overflow-x-hidden">
          {/* Logo */}
          <div className="h-16 border-b border-sidebar-border flex items-center shrink-0">
            <Link href="/" className="flex items-center px-5 w-full">
              <div className="w-10 h-10 shrink-0 rounded-lg bg-sidebar-primary/20 flex items-center justify-center">
                <BrainCircuit className="w-6 h-6 shrink-0 text-sidebar-primary" />
              </div>
              <span className={`text-xl font-bold text-sidebar-foreground whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 ml-0' : 'w-24 opacity-100 ml-3'}`}>
                Skillup
              </span>
            </Link>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 py-4">
            <nav className="space-y-2 px-3">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`
                      flex items-center px-3 py-2 rounded-lg transition-colors
                      ${isActive
                        ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                        : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground'
                      }
                    `}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <Icon className="w-5 h-5 shrink-0" />
                    <span className={`text-sm font-medium whitespace-nowrap overflow-hidden transition-all duration-300 ${isCollapsed ? 'w-0 opacity-0 ml-0' : 'w-40 opacity-100 ml-3'}`}>
                      {item.label}
                    </span>
                  </Link>
                )
              })}
            </nav>
          </ScrollArea>
          
          {/* Membership/Credits Section */}
          <div className={`mx-4 mb-4 p-4 rounded-xl bg-sidebar-accent/50 border border-sidebar-border transition-all duration-300 ${isCollapsed ? 'opacity-0 h-0 p-0 mb-0 overflow-hidden' : 'opacity-100'}`}>
            <div className="flex items-center justify-between mb-3 text-sidebar-foreground">
              <span className="text-xs font-semibold uppercase tracking-wider">Plan: {membership}</span>
              <span className="text-xs font-bold text-sidebar-primary bg-sidebar-primary/10 px-2 py-0.5 rounded-full">
                {credits}/{maxCredits} Credits
              </span>
            </div>
            
            <div className="space-y-2">
              <div className="h-1.5 w-full bg-sidebar-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-sidebar-primary rounded-full transition-all duration-500" 
                  style={{ width: `${creditPercentage}%` }}
                />
              </div>
              <p className="text-[10px] text-sidebar-foreground/50 leading-tight">
                Credits reset daily. Upgrade for unlimited analysis.
              </p>
              <Link href="/dashboard/membership" className="w-full">
                <Button size="sm" className="w-full mt-2 h-8 text-xs bg-sidebar-primary hover:bg-sidebar-primary/90 text-sidebar-primary-foreground font-bold shadow-sm">
                  Upgrade to Pro
                </Button>
              </Link>
            </div>
          </div>

          {/* User Section */}
          <div className="p-4 border-t border-sidebar-border">
            <div className="flex items-center px-1">
              <div className="shrink-0 flex items-center justify-center">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-10 h-10 border border-border/50 shadow-sm",
                      userButtonPopoverCard: "shadow-xl border border-border/50",
                    }
                  }}
                />
              </div>
              <div className={`transition-all duration-300 flex-none ${isCollapsed ? 'w-0 opacity-0 ml-0' : 'w-40 opacity-100 ml-3'}`}>
                <p className="text-sm font-medium text-sidebar-foreground truncate pointer-events-none">
                  {user.fullName || user.primaryEmailAddress?.emailAddress || 'User'}
                </p>
                <p className="text-xs text-sidebar-foreground/60 truncate pointer-events-none">
                  {currentAnalysis === undefined ? (
                    'Loading...'
                  ) : currentAnalysis ? (
                    currentAnalysis.roleSnapshot.title
                  ) : (
                    'Not analyzed'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 h-screen relative flex flex-col min-w-0 overflow-hidden">
        <IsometricBackground />
        <div className="h-16 flex items-center justify-between px-4 lg:px-8 border-b shrink-0 bg-background/50 backdrop-blur-sm z-20">
          <Button
            variant="ghost"
            size="icon"
            className="hidden lg:flex text-muted-foreground hover:text-foreground"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            <Menu className="w-6 h-6" />
          </Button>
          <AnimatedThemeToggler className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors ml-auto" />
        </div>
        <main className="flex-1 overflow-y-auto" ref={scrollRef as any} onScroll={handleScroll}>
          <div className="p-4 lg:p-8 pt-6 min-h-max pb-24">
            {children}
          </div>
        </main>
        {pathname !== '/dashboard' && (
          <ProgressiveBlur 
            position="bottom" 
            className={`absolute bottom-0 left-0 w-full z-10 pointer-events-none h-24 transition-opacity duration-150 ${isAtBottom ? 'opacity-0' : 'opacity-100'}`} 
          />
        )}
      </div>
    </div>
  )
}
