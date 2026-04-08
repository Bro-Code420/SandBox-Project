import numpy as np
import pandas as pd
from sklearn.linear_model import LogisticRegression
from joblib import dump
from pathlib import Path
import random


def create_synthetic_dataset(n=500):
    rows = []
    possible_skills = ["python", "sql", "pandas", "ml", "aws", "docker", "react", "node"]
    for i in range(n):
        role_skills = random.sample(possible_skills, k=random.randint(2, 5))
        candidate_skills = random.sample(possible_skills, k=random.randint(0, 6))
        match = len(set(s.lower() for s in candidate_skills).intersection(set(s.lower() for s in role_skills)))
        match_ratio = match / max(1, len(role_skills))
        experience = random.uniform(0, 10)
        # label: higher match+experience -> industry ready
        score = 0.6 * match_ratio + 0.05 * experience
        label = 1 if score >= 0.5 else 0
        rows.append({"match_ratio": match_ratio, "experience": experience, "label": label})
    return pd.DataFrame(rows)


def train_and_save(path: Path):
    df = create_synthetic_dataset(1000)
    X = df[["match_ratio", "experience"]].values
    y = df["label"].values
    model = LogisticRegression(max_iter=200)
    model.fit(X, y)
    path.parent.mkdir(parents=True, exist_ok=True)
    dump(model, path)


if __name__ == "__main__":
    # Save to ml/artifacts (matches app/core/config.py)
    out = Path(__file__).resolve().parents[1] / "artifacts" / "readiness_v1.joblib"
    train_and_save(out)
    print(f"Saved model to: {out}")
