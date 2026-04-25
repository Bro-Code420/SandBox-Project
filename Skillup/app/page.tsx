"use client"

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Authenticated, Unauthenticated } from "convex/react";
import { SignInButton, UserButton, useUser } from "@clerk/nextjs";
import { useQuery } from "convex/react";
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { api } from "../convex/_generated/api";
import {
  Crosshair,
  Activity,
  Map,
  BrainCircuit,
  ChevronRight,
  Rocket,
  ShieldCheck,
  ArrowUpRight
} from 'lucide-react'
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text'
import { AnimatedThemeToggler } from '@/components/ui/animated-theme-toggler'
import { ScrollVelocityContainer, ScrollVelocityRow } from '@/components/ui/scroll-based-velocity'
import { PulsatingButton } from '@/components/ui/pulsating-button'
import NumberTicker from '@/components/dashboard/number-ticker'
import { TypingAnimation } from '@/components/ui/typing-animation'
import { CinematicFooter } from '@/components/motion-footer'

import GlareHover from '@/components/ui/glare-hover'
import LogoLoop from '@/components/LogoLoop'

export default function LandingPage() {
  const { user, isLoaded } = useUser()
  const router = useRouter()

  useEffect(() => {
    if (isLoaded && user) {
      router.push('/dashboard')
    }
  }, [isLoaded, user, router])

  if (isLoaded && user) {
    return null // Prevent flash of landing page
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Header */}
      <header className="border-b border-primary/10 backdrop-blur-md bg-background/80 sticky top-0 z-50 transition-all shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <BrainCircuit className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">Skillup</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#features" className="text-muted-foreground hover:text-foreground transition-colors">
              Features
            </Link>
            <Link href="#how-it-works" className="text-muted-foreground hover:text-foreground transition-colors">
              How It Works
            </Link>
            <Authenticated>
              <Link href="/dashboard">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
            </Authenticated>
            <Unauthenticated>
              <Link href="/login">
                <Button variant="outline" size="sm" className="hidden sm:flex border-primary/20 hover:bg-primary/5">
                  Login
                </Button>
              </Link>
            </Unauthenticated>
            <AnimatedThemeToggler className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-black/5 dark:hover:bg-white/10 transition-colors" />
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Geometric Pattern Background */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: `
              conic-gradient(from 120deg at 50% 87.5%, #f6edb3 120deg, #0000 0),
              conic-gradient(from 120deg at 50% 87.5%, #f6edb3 120deg, #0000 0),
              conic-gradient(from 180deg at 75%, #acc4a3 60deg, #0000 0),
              conic-gradient(from 60deg at 75% 75%, #f6edb3 0 60deg, #0000 0),
              linear-gradient(150deg, #0000 calc(25% / 3), #f6edb3 0 25%, #0000 0),
              conic-gradient(at 25% 25%, #0000 50%, #acc4a3 0 240deg, #f6edb3 0 300deg, #acc4a3 0),
              linear-gradient(-150deg, #0000 calc(25% / 3), #f6edb3 0 25%, #0000 0)
            `,
            backgroundColor: '#55897c',
            backgroundSize: `calc(0.866 * 194px) 194px`,
            backgroundPosition: `0 0, 0 calc(194px / 2), 0 0, 0 0, 0 calc(194px / 2), 0 0, 0 0`
          }}
        />
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background to-background" />
        <div className="absolute top-0 w-full h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

        <div className="container mx-auto px-4 pt-14 pb-24 md:pt-20 md:pb-32 relative">
          <div className="max-w-5xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8 font-black backdrop-blur-sm group cursor-default">
                <div className="inline-flex items-center justify-center gap-2 text-primary drop-shadow-[0_0_15px_rgba(164,195,178,0.8)]">
                  <BrainCircuit className="w-4 h-4" />
                  <span className="text-xs sm:text-sm uppercase tracking-widest text-primary font-black">AI-Powered Career Analysis</span>
                </div>
            </div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-foreground mb-8 leading-[0.95] tracking-tighter">
              Discover Your{' '}<span className="text-primary">Career<br />Readiness</span>{' '}with AI
            </h1>

            <div className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              <TypingAnimation
                as="p"
                duration={40}
                deleteSpeed={20}
                pauseDelay={2000}
                className="text-xl md:text-2xl text-muted-foreground leading-relaxed"
                startOnView
                showCursor
                cursorStyle="line"
                loop
              >
                Analyze your skills against any job role, identify gaps, and get a personalized 30-day learning roadmap to land your dream job.
              </TypingAnimation>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/login">
                <PulsatingButton
                  className="px-10 h-14 text-base font-semibold rounded-full group"
                  pulseColor="var(--primary)"
                >
                  <div className="flex items-center gap-2 text-foreground dark:text-emerald-900 drop-shadow-[0_0_20px_rgba(0,0,0,0.1)] font-bold">
                    Get Started
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </PulsatingButton>
              </Link>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-24 max-w-5xl mx-auto">
            {[
              { value: 50, suffix: '+', label: 'Job Roles' },
              { value: 200, suffix: '+', label: 'Skills Tracked', stiffness: 20, damping: 10 },
              { value: '30-Day', label: 'Roadmaps', isStatic: true },
              { value: 'ATS', label: 'Friendly Resume', isStatic: true },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-8 rounded-2xl bg-card border border-primary/10 shadow-lg hover:shadow-xl hover:bg-card/80 transition-all cursor-default">
                <div className="text-4xl md:text-5xl font-black text-primary mb-2 whitespace-nowrap">
                  {stat.isStatic ? (
                    stat.value
                  ) : (
                    <NumberTicker 
                      value={stat.value as number} 
                      suffix={stat.suffix}
                      stiffness={stat.stiffness}
                      damping={stat.damping}
                    />
                  )}
                </div>
                <div className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Velocity Scroll Section */}
      <section className="py-12 md:py-16 border-y border-border/50 bg-background overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" />
        
        <ScrollVelocityContainer className="flex flex-col gap-4">
          <ScrollVelocityRow baseVelocity={-3} className="text-4xl md:text-6xl font-black text-primary/60 dark:text-primary/40 uppercase tracking-tighter">
            AI-Powered Career Analysis &nbsp;•&nbsp; 30-Day Learning Roadmaps &nbsp;•&nbsp; Real-time Skill Gap Detection &nbsp;•&nbsp;
          </ScrollVelocityRow>
          <ScrollVelocityRow baseVelocity={3} className="text-4xl md:text-6xl font-black text-primary dark:text-primary/60 uppercase tracking-tighter">
            Industry Role Benchmarking &nbsp;•&nbsp; Explainable AI Scoring &nbsp;•&nbsp; Personalized Growth Path &nbsp;•&nbsp;
          </ScrollVelocityRow>
        </ScrollVelocityContainer>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 relative">
        <div className="absolute inset-0 bg-background/50 backdrop-blur-3xl" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
              Everything You Need to Level Up
            </h2>
            <TypingAnimation
              as="p"
              duration={30}
              pauseDelay={5000}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              startOnView
              showCursor
              cursorStyle="line"
              loop
            >
              Our AI analyzes your skills, compares them to industry standards, and creates a personalized path to career success.
            </TypingAnimation>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {[
              {
                icon: Crosshair,
                title: 'Skill Gap Analysis',
                description: 'Identify exactly which skills you need to develop for your target role.',
              },
              {
                icon: Activity,
                title: 'Readiness Score',
                description: 'Get a clear score showing how ready you are for your dream job.',
              },
              {
                icon: Map,
                title: '30-Day Roadmap',
                description: 'Follow a personalized learning path with curated courses and resources.',
              },
              {
                icon: Rocket,
                title: 'Instant Analysis',
                description: 'Get your results in seconds with our fast AI-powered analysis.',
              },
              {
                icon: ShieldCheck,
                title: 'Industry Standards',
                description: 'Compare your skills against real industry requirements.',
              },
              {
                icon: ArrowUpRight,
                title: 'Track Progress',
                description: 'Monitor your improvement with analysis history and insights.',
              },
            ].map((feature) => (
              <GlareHover
                key={feature.title}
                className="group"
                borderRadius="1.5rem"
                glareSize={150}
                glareOpacity={0.4}
              >
                <div className="p-8 h-full rounded-3xl bg-card border border-primary/10 hover:border-primary/30 shadow-md transition-all duration-300">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-3">{feature.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </GlareHover>
            ))}
          </div>
        </div>
      </section>

        {/* Logo Loop Section */}
        <div className="py-20 border-y border-primary/10 overflow-hidden">
          <div className="container mx-auto px-4 text-center mb-10">
            <p className="text-sm font-bold text-muted-foreground/50 uppercase tracking-[0.3em]">
              Trusted Analysis for Global Standards
            </p>
          </div>
          <LogoLoop 
            speed={40}
            direction="left"
            logoHeight={48}
            gap={64}
            logos={[
              { node: <div className="flex items-center gap-3 font-black text-foreground/50 dark:text-foreground/70 hover:text-primary transition-all cursor-default"><Activity className="w-9 h-9" /> <span className="text-xl md:text-2xl tracking-tighter uppercase">Performance</span></div> },
              { node: <div className="flex items-center gap-3 font-black text-foreground/50 dark:text-foreground/70 hover:text-primary transition-all cursor-default"><BrainCircuit className="w-9 h-9" /> <span className="text-xl md:text-2xl tracking-tighter uppercase">Machine Learning</span></div> },
              { node: <div className="flex items-center gap-3 font-black text-foreground/50 dark:text-foreground/70 hover:text-primary transition-all cursor-default"><ShieldCheck className="w-9 h-9" /> <span className="text-xl md:text-2xl tracking-tighter uppercase">Compliance</span></div> },
              { node: <div className="flex items-center gap-3 font-black text-foreground/50 dark:text-foreground/70 hover:text-primary transition-all cursor-default"><Rocket className="w-9 h-9" /> <span className="text-xl md:text-2xl tracking-tighter uppercase">Scalability</span></div> },
              { node: <div className="flex items-center gap-3 font-black text-foreground/50 dark:text-foreground/70 hover:text-primary transition-all cursor-default"><Crosshair className="w-9 h-9" /> <span className="text-xl md:text-2xl tracking-tighter uppercase">Precision</span></div> },
              { node: <div className="flex items-center gap-3 font-black text-foreground/50 dark:text-foreground/70 hover:text-primary transition-all cursor-default"><Map className="w-9 h-9" /> <span className="text-xl md:text-2xl tracking-tighter uppercase">Roadmaps</span></div> },
            ]}
          />
        </div>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6 tracking-tight">
              How It Works
            </h2>
            <TypingAnimation
              as="p"
              duration={30}
              pauseDelay={5000}
              className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
              startOnView
              showCursor
              cursorStyle="line"
              loop
            >
              Get from skill assessment to personalized roadmap in just 4 simple steps.
            </TypingAnimation>
          </div>

          <div className="max-w-4xl mx-auto">
            {[
              {
                step: '01',
                title: 'Select Your Target Role',
                description: 'Choose your desired job domain and experience level (intern, junior, mid, or senior).',
              },
              {
                step: '02',
                title: 'Input Your Skills',
                description: 'Tell us about your current skills and experience. Upload a resume or select from our skill library.',
              },
              {
                step: '03',
                title: 'Get AI Analysis',
                description: 'Our AI compares your skills against industry requirements and calculates your readiness score.',
              },
              {
                step: '04',
                title: 'Follow Your Roadmap',
                description: 'Receive a personalized 30-day learning plan with courses and YouTube tutorials.',
              },
            ].map((item, index) => (
              <div
                key={item.step}
                className="flex gap-6 mb-12 last:mb-0 group"
              >
                <div className="flex-shrink-0 relative">
                  <div className="w-16 h-16 rounded-full bg-card border border-primary/20 flex items-center justify-center shadow-md group-hover:shadow-primary/30 group-hover:border-primary/50 transition-all duration-500 z-10 relative">
                    <span className="text-primary font-bold text-lg">{item.step}</span>
                  </div>
                  {index < 3 && (
                    <div className="absolute top-16 left-1/2 -translate-x-1/2 w-0.5 h-full bg-gradient-to-b from-primary/30 to-transparent -z-10" />
                  )}
                </div>
                <div className="pt-4">
                  <h3 className="text-2xl font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-muted-foreground leading-relaxed text-lg">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CinematicFooter />
    </div>
  )
}
