"use client"

import { useMemo } from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { TrendingUp, Activity, CheckCircle2, CircleDashed } from "lucide-react"

const chartConfig = {
  matched: {
    label: "Matched Skills",
    color: "var(--primary)",
  },
  missing: {
    label: "Missing Skills",
    color: "var(--muted)",
  },
} satisfies ChartConfig

export function ScoreTrendChart({ 
  analyses,
  liveScore
}: { 
  analyses: any[],
  liveScore?: number 
}) {
  const chartData = useMemo(() => {
    // Take the last 10 analyses and reverse to get chronological order
    const lastAnalyses = [...analyses].slice(0, 10).reverse()
    
    // Check if we have multiple analyses on the same day
    const dates = new Set(lastAnalyses.map(a => new Date(a._creationTime).toDateString()))
    const showTime = dates.size < lastAnalyses.length

    return lastAnalyses.map((analysis, index) => {
      const isLatest = index === lastAnalyses.length - 1
      const dateObj = new Date(analysis._creationTime)
      const dateLabel = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
      
      const timeLabel = dateObj.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false
      })

      return {
        date: showTime ? `${dateLabel} ${timeLabel}` : dateLabel,
        fullDate: dateObj.toLocaleString(),
        // REAL-TIME SYNC: Use liveScore for the latest point if provided
        score: (isLatest && liveScore !== undefined) ? liveScore : Math.max(0, analysis.readinessScore),
        matched: analysis.matchedSkills?.length || 0,
        missing: analysis.missingSkills?.length || 0,
        index: index + 1
      }
    })
  }, [analyses, liveScore])

  if (analyses.length < 2) return null

  const latestScore = chartData[chartData.length - 1]?.score || 0
  const previousScore = chartData[chartData.length - 2]?.score || 0
  const trendValue = latestScore - previousScore
  const isPositive = trendValue >= 0

  return (
    <Card className="border-primary/20 bg-card/50 backdrop-blur-sm shadow-sm transition-all duration-300 hover:shadow-lg hover:border-primary/30 rounded-2xl overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="space-y-1">
          <CardTitle className="text-xl flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            Skill Gap Progression
          </CardTitle>
          <CardDescription>
            Matched vs Missing skills across your last {chartData.length} attempts
          </CardDescription>
        </div>
        <div className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${
          isPositive ? 'bg-success/10 text-success' : 'bg-destructive/10 text-destructive'
        }`}>
          <TrendingUp className={`w-3 h-3 ${!isPositive && 'rotate-180'}`} />
          {isPositive ? '+' : ''}{trendValue}% Score
        </div>
      </CardHeader>
      <CardContent className="pt-4">
        <ChartContainer config={chartConfig} className="h-[300px] w-full">
          <BarChart 
            accessibilityLayer 
            data={chartData}
            margin={{
              left: 0,
              right: 0,
              top: 10,
              bottom: 0
            }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" strokeOpacity={0.1} />
            <XAxis
              dataKey="date"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tick={{ fontSize: 10, fontWeight: 500 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              tick={{ fontSize: 10, fontWeight: 500 }}
              label={{ 
                value: 'Total Skills', 
                angle: -90, 
                position: 'insideLeft',
                style: { textAnchor: 'middle', fontSize: 10, fill: 'var(--muted-foreground)' }
              }}
            />
            <ChartTooltip
              content={<ChartTooltipContent indicator="dot" />}
              cursor={{ fill: 'var(--primary)', fillOpacity: 0.05 }}
            />
            <Bar
              dataKey="matched"
              stackId="a"
              fill="var(--color-matched)"
              fillOpacity={1}
              radius={[0, 0, 4, 4]}
              animationDuration={1500}
            />
            <Bar
              dataKey="missing"
              stackId="a"
              fill="var(--color-missing)"
              fillOpacity={0.4}
              radius={[4, 4, 0, 0]}
              animationDuration={1500}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
      <div className="px-6 pb-6 flex items-center gap-6 text-[10px] uppercase font-black tracking-widest text-muted-foreground border-t border-primary/5 pt-6">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
          <span>Matched Skills</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-muted/60" />
          <span>Missing Skills</span>
        </div>
        <div className="ml-auto text-foreground dark:text-primary">
          Current Readiness: <span className="text-primary font-black">{latestScore}%</span>
        </div>
      </div>
    </Card>
  )
}
