# Career Readiness ML Backend Documentation

Welcome to the documentation for the Career Readiness ML Backend - an AI-driven career readiness analyzer that evaluates skills against job roles and provides personalized learning recommendations.

## Documentation Index

| Document | Description |
|----------|-------------|
| [API Reference](./API_REFERENCE.md) | Complete API endpoint documentation with examples |
| [Next.js Integration](./NEXTJS_INTEGRATION.md) | **NEW** Detailed guide for integrating with Next.js |
| [Architecture](./ARCHITECTURE.md) | System design, components, and data flow |
| [Setup Guide](./SETUP_GUIDE.md) | Installation and configuration instructions |
| [Role Definitions](./ROLE_DEFINITIONS.md) | Available job roles and skill requirements |
| [Data Models](./DATA_MODELS.md) | Request/response schemas and data structures |
| [ML Models](./ML_MODELS.md) | Machine learning models and algorithms used |
| [Development Guide](./DEVELOPMENT_GUIDE.md) | Contributing, testing, and extending the system |

## Quick Start

```powershell
# 1. Setup environment
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt

# 2. Train models
python scripts/train_all.py

# 3. Run server
$env:PYTHONPATH = "."
uvicorn app.api.main:app --reload --port 8000

# 4. Test the API
curl -X POST http://localhost:8000/inference/analyze \
  -H "Content-Type: application/json" \
  -d '{"skills": ["python", "pandas"], "role_id": "data_scientist", "level": "junior", "experience_years": 2}'
```

## Key Features

- **Role-Based Analysis**: Evaluate skills against 5 job roles × 4 experience levels
- **Weighted Skill Matching**: Core, secondary, and bonus skill categorization
- **Resume Parsing**: Automatic skill extraction from resume text
- **Explainable AI**: Transparent scoring with factor-based explanations
- **Learning Recommendations**: Curated courses and YouTube playlists
- **30-Day Roadmap**: Week-wise learning plan based on skill dependencies

## Project Structure

```
ml-backend/
├── app/                    # FastAPI application
│   ├── api/               # API routes
│   ├── core/              # Configuration and startup
│   ├── models/            # ML model wrappers
│   ├── pipelines/         # Analysis orchestration
│   ├── schemas/           # Pydantic models
│   └── services/          # Business logic
├── data/                   # Static data layer
│   ├── skill_taxonomy.py  # Skill definitions
│   ├── role_definitions.py # Job role requirements
│   ├── learning_resources.py # Course/video mappings
│   └── skill_dependencies.py # Learning order graph
├── ml/                     # Machine learning
│   ├── training/          # Training scripts
│   └── artifacts/         # Saved models
├── scripts/                # Utility scripts
├── tests/                  # Unit tests
└── docs/                   # Documentation (you are here)
```

## Support

For issues or questions, refer to the project README or open an issue in the repository.
