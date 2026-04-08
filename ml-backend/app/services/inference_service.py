from app.pipelines.pipeline import run_pipeline
from app.schemas.request import AnalyzeRequest


def run_analysis(payload: AnalyzeRequest):
    """Run career readiness analysis with all features.
    
    Supports:
    - Role-based analysis (role_id + level)
    - Custom skill list analysis (backward compatible)
    - Resume text skill extraction
    """
    return run_pipeline(
        candidate_skills=payload.skills,
        role_skills=payload.target_role_skills,
        experience_years=payload.experience_years,
        role_id=payload.role_id,
        level=payload.level,
        resume_text=payload.resume_text,
    )
