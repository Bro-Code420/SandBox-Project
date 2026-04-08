"""Skill Extractor Model wrapper.

Uses trained TF-IDF + Multi-label classifier to extract skills from text.
"""

from typing import List, Optional, Tuple
from pathlib import Path
from joblib import load
import numpy as np


class SkillExtractorModel:
    """ML-based skill extraction from text."""
    
    def __init__(self, artifacts_dir: Optional[Path] = None):
        """Load the trained skill extraction model.
        
        Args:
            artifacts_dir: Path to model artifacts directory
        """
        if artifacts_dir is None:
            artifacts_dir = Path(__file__).resolve().parents[2] / "ml" / "artifacts"
        
        self._vectorizer = None
        self._classifier = None
        self._mlb = None
        self._loaded = False
        
        self._load_models(artifacts_dir)
    
    def _load_models(self, artifacts_dir: Path):
        """Load model components from disk."""
        vectorizer_path = artifacts_dir / "skill_extractor_vectorizer.joblib"
        classifier_path = artifacts_dir / "skill_extractor_classifier.joblib"
        mlb_path = artifacts_dir / "skill_extractor_mlb.joblib"
        
        if all(p.exists() for p in [vectorizer_path, classifier_path, mlb_path]):
            self._vectorizer = load(vectorizer_path)
            self._classifier = load(classifier_path)
            self._mlb = load(mlb_path)
            self._loaded = True
    
    @property
    def is_loaded(self) -> bool:
        """Check if model is loaded."""
        return self._loaded
    
    def extract_skills(self, text: str, threshold: float = 0.3) -> List[str]:
        """Extract skills from text using trained model.
        
        Args:
            text: Input text (resume, profile, etc.)
            threshold: Probability threshold for skill detection
            
        Returns:
            List of detected skill names
        """
        if not self._loaded:
            return []
        
        # Transform text
        X = self._vectorizer.transform([text])
        
        # Get probabilities
        if hasattr(self._classifier, 'predict_proba'):
            # For classifiers that support predict_proba
            proba = self._classifier.predict_proba(X)
            # proba is a list of arrays, one per class
            skills = []
            for i, class_proba in enumerate(proba):
                if class_proba[0, 1] >= threshold:  # Probability of positive class
                    skills.append(self._mlb.classes_[i])
            return skills
        else:
            # Fall back to binary prediction
            y_pred = self._classifier.predict(X)
            return list(self._mlb.inverse_transform(y_pred)[0])
    
    def extract_skills_with_confidence(self, text: str) -> List[Tuple[str, float]]:
        """Extract skills with confidence scores.
        
        Args:
            text: Input text
            
        Returns:
            List of (skill, confidence) tuples
        """
        if not self._loaded:
            return []
        
        X = self._vectorizer.transform([text])
        
        results = []
        if hasattr(self._classifier, 'predict_proba'):
            proba = self._classifier.predict_proba(X)
            for i, class_proba in enumerate(proba):
                confidence = class_proba[0, 1]
                if confidence > 0.1:  # Include low-confidence too
                    results.append((self._mlb.classes_[i], float(confidence)))
        
        # Sort by confidence
        results.sort(key=lambda x: -x[1])
        return results


# Singleton instance
_model_instance: Optional[SkillExtractorModel] = None


def get_skill_extractor_model() -> SkillExtractorModel:
    """Get or create the skill extractor model instance."""
    global _model_instance
    if _model_instance is None:
        _model_instance = SkillExtractorModel()
    return _model_instance
