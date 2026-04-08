'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation, useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ScrollArea } from '@/components/ui/scroll-area'
import {
  ChevronRight,
  ChevronLeft,
  Search,
  X,
  Upload,
  Check,
  AlertCircle
} from 'lucide-react'
import { allSkills } from '@/lib/data'

const skillCategories = [
  { name: 'Frontend', skills: ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'React', 'Vue.js', 'Angular', 'Next.js', 'Svelte', 'Tailwind CSS', 'SASS/SCSS', 'Bootstrap', 'Responsive Design', 'Accessibility', 'SEO', 'State Management', 'Redux', 'Zustand'] },
  { name: 'Backend', skills: ['Node.js', 'Python', 'Java', 'Go', 'Rust', 'C#', 'PHP', 'Ruby', 'Express.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'REST APIs', 'GraphQL', 'gRPC', 'WebSockets'] },
  { name: 'Database', skills: ['SQL', 'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'Elasticsearch', 'Prisma', 'Sequelize', 'SQLAlchemy'] },
  { name: 'DevOps', skills: ['Git', 'GitHub', 'GitLab', 'CI/CD', 'Docker', 'Kubernetes', 'Terraform', 'AWS', 'GCP', 'Azure', 'Linux', 'Bash', 'Monitoring', 'Prometheus', 'Grafana'] },
  { name: 'Data Science', skills: ['Statistics', 'Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Pandas', 'NumPy', 'Scikit-learn', 'TensorFlow', 'PyTorch', 'Data Visualization', 'A/B Testing', 'MLOps'] },
  { name: 'Testing', skills: ['Testing', 'Jest', 'Cypress', 'Playwright', 'Unit Testing', 'Integration Testing', 'E2E Testing'] },
  { name: 'Soft Skills', skills: ['Communication', 'Leadership', 'Problem Solving', 'Teamwork', 'Agile', 'Scrum'] },
]

export default function SkillsPage() {
  const router = useRouter()
  const saveUserSkills = useMutation(api.onboarding.saveUserSkills)
  const jobRole = useQuery(api.onboarding.getJobRole)
  const existingSkills = useQuery(api.onboarding.getUserSkills)

  const [selectedSkills, setSelectedSkills] = useState<string[]>([])
  const [resumeText, setResumeText] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState('Frontend')
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    if (existingSkills) {
      setSelectedSkills(existingSkills.skills)
      setResumeText(existingSkills.resumeText || '')
    }
  }, [existingSkills])

  const filteredSkills = useMemo(() => {
    if (!searchQuery) return []
    const query = searchQuery.toLowerCase()
    return allSkills.filter(skill =>
      skill.toLowerCase().includes(query) && !selectedSkills.includes(skill)
    ).slice(0, 10)
  }, [searchQuery, selectedSkills])

  const categorySkills = useMemo(() => {
    const category = skillCategories.find(c => c.name === activeCategory)
    return category?.skills || []
  }, [activeCategory])

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev =>
      prev.includes(skill)
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    )
  }

  const handleContinue = async () => {
    if (selectedSkills.length < 1) return
    setIsSaving(true)
    try {
      await saveUserSkills({
        skills: selectedSkills,
        resumeText: resumeText || undefined
      })
      router.push('/analyze')
    } catch (error) {
      console.error("Failed to save skills:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleBack = () => {
    router.push('/onboarding/role')
  }

  // Calculate match with required skills
  const matchedCoreSkills = jobRole?.coreSkills?.filter(skill =>
    selectedSkills.some(s => s.toLowerCase() === skill.toLowerCase())
  ) || []
  const matchedBonusSkills = jobRole?.bonusSkills?.filter(skill =>
    selectedSkills.some(s => s.toLowerCase() === skill.toLowerCase())
  ) || []

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted-foreground">Step 2 of 2</span>
          <span className="text-primary font-medium">Input Skills</span>
        </div>
        <Progress value={100} className="h-2" />
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Tell Us About Your Skills
        </h1>
        <p className="text-muted-foreground">
          Select the skills you currently have to get your readiness analysis
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Skill Selection */}
        <div className="lg:col-span-2 space-y-6">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-input border-border"
            />
            {filteredSkills.length > 0 && (
              <Card className="absolute top-full left-0 right-0 mt-1 z-10">
                <CardContent className="p-2">
                  {filteredSkills.map(skill => (
                    <button
                      key={skill}
                      onClick={() => {
                        toggleSkill(skill)
                        setSearchQuery('')
                      }}
                      className="w-full text-left px-3 py-2 rounded-md hover:bg-muted transition-colors text-sm"
                    >
                      {skill}
                    </button>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Category Tabs */}
          <div className="flex gap-2 flex-wrap">
            {skillCategories.map(category => (
              <Button
                key={category.name}
                variant={activeCategory === category.name ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(category.name)}
                className={activeCategory === category.name ? 'bg-primary text-primary-foreground' : ''}
              >
                {category.name}
              </Button>
            ))}
          </div>

          {/* Skills Grid */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">{activeCategory} Skills</CardTitle>
              <CardDescription>Click to select skills you have</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {categorySkills.map(skill => {
                  const isSelected = selectedSkills.includes(skill)
                  const isCore = jobRole?.coreSkills?.includes(skill)
                  const isBonus = jobRole?.bonusSkills?.includes(skill)

                  return (
                    <Badge
                      key={skill}
                      variant={isSelected ? 'default' : 'outline'}
                      className={`cursor-pointer transition-all ${isSelected
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : isCore
                          ? 'border-primary/50 text-primary hover:bg-primary/10'
                          : isBonus
                            ? 'border-accent/50 text-accent hover:bg-accent/10'
                            : 'hover:bg-muted'
                        }`}
                      onClick={() => toggleSkill(skill)}
                    >
                      {isSelected && <Check className="w-3 h-3 mr-1" />}
                      {skill}
                      {isCore && !isSelected && <span className="ml-1 text-xs">*</span>}
                    </Badge>
                  )
                })}
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                <span className="text-primary">* Required for target role</span>
              </p>
            </CardContent>
          </Card>


        </div>

        {/* Selected Skills Summary */}
        <div className="space-y-6">
          <Card className="border-border/50 sticky top-24">
            <CardHeader>
              <CardTitle className="text-lg flex items-center justify-between">
                Your Skills
                <Badge variant="secondary">{selectedSkills.length}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedSkills.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No skills selected yet. Click on skills to add them.
                </p>
              ) : (
                <ScrollArea className="h-[200px]">
                  <div className="flex flex-wrap gap-2">
                    {selectedSkills.map(skill => (
                      <Badge
                        key={skill}
                        variant="secondary"
                        className="gap-1 cursor-pointer hover:bg-destructive/20"
                        onClick={() => toggleSkill(skill)}
                      >
                        {skill}
                        <X className="w-3 h-3" />
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              )}

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Core skills matched</span>
                  <span className="font-medium text-primary">
                    {matchedCoreSkills.length}/{jobRole?.coreSkills?.length || 0}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Bonus skills matched</span>
                  <span className="font-medium text-accent">
                    {matchedBonusSkills.length}/{jobRole?.bonusSkills?.length || 0}
                  </span>
                </div>
              </div>

              {selectedSkills.length < 3 && (
                <div className="flex items-start gap-2 p-3 rounded-lg bg-warning/10 border border-warning/20">
                  <AlertCircle className="w-4 h-4 text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-xs text-warning">
                    Select at least 3 skills for a meaningful analysis
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleBack}
          className="gap-2 bg-transparent"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          size="lg"
          onClick={handleContinue}
          disabled={selectedSkills.length < 1 || isSaving}
          className="gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
        >
          {isSaving ? 'Saving...' : 'Analyze My Skills'}
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
