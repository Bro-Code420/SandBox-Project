'use client'

import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Crosshair,
  ChevronRight,
  ArrowRight,
  AlertCircle,
  Network,
  BrainCircuit,
  GraduationCap as GradCapEmpty,
  TrendingUp,
  Zap
} from 'lucide-react'
import { ListSkeleton } from '@/components/dashboard/content-skeletons'
import { skillDependencies } from '@/lib/data'

export default function GapsPage() {
  const currentAnalysis = useQuery(api.analysis.getLatestAnalysis)
  const jobRole = useQuery(api.onboarding.getJobRole)
  const userSkillsData = useQuery(api.onboarding.getUserSkills)

  if (currentAnalysis === undefined || jobRole === undefined || userSkillsData === undefined) {
    return <ListSkeleton />
  }

  if (!currentAnalysis || !jobRole || !userSkillsData) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <BrainCircuit className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Analysis Data</h2>
        <p className="text-muted-foreground mb-8">
          Complete your analysis to identify skill gaps and priorities.
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

  const userSkills = userSkillsData.skills

  // Get missing skills and sort by priority (core first)
  const missingCoreSkills = currentAnalysis.missingSkills.filter(skill =>
    jobRole.coreSkills?.includes(skill)
  )
  const missingBonusSkills = currentAnalysis.missingSkills.filter(skill =>
    jobRole.bonusSkills?.includes(skill)
  )

  // Calculate learning order based on dependencies
  const getSkillDependencies = (skill: string): string[] => {
    const deps = (skillDependencies as any)[skill] || []
    return deps.filter((dep: string) =>
      !userSkills.some(s => s.toLowerCase() === dep.toLowerCase())
    )
  }

  const skillsWithDeps = currentAnalysis.missingSkills.map(skill => {
    const breakdown = currentAnalysis.scoreBreakdown.find(b => b.skill === skill)
    return {
      skill,
      isCore: jobRole.coreSkills?.includes(skill) || false,
      dependencies: getSkillDependencies(skill),
      priority: jobRole.coreSkills?.includes(skill) ? 1 : 2,
      scoreBoost: (breakdown as any)?.scoreBoost || (jobRole.coreSkills?.includes(skill) ? 12 : 5),
      marketImportance: (breakdown as any)?.marketImportance || 0.7,
    }
  })

  // Sort by: no dependencies first, then core skills, then others
  const sortedSkills = skillsWithDeps.sort((a, b) => {
    if (a.dependencies.length === 0 && b.dependencies.length > 0) return -1
    if (a.dependencies.length > 0 && b.dependencies.length === 0) return 1
    if (a.priority !== b.priority) return a.priority - b.priority
    return 0
  })

  return (
    <div className="space-y-6 max-w-7xl w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Crosshair className="w-8 h-8 text-primary" />
          Skill Gaps Analysis
        </h1>
        <p className="text-muted-foreground mt-1">
          Skills you need to learn with recommended learning order
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-destructive mb-1">
              {missingCoreSkills.length}
            </div>
            <p className="text-sm text-muted-foreground">Core Skills Missing</p>
          </CardContent>
        </Card>
        <Card className="border-warning/30 bg-warning/5">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-warning mb-1">
              {missingBonusSkills.length}
            </div>
            <p className="text-sm text-muted-foreground">Bonus Skills Missing</p>
          </CardContent>
        </Card>
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="p-6 text-center">
            <div className="text-3xl font-bold text-primary mb-1">
              {currentAnalysis.missingSkills.length}
            </div>
            <p className="text-sm text-muted-foreground">Total to Learn</p>
          </CardContent>
        </Card>
      </div>

      {/* Priority Alert */}
      {missingCoreSkills.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="p-4 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-foreground">Focus on Core Skills First</p>
              <p className="text-sm text-muted-foreground">
                You are missing {missingCoreSkills.length} core skills that are essential for the {currentAnalysis.roleSnapshot.title} role.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommended Learning Order */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Network className="w-5 h-5 text-primary" />
            Recommended Learning Order
          </CardTitle>
          <CardDescription>
            Skills ordered by dependencies and priority
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {sortedSkills.map((item, index) => (
              <div
                key={item.skill}
                className="p-4 rounded-lg bg-muted/30 dark:bg-secondary/20 border border-border/50"
              >
                <div className="flex items-start gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-primary">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground">{item.skill}</h3>
                      {item.isCore ? (
                        <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">
                          Core Required
                        </Badge>
                      ) : (
                        <Badge variant="outline">Bonus</Badge>
                      )}
                      <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 gap-1">
                        <TrendingUp className="w-3 h-3" />
                        +{item.scoreBoost}% Ready
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground ml-auto">
                        <Zap className="w-3 h-3 text-warning fill-warning" />
                        Market Value: {Math.round(item.marketImportance * 100)}%
                      </div>
                    </div>

                    {item.dependencies.length > 0 && (
                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <span>Prerequisites:</span>
                        <div className="flex items-center gap-1 flex-wrap">
                          {item.dependencies.map((dep, i) => (
                            <span key={dep}>
                              <span className="text-warning">{dep}</span>
                              {i < item.dependencies.length - 1 && (
                                <ArrowRight className="w-3 h-3 inline mx-1" />
                              )}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {item.dependencies.length === 0 && (
                      <p className="mt-1 text-sm text-success">
                        No prerequisites - you can start learning this now
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Skill Dependencies Graph */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BrainCircuit className="w-5 h-5 text-primary" />
            Skill Dependencies
          </CardTitle>
          <CardDescription>
            Understanding which skills unlock others
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {sortedSkills.filter(s => s.dependencies.length > 0).slice(0, 6).map((item) => (
              <div
                key={item.skill}
                className="p-4 rounded-lg bg-muted/20 dark:bg-secondary/20 border border-border/50"
              >
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <span className="font-medium text-foreground">{item.skill}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground pl-4">
                  <span>Requires:</span>
                  <div className="flex flex-wrap gap-1">
                    {item.dependencies.map(dep => (
                      <Badge key={dep} variant="outline" className="text-xs">
                        {dep}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {sortedSkills.filter(s => s.dependencies.length > 0).length === 0 && (
            <p className="text-center text-muted-foreground py-4">
              All your missing skills can be learned independently
            </p>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Link href="/dashboard">
          <Button variant="outline">Back to Dashboard</Button>
        </Link>
        <Link href="/dashboard/roadmap">
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            View 30-Day Roadmap
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
