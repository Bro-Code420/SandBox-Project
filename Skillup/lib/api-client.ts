import axios from 'axios';
import { MLAnalyzeRequest, MLAnalyzeResponse } from './backend-types';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_ML_BACKEND_URL || 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
});

export class MLBackendError extends Error {
  constructor(message: string, public status?: number, public data?: any) {
    super(message);
    this.name = 'MLBackendError';
  }
}

/**
 * Map frontend domain IDs to ML backend role IDs
 */
const DOMAIN_MAP: Record<string, string> = {
  'frontend': 'frontend_developer',
  'backend': 'backend_developer',
  'fullstack': 'fullstack_developer',
  'data': 'data_scientist',
  'devops': 'devops_engineer',
};

/**
 * Wrapper for the /analyze endpoint that handles frontend -> backend key mapping
 */
export async function analyzeWithFrontendTypes(data: {
  userId: string;
  skills: string[];
  domain: string;
  roleLevel: 'intern' | 'junior' | 'mid' | 'senior';
  experienceYears: number;
  resumeText: string;
  targetRoleSkills?: string[];
}): Promise<MLAnalyzeResponse> {
  try {
    const requestData: MLAnalyzeRequest = {
      candidate_id: data.userId,
      skills: data.skills,
      resume_text: data.resumeText,
      role_id: DOMAIN_MAP[data.domain] || data.domain,
      level: data.roleLevel,
      experience_years: data.experienceYears,
      target_role_skills: data.targetRoleSkills,
    };

    const response = await api.post<MLAnalyzeResponse>('/inference/analyze', requestData);
    return response.data;
  } catch (error: any) {
    throw new MLBackendError(
      error.response?.data?.detail || 'Failed to connect to ML analysis engine',
      error.response?.status,
      error.response?.data
    );
  }
}

/**
 * Utility to extract years from a range string (e.g. "2-5 years" -> 2)
 */
export function mapLevelToYears(level: string, range: string): number {
  const match = range.match(/\d+/);
  return match ? parseInt(match[0]) : 0;
}

export default api;
