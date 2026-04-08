'use client'

import Link from 'next/link'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Map,
  ChevronRight,
  CalendarDays,
  GraduationCap,
  Video,
  ExternalLink,
  Timer,
  GraduationCap as GradCapFallback
} from 'lucide-react'
import { RoadmapSkeleton } from '@/components/dashboard/content-skeletons'

export default function RoadmapPage() {
  const currentAnalysis = useQuery(api.analysis.getLatestAnalysis)
  const roadmapData = useQuery(api.roadmap.getLatestRoadmap)

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

  return (
    <div className="space-y-6 max-w-7xl w-full">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <Map className="w-8 h-8 text-primary" />
          30-Day Learning Roadmap
        </h1>
        <p className="text-muted-foreground mt-1">
          Your personalized path to becoming {currentAnalysis.roleSnapshot.title}
        </p>
      </div>

      {/* Overview */}
      <Card className="border-primary/30 bg-primary/5">
        <CardContent className="p-6">
          <div className="grid md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary dark:text-[#a4c3b2]">{roadmap.length}</div>
              <p className="text-sm text-muted-foreground">Weeks</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary dark:text-[#a4c3b2]">
                {currentAnalysis.missingSkills.length}
              </div>
              <p className="text-sm text-muted-foreground">Skills to Learn</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary dark:text-[#a4c3b2]">
                {roadmap.reduce((sum, w) => sum + w.courses.length, 0)}
              </div>
              <p className="text-sm text-muted-foreground">Courses</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary dark:text-[#a4c3b2]">
                {roadmap.reduce((sum, w) => sum + (w.youtubePlaylists?.length || 0), 0)}
              </div>
              <p className="text-sm text-muted-foreground">Video Playlists</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Weekly Tabs */}
      <Tabs defaultValue="week-1">
        <TabsList className="grid w-full grid-cols-4">
          {roadmap.map((week) => (
            <TabsTrigger key={week.weekNumber} value={`week-${week.weekNumber}`}>
              Week {week.weekNumber}
            </TabsTrigger>
          ))}
        </TabsList>

        {roadmap.map((week) => (
          <TabsContent key={week.weekNumber} value={`week-${week.weekNumber}`} className="mt-6 space-y-6">
            {/* Week Header */}
            <Card className="border-border/50">
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center">
                    <CalendarDays className="w-7 h-7 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Week {week.weekNumber}: {week.focusSkill}</CardTitle>
                    <CardDescription>
                      Days {(week.weekNumber - 1) * 7 + 1} - {week.weekNumber * 7}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>

            {/* Courses */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-primary" />
                  Recommended Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {week.courses.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Review materials from previous weeks
                  </p>
                ) : (
                  <div className="space-y-3">
                    {week.courses.map((course, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-muted/30 dark:bg-secondary/20 border border-border/50 flex items-center gap-4"
                      >
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <GraduationCap className="w-6 h-6 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground">{course.title}</h4>
                          <p className="text-sm text-muted-foreground">{course.platform}</p>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Timer className="w-4 h-4" />
                          {course.duration}
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={course.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* YouTube */}
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Video className="w-5 h-5 text-destructive" />
                  YouTube Playlists
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!week.youtubePlaylists || week.youtubePlaylists.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Practice with projects and exercises
                  </p>
                ) : (
                  <div className="space-y-3">
                    {week.youtubePlaylists.map((playlist, index) => (
                      <div
                        key={index}
                        className="p-4 rounded-lg bg-muted/30 border border-border/50 flex items-center gap-4"
                      >
                        <div className="w-12 h-12 rounded-lg bg-destructive/10 flex items-center justify-center flex-shrink-0">
                          <Video className="w-6 h-6 text-destructive" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-foreground">{playlist.title}</h4>
                          <p className="text-sm text-muted-foreground">{playlist.channel}</p>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {playlist.videos} videos
                        </div>
                        <Button variant="ghost" size="icon" asChild>
                          <a href={playlist.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="w-4 h-4" />
                          </a>
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>

      {/* Timeline Overview */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="text-lg">30-Day Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />
            <div className="space-y-6">
              {roadmap.map((week, index) => (
                <div key={week.weekNumber} className="relative pl-10">
                  <div className={`absolute left-2 w-5 h-5 rounded-full border-2 ${index === 0 ? 'bg-primary dark:bg-[#a4c3b2] border-primary dark:border-[#a4c3b2]' : 'bg-background border-border dark:border-secondary'
                    }`} />
                  <div className="p-4 rounded-lg bg-muted/30 dark:bg-secondary/20 border border-border/50">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">Week {week.weekNumber}</Badge>
                      <span className="text-sm text-muted-foreground">
                        Days {(week.weekNumber - 1) * 7 + 1}-{week.weekNumber * 7}
                      </span>
                    </div>
                    <h4 className="font-medium text-foreground mb-1">{week.focusSkill}</h4>
                    <p className="text-sm text-muted-foreground">
                      {week.focusSkill !== 'Review & Practice'
                        ? `Deep dive into ${week.focusSkill} and related ecosystems.`
                        : 'Consolidate your knowledge and build a portfolio project.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Link href="/dashboard/gaps">
          <Button variant="outline">Back to Skill Gaps</Button>
        </Link>
        <Link href="/dashboard">
          <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
            Back to Overview
            <ChevronRight className="w-4 h-4" />
          </Button>
        </Link>
      </div>
    </div>
  )
}
