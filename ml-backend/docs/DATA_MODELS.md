# Data Models

This document describes all data structures used in the API requests and responses.

## Request Models

### AnalyzeRequest

The main request body for career readiness analysis.

```python
class AnalyzeRequest(BaseModel):
    candidate_id: Optional[str] = None
    skills: List[str] = []
    resume_text: Optional[str] = None
    role_id: Optional[str] = None
    level: Optional[Literal["intern", "junior", "mid", "senior"]] = None
    target_role_skills: List[str] = []
    experience_years: float = 0.0
```

| Field | Type | Default | Description |
|-------|------|---------|-------------|
| `candidate_id` | string | null | Optional unique identifier |
| `skills` | string[] | [] | Candidate's current skills |
| `resume_text` | string | null | Resume text for skill extraction |
| `role_id` | string | null | Target role (e.g., "data_scientist") |
| `level` | enum | null | Experience level |
| `target_role_skills` | string[] | [] | Custom skill list (if not using role) |
| `experience_years` | float | 0.0 | Years of professional experience |

**Usage modes:**
1. **Role-based:** Provide `role_id` + `level`
2. **Custom:** Provide `target_role_skills`
3. **With resume:** Add `resume_text` to either mode

---

## Response Models

### AnalyzeResponse

The complete response from the analysis endpoint.

```python
class AnalyzeResponse(BaseModel):
    readiness_label: str
    readiness_score: float
    role_title: Optional[str] = None
    role_level: Optional[str] = None
    skill_analysis: SkillAnalysis
    explanation: ReadinessExplanation
    missing_skills: List[SkillGap]
    recommendations: List[SkillRecommendation]
    roadmap: List[RoadmapWeek]
    extracted_skills: Optional[List[str]] = None
```

---

### SkillAnalysis

Detailed breakdown of skill matching.

```python
class SkillAnalysis(BaseModel):
    matched_skills: List[str]
    matched_core: List[str]
    matched_secondary: List[str]
    matched_bonus: List[str]
    missing_skills: List[SkillGap]
    match_percentage: float
    weighted_score: float
```

| Field | Type | Description |
|-------|------|-------------|
| `matched_skills` | string[] | All matched skills |
| `matched_core` | string[] | Matched core skills |
| `matched_secondary` | string[] | Matched secondary skills |
| `matched_bonus` | string[] | Matched bonus skills |
| `missing_skills` | SkillGap[] | Skills not matched |
| `match_percentage` | float | Simple match ratio (0-1) |
| `weighted_score` | float | Weighted match score (0-1) |

---

### SkillGap

A missing skill with priority information.

```python
class SkillGap(BaseModel):
    skill: str
    priority: str  # "core", "secondary", "bonus"
    weight: float  # 1.0, 0.6, or 0.3
    rank: int      # Learning order
```

**Example:**
```json
{
  "skill": "scikit-learn",
  "priority": "core",
  "weight": 1.0,
  "rank": 1
}
```

---

### ReadinessExplanation

Explainable AI factors for the readiness score.

```python
class ReadinessExplanation(BaseModel):
    core_coverage: float
    secondary_coverage: float
    bonus_coverage: float
    experience_factor: float
    factors: List[str]
```

| Field | Type | Description |
|-------|------|-------------|
| `core_coverage` | float | % of core skills matched (0-1) |
| `secondary_coverage` | float | % of secondary skills matched |
| `bonus_coverage` | float | % of bonus skills matched |
| `experience_factor` | float | Experience contribution (0-1) |
| `factors` | string[] | Human-readable explanations |

**Example factors:**
- "Strong core skill coverage (80%)"
- "Some experience (2.5 years)"
- "Overall skill profile is strong"

---

### SkillRecommendation

Learning resources for a skill.

```python
class SkillRecommendation(BaseModel):
    skill: str
    resources: List[LearningResource]
```

---

### LearningResource

A single learning resource (course or video).

```python
class LearningResource(BaseModel):
    type: str           # "course" or "youtube"
    title: str
    provider: Optional[str] = None  # For courses
    channel: Optional[str] = None   # For YouTube
    url: str
    difficulty: str     # "beginner", "intermediate", "advanced"
    duration_hours: float
```

**Example:**
```json
{
  "type": "course",
  "title": "Machine Learning by Andrew Ng",
  "provider": "Coursera",
  "url": "https://www.coursera.org/learn/machine-learning",
  "difficulty": "intermediate",
  "duration_hours": 60
}
```

---

### RoadmapWeek

A week in the 30-day learning plan.

```python
class RoadmapWeek(BaseModel):
    week: int
    skills: List[str]
    estimated_hours: float
    focus: str
```

| Field | Type | Description |
|-------|------|-------------|
| `week` | int | Week number (1-4) |
| `skills` | string[] | Skills to learn this week |
| `estimated_hours` | float | Total hours for the week |
| `focus` | str | Primary focus skill |

**Example:**
```json
{
  "week": 1,
  "skills": ["git", "docker"],
  "estimated_hours": 30,
  "focus": "git"
}
```

---

## Internal Data Models

### Role Definition Structure

```python
{
    "title": "Data Scientist",
    "domain": "Data Science",
    "levels": {
        "junior": {
            "experience_range": (0, 2),
            "skills": {
                "core": ["python", "pandas", "numpy", "scikit-learn"],
                "secondary": ["sql", "data visualization", "machine learning"],
                "bonus": ["tensorflow", "git", "docker"]
            },
            "readiness_threshold": 0.65
        }
    }
}
```

### Skill Dependency Structure

```python
{
    "react": ["javascript", "html", "css"],
    "next.js": ["react"],
    "scikit-learn": ["pandas", "numpy"],
    "machine learning": ["scikit-learn"]
}
```

### Learning Resource Structure

```python
{
    "python": [
        {
            "type": "course",
            "title": "Python for Everybody",
            "provider": "Coursera",
            "url": "https://...",
            "difficulty": "beginner",
            "duration_hours": 40
        },
        {
            "type": "youtube",
            "title": "Python Tutorial",
            "channel": "freeCodeCamp",
            "url": "https://...",
            "difficulty": "beginner",
            "duration_hours": 6
        }
    ]
}
```

---

## JSON Schema (OpenAPI)

Access the full JSON schema at:
- **Swagger UI:** http://localhost:8000/docs
- **OpenAPI JSON:** http://localhost:8000/openapi.json
