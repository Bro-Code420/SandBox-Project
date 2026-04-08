"""Skill dependency graph for determining learning order.

Dependencies are modeled as: skill -> list of prerequisites
"""

from typing import Dict, List, Set

# Skill dependency graph: skill -> prerequisites (must learn first)
SKILL_DEPENDENCIES: Dict[str, List[str]] = {
    # Frontend chain
    "javascript": ["html", "css"],
    "typescript": ["javascript"],
    "react": ["javascript", "html", "css"],
    "angular": ["typescript", "html", "css"],
    "vue": ["javascript", "html", "css"],
    "next.js": ["react"],
    "tailwind": ["css"],
    "sass": ["css"],
    "webpack": ["javascript"],
    "vite": ["javascript"],
    
    # Backend chains
    "node.js": ["javascript"],
    "express": ["node.js"],
    "fastapi": ["python"],
    "django": ["python"],
    "flask": ["python"],
    "spring boot": ["java"],
    "asp.net": ["c#"],
    "rest api": [],  # Conceptual, no hard prereqs
    "graphql": ["rest api"],
    
    # Database chain
    "postgresql": ["sql"],
    "mysql": ["sql"],
    "mongodb": [],
    "redis": [],
    "elasticsearch": [],
    
    # Cloud/DevOps chain
    "docker": ["linux"],
    "kubernetes": ["docker"],
    "aws": [],
    "azure": [],
    "gcp": [],
    "terraform": ["aws"],  # or any cloud
    "ci/cd": ["git"],
    "jenkins": ["ci/cd"],
    "github actions": ["git", "ci/cd"],
    
    # Data Science chain
    "pandas": ["python"],
    "numpy": ["python"],
    "data visualization": ["pandas"],
    "data analysis": ["pandas", "numpy"],
    "scikit-learn": ["pandas", "numpy"],
    "machine learning": ["scikit-learn"],
    "deep learning": ["machine learning"],
    "tensorflow": ["deep learning"],
    "pytorch": ["deep learning"],
    "nlp": ["machine learning"],
    "computer vision": ["deep learning"],
    
    # Fundamentals (no prerequisites)
    "python": [],
    "java": [],
    "c++": [],
    "c#": [],
    "go": [],
    "rust": [],
    "ruby": [],
    "php": [],
    "swift": [],
    "kotlin": [],
    "html": [],
    "css": [],
    "sql": [],
    "git": [],
    "linux": [],
    "testing": [],
    "agile": [],
}

# Estimated learning time in hours for each skill (for roadmap generation)
SKILL_LEARNING_HOURS: Dict[str, int] = {
    "html": 10,
    "css": 20,
    "javascript": 40,
    "typescript": 25,
    "python": 40,
    "java": 50,
    "sql": 20,
    "react": 40,
    "node.js": 30,
    "next.js": 25,
    "docker": 20,
    "kubernetes": 30,
    "aws": 40,
    "git": 10,
    "linux": 25,
    "pandas": 20,
    "numpy": 15,
    "scikit-learn": 25,
    "machine learning": 60,
    "deep learning": 50,
    "tensorflow": 40,
    "rest api": 15,
    "graphql": 20,
    "testing": 20,
    "ci/cd": 15,
    "tailwind": 10,
    "postgresql": 20,
    "mongodb": 20,
    "redis": 10,
    "terraform": 25,
}

DEFAULT_LEARNING_HOURS = 20


def get_prerequisites(skill: str) -> List[str]:
    """Get direct prerequisites for a skill."""
    return SKILL_DEPENDENCIES.get(skill.lower().strip(), [])


def get_all_prerequisites(skill: str, visited: Set[str] = None) -> List[str]:
    """Get all prerequisites recursively (transitive closure)."""
    if visited is None:
        visited = set()
    
    skill_lower = skill.lower().strip()
    if skill_lower in visited:
        return []
    
    visited.add(skill_lower)
    direct_prereqs = get_prerequisites(skill_lower)
    all_prereqs = []
    
    for prereq in direct_prereqs:
        all_prereqs.extend(get_all_prerequisites(prereq, visited))
        all_prereqs.append(prereq)
    
    return all_prereqs


def get_learning_hours(skill: str) -> int:
    """Get estimated learning hours for a skill."""
    return SKILL_LEARNING_HOURS.get(skill.lower().strip(), DEFAULT_LEARNING_HOURS)


def topological_sort(skills: List[str]) -> List[str]:
    """Sort skills by dependency order (learn prerequisites first)."""
    skill_set = set(s.lower().strip() for s in skills)
    
    # Build dependency graph for just the skills we need
    in_degree = {s: 0 for s in skill_set}
    graph = {s: [] for s in skill_set}
    
    for skill in skill_set:
        prereqs = get_prerequisites(skill)
        for prereq in prereqs:
            if prereq in skill_set:
                graph[prereq].append(skill)
                in_degree[skill] += 1
    
    # Kahn's algorithm
    queue = [s for s in skill_set if in_degree[s] == 0]
    sorted_skills = []
    
    while queue:
        # Sort queue to ensure deterministic order
        queue.sort()
        current = queue.pop(0)
        sorted_skills.append(current)
        
        for neighbor in graph[current]:
            in_degree[neighbor] -= 1
            if in_degree[neighbor] == 0:
                queue.append(neighbor)
    
    # Add any remaining skills (if cycles exist)
    remaining = [s for s in skill_set if s not in sorted_skills]
    sorted_skills.extend(sorted(remaining))
    
    return sorted_skills


def generate_learning_roadmap(skills: List[str], weeks: int = 4) -> List[Dict]:
    """Generate a week-wise learning roadmap for given skills.
    
    Returns between 1 and `weeks` entries based on actual content.
    If there are more bins than `weeks`, overflow is merged into the last week.
    If there are fewer skills than `weeks`, only the needed weeks are returned.
    """
    if not skills:
        return []
    
    sorted_skills = topological_sort(skills)
    
    # Calculate total hours and target hours per week
    total_hours = sum(get_learning_hours(s) for s in sorted_skills)
    # Use the requested number of weeks but don't create more weeks than skills
    effective_weeks = min(weeks, len(sorted_skills))
    hours_per_week = total_hours / effective_weeks if effective_weeks > 0 else total_hours
    
    roadmap = []
    week_hours = 0
    week_skills = []
    
    for skill in sorted_skills:
        skill_hours = get_learning_hours(skill)
        
        # Check if adding this skill exceeds week capacity AND we haven't hit the max
        if (week_hours + skill_hours > hours_per_week * 1.3 
                and week_skills 
                and len(roadmap) < effective_weeks - 1):
            # Save current week
            roadmap.append({
                "week": len(roadmap) + 1,
                "skills": week_skills,
                "estimated_hours": week_hours,
                "focus": week_skills[0],
            })
            week_hours = 0
            week_skills = []
        
        week_skills.append(skill)
        week_hours += skill_hours
    
    # Add remaining skills as the final week
    if week_skills:
        roadmap.append({
            "week": len(roadmap) + 1,
            "skills": week_skills,
            "estimated_hours": week_hours,
            "focus": week_skills[0],
        })
    
    # Safety: if somehow we exceeded max weeks, merge everything beyond `weeks` into the last
    if len(roadmap) > weeks:
        merged = roadmap[:weeks]
        for overflow in roadmap[weeks:]:
            merged[-1]["skills"].extend(overflow["skills"])
            merged[-1]["estimated_hours"] += overflow["estimated_hours"]
        roadmap = merged
    
    # Renumber weeks sequentially
    for i, entry in enumerate(roadmap):
        entry["week"] = i + 1
    
    return roadmap
