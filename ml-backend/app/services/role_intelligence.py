"""Role intelligence service for job role requirements.

Provides role-specific skill requirements that adapt based on experience level.
"""

from typing import Dict, List, Any, Optional, Tuple
from data.role_definitions import (
    ROLE_DEFINITIONS,
    SKILL_WEIGHTS,
    get_role,
    get_role_level,
    list_available_roles,
)


class RoleIntelligence:
    """Service for accessing role-specific requirements."""
    
    def __init__(self, role_id: str, level: str):
        """Initialize with a specific role and level.
        
        Args:
            role_id: Role identifier (e.g., "frontend_developer")
            level: Experience level ("intern", "junior", "mid", "senior")
        """
        self.role_id = role_id
        self.level = level
        self._role = get_role(role_id)
        self._level_def = get_role_level(role_id, level)
        
        if not self._role:
            raise ValueError(f"Unknown role: {role_id}")
        if not self._level_def:
            raise ValueError(f"Unknown level '{level}' for role '{role_id}'")
    
    @property
    def title(self) -> str:
        """Get role title."""
        return self._role["title"]
    
    @property
    def domain(self) -> str:
        """Get role domain."""
        return self._role["domain"]
    
    @property
    def experience_range(self) -> Tuple[int, int]:
        """Get expected experience range for this level."""
        return self._level_def["experience_range"]
    
    @property
    def readiness_threshold(self) -> float:
        """Get readiness threshold for this level."""
        return self._level_def["readiness_threshold"]
    
    @property
    def core_skills(self) -> List[str]:
        """Get core (essential) skills."""
        return self._level_def["skills"]["core"]
    
    @property
    def secondary_skills(self) -> List[str]:
        """Get secondary (important) skills."""
        return self._level_def["skills"]["secondary"]
    
    @property
    def bonus_skills(self) -> List[str]:
        """Get bonus (nice-to-have) skills."""
        return self._level_def["skills"]["bonus"]
    
    @property
    def all_skills(self) -> List[str]:
        """Get all skills for this role level."""
        return self.core_skills + self.secondary_skills + self.bonus_skills
    
    def get_skill_priority(self, skill: str) -> Tuple[str, float]:
        """Get the priority category and weight for a skill.
        
        Returns:
            Tuple of (priority, weight) where priority is "core"/"secondary"/"bonus"
            and weight is 1.0/0.6/0.3
        """
        skill_lower = skill.lower().strip()
        
        if skill_lower in [s.lower() for s in self.core_skills]:
            return ("core", SKILL_WEIGHTS["core"])
        elif skill_lower in [s.lower() for s in self.secondary_skills]:
            return ("secondary", SKILL_WEIGHTS["secondary"])
        elif skill_lower in [s.lower() for s in self.bonus_skills]:
            return ("bonus", SKILL_WEIGHTS["bonus"])
        else:
            return ("unknown", 0.0)
    
    def get_weighted_skill_list(self) -> List[Dict[str, Any]]:
        """Get all skills with their priorities and weights."""
        result = []
        
        for skill in self.core_skills:
            result.append({"skill": skill, "priority": "core", "weight": SKILL_WEIGHTS["core"]})
        for skill in self.secondary_skills:
            result.append({"skill": skill, "priority": "secondary", "weight": SKILL_WEIGHTS["secondary"]})
        for skill in self.bonus_skills:
            result.append({"skill": skill, "priority": "bonus", "weight": SKILL_WEIGHTS["bonus"]})
        
        return result


def get_role_intelligence(role_id: str, level: str) -> Optional[RoleIntelligence]:
    """Factory function to get role intelligence.
    
    Args:
        role_id: Role identifier
        level: Experience level
        
    Returns:
        RoleIntelligence instance or None if invalid role/level
    """
    try:
        return RoleIntelligence(role_id, level)
    except ValueError:
        return None


def get_available_roles() -> List[Dict[str, str]]:
    """Get list of available roles."""
    return list_available_roles()


def get_available_levels() -> List[str]:
    """Get list of available experience levels."""
    return ["intern", "junior", "mid", "senior"]
