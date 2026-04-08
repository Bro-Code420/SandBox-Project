from pydantic import BaseModel
from typing import List, Dict, Any, Optional


class SkillGap(BaseModel):
    """A missing skill with priority ranking."""
    skill: str
    priority: str  # "core", "secondary", "bonus"
    weight: float  # Priority weight (1.0, 0.6, 0.3)
    rank: int  # Learning order rank


class LearningResource(BaseModel):
    """A recommended learning resource."""
    type: str  # "course" or "youtube"
    title: str
    provider: Optional[str] = None
    channel: Optional[str] = None
    url: str
    difficulty: str
    duration_hours: float


class SkillRecommendation(BaseModel):
    """Skill with associated learning resources."""
    skill: str
    resources: List[LearningResource]


class RoadmapWeek(BaseModel):
    """A week in the learning roadmap."""
    week: int
    skills: List[str]
    estimated_hours: float
    focus: str


class SkillAnalysis(BaseModel):
    """Detailed skill analysis."""
    matched_skills: List[str]
    matched_core: List[str]
    matched_secondary: List[str]
    matched_bonus: List[str]
    missing_skills: List[SkillGap]
    match_percentage: float
    weighted_score: float


class ReadinessExplanation(BaseModel):
    """Explainable AI panel showing score factors."""
    core_coverage: float  # % of core skills matched
    secondary_coverage: float
    bonus_coverage: float
    experience_factor: float
    factors: List[str]  # Human-readable explanations


class AnalyzeResponse(BaseModel):
    """Complete career readiness analysis response."""
    # Basic readiness info
    readiness_label: str  # "Industry Ready", "Almost Ready", "Needs Upskilling"
    readiness_score: float  # 0.0 - 1.0
    
    # Role info (if role-based analysis)
    role_title: Optional[str] = None
    role_level: Optional[str] = None
    
    # Detailed skill analysis
    skill_analysis: SkillAnalysis
    
    # Explainable AI
    explanation: ReadinessExplanation
    
    # Missing skills (backward compatible)
    missing_skills: List[SkillGap]
    
    # Recommendations
    recommendations: List[SkillRecommendation]
    
    # 30-day roadmap
    roadmap: List[RoadmapWeek]
    
    # Extracted skills (if resume was provided)
    extracted_skills: Optional[List[str]] = None
