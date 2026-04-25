'use client'

import React, { useState, useEffect } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { BrainCircuit, PlayCircle, Lock, CheckCircle2, Flame, Trophy, Calendar } from 'lucide-react'
import { toast } from 'sonner'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'

export default function DailyChallengePage() {
    const { user } = useUser()
    const latestAnalysis = useQuery(api.analysis.getLatestAnalysis)
    const liveProfile = useQuery(api.analysis.getLiveProfile)
    const currentRoadmap = useQuery(api.roadmap.getLatestRoadmap)
    const userProgress = useQuery(api.dailyChallenge.getUserProgress, user ? { userId: user.id } : "skip")
    const dailyTests = useQuery(api.dailyChallenge.getDailyTests, user ? { userId: user.id } : "skip")
    
    const generateTest = useMutation(api.dailyChallenge.generateDailyTest)
    const submitAttempt = useMutation(api.dailyChallenge.submitDailyTest)

    const [activeTest, setActiveTest] = useState<any>(null)
    const [answers, setAnswers] = useState<Record<number, string>>({})
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [result, setResult] = useState<any>(null)

    if (!user || latestAnalysis === undefined || currentRoadmap === undefined || userProgress === undefined || dailyTests === undefined) {
        return (
            <div className="space-y-8 max-w-6xl mx-auto pb-12">
                <div>
                    <Skeleton className="h-10 w-1/3 mb-2" />
                    <Skeleton className="h-5 w-2/3" />
                </div>
                <div className="grid gap-4 md:grid-cols-4">
                    {[1, 2, 3, 4].map(i => (
                        <Card key={i} className="border-muted">
                            <CardContent className="p-6 flex items-center gap-4">
                                <Skeleton className="w-12 h-12 rounded-full" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-24" />
                                    <Skeleton className="h-6 w-16" />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
                <Card className="border-muted shadow-sm">
                    <CardHeader className="border-b bg-muted/10 pb-4">
                        <Skeleton className="h-6 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
                            {Array.from({ length: 18 }).map((_, i) => (
                                <Skeleton key={i} className="h-32 w-full rounded-xl" />
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (!latestAnalysis || !currentRoadmap) {
        return (
            <Card className="mt-8 border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                    <BrainCircuit className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No Analysis or Roadmap Found</h3>
                    <p className="text-muted-foreground">Complete your skill analysis to generate your 30-day personalized challenge.</p>
                </CardContent>
            </Card>
        )
    }

    const currentDay = userProgress?.current_day || 1;
    const totalDays = 30;

    const getSkillForDay = (day: number) => {
        const weekIndex = Math.floor((day - 1) / 7);
        const week = currentRoadmap.weeks[Math.min(weekIndex, currentRoadmap.weeks.length - 1)];
        return week ? week.focusSkill : latestAnalysis.roleSnapshot.title;
    };

    const handleGenerateTest = async (day: number) => {
        const loadingToast = toast.loading(`Generating Day ${day} challenge...`)
        try {
            const skill = getSkillForDay(day)
            
            // Generate or fetch the test
            const test = await generateTest({
                userId: user.id,
                day,
                skill,
                difficulty: userProgress?.next_difficulty || "intermediate"
            })
            setActiveTest(test)
            setAnswers({})
            setResult(null)
            toast.dismiss(loadingToast)
        } catch (error) {
            toast.dismiss(loadingToast)
            toast.error("Failed to generate test. Make sure you are authenticated.")
        }
    }

    const handleSubmit = async () => {
        if (Object.keys(answers).length < activeTest.questions.length) {
            toast.error("Please answer all questions before submitting.")
            return
        }

        setIsSubmitting(true)
        try {
            const formattedAnswers = Object.entries(answers).map(([idx, ans]) => ({
                questionIndex: parseInt(idx),
                answer: ans as string
            }))

            const res = await submitAttempt({
                userId: user.id,
                testId: activeTest._id,
                answers: formattedAnswers
            })

            setResult(res)
            toast.success("Test evaluated successfully!")
        } catch (error: any) {
            console.error(error)
            toast.error(error.message || "Failed to submit test. Check console.")
        } finally {
            setIsSubmitting(false)
        }
    }

    const daysArray = Array.from({ length: totalDays }, (_, i) => i + 1);

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-12">
            <div>
                <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">Daily Skill Challenge</h1>
                <p className="text-muted-foreground mt-2">
                    Master {latestAnalysis.roleSnapshot.title} over 30 days. One challenge a day to boost your readiness.
                </p>
            </div>

            {/* Dashboard Stats */}
            {!activeTest && !result && (
                <div className="grid gap-4 md:grid-cols-4">
                    <Card className="bg-gradient-to-br from-orange-500/10 to-orange-500/5 border-orange-200/50 dark:border-orange-900/50">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-orange-500/20 rounded-full text-orange-600 dark:text-orange-400">
                                <Flame className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Current Streak</p>
                                <h3 className="text-2xl font-bold">{userProgress?.streak || 0} Days</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-200/50 dark:border-blue-900/50">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-blue-500/20 rounded-full text-blue-600 dark:text-blue-400">
                                <Calendar className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Challenge Day</p>
                                <h3 className="text-2xl font-bold">{currentDay} / {totalDays}</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-200/50 dark:border-green-900/50">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-green-500/20 rounded-full text-green-600 dark:text-green-400">
                                <Trophy className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Readiness Score</p>
                                <h3 className="text-2xl font-bold">{liveProfile?.readinessScore || 0}%</h3>
                            </div>
                        </CardContent>
                    </Card>
                    <Card className="bg-gradient-to-br from-purple-500/10 to-purple-500/5 border-purple-200/50 dark:border-purple-900/50">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="p-3 bg-purple-500/20 rounded-full text-purple-600 dark:text-purple-400">
                                <BrainCircuit className="w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Completed Tests</p>
                                <h3 className="text-2xl font-bold">{dailyTests?.filter((t: any) => t.status === "completed").length || 0}</h3>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* 30-Day Grid */}
            {!activeTest && !result && (
                <Card className="border-primary/20 shadow-sm">
                    <CardHeader className="border-b bg-muted/10 pb-4">
                        <CardTitle className="text-xl">Your 30-Day Journey</CardTitle>
                        <CardDescription>Unlock a new test every day based on your learning roadmap.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
                            {daysArray.map(day => {
                                const testRecord = dailyTests.find((t: any) => t.day === day);
                                const isCompleted = testRecord?.status === "completed";
                                const isAvailable = day === currentDay;
                                const isLocked = day > currentDay;
                                
                                return (
                                    <div 
                                        key={day}
                                        onClick={() => {
                                            if (isAvailable || (isCompleted && testRecord)) {
                                                handleGenerateTest(day)
                                            }
                                        }}
                                        className={`
                                            relative flex flex-col items-center justify-center p-4 rounded-xl border-2 transition-all
                                            ${isLocked ? 'bg-muted/30 border-dashed border-muted cursor-not-allowed opacity-60' : ''}
                                            ${isAvailable ? 'bg-primary/5 border-primary shadow-sm hover:shadow-md cursor-pointer transform hover:-translate-y-1' : ''}
                                            ${isCompleted ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900 cursor-pointer hover:bg-green-100 dark:hover:bg-green-900/40' : ''}
                                        `}
                                    >
                                        <div className="text-sm font-medium text-muted-foreground mb-1">Day {day}</div>
                                        
                                        {isLocked && <Lock className="w-8 h-8 text-muted-foreground/50 my-2" />}
                                        {isAvailable && <PlayCircle className="w-8 h-8 text-primary my-2" />}
                                        {isCompleted && <CheckCircle2 className="w-8 h-8 text-green-500 my-2" />}
                                        
                                        <div className="text-xs font-semibold text-center mt-1 truncate w-full px-1" title={getSkillForDay(day)}>
                                            {getSkillForDay(day)}
                                        </div>
                                        
                                        {isAvailable && (
                                            <span className="absolute -top-2 -right-2 flex h-4 w-4">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-4 w-4 bg-primary"></span>
                                            </span>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Test Taking Interface */}
            {activeTest && !result && (
                <Card className="border-primary/50 shadow-lg">
                    <CardHeader className="border-b bg-primary/5 pb-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <Badge variant="outline" className="mb-2 bg-background">Day {activeTest.day}</Badge>
                                <CardTitle className="text-2xl">{activeTest.skill} Assessment</CardTitle>
                                <CardDescription className="mt-1">
                                    {activeTest.status === "completed" 
                                        ? "You have already completed this test, but you can review the questions." 
                                        : "Answer the following questions to complete today's challenge."}
                                </CardDescription>
                            </div>
                            <Button variant="ghost" onClick={() => setActiveTest(null)}>Cancel</Button>
                        </div>
                    </CardHeader>
                    <CardContent className="p-0">
                        <div className="divide-y divide-border">
                            {activeTest.questions.map((q: any, i: number) => (
                                <div key={i} className="p-6 md:p-8 space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                                            {i + 1}
                                        </div>
                                        <div className="space-y-4 w-full">
                                            <h3 className="text-lg font-medium">{q.question}</h3>
                                            
                                            {q.type === 'mcq' ? (
                                                <RadioGroup 
                                                    value={answers[i] || ""} 
                                                    onValueChange={(val) => setAnswers(prev => ({ ...prev, [i]: val }))}
                                                    className="space-y-3 mt-4"
                                                    disabled={activeTest.status === "completed"}
                                                >
                                                    {q.options?.map((opt: string, optIdx: number) => (
                                                        <div key={optIdx} className="flex items-center space-x-3 border p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                                                            <RadioGroupItem value={opt} id={`q${i}-opt${optIdx}`} />
                                                            <Label htmlFor={`q${i}-opt${optIdx}`} className="flex-1 cursor-pointer font-normal group-hover:text-foreground">
                                                                {opt}
                                                            </Label>
                                                        </div>
                                                    ))}
                                                </RadioGroup>
                                            ) : (
                                                <div className="mt-4">
                                                    <Textarea 
                                                        placeholder="Explain your approach..."
                                                        className="min-h-[120px] resize-y"
                                                        value={answers[i] || ''}
                                                        onChange={(e) => setAnswers(prev => ({ ...prev, [i]: e.target.value }))}
                                                        disabled={activeTest.status === "completed"}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                    {activeTest.status !== "completed" && (
                        <CardFooter className="p-6 md:p-8 border-t bg-muted/10 flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="w-full sm:w-1/3">
                                <div className="flex justify-between text-sm mb-1 text-muted-foreground">
                                    <span>Progress</span>
                                    <span>{Object.keys(answers).length} / {activeTest.questions.length}</span>
                                </div>
                                <Progress value={(Object.keys(answers).length / activeTest.questions.length) * 100} className="h-2" />
                            </div>
                            <Button onClick={handleSubmit} disabled={isSubmitting} size="lg" className="w-full sm:w-auto px-8 shadow-md">
                                {isSubmitting ? "Evaluating..." : "Submit Answers"}
                            </Button>
                        </CardFooter>
                    )}
                </Card>
            )}

            {/* Result Display */}
            {result && (
                <div className="space-y-6">
                    <Card className="overflow-hidden border-2 border-primary/20 shadow-xl max-w-3xl mx-auto">
                        <div className={`h-2 ${result.score > 80 ? 'bg-green-500' : result.score >= 50 ? 'bg-yellow-500' : 'bg-red-500'}`} />
                        <CardHeader className="text-center pb-2">
                            <Badge variant="outline" className="mx-auto mb-4 w-fit bg-background">Day {result.day} Challenge</Badge>
                            <CardTitle className="text-3xl">Assessment Complete</CardTitle>
                            <CardDescription>You have completed the challenge for {result.skill}</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-8 pt-6 border-b">
                            {/* Score Display */}
                            <div className="flex flex-col items-center justify-center">
                                <div className="relative flex items-center justify-center w-48 h-48 rounded-full border-[12px] border-muted bg-background shadow-inner">
                                    <svg className="absolute inset-0 w-full h-full transform -rotate-90">
                                        <circle
                                            cx="96"
                                            cy="96"
                                            r="82"
                                            stroke="currentColor"
                                            strokeWidth="12"
                                            fill="none"
                                            className={`${result.score > 80 ? 'text-green-500' : result.score >= 50 ? 'text-yellow-500' : 'text-red-500'} drop-shadow-md`}
                                            strokeDasharray="515"
                                            strokeDashoffset={515 - (515 * result.score) / 100}
                                            strokeLinecap="round"
                                            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
                                        />
                                    </svg>
                                    <div className="text-center z-10">
                                        <span className="text-5xl font-extrabold">{result.score}%</span>
                                        <span className="block text-xs text-muted-foreground uppercase tracking-widest mt-2 font-semibold">Score</span>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Feedback Section */}
                            <div className="bg-muted/30 rounded-xl p-6 border text-center">
                                <h4 className="font-semibold text-lg mb-2">Evaluation Feedback</h4>
                                <p className="text-muted-foreground">{result.feedback}</p>
                                
                                {result.readiness_impact !== 0 && (
                                    <div className={`mt-6 inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold shadow-sm ${result.readiness_impact > 0 ? 'bg-green-500/10 text-green-600 dark:text-green-400 border border-green-200 dark:border-green-800' : 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'}`}>
                                        {result.readiness_impact > 0 ? '+' : ''}{result.readiness_impact}% Overall Readiness Match
                                    </div>
                                )}
                            </div>
                        </CardContent>
                        <CardFooter className="flex flex-col sm:flex-row gap-4 p-6 bg-muted/10 justify-center">
                            <Button variant="outline" size="lg" className="w-full sm:w-auto" onClick={() => { setActiveTest(null); setResult(null); }}>
                                View 30-Day Journey
                            </Button>
                            <Button size="lg" className="w-full sm:w-auto" onClick={() => window.location.href='/dashboard'}>
                                Go to Dashboard
                            </Button>
                        </CardFooter>
                    </Card>
                </div>
            )}
        </div>
    )
}
