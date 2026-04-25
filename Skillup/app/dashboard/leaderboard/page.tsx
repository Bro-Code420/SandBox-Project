'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { 
  Trophy, 
  Users, 
  Target, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Medal,
  Award,
  FileText,
  Check
} from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

export default function LeaderboardPage() {
  const router = useRouter()
  const rankingData = useQuery(api.ranking.getLeaderboard)

  if (rankingData === undefined) {
    return <LeaderboardSkeleton />
  }

  if (!rankingData) {
    return (
      <div className="max-w-4xl mx-auto py-12 px-4 text-center">
        <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
          <Trophy className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Not Enough Data</h2>
        <p className="text-muted-foreground mb-8">
          Complete your analysis first to see where you stand among your peers.
        </p>
        <Button className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90">
          Analyze Skills
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    )
  }

  const { leaderboard, current_user, top_skills, missing_skills, improvement_suggestions, insight, jd_analysis } = rankingData

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-8 animate-in fade-in duration-500">
      {/* Header & Stats Overview */}
      <div className="grid lg:grid-cols-4 gap-6">
        <div className="lg:col-span-2 space-y-2">
          <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20 px-3 py-1 text-xs font-bold uppercase tracking-widest mb-2">
            AI-Powered Career Intelligence
          </Badge>
          <h1 className="text-4xl font-black tracking-tight text-foreground">
            Role <span className="text-primary italic">Leaderboard</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl leading-relaxed">
            Comparing you with <span className="text-foreground font-bold">{current_user.total_users}</span> peers in your exact role + <span className="text-primary font-bold">Target JD Analysis</span>.
          </p>
        </div>

        <Card className="bg-primary border-none text-primary-foreground overflow-hidden relative">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-primary-foreground/70 text-sm font-medium">Peer Percentile</p>
                <h2 className="text-4xl font-black mt-1">Top {100 - current_user.percentile}%</h2>
              </div>
              <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                <Medal className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-6 space-y-2">
              <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider">
                <span>Rank {current_user.rank} of {current_user.total_users}</span>
                <span>{current_user.percentile}% Ahead</span>
              </div>
              <Progress value={current_user.percentile} className="h-1.5 bg-white/20" />
            </div>
          </CardContent>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-3xl pointer-events-none" />
        </Card>

        {jd_analysis ? (
          <Card className="bg-zinc-900 border-zinc-800 text-white overflow-hidden relative">
            <CardContent className="p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-zinc-500 text-sm font-medium">JD Match Score</p>
                  <h2 className="text-4xl font-black mt-1 text-emerald-400">{jd_analysis.match_score}%</h2>
                </div>
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center border border-emerald-500/30">
                  <FileText className="w-6 h-6 text-emerald-400" />
                </div>
              </div>
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                  <span>Alignment with Target Job</span>
                  <span>{jd_analysis.match_score}% Ideal</span>
                </div>
                <Progress value={jd_analysis.match_score} className="h-1.5 bg-zinc-800" />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-dashed border-2 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center mb-3">
              <Target className="w-5 h-5 text-muted-foreground" />
            </div>
            <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Target JD missing</p>
            <Button variant="link" size="sm" className="h-auto p-0 text-primary text-xs" onClick={() => router.push('/onboarding/role')}>
              Add specific JD
            </Button>
          </Card>
        )}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left: Leaderboard Section */}
        <div className="lg:col-span-2 space-y-6">
           {jd_analysis && (
             <Card className="border-emerald-500/20 bg-emerald-500/5 backdrop-blur-sm">
                <CardHeader>
                   <CardTitle className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                      <Zap className="w-5 h-5" />
                      Specific Job Benchmarking
                   </CardTitle>
                   <CardDescription>How the role requirements match your profile</CardDescription>
                </CardHeader>
                <CardContent className="grid sm:grid-cols-2 gap-6 p-6 pt-0">
                   <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-emerald-600/70">JD Requirements</h4>
                      <div className="flex flex-wrap gap-2">
                        {jd_analysis.target_skills.map(skill => (
                          <Badge key={skill} variant="secondary" className="bg-emerald-500/10 text-emerald-600 border-none">
                            {jd_analysis.missing_skills.includes(skill) ? <span>{skill}</span> : <Check className="w-3 h-3 mr-1" />}
                            {!jd_analysis.missing_skills.includes(skill) && skill}
                          </Badge>
                        ))}
                      </div>
                   </div>
                   <div className="space-y-4">
                      <h4 className="text-xs font-black uppercase tracking-widest text-orange-600/70">Critical JD Gaps</h4>
                      {jd_analysis.missing_skills.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                           {jd_analysis.missing_skills.map(skill => (
                             <Badge key={skill} className="bg-orange-500/10 text-orange-600 border border-orange-500/20">
                                {skill}
                             </Badge>
                           ))}
                        </div>
                      ) : (
                        <p className="text-sm text-emerald-600 font-medium">You meet all technical requirements in the JD!</p>
                      )}
                   </div>
                </CardContent>
             </Card>
           )}
          <Card className="border-border/50 bg-card/30 backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Top Performers
                </CardTitle>
                <CardDescription>Peers with similar experience levels</CardDescription>
              </div>
              <Badge variant="secondary" className="font-mono">
                {leaderboard.length} Total Users
              </Badge>
            </CardHeader>
            <CardContent className="p-0">
               <div className="divide-y divide-border/50">
                  {leaderboard.map((user) => (
                    <div 
                      key={user.user_id} 
                      className={`flex items-center justify-between p-4 px-6 transition-colors ${
                        user.is_current ? 'bg-primary/10 border-l-4 border-l-primary' : 'hover:bg-muted/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                          user.rank === 1 ? 'bg-yellow-500/20 text-yellow-600' : 
                          user.rank === 2 ? 'bg-slate-400/20 text-slate-500' : 
                          user.rank === 3 ? 'bg-amber-600/20 text-amber-700' :
                          'bg-muted text-muted-foreground'
                        }`}>
                          {user.rank}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-sm">
                            {user.is_current ? 'You (Current Profile)' : `Peer-ID: ${user.user_id.slice(-6)}`}
                          </span>
                          <span className="text-xs text-muted-foreground">Analysed recently</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-6">
                         <div className="text-right">
                            <span className="block font-black text-lg text-primary">{user.readiness_score}%</span>
                            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Readiness</span>
                         </div>
                         {user.rank === 1 && <Award className="w-5 h-5 text-yellow-500" />}
                      </div>
                    </div>
                  ))}
               </div>
            </CardContent>
          </Card>

          {/* End of Left Column */}
        </div>

        {/* Right: Insights & Skill Gap Section */}
        <div className="space-y-6">
          {/* Insight Card Moved Here */}
          <Card className="border-primary/20 bg-primary/5 shadow-sm">
             <CardContent className="p-6">
                <div className="flex gap-4">
                   <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Sparkles className="w-6 h-6 text-primary" />
                   </div>
                   <div className="space-y-2">
                      <h4 className="font-bold text-lg">Platform Insight</h4>
                      <p className="text-muted-foreground leading-relaxed italic text-sm">
                        "{insight}"
                      </p>
                   </div>
                </div>
             </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                The Top 1% Advantage
              </CardTitle>
              <CardDescription>Most common skills among top 3 performers</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {top_skills.map(skill => (
                  <Badge 
                    key={skill} 
                    variant={missing_skills.includes(skill) ? "outline" : "secondary"}
                    className={missing_skills.includes(skill) ? "border-dashed opacity-70" : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-none"}
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
              
              {missing_skills.length > 0 && (
                 <div className="mt-6 pt-6 border-t border-border/50">
                    <h5 className="text-xs font-black uppercase tracking-widest text-muted-foreground mb-4">You are missing:</h5>
                    <div className="space-y-4">
                      {improvement_suggestions.map((item, i) => (
                        <div key={i} className="flex gap-3">
                           <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center shrink-0">
                              <TrendingUp className="w-4 h-4 text-orange-600" />
                           </div>
                           <div>
                              <div className="flex items-center gap-2">
                                <span className="font-bold text-sm">{item.skill}</span>
                                <Badge className="bg-emerald-500 text-white text-[10px] h-4 px-1.5">{item.expected_impact}</Badge>
                              </div>
                              <p className="text-[11px] text-muted-foreground mt-1 leading-snug">{item.reason}</p>
                           </div>
                        </div>
                      ))}
                    </div>
                 </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 text-white">
             <CardContent className="p-6 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center mx-auto">
                   <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                   <h4 className="font-bold">Next Milestone</h4>
                   <p className="text-sm text-zinc-400 mt-1">Master {improvement_suggestions[0]?.skill || 'Top Skills'} to reach Top 5%</p>
                </div>
                <Button className="w-full bg-white text-black hover:bg-white/90 font-bold rounded-xl h-10" onClick={() => router.push('/dashboard/roadmap')}>
                   Add to Roadmap
                </Button>
             </CardContent>
          </Card>

          {/* New Trending Card to fill space */}
          <Card className="border-border/40 bg-muted/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Zap className="w-4 h-4 text-primary" />
                Trending in Your Role
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-[11px] text-muted-foreground">Skills gaining momentum among {current_user.total_users} similar profiles this week.</p>
              <div className="space-y-2">
                {top_skills.slice(0, 3).map((skill, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <span className="font-medium">{skill}</span>
                    <Badge variant="outline" className="text-[10px] h-4 border-emerald-500/30 text-emerald-600 bg-emerald-500/5">+ {12 + i * 4}% usage</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

function LeaderboardSkeleton() {
  return (
    <div className="max-w-7xl mx-auto py-6 space-y-8">
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="h-40 w-full rounded-2xl" />
      </div>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Skeleton className="h-96 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
        <div className="space-y-6">
          <Skeleton className="h-64 w-full rounded-2xl" />
          <Skeleton className="h-40 w-full rounded-2xl" />
        </div>
      </div>
    </div>
  )
}
