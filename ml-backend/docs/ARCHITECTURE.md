# System Architecture

## Overview

The Career Readiness ML Backend is a FastAPI-based service that provides AI-driven career readiness analysis. It follows a layered architecture with clear separation between API, business logic, and data layers.

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client                                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     FastAPI Application                          │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                    API Layer (app/api/)                  │   │
│  │                  POST /inference/analyze                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                Service Layer (app/services/)             │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐    │   │
│  │  │Resume Parser │ │Role Intel    │ │Recommender   │    │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘    │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │              Pipeline Layer (app/pipelines/)             │   │
│  │                    SkillAnalyzer                         │   │
│  │               Readiness Computation                      │   │
│  └─────────────────────────────────────────────────────────┘   │
│                              │                                   │
│                              ▼                                   │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │                Model Layer (app/models/)                 │   │
│  │                   ReadinessModel                         │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      Data Layer (data/)                          │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐            │
│  │Skill Taxonomy│ │Role Defs     │ │Resources     │            │
│  └──────────────┘ └──────────────┘ └──────────────┘            │
│  ┌──────────────┐ ┌──────────────┐                              │
│  │Dependencies  │ │ML Artifacts  │                              │
│  └──────────────┘ └──────────────┘                              │
└─────────────────────────────────────────────────────────────────┘
```

## Component Details

### API Layer (`app/api/`)

**Responsibility**: HTTP request/response handling

- **main.py**: FastAPI application with routes
- Thin layer - only handles HTTP concerns
- Delegates business logic to services

### Service Layer (`app/services/`)

**Responsibility**: Business logic and orchestration

| Service | File | Purpose |
|---------|------|---------|
| Resume Parser | `resume_parser.py` | Extracts skills from text using keyword matching |
| Role Intelligence | `role_intelligence.py` | Provides role requirements by level |
| Recommendation | `recommendation_service.py` | Generates learning resource suggestions |
| Inference | `inference_service.py` | Connects API to pipeline |

### Pipeline Layer (`app/pipelines/`)

**Responsibility**: ML workflow orchestration

**pipeline.py** contains:
- `SkillAnalyzer`: Weighted skill matching with core/secondary/bonus
- `compute_readiness()`: Readiness prediction with explanations
- `run_pipeline()`: Main orchestration function

### Model Layer (`app/models/`)

**Responsibility**: ML model wrappers

- **readiness_model.py**: Wraps the trained Logistic Regression model
- Falls back to heuristic if no trained model exists

### Data Layer (`data/`)

**Responsibility**: Static data and configurations

| Module | Purpose |
|--------|---------|
| `skill_taxonomy.py` | 60+ recognized skills with aliases |
| `role_definitions.py` | 5 roles × 4 levels with weighted skills |
| `learning_resources.py` | Courses and YouTube mappings |
| `skill_dependencies.py` | Prerequisite graph and roadmap generation |

## Request Flow

```
1. Client sends POST /inference/analyze
                    │
                    ▼
2. API validates request (Pydantic schema)
                    │
                    ▼
3. inference_service.run_analysis() called
                    │
                    ▼
4. pipeline.run_pipeline() executes:
   │
   ├─► 4a. Extract skills from resume (if provided)
   │        └─► resume_parser.extract_skills_from_text()
   │
   ├─► 4b. Load role requirements (if role-based)
   │        └─► role_intelligence.get_role_intelligence()
   │
   ├─► 4c. Analyze skills
   │        └─► SkillAnalyzer.analyze()
   │            ├─► Match skills against requirements
   │            ├─► Calculate weighted score
   │            └─► Rank missing skills
   │
   ├─► 4d. Compute readiness
   │        └─► compute_readiness()
   │            ├─► ReadinessModel.predict_proba()
   │            └─► Generate explanation factors
   │
   ├─► 4e. Get recommendations
   │        └─► recommendation_service.get_skill_recommendations()
   │
   └─► 4f. Generate roadmap
            └─► recommendation_service.get_learning_roadmap()
                    │
                    ▼
5. Return AnalyzeResponse to client
```

## Skill Weighting System

Skills are categorized into three tiers with different weights:

```
┌─────────────────────────────────────────┐
│           CORE SKILLS (1.0)             │
│     Essential for the role              │
│     Must-have for job readiness         │
├─────────────────────────────────────────┤
│        SECONDARY SKILLS (0.6)           │
│     Important but not mandatory         │
│     Strengthens candidacy               │
├─────────────────────────────────────────┤
│          BONUS SKILLS (0.3)             │
│     Nice-to-have                        │
│     Differentiators                     │
└─────────────────────────────────────────┘
```

**Weighted Score Calculation:**
```
weighted_score = (matched_core × 1.0 + matched_secondary × 0.6 + matched_bonus × 0.3)
                 ─────────────────────────────────────────────────────────────────────
                 (total_core × 1.0 + total_secondary × 0.6 + total_bonus × 0.3)
```

## Skill Dependency Graph

Skills have prerequisite relationships for learning order:

```
                    ┌─────────┐
                    │  HTML   │
                    └────┬────┘
                         │
        ┌────────────────┼────────────────┐
        ▼                ▼                ▼
   ┌─────────┐      ┌─────────┐      ┌─────────┐
   │   CSS   │      │JavaScript│      │   ...   │
   └────┬────┘      └────┬────┘      └─────────┘
        │                │
        ▼                ├────────────────┐
   ┌─────────┐           ▼                ▼
   │Tailwind │      ┌─────────┐      ┌─────────┐
   └─────────┘      │TypeScript│     │  React  │
                    └────┬────┘      └────┬────┘
                         │                │
                         ▼                ▼
                    ┌─────────┐      ┌─────────┐
                    │ Angular │      │ Next.js │
                    └─────────┘      └─────────┘
```

## Model Loading

Models are loaded once at application startup:

```python
# app/core/startup.py
@app.on_event("startup")
async def startup_event():
    load_models_on_startup()  # Loads ml/artifacts/*.joblib into _MODELS dict

# Access via:
model = get_model("readiness")  # Returns loaded model or None
```

## Error Handling

```
┌──────────────────┐     ┌──────────────────┐     ┌──────────────────┐
│  Validation      │     │  Business Logic  │     │  System          │
│  Errors          │     │  Errors          │     │  Errors          │
├──────────────────┤     ├──────────────────┤     ├──────────────────┤
│  400 Bad Request │     │  422 Unprocess.  │     │  500 Internal    │
│  Pydantic errors │     │  Invalid role/   │     │  Unexpected      │
│                  │     │  level combos    │     │  exceptions      │
└──────────────────┘     └──────────────────┘     └──────────────────┘
```

## Scalability Considerations

### Current Design (MVP)
- Single-process, synchronous
- In-memory model loading
- Static data files

### Production Enhancements
- Model serving via dedicated service (TensorFlow Serving, TorchServe)
- Redis caching for role definitions and resources
- Async processing for heavy computations
- Horizontal scaling with load balancer
