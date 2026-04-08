"""Recommendation service for learning resources.

Uses trained SVD-based collaborative filtering model for personalized recommendations.
Falls back to content-based filtering with curated datasets if model unavailable.
"""

import numpy as np
from typing import List, Dict, Any
from data.learning_resources import get_resources_for_skill, get_resources_for_skills
from data.skill_dependencies import topological_sort, generate_learning_roadmap
from app.core.startup import get_model, is_model_loaded


def get_skill_recommendations(
    missing_skills: List[str],
    max_resources_per_skill: int = 2
) -> List[Dict[str, Any]]:
    """Get learning resource recommendations for missing skills.
    
    Uses trained SVD model for collaborative filtering if available,
    otherwise falls back to curated resource mappings.
    
    Args:
        missing_skills: List of skills to get recommendations for
        max_resources_per_skill: Max number of resources per skill
        
    Returns:
        List of skill recommendations with resources
    """
    recommendations = []
    
    # Sort skills by learning dependency order
    sorted_skills = topological_sort(missing_skills)
    
    # Use ML model if available
    use_ml = is_model_loaded("recommender")
    
    for skill in sorted_skills:
        if use_ml:
            resources = _get_ml_recommendations(skill, max_resources_per_skill)
        else:
            resources = get_resources_for_skill(skill, max_resources_per_skill)
        
        recommendations.append({
            "skill": skill,
            "resources": resources,
            "source": "ml_model" if use_ml else "curated",
        })
    
    return recommendations


def _get_ml_recommendations(skill: str, max_resources: int) -> List[Dict[str, Any]]:
    """Get recommendations using trained SVD model."""
    model_data = get_model("recommender")
    predictions = model_data["predictions"]
    skills = model_data["skills"]
    resources = model_data["resources"]
    skill_idx = model_data["skill_idx"]
    
    skill_lower = skill.lower()
    
    # If skill not in model, fall back to curated
    if skill_lower not in skill_idx:
        return get_resources_for_skill(skill, max_resources)
    
    idx = skill_idx[skill_lower]
    scores = predictions[idx]
    
    # Get top resources by score
    top_indices = np.argsort(scores)[::-1][:max_resources]
    
    result = []
    for i in top_indices:
        if scores[i] > 0:  # Only include positive scores
            resource = resources[i]
            # Handle if resource is a dict (from training script) or string
            if isinstance(resource, dict):
                title = resource.get("title", "Unknown Resource")
                r_type = resource.get("type", "course")
            else:
                title = resource
                r_type = "course" if "course" in title.lower() else "video"
                
            result.append({
                "title": title,
                "type": r_type,
                "url": resource.get("url", f"https://www.google.com/search?q={title.replace(' ', '+')}") if isinstance(resource, dict) else f"https://www.google.com/search?q={title.replace(' ', '+')}",
                "difficulty": resource.get("difficulty", "intermediate") if isinstance(resource, dict) else "intermediate",
                "duration_hours": float(resource.get("duration_hours", 10)) if isinstance(resource, dict) else 10.0,
                "provider": resource.get("provider", "Online Platform") if isinstance(resource, dict) else "Online Platform",
                "ml_score": float(scores[i]),
            })
    
    # If no ML results, fall back to curated
    if not result:
        return get_resources_for_skill(skill, max_resources)
    
    return result


def get_learning_roadmap(
    missing_skills: List[str],
    weeks: int = 4
) -> List[Dict[str, Any]]:
    """Generate a week-wise learning roadmap.
    
    Args:
        missing_skills: List of skills to learn
        weeks: Number of weeks for the roadmap (default: 4 for 30-day sprint)
        
    Returns:
        Week-by-week learning plan
    """
    if not missing_skills:
        return []
    
    return generate_learning_roadmap(missing_skills, weeks)


def get_priority_recommendations(
    missing_skills: List[Dict[str, Any]],
    max_total_resources: int = 10
) -> List[Dict[str, Any]]:
    """Get prioritized recommendations focusing on highest-impact skills first.
    
    Args:
        missing_skills: List of skill gaps with priority info
        max_total_resources: Maximum total resources to recommend
        
    Returns:
        Prioritized list of recommendations
    """
    # Sort by weight (highest priority first)
    sorted_gaps = sorted(
        missing_skills,
        key=lambda x: x.get("weight", 0),
        reverse=True
    )
    
    recommendations = []
    total_resources = 0
    
    for gap in sorted_gaps:
        if total_resources >= max_total_resources:
            break
        
        skill = gap.get("skill", "")
        resources = get_resources_for_skill(skill, max_resources=2)
        
        recommendations.append({
            "skill": skill,
            "priority": gap.get("priority", "unknown"),
            "resources": resources,
        })
        total_resources += len(resources)
    
    return recommendations
