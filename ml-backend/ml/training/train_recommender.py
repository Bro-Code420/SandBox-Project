"""Train resource recommendation model using Matrix Factorization (SVD).

This model recommends learning resources based on skill-resource interactions.
Uses TruncatedSVD for collaborative filtering.
"""

import random
import numpy as np
import pandas as pd
from pathlib import Path
from joblib import dump
from scipy.sparse import csr_matrix
from sklearn.decomposition import TruncatedSVD
from sklearn.preprocessing import normalize


# Skills for recommendation
SKILLS = [
    "python", "javascript", "typescript", "java", "sql", "html", "css",
    "react", "node.js", "docker", "kubernetes", "aws", "git", "linux",
    "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch",
    "machine learning", "deep learning", "rest api", "graphql",
    "postgresql", "mongodb", "redis", "ci/cd", "testing", "next.js",
    "vue", "angular", "tailwind", "terraform", "agile"
]

# Resources (simulated)
RESOURCES = [
    # Python resources
    {"id": 0, "skill": "python", "title": "Python for Everybody", "type": "course", "quality": 0.9},
    {"id": 1, "skill": "python", "title": "Python Tutorial", "type": "youtube", "quality": 0.8},
    {"id": 2, "skill": "python", "title": "Automate the Boring Stuff", "type": "course", "quality": 0.85},
    # JavaScript resources
    {"id": 3, "skill": "javascript", "title": "JavaScript Complete Guide", "type": "course", "quality": 0.9},
    {"id": 4, "skill": "javascript", "title": "JS Full Course", "type": "youtube", "quality": 0.75},
    # React resources
    {"id": 5, "skill": "react", "title": "React Complete Guide", "type": "course", "quality": 0.95},
    {"id": 6, "skill": "react", "title": "React Tutorial", "type": "youtube", "quality": 0.8},
    # Machine Learning resources
    {"id": 7, "skill": "machine learning", "title": "ML by Andrew Ng", "type": "course", "quality": 0.98},
    {"id": 8, "skill": "machine learning", "title": "ML Course for Beginners", "type": "youtube", "quality": 0.85},
    # Docker resources
    {"id": 9, "skill": "docker", "title": "Docker Mastery", "type": "course", "quality": 0.9},
    {"id": 10, "skill": "docker", "title": "Docker Tutorial", "type": "youtube", "quality": 0.8},
    # AWS resources
    {"id": 11, "skill": "aws", "title": "AWS Solutions Architect", "type": "course", "quality": 0.9},
    {"id": 12, "skill": "aws", "title": "AWS Tutorial", "type": "youtube", "quality": 0.75},
    # SQL resources
    {"id": 13, "skill": "sql", "title": "SQL Bootcamp", "type": "course", "quality": 0.85},
    {"id": 14, "skill": "sql", "title": "SQL Full Course", "type": "youtube", "quality": 0.8},
    # Data Science resources
    {"id": 15, "skill": "pandas", "title": "Data Analysis with Pandas", "type": "course", "quality": 0.85},
    {"id": 16, "skill": "numpy", "title": "NumPy Tutorial", "type": "youtube", "quality": 0.75},
    {"id": 17, "skill": "scikit-learn", "title": "Scikit-Learn Course", "type": "course", "quality": 0.85},
    # Deep Learning
    {"id": 18, "skill": "tensorflow", "title": "TensorFlow Developer", "type": "course", "quality": 0.9},
    {"id": 19, "skill": "pytorch", "title": "PyTorch Tutorial", "type": "youtube", "quality": 0.85},
    {"id": 20, "skill": "deep learning", "title": "Deep Learning Specialization", "type": "course", "quality": 0.95},
    # DevOps
    {"id": 21, "skill": "kubernetes", "title": "Kubernetes Course", "type": "course", "quality": 0.85},
    {"id": 22, "skill": "ci/cd", "title": "CI/CD Pipeline Tutorial", "type": "youtube", "quality": 0.8},
    {"id": 23, "skill": "terraform", "title": "Terraform Associate", "type": "course", "quality": 0.85},
    # Frontend
    {"id": 24, "skill": "html", "title": "HTML Full Course", "type": "youtube", "quality": 0.75},
    {"id": 25, "skill": "css", "title": "CSS Tutorial", "type": "youtube", "quality": 0.75},
    {"id": 26, "skill": "typescript", "title": "Understanding TypeScript", "type": "course", "quality": 0.85},
    {"id": 27, "skill": "next.js", "title": "Next.js Complete Guide", "type": "course", "quality": 0.85},
    {"id": 28, "skill": "vue", "title": "Vue.js Course", "type": "course", "quality": 0.8},
    {"id": 29, "skill": "angular", "title": "Angular Complete Guide", "type": "course", "quality": 0.85},
    # Backend
    {"id": 30, "skill": "node.js", "title": "Node.js Developer Course", "type": "course", "quality": 0.85},
    {"id": 31, "skill": "rest api", "title": "REST API Design", "type": "youtube", "quality": 0.75},
    {"id": 32, "skill": "graphql", "title": "GraphQL Complete Course", "type": "course", "quality": 0.8},
    # Databases
    {"id": 33, "skill": "postgresql", "title": "PostgreSQL Tutorial", "type": "youtube", "quality": 0.75},
    {"id": 34, "skill": "mongodb", "title": "MongoDB Course", "type": "course", "quality": 0.8},
    {"id": 35, "skill": "redis", "title": "Redis Tutorial", "type": "youtube", "quality": 0.7},
    # Tools
    {"id": 36, "skill": "git", "title": "Git Complete Guide", "type": "course", "quality": 0.85},
    {"id": 37, "skill": "linux", "title": "Linux Mastery", "type": "course", "quality": 0.85},
    {"id": 38, "skill": "testing", "title": "Testing JavaScript", "type": "course", "quality": 0.8},
]


