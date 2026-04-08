"""Train skill extraction model using TF-IDF + Multi-label Classification.

This model extracts skills from resume/profile text.
Uses synthetic data for training.
"""

import random
import numpy as np
import pandas as pd
from pathlib import Path
from joblib import dump
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.multiclass import OneVsRestClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.preprocessing import MultiLabelBinarizer


# All skills we want to extract
SKILLS = [
    "python", "javascript", "typescript", "java", "sql", "html", "css",
    "react", "node.js", "docker", "kubernetes", "aws", "git", "linux",
    "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch",
    "machine learning", "deep learning", "rest api", "graphql",
    "postgresql", "mongodb", "redis", "ci/cd", "testing", "agile"
]

# Templates for generating synthetic resume text
TEMPLATES = [
    "Experienced {role} with {years} years of experience in {skills}.",
    "Proficient in {skills}. Worked as {role} for {years} years.",
    "Skills: {skills}. {years} years as {role}.",
    "Technical expertise in {skills}. Background in {role}.",
    "Strong background in {skills} with {years}+ years experience.",
    "{role} specializing in {skills}.",
    "Developed applications using {skills}. {years} years experience.",
    "Expert in {skills}. Currently working as {role}.",
    "Skilled {role} proficient in {skills}.",
    "{years} years of hands-on experience with {skills}.",
]

ROLES = [
    "Software Engineer", "Data Scientist", "Frontend Developer",
    "Backend Developer", "Full Stack Developer", "DevOps Engineer",
    "ML Engineer", "Data Analyst", "Cloud Architect"
]


def generate_synthetic_dataset(n_samples=2000):
    """Generate synthetic resume snippets with skill labels."""
    data = []
    
    for _ in range(n_samples):
        # Randomly select skills (1-8 skills per sample)
        n_skills = random.randint(1, 8)
        sample_skills = random.sample(SKILLS, n_skills)
        
        # Create text
        template = random.choice(TEMPLATES)
        role = random.choice(ROLES)
        years = random.randint(1, 10)
        skills_text = ", ".join(sample_skills)
        
        text = template.format(role=role, years=years, skills=skills_text)
        
        # Add some noise/variation
        if random.random() > 0.5:
            text = text.lower()
        if random.random() > 0.7:
            # Add some extra words
            extras = ["Excellent communication skills.", "Team player.", 
                     "Problem solver.", "Self-motivated."]
            text += " " + random.choice(extras)
        
        data.append({
            "text": text,
            "skills": sample_skills
        })
    
    return pd.DataFrame(data)


def train_skill_extractor(output_dir: Path):
    """Train and save the skill extraction model."""
    print("Generating synthetic training data...")
    df = generate_synthetic_dataset(3000)
    
    print(f"Training on {len(df)} samples...")
    
    # Prepare features
    vectorizer = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),
        lowercase=True,
        stop_words='english'
    )
    X = vectorizer.fit_transform(df['text'])
    
    # Prepare labels (multi-label binarization)
    mlb = MultiLabelBinarizer(classes=SKILLS)
    y = mlb.fit_transform(df['skills'])
    
    # Train multi-label classifier
    classifier = OneVsRestClassifier(
        LogisticRegression(max_iter=500, C=1.0),
        n_jobs=-1
    )
    classifier.fit(X, y)
    
    # Save models
    output_dir.mkdir(parents=True, exist_ok=True)
    
    dump(vectorizer, output_dir / "skill_extractor_vectorizer.joblib")
    dump(classifier, output_dir / "skill_extractor_classifier.joblib")
    dump(mlb, output_dir / "skill_extractor_mlb.joblib")
    
    print(f"Saved skill extractor to {output_dir}")
    
    # Test
    test_text = "Python developer with experience in machine learning and docker"
    X_test = vectorizer.transform([test_text])
    y_pred = classifier.predict(X_test)
    predicted_skills = mlb.inverse_transform(y_pred)[0]
    print(f"Test: '{test_text}'")
    print(f"Predicted skills: {predicted_skills}")
    
    return vectorizer, classifier, mlb


if __name__ == "__main__":
    output_dir = Path(__file__).resolve().parents[1] / "artifacts"
    train_skill_extractor(output_dir)
