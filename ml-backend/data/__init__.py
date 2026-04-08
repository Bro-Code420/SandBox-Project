"""Data layer with skill taxonomy, role definitions, resources, and dependencies."""

from .skill_taxonomy import SKILL_TAXONOMY, SKILL_ALIASES, normalize_skill, is_valid_skill
from .role_definitions import (
    ROLE_DEFINITIONS,
    SKILL_WEIGHTS,
    get_role,
    get_role_level,
    get_all_role_skills,
    list_available_roles,
)
from .learning_resources import (
    LEARNING_RESOURCES,
    get_resources_for_skill,
    get_resources_for_skills,
)
from .skill_dependencies import (
    SKILL_DEPENDENCIES,
    get_prerequisites,
    get_all_prerequisites,
    get_learning_hours,
    topological_sort,
    generate_learning_roadmap,
)
