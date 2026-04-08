# Next.js Integration Guide

This guide provides detailed instructions for integrating the Career Readiness ML Backend API with a Next.js application.

## Table of Contents

1. [Setup](#setup)
2. [Environment Configuration](#environment-configuration)
3. [TypeScript Types](#typescript-types)
4. [API Client](#api-client)
5. [Server Actions (App Router)](#server-actions-app-router)
6. [API Routes (Pages Router)](#api-routes-pages-router)
7. [React Hooks](#react-hooks)
8. [Component Examples](#component-examples)
9. [Error Handling](#error-handling)
10. [Best Practices](#best-practices)

---

## Setup

### Prerequisites

- Next.js 13+ (App Router recommended)
- ML Backend running on `http://localhost:8000`

### Install Dependencies

```bash
npm install zod
# or
yarn add zod
```

---

## Environment Configuration

Create a `.env.local` file in your Next.js project root:

```env
# .env.local
ML_BACKEND_URL=http://localhost:8000
```

For production, update this to your deployed ML backend URL.

---

## TypeScript Types

Create `types/career-readiness.ts`:

```typescript
// types/career-readiness.ts

// ============== Request Types ==============

export type ExperienceLevel = "intern" | "junior" | "mid" | "senior";

export type RoleId =
  | "frontend_developer"
  | "backend_developer"
  | "fullstack_developer"
  | "data_scientist"
  | "devops_engineer";

export interface AnalyzeRequest {
  /** Optional candidate identifier */
  candidate_id?: string;
  /** List of candidate's skills */
  skills?: string[];
  /** Resume text for automatic skill extraction */
  resume_text?: string;
  /** Target role identifier */
  role_id?: RoleId;
  /** Experience level */
  level?: ExperienceLevel;
  /** Custom list of required skills (alternative to role_id) */
  target_role_skills?: string[];
  /** Years of experience */
  experience_years?: number;
}

// ============== Response Types ==============

export interface SkillGap {
  skill: string;
  priority: "core" | "secondary" | "bonus";
  weight: number;
  rank: number;
  ml_score?: number;
}

export interface LearningResource {
  type: "course" | "youtube";
  title: string;
  provider?: string;
  channel?: string;
  url: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  duration_hours: number;
}

export interface SkillRecommendation {
  skill: string;
  resources: LearningResource[];
}

export interface RoadmapWeek {
  week: number;
  skills: string[];
  estimated_hours: number;
  focus: string;
}

export interface SkillAnalysis {
  matched_skills: string[];
  matched_core: string[];
  matched_secondary: string[];
  matched_bonus: string[];
  missing_skills: SkillGap[];
  match_percentage: number;
  weighted_score: number;
}

export interface ReadinessExplanation {
  core_coverage: number;
  secondary_coverage: number;
  bonus_coverage: number;
  experience_factor: number;
  factors: string[];
}

export interface AnalyzeResponse {
  readiness_label: "Industry Ready" | "Almost Ready" | "Needs Upskilling";
  readiness_score: number;
  role_title: string | null;
  role_level: string | null;
  skill_analysis: SkillAnalysis;
  explanation: ReadinessExplanation;
  missing_skills: SkillGap[];
  recommendations: SkillRecommendation[];
  roadmap: RoadmapWeek[];
  extracted_skills: string[] | null;
}

// ============== API Error ==============

export interface APIError {
  detail: string;
}
```

---

## API Client

Create `lib/ml-api.ts`:

```typescript
// lib/ml-api.ts
import { AnalyzeRequest, AnalyzeResponse, APIError } from "@/types/career-readiness";

const ML_BACKEND_URL = process.env.ML_BACKEND_URL || "http://localhost:8000";

export class MLApiError extends Error {
  constructor(
    public status: number,
    public detail: string
  ) {
    super(detail);
    this.name = "MLApiError";
  }
}

/**
 * Analyze career readiness against a target role
 */
export async function analyzeCareerReadiness(
  request: AnalyzeRequest
): Promise<AnalyzeResponse> {
  const response = await fetch(`${ML_BACKEND_URL}/inference/analyze`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    const error: APIError = await response.json();
    throw new MLApiError(response.status, error.detail);
  }

  return response.json();
}

/**
 * Analyze with role-based requirements (recommended)
 */
export async function analyzeByRole(
  skills: string[],
  roleId: string,
  level: string,
  experienceYears: number = 0,
  resumeText?: string
): Promise<AnalyzeResponse> {
  return analyzeCareerReadiness({
    skills,
    role_id: roleId as any,
    level: level as any,
    experience_years: experienceYears,
    resume_text: resumeText,
  });
}

/**
 * Analyze with custom skill requirements
 */
export async function analyzeByCustomSkills(
  candidateSkills: string[],
  targetSkills: string[],
  experienceYears: number = 0
): Promise<AnalyzeResponse> {
  return analyzeCareerReadiness({
    skills: candidateSkills,
    target_role_skills: targetSkills,
    experience_years: experienceYears,
  });
}

/**
 * Extract skills from resume and analyze
 */
export async function analyzeResume(
  resumeText: string,
  roleId: string,
  level: string,
  experienceYears: number = 0
): Promise<AnalyzeResponse> {
  return analyzeCareerReadiness({
    resume_text: resumeText,
    role_id: roleId as any,
    level: level as any,
    experience_years: experienceYears,
  });
}
```

---

## Server Actions (App Router)

Create `app/actions/career-analysis.ts`:

```typescript
// app/actions/career-analysis.ts
"use server";

import { analyzeCareerReadiness, MLApiError } from "@/lib/ml-api";
import { AnalyzeRequest, AnalyzeResponse } from "@/types/career-readiness";

export type AnalysisResult =
  | { success: true; data: AnalyzeResponse }
  | { success: false; error: string };

export async function analyzeCareerAction(
  request: AnalyzeRequest
): Promise<AnalysisResult> {
  try {
    const data = await analyzeCareerReadiness(request);
    return { success: true, data };
  } catch (error) {
    if (error instanceof MLApiError) {
      return { success: false, error: error.detail };
    }
    return { success: false, error: "Failed to analyze career readiness" };
  }
}

export async function analyzeResumeAction(
  formData: FormData
): Promise<AnalysisResult> {
  const resumeText = formData.get("resumeText") as string;
  const roleId = formData.get("roleId") as string;
  const level = formData.get("level") as string;
  const experienceYears = parseFloat(formData.get("experienceYears") as string) || 0;
  const skills = formData.getAll("skills") as string[];

  try {
    const data = await analyzeCareerReadiness({
      skills: skills.length > 0 ? skills : undefined,
      resume_text: resumeText || undefined,
      role_id: roleId as any,
      level: level as any,
      experience_years: experienceYears,
    });
    return { success: true, data };
  } catch (error) {
    if (error instanceof MLApiError) {
      return { success: false, error: error.detail };
    }
    return { success: false, error: "Analysis failed. Please try again." };
  }
}
```

---

## API Routes (Pages Router)

If using Pages Router, create `pages/api/analyze.ts`:

```typescript
// pages/api/analyze.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { analyzeCareerReadiness, MLApiError } from "@/lib/ml-api";
import { AnalyzeResponse, APIError } from "@/types/career-readiness";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalyzeResponse | APIError>
) {
  if (req.method !== "POST") {
    return res.status(405).json({ detail: "Method not allowed" });
  }

  try {
    const result = await analyzeCareerReadiness(req.body);
    return res.status(200).json(result);
  } catch (error) {
    if (error instanceof MLApiError) {
      return res.status(error.status).json({ detail: error.detail });
    }
    return res.status(500).json({ detail: "Internal server error" });
  }
}
```

---

## React Hooks

Create `hooks/useCareerAnalysis.ts`:

```typescript
// hooks/useCareerAnalysis.ts
"use client";

import { useState, useCallback } from "react";
import { AnalyzeRequest, AnalyzeResponse } from "@/types/career-readiness";

interface UseCareerAnalysisOptions {
  onSuccess?: (data: AnalyzeResponse) => void;
  onError?: (error: string) => void;
}

interface UseCareerAnalysisReturn {
  analyze: (request: AnalyzeRequest) => Promise<void>;
  data: AnalyzeResponse | null;
  isLoading: boolean;
  error: string | null;
  reset: () => void;
}

export function useCareerAnalysis(
  options: UseCareerAnalysisOptions = {}
): UseCareerAnalysisReturn {
  const [data, setData] = useState<AnalyzeResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = useCallback(
    async (request: AnalyzeRequest) => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/analyze", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(request),
        });

        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.detail || "Analysis failed");
        }

        const result: AnalyzeResponse = await response.json();
        setData(result);
        options.onSuccess?.(result);
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unknown error";
        setError(message);
        options.onError?.(message);
      } finally {
        setIsLoading(false);
      }
    },
    [options]
  );

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  return { analyze, data, isLoading, error, reset };
}
```

---

## Component Examples

### Career Analysis Form

```tsx
// components/CareerAnalysisForm.tsx
"use client";

import { useState } from "react";
import { useCareerAnalysis } from "@/hooks/useCareerAnalysis";
import { RoleId, ExperienceLevel } from "@/types/career-readiness";

const ROLES: { id: RoleId; label: string }[] = [
  { id: "frontend_developer", label: "Frontend Developer" },
  { id: "backend_developer", label: "Backend Developer" },
  { id: "fullstack_developer", label: "Full Stack Developer" },
  { id: "data_scientist", label: "Data Scientist" },
  { id: "devops_engineer", label: "DevOps Engineer" },
];

const LEVELS: { id: ExperienceLevel; label: string }[] = [
  { id: "intern", label: "Intern" },
  { id: "junior", label: "Junior" },
  { id: "mid", label: "Mid-Level" },
  { id: "senior", label: "Senior" },
];

export function CareerAnalysisForm() {
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState("");
  const [roleId, setRoleId] = useState<RoleId>("frontend_developer");
  const [level, setLevel] = useState<ExperienceLevel>("junior");
  const [experience, setExperience] = useState(0);
  const [resumeText, setResumeText] = useState("");

  const { analyze, data, isLoading, error } = useCareerAnalysis();

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim().toLowerCase())) {
      setSkills([...skills, skillInput.trim().toLowerCase()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await analyze({
      skills: skills.length > 0 ? skills : undefined,
      resume_text: resumeText || undefined,
      role_id: roleId,
      level,
      experience_years: experience,
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Role Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Target Role</label>
          <select
            value={roleId}
            onChange={(e) => setRoleId(e.target.value as RoleId)}
            className="w-full p-2 border rounded"
          >
            {ROLES.map((role) => (
              <option key={role.id} value={role.id}>
                {role.label}
              </option>
            ))}
          </select>
        </div>

        {/* Level Selection */}
        <div>
          <label className="block text-sm font-medium mb-2">Experience Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as ExperienceLevel)}
            className="w-full p-2 border rounded"
          >
            {LEVELS.map((l) => (
              <option key={l.id} value={l.id}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Experience Years */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Years of Experience: {experience}
          </label>
          <input
            type="range"
            min="0"
            max="15"
            step="0.5"
            value={experience}
            onChange={(e) => setExperience(parseFloat(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Skills Input */}
        <div>
          <label className="block text-sm font-medium mb-2">Your Skills</label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              value={skillInput}
              onChange={(e) => setSkillInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
              placeholder="Add a skill..."
              className="flex-1 p-2 border rounded"
            />
            <button
              type="button"
              onClick={addSkill}
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="px-3 py-1 bg-gray-200 rounded-full text-sm flex items-center gap-2"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="text-gray-500 hover:text-red-500"
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Resume Text */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Resume Text (Optional)
          </label>
          <textarea
            value={resumeText}
            onChange={(e) => setResumeText(e.target.value)}
            placeholder="Paste your resume text to auto-extract skills..."
            rows={4}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-green-600 text-white rounded font-medium disabled:opacity-50"
        >
          {isLoading ? "Analyzing..." : "Analyze Career Readiness"}
        </button>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mt-4 p-4 bg-red-100 text-red-700 rounded">{error}</div>
      )}

      {/* Results Display */}
      {data && <CareerAnalysisResults data={data} />}
    </div>
  );
}
```

### Results Display Component

```tsx
// components/CareerAnalysisResults.tsx
import { AnalyzeResponse } from "@/types/career-readiness";

interface Props {
  data: AnalyzeResponse;
}

export function CareerAnalysisResults({ data }: Props) {
  const scorePercentage = Math.round(data.readiness_score * 100);
  
  const getScoreColor = () => {
    if (scorePercentage >= 80) return "text-green-600";
    if (scorePercentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  return (
    <div className="mt-8 space-y-6">
      {/* Readiness Score */}
      <div className="text-center p-6 bg-gray-50 rounded-lg">
        <h2 className="text-2xl font-bold mb-2">{data.readiness_label}</h2>
        <div className={`text-5xl font-bold ${getScoreColor()}`}>
          {scorePercentage}%
        </div>
        {data.role_title && (
          <p className="text-gray-600 mt-2">
            {data.role_title} ({data.role_level})
          </p>
        )}
      </div>

      {/* Explanation Factors */}
      <div className="p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Analysis Factors</h3>
        <ul className="list-disc list-inside space-y-1">
          {data.explanation.factors.map((factor, i) => (
            <li key={i} className="text-sm">{factor}</li>
          ))}
        </ul>
      </div>

      {/* Matched Skills */}
      <div>
        <h3 className="font-semibold mb-2">Matched Skills</h3>
        <div className="flex flex-wrap gap-2">
          {data.skill_analysis.matched_core.map((skill) => (
            <span key={skill} className="px-2 py-1 bg-green-100 text-green-800 rounded text-sm">
              {skill} (core)
            </span>
          ))}
          {data.skill_analysis.matched_secondary.map((skill) => (
            <span key={skill} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm">
              {skill}
            </span>
          ))}
          {data.skill_analysis.matched_bonus.map((skill) => (
            <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm">
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* Missing Skills */}
      {data.missing_skills.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Skills to Learn (Prioritized)</h3>
          <div className="space-y-2">
            {data.missing_skills.slice(0, 5).map((gap) => (
              <div
                key={gap.skill}
                className="flex items-center justify-between p-2 bg-gray-50 rounded"
              >
                <span>
                  <span className="font-medium">{gap.rank}.</span> {gap.skill}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  gap.priority === "core" ? "bg-red-100 text-red-800" :
                  gap.priority === "secondary" ? "bg-yellow-100 text-yellow-800" :
                  "bg-gray-100 text-gray-800"
                }`}>
                  {gap.priority}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Learning Roadmap */}
      <div>
        <h3 className="font-semibold mb-2">30-Day Learning Roadmap</h3>
        <div className="space-y-3">
          {data.roadmap.map((week) => (
            <div key={week.week} className="p-3 border rounded">
              <div className="flex justify-between items-center mb-2">
                <span className="font-medium">Week {week.week}</span>
                <span className="text-sm text-gray-500">
                  ~{week.estimated_hours}h
                </span>
              </div>
              <div className="flex flex-wrap gap-1">
                {week.skills.map((skill) => (
                  <span key={skill} className="px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recommendations */}
      {data.recommendations.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Recommended Resources</h3>
          <div className="space-y-4">
            {data.recommendations.slice(0, 3).map((rec) => (
              <div key={rec.skill} className="p-3 border rounded">
                <h4 className="font-medium mb-2">{rec.skill}</h4>
                <div className="space-y-2">
                  {rec.resources.map((resource, i) => (
                    <a
                      key={i}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-2 bg-gray-50 rounded hover:bg-gray-100"
                    >
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded ${
                          resource.type === "course" ? "bg-blue-100" : "bg-red-100"
                        }`}>
                          {resource.type}
                        </span>
                        <span className="text-sm font-medium">{resource.title}</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {resource.provider || resource.channel} • {resource.duration_hours}h • {resource.difficulty}
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Extracted Skills */}
      {data.extracted_skills && data.extracted_skills.length > 0 && (
        <div>
          <h3 className="font-semibold mb-2">Skills Extracted from Resume</h3>
          <div className="flex flex-wrap gap-2">
            {data.extracted_skills.map((skill) => (
              <span key={skill} className="px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-sm">
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
```

---

## Error Handling

### Global Error Boundary

```tsx
// components/ErrorBoundary.tsx
"use client";

import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="p-4 bg-red-50 text-red-700 rounded">
            <h2 className="font-bold">Something went wrong</h2>
            <p>{this.state.error?.message}</p>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
```

### API Error Handler Utility

```typescript
// lib/error-handler.ts
import { MLApiError } from "./ml-api";

export function getErrorMessage(error: unknown): string {
  if (error instanceof MLApiError) {
    switch (error.status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 404:
        return "The requested resource was not found.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return error.detail;
    }
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  return "An unexpected error occurred";
}
```

---

## Best Practices

### 1. Use Server-Side Calls When Possible

```typescript
// app/analyze/page.tsx
import { analyzeCareerReadiness } from "@/lib/ml-api";

export default async function AnalyzePage({
  searchParams,
}: {
  searchParams: { roleId?: string; level?: string };
}) {
  // Server-side fetch - no CORS issues
  const data = await analyzeCareerReadiness({
    skills: ["python", "react"],
    role_id: searchParams.roleId as any,
    level: searchParams.level as any,
  });

  return <CareerAnalysisResults data={data} />;
}
```

### 2. Add Loading States

```tsx
// Using Suspense
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={<AnalysisSkeleton />}>
      <CareerAnalysis />
    </Suspense>
  );
}
```

### 3. Cache Results Appropriately

```typescript
// lib/ml-api.ts
export async function analyzeCareerReadiness(
  request: AnalyzeRequest
): Promise<AnalyzeResponse> {
  const response = await fetch(`${ML_BACKEND_URL}/inference/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(request),
    // Cache for 5 minutes for same requests
    next: { revalidate: 300 },
  });
  // ...
}
```

### 4. Validate Input with Zod

```typescript
// lib/validation.ts
import { z } from "zod";

export const analyzeRequestSchema = z.object({
  skills: z.array(z.string()).optional(),
  resume_text: z.string().optional(),
  role_id: z.enum([
    "frontend_developer",
    "backend_developer", 
    "fullstack_developer",
    "data_scientist",
    "devops_engineer"
  ]).optional(),
  level: z.enum(["intern", "junior", "mid", "senior"]).optional(),
  experience_years: z.number().min(0).max(50).optional(),
}).refine(
  (data) => data.skills?.length || data.resume_text,
  "Either skills or resume_text must be provided"
);
```

---

## Complete Page Example

```tsx
// app/career-analysis/page.tsx
import { CareerAnalysisForm } from "@/components/CareerAnalysisForm";
import { ErrorBoundary } from "@/components/ErrorBoundary";

export const metadata = {
  title: "Career Readiness Analysis",
  description: "Analyze your skills against target job roles",
};

export default function CareerAnalysisPage() {
  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">
          Career Readiness Analyzer
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Evaluate your skills against your target role and get personalized
          learning recommendations.
        </p>
        <ErrorBoundary>
          <CareerAnalysisForm />
        </ErrorBoundary>
      </div>
    </main>
  );
}
```

---

## CORS Configuration

If calling the ML Backend directly from the browser, configure CORS in the FastAPI backend:

```python
# app/api/main.py
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js dev server
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## Summary

| Integration Method | Use Case |
|--------------------|----------|
| Server Actions | App Router, form submissions |
| API Routes | Pages Router, proxy to ML backend |
| Direct Fetch | Server components, SSR |
| React Hook | Client-side interactions |

For production, always proxy through your Next.js API routes to avoid exposing the ML backend URL to clients.
