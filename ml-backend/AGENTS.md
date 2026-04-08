# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Career Readiness ML Backend - A FastAPI service that analyzes candidate skills against target roles, detects skill gaps, predicts career readiness, and generates personalized learning roadmaps.

## Development Commands

### Setup (PowerShell)
```powershell
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### Train Models
```powershell
python scripts/train_all.py
```
Creates `ml/artifacts/readiness_v1.joblib`. Must run before inference works with trained model.

### Run Server
```powershell
uvicorn app.api.main:app --reload --port 8000
```

### Run Tests
```powershell
$env:PYTHONPATH = "." ; pytest tests/ -v
```

### Smoke Test (no server required)
```powershell
$env:PYTHONPATH = "." ; python scripts/smoke_test.py
```

## Architecture

### Request Flow
`POST /inference/analyze` → `inference_service` → `pipeline.run_pipeline()` → (resume parsing → role intelligence → skill analysis → readiness prediction → recommendations → roadmap)

### Layer Responsibilities
- **app/api/**: FastAPI routes - thin request/response handling only
- **app/services/**: Business logic services:
  - `resume_parser.py`: Keyword-based skill extraction from resume text
  - `role_intelligence.py`: Role-level skill requirements (Intern/Junior/Mid/Senior)
  - `recommendation_service.py`: Learning resource recommendations
  - `inference_service.py`: Connects API to pipeline
- **app/pipelines/pipeline.py**: Main orchestrator with `SkillAnalyzer` class for weighted matching
- **app/models/**: ML model wrappers (get loaded models from `startup._MODELS`)
- **app/schemas/**: Pydantic request/response validation
- **app/core/startup.py**: Loads joblib models at startup into global `_MODELS` dict
- **data/**: Static data layer:
  - `skill_taxonomy.py`: Predefined skills for extraction/matching
  - `role_definitions.py`: Job roles with level-specific skill weights (core/secondary/bonus)
  - `learning_resources.py`: Course & YouTube playlist mappings
  - `skill_dependencies.py`: Prerequisite graph for learning order
- **ml/training/**: Offline training scripts (not used during inference)
- **ml/artifacts/**: Saved model files (joblib format)

### API Modes
The `/inference/analyze` endpoint supports two modes:
1. **Role-based** (recommended): Provide `role_id` + `level` to use predefined skill weights
2. **Custom**: Provide `target_role_skills` directly (backward compatible)

Optionally provide `resume_text` to extract skills automatically.

### Skill Weighting System
Role skills are categorized with weights:
- **Core** (1.0): Essential skills
- **Secondary** (0.6): Important but not mandatory
- **Bonus** (0.3): Nice to have

### Readiness Thresholds
Per project docs:
- **>80%** → "Industry Ready"
- **60-80%** → "Almost Ready"
- **<60%** → "Needs Upskilling"

### Pipeline Steps
`run_pipeline()` in `app/pipelines/pipeline.py`:
1. Extract skills from resume (if provided)
2. Load role requirements (if role-based)
3. Compute weighted skill matching with `SkillAnalyzer`
4. Rank missing skills by priority and dependency order
5. Predict readiness with explainable factors
6. Generate resource recommendations
7. Create 30-day learning roadmap

### Available Roles
- `frontend_developer`, `backend_developer`, `fullstack_developer`, `data_scientist`, `devops_engineer`
- Each with levels: `intern`, `junior`, `mid`, `senior`