def generate_synthetic_interactions(n_users=500):
    """Generate synthetic user-resource interaction data."""
    interactions = []
    
    for user_id in range(n_users):
        # Each user interacts with 3-15 resources
        n_interactions = random.randint(3, 15)
        
        # User has skill preferences
        preferred_skills = random.sample(SKILLS, random.randint(2, 6))
        
        for _ in range(n_interactions):
            # Select resource (biased towards preferred skills)
            if random.random() > 0.3:
                # Select from preferred skills
                skill = random.choice(preferred_skills)
                matching_resources = [r for r in RESOURCES if r["skill"] == skill]
                if matching_resources:
                    resource = random.choice(matching_resources)
                else:
                    resource = random.choice(RESOURCES)
            else:
                resource = random.choice(RESOURCES)
            
            # Rating based on quality + noise
            rating = resource["quality"] + random.gauss(0, 0.15)
            rating = max(0.1, min(1.0, rating))  # Clamp
            
            interactions.append({
                "user_id": user_id,
                "resource_id": resource["id"],
                "skill": resource["skill"],
                "rating": rating
            })
    
    return pd.DataFrame(interactions)


def train_recommender(output_dir: Path):
    """Train and save the recommendation model."""
    print("Generating synthetic interaction data...")
    df = generate_synthetic_interactions(800)
    
    # Create skill-resource matrix
    n_skills = len(SKILLS)
    n_resources = len(RESOURCES)
    
    skill_to_idx = {s: i for i, s in enumerate(SKILLS)}
    
    # Build skill-resource rating matrix
    # Average ratings per skill-resource pair
    skill_resource_matrix = np.zeros((n_skills, n_resources))
    skill_resource_counts = np.zeros((n_skills, n_resources))
    
    for _, row in df.iterrows():
        skill_idx = skill_to_idx.get(row["skill"])
        if skill_idx is not None:
            resource_idx = row["resource_id"]
            skill_resource_matrix[skill_idx, resource_idx] += row["rating"]
            skill_resource_counts[skill_idx, resource_idx] += 1
    
    # Average where we have data
    mask = skill_resource_counts > 0
    skill_resource_matrix[mask] /= skill_resource_counts[mask]
    
    # Add base quality scores where we don't have data
    for resource in RESOURCES:
        skill_idx = skill_to_idx.get(resource["skill"])
        if skill_idx is not None:
            if skill_resource_matrix[skill_idx, resource["id"]] == 0:
                skill_resource_matrix[skill_idx, resource["id"]] = resource["quality"]
    
    print(f"Matrix shape: {skill_resource_matrix.shape}")
    print(f"Non-zero entries: {np.count_nonzero(skill_resource_matrix)}")
    
    # Apply SVD for dimensionality reduction and latent factor discovery
    sparse_matrix = csr_matrix(skill_resource_matrix)
    
    n_components = min(15, n_skills - 1, n_resources - 1)
    svd = TruncatedSVD(n_components=n_components, random_state=42)
    
    print(f"Training SVD with {n_components} components...")
    skill_factors = svd.fit_transform(sparse_matrix)
    resource_factors = svd.components_.T
    
    # Normalize factors for cosine similarity
    skill_factors_normalized = normalize(skill_factors, axis=1)
    resource_factors_normalized = normalize(resource_factors, axis=1)
    
    # Reconstruct matrix for predictions
    reconstructed = np.dot(skill_factors, svd.components_)
    
    print(f"Explained variance ratio: {svd.explained_variance_ratio_.sum():.3f}")
    
    # Save
    output_dir.mkdir(parents=True, exist_ok=True)
    dump(svd, output_dir / "recommender_svd.joblib")
    dump(skill_factors_normalized, output_dir / "recommender_skill_factors.joblib")
    dump(resource_factors_normalized, output_dir / "recommender_resource_factors.joblib")
    dump(reconstructed, output_dir / "recommender_predictions.joblib")
    dump(SKILLS, output_dir / "recommender_skills.joblib")
    dump(RESOURCES, output_dir / "recommender_resources.joblib")
    dump(skill_to_idx, output_dir / "recommender_skill_idx.joblib")
    
    print(f"\nSaved recommender to {output_dir}")
    
    # Test
    print("\nTesting recommendations for 'python':")
    skill_idx = skill_to_idx["python"]
    scores = reconstructed[skill_idx]
    top_indices = np.argsort(scores)[::-1][:5]
    for idx in top_indices:
        resource = RESOURCES[idx]
        print(f"  {resource['title']} (score: {scores[idx]:.3f})")
    
    return svd, reconstructed


if __name__ == "__main__":
    output_dir = Path(__file__).resolve().parents[1] / "artifacts"
    train_recommender(output_dir)
