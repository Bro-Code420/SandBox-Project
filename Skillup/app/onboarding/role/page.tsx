'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Layout,
  Server,
  Layers,
  BarChart,
  Cloud,
  ChevronLeft,
  ChevronRight,
  Briefcase,
  GraduationCap,
  Building2,
  Rocket,
  Sparkles,
  Target
} from 'lucide-react'
import { Textarea } from '@/components/ui/textarea'
import { jobDomains } from '@/lib/data'
import type { RoleLevel, EmploymentType } from '@/lib/types'

const domainIcons: Record<string, typeof Layout> = {
  'Layout': Layout,
  'Server': Server,
  'Layers': Layers,
  'BarChart': BarChart,
  'Cloud': Cloud,
}

const roleLevels: { value: RoleLevel; label: string; icon: typeof GraduationCap; description: string }[] = [
  { value: 'intern', label: 'Intern', icon: GraduationCap, description: 'Learning the basics' },
  { value: 'junior', label: 'Junior', icon: Briefcase, description: '0-2 years experience' },
  { value: 'mid', label: 'Mid-Level', icon: Building2, description: '2-5 years experience' },
  { value: 'senior', label: 'Senior', icon: Rocket, description: '5+ years experience' },
]

const employmentTypes: { value: EmploymentType; label: string }[] = [
  { value: 'full-time', label: 'Full-time' },
  { value: 'part-time', label: 'Part-time' },
  { value: 'contract', label: 'Contract' },
  { value: 'freelance', label: 'Freelance' },
]

