"""Train skill gap ranking model using XGBoost.

This model ranks missing skills by learning priority based on:
- Skill importance (core/secondary/bonus)
- Skill difficulty
- Prerequisite count
- Market demand (simulated)
"""

import random
import numpy as np
import pandas as pd
from pathlib import Path
from joblib import dump
import xgboost as xgb
from sklearn.model_selection import train_test_split


# Skill metadata for feature generation
SKILL_METADATA = {
    # skill: (difficulty 1-5, market_demand 1-5, learning_hours)
    "python": (2, 5, 40),
    "javascript": (2, 5, 40),
    "typescript": (3, 4, 25),
    "java": (3, 4, 50),
    "sql": (2, 5, 20),
    "html": (1, 3, 10),
    "css": (2, 3, 20),
    "react": (3, 5, 40),
    "node.js": (3, 4, 30),
    "docker": (3, 5, 20),
    "kubernetes": (4, 5, 30),
    "aws": (3, 5, 40),
    "git": (1, 4, 10),
    "linux": (2, 4, 25),
    "pandas": (2, 4, 20),
    "numpy": (2, 3, 15),
    "scikit-learn": (3, 4, 25),
    "tensorflow": (4, 4, 40),
    "pytorch": (4, 4, 40),
    "machine learning": (4, 5, 60),
    "deep learning": (5, 4, 50),
    "rest api": (2, 4, 15),
    "graphql": (3, 3, 20),
    "postgresql": (2, 4, 20),
    "mongodb": (2, 3, 20),
    "redis": (3, 3, 10),
    "ci/cd": (3, 4, 15),
    "testing": (2, 4, 20),
    "next.js": (3, 4, 25),
    "vue": (3, 3, 30),
    "angular": (3, 3, 35),
    "tailwind": (2, 3, 10),
    "terraform": (4, 4, 25),
    "agile": (1, 3, 10),
}

# Skill prerequisites count
SKILL_PREREQS = {
    "python": 0, "javascript": 0, "java": 0, "sql": 0, "html": 0, "css": 0,
    "git": 0, "linux": 0, "agile": 0,
    "typescript": 1, "react": 2, "vue": 2, "angular": 2, "node.js": 1,
    "next.js": 3, "tailwind": 1, "pandas": 1, "numpy": 1,
    "scikit-learn": 2, "machine learning": 3, "deep learning": 4,
    "tensorflow": 5, "pytorch": 5, "docker": 1, "kubernetes": 2,
    "aws": 0, "ci/cd": 1, "terraform": 2, "rest api": 0, "graphql": 1,
    "postgresql": 1, "mongodb": 0, "redis": 0, "testing": 0,
}


def generate_synthetic_ranking_data(n_samples=5000):
    """Generate synthetic data for learning skill priority ranking."""
    data = []
    skills = list(SKILL_METADATA.keys())
    
    for _ in range(n_samples):
        skill = random.choice(skills)
        difficulty, market_demand, hours = SKILL_METADATA[skill]
        prereqs = SKILL_PREREQS.get(skill, 0)
        
        # Simulate role context
        is_core = random.random() > 0.6
        is_secondary = not is_core and random.random() > 0.5
        
        # User context
        user_experience = random.uniform(0, 10)
        user_skill_count = random.randint(0, 15)
        has_prereqs = random.random() > (prereqs * 0.15)  # More prereqs = less likely
        
        # Features
        features = {
            "difficulty": difficulty,
            "market_demand": market_demand,
            "learning_hours": hours,
            "prereq_count": prereqs,
            "is_core": int(is_core),
            "is_secondary": int(is_secondary),
            "user_experience": user_experience,
            "user_skill_count": user_skill_count,
            "has_prereqs": int(has_prereqs),
        }
        
        # Target: priority score (higher = learn first)
        # Logic: core skills, high demand, low difficulty, has prereqs = higher priority
        priority = (
            3.0 * is_core +
            1.5 * is_secondary +
            0.5 * market_demand +
            -0.3 * difficulty +
            -0.1 * prereqs +
            0.5 * has_prereqs +
            0.1 * user_experience +
            random.gauss(0, 0.5)  # noise
        )
        priority = max(0, min(10, priority))  # Clamp to 0-10
        
        features["priority_score"] = priority
        data.append(features)
    
    return pd.DataFrame(data)


def train_gap_ranker(output_dir: Path):
    """Train and save the skill gap ranking model."""
    print("Generating synthetic ranking data...")
    df = generate_synthetic_ranking_data(8000)
    
    feature_cols = [
        "difficulty", "market_demand", "learning_hours", "prereq_count",
        "is_core", "is_secondary", "user_experience", "user_skill_count",
        "has_prereqs"
    ]
    
    X = df[feature_cols]
    y = df["priority_score"]
    
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print(f"Training XGBoost ranker on {len(X_train)} samples...")
    
    model = xgb.XGBRegressor(
        n_estimators=100,
        max_depth=6,
        learning_rate=0.1,
        objective='reg:squarederror',
        random_state=42
    )
    model.fit(X_train, y_train)
    
    # Evaluate
    train_score = model.score(X_train, y_train)
    test_score = model.score(X_test, y_test)
    print(f"Train R²: {train_score:.3f}, Test R²: {test_score:.3f}")
    
    # Feature importance
    print("\nFeature importance:")
    for feat, imp in sorted(zip(feature_cols, model.feature_importances_), 
                            key=lambda x: -x[1]):
        print(f"  {feat}: {imp:.3f}")
    
    # Save
    output_dir.mkdir(parents=True, exist_ok=True)
    dump(model, output_dir / "gap_ranker_model.joblib")
    dump(feature_cols, output_dir / "gap_ranker_features.joblib")
    dump(SKILL_METADATA, output_dir / "skill_metadata.joblib")
    
    print(f"\nSaved gap ranker to {output_dir}")
    
    return model


if __name__ == "__main__":
    output_dir = Path(__file__).resolve().parents[1] / "artifacts"
    train_gap_ranker(output_dir)
