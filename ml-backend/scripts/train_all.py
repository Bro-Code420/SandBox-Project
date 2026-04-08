"""Train all ML models for the Career Readiness Analyzer.

This script trains:
1. Readiness Prediction Model (Logistic Regression)
2. Skill Extraction Model (TF-IDF + Multi-label Classifier)
3. Skill Embeddings (Sentence Transformers)
4. Gap Ranking Model (XGBoost)
5. Resource Recommender (SVD Matrix Factorization)
"""

import sys
from pathlib import Path

# Add project root to path
project_root = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(project_root))


def train_all():
    """Train all ML models."""
    training_dir = project_root / "ml" / "training"
    artifacts_dir = project_root / "ml" / "artifacts"
    artifacts_dir.mkdir(parents=True, exist_ok=True)
    
    print("="*60)
    print("TRAINING ALL ML MODELS")
    print("="*60)
    
    # 1. Readiness Model
    print("\n[1/5] Training Readiness Prediction Model...")
    try:
        from ml.training.train_readiness import train_and_save
        train_and_save(artifacts_dir / "readiness_v1.joblib")
        print("✓ Readiness model trained")
    except Exception as e:
        print(f"✗ Error: {e}")
    
    # 2. Skill Extractor
    print("\n[2/5] Training Skill Extraction Model...")
    try:
        from ml.training.train_skill_extractor import train_skill_extractor
        train_skill_extractor(artifacts_dir)
        print("✓ Skill extractor trained")
    except Exception as e:
        print(f"✗ Error: {e}")
    
    # 3. Skill Embeddings
    print("\n[3/5] Generating Skill Embeddings...")
    try:
        from ml.training.train_skill_embeddings import generate_skill_embeddings
        generate_skill_embeddings(artifacts_dir)
        print("✓ Skill embeddings generated")
    except Exception as e:
        print(f"✗ Error: {e}")
    
    # 4. Gap Ranker
    print("\n[4/5] Training Gap Ranking Model...")
    try:
        from ml.training.train_gap_ranker import train_gap_ranker
        train_gap_ranker(artifacts_dir)
        print("✓ Gap ranker trained")
    except Exception as e:
        print(f"✗ Error: {e}")
    
    # 5. Recommender
    print("\n[5/5] Training Resource Recommender...")
    try:
        from ml.training.train_recommender import train_recommender
        train_recommender(artifacts_dir)
        print("✓ Recommender trained")
    except Exception as e:
        print(f"✗ Error: {e}")
    
    print("\n" + "="*60)
    print("TRAINING COMPLETE")
    print("="*60)
    
    # List artifacts
    print("\nModel artifacts:")
    for f in sorted(artifacts_dir.glob("*.joblib")):
        size = f.stat().st_size / 1024
        print(f"  {f.name} ({size:.1f} KB)")


if __name__ == "__main__":
    train_all()
