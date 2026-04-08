"""Job role definitions with level-based skill requirements.

Each role has skills categorized as:
- core: Essential skills (weight 1.0)
- secondary: Important but not mandatory (weight 0.6)
- bonus: Nice to have (weight 0.3)
"""

from typing import Dict, List, Any

# Skill weight multipliers
SKILL_WEIGHTS = {
    "core": 1.0,
    "secondary": 0.6,
    "bonus": 0.3,
}

# Role definitions with level-specific requirements
ROLE_DEFINITIONS: Dict[str, Dict[str, Any]] = {
    "frontend_developer": {
        "title": "Frontend Developer",
        "domain": "Web Development",
        "levels": {
            "intern": {
                "experience_range": (0, 1),
                "skills": {
                    "core": ["html", "css", "javascript"],
                    "secondary": ["react", "git"],
                    "bonus": ["typescript", "tailwind"],
                },
                "readiness_threshold": 0.6,
            },
            "junior": {
                "experience_range": (0, 2),
                "skills": {
                    "core": ["html", "css", "javascript", "react"],
                    "secondary": ["typescript", "git", "rest api"],
                    "bonus": ["next.js", "tailwind", "testing"],
                },
                "readiness_threshold": 0.65,
            },
            "mid": {
                "experience_range": (2, 5),
                "skills": {
                    "core": ["html", "css", "javascript", "react", "typescript"],
                    "secondary": ["next.js", "rest api", "git", "testing"],
                    "bonus": ["graphql", "webpack", "ci/cd"],
                },
                "readiness_threshold": 0.7,
            },
            "senior": {
                "experience_range": (5, 10),
                "skills": {
                    "core": ["javascript", "typescript", "react", "next.js"],
                    "secondary": ["graphql", "testing", "ci/cd", "docker"],
                    "bonus": ["aws", "kubernetes", "leadership"],
                },
                "readiness_threshold": 0.75,
            },
        },
    },
    "backend_developer": {
        "title": "Backend Developer",
        "domain": "Web Development",
        "levels": {
            "intern": {
                "experience_range": (0, 1),
                "skills": {
                    "core": ["python", "sql"],
                    "secondary": ["git", "rest api"],
                    "bonus": ["docker", "linux"],
                },
                "readiness_threshold": 0.6,
            },
            "junior": {
                "experience_range": (0, 2),
                "skills": {
                    "core": ["python", "sql", "rest api"],
                    "secondary": ["git", "docker", "postgresql"],
                    "bonus": ["redis", "testing", "linux"],
                },
                "readiness_threshold": 0.65,
            },
            "mid": {
                "experience_range": (2, 5),
                "skills": {
                    "core": ["python", "sql", "rest api", "docker"],
                    "secondary": ["postgresql", "redis", "testing", "ci/cd"],
                    "bonus": ["kubernetes", "aws", "graphql"],
                },
                "readiness_threshold": 0.7,
            },
            "senior": {
                "experience_range": (5, 10),
                "skills": {
                    "core": ["python", "sql", "docker", "kubernetes"],
                    "secondary": ["aws", "ci/cd", "graphql", "redis"],
                    "bonus": ["terraform", "leadership", "elasticsearch"],
                },
                "readiness_threshold": 0.75,
            },
        },
    },
    "data_scientist": {
        "title": "Data Scientist",
        "domain": "Data Science",
        "levels": {
            "intern": {
                "experience_range": (0, 1),
                "skills": {
                    "core": ["python", "pandas", "numpy"],
                    "secondary": ["sql", "data visualization"],
                    "bonus": ["scikit-learn", "git"],
                },
                "readiness_threshold": 0.6,
            },
            "junior": {
                "experience_range": (0, 2),
                "skills": {
                    "core": ["python", "pandas", "numpy", "scikit-learn"],
                    "secondary": ["sql", "data visualization", "machine learning"],
                    "bonus": ["tensorflow", "git", "docker"],
                },
                "readiness_threshold": 0.65,
            },
            "mid": {
                "experience_range": (2, 5),
                "skills": {
                    "core": ["python", "pandas", "scikit-learn", "machine learning"],
                    "secondary": ["tensorflow", "sql", "docker", "deep learning"],
                    "bonus": ["pytorch", "aws", "nlp"],
                },
                "readiness_threshold": 0.7,
            },
            "senior": {
                "experience_range": (5, 10),
                "skills": {
                    "core": ["python", "machine learning", "deep learning", "tensorflow"],
                    "secondary": ["pytorch", "aws", "docker", "kubernetes"],
                    "bonus": ["nlp", "computer vision", "leadership"],
                },
                "readiness_threshold": 0.75,
            },
        },
    },
    "fullstack_developer": {
        "title": "Full Stack Developer",
        "domain": "Web Development",
        "levels": {
            "intern": {
                "experience_range": (0, 1),
                "skills": {
                    "core": ["html", "css", "javascript"],
                    "secondary": ["python", "sql", "git"],
                    "bonus": ["react", "node.js"],
                },
                "readiness_threshold": 0.6,
            },
            "junior": {
                "experience_range": (0, 2),
                "skills": {
                    "core": ["javascript", "react", "node.js", "sql"],
                    "secondary": ["typescript", "rest api", "git", "docker"],
                    "bonus": ["mongodb", "postgresql", "testing"],
                },
                "readiness_threshold": 0.65,
            },
            "mid": {
                "experience_range": (2, 5),
                "skills": {
                    "core": ["javascript", "typescript", "react", "node.js", "sql"],
                    "secondary": ["docker", "rest api", "postgresql", "testing"],
                    "bonus": ["aws", "ci/cd", "graphql"],
                },
                "readiness_threshold": 0.7,
            },
            "senior": {
                "experience_range": (5, 10),
                "skills": {
                    "core": ["typescript", "react", "node.js", "docker"],
                    "secondary": ["aws", "kubernetes", "ci/cd", "graphql"],
                    "bonus": ["terraform", "leadership", "elasticsearch"],
                },
                "readiness_threshold": 0.75,
            },
        },
    },
    "devops_engineer": {
        "title": "DevOps Engineer",
        "domain": "Infrastructure",
        "levels": {
            "intern": {
                "experience_range": (0, 1),
                "skills": {
                    "core": ["linux", "git"],
                    "secondary": ["python", "docker"],
                    "bonus": ["aws", "ci/cd"],
                },
                "readiness_threshold": 0.6,
            },
            "junior": {
                "experience_range": (0, 2),
                "skills": {
                    "core": ["linux", "docker", "git", "ci/cd"],
                    "secondary": ["python", "aws", "kubernetes"],
                    "bonus": ["terraform", "jenkins"],
                },
                "readiness_threshold": 0.65,
            },
            "mid": {
                "experience_range": (2, 5),
                "skills": {
                    "core": ["docker", "kubernetes", "aws", "ci/cd"],
                    "secondary": ["terraform", "linux", "python"],
                    "bonus": ["azure", "gcp", "elasticsearch"],
                },
                "readiness_threshold": 0.7,
            },
            "senior": {
                "experience_range": (5, 10),
                "skills": {
                    "core": ["kubernetes", "aws", "terraform", "ci/cd"],
                    "secondary": ["docker", "python", "azure"],
                    "bonus": ["gcp", "leadership", "elasticsearch"],
                },
                "readiness_threshold": 0.75,
            },
        },
    },
}


def get_role(role_id: str) -> Dict[str, Any] | None:
    """Get role definition by ID."""
    return ROLE_DEFINITIONS.get(role_id)


def get_role_level(role_id: str, level: str) -> Dict[str, Any] | None:
    """Get specific level requirements for a role."""
    role = get_role(role_id)
    if role and level in role["levels"]:
        return role["levels"][level]
    return None


def get_all_role_skills(role_id: str, level: str) -> List[str]:
    """Get all skills (core + secondary + bonus) for a role level."""
    level_def = get_role_level(role_id, level)
    if not level_def:
        return []
    skills = level_def["skills"]
    return skills["core"] + skills["secondary"] + skills["bonus"]


def list_available_roles() -> List[Dict[str, str]]:
    """List all available roles with their IDs and titles."""
    return [
        {"role_id": rid, "title": rdef["title"], "domain": rdef["domain"]}
        for rid, rdef in ROLE_DEFINITIONS.items()
    ]
