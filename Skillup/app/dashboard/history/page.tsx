'use client'

import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Doc } from '@/convex/_generated/dataModel'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Clock,
  CalendarDays,
  ArrowUpRight,
  ScanEye,
  BrainCircuit
} from 'lucide-react'
import { ListSkeleton } from '@/components/dashboard/content-skeletons'

function getStatusConfig(status: string) {
  switch (status) {
    case 'ready':
      return { label: 'Ready', color: 'bg-success text-success-foreground' }
    case 'almost':
      return { label: 'Almost Ready', color: 'bg-warning text-warning-foreground' }
    default:
      return { label: 'Needs Upskilling', color: 'bg-destructive text-destructive-foreground' }
  }
}

export default function HistoryPage() {
  const allAnalyses = useQuery(api.analysis.listAnalyses)

  if (allAnalyses === undefined) {
    return <ListSkeleton />
  }

  return (
    <div className="space-y-6 max-w-7xl w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Clock className="w-8 h-8 text-primary" />
          Analysis History
        </h1>
        <p className="text-muted-foreground mt-1">
          View your past career readiness analyses
        </p>
      </div>

      {/* History List */}
      {allAnalyses.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="p-12 text-center">
            <Clock className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No Analysis History</h3>
            <p className="text-muted-foreground">
              Complete your first analysis to see it here
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {allAnalyses.map((analysis: any, index: number) => {
            const statusConfig = getStatusConfig(analysis.readinessStatus)
            const isLatest = index === 0

            return (
              <Card
                key={analysis._id}
                className={`border-border/50 ${isLatest ? 'border-primary/30 bg-primary/5' : ''}`}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <ArrowUpRight className="w-7 h-7 text-primary" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-2">
                        <h3 className="font-semibold text-foreground">
                          {analysis.roleSnapshot.title}
                        </h3>
                        {isLatest && (
                          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                            Current
                          </Badge>
                        )}
                        <Badge className={statusConfig.color}>
                          {statusConfig.label}
                        </Badge>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <CalendarDays className="w-4 h-4" />
                          {new Date(analysis._creationTime).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                        <span>Domain: {analysis.roleSnapshot.domain}</span>
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 rounded-lg bg-muted/50 dark:bg-secondary/20">
                          <div className="text-2xl font-bold text-primary dark:text-[#a4c3b2]">
                            {analysis.readinessScore}%
                          </div>
                          <p className="text-xs text-muted-foreground">Readiness</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <div className="text-2xl font-bold text-success">
                            {analysis.matchedSkills.length}
                          </div>
                          <p className="text-xs text-muted-foreground">Matched</p>
                        </div>
                        <div className="p-3 rounded-lg bg-muted/50">
                          <div className="text-2xl font-bold text-destructive">
                            {analysis.missingSkills.length}
                          </div>
                          <p className="text-xs text-muted-foreground">Missing</p>
                        </div>
                      </div>
                    </div>

                    <Link href={`/dashboard/summary?id=${analysis._id}`}>
                      <Button variant="outline" size="sm" className="gap-2 bg-transparent">
                        <ScanEye className="w-4 h-4" />
                        View
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

    </div>
  )
}
