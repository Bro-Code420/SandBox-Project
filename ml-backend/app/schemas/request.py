from pydantic import BaseModel
from typing import List, Optional, Literal


class AnalyzeRequest(BaseModel):
    """Request for career readiness analysis.
    
    Supports two modes:
    1. Role-based: Provide role_id and level to use predefined role requirements
    2. Custom: Provide target_role_skills directly (backward compatible)
    """
    candidate_id: Optional[str] = None
    
    # Candidate skills - can be provided directly or extracted from resume
    skills: List[str] = []
    resume_text: Optional[str] = None  # Optional: extract skills from resume
    
    # Role specification (preferred)
    role_id: Optional[str] = None  # e.g., "frontend_developer", "data_scientist"
    level: Optional[Literal["intern", "junior", "mid", "senior"]] = None
    
    # Or direct skill list (backward compatible)
    target_role_skills: List[str] = []
    
    experience_years: float = 0.0
