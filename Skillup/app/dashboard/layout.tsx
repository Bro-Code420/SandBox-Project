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
import { Badge } from '@/components/ui/badge'
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
  Trophy,
  FileText,
  CreditCard,
  Settings
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Gauge },
  { href: '/dashboard/comparison', label: 'You vs Industry', icon: Scale },
  { href: '/dashboard/explain', label: 'Why This Score?', icon: Lightbulb },
  { href: '/dashboard/gaps', label: 'Skill Gaps', icon: ScanSearch },
  { href: '/dashboard/roadmap', label: '30-Day Roadmap', icon: Map },
  { href: '/dashboard/tests', label: 'Skill Tests', icon: BrainCircuit },
  { href: '/dashboard/resume', label: 'Resume Builder', icon: FileText },
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
    <div className={cn(
      "h-screen bg-background flex overflow-hidden w-full mx-auto border-none",
      "flex-col md:flex-row"
    )}>
      <Sidebar open={sidebarOpen} setOpen={setSidebarOpen}>
        <SidebarBody className="justify-between gap-10 bg-sidebar border-r border-sidebar-border">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {/* Logo Section */}
            <div className={cn(
              "flex items-center py-6 border-b border-sidebar-border/30 mb-4 transition-all duration-300 relative group",
              sidebarOpen ? "justify-start px-4 gap-3" : "justify-center px-0 gap-0"
            )}>
               {/* Background Glow */}
               <div className="absolute inset-0 bg-gradient-to-r from-sidebar-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               
               <div className="relative">
                 <div className="w-12 h-12 shrink-0 rounded-2xl bg-gradient-to-br from-sidebar-primary/20 to-sidebar-primary/5 flex items-center justify-center border border-sidebar-primary/20 shadow-inner">
                    <BrainCircuit className="w-7 h-7 text-sidebar-primary drop-shadow-[0_0_8px_rgba(107,144,128,0.5)]" />
                 </div>
                 {/* Small Pulse Aura */}
                 <div className="absolute -inset-1 bg-sidebar-primary/10 rounded-2xl blur-sm animate-pulse -z-10" />
               </div>

               {sidebarOpen && (
                 <motion.div 
                   initial={{ opacity: 0, x: -10 }}
                   animate={{ opacity: 1, x: 0 }}
                   className="flex flex-col"
                 >
                   <span className="text-2xl font-black text-sidebar-foreground tracking-tighter leading-none">
                     SkillUp
                   </span>
                   <span className="text-sidebar-primary italic text-[10px] font-black uppercase tracking-[0.3em] mt-1 flex items-center gap-1 drop-shadow-[0_0_5px_rgba(107,144,128,0.8)]">
                     <span className="w-1.5 h-1.5 rounded-full bg-sidebar-primary animate-pulse shadow-[0_0_8px_rgba(107,144,128,1)]" />
                     Intelligence AI
                   </span>
                 </motion.div>
               )}
            </div>

            {/* Navigation */}
            <div className="flex flex-col gap-1 px-1">
              {navItems.map((item, idx) => (
                <SidebarLink 
                  key={idx} 
                  link={{
                    label: item.label,
                    href: item.href,
                    icon: (
                      <item.icon className={cn(
                        "h-5 w-5 shrink-0 transition-colors",
                        pathname === item.href ? "text-sidebar-primary-foreground" : "text-sidebar-foreground/60"
                      )} />
                    )
                  }}
                  className={cn(
                    "rounded-xl transition-all duration-200",
                    sidebarOpen ? "px-3 py-2.5" : "px-0 py-2",
                    pathname === item.href 
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20" 
                      : "hover:bg-sidebar-accent/50 text-sidebar-foreground/70"
                  )}
                />
              ))}
            </div>

            {/* Credits Section (Only when open) */}
            {sidebarOpen && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 mx-2 p-4 rounded-2xl bg-gradient-to-br from-sidebar-accent/30 to-sidebar-accent/10 border border-sidebar-border/50"
              >
                <div className="flex items-center justify-between mb-3 text-sidebar-foreground">
                  <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Plan: {membership}</span>
                  <Badge variant="outline" className="bg-sidebar-primary/10 text-sidebar-primary border-none text-[10px] h-5 px-2">
                    {credits}/{maxCredits}
                  </Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="h-1.5 w-full bg-sidebar-border/50 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${creditPercentage}%` }}
                      className="h-full bg-sidebar-primary rounded-full" 
                    />
                  </div>
                  <p className="text-[9px] text-sidebar-foreground/40 leading-tight italic">
                    Resets daily. Upgrade for unlimited power.
                  </p>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="w-full mt-3 h-8 text-[10px] font-black uppercase tracking-wider border-sidebar-primary/30 hover:bg-sidebar-primary hover:text-sidebar-primary-foreground transition-all"
                    onClick={() => router.push('/dashboard/membership')}
                  >
                    Upgrade Pro
                  </Button>
                </div>
              </motion.div>
            )}
          </div>

          {/* Footer User Section */}
          <div className="border-t border-sidebar-border/50 pt-4 pb-2">
             <div className="flex items-center gap-3 px-2">
                <UserButton 
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      userButtonAvatarBox: "w-8 h-8 border border-sidebar-border/50",
                    }
                  }}
                />
                {sidebarOpen && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col min-w-0"
                  >
                    <p className="text-xs font-bold text-sidebar-foreground truncate leading-tight">
                      {user.fullName || 'Career Champion'}
                    </p>
                    <p className="text-[10px] text-sidebar-foreground/50 truncate">
                      {currentAnalysis?.roleSnapshot.title || 'Analyzing Profile...'}
                    </p>
                  </motion.div>
                )}
             </div>
          </div>
        </SidebarBody>
      </Sidebar>

      {/* Main Content */}
      <div className="flex-1 h-screen relative flex flex-col min-w-0 overflow-hidden">
        <IsometricBackground />
        <div className="h-16 flex items-center justify-between px-4 lg:px-8 border-b shrink-0 bg-background/50 backdrop-blur-sm z-20">
          <div className="lg:hidden" /> {/* Spacer for mobile toggle which is now handled by Sidebar component */}
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
