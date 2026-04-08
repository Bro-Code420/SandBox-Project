"""Skill Matcher Model wrapper.

Uses sentence embeddings for semantic skill matching.
"""

from typing import List, Dict, Optional, Tuple
from pathlib import Path
from joblib import load
import numpy as np


class SkillMatcherModel:
    """ML-based semantic skill matching using embeddings."""
    
    def __init__(self, artifacts_dir: Optional[Path] = None):
        """Load the skill embeddings.
        
        Args:
            artifacts_dir: Path to model artifacts directory
        """
        if artifacts_dir is None:
            artifacts_dir = Path(__file__).resolve().parents[2] / "ml" / "artifacts"
        
        self._embeddings: Dict[str, np.ndarray] = {}
        self._skills: List[str] = []
        self._loaded = False
        
        self._load_embeddings(artifacts_dir)
    
    def _load_embeddings(self, artifacts_dir: Path):
        """Load embeddings from disk."""
        embeddings_path = artifacts_dir / "skill_embeddings.joblib"
        skills_path = artifacts_dir / "skill_list.joblib"
        
        if embeddings_path.exists():
            self._embeddings = load(embeddings_path)
            self._loaded = True
        
        if skills_path.exists():
            self._skills = load(skills_path)
    
    @property
    def is_loaded(self) -> bool:
        """Check if model is loaded."""
        return self._loaded
    
    @property
    def available_skills(self) -> List[str]:
        """Get list of skills with embeddings."""
        return list(self._embeddings.keys())
    
    def get_embedding(self, skill: str) -> Optional[np.ndarray]:
        """Get embedding for a skill."""
        return self._embeddings.get(skill.lower().strip())
    
    def compute_similarity(self, skill1: str, skill2: str) -> float:
        """Compute cosine similarity between two skills.
        
        Args:
            skill1: First skill name
            skill2: Second skill name
            
        Returns:
            Cosine similarity (0-1)
        """
        e1 = self.get_embedding(skill1)
        e2 = self.get_embedding(skill2)
        
        if e1 is None or e2 is None:
            return 0.0
        
        # Cosine similarity
        similarity = np.dot(e1, e2) / (np.linalg.norm(e1) * np.linalg.norm(e2))
        return float(max(0, similarity))
    
    def compute_skill_match_score(
        self,
        candidate_skills: List[str],
        role_skills: List[str],
        weights: Optional[Dict[str, float]] = None
    ) -> Tuple[float, Dict[str, float]]:
        """Compute semantic match score between candidate and role skills.
        
        Uses embedding similarity to find best matches even for
        skills that aren't exact string matches.
        
        Args:
            candidate_skills: Skills the candidate has
            role_skills: Skills required for the role
            weights: Optional weights per role skill
            
        Returns:
            Tuple of (overall_score, per_skill_scores)
        """
        if not self._loaded or not role_skills:
            return 0.0, {}
        
        if weights is None:
            weights = {s: 1.0 for s in role_skills}
        
        skill_scores = {}
        total_weight = 0
        weighted_score = 0
        
        for role_skill in role_skills:
            role_skill_lower = role_skill.lower().strip()
            weight = weights.get(role_skill, 1.0)
            total_weight += weight
            
            # Find best matching candidate skill
            best_similarity = 0.0
            for cand_skill in candidate_skills:
                cand_skill_lower = cand_skill.lower().strip()
                
                # Exact match
                if cand_skill_lower == role_skill_lower:
                    best_similarity = 1.0
                    break
                
                # Semantic similarity
                sim = self.compute_similarity(cand_skill_lower, role_skill_lower)
                best_similarity = max(best_similarity, sim)
            
            skill_scores[role_skill] = best_similarity
            weighted_score += best_similarity * weight
        
        overall_score = weighted_score / total_weight if total_weight > 0 else 0
        return overall_score, skill_scores
    
    def find_similar_skills(self, skill: str, top_k: int = 5) -> List[Tuple[str, float]]:
        """Find most similar skills to a given skill.
        
        Args:
            skill: Skill to find similar ones for
            top_k: Number of similar skills to return
            
        Returns:
            List of (skill, similarity) tuples
        """
        if not self._loaded:
            return []
        
        target_embedding = self.get_embedding(skill)
        if target_embedding is None:
            return []
        
        similarities = []
        for other_skill, embedding in self._embeddings.items():
            if other_skill.lower() == skill.lower():
                continue
            
            sim = np.dot(target_embedding, embedding) / (
                np.linalg.norm(target_embedding) * np.linalg.norm(embedding)
            )
            similarities.append((other_skill, float(sim)))
        
        similarities.sort(key=lambda x: -x[1])
        return similarities[:top_k]


# Singleton instance
_model_instance: Optional[SkillMatcherModel] = None


def get_skill_matcher_model() -> SkillMatcherModel:
    """Get or create the skill matcher model instance."""
    global _model_instance
    if _model_instance is None:
        _model_instance = SkillMatcherModel()
    return _model_instance
