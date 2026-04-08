"""Recommender Model wrapper.

Uses trained SVD model to recommend learning resources.
"""

from typing import List, Dict, Optional, Any
from pathlib import Path
from joblib import load
import numpy as np


class RecommenderModel:
    """ML-based resource recommendation using matrix factorization."""
    
    def __init__(self, artifacts_dir: Optional[Path] = None):
        """Load the trained recommender model.
        
        Args:
            artifacts_dir: Path to model artifacts directory
        """
        if artifacts_dir is None:
            artifacts_dir = Path(__file__).resolve().parents[2] / "ml" / "artifacts"
        
        self._svd = None
        self._predictions = None
        self._skill_factors = None
        self._resource_factors = None
        self._skills: List[str] = []
        self._resources: List[Dict] = []
        self._skill_to_idx: Dict[str, int] = {}
        self._loaded = False
        
        self._load_model(artifacts_dir)
    
    def _load_model(self, artifacts_dir: Path):
        """Load model from disk."""
        predictions_path = artifacts_dir / "recommender_predictions.joblib"
        skills_path = artifacts_dir / "recommender_skills.joblib"
        resources_path = artifacts_dir / "recommender_resources.joblib"
        skill_idx_path = artifacts_dir / "recommender_skill_idx.joblib"
        
        if predictions_path.exists():
            self._predictions = load(predictions_path)
            self._loaded = True
        
        if skills_path.exists():
            self._skills = load(skills_path)
        
        if resources_path.exists():
            self._resources = load(resources_path)
        
        if skill_idx_path.exists():
            self._skill_to_idx = load(skill_idx_path)
    
    @property
    def is_loaded(self) -> bool:
        """Check if model is loaded."""
        return self._loaded
    
    def get_recommendations(
        self,
        skill: str,
        top_k: int = 3
    ) -> List[Dict[str, Any]]:
        """Get resource recommendations for a skill.
        
        Args:
            skill: Skill to get recommendations for
            top_k: Number of recommendations to return
            
        Returns:
            List of resource dictionaries with scores
        """
        if not self._loaded:
            return []
        
        skill_lower = skill.lower().strip()
        skill_idx = self._skill_to_idx.get(skill_lower)
        
        if skill_idx is None:
            # Skill not found, return resources for the skill if available
            matching = [r for r in self._resources if r["skill"].lower() == skill_lower]
            return matching[:top_k]
        
        # Get predicted scores for this skill
        scores = self._predictions[skill_idx]
        
        # Get top resource indices
        top_indices = np.argsort(scores)[::-1]
        
        recommendations = []
        seen_titles = set()
        
        for idx in top_indices:
            if len(recommendations) >= top_k:
                break
            
            if idx < len(self._resources):
                resource = self._resources[idx].copy()
                
                # Avoid duplicates
                if resource["title"] in seen_titles:
                    continue
                seen_titles.add(resource["title"])
                
                resource["score"] = float(scores[idx])
                recommendations.append(resource)
        
        return recommendations
    
    def get_recommendations_for_skills(
        self,
        skills: List[str],
        max_per_skill: int = 2
    ) -> List[Dict[str, Any]]:
        """Get recommendations for multiple skills.
        
        Args:
            skills: List of skills
            max_per_skill: Max recommendations per skill
            
        Returns:
            List of recommendations grouped by skill
        """
        results = []
        
        for skill in skills:
            recs = self.get_recommendations(skill, top_k=max_per_skill)
            if recs:
                results.append({
                    "skill": skill,
                    "resources": recs
                })
        
        return results
    
    def get_resource_details(self, resource_id: int) -> Optional[Dict[str, Any]]:
        """Get details for a specific resource."""
        for resource in self._resources:
            if resource["id"] == resource_id:
                return resource
        return None


# Singleton instance
_model_instance: Optional[RecommenderModel] = None


def get_recommender_model() -> RecommenderModel:
    """Get or create the recommender model instance."""
    global _model_instance
    if _model_instance is None:
        _model_instance = RecommenderModel()
    return _model_instance
