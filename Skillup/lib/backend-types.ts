/**
 * TypeScript types matching the ML Backend Pydantic schemas
 * Based on ml-backend/app/schemas/request.py and response.py
 */

// ============= Request Types =============

export interface MLAnalyzeRequest {
  candidate_id?: string | null
  skills: string[]
  resume_text?: string | null
  role_id?: string | null  // e.g., "frontend_developer", "data_scientist"
  level?: 'intern' | 'junior' | 'mid' | 'senior' | null
  target_role_skills?: string[]
  experience_years?: number
}

// ============= Response Types =============

export interface MLSkillGap {
  skill: string
  priority: 'core' | 'secondary' | 'bonus'
  weight: number  // 1.0, 0.6, 0.3
  rank: number
  score_impact: number
  market_importance: number
  learning_time_days: number
}

export interface MLLearningResource {
  type: 'course' | 'youtube'
  title: string
  provider?: string | null
  channel?: string | null
  url: string
  difficulty: string
  duration_hours: number
  reason?: string | null
}

export interface MLSkillRecommendation {
  skill: string
  resources: MLLearningResource[]
}

export interface MLRoadmapWeek {
  week: number
  skills: string[]
  estimated_hours: number
  focus: string
}

export interface MLSkillAnalysis {
  matched_skills: string[]
  matched_core: string[]
  matched_secondary: string[]
  matched_bonus: string[]
  missing_skills: MLSkillGap[]
  match_percentage: number
  weighted_score: number
}

export interface MLReadinessExplanation {
  core_coverage: number
  secondary_coverage: number
  bonus_coverage: number
  experience_factor: number
  factors: string[]
}

export interface MLAnalyzeResponse {
  readiness_label: string  // "Industry Ready", "Almost Ready", "Needs Upskilling"
  readiness_score: number  // 0.0 - 1.0
  potential_score: number
  confidence_score: number
  role_title?: string | null
  role_level?: string | null
  skill_analysis: MLSkillAnalysis
  explanation: MLReadinessExplanation
  missing_skills: MLSkillGap[]
  recommendations: MLSkillRecommendation[]
  roadmap: MLRoadmapWeek[]
  extracted_skills?: string[] | null
}

// ============= Mappers: Backend → Frontend Types =============

import type { AnalysisResult, WeekPlan, ScoreBreakdown, RoleLevel, ReadinessStatus } from './types'

/**
 * Map backend readiness label to frontend status
 */
export function mapReadinessLabel(label: string): ReadinessStatus {
  const lower = label.toLowerCase()
  if (lower.includes('industry ready')) return 'ready'
  if (lower.includes('almost')) return 'almost'
  return 'needs_upskilling'
}

/**
 * Map backend response to frontend AnalysisResult
 */
