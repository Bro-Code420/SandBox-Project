"""Model loading at application startup.

Loads all ML models into memory for fast inference.
"""

from joblib import load
from app.core.config import ARTIFACTS_DIR
from pathlib import Path

_MODELS = {}


def load_models_on_startup():
    """Load all ML models found in ml/artifacts into memory."""
    print("Loading ML models...")
    
    # 1. Readiness Prediction Model
    readiness_path = ARTIFACTS_DIR / "readiness_v1.joblib"
    if readiness_path.exists():
        _MODELS["readiness"] = load(readiness_path)
        print(f"  [OK] Loaded readiness model")
    
    # 2. Skill Extractor Model
    vectorizer_path = ARTIFACTS_DIR / "skill_extractor_vectorizer.joblib"
    classifier_path = ARTIFACTS_DIR / "skill_extractor_classifier.joblib"
    mlb_path = ARTIFACTS_DIR / "skill_extractor_mlb.joblib"
    if all(p.exists() for p in [vectorizer_path, classifier_path, mlb_path]):
        _MODELS["skill_extractor"] = {
            "vectorizer": load(vectorizer_path),
            "classifier": load(classifier_path),
            "mlb": load(mlb_path),
        }
        print(f"  [OK] Loaded skill extractor")
    
    # 3. Skill Embeddings
    embeddings_path = ARTIFACTS_DIR / "skill_embeddings.joblib"
    if embeddings_path.exists():
        _MODELS["skill_embeddings"] = load(embeddings_path)
        print(f"  [OK] Loaded skill embeddings")
    
    # 4. Gap Ranker Model
    gap_ranker_path = ARTIFACTS_DIR / "gap_ranker_model.joblib"
    metadata_path = ARTIFACTS_DIR / "skill_metadata.joblib"
    if gap_ranker_path.exists():
        _MODELS["gap_ranker"] = load(gap_ranker_path)
        if metadata_path.exists():
            _MODELS["skill_metadata"] = load(metadata_path)
        print(f"  [OK] Loaded gap ranker")
    
    # 5. Recommender Model
    recommender_path = ARTIFACTS_DIR / "recommender_predictions.joblib"
    if recommender_path.exists():
        _MODELS["recommender"] = {
            "predictions": load(recommender_path),
            "skills": load(ARTIFACTS_DIR / "recommender_skills.joblib"),
            "resources": load(ARTIFACTS_DIR / "recommender_resources.joblib"),
            "skill_idx": load(ARTIFACTS_DIR / "recommender_skill_idx.joblib"),
        }
        print(f"  [OK] Loaded recommender")
    
    print(f"Loaded {len(_MODELS)} models")


def get_model(name: str):
    """Get a loaded model by name."""
    return _MODELS.get(name)


def is_model_loaded(name: str) -> bool:
    """Check if a model is loaded."""
    return name in _MODELS