export default function RoleSelectionPage() {
  const router = useRouter()
  const saveJobRole = useMutation(api.onboarding.saveJobRole)
  const existingJobRole = useQuery(api.onboarding.getJobRole)

  const [selectedDomain, setSelectedDomain] = useState<string>('')
  const [selectedLevel, setSelectedLevel] = useState<RoleLevel | ''>('')
  const [selectedEmployment, setSelectedEmployment] = useState<EmploymentType>('full-time')
  const [targetJD, setTargetJD] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (existingJobRole) {
      setSelectedDomain(existingJobRole.domain)
      setSelectedLevel(existingJobRole.roleLevel as RoleLevel)
      setSelectedEmployment(existingJobRole.employmentType as EmploymentType)
      setTargetJD(existingJobRole.targetJobDescription || '')
    }
  }, [existingJobRole])

  const selectedDomainData = jobDomains.find(d => d.id === selectedDomain)
  const selectedRoleConfig = selectedDomainData && selectedLevel
    ? selectedDomainData.roles[selectedLevel as RoleLevel]
    : null

  const handleContinue = async () => {
    if (!selectedDomainData || !selectedRoleConfig || !selectedLevel) return

    setIsSaving(true)
    try {
      await saveJobRole({
        domain: selectedDomain,
        roleLevel: selectedLevel as RoleLevel,
        experienceRange: selectedRoleConfig.experienceRange,
        employmentType: selectedEmployment,
        responsibilities: selectedRoleConfig.responsibilities,
        coreSkills: selectedRoleConfig.coreSkills,
        bonusSkills: selectedRoleConfig.bonusSkills,
        targetJobDescription: targetJD || undefined,
      })
      router.push('/onboarding/skills')
    } catch (error) {
      console.error("Failed to save job role:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const isValid = selectedDomain && selectedLevel && !isSaving

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header with Back Button */}
      <div className="flex items-center justify-between mb-8">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push('/dashboard')}
          className="gap-2 text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Dashboard
        </Button>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Step 1 of 2</span>
          <span className="text-primary font-medium">Select Role</span>
        </div>
        <Progress value={50} className="h-2" />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Select Your Target Role
        </h1>
        <p className="text-muted-foreground">
          Choose the job domain and experience level you are targeting
        </p>
      </div>

      {/* Domain Selection */}
      <div className="mb-8">
        <Label className="text-lg font-semibold mb-4 block">Job Domain</Label>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobDomains.map((domain) => {
            const Icon = domainIcons[domain.icon] || Layout
            const isSelected = selectedDomain === domain.id

            return (
              <Card
                key={domain.id}
                className={`cursor-pointer transition-all hover:border-primary/50 ${isSelected ? 'border-primary bg-primary/5' : 'border-border/50'
                  }`}
                onClick={() => setSelectedDomain(domain.id)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${isSelected ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <div>
                    <h3 className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {domain.name}
                    </h3>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Role Level Selection */}
      <div className="mb-8">
        <Label className="text-lg font-semibold mb-4 block">Experience Level</Label>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {roleLevels.map((level) => {
            const Icon = level.icon
            const isSelected = selectedLevel === level.value

            return (
              <Card
                key={level.value}
                className={`cursor-pointer transition-all hover:border-primary/50 ${isSelected ? 'border-primary bg-primary/5' : 'border-border/50'
                  }`}
                onClick={() => setSelectedLevel(level.value)}
              >
                <CardContent className="p-4 text-center">
                  <div className={`w-12 h-12 rounded-full mx-auto mb-3 flex items-center justify-center ${isSelected ? 'bg-primary/20' : 'bg-muted'
                    }`}>
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <h3 className={`font-medium ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                    {level.label}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">{level.description}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Employment Type */}
      <div className="mb-8">
        <Label className="text-lg font-semibold mb-4 block">Employment Type</Label>
        <RadioGroup
          value={selectedEmployment}
          onValueChange={(value) => setSelectedEmployment(value as EmploymentType)}
          className="flex flex-wrap gap-4"
        >
          {employmentTypes.map((type) => (
            <div key={type.value} className="flex items-center space-x-2">
              <RadioGroupItem value={type.value} id={type.value} />
              <Label htmlFor={type.value} className="cursor-pointer">{type.label}</Label>
            </div>
          ))}
        </RadioGroup>
      </div>

      {/* Job Description (NEW) */}
      <div className="mb-8 p-6 rounded-2xl bg-primary/5 border border-primary/20 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Target className="w-5 h-5 text-primary" />
          </div>
          <div>
            <Label className="text-lg font-bold block">Target Job Description (Optional)</Label>
            <p className="text-xs text-muted-foreground">Paste a specific job posting to rank yourself against its exact requirements</p>
          </div>
        </div>
        <Textarea 
          placeholder="Paste the job responsibilities, requirements, and tech stack here..."
          className="min-h-[150px] bg-background/50 border-primary/20 focus:border-primary transition-all resize-none"
          value={targetJD}
          onChange={(e) => setTargetJD(e.target.value)}
        />
        <div className="flex items-center gap-2 text-[10px] font-bold text-primary/70 uppercase tracking-widest">
           <Sparkles className="w-3 h-3" />
           AI will extract requirements automatically
        </div>
      </div>

      {/* Role Preview */}
      {selectedRoleConfig && (
        <Card className="mb-8 border-primary/30 bg-primary/5">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              {selectedRoleConfig.title}
            </CardTitle>
            <CardDescription>
              Experience: {selectedRoleConfig.experienceRange}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium text-sm text-foreground mb-2">Key Responsibilities</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                {selectedRoleConfig.responsibilities.slice(0, 3).map((resp, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    {resp}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-medium text-sm text-foreground mb-2">Core Skills Required</h4>
              <div className="flex flex-wrap gap-2">
                {selectedRoleConfig.coreSkills.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {selectedRoleConfig.bonusSkills.length > 0 && (
              <div>
                <h4 className="font-medium text-sm text-foreground mb-2">Bonus Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedRoleConfig.bonusSkills.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-muted-foreground">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Continue Button */}
      <div className="flex justify-end">
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={!isValid}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSaving ? 'Saving...' : 'Continue to Skills'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
