"""Predefined skill taxonomy for standardization and extraction."""

# All recognized skills in the system (lowercase for matching)
SKILL_TAXONOMY = {
    # Programming Languages
    "python", "javascript", "typescript", "java", "c++", "c#", "go", "rust", "ruby", "php", "swift", "kotlin",
    
    # Frontend
    "html", "css", "react", "angular", "vue", "next.js", "tailwind", "sass", "webpack", "vite",
    
    # Backend
    "node.js", "express", "fastapi", "django", "flask", "spring boot", "asp.net", "graphql", "rest api",
    
    # Databases
    "sql", "mysql", "postgresql", "mongodb", "redis", "elasticsearch", "firebase",
    
    # Cloud & DevOps
    "aws", "azure", "gcp", "docker", "kubernetes", "ci/cd", "terraform", "jenkins", "github actions",
    
    # Data & ML
    "pandas", "numpy", "scikit-learn", "tensorflow", "pytorch", "machine learning", "deep learning",
    "data analysis", "data visualization", "nlp", "computer vision",
    
    # Tools & Practices
    "git", "linux", "agile", "scrum", "jira", "testing", "unit testing", "tdd",
    
    # Soft Skills (for completeness)
    "communication", "problem solving", "teamwork", "leadership",
}

# Skill aliases for normalization
SKILL_ALIASES = {
    "js": "javascript",
    "ts": "typescript",
    "py": "python",
    "node": "node.js",
    "nextjs": "next.js",
    "tailwindcss": "tailwind",
    "postgres": "postgresql",
    "mongo": "mongodb",
    "k8s": "kubernetes",
    "ml": "machine learning",
    "dl": "deep learning",
    "sklearn": "scikit-learn",
    "tf": "tensorflow",
    "cv": "computer vision",
    "reactjs": "react",
    "vuejs": "vue",
    "angularjs": "angular",
}


def normalize_skill(skill: str) -> str:
    """Normalize a skill name to its canonical form."""
    skill_lower = skill.lower().strip()
    return SKILL_ALIASES.get(skill_lower, skill_lower)


def is_valid_skill(skill: str) -> bool:
    """Check if a skill is in the taxonomy."""
    return normalize_skill(skill) in SKILL_TAXONOMY
