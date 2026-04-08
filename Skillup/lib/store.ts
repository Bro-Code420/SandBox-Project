'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { 
  JobRoleSelection, 
  UserSkills, 
  AnalysisResult, 
  Roadmap, 
  RoleLevel 
} from './types'

interface UserState {
  isGuest: boolean
  userId: string | null
  email: string | null
}

interface OnboardingState {
  jobRole: Partial<JobRoleSelection> | null
  userSkills: string[]
}

interface AnalysisState {
  currentAnalysis: AnalysisResult | null
  analysisHistory: AnalysisResult[]
  currentRoadmap: Roadmap | null
}

interface AppState extends UserState, OnboardingState, AnalysisState {
  // User actions
  setUser: (userId: string, email: string) => void
  setGuest: () => void
  logout: () => void
  
  // Onboarding actions
  setJobRole: (role: Partial<JobRoleSelection>) => void
  setUserSkills: (skills: string[]) => void
  clearOnboarding: () => void
  
  // Analysis actions
  setAnalysisResult: (result: AnalysisResult) => void
  setRoadmap: (roadmap: Roadmap) => void
  clearCurrentAnalysis: () => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      isGuest: false,
      userId: null,
      email: null,
      jobRole: null,
      userSkills: [],
      currentAnalysis: null,
      analysisHistory: [],
      currentRoadmap: null,

      // User actions
      setUser: (userId, email) => set({ userId, email, isGuest: false }),
      setGuest: () => set({ 
        userId: `guest-${Date.now()}`, 
        email: null, 
        isGuest: true 
      }),
      logout: () => set({
        isGuest: false,
        userId: null,
        email: null,
        jobRole: null,
        userSkills: [],
        currentAnalysis: null,
        currentRoadmap: null,
      }),

      // Onboarding actions
      setJobRole: (role) => set({ jobRole: role }),
      setUserSkills: (skills) => set({ userSkills: skills }),
      clearOnboarding: () => set({ jobRole: null, userSkills: [] }),

      // Analysis actions
      setAnalysisResult: (result) => set((state) => ({ 
        currentAnalysis: result,
        analysisHistory: [result, ...state.analysisHistory].slice(0, 10),
      })),
      setRoadmap: (roadmap) => set({ currentRoadmap: roadmap }),
      clearCurrentAnalysis: () => set({ 
        currentAnalysis: null, 
        currentRoadmap: null 
      }),
    }),
    {
      name: 'career-analyzer-storage',
    }
  )
)

// Analysis helper functions
export function calculateReadinessScore(
  userSkills: string[],
  coreSkills: string[],
  bonusSkills: string[]
): { score: number; matchedCore: string[]; matchedBonus: string[]; missingCore: string[]; missingBonus: string[] } {
  const normalizedUserSkills = userSkills.map(s => s.toLowerCase())
  
  const matchedCore = coreSkills.filter(skill => 
    normalizedUserSkills.includes(skill.toLowerCase())
  )
  const missingCore = coreSkills.filter(skill => 
    !normalizedUserSkills.includes(skill.toLowerCase())
  )
  const matchedBonus = bonusSkills.filter(skill => 
    normalizedUserSkills.includes(skill.toLowerCase())
  )
  const missingBonus = bonusSkills.filter(skill => 
    !normalizedUserSkills.includes(skill.toLowerCase())
  )

  // Core skills are worth 80% of the score, bonus skills are worth 20%
  const coreScore = coreSkills.length > 0 
    ? (matchedCore.length / coreSkills.length) * 80 
    : 0
  const bonusScore = bonusSkills.length > 0 
    ? (matchedBonus.length / bonusSkills.length) * 20 
    : 0
  
  const totalScore = Math.round(coreScore + bonusScore)

  return {
    score: totalScore,
    matchedCore,
    matchedBonus,
    missingCore,
    missingBonus,
  }
}

export function getReadinessStatus(score: number): 'ready' | 'almost' | 'needs_upskilling' {
  if (score >= 80) return 'ready'
  if (score >= 60) return 'almost'
  return 'needs_upskilling'
}

export function calculateResumeFitScore(
  matchedSkills: number,
  totalRequiredSkills: number
): number {
  if (totalRequiredSkills === 0) return 0
  return Math.round((matchedSkills / totalRequiredSkills) * 100)
}
