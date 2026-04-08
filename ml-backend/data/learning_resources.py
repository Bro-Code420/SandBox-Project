"""Learning resources database for skill-based recommendations.

Dynamically fetches robust, real-time recommendations using YouTube search
and constructs deep-links for Udemy/Coursera.
"""

import random
from typing import Dict, List, Any
from functools import lru_cache
from youtubesearchpython import VideosSearch

def parse_duration_to_hours(duration_str: str) -> float:
    """Safely parse YouTube duration strings ('1:20:00' or '15:30') to hours."""
    try:
        parts = duration_str.split(':')
        if len(parts) == 3:  # HH:MM:SS
            return int(parts[0]) + int(parts[1])/60.0
        elif len(parts) == 2:  # MM:SS
            return int(parts[0])/60.0
        return 1.0
    except (ValueError, TypeError):
        return 1.0

@lru_cache(maxsize=100)
def search_youtube_realtime(skill: str, limit: int = 2) -> List[Dict[str, Any]]:
    """Cached real-time search to ping Youtube for the best courses on the requested skill."""
    # Rotate between specific queries to get richer variety
    queries = [
        f"{skill} full course tutorial beginner to advanced",
        f"{skill} crash course project 2024"
    ]
    
    videos = []
    # We'll just grab the best result from a smart query
    try:
        # We grab top 3 from the first intelligent query
        search = VideosSearch(queries[0], limit=limit)
        results = search.result().get('result', [])
        
        for vid in results:
            duration = parse_duration_to_hours(vid.get('duration', '2:00:00'))
            # Provide an AI/System rationale based on the metadata
            reason = "Recommended comprehensive tutorial suitable for deep-dives."
            if duration < 2.0:
                reason = "Quick crash course excellent for rapid foundational understanding."
                
            videos.append({
                "type": "youtube",
                "title": vid.get('title', f'{skill} Tutorial'),
                "channel": vid.get('channel', {}).get('name', 'YouTube Creator'),
                "url": vid.get('link', f'https://www.youtube.com/results?search_query={skill}'),
                "difficulty": "beginner" if duration < 3.0 else "intermediate",
                "duration_hours": round(duration, 1),
                "reason": reason
            })
            
        return videos
    except Exception as e:
        print(f"YouTube Search Error for {skill}: {e}")
        return []

def get_resources_for_skill(skill: str, max_resources: int = 3, perform_heavy_search: bool = True) -> List[Dict[str, Any]]:
    """Get learning resources for a skill dynamically.
    
    Ensures a balanced mix of YouTube and Course (Udemy/Coursera) content.
    """
    skill_lower = skill.strip()
    encoded_skill = skill_lower.replace(" ", "+")
    
    # Calculate distribution
    # For max_resources=3 (default), we want 2 YouTube and 1 Course or vice-versa
    yt_target = max(1, max_resources - 1)
    
    resources = []
    
    # 1. Real-time YouTube scraping
    if perform_heavy_search:
        yt_resources = search_youtube_realtime(skill_lower, limit=yt_target)
        if yt_resources:
            resources.extend(yt_resources)
    
    # Fallback/Safety: If no YouTube resources found but requested, add a direct link
    if not any(r['type'] == 'youtube' for r in resources):
        resources.append({
            "type": "youtube",
            "title": f"The Ultimate {skill} Guide (YouTube)",
            "channel": "YouTube Search",
            "url": f"https://www.youtube.com/results?search_query={encoded_skill}+tutorial",
            "difficulty": "beginner",
            "duration_hours": 5.0,
            "reason": "Direct search link to the most relevant community tutorials."
        })
    
    # 2. Dynamic Deep-Links to Premium Platforms (Always add as courses)
    # We add BOTH to allow the final slice to pick at least one
    resources.append({
        "type": "course",
        "title": f"Top Rated {skill} Courses",
        "provider": "Udemy",
        "url": f"https://www.udemy.com/courses/search/?q={encoded_skill}",
        "difficulty": "beginner",
        "duration_hours": 15,
        "reason": "Udemy offers project-based, deeply structured professional courses."
    })
    
    resources.append({
        "type": "course",
        "title": f"Professional {skill} Certifications",
        "provider": "Coursera",
        "url": f"https://www.coursera.org/search?query={encoded_skill}",
        "difficulty": "intermediate",
        "duration_hours": 20,
        "reason": "Coursera is optimal for academic theory and verified certifications."
    })
    
    # Final assembly: Ensure variety by sorting or interleaving if needed
    # But simple slicing usually works if we have enough of both
    
    # Prioritize having at least one of each in the top results
    final_list = []
    has_yt = False
    has_course = False
    
    # First pass: try to get one of each
    for r in resources:
        if r['type'] == 'youtube' and not has_yt:
            final_list.append(r)
            has_yt = True
        elif r['type'] == 'course' and not has_course:
            final_list.append(r)
            has_course = True
            
        if len(final_list) >= 2: break
        
    # Second pass: fill remaining slots
    for r in resources:
        if r not in final_list:
            final_list.append(r)
        if len(final_list) >= max_resources: break
        
    return final_list[:max_resources]

def get_resources_for_skills(skills: List[str], max_per_skill: int = 2) -> Dict[str, List[Dict[str, Any]]]:
    """Get learning resources for multiple skills.
    
    Currently assumes all requests are heavy. `recommendation_service` handles capping priorities.
    """
    return {
        skill: get_resources_for_skill(skill, max_per_skill, perform_heavy_search=True)
        for skill in skills
    }

