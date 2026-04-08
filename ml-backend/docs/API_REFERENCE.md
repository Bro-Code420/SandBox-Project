# API Reference

## Base URL

```
http://localhost:8000
```

## Endpoints

### POST /inference/analyze

Analyzes candidate skills against a target role and returns career readiness assessment.

#### Request Body

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `candidate_id` | string | No | Optional identifier for the candidate |
| `skills` | string[] | No* | List of candidate's skills |
| `resume_text` | string | No* | Resume text for automatic skill extraction |
| `role_id` | string | No** | Target role identifier |
| `level` | string | No** | Experience level: `intern`, `junior`, `mid`, `senior` |
| `target_role_skills` | string[] | No** | Custom list of required skills |
| `experience_years` | float | No | Years of experience (default: 0.0) |

*Either `skills` or `resume_text` (or both) should be provided.
**Either (`role_id` + `level`) OR `target_role_skills` should be provided.

#### Available Roles

| role_id | Title |
|---------|-------|
| `frontend_developer` | Frontend Developer |
| `backend_developer` | Backend Developer |
| `fullstack_developer` | Full Stack Developer |
| `data_scientist` | Data Scientist |
| `devops_engineer` | DevOps Engineer |

#### Example Requests

**Role-based analysis (recommended):**
```json
{
  "candidate_id": "user-123",
  "skills": ["python", "pandas", "numpy", "sql"],
  "role_id": "data_scientist",
  "level": "junior",
  "experience_years": 1.5
}
```

**With resume text:**
```json
{
  "resume_text": "Software engineer with 3 years experience in Python, JavaScript, React, and AWS. Built REST APIs and worked with PostgreSQL.",
  "role_id": "fullstack_developer",
  "level": "junior",
  "experience_years": 3.0
}
```

**Custom skill list (backward compatible):**
```json
{
  "skills": ["python", "pandas"],
  "target_role_skills": ["python", "sql", "aws", "docker"],
  "experience_years": 2.0
}
```

#### Response

```json
{
  "readiness_label": "Almost Ready",
  "readiness_score": 0.65,
  "role_title": "Data Scientist",
  "role_level": "junior",
  "skill_analysis": {
    "matched_skills": ["python", "pandas", "numpy", "sql"],
    "matched_core": ["python", "pandas", "numpy"],
    "matched_secondary": ["sql"],
    "matched_bonus": [],
    "missing_skills": [
      {"skill": "scikit-learn", "priority": "core", "weight": 1.0, "rank": 1},
      {"skill": "machine learning", "priority": "secondary", "weight": 0.6, "rank": 2}
    ],
    "match_percentage": 0.4,
    "weighted_score": 0.537
  },
  "explanation": {
    "core_coverage": 0.75,
    "secondary_coverage": 0.33,
    "bonus_coverage": 0.0,
    "experience_factor": 0.3,
    "factors": [
      "Moderate core skill coverage (75%)",
      "Some experience (1.5 years)",
      "Skill profile needs improvement in key areas"
    ]
  },
  "missing_skills": [
    {"skill": "scikit-learn", "priority": "core", "weight": 1.0, "rank": 1}
  ],
  "recommendations": [
    {
      "skill": "scikit-learn",
      "resources": [
        {
          "type": "course",
          "title": "Scikit-Learn For Machine Learning",
          "provider": "Udemy",
          "url": "https://www.udemy.com/course/machine-learning-with-scikit-learn/",
          "difficulty": "intermediate",
          "duration_hours": 8
        },
        {
          "type": "youtube",
          "title": "Scikit-Learn Tutorial",
          "channel": "freeCodeCamp",
          "url": "https://www.youtube.com/watch?v=0B5eIE_1vpU",
          "difficulty": "beginner",
          "duration_hours": 3
        }
      ]
    }
  ],
  "roadmap": [
    {
      "week": 1,
      "skills": ["git", "docker"],
      "estimated_hours": 30,
      "focus": "git"
    },
    {
      "week": 2,
      "skills": ["scikit-learn"],
      "estimated_hours": 25,
      "focus": "scikit-learn"
    }
  ],
  "extracted_skills": ["python", "javascript", "react", "aws"]
}
```

#### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `readiness_label` | string | "Industry Ready", "Almost Ready", or "Needs Upskilling" |
| `readiness_score` | float | 0.0 to 1.0 readiness probability |
| `role_title` | string | Human-readable role name (if role-based) |
| `role_level` | string | Experience level (if role-based) |
| `skill_analysis` | object | Detailed skill matching breakdown |
| `explanation` | object | Explainable AI factors |
| `missing_skills` | array | Skills needed with priority and rank |
| `recommendations` | array | Learning resources per skill |
| `roadmap` | array | Week-by-week learning plan |
| `extracted_skills` | array | Skills extracted from resume (if provided) |

#### Readiness Thresholds

| Score | Label |
|-------|-------|
| ≥ 80% | Industry Ready |
| 60-79% | Almost Ready |
| < 60% | Needs Upskilling |

#### Error Responses

**400 Bad Request:**
```json
{
  "detail": "Validation error message"
}
```

**500 Internal Server Error:**
```json
{
  "detail": "Error description"
}
```

## Testing the API

### Using cURL

```bash
curl -X POST http://localhost:8000/inference/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "skills": ["python", "pandas"],
    "role_id": "data_scientist",
    "level": "intern",
    "experience_years": 0.5
  }'
```

### Using Python requests

```python
import requests

response = requests.post(
    "http://localhost:8000/inference/analyze",
    json={
        "skills": ["python", "pandas"],
        "role_id": "data_scientist",
        "level": "intern",
        "experience_years": 0.5
    }
)
print(response.json())
```

### Using FastAPI TestClient

```python
from fastapi.testclient import TestClient
from app.api.main import app

client = TestClient(app)
response = client.post("/inference/analyze", json={
    "skills": ["python", "pandas"],
    "role_id": "data_scientist",
    "level": "intern"
})
```

## Interactive Documentation

When the server is running, access:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Framework Integration Guides

- **[Next.js Integration Guide](./NEXTJS_INTEGRATION.md)** - Complete guide with TypeScript types, hooks, components, and best practices for Next.js 13+ (App Router & Pages Router)
