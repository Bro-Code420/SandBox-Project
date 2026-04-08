'use client'

import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Lightbulb,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
  Info,
  PieChart,
  BrainCircuit
} from 'lucide-react'
import { ListSkeleton } from '@/components/dashboard/content-skeletons'

export default function ExplainPage() {
  const currentAnalysis = useQuery(api.analysis.getLatestAnalysis)
  const jobRole = useQuery(api.onboarding.getJobRole)

  if (currentAnalysis === undefined || jobRole === undefined) {
    return <ListSkeleton />
  }

  if (!currentAnalysis || !jobRole) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <BrainCircuit className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Analysis Data</h2>
        <p className="text-muted-foreground mb-8">
          Please complete your analysis to see a detailed explanation of your score.
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

  const positiveBreakdown = currentAnalysis.scoreBreakdown.filter(b => b.status === 'matched')
  const negativeBreakdown = currentAnalysis.scoreBreakdown.filter(b => b.status === 'missing')

  const totalPositive = positiveBreakdown.reduce((sum, b) => sum + Math.abs(b.impact), 0)
  const totalNegative = negativeBreakdown.reduce((sum, b) => sum + Math.abs(b.impact), 0)

  return (
    <div className="space-y-6 max-w-7xl w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Lightbulb className="w-8 h-8 text-primary" />
          Why This Score?
        </h1>
        <p className="text-muted-foreground mt-1">
          Explainable AI breakdown of your readiness score
        </p>
      </div>

      {/* Score Summary */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-6">
            <div className="text-center">
              <div className="text-5xl font-bold text-primary dark:text-[#a4c3b2]">{currentAnalysis.readinessScore}%</div>
              <p className="text-sm text-muted-foreground mt-1">Final Score</p>
            </div>
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <ArrowUpRight className="w-4 h-4 text-success" />
                <span className="text-success">+{totalPositive}% from matched skills</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <ArrowDownRight className="w-4 h-4 text-destructive" />
                <span className="text-destructive">-{totalNegative}% from missing skills</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Calculation Method */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <PieChart className="w-5 h-5 text-primary" />
            How We Calculate Your Score
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 rounded-lg bg-muted/50 dark:bg-secondary/20 border border-border/50">
              <h4 className="font-medium text-foreground mb-2">Core Skills (80% weight)</h4>
              <p className="text-sm text-muted-foreground">
                Essential skills required for the role. Each matched core skill contributes significantly to your score.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-2xl font-bold text-primary dark:text-[#a4c3b2]">
                  {currentAnalysis.matchedSkills.filter(s => (jobRole.coreSkills || []).includes(s)).length}
                </span>
                <span className="text-muted-foreground">
                  / {jobRole.coreSkills?.length || 0} matched
                </span>
              </div>
            </div>
            <div className="p-4 rounded-lg bg-muted/50 dark:bg-secondary/20 border border-border/50">
              <h4 className="font-medium text-foreground mb-2">Bonus Skills (20% weight)</h4>
              <p className="text-sm text-muted-foreground">
                Nice-to-have skills that enhance your profile. These provide additional points.
              </p>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-2xl font-bold text-accent dark:text-[#a4c3b2]">
                  {currentAnalysis.matchedSkills.filter(s => (jobRole.bonusSkills || []).includes(s)).length}
                </span>
                <span className="text-muted-foreground">
                  / {jobRole.bonusSkills?.length || 0} matched
                </span>
              </div>
            </div>
          </div>

          {currentAnalysis.explanation ? (
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-info/10 border border-info/20">
                <h4 className="font-semibold text-info mb-2 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Key Factors
                </h4>
                <ul className="space-y-2">
                  {currentAnalysis.explanation.factors.map((factor, i) => (
                    <li key={i} className="text-sm text-foreground flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      {factor}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center p-2 rounded bg-muted/50 dark:bg-secondary/20">
                  <div className="text-lg font-bold text-primary dark:text-[#a4c3b2]">{Math.round(currentAnalysis.explanation.coreCoverage)}%</div>
                  <div className="text-xs text-muted-foreground">Core Skills</div>
                </div>
                <div className="text-center p-2 rounded bg-muted/50">
                  <div className="text-lg font-bold text-accent dark:text-[#a4c3b2]">{Math.round(currentAnalysis.explanation.secondaryCoverage)}%</div>
                  <div className="text-xs text-muted-foreground">Secondary</div>
                </div>
                <div className="text-center p-2 rounded bg-muted/50">
                  <div className="text-lg font-bold text-muted-foreground">{Math.round(currentAnalysis.explanation.bonusCoverage)}%</div>
                  <div className="text-xs text-muted-foreground">Bonus</div>
                </div>
                <div className="text-center p-2 rounded bg-muted/50">
                  <div className="text-lg font-bold text-success">{Math.round(currentAnalysis.explanation.experienceFactor)}%</div>
                  <div className="text-xs text-muted-foreground">Exp. Factor</div>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-lg bg-info/10 border border-info/20 flex items-start gap-3">
              <Info className="w-5 h-5 text-info flex-shrink-0 mt-0.5" />
              <p className="text-sm text-muted-foreground">
                Your score is calculated using a weighted formula where core skills contribute 80% and bonus skills contribute 20% of the total possible score.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Positive Contributions */}
      <Card className="border-success/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-success">
            <ArrowUpRight className="w-5 h-5" />
            Skills Adding to Your Score
          </CardTitle>
          <CardDescription>
            These skills are boosting your readiness score
          </CardDescription>
        </CardHeader>
        <CardContent>
          {positiveBreakdown.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">
              No matched skills yet. Add more skills to improve your score.
            </p>
          ) : (
            <div className="space-y-3">
              {positiveBreakdown.map((item) => (
                <div key={item.skill} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground">{item.skill}</span>
                      <Badge variant="secondary" className="bg-success/10 text-success border-success/20">
                        +{item.impact}%
                      </Badge>
                    </div>
                    <Progress value={item.impact * 2} className="h-2 bg-success/20" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Negative Contributions */}
      <Card className="border-destructive/30">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2 text-destructive">
            <ArrowDownRight className="w-5 h-5" />
            Missing Skills Affecting Your Score
          </CardTitle>
          <CardDescription>
            Learning these skills will improve your readiness score
          </CardDescription>
        </CardHeader>
        <CardContent>
          {negativeBreakdown.length === 0 ? (
            <p className="text-success text-center py-4">
              Great job! You have all the required skills.
            </p>
          ) : (
            <div className="space-y-3">
              {negativeBreakdown.slice(0, 10).map((item) => (
                <div key={item.skill} className="flex items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-foreground">{item.skill}</span>
                      <Badge variant="secondary" className="bg-destructive/10 text-destructive border-destructive/20">
                        {item.impact}%
                      </Badge>
                    </div>
                    <Progress value={Math.abs(item.impact) * 2} className="h-2 bg-destructive/20" />
                  </div>
                </div>
              ))}
              {negativeBreakdown.length > 10 && (
                <p className="text-sm text-muted-foreground text-center">
                  And {negativeBreakdown.length - 10} more missing skills...
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Final Score Breakdown */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">Final Readiness Score: {currentAnalysis.readinessScore}%</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {positiveBreakdown.slice(0, 5).map((item) => (
              <div key={item.skill} className="flex items-center gap-2 text-sm">
                <span className="text-success">+{item.impact}%</span>
                <span className="text-muted-foreground">{item.skill} proficiency</span>
              </div>
            ))}
            {negativeBreakdown.slice(0, 5).map((item) => (
              <div key={item.skill} className="flex items-center gap-2 text-sm">
                <span className="text-destructive">{item.impact}%</span>
                <span className="text-muted-foreground">Missing {item.skill}</span>
              </div>
            ))}
            <div className="border-t border-border pt-4 mt-4">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-foreground">Final Readiness Score</span>
                <span className="text-2xl font-bold text-primary dark:text-[#a4c3b2]">{currentAnalysis.readinessScore}%</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Link href="/dashboard/comparison">
          <Button variant="outline">Back to Comparison</Button>
        </Link>
        <Link href="/dashboard/gaps">
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            View Skill Gaps
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