export function mapBackendToAnalysisResult(
  response: MLAnalyzeResponse,
  userId: string,
  domain: string,
  roleLevel: RoleLevel,
  resumeText?: string
): AnalysisResult {
  const readinessScore = Math.round(response.readiness_score * 100)

  // Generate score breakdown from skill analysis
  const scoreBreakdown: ScoreBreakdown[] = []

  // Add matched skills
  response.skill_analysis.matched_core.forEach(skill => {
    scoreBreakdown.push({
      skill,
      impact: Math.round(80 / Math.max(response.skill_analysis.matched_core.length + response.missing_skills.filter(s => s.priority === 'core').length, 1)),
      status: 'matched'
    })
  })

  response.skill_analysis.matched_secondary.forEach(skill => {
    scoreBreakdown.push({
      skill,
      impact: Math.round(15 / Math.max(response.skill_analysis.matched_secondary.length + response.missing_skills.filter(s => s.priority === 'secondary').length, 1)),
      status: 'matched'
    })
  })

  response.skill_analysis.matched_bonus.forEach(skill => {
    scoreBreakdown.push({
      skill,
      impact: Math.round(5 / Math.max(response.skill_analysis.matched_bonus.length + response.missing_skills.filter(s => s.priority === 'bonus').length, 1)),
      status: 'matched'
    })
  })

  // Add missing skills with Score ROI
  response.missing_skills.forEach(gap => {
    const impactBase = gap.priority === 'core' ? 80 : gap.priority === 'secondary' ? 15 : 5
    scoreBreakdown.push({
      skill: gap.skill,
      impact: -Math.round(impactBase / Math.max(response.missing_skills.filter(s => s.priority === gap.priority).length, 1)),
      status: 'missing',
      scoreBoost: Math.round((gap.score_impact || 0) * 100),
      marketImportance: gap.market_importance || 0.5,
    })
  })

  return {
    id: `analysis-${Date.now()}`,
    userId,
    roleSnapshot: {
      domain,
      roleLevel,
      title: response.role_title || `${roleLevel} ${domain}`,
    },
    readinessScore,
    potentialScore: Math.round((response.potential_score || 0) * 100),
    confidenceScore: Math.round((response.confidence_score || 0.8) * 100),
    readinessStatus: mapReadinessLabel(response.readiness_label || 'Needs Upskilling'),
    matchedSkills: response.skill_analysis.matched_skills,
    missingSkills: response.missing_skills.map(g => g.skill),
    resumeFitScore: Math.round(response.skill_analysis.match_percentage * 100),
    scoreBreakdown,
    explanation: {
      factors: response.explanation.factors,
      coreCoverage: response.explanation.core_coverage * 100,
      secondaryCoverage: response.explanation.secondary_coverage * 100,
      bonusCoverage: response.explanation.bonus_coverage * 100,
      experienceFactor: response.explanation.experience_factor * 100,
    },
    resumeText,
    createdAt: Date.now(),
  }
}

/**
 * Map backend roadmap to frontend WeekPlan
 * Preserves all skills per week for resource matching
 */
export function mapBackendToRoadmap(roadmap: MLRoadmapWeek[]): (WeekPlan & { _allSkills?: string[] })[] {
  return roadmap.map(week => ({
    weekNumber: week.week,
    focusSkill: week.focus || week.skills[0] || 'Review & Practice',
    _allSkills: week.skills,  // carry through for enrichment
    courses: [],
    youtubePlaylists: [],
  }))
}

/**
 * Map backend recommendations to frontend format
 * Merges recommendations for ALL skills in each week (not just focusSkill)
 */
export function enrichRoadmapWithRecommendations(
  weeks: (WeekPlan & { _allSkills?: string[] })[],
  recommendations: MLSkillRecommendation[]
): WeekPlan[] {
  const recMap = new Map(recommendations.map(r => [r.skill.toLowerCase(), r]))

  return weeks.map(week => {
    const allSkills = week._allSkills || [week.focusSkill]

    const courses: WeekPlan['courses'] = []
    const youtubePlaylists: WeekPlan['youtubePlaylists'] = []

    for (const skill of allSkills) {
      const rec = recMap.get(skill.toLowerCase())
      if (!rec) continue

      rec.resources
        .filter(r => r.type === 'course')
        .forEach(r => courses.push({
          title: r.title,
          platform: r.provider || 'Udemy',
          url: r.url || `https://www.udemy.com/courses/search/?q=${encodeURIComponent(r.title)}`,
          duration: `${r.duration_hours || 10} hours`,
          reason: r.reason || undefined,
        }))

      rec.resources
        .filter(r => r.type === 'youtube')
        .forEach(r => youtubePlaylists.push({
          title: r.title,
          channel: r.channel || 'YouTube',
          url: r.url || `https://www.youtube.com/results?search_query=${encodeURIComponent(r.title)}`,
          videos: Math.ceil((r.duration_hours || 1) * 2),
          reason: r.reason || undefined,
        }))
    }

    // Strip internal _allSkills field, return clean WeekPlan
    const { _allSkills, ...cleanWeek } = week
    return { ...cleanWeek, courses, youtubePlaylists } as WeekPlan
  })
}
