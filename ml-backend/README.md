# Career Readiness ML Backend

AI-powered career readiness analyzer that evaluates candidate skills against job roles and provides personalized learning recommendations.

## Features

- **Role-Based Analysis**: Evaluate skills against 5 job roles × 4 experience levels
- **Weighted Skill Matching**: Core, secondary, and bonus skill categorization
- **Resume Parsing**: Automatic skill extraction using TF-IDF + ML classifier
- **Explainable AI**: Transparent scoring with factor-based explanations
- **Learning Recommendations**: Curated courses and YouTube playlists via SVD-based recommender
- **30-Day Roadmap**: Week-wise learning plan based on skill dependencies

## ML Models

| Model | Algorithm | Purpose |
|-------|-----------|--------|
| Readiness | LogisticRegression | Predicts job readiness probability |
| Skill Extractor | TF-IDF + OneVsRest Classifier | Extracts skills from resume text |
| Skill Matcher | Sentence Transformers | Semantic skill matching |
| Gap Ranker | XGBoost | Ranks missing skills by learning priority |
| Recommender | TruncatedSVD | Recommends learning resources |

## Quick Start (Windows PowerShell)

```powershell
# 1. Setup environment
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt

# 2. Train all ML models
$env:PYTHONPATH = "."
python scripts/train_all.py

# 3. Run smoke test (no server required)
python scripts/smoke_test.py

# 4. Start the server
uvicorn app.api.main:app --reload --port 8000
```

## API Endpoint

### POST /inference/analyze

```json
{
  "skills": ["python", "pandas", "sql"],
  "role_id": "data_scientist",
  "level": "junior",
  "experience_years": 1.5,
  "resume_text": "Optional resume text..."
}
```

**Response includes:**
- Readiness score and label (Industry Ready / Almost Ready / Needs Upskilling)
- Skill analysis (matched/missing skills by category)
- Explainable AI factors
- Learning recommendations with courses and YouTube links
- 30-day learning roadmap

## Documentation

| Document | Description |
|----------|-------------|
| [API Reference](./docs/API_REFERENCE.md) | Complete endpoint documentation |
| [Next.js Integration](./docs/NEXTJS_INTEGRATION.md) | TypeScript types, hooks, and components for Next.js |
| [Architecture](./docs/ARCHITECTURE.md) | System design and data flow |
| [ML Models](./docs/ML_MODELS.md) | Detailed model documentation |
| [Setup Guide](./docs/SETUP_GUIDE.md) | Installation instructions |

## Available Roles

- `frontend_developer`
- `backend_developer`
- `fullstack_developer`
- `data_scientist`
- `devops_engineer`

Each with levels: `intern`, `junior`, `mid`, `senior`

## Interactive Docs

When server is running:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

