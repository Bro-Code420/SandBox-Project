'use client'

import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  AlertTriangle,
  ChevronRight,
  ArrowUpRight,
  Crosshair,
  ScrollText,
  Check,
  X,
  BrainCircuit,
  Upload,
  ScanSearch,
  TrendingUp,
  ShieldCheck,
  Zap
} from 'lucide-react'
import { DashboardOverviewSkeleton } from '@/components/dashboard/dashboard-skeleton'
import NumberTicker from '@/components/dashboard/number-ticker'

function getStatusConfig(status: string) {
  switch (status) {
    case 'ready':
      return {
        label: 'Ready',
        color: 'bg-success text-success-foreground',
        bgColor: 'bg-success/10',
        borderColor: 'border-success/30',
      }
    case 'almost':
      return {
        label: 'Almost Ready',
        color: 'bg-warning text-warning-foreground',
        bgColor: 'bg-warning/10',
        borderColor: 'border-warning/30',
      }
    default:
      return {
        label: 'Needs Upskilling',
        color: 'bg-destructive text-destructive-foreground',
        bgColor: 'bg-destructive/10',
        borderColor: 'border-destructive/30',
      }
  }
}

export default function DashboardPage() {
  const currentAnalysis = useQuery(api.analysis.getLiveProfile)
  const jobRole = useQuery(api.onboarding.getJobRole)

  if (currentAnalysis === undefined || jobRole === undefined) {
    return <DashboardOverviewSkeleton />
  }

  if (!currentAnalysis) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4">
        <Card className="border border-primary/20 bg-card p-8 text-center space-y-6 shadow-xl shadow-primary/5 rounded-3xl">
          <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <BrainCircuit className="w-10 h-10 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold text-foreground">Complete Your Analysis</h1>
            <p className="text-muted-foreground">
              You haven't completed your career readiness analysis yet.
              Start now to discover your readiness score and get a personalized roadmap.
            </p>
          </div>
          <Link href="/onboarding/role">
            <Button size="lg" className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
              Start Analysis
              <ChevronRight className="w-4 h-4" />
            </Button>
          </Link>
        </Card>
      </div>
    )
  }

  const statusConfig = getStatusConfig(currentAnalysis.readinessStatus)
  const criticalMissing = currentAnalysis.missingSkills.filter(skill =>
    jobRole?.coreSkills?.includes(skill)
  ).slice(0, 3)

  return (
    <div className="space-y-6 max-w-7xl w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          Career Readiness Dashboard
          {(currentAnalysis as any).isLive && (
            <Badge variant="outline" className="border-primary/40 text-primary bg-primary/5 text-[10px] uppercase font-bold tracking-tighter">
              LIVE PROGRESS ACTIVE
            </Badge>
          )}
        </h1>
        <p className="text-muted-foreground mt-1">
          Role: {currentAnalysis.roleSnapshot.title}
        </p>
      </div>

      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Readiness Score */}
        <Card className="border border-primary/10 bg-card shadow-sm hover:shadow-md transition-shadow md:col-span-2 lg:col-span-1 rounded-2xl overflow-hidden relative">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -mr-10 -mt-10" />
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Readiness Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <div className="relative w-32 h-32">
                <svg className="w-32 h-32 transform -rotate-90">
                  <circle
                    className="text-border dark:text-secondary"
                    strokeWidth="8"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                  />
                  <circle
                    className="text-primary dark:text-[#a4c3b2] transition-all duration-1000 ease-out"
                    strokeWidth="8"
                    strokeDasharray={`${currentAnalysis.readinessScore * 3.64} 364`}
                    strokeLinecap="round"
                    stroke="currentColor"
                    fill="transparent"
                    r="58"
                    cx="64"
                    cy="64"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-foreground">
                    <NumberTicker value={currentAnalysis.readinessScore} />%
                  </span>
                </div>
              </div>
              <div>
                <Badge className={statusConfig.color}>
                  {statusConfig.label}
                </Badge>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span>Potential: <span className="text-foreground font-bold">{(currentAnalysis as any).potentialScore || 85}%</span></span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <ShieldCheck className="w-4 h-4 text-success" />
                    <span>Confidence: <span className="text-foreground font-bold">{(currentAnalysis as any).confidenceScore || 80}%</span></span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Resume Fit Score */}
        <Card className="border border-primary/10 bg-card shadow-sm hover:shadow-md transition-shadow rounded-2xl relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl -ml-10 -mb-10" />
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ScrollText className="w-5 h-5 text-primary" />
              Resume Fit Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!currentAnalysis.resumeText ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-warning">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">No resume analysis found</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Upload your resume to get a professional fit score and detailed skill extraction.
                </p>
                <Link href="/analyze" className="block">
                  <Button size="sm" className="w-full gap-2 border-primary/20 hover:bg-primary/5" variant="outline">
                    <Upload className="w-4 h-4" />
                    Upload Resume
                  </Button>
                </Link>
              </div>
            ) : (
              <>
                <div className="text-4xl font-bold text-foreground mb-2">
                  <NumberTicker value={currentAnalysis.resumeFitScore} />
                  <span className="text-xl text-muted-foreground">/100</span>
                </div>
                <Progress value={currentAnalysis.resumeFitScore} className="h-2 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Skill match with role requirements
                </p>
              </>
            )}
          </CardContent>
        </Card>

        {/* Skill Match */}
        <Card className="border border-primary/10 bg-card shadow-sm hover:shadow-md transition-shadow rounded-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent to-primary/5 -z-10" />
          <CardHeader className="pb-2">
            <CardTitle className="text-lg flex items-center gap-2">
              <ArrowUpRight className="w-5 h-5 text-primary" />
              Skill Match Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-muted-foreground">Matched</span>
                  <span className="text-foreground font-medium">
                    <NumberTicker value={currentAnalysis.matchedSkills.length} /> skills
                  </span>
                </div>
                <Progress
                  value={(currentAnalysis.matchedSkills.length / (currentAnalysis.matchedSkills.length + currentAnalysis.missingSkills.length)) * 100}
                  className="h-2"
                />
              </div>
              <div className="flex items-center gap-4 text-sm">
                <span className="flex items-center gap-1 text-success">
                  <Check className="w-4 h-4" />
                  <NumberTicker value={currentAnalysis.matchedSkills.length} /> matched
                </span>
                <span className="flex items-center gap-1 text-destructive">
                  <X className="w-4 h-4" />
                  <NumberTicker value={currentAnalysis.missingSkills.length} /> missing
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Career Risk Alerts */}
      {criticalMissing.length > 0 && (
        <Card className="border border-destructive/20 bg-destructive/5 shadow-sm rounded-2xl">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2 text-destructive">
              <AlertTriangle className="w-5 h-5" />
              Career Risk Alerts
            </CardTitle>
            <CardDescription>
              Critical skills missing for your target role
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {criticalMissing.map((skill) => (
                <div
                  key={skill}
                  className="flex items-center gap-3 p-3 rounded-lg bg-background border border-destructive/20"
                >
                  <div className="w-8 h-8 rounded-full bg-destructive/10 flex items-center justify-center">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-foreground">Core skill missing: {skill}</p>
                    <p className="text-sm text-muted-foreground">
                      This is a required skill for the role
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link href="/dashboard/comparison">
          <Card className="bg-card border border-primary/10 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full rounded-2xl group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <Crosshair className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">You vs Industry</h3>
                <p className="text-sm text-muted-foreground">Compare your skills</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/gaps">
          <Card className="bg-card border border-primary/10 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full rounded-2xl group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <ScanSearch className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">Skill Gaps</h3>
                <p className="text-sm text-muted-foreground">See what to learn</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>

        <Link href="/dashboard/roadmap">
          <Card className="bg-card border border-primary/10 hover:border-primary/40 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer h-full rounded-2xl group">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary/20 transition-all duration-300">
                <ArrowUpRight className="w-6 h-6 text-primary" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-foreground">30-Day Roadmap</h3>
                <p className="text-sm text-muted-foreground">Your learning path</p>
              </div>
              <ChevronRight className="w-5 h-5 text-muted-foreground" />
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end">
        <Link href="/dashboard/comparison">
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-full shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all px-6">
            View Detailed Comparison
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
