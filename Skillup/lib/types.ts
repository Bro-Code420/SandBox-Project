export type RoleLevel = 'intern' | 'junior' | 'mid' | 'senior'
export type ReadinessStatus = 'ready' | 'almost' | 'needs_upskilling'
export type EmploymentType = 'full-time' | 'part-time' | 'contract' | 'freelance'

export interface UserProfile {
  userId: string
  email: string
  createdAt: number
}

export interface JobRoleSelection {
  userId: string
  domain: string
  roleLevel: RoleLevel
  experienceRange: string
  employmentType: EmploymentType
  responsibilities: string[]
  coreSkills: string[]
  bonusSkills: string[]
}

export interface UserSkills {
  userId: string
  skills: string[]
}

export interface ScoreBreakdown {
  skill: string
  impact: number
  status: 'matched' | 'missing' | 'partial'
}

export interface AnalysisResult {
  id: string
  userId: string
  roleSnapshot: {
    domain: string
    roleLevel: RoleLevel
    title: string
  }
  readinessScore: number
  readinessStatus: ReadinessStatus
  matchedSkills: string[]
  missingSkills: string[]
  resumeFitScore: number
  scoreBreakdown: ScoreBreakdown[]
  explanation?: {
    factors: string[]
    coreCoverage: number
    secondaryCoverage: number
    bonusCoverage: number
    experienceFactor: number
  }
  resumeText?: string
  createdAt: number
}

export interface WeekPlan {
  weekNumber: number
  focusSkill: string
  courses: {
    title: string
    platform: string
    url: string
    duration: string
    reason?: string
  }[]
  youtubePlaylists: {
    title: string
    channel: string
    url: string
    videos: number
    reason?: string
  }[]
}

export interface Roadmap {
  id: string
  userId: string
  analysisId: string
  weeks: WeekPlan[]
}

export interface JobDomain {
  id: string
  name: string
  icon: string
  roles: {
    intern: RoleConfig
    junior: RoleConfig
    mid: RoleConfig
    senior: RoleConfig
  }
}

export interface RoleConfig {
  title: string
  experienceRange: string
  responsibilities: string[]
  coreSkills: string[]
  bonusSkills: string[]
}
