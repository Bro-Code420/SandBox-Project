/**
 * API Client for ML Backend Integration
 */

import type { MLAnalyzeRequest, MLAnalyzeResponse } from './backend-types'

const API_BASE_URL = process.env.NEXT_PUBLIC_ML_BACKEND_URL || 'http://localhost:8000'

export class MLBackendError extends Error {
  constructor(
    message: string,
    public status?: number,
    public details?: any
  ) {
    super(message)
    this.name = 'MLBackendError'
  }
}

/**
 * Check if the ML backend is healthy
 */
export async function checkBackendHealth(): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    return response.ok
  } catch (error) {
    console.error('Backend health check failed:', error)
    return false
  }
}

/**
 * Call ML backend to analyze career readiness
 */
export async function analyzeCareerReadiness(
  request: MLAnalyzeRequest
): Promise<MLAnalyzeResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/inference/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new MLBackendError(
        `Backend API error: ${response.statusText}`,
        response.status,
        errorData
      )
    }

    const data: MLAnalyzeResponse = await response.json()
    return data
  } catch (error) {
    if (error instanceof MLBackendError) {
      throw error
    }
    
    // Network or other errors
    throw new MLBackendError(
      'Failed to connect to ML backend. Please ensure the backend server is running.',
      undefined,
      error
    )
  }
}

/**
 * Map frontend role domain to backend role_id
 * Frontend uses display names like "Frontend Developer"
 * Backend expects snake_case IDs like "frontend_developer"
 */
export function mapDomainToRoleId(domain: string): string {
  // Frontend uses domain IDs like: 'frontend', 'backend', 'fullstack', 'data', 'devops'
  const domainMap: Record<string, string> = {
    // Direct ID mappings (from jobDomains)
    'frontend': 'frontend_developer',
    'backend': 'backend_developer',
    'fullstack': 'fullstack_developer',
    'data': 'data_scientist',
    'devops': 'devops_engineer',
    
    // Display name mappings (fallback)
    'Frontend Developer': 'frontend_developer',
    'frontend-developer': 'frontend_developer',
    'frontend developer': 'frontend_developer',
    'Frontend Development': 'frontend_developer',
    
    'Backend Developer': 'backend_developer',
    'backend-developer': 'backend_developer',
    'backend developer': 'backend_developer',
    'Backend Development': 'backend_developer',
    
    'Full Stack Developer': 'fullstack_developer',
    'fullstack-developer': 'fullstack_developer',
    'full stack developer': 'fullstack_developer',
    'fullstack developer': 'fullstack_developer',
    'Full Stack Development': 'fullstack_developer',
    
    'Data Scientist': 'data_scientist',
    'data-scientist': 'data_scientist',
    'data scientist': 'data_scientist',
    'Data Science': 'data_scientist',
    
    'DevOps Engineer': 'devops_engineer',
    'devops-engineer': 'devops_engineer',
    'devops engineer': 'devops_engineer',
    'DevOps Engineering': 'devops_engineer',
  }

  const normalized = domain.toLowerCase()
  const roleId = domainMap[domain] || domainMap[normalized] || normalized.replace(/\s+/g, '_').replace(/-/g, '_')
  
  return roleId
}

/**
 * Convenience function: Analyze with frontend types
 */
export async function analyzeWithFrontendTypes({
  userId,
  skills,
  domain,
  roleLevel,
  experienceYears = 0,
  resumeText,
}: {
  userId?: string
  skills: string[]
  domain: string
  roleLevel: 'intern' | 'junior' | 'mid' | 'senior'
  experienceYears?: number
  resumeText?: string
}): Promise<MLAnalyzeResponse> {
  const roleId = mapDomainToRoleId(domain)
  
  const request: MLAnalyzeRequest = {
    candidate_id: userId,
    skills,
    role_id: roleId,
    level: roleLevel,
    experience_years: experienceYears,
    resume_text: resumeText,
  }
  
  return analyzeCareerReadiness(request)
}
