"use client"

import { useMemo } from "react"
import { TrendingUp } from "lucide-react"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"

import NumberTicker from "@/components/dashboard/number-ticker"

const chartConfig = {
  industry: {
    label: "Industry Required",
    color: "hsl(var(--muted-foreground))",
  },
  user: {
    label: "Your Skills",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig

// Define broad categorization logic for popular tech stacks
const categoryMap: Record<string, string[]> = {
  "Languages": ["javascript", "typescript", "python", "java", "c++", "c#", "go", "rust", "ruby", "php", "swift", "kotlin", "bash"],
  "Frontend": ["react", "next.js", "vue", "angular", "svelte", "html", "css", "tailwind", "sass", "bootstrap", "redux", "jest", "cypress", "figma"],
  "Backend": ["node.js", "express", "django", "flask", "fastapi", "spring boot", "ruby on rails", "laravel", "graphql", "rest api", "grpc", "socket.io"],
  "Databases": ["postgres", "postgresql", "mysql", "mongodb", "redis", "elasticsearch", "cassandra", "dynamodb", "sqlite", "oracle", "sql server"],
  "Cloud & DevOps": ["aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ansible", "jenkins", "github actions", "gitlab ci", "linux", "nginx", "ci/cd"],
  "Architecture": ["microservices", "system design", "event-driven", "serverless", "clean architecture", "oop", "functional programming", "agile", "scrum"],
}

export function SkillsRadarChart({
  matchedSkills,
  missingSkills,
  roleTitle
}: {
  matchedSkills: string[]
  missingSkills: string[]
  roleTitle: string
}) {
  const chartData = useMemo(() => {
    // Initialize counters for each category
    const categories: Record<string, { total: number; userHas: number }> = {
      "Languages": { total: 0, userHas: 0 },
      "Frontend": { total: 0, userHas: 0 },
      "Backend": { total: 0, userHas: 0 },
      "Databases": { total: 0, userHas: 0 },
      "Cloud & DevOps": { total: 0, userHas: 0 },
      "Architecture": { total: 0, userHas: 0 },
      "Other": { total: 0, userHas: 0 }
    }

    const categorizeSkill = (skill: string) => {
      const lowerSkill = skill.toLowerCase()
      for (const [category, keywords] of Object.entries(categoryMap)) {
        if (keywords.some(k => lowerSkill.includes(k))) return category
      }
      return "Other"
    }

    // Process all required skills (matched + missing)
    ;[...matchedSkills, ...missingSkills].forEach(skill => {
      const category = categorizeSkill(skill)
      categories[category].total += 1
    })

    // Process user matched skills
    matchedSkills.forEach(skill => {
      const category = categorizeSkill(skill)
      categories[category].userHas += 1
    })

    // Prepare chart data: Include all categories to maintain the characteristic "Radar Shape"
    return Object.entries(categories)
      .filter(([category, counts]) => category !== "Other" || counts.total > 0)
      .map(([category, counts]) => {
        const userPercentage = counts.total > 0 ? (counts.userHas / counts.total) * 100 : 0
        return {
          category,
          industryLength: 100,
          userLength: Math.round(userPercentage),
          rawMatched: counts.userHas,
          rawTotal: counts.total
        }
      })
  }, [matchedSkills, missingSkills])

  // Chart data is now stable with 6 axes (Hexagon)
  const paddedChartData = chartData


  // Formatting tooltip correctly
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const categoryData = payload[0].payload
      return (
        <div className="bg-card/95 backdrop-blur-md border border-primary/20 text-card-foreground p-3 rounded-2xl shadow-2xl min-w-[160px]">
          <p className="font-black text-[10px] uppercase tracking-[0.2em] text-primary mb-3 text-center border-b border-primary/10 pb-2">{categoryData.category}</p>
          <div className="space-y-3">
            <div className="flex gap-3 items-center text-xs">
                <div className="w-3 h-3 rounded-full bg-primary ring-4 ring-primary/10" />
                <div className="flex-1 flex justify-between gap-4">
                    <span className="text-muted-foreground font-medium">YOU HAVE</span>
                    <span className="font-black text-foreground">
                        <NumberTicker value={categoryData.rawMatched} />
                    </span>
                </div>
            </div>
            <div className="flex gap-3 items-center text-xs">
                <div className="w-3 h-3 rounded-full bg-muted-foreground/30 ring-4 ring-muted-foreground/5" />
                <div className="flex-1 flex justify-between gap-4">
                    <span className="text-muted-foreground font-medium">REQUIRED</span>
                    <span className="font-black text-foreground">
                        <NumberTicker value={categoryData.rawTotal} />
                    </span>
                </div>
            </div>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="flex flex-col border-primary/20 bg-card dark:bg-card/30 backdrop-blur-sm shadow-sm h-full overflow-visible transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_20px_60px_rgba(45,74,62,0.1)] dark:hover:shadow-[0_20px_60px_rgba(164,195,178,0.05)] hover:border-primary/40 cursor-default">
      <CardHeader className="items-center pb-4 text-center">
        <CardTitle className="dark:text-primary/90">Skill Coverage Map</CardTitle>
        <CardDescription className="dark:text-primary/60">
          Normalized distribution vs {roleTitle}
        </CardDescription>
      </CardHeader>
      <CardContent className="pb-0 h-full min-h-[550px] flex items-center justify-center overflow-visible">
        {chartData.length === 0 ? (
          <div className="text-center text-muted-foreground">Not enough data for chart</div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="w-full h-full min-h-[550px] pb-6 overflow-visible"
          >
            <RadarChart 
              data={paddedChartData} 
              margin={{ top: 50, right: 50, bottom: 50, left: 50 }}
              cx="50%"
              cy="50%"
              outerRadius="85%"
            >
              <ChartTooltip cursor={false} content={<CustomTooltip />} />
              <PolarAngleAxis 
                dataKey="category" 
                tick={{ 
                    fill: "currentColor", 
                    fontSize: 10, 
                    fontWeight: 900,
                }}
                className="text-foreground/90 dark:text-primary"
              />
              <PolarGrid 
                stroke="currentColor" 
                strokeOpacity={0.5} 
                className="text-foreground/20 dark:text-primary/25"
              />
              
              {/* Industry limit - Very faint background */}
              <Radar
                dataKey="industryLength"
                stroke="currentColor"
                strokeWidth={1}
                strokeDasharray="4 4"
                fill="currentColor"
                fillOpacity={0.03}
                className="text-foreground/30 dark:text-white/5"
                activeDot={false}
              />
              
              {/* User actual skill layer - Dark Green in Light Mode, Mint in Dark Mode */}
              <Radar
                dataKey="userLength"
                stroke="currentColor"
                strokeWidth={5}
                fill="currentColor"
                fillOpacity={0.4}
                className="text-foreground dark:text-primary"
                dot={{
                  r: 6,
                  fill: "currentColor",
                  stroke: "var(--background)",
                  strokeWidth: 2,
                }}
              />
            </RadarChart>
          </ChartContainer>
        )}
      </CardContent>
      <CardFooter className="flex-col gap-6 text-sm mt-8 border-t border-primary/10 pt-8">
        <div className="flex items-center gap-2 font-black leading-none text-foreground dark:text-primary/90 text-center text-lg">
          Comprehensive Skill Profile: You vs {roleTitle}
        </div>
        <div className="flex items-center gap-10 text-muted-foreground pb-2">
            <div className="flex items-stretch gap-4">
                <div className="w-3 h-10 rounded-full bg-foreground dark:bg-primary" />
                <div className="flex flex-col justify-center">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-foreground/80 dark:text-primary/80">YOU</span>
                  <span className="text-sm font-black text-foreground">Matched Profile</span>
                </div>
            </div>
            <div className="flex items-stretch gap-4">
                <div className="w-3 h-10 rounded-xl border-2 border-muted-foreground/30 bg-muted/30" />
                <div className="flex flex-col justify-center">
                  <span className="text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">STD</span>
                  <span className="text-sm font-black text-foreground">Industry Bound</span>
                </div>
            </div>
        </div>
      </CardFooter>
    </Card>
  )
}
