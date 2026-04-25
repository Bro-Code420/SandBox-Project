'use client'

import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Check,
  X,
  ChevronRight,
  UserRound,
  Landmark,
  BrainCircuit,
  Scale,
  Target,
  Info
} from 'lucide-react'
import { SkillsRadarChart } from '@/components/dashboard/skills-radar-chart'
import NumberTicker from '@/components/dashboard/number-ticker'
import { ComparisonSkeleton } from '@/components/dashboard/comparison-skeleton'

export default function ComparisonPage() {
  const currentAnalysis = useQuery(api.analysis.getLiveProfile)
  const jobRole = useQuery(api.onboarding.getJobRole)
  const userSkillsData = useQuery(api.onboarding.getUserSkills)

  if (currentAnalysis === undefined || jobRole === undefined || userSkillsData === undefined) {
    return <ComparisonSkeleton />
  }

  if (!currentAnalysis || !jobRole || !userSkillsData) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <BrainCircuit className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Analysis Data</h2>
        <p className="text-muted-foreground mb-8">
          Please complete your analysis to see how you compare to industry standards.
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

  const allRequiredSkills = [...(jobRole.coreSkills || []), ...(jobRole.bonusSkills || [])]
  
  // LIVE SYNC LOGIC: Using values from backend getLiveProfile
  const realTimeMatchedSkills = currentAnalysis.matchedSkills
  const realTimeMissingSkills = currentAnalysis.missingSkills

  // Create comparison items for the table
  const comparisonData = allRequiredSkills.map(skill => {
    const userHas = realTimeMatchedSkills.some(s => s.toLowerCase() === skill.toLowerCase())
    const isCore = jobRole.coreSkills?.includes(skill)
    return {
      skill,
      userHas,
      industryRequired: true,
      isCore,
    }
  })

  // Add user skills that are not in required skills
  realTimeMatchedSkills.forEach(skill => {
    if (!allRequiredSkills.some(s => s.toLowerCase() === skill.toLowerCase())) {
      comparisonData.push({
        skill,
        userHas: true,
        industryRequired: false,
        isCore: false,
      })
    }
  })

  const matchedCount = realTimeMatchedSkills.length
  const missingCount = realTimeMissingSkills.length
  const liveMatchRate = currentAnalysis.readinessScore

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Scale className="w-8 h-8 text-primary" />
          Live Skill Comparison
        </h1>
        <p className="text-muted-foreground mt-1 text-sm font-medium">
          Dashboard synced with Convex DB • Refreshing locally
        </p>
      </div>
      {/* Hero Grid: LARGE Radar Chart & Summary Stats Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* HUGE Radar Chart Panel (2/3 width) */}
        <div className="lg:col-span-2">
          <SkillsRadarChart 
            matchedSkills={realTimeMatchedSkills} 
            missingSkills={realTimeMissingSkills} 
            roleTitle={currentAnalysis.roleSnapshot.title} 
          />
        </div>

        {/* Right Side: Stats & Legend Sidebar (1/3 width) */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          {/* Summary Stats Cards - Stacked for better vertical profile */}
          <div className="grid grid-cols-1 gap-4 h-full">
            <Card className="border-success/30 bg-success/5 shadow-none flex flex-col justify-center py-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(45,74,62,0.06)] dark:hover:shadow-[0_20px_50px_rgba(164,195,178,0.04)] hover:border-success/50 cursor-default">
              <CardContent className="p-6 text-center">
                <div className="text-5xl font-black text-success mb-2">
                  <NumberTicker value={matchedCount} />
                </div>
                <p className="text-sm font-black text-foreground dark:text-success/70 uppercase tracking-widest text-[10px]">Skills Matched</p>
              </CardContent>
            </Card>
            <Card className="border-destructive/30 bg-destructive/5 shadow-none flex flex-col justify-center py-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(239,68,68,0.04)] dark:hover:shadow-[0_20px_50px_rgba(239,68,68,0.02)] hover:border-destructive/50 cursor-default">
              <CardContent className="p-6 text-center">
                <div className="text-5xl font-black text-destructive mb-2">
                  <NumberTicker value={missingCount} delay={0.2} />
                </div>
                <p className="text-sm font-black text-foreground dark:text-destructive/70 uppercase tracking-widest text-[10px]">Skills Missing</p>
              </CardContent>
            </Card>
            <Card className="border-primary/30 bg-primary/5 shadow-none flex flex-col justify-center py-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(107,144,128,0.06)] dark:hover:shadow-[0_20px_50px_rgba(164,195,178,0.04)] hover:border-primary/50 cursor-default">
              <CardContent className="p-6 text-center">
                <div className="text-5xl font-black text-primary mb-2 flex items-center justify-center">
                  <NumberTicker value={liveMatchRate} delay={0.4} />
                  <span>%</span>
                </div>
                <p className="text-sm font-black text-foreground dark:text-primary/70 uppercase tracking-widest text-[10px]">Match Rate</p>
              </CardContent>
            </Card>
            
            {/* Legend inside the sidebar now */}
            <Card className="border-border/50 shadow-none bg-muted/20 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-primary/20 cursor-default">
              <CardContent className="p-4 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md bg-success/20 border-2 border-success shadow-inner flex items-center justify-center">
                    <Check className="w-3 h-3 text-success" />
                  </div>
                  <span className="text-foreground dark:text-success/80 font-bold uppercase tracking-wider text-[10px]">You Possess</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-md bg-destructive/20 border-2 border-destructive shadow-inner flex items-center justify-center">
                    <X className="w-3 h-3 text-destructive" />
                  </div>
                  <span className="text-foreground dark:text-destructive/80 font-bold uppercase tracking-wider text-[10px]">Gap Found</span>
                </div>
                <div className="pt-2 border-t border-border/50 flex flex-wrap gap-2">
                  <Badge className="bg-blue-500/10 text-blue-500 border-blue-500/20 uppercase text-[9px]">Core</Badge>
                  <Badge className="bg-purple-500/10 text-purple-500 border-purple-500/20 uppercase text-[9px]">Bonus</Badge>
                  <Badge className="bg-slate-500/10 text-slate-500 border-slate-500/20 uppercase text-[9px]">Extra</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Gap Analysis Tool</CardTitle>
          <CardDescription>
            High-priority core gaps are highlighted in red
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-black text-foreground dark:text-primary/70 uppercase tracking-widest text-[10px]">Skill</th>
                  <th className="text-center py-3 px-4 font-black text-foreground dark:text-primary/70 uppercase tracking-widest text-[10px]">
                    <div className="flex items-center justify-center gap-2">
                      <UserRound className="w-4 h-4" />
                      YOU
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 font-black text-foreground dark:text-primary/70 uppercase tracking-widest text-[10px]">
                    <div className="flex items-center justify-center gap-2">
                      <Landmark className="w-4 h-4" />
                      INDUSTRY
                    </div>
                  </th>
                  <th className="text-center py-3 px-4 font-black text-foreground dark:text-primary/70 uppercase tracking-widest text-[10px]">Type</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((item, index) => {
                  const isGap = !item.userHas && item.isCore;
                  return (
                    <tr
                      key={item.skill}
                      className={`border-b border-border/50 transition-colors ${
                        isGap ? 'bg-destructive/10 hover:bg-destructive/15' : 
                        index % 2 === 0 ? 'bg-muted/20 dark:bg-secondary/15' : 'hover:bg-muted/10'
                      }`}
                    >
                      <td className="py-3 px-4">
                        <span className={`font-medium ${item.userHas ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {item.skill}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.userHas ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-success/20">
                            <Check className="w-4 h-4 text-success" />
                          </div>
                        ) : (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-destructive/20">
                            <X className="w-4 h-4 text-destructive" />
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.industryRequired ? (
                          <div className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 dark:bg-primary/20">
                            {item.isCore ? (
                              <Target className="w-4 h-4 text-primary" />
                            ) : (
                              <Info className="w-4 h-4 text-primary" />
                            )}
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs font-bold uppercase">Extra</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-center">
                        {item.isCore ? (
                          <Badge className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20 border-blue-500/30 font-bold uppercase tracking-tighter text-[10px]">
                            Core
                          </Badge>
                        ) : item.industryRequired ? (
                          <Badge className="bg-purple-500/10 text-purple-500 hover:bg-purple-500/20 border-purple-500/30 font-bold uppercase tracking-tighter text-[10px]">
                            Bonus
                          </Badge>
                        ) : (
                          <Badge className="bg-slate-500/10 text-slate-500 hover:bg-slate-500/20 border-slate-500/30 font-bold uppercase tracking-tighter text-[10px]">
                            Extra
                          </Badge>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>


      {/* Navigation */}
      <div className="flex justify-between">
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
        <Link href="/dashboard/explain">
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            See Score Breakdown
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
