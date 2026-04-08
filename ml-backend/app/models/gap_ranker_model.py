"""Gap Ranker Model wrapper.

Uses trained XGBoost model to rank missing skills by learning priority.
"""

from typing import List, Dict, Optional, Any
from pathlib import Path
from joblib import load
import numpy as np


class GapRankerModel:
    """ML-based skill gap ranking using XGBoost."""
    
    def __init__(self, artifacts_dir: Optional[Path] = None):
        """Load the trained gap ranking model.
        
        Args:
            artifacts_dir: Path to model artifacts directory
        """
        if artifacts_dir is None:
            artifacts_dir = Path(__file__).resolve().parents[2] / "ml" / "artifacts"
        
        self._model = None
        self._feature_cols: List[str] = []
        self._skill_metadata: Dict[str, tuple] = {}
        self._loaded = False
        
        self._load_model(artifacts_dir)
    
    def _load_model(self, artifacts_dir: Path):
        """Load model from disk."""
        model_path = artifacts_dir / "gap_ranker_model.joblib"
        features_path = artifacts_dir / "gap_ranker_features.joblib"
        metadata_path = artifacts_dir / "skill_metadata.joblib"
        
        if model_path.exists():
            self._model = load(model_path)
            self._loaded = True
        
        if features_path.exists():
            self._feature_cols = load(features_path)
        
        if metadata_path.exists():
            self._skill_metadata = load(metadata_path)
    
    @property
    def is_loaded(self) -> bool:
        """Check if model is loaded."""
        return self._loaded
    
    def get_skill_metadata(self, skill: str) -> tuple:
        """Get metadata for a skill (difficulty, market_demand, hours)."""
        return self._skill_metadata.get(skill.lower().strip(), (3, 3, 20))  # defaults
    
    def rank_skills(
        self,
        missing_skills: List[Dict[str, Any]],
        user_experience: float = 0,
        user_skill_count: int = 0
    ) -> List[Dict[str, Any]]:
        """Rank missing skills by learning priority.
        
        Args:
            missing_skills: List of skill dicts with 'skill', 'priority' keys
            user_experience: Years of experience
            user_skill_count: Number of skills user already has
            
        Returns:
            Sorted list with added 'rank' and 'priority_score' fields
        """
        if not self._loaded or not missing_skills:
            # Fallback: simple rule-based ranking
            for i, skill in enumerate(missing_skills):
                skill["rank"] = i + 1
                skill["priority_score"] = 5.0
            return missing_skills
        
        # Build feature matrix
        features = []
        for skill_data in missing_skills:
            skill = skill_data.get("skill", "").lower().strip()
            priority = skill_data.get("priority", "secondary")
            
            # Get skill metadata
            difficulty, market_demand, hours = self.get_skill_metadata(skill)
            
            # Calculate prereq count (simplified)
            prereq_count = self._get_prereq_count(skill)
            
            # Build feature vector
            feature = {
                "difficulty": difficulty,
                "market_demand": market_demand,
                "learning_hours": hours,
                "prereq_count": prereq_count,
                "is_core": int(priority == "core"),
                "is_secondary": int(priority == "secondary"),
                "user_experience": user_experience,
                "user_skill_count": user_skill_count,
                "has_prereqs": 1,  # Assume user has prereqs for simplicity
            }
            features.append([feature[col] for col in self._feature_cols])
        
        # Predict priority scores
        X = np.array(features)
        scores = self._model.predict(X)
        
        # Add scores and sort
        for i, skill_data in enumerate(missing_skills):
            skill_data["priority_score"] = float(scores[i])
        
        # Sort by priority score (descending)
        missing_skills.sort(key=lambda x: -x.get("priority_score", 0))
        
        # Assign ranks
        for i, skill_data in enumerate(missing_skills):
            skill_data["rank"] = i + 1
        
        return missing_skills
    
    def _get_prereq_count(self, skill: str) -> int:
        """Get prerequisite count for a skill."""
        prereq_map = {
            "python": 0, "javascript": 0, "java": 0, "sql": 0, "html": 0, "css": 0,
            "git": 0, "linux": 0, "agile": 0,
            "typescript": 1, "react": 2, "vue": 2, "angular": 2, "node.js": 1,
            "next.js": 3, "tailwind": 1, "pandas": 1, "numpy": 1,
            "scikit-learn": 2, "machine learning": 3, "deep learning": 4,
            "tensorflow": 5, "pytorch": 5, "docker": 1, "kubernetes": 2,
            "aws": 0, "ci/cd": 1, "terraform": 2, "rest api": 0, "graphql": 1,
            "postgresql": 1, "mongodb": 0, "redis": 0, "testing": 0,
        }
        return prereq_map.get(skill, 1)


# Singleton instance
_model_instance: Optional[GapRankerModel] = None


def get_gap_ranker_model() -> GapRankerModel:
    """Get or create the gap ranker model instance."""
    global _model_instance
    if _model_instance is None:
        _model_instance = GapRankerModel()
    return _model_instance
