'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  ScrollText,
  CircleCheckBig,
  Crosshair,
  AlertTriangle,
  RefreshCcw,
  Download,
  Share2,
  Award,
  ArrowUpRight,
  BrainCircuit,
  ChevronRight
} from 'lucide-react'
import { DashboardOverviewSkeleton } from '@/components/dashboard/dashboard-skeleton'
import NumberTicker from '@/components/dashboard/number-ticker'

function getStatusConfig(status: string) {
  switch (status) {
    case 'ready':
      return {
        label: 'Ready',
        color: 'bg-success text-success-foreground',
        message: 'Congratulations! You are ready for this role.',
        icon: Award
      }
    case 'almost':
      return {
        label: 'Almost Ready',
        color: 'bg-warning text-warning-foreground',
        message: 'You are close! Focus on a few key skills to be fully ready.',
        icon: ArrowUpRight
      }
    default:
      return {
        label: 'Needs Upskilling',
        color: 'bg-destructive text-destructive-foreground',
        message: 'Some upskilling is needed. Follow the roadmap to improve.',
        icon: Crosshair
      }
  }
}

function SummaryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const analysisId = searchParams.get('id') as Id<"analyses"> | null

  const specificAnalysis = useQuery(api.analysis.getAnalysisById, analysisId ? { id: analysisId } : "skip")
  const liveAnalysis = useQuery(api.analysis.getLiveProfile)

  const currentAnalysis = analysisId ? specificAnalysis : liveAnalysis
  const jobRole = useQuery(api.onboarding.getJobRole)

  if (currentAnalysis === undefined || jobRole === undefined) {
    return <DashboardOverviewSkeleton />
  }

  if (!currentAnalysis || !jobRole) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <BrainCircuit className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Analysis Found</h2>
        <p className="text-muted-foreground mb-8">
          Complete your analysis to see a full summary of your career readiness.
        </p>
        <Link href="/onboarding/role">
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            Start Analysis
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    )
  }

  const statusConfig = getStatusConfig(currentAnalysis.readinessStatus)
  const StatusIcon = statusConfig.icon

  // Top strengths (matched core skills)
  const strengths = currentAnalysis.matchedSkills
    .filter(s => (jobRole.coreSkills || []).map(cs => cs.toLowerCase()).includes(s.toLowerCase()))
    .slice(0, 5)

  // Focus areas (missing core skills)
  const focusAreas = currentAnalysis.missingSkills
    .filter(s => (jobRole.coreSkills || []).map(cs => cs.toLowerCase()).includes(s.toLowerCase()))
    .slice(0, 5)

  const handleRestartAnalysis = () => {
    router.push('/onboarding/role')
  }

  const handleDownload = () => {
    const report = `
CAREER READINESS REPORT
Role: ${currentAnalysis.roleSnapshot.title}
Date: ${new Date(currentAnalysis.createdAt).toLocaleDateString()}
Readiness Score: ${currentAnalysis.readinessScore}%
Status: ${currentAnalysis.readinessStatus}

MATCHED SKILLS:
${currentAnalysis.matchedSkills.join(', ')}

MISSING SKILLS:
${currentAnalysis.missingSkills.join(', ')}

RESUME FIT SCORE: ${currentAnalysis.resumeFitScore}/100
    `.trim()

    const blob = new Blob([report], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `career-report-${currentAnalysis.roleSnapshot.title.toLowerCase().replace(/\s+/g, '-')}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleShare = async () => {
    const shareData = {
      title: 'My Career Readiness Report',
      text: `I just analyzed my readiness for ${currentAnalysis.roleSnapshot.title} on Skillup! My score is ${currentAnalysis.readinessScore}%.`,
      url: window.location.href
    }

    try {
      if (navigator.share) {
        await navigator.share(shareData)
      } else {
        await navigator.clipboard.writeText(window.location.href)
        alert('Link copied to clipboard!')
      }
    } catch (err) {
      console.error('Error sharing:', err)
    }
  }

  return (
    <div className="space-y-6 max-w-7xl w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <ScrollText className="w-8 h-8 text-primary" />
          Analysis Summary
          {(currentAnalysis as any).isLive && (
            <Badge variant="outline" className="ml-2 border-primary/40 text-primary bg-primary/5 text-[10px] uppercase font-bold tracking-tighter">
              LIVE PROGRESS ACTIVE
            </Badge>
          )}
        </h1>
        <p className="text-muted-foreground mt-1">
          Your complete career readiness report
        </p>
      </div>

      {/* Status Card */}
      <Card className={`border-2 ${currentAnalysis.readinessStatus === 'ready'
        ? 'border-success/30 bg-success/5'
        : currentAnalysis.readinessStatus === 'almost'
          ? 'border-warning/30 bg-warning/5'
          : 'border-destructive/30 bg-destructive/5'
        }`}>
        <CardContent className="p-8 text-center">
          <div className="w-20 h-20 rounded-full bg-background mx-auto mb-4 flex items-center justify-center">
            <StatusIcon className={`w-10 h-10 ${currentAnalysis.readinessStatus === 'ready'
              ? 'text-success'
              : currentAnalysis.readinessStatus === 'almost'
                ? 'text-warning'
                : 'text-destructive'
              }`} />
          </div>
          <div className="text-5xl font-bold text-foreground mb-2">
            <NumberTicker value={currentAnalysis.readinessScore} />%
          </div>
          <Badge className={`${statusConfig.color} text-lg px-4 py-1 mb-4`}>
            {statusConfig.label}
          </Badge>
          <p className="text-muted-foreground max-w-md mx-auto">
            {statusConfig.message}
          </p>
        </CardContent>
      </Card>

      {/* Role Info */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Target Role</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/30 dark:bg-secondary/20">
              <p className="text-sm text-muted-foreground">Position</p>
              <p className="font-medium text-foreground">{currentAnalysis.roleSnapshot.title}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 dark:bg-secondary/20">
              <p className="text-sm text-muted-foreground">Domain</p>
              <p className="font-medium text-foreground capitalize">{currentAnalysis.roleSnapshot.domain.replace(/-/g, ' ')}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 dark:bg-secondary/20">
              <p className="text-sm text-muted-foreground">Level</p>
              <p className="font-medium text-foreground capitalize">{currentAnalysis.roleSnapshot.roleLevel}</p>
            </div>
            <div className="p-4 rounded-lg bg-muted/30">
              <p className="text-sm text-muted-foreground">Resume Fit</p>
              <p className="font-medium text-foreground">
                <NumberTicker value={currentAnalysis.resumeFitScore} />/100
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths & Focus Areas */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Strengths */}
        <Card className="border-success/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-success">
              <CircleCheckBig className="w-5 h-5" />
              Your Strengths
            </CardTitle>
            <CardDescription>
              Skills where you excel
            </CardDescription>
          </CardHeader>
          <CardContent>
            {strengths.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                Build your strengths by learning core skills
              </p>
            ) : (
              <div className="space-y-3">
                {strengths.map(skill => (
                  <div
                    key={skill}
                    className="flex items-center gap-3 p-3 rounded-lg bg-success/10 border border-success/20"
                  >
                    <CircleCheckBig className="w-5 h-5 text-success" />
                    <span className="font-medium text-foreground">{skill}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Focus Areas */}
        <Card className="border-warning/30">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-warning">
              <AlertTriangle className="w-5 h-5" />
              Focus Areas
            </CardTitle>
            <CardDescription>
              Priority skills to develop
            </CardDescription>
          </CardHeader>
          <CardContent>
            {focusAreas.length === 0 ? (
              <p className="text-success text-center py-4">
                Great job! You have all core skills covered.
              </p>
            ) : (
              <div className="space-y-3">
                {focusAreas.map(skill => (
                  <div
                    key={skill}
                    className="flex items-center gap-3 p-3 rounded-lg bg-warning/10 border border-warning/20"
                  >
                    <Crosshair className="w-5 h-5 text-warning" />
                    <span className="font-medium text-foreground">{skill}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Quick Stats */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Analysis Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 rounded-lg bg-muted/30 dark:bg-secondary/20">
              <div className="text-3xl font-bold text-primary dark:text-[#a4c3b2]">{currentAnalysis.readinessScore}%</div>
              <p className="text-sm text-muted-foreground">Readiness</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30 dark:bg-secondary/20">
              <div className="text-3xl font-bold text-success">{currentAnalysis.matchedSkills.length}</div>
              <p className="text-sm text-muted-foreground">Matched</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30 dark:bg-secondary/20">
              <div className="text-3xl font-bold text-destructive">{currentAnalysis.missingSkills.length}</div>
              <p className="text-sm text-muted-foreground">Missing</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/30 dark:bg-secondary/20">
              <div className="text-3xl font-bold text-foreground">{currentAnalysis.resumeFitScore}</div>
              <p className="text-sm text-muted-foreground">Resume Fit</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <Card className="border-border/50">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button variant="outline" className="gap-2 w-full sm:w-auto bg-transparent" onClick={handleDownload}>
              <Download className="w-4 h-4" />
              Download Report
            </Button>
            <Button variant="outline" className="gap-2 w-full sm:w-auto bg-transparent" onClick={handleShare}>
              <Share2 className="w-4 h-4" />
              Share Results
            </Button>
            <Button
              className="gap-2 w-full sm:w-auto bg-primary text-primary-foreground hover:bg-primary/90"
              onClick={handleRestartAnalysis}
            >
              <RefreshCcw className="w-4 h-4" />
              Start New Analysis
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="text-lg">Recommended Next Steps</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">1</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Review your 30-day roadmap</p>
                <p className="text-sm text-muted-foreground">Follow the personalized learning path</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">2</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Focus on core skills first</p>
                <p className="text-sm text-muted-foreground">These have the highest impact on your score</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-xs font-bold text-primary">3</span>
              </div>
              <div>
                <p className="font-medium text-foreground">Re-analyze after learning</p>
                <p className="text-sm text-muted-foreground">Track your progress with new analyses</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Link href="/dashboard/roadmap">
          <Button variant="outline">Back to Roadmap</Button>
        </Link>
        <Link href="/dashboard">
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  )
}

export default function SummaryPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground animate-pulse">Loading summary...</p>
        </div>
      </div>
    }>
      <SummaryContent />
    </Suspense>
  )
}
