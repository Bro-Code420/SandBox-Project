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
    
    If `perform_heavy_search` is False, it skips the YouTube API to save time 
    and only returns structured Deep-Links.
    """
    skill_lower = skill.strip()
    encoded_skill = skill_lower.replace(" ", "+")
    
    resources = []
    
    # 1. Real-time YouTube scraping (Only if performing heavy search)
    if perform_heavy_search:
        yt_resources = search_youtube_realtime(skill_lower, limit=2)
        
        if yt_resources:
            resources.extend(yt_resources)
        else:
            # Fallback if API fails
            resources.append({
                "type": "youtube",
                "title": f"Explore {skill} on YouTube",
                "channel": "YouTube Search",
                "url": f"https://www.youtube.com/results?search_query={encoded_skill}+tutorial",
                "difficulty": "beginner",
                "duration_hours": 10,
                "reason": "Direct search link provided as the connection to YouTube timed out."
            })
    
    # 2. Dynamic Deep-Links to Premium Platforms
    udemy_resource = {
        "type": "course",
        "title": f"Top Rated {skill} Courses",
        "provider": "Udemy",
        "url": f"https://www.udemy.com/courses/search/?q={encoded_skill}",
        "difficulty": "beginner",
        "duration_hours": 15,
        "reason": "Udemy often has incredible project-based, deeply structured courses."
    }
    
    coursera_resource = {
        "type": "course",
        "title": f"Professional {skill} Certifications",
        "provider": "Coursera",
        "url": f"https://www.coursera.org/search?query={encoded_skill}",
        "difficulty": "intermediate",
        "duration_hours": 20,
        "reason": "Coursera is optimal for academic theory and strict certifications."
    }
    
    resources.append(random.choice([udemy_resource, coursera_resource]))
    
    return resources[:max_resources]

def get_resources_for_skills(skills: List[str], max_per_skill: int = 2) -> Dict[str, List[Dict[str, Any]]]:
    """Get learning resources for multiple skills.
    
    Currently assumes all requests are heavy. `recommendation_service` handles capping priorities.
    """
    return {
        skill: get_resources_for_skill(skill, max_per_skill, perform_heavy_search=True)
        for skill in skills
    }

