"""Main analysis pipeline orchestrating all ML features.

This pipeline:
1. Extracts skills from resume (if provided)
2. Gets role requirements (if role-based analysis)
3. Computes weighted skill matching
4. Ranks skill gaps by priority
5. Predicts job readiness with explainability
6. Generates resource recommendations
7. Creates 30-day learning roadmap
"""

from typing import List, Dict, Any, Optional, Tuple
import numpy as np
from app.models.readiness_model import ReadinessModel
from app.services.resume_parser import extract_skills_from_text, merge_skills
from app.services.role_intelligence import RoleIntelligence, get_role_intelligence
from app.services.recommendation_service import get_skill_recommendations, get_learning_roadmap
from app.core.startup import get_model, is_model_loaded
from data.skill_dependencies import topological_sort, SKILL_DEPENDENCIES
from data.role_definitions import SKILL_WEIGHTS


class SkillAnalyzer:
    """Analyzes candidate skills against role requirements with ML-based matching."""
    
    def __init__(self, role_intel: Optional[RoleIntelligence] = None, user_experience: float = 0.0, user_skill_count: int = 0):
        self.role_intel = role_intel
        self.user_experience = user_experience
        self.user_skill_count = user_skill_count
        self._embeddings = get_model("skill_embeddings") if is_model_loaded("skill_embeddings") else None
        self._metadata = get_model("skill_metadata") if is_model_loaded("skill_metadata") else {}
    
    def analyze(
        self,
        candidate_skills: List[str],
        role_skills: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Perform weighted skill analysis with optional embedding-based matching.
        
        Args:
            candidate_skills: Skills the candidate has
            role_skills: Target role skills (used if no role_intel)
            
        Returns:
            Detailed skill analysis with matches, gaps, and scores
        """
        candidate_set = set(s.lower().strip() for s in candidate_skills)
        
        if self.role_intel:
            return self._analyze_with_weights(candidate_set)
        else:
            return self._analyze_simple(candidate_set, role_skills or [])
    
    def _compute_semantic_similarity(self, skill1: str, skill2: str) -> float:
        """Compute semantic similarity between two skills using embeddings."""
        if not self._embeddings:
            return 1.0 if skill1 == skill2 else 0.0
        
        s1 = skill1.lower()
        s2 = skill2.lower()
        
        if s1 not in self._embeddings or s2 not in self._embeddings:
            return 1.0 if s1 == s2 else 0.0
        
        e1 = self._embeddings[s1]
        e2 = self._embeddings[s2]
        
        # Cosine similarity
        similarity = np.dot(e1, e2) / (np.linalg.norm(e1) * np.linalg.norm(e2) + 1e-8)
        return float(similarity)
    
    def _find_best_match(self, skill: str, candidate_set: set, threshold: float = 0.85) -> Optional[str]:
        """Find best matching skill from candidate set using embeddings."""
        if skill.lower() in candidate_set:
            return skill.lower()
        
        # Try semantic matching if embeddings available
        if self._embeddings:
            best_match = None
            best_score = threshold
            for candidate in candidate_set:
                score = self._compute_semantic_similarity(skill, candidate)
                if score > best_score:
                    best_score = score
                    best_match = candidate
            return best_match
        
        return None
    
    def _analyze_with_weights(self, candidate_set: set) -> Dict[str, Any]:
        """Weighted analysis using role intelligence and ML-based matching."""
        core = [s.lower() for s in self.role_intel.core_skills]
        secondary = [s.lower() for s in self.role_intel.secondary_skills]
        bonus = [s.lower() for s in self.role_intel.bonus_skills]
        
        # Match skills (with semantic matching if available)
        matched_core = [s for s in core if self._find_best_match(s, candidate_set)]
        matched_secondary = [s for s in secondary if self._find_best_match(s, candidate_set)]
        matched_bonus = [s for s in bonus if self._find_best_match(s, candidate_set)]
        
        missing_core = [s for s in core if not self._find_best_match(s, candidate_set)]
        missing_secondary = [s for s in secondary if not self._find_best_match(s, candidate_set)]
        missing_bonus = [s for s in bonus if not self._find_best_match(s, candidate_set)]
        
        # Calculate weighted score
        total_weight = (
            len(core) * SKILL_WEIGHTS["core"] +
            len(secondary) * SKILL_WEIGHTS["secondary"] +
            len(bonus) * SKILL_WEIGHTS["bonus"]
        )
        
        matched_weight = (
            len(matched_core) * SKILL_WEIGHTS["core"] +
            len(matched_secondary) * SKILL_WEIGHTS["secondary"] +
            len(matched_bonus) * SKILL_WEIGHTS["bonus"]
        )
        
        weighted_score = matched_weight / total_weight if total_weight > 0 else 0
        
        # Simple match percentage
        all_role_skills = core + secondary + bonus
        match_percentage = len(matched_core + matched_secondary + matched_bonus) / len(all_role_skills) if all_role_skills else 0
        
        # Rank missing skills using ML model or topological sort
        all_missing = missing_core + missing_secondary + missing_bonus
        missing_with_priority = []
        for skill in all_missing:
            if skill in missing_core:
                priority, weight = "core", SKILL_WEIGHTS["core"]
            elif skill in missing_secondary:
                priority, weight = "secondary", SKILL_WEIGHTS["secondary"]
            else:
                priority, weight = "bonus", SKILL_WEIGHTS["bonus"]
            missing_with_priority.append({"skill": skill, "priority": priority, "weight": weight})
        
        missing_skills = self._rank_missing_skills(missing_with_priority)
        
        return {
            "matched_skills": matched_core + matched_secondary + matched_bonus,
            "matched_core": matched_core,
            "matched_secondary": matched_secondary,
            "matched_bonus": matched_bonus,
            "missing_skills": missing_skills,
            "match_percentage": match_percentage,
            "weighted_score": weighted_score,
            "core_coverage": len(matched_core) / len(core) if core else 1.0,
            "secondary_coverage": len(matched_secondary) / len(secondary) if secondary else 1.0,
            "bonus_coverage": len(matched_bonus) / len(bonus) if bonus else 1.0,
        }
    
    def _rank_missing_skills(self, missing_skills: List[Dict]) -> List[Dict]:
        """Rank missing skills using XGBoost model or fallback to dependency order."""
        if not missing_skills:
            return []
        
        # Use trained XGBoost model if available
        if is_model_loaded("gap_ranker"):
            return self._rank_with_model(missing_skills)
        
        # Fallback to dependency-based ranking
        skill_names = [s["skill"] for s in missing_skills]
        sorted_skills = topological_sort(skill_names)
        
        skill_map = {s["skill"]: s for s in missing_skills}
        ranked = []
        for i, skill in enumerate(sorted_skills):
            info = skill_map.get(skill, {"priority": "core", "weight": 1.0})
            ranked.append({
                "skill": skill,
                "priority": info["priority"],
                "weight": info["weight"],
                "rank": i + 1,
            })
        return ranked
    
    def _rank_with_model(self, missing_skills: List[Dict]) -> List[Dict]:
        """Rank skills using trained XGBoost model."""
        model = get_model("gap_ranker")
        
        # Meta: (difficulty 1-5, market_demand 1-5, learning_hours)
        # Default: (3, 3, 20)
        
        # Feature columns from training:
        # ["difficulty", "market_demand", "learning_hours", "prereq_count",
        #  "is_core", "is_secondary", "user_experience", "user_skill_count",
        #  "has_prereqs"]
        
        features = []
        for skill_info in missing_skills:
            skill = skill_info["skill"].lower()
            meta = self._metadata.get(skill, (3, 3, 20))
            prereqs = SKILL_DEPENDENCIES.get(skill, [])
            
            # Check if user has prereqs (mocking for now, could be improved)
            # In a real app, we'd check against candidate_skills
            has_prereqs = 1 if len(prereqs) == 0 else 0 
            
            feat = [
                meta[0], # difficulty
                meta[1], # market_demand
                meta[2], # learning_hours
                len(prereqs), # prereq_count
                1 if skill_info["priority"] == "core" else 0, # is_core
                1 if skill_info["priority"] == "secondary" else 0, # is_secondary
                self.user_experience,
                self.user_skill_count,
                has_prereqs
            ]
            features.append(feat)
        
        # Predict priority scores
        X = np.array(features)
        scores = model.predict(X)
        
        # Sort by score (higher = more important)
        indexed = list(enumerate(scores))
        indexed.sort(key=lambda x: x[1], reverse=True)
        
        ranked = []
        for rank, (idx, score) in enumerate(indexed, 1):
            info = missing_skills[idx]
            ranked.append({
                "skill": info["skill"],
                "priority": info["priority"],
                "weight": info["weight"],
                "rank": rank,
                "ml_score": float(score),
            })
        return ranked
    
    def _analyze_simple(self, candidate_set: set, role_skills: List[str]) -> Dict[str, Any]:
        """Simple analysis without role weights (backward compatible)."""
        role_set = set(s.lower().strip() for s in role_skills)
        matched = list(candidate_set.intersection(role_set))
        missing = [s for s in role_skills if s.lower().strip() not in candidate_set]
        
        match_percentage = len(matched) / len(role_set) if role_set else 0
        
        # Prepare missing with priority info for ranking
        missing_with_priority = [{"skill": s, "priority": "core", "weight": 1.0} for s in missing]
        missing_skills = self._rank_missing_skills(missing_with_priority)
        
        return {
            "matched_skills": matched,
            "matched_core": matched,
            "matched_secondary": [],
            "matched_bonus": [],
            "missing_skills": missing_skills,
            "match_percentage": match_percentage,
            "weighted_score": match_percentage,
            "core_coverage": match_percentage,
            "secondary_coverage": 1.0,
            "bonus_coverage": 1.0,
        }


def compute_readiness(
    weighted_score: float,
    experience_years: float,
    core_coverage: float
) -> Tuple[str, float, List[str]]:
    """Compute job readiness with explainable factors.
    
    Thresholds (from docs):
    - >80% = Industry Ready
    - 60-80% = Almost Ready  
    - <60% = Needs Upskilling
    
    Returns:
        Tuple of (label, score, explanation_factors)
    """
    model = ReadinessModel()
    features = [weighted_score, experience_years]
    proba = model.predict_proba(features)
    readiness_score = float(proba[1])
    
    # Determine label using doc-specified thresholds
    if readiness_score >= 0.80:
        label = "Industry Ready"
    elif readiness_score >= 0.60:
        label = "Almost Ready"
    else:
        label = "Needs Upskilling"
    
    # Generate explanation factors
    factors = []
    
    if core_coverage >= 0.8:
        factors.append(f"Strong core skill coverage ({core_coverage:.0%})")
    elif core_coverage >= 0.5:
        factors.append(f"Moderate core skill coverage ({core_coverage:.0%})")
    else:
        factors.append(f"Low core skill coverage ({core_coverage:.0%}) - focus on core skills first")
    
    if experience_years >= 3:
        factors.append(f"Good experience level ({experience_years:.1f} years)")
    elif experience_years >= 1:
        factors.append(f"Some experience ({experience_years:.1f} years)")
    else:
        factors.append("Limited experience - consider internships or projects")
    
    if weighted_score >= 0.7:
        factors.append("Overall skill profile is strong")
    elif weighted_score >= 0.4:
        factors.append("Skill profile needs improvement in key areas")
    else:
        factors.append("Significant skill gaps need to be addressed")
    
    return label, readiness_score, factors


def run_pipeline(
    candidate_skills: List[str],
    role_skills: List[str],
    experience_years: float,
    role_id: Optional[str] = None,
    level: Optional[str] = None,
    resume_text: Optional[str] = None,
) -> Dict[str, Any]:
    """Run the complete career readiness analysis pipeline.
    
    Args:
        candidate_skills: Skills provided by user
        role_skills: Target role skills (for backward compatibility)
        experience_years: Years of experience
        role_id: Optional role identifier for role-based analysis
        level: Optional experience level for role-based analysis
        resume_text: Optional resume text for skill extraction
        
    Returns:
        Complete analysis result with all features
    """
    extracted_skills = None
    
    # Step 1: Extract skills from resume if provided
    if resume_text:
        extracted_skills = extract_skills_from_text(resume_text)
        candidate_skills = merge_skills(candidate_skills, extracted_skills)
    
    # Step 2: Get role intelligence if role-based analysis
    role_intel = None
    role_title = None
    role_level = None
    
    if role_id and level:
        role_intel = get_role_intelligence(role_id, level)
        if role_intel:
            role_title = role_intel.title
            role_level = level
    
    # Step 3: Perform skill analysis
    analyzer = SkillAnalyzer(
        role_intel, 
        user_experience=experience_years, 
        user_skill_count=len(candidate_skills)
    )
    skill_analysis = analyzer.analyze(candidate_skills, role_skills)
    
    # Step 4: Compute readiness with explanation
    label, readiness_score, factors = compute_readiness(
        skill_analysis["weighted_score"],
        experience_years,
        skill_analysis["core_coverage"]
    )
    
    # Step 5: Get recommendations for missing skills
    missing_skill_names = [s["skill"] for s in skill_analysis["missing_skills"]]
    recommendations = get_skill_recommendations(missing_skill_names)
    
    # Step 6: Generate 30-day roadmap
    roadmap = get_learning_roadmap(missing_skill_names, weeks=4)
    
    # Build response
    return {
        "readiness_label": label,
        "readiness_score": readiness_score,
        "role_title": role_title,
        "role_level": role_level,
        "skill_analysis": {
            "matched_skills": skill_analysis["matched_skills"],
            "matched_core": skill_analysis["matched_core"],
            "matched_secondary": skill_analysis["matched_secondary"],
            "matched_bonus": skill_analysis["matched_bonus"],
            "missing_skills": skill_analysis["missing_skills"],
            "match_percentage": skill_analysis["match_percentage"],
            "weighted_score": skill_analysis["weighted_score"],
        },
        "explanation": {
            "core_coverage": skill_analysis["core_coverage"],
            "secondary_coverage": skill_analysis["secondary_coverage"],
            "bonus_coverage": skill_analysis["bonus_coverage"],
            "experience_factor": min(experience_years / 5, 1.0),
            "factors": factors,
        },
        "missing_skills": skill_analysis["missing_skills"],
        "recommendations": recommendations,
        "roadmap": roadmap,
        "extracted_skills": extracted_skills,
    }


# Backward compatibility
def compute_skill_match(candidate_skills: List[str], role_skills: List[str]) -> float:
    """Simple skill match ratio (for backward compatibility)."""
    if not role_skills:
        return 0.0
    candidate_set = set(s.lower().strip() for s in candidate_skills)
    role_set = set(s.lower().strip() for s in role_skills)
    matched = candidate_set.intersection(role_set)
    return len(matched) / max(1, len(role_set))


def detect_missing_skills(candidate_skills: List[str], role_skills: List[str]) -> List[Dict]:
    """Detect missing skills (for backward compatibility)."""
    candidate_set = set(s.lower().strip() for s in candidate_skills)
    missing = [s for s in role_skills if s.lower().strip() not in candidate_set]
    return [{"skill": s, "priority": "core", "weight": 1.0, "rank": i + 1} for i, s in enumerate(missing)]
