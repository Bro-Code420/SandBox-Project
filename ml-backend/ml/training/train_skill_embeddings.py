"""Generate skill embeddings using Sentence Transformers.

These embeddings are used for semantic skill matching.
"""

import numpy as np
from pathlib import Path
from joblib import dump
from sentence_transformers import SentenceTransformer


# All skills to generate embeddings for
SKILLS = [
    # Programming Languages
    "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust",
    "ruby", "php", "swift", "kotlin",
    
    # Frontend
    "html", "css", "react", "angular", "vue", "next.js", "tailwind", "sass",
    
    # Backend
    "node.js", "express", "fastapi", "django", "flask", "spring boot",
    "rest api", "graphql",
    
    # Databases
    "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch",
    
    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "terraform",
    "jenkins", "github actions",
    
    # Data & ML
    "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch",
    "machine learning", "deep learning", "data analysis", "data visualization",
    "nlp", "computer vision",
    
    # Tools
    "git", "linux", "testing", "agile",
]

# Descriptions for richer embeddings
SKILL_DESCRIPTIONS = {
    "python": "Python programming language for data science and web development",
    "javascript": "JavaScript programming language for web development",
    "typescript": "TypeScript statically typed JavaScript",
    "react": "React JavaScript library for building user interfaces",
    "node.js": "Node.js JavaScript runtime for server-side development",
    "docker": "Docker containerization platform",
    "kubernetes": "Kubernetes container orchestration",
    "aws": "Amazon Web Services cloud computing platform",
    "machine learning": "Machine learning artificial intelligence algorithms",
    "deep learning": "Deep learning neural networks AI",
    "sql": "SQL structured query language databases",
    "postgresql": "PostgreSQL relational database",
    "mongodb": "MongoDB NoSQL document database",
    "git": "Git version control system",
    "linux": "Linux operating system",
    "pandas": "Pandas Python data analysis library",
    "scikit-learn": "Scikit-learn machine learning library Python",
    "tensorflow": "TensorFlow deep learning framework",
    "pytorch": "PyTorch deep learning framework",
    "rest api": "REST API web services",
    "graphql": "GraphQL API query language",
    "ci/cd": "CI/CD continuous integration deployment",
}


def generate_skill_embeddings(output_dir: Path):
    """Generate and save skill embeddings."""
    print("Loading sentence transformer model...")
    # Use a lightweight model for faster loading
    model = SentenceTransformer('all-MiniLM-L6-v2')
    
    print(f"Generating embeddings for {len(SKILLS)} skills...")
    
    # Create embeddings using descriptions where available
    texts = []
    for skill in SKILLS:
        if skill in SKILL_DESCRIPTIONS:
            texts.append(SKILL_DESCRIPTIONS[skill])
        else:
            texts.append(skill)
    
    embeddings = model.encode(texts, show_progress_bar=True)
    
    # Create skill -> embedding mapping
    skill_embeddings = {
        skill: embeddings[i].astype(np.float32)
        for i, skill in enumerate(SKILLS)
    }
    
    # Save
    output_dir.mkdir(parents=True, exist_ok=True)
    dump(skill_embeddings, output_dir / "skill_embeddings.joblib")
    dump(SKILLS, output_dir / "skill_list.joblib")
    
    print(f"Saved embeddings to {output_dir}")
    
    # Test similarity
    print("\nTesting similarity:")
    test_pairs = [
        ("python", "pandas"),
        ("react", "vue"),
        ("docker", "kubernetes"),
        ("python", "kubernetes"),
    ]
    
    for s1, s2 in test_pairs:
        e1 = skill_embeddings[s1]
        e2 = skill_embeddings[s2]
        similarity = np.dot(e1, e2) / (np.linalg.norm(e1) * np.linalg.norm(e2))
        print(f"  {s1} <-> {s2}: {similarity:.3f}")
    
    return skill_embeddings


if __name__ == "__main__":
    output_dir = Path(__file__).resolve().parents[1] / "artifacts"
    generate_skill_embeddings(output_dir)
