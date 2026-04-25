'use client'

import Link from 'next/link'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  Map,
  ChevronRight,
  CalendarDays,
  GraduationCap,
  Video,
  ExternalLink,
  Timer,
  CheckCircle2,
  Circle,
  GraduationCap as GradCapFallback
} from 'lucide-react'
import { RoadmapSkeleton } from '@/components/dashboard/content-skeletons'
import { useState } from 'react'

export default function RoadmapPage() {
  const currentAnalysis = useQuery(api.analysis.getLatestAnalysis)
  const roadmapData = useQuery(api.roadmap.getLatestRoadmap)
  const toggleWeek = useMutation(api.roadmap.toggleWeekCompletion)
  const [isUpdating, setIsUpdating] = useState<number | null>(null)

  if (currentAnalysis === undefined || roadmapData === undefined) {
    return <RoadmapSkeleton />
  }

  if (!currentAnalysis || !roadmapData) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <GraduationCap className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">No Roadmap Found</h2>
        <p className="text-muted-foreground mb-8">
          Complete your analysis first to generate a personalized 30-day learning path.
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

  const roadmap = roadmapData.weeks
  const completedWeeks = roadmap.filter(w => w.completed).length
  const progressPercentage = (completedWeeks / roadmap.length) * 100

  const handleToggleWeek = async (weekNumber: number) => {
    setIsUpdating(weekNumber)
    try {
      await toggleWeek({ roadmapId: roadmapData._id, weekNumber })
    } finally {
      setIsUpdating(null)
    }
  }

  return (
    <div className="space-y-6 w-full max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
            <Map className="w-8 h-8 text-primary" />
            {roadmap.length * 7}-Day Learning Roadmap
          </h1>
          <p className="text-muted-foreground mt-1">
            Your personalized {roadmap.length}-week path to becoming {currentAnalysis.roleSnapshot.title}
          </p>
        </div>
        
        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between text-xs font-medium">
            <span className="text-muted-foreground">Overall Progress</span>
            <span className="text-primary">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <CalendarDays className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{roadmap.length}</div>
              <p className="text-xs text-muted-foreground uppercase">Weeks</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{completedWeeks}</div>
              <p className="text-xs text-muted-foreground uppercase">Completed</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-primary" />
            </div>
            <div>
              <div className="text-2xl font-bold">{roadmap.reduce((sum, w) => sum + w.courses.length, 0)}</div>
              <p className="text-xs text-muted-foreground uppercase">Courses</p>
            </div>
          </CardContent>
        </Card>
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Video className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <div className="text-2xl font-bold">{roadmap.reduce((sum, w) => sum + (w.youtubePlaylists?.length || 0), 0)}</div>
              <p className="text-xs text-muted-foreground uppercase">Playlists</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Weekly Tabs */}
      <Tabs defaultValue="week-1" className="w-full">
        <TabsList className={`grid w-full ${roadmap.length === 1 ? 'grid-cols-1' : roadmap.length === 2 ? 'grid-cols-2' : roadmap.length === 3 ? 'grid-cols-3' : 'grid-cols-4'}`}>
          {roadmap.map((week) => (
            <TabsTrigger 
              key={week.weekNumber} 
              value={`week-${week.weekNumber}`}
              className="relative"
            >
              Week {week.weekNumber}
              {week.completed && (
                <CheckCircle2 className="w-3 h-3 text-primary absolute -top-1 -right-1" />
              )}
            </TabsTrigger>
          ))}
        </TabsList>

        {roadmap.map((week) => (
          <TabsContent key={week.weekNumber} value={`week-${week.weekNumber}`} className="mt-6 space-y-6 animate-in fade-in-50 duration-300">
            {/* Week Header */}
            <Card className={`border-border/50 transition-colors duration-500 ${week.completed ? 'bg-emerald-500/5 border-emerald-500/30' : ''}`}>
              <CardHeader className="flex flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-colors ${week.completed ? 'bg-emerald-500/20' : 'bg-primary/10'}`}>
                    <CalendarDays className={`w-7 h-7 ${week.completed ? 'text-emerald-500' : 'text-primary'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <CardTitle>Week {week.weekNumber}: {week.focusSkill}</CardTitle>
                      {week.completed && (
                        <Badge variant="secondary" className="bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-none">
                          Mastered
                        </Badge>
                      )}
                    </div>
                    <CardDescription>
                      Days {(week.weekNumber - 1) * 7 + 1} - {week.weekNumber * 7}
                    </CardDescription>
                  </div>
                </div>
                
                <Button 
                  onClick={() => handleToggleWeek(week.weekNumber)}
                  disabled={isUpdating === week.weekNumber}
                  variant={week.completed ? "outline" : "default"}
                  className={`gap-2 min-w-[140px] ${!week.completed ? 'bg-primary hover:bg-primary/90' : ''}`}
                >
                  {isUpdating === week.weekNumber ? (
                    'Saving...'
                  ) : week.completed ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Completed
                    </>
                  ) : (
                    <>
                      <Circle className="w-4 h-4" />
                      Mark as Complete
                    </>
                  )}
                </Button>
              </CardHeader>
            </Card>

            {/* Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Courses */}
              <Card className="border-border/50 h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <GraduationCap className="w-5 h-5 text-primary" />
                    Recommended Courses
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  {week.courses.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Review materials from previous weeks
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {week.courses.map((course, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50 flex items-center gap-4"
                        >
                          <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                            <GraduationCap className="w-6 h-6 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground text-sm">{course.title}</h4>
                            <p className="text-xs text-muted-foreground">{course.platform}</p>
                            {course.reason && (
                              <p className="text-[10px] text-muted-foreground italic mt-1 leading-relaxed line-clamp-2">
                                {course.reason}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground bg-muted-foreground/10 px-2 py-0.5 rounded-full">
                              <Timer className="w-3 h-3" />
                              {course.duration}
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                              <a href={course.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* YouTube */}
              <Card className="border-border/50 h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Video className="w-5 h-5 text-destructive" />
                    YouTube Resources
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  {!week.youtubePlaylists || week.youtubePlaylists.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4">
                      Practice with projects and exercises
                    </p>
                  ) : (
                    <div className="space-y-4">
                      {week.youtubePlaylists.map((playlist, index) => (
                        <div
                          key={index}
                          className="p-4 rounded-xl bg-muted/30 hover:bg-muted/50 transition-colors border border-border/50 flex items-center gap-4"
                        >
                          <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                            <Video className="w-6 h-6 text-destructive" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-foreground text-sm">{playlist.title}</h4>
                            <p className="text-xs text-muted-foreground">{playlist.channel}</p>
                            {playlist.reason && (
                              <p className="text-[10px] text-muted-foreground italic mt-1 leading-relaxed line-clamp-2">
                                {playlist.reason}
                              </p>
                            )}
                          </div>
                          <div className="flex flex-col items-end gap-2 shrink-0">
                            <div className="bg-destructive/10 text-destructive text-[10px] px-2 py-0.5 rounded-full font-medium">
                              {playlist.videos} videos
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                              <a href={playlist.url} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-4 h-4" />
                              </a>
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        ))}
      </Tabs>

      {/* Timeline Overview */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">{roadmap.length * 7}-Day Timeline Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-8">
              {roadmap.map((week, index) => (
                <div key={week.weekNumber} className="relative pl-10">
                  <div className={`absolute left-0 w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 z-10 ${
                    week.completed 
                      ? 'bg-emerald-500 border-emerald-500 shadow-lg shadow-emerald-500/20' 
                      : index === 0 && !roadmap.some(w => w.completed)
                        ? 'bg-primary border-primary'
                        : 'bg-background border-border'
                  }`}>
                    {week.completed ? (
                      <CheckCircle2 className="w-5 h-5 text-white" />
                    ) : (
                      <span className={`text-xs font-bold ${index === 0 && !roadmap.some(w => w.completed) ? 'text-primary-foreground' : 'text-muted-foreground'}`}>
                        {week.weekNumber}
                      </span>
                    )}
                  </div>
                  
                  <div className={`p-5 rounded-2xl border transition-all duration-500 ${
                    week.completed 
                      ? 'bg-emerald-500/5 border-emerald-500/20 shadow-sm' 
                      : 'bg-muted/30 border-border/50'
                  }`}>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                      <div className="flex items-center gap-2">
                        <Badge variant={week.completed ? "secondary" : "outline"} className={week.completed ? 'bg-emerald-500/20 text-emerald-600 border-none' : ''}>
                          Week {week.weekNumber}
                        </Badge>
                        <span className="text-xs text-muted-foreground font-medium">
                          Days {(week.weekNumber - 1) * 7 + 1}-{week.weekNumber * 7}
                        </span>
                      </div>
                      {week.completed && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
                          <CheckCircle2 className="w-4 h-4" />
                          Completed
                        </div>
                      )}
                    </div>
                    
                    <h4 className={`font-bold text-lg mb-1 transition-colors ${week.completed ? 'text-emerald-600 dark:text-emerald-400' : 'text-foreground'}`}>
                      {week.focusSkill}
                    </h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {week.focusSkill !== 'Review & Practice'
                        ? `Focus on mastering ${week.focusSkill} principles, implementation, and advanced patterns.`
                        : 'Consolidate your knowledge from the past 3 weeks and complete a portfolio project.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between pt-8">
        <Link href="/dashboard/gaps">
          <Button variant="outline" className="rounded-xl px-6">
            Back to Skill Gaps
          </Button>
        </Link>
        <Link href="/dashboard">
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-6">
            Back to Overview
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
