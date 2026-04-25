'use client'

import React, { useState, useEffect, useRef } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { FileText, Download, Save, CheckCircle2, User, Mail, Phone, MapPin, Briefcase, GraduationCap, Sparkles, AlertCircle, TrendingUp } from 'lucide-react'
import { toast } from 'sonner'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import { Badge } from '@/components/ui/badge'

export default function ResumeBuilderPage() {
    const { user } = useUser()
    const latestAnalysis = useQuery(api.analysis.getLatestAnalysis)
    const userProfile = useQuery(api.users.getProfile)
    const savedResume = useQuery(api.resume.getResume, user ? { userId: user.id } : "skip")
    
    const saveResumeMutation = useMutation(api.resume.saveResume)
    const optimizeResumeMutation = useMutation(api.resume.optimizeResume)

    const [isEditing, setIsEditing] = useState(true)
    const [isSaving, setIsSaving] = useState(false)
    const [isOptimizing, setIsOptimizing] = useState(false)
    const [jobDescription, setJobDescription] = useState("")
    const [targetRoleVariant, setTargetRoleVariant] = useState("Software Engineer")
    
    const [insights, setInsights] = useState<any>(null)
    
    const [resumeData, setResumeData] = useState({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        summary: '',
        experience: '',
        education: '',
        template: 'modern'
    })

    const printRef = useRef<HTMLDivElement>(null)

    // Initialize state when data is loaded
    useEffect(() => {
        if (savedResume) {
            setResumeData(savedResume)
            setIsEditing(false)
        } else if (user && latestAnalysis && !savedResume) {
            // Default pre-fill if no saved resume
            setResumeData(prev => ({
                ...prev,
                fullName: user.fullName || '',
                email: user.primaryEmailAddress?.emailAddress || '',
                summary: `Results-driven ${latestAnalysis.roleSnapshot.title} with expertise in modern technologies. Proven ability to deliver high-quality solutions, eager to apply my strong foundation in ${latestAnalysis.matchedSkills.slice(0, 3).join(', ')} to drive business impact and collaborate within cross-functional teams.`,
                experience: `Company XYZ\n${latestAnalysis.roleSnapshot.title}\n2022 - Present\n- Spearheaded development using ${latestAnalysis.matchedSkills[0] || 'core technologies'}.\n- Optimized performance and led architectural decisions.`,
                education: `University Name\nB.S. in Computer Science\n2018 - 2022`,
                template: 'modern'
            }))
            setTargetRoleVariant(latestAnalysis.roleSnapshot.title)
        }
    }, [savedResume, user, latestAnalysis])

    if (!user || latestAnalysis === undefined || userProfile === undefined || savedResume === undefined) {
        return (
            <div className="space-y-8 max-w-6xl mx-auto pb-12">
                <Skeleton className="h-10 w-1/3 mb-2" />
                <Skeleton className="h-5 w-2/3" />
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    <Skeleton className="h-[600px] w-full" />
                    <Skeleton className="h-[600px] w-full lg:col-span-2" />
                </div>
            </div>
        )
    }

    if (!latestAnalysis) {
        return (
            <Card className="mt-8 border-dashed">
                <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                    <FileText className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
                    <h3 className="text-xl font-semibold mb-2">No Analysis Found</h3>
                    <p className="text-muted-foreground">Complete your skill analysis first to generate an ATS-friendly resume.</p>
                </CardContent>
            </Card>
        )
    }

    const handlePrint = () => {
        window.print()
    }

    const handleSave = async () => {
        setIsSaving(true)
        try {
            await saveResumeMutation({
                userId: user.id,
                ...resumeData
            })
            setIsEditing(false)
            toast.success("Resume saved successfully.")
        } catch (error) {
            toast.error("Failed to save resume.")
        } finally {
            setIsSaving(false)
        }
    }

    const handleOptimize = async () => {
        setIsOptimizing(true)
        toast("Analyzing resume...", { description: "Applying AI optimizations and calculating ATS score." })
        try {
            // First save current state so optimization runs on latest text
            await saveResumeMutation({
                userId: user.id,
                ...resumeData
            })

            const result = await optimizeResumeMutation({
                userId: user.id,
                jobDescription,
                targetRole: targetRoleVariant
            })

            setResumeData(prev => ({
                ...prev,
                summary: result.optimized_resume.summary,
                experience: result.optimized_resume.experience,
            }))
            
            setInsights(result.ats_analysis)
            
            toast.success(`Optimization complete! ATS Score: ${result.ats_analysis.ats_score}%`)
        } catch (error) {
            toast.error("Failed to optimize resume.")
        } finally {
            setIsOptimizing(false)
        }
    }

    // Template specific classes
    const getTemplateStyles = () => {
        switch(resumeData.template) {
            case 'classic':
                return {
                    container: "font-serif text-black",
                    header: "text-center pb-4 border-b-2 border-black",
                    name: "text-3xl font-bold uppercase",
                    title: "text-lg italic mt-1",
                    contact: "justify-center mt-2",
                    sectionTitle: "text-lg font-bold uppercase border-b border-black pb-1 mb-3 mt-6",
                    iconClass: "hidden"
                };
            case 'minimalist':
                return {
                    container: "font-sans text-gray-900",
                    header: "pb-6",
                    name: "text-4xl font-light tracking-wider",
                    title: "text-xl font-normal text-gray-500 mt-2",
                    contact: "justify-start mt-4",
                    sectionTitle: "text-sm font-semibold tracking-widest text-gray-400 uppercase mb-4 mt-8",
                    iconClass: "hidden"
                };
            case 'modern':
            default:
                return {
                    container: "font-sans text-gray-900",
                    header: "bg-gray-50 p-8 border-b border-gray-200 -mx-8 -mt-8 mb-8",
                    name: "text-4xl font-extrabold tracking-tight",
                    title: "text-xl text-primary font-medium mt-1",
                    contact: "justify-start mt-4",
                    sectionTitle: "text-lg font-bold border-b-2 border-gray-200 pb-1 mb-3 mt-6 flex items-center gap-2",
                    iconClass: "w-5 h-5 text-primary"
                };
        }
    }

    const styles = getTemplateStyles()

    return (
        <div className="space-y-8 max-w-6xl mx-auto pb-12 print-container">
            <style jsx global>{`
                @media print {
                    body * {
                        visibility: hidden;
                    }
                    .print-section, .print-section * {
                        visibility: visible;
                    }
                    .print-section {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .no-print {
                        display: none !important;
                    }
                }
            `}</style>
            
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 no-print">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                        <FileText className="w-8 h-8 text-primary" /> Resume Optimization Engine
                    </h1>
                    <p className="text-muted-foreground mt-2">
                        AI-powered resume builder tailored to real industry readiness.
                    </p>
                </div>
                <div className="flex flex-wrap gap-2">
                    <Button variant={isEditing ? "outline" : "default"} onClick={() => setIsEditing(!isEditing)}>
                        {isEditing ? "Preview Mode" : "Edit Details"}
                    </Button>
                    <Button onClick={handleSave} disabled={isSaving} variant="secondary">
                        <Save className="w-4 h-4 mr-2" /> {isSaving ? "Saving..." : "Save Resume"}
                    </Button>
                    <Button onClick={handleOptimize} disabled={isOptimizing} className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md">
                        <Sparkles className="w-4 h-4 mr-2" /> {isOptimizing ? "Optimizing..." : "AI Optimize"}
                    </Button>
                    <Button onClick={handlePrint} className="bg-primary text-primary-foreground shadow-md">
                        <Download className="w-4 h-4 mr-2" /> Download PDF
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 space-y-6 no-print">
                    
                    {insights && (
                        <Card className="border-indigo-200 bg-indigo-50/50 dark:bg-indigo-950/20 shadow-sm">
                            <CardHeader className="pb-3 border-b border-indigo-100 dark:border-indigo-900">
                                <CardTitle className="text-lg flex items-center gap-2 text-indigo-700 dark:text-indigo-400">
                                    <TrendingUp className="w-5 h-5" /> ATS Score: {insights.ats_score}%
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="p-4 space-y-4 text-sm">
                                <div>
                                    <p className="font-semibold text-green-700 dark:text-green-400 flex items-center gap-1 mb-1"><CheckCircle2 className="w-4 h-4"/> Strengths</p>
                                    <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                        {insights.strengths.map((s: string, i: number) => <li key={i}>{s}</li>)}
                                    </ul>
                                </div>
                                {insights.weaknesses.length > 0 && (
                                    <div>
                                        <p className="font-semibold text-red-700 dark:text-red-400 flex items-center gap-1 mb-1"><AlertCircle className="w-4 h-4"/> Weaknesses</p>
                                        <ul className="list-disc list-inside text-muted-foreground space-y-1">
                                            {insights.weaknesses.map((w: string, i: number) => <li key={i}>{w}</li>)}
                                        </ul>
                                    </div>
                                )}
                                {insights.missing_keywords.length > 0 && (
                                    <div>
                                        <p className="font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-1 mb-1">Missing Keywords</p>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                            {insights.missing_keywords.map((k: string, i: number) => (
                                                <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800" key={i}>{k}</Badge>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    )}

                    {isEditing && (
                        <Card className="border-primary/20 shadow-md">
                            <CardHeader className="bg-muted/30 border-b">
                                <CardTitle className="text-xl">Resume Editor</CardTitle>
                                <CardDescription>Update details or let AI generate them.</CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4 p-6">
                                <div className="space-y-2">
                                    <Label>Template</Label>
                                    <Select value={resumeData.template} onValueChange={(val) => setResumeData({...resumeData, template: val})}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select template" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="modern">Modern</SelectItem>
                                            <SelectItem value="minimalist">Minimalist</SelectItem>
                                            <SelectItem value="classic">Classic (Best for ATS)</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-indigo-500" /> Target Role Variant</Label>
                                    <Input value={targetRoleVariant} onChange={e => setTargetRoleVariant(e.target.value)} placeholder="Frontend, Backend, Fullstack..." />
                                </div>
                                <div className="space-y-2">
                                    <Label className="flex items-center gap-2"><Sparkles className="w-3 h-3 text-indigo-500" /> Job Description (Optional)</Label>
                                    <Textarea 
                                        className="text-xs min-h-[60px]" 
                                        placeholder="Paste job description to tailor your resume..." 
                                        value={jobDescription} 
                                        onChange={e => setJobDescription(e.target.value)} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Full Name</Label>
                                    <Input value={resumeData.fullName} onChange={e => setResumeData({...resumeData, fullName: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Email</Label>
                                    <Input value={resumeData.email} onChange={e => setResumeData({...resumeData, email: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Phone</Label>
                                    <Input placeholder="+1 (555) 000-0000" value={resumeData.phone} onChange={e => setResumeData({...resumeData, phone: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Input placeholder="City, Country" value={resumeData.location} onChange={e => setResumeData({...resumeData, location: e.target.value})} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Professional Summary</Label>
                                    <Textarea 
                                        className="min-h-[100px] text-xs" 
                                        value={resumeData.summary} 
                                        onChange={e => setResumeData({...resumeData, summary: e.target.value})} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Experience (Use markdown or plain text)</Label>
                                    <Textarea 
                                        className="min-h-[150px] text-xs" 
                                        value={resumeData.experience} 
                                        onChange={e => setResumeData({...resumeData, experience: e.target.value})} 
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Education</Label>
                                    <Textarea 
                                        className="min-h-[80px] text-xs" 
                                        value={resumeData.education} 
                                        onChange={e => setResumeData({...resumeData, education: e.target.value})} 
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                <div className={`transition-all duration-300 ${isEditing || insights ? 'lg:col-span-2' : 'lg:col-span-3 max-w-4xl mx-auto w-full'}`}>
                    <Card className="shadow-2xl overflow-hidden border-border print-section bg-white min-h-[1122px] w-full" ref={printRef}>
                        <div className={`p-8 md:p-12 ${styles.container}`}>
                            
                            {/* Resume Header */}
                            <div className={styles.header}>
                                <h1 className={styles.name}>
                                    {resumeData.fullName || "Your Name"}
                                </h1>
                                <h2 className={styles.title}>
                                    {targetRoleVariant}
                                </h2>
                                <div className={`flex flex-wrap gap-x-6 gap-y-2 text-sm ${resumeData.template === 'classic' ? 'text-black' : 'text-gray-600'} ${styles.contact}`}>
                                    <div className="flex items-center gap-1.5">
                                        <Mail className={`w-4 h-4 ${resumeData.template === 'modern' ? 'text-primary' : 'hidden'}`} /> {resumeData.email}
                                    </div>
                                    {resumeData.phone && (
                                        <div className="flex items-center gap-1.5">
                                            <Phone className={`w-4 h-4 ${resumeData.template === 'modern' ? 'text-primary' : 'hidden'}`} /> {resumeData.phone}
                                        </div>
                                    )}
                                    {resumeData.location && (
                                        <div className="flex items-center gap-1.5">
                                            <MapPin className={`w-4 h-4 ${resumeData.template === 'modern' ? 'text-primary' : 'hidden'}`} /> {resumeData.location}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Resume Body */}
                            <div className="space-y-1">
                                
                                {/* Summary */}
                                {resumeData.summary && (
                                    <section>
                                        <h3 className={styles.sectionTitle}>
                                            <User className={styles.iconClass} /> Professional Summary
                                        </h3>
                                        <p className="leading-relaxed text-sm whitespace-pre-wrap">
                                            {resumeData.summary}
                                        </p>
                                    </section>
                                )}

                                {/* Skills */}
                                <section>
                                    <h3 className={styles.sectionTitle}>
                                        <CheckCircle2 className={styles.iconClass} /> Technical Skills
                                    </h3>
                                    <div className="text-sm">
                                        <p className="mb-1"><span className="font-semibold">Core Competencies:</span> {latestAnalysis.matchedSkills.join(', ')}</p>
                                        <p><span className="font-semibold">Familiar With:</span> {latestAnalysis.missingSkills.slice(0, 8).join(', ')}</p>
                                    </div>
                                </section>

                                {/* Experience */}
                                {resumeData.experience && (
                                    <section>
                                        <h3 className={styles.sectionTitle}>
                                            <Briefcase className={styles.iconClass} /> Experience
                                        </h3>
                                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {resumeData.experience}
                                        </div>
                                    </section>
                                )}

                                {/* Education */}
                                {resumeData.education && (
                                    <section>
                                        <h3 className={styles.sectionTitle}>
                                            <GraduationCap className={styles.iconClass} /> Education
                                        </h3>
                                        <div className="text-sm leading-relaxed whitespace-pre-wrap">
                                            {resumeData.education}
                                        </div>
                                    </section>
                                )}
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    )
}
