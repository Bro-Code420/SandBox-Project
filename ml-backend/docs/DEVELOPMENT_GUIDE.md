# Development Guide

This guide covers contributing to, testing, and extending the Career Readiness ML Backend.

## Project Structure

```
ml-backend/
├── app/                        # FastAPI application
│   ├── api/
│   │   └── main.py            # API routes and app setup
│   ├── core/
│   │   ├── config.py          # Configuration settings
│   │   └── startup.py         # Model loading at startup
│   ├── models/
│   │   └── readiness_model.py # ML model wrapper
│   ├── pipelines/
│   │   └── pipeline.py        # Main analysis orchestration
│   ├── schemas/
│   │   ├── request.py         # Request Pydantic models
│   │   └── response.py        # Response Pydantic models
│   └── services/
│       ├── inference_service.py    # API to pipeline connector
│       ├── resume_parser.py        # Skill extraction
│       ├── role_intelligence.py    # Role requirements
│       └── recommendation_service.py # Learning resources
├── data/                       # Static data layer
│   ├── __init__.py
│   ├── skill_taxonomy.py      # All recognized skills
│   ├── role_definitions.py    # Role requirements
│   ├── learning_resources.py  # Course/video mappings
│   └── skill_dependencies.py  # Prerequisite graph
├── ml/                         # Machine learning
│   ├── training/
│   │   └── train_readiness.py # Training script
│   └── artifacts/             # Saved models
├── scripts/
│   ├── train_all.py           # Train all models
│   └── smoke_test.py          # End-to-end test
├── tests/
│   └── test_api.py            # Unit tests
├── docs/                       # Documentation
├── requirements.txt
└── README.md
```

## Development Setup

### 1. Clone and Setup

```powershell
git clone <repo-url>
cd ml-backend
python -m venv venv
venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

### 2. Install Dev Dependencies

```powershell
pip install pytest pytest-cov black isort mypy
```

### 3. Train Model

```powershell
python ml/training/train_readiness.py
```

### 4. Run Development Server

```powershell
$env:PYTHONPATH = "."
uvicorn app.api.main:app --reload --port 8000
```

---

## Code Style

### Formatting
```powershell
# Format with Black
black app/ data/ tests/

# Sort imports
isort app/ data/ tests/
```

### Type Checking
```powershell
mypy app/ --ignore-missing-imports
```

### Linting
```powershell
pip install ruff
ruff check app/ data/
```

---

## Testing

### Run All Tests
```powershell
$env:PYTHONPATH = "."
pytest tests/ -v
```

### Run Specific Test
```powershell
pytest tests/test_api.py::test_analyze_endpoint_role_based -v
```

### With Coverage
```powershell
pytest tests/ --cov=app --cov-report=html
# Open htmlcov/index.html in browser
```

### Smoke Test
```powershell
python scripts/smoke_test.py
```

---

## Adding New Features

### Adding a New Role

1. Edit `data/role_definitions.py`:

```python
ROLE_DEFINITIONS["mobile_developer"] = {
    "title": "Mobile Developer",
    "domain": "Mobile Development",
    "levels": {
        "intern": {
            "experience_range": (0, 1),
            "skills": {
                "core": ["javascript", "react"],
                "secondary": ["git"],
                "bonus": ["typescript"],
            },
            "readiness_threshold": 0.6,
        },
        "junior": { ... },
        "mid": { ... },
        "senior": { ... },
    },
}
```

2. Ensure skills exist in `data/skill_taxonomy.py`

3. Add tests in `tests/test_api.py`

### Adding a New Skill

1. Add to `data/skill_taxonomy.py`:

```python
SKILL_TAXONOMY = {
    ...,
    "flutter",  # New skill
    "dart",
}

SKILL_ALIASES = {
    ...,
    "rn": "react native",  # Alias
}
```

2. Add dependencies in `data/skill_dependencies.py`:

```python
SKILL_DEPENDENCIES = {
    ...,
    "flutter": ["dart"],
    "react native": ["javascript", "react"],
}

SKILL_LEARNING_HOURS = {
    ...,
    "flutter": 40,
    "dart": 30,
}
```

3. Add resources in `data/learning_resources.py`:

```python
LEARNING_RESOURCES = {
    ...,
    "flutter": [
        {
            "type": "course",
            "title": "Flutter & Dart Complete Guide",
            "provider": "Udemy",
            "url": "https://...",
            "difficulty": "intermediate",
            "duration_hours": 40,
        },
    ],
}
```

### Adding a New Service

1. Create service file in `app/services/`:

```python
# app/services/my_service.py
from typing import List, Dict

def my_function(param: str) -> Dict:
    """Service function description."""
    return {"result": param}
```

2. Import in pipeline if needed:

```python
# app/pipelines/pipeline.py
from app.services.my_service import my_function
```

3. Add tests:

```python
# tests/test_my_service.py
def test_my_function():
    result = my_function("test")
    assert result["result"] == "test"
```

### Adding a New API Endpoint

1. Add route in `app/api/main.py`:

```python
@app.get("/roles")
async def list_roles():
    """List all available roles."""
    from data.role_definitions import list_available_roles
    return list_available_roles()
```

2. Add schema if needed in `app/schemas/`:

```python
class RoleListResponse(BaseModel):
    roles: List[RoleInfo]
```

3. Add tests:

```python
def test_list_roles():
    response = client.get("/roles")
    assert response.status_code == 200
```

---

## Training New Models

### Modify Training Script

Edit `ml/training/train_readiness.py`:

```python
def create_synthetic_dataset(n=1000):
    # Modify data generation logic
    pass

def train_and_save(path: Path):
    # Try different models
    from sklearn.ensemble import RandomForestClassifier
    model = RandomForestClassifier(n_estimators=100)
    model.fit(X, y)
    dump(model, path)
```

### Add New Model Type

1. Create training script:

```python
# ml/training/train_new_model.py
def train_new_model():
    # Training logic
    pass
```

2. Create wrapper in `app/models/`:

```python
# app/models/new_model.py
class NewModel:
    def __init__(self):
        self._model = get_model("new_model")
    
    def predict(self, features):
        return self._model.predict(features)
```

3. Load at startup in `app/core/startup.py`:

```python
def load_models_on_startup():
    # Existing
    readiness_path = ARTIFACTS_DIR / "readiness_v1.joblib"
    if readiness_path.exists():
        _MODELS["readiness"] = load(readiness_path)
    
    # New model
    new_path = ARTIFACTS_DIR / "new_model_v1.joblib"
    if new_path.exists():
        _MODELS["new_model"] = load(new_path)
```

---

## Debugging

### Enable Debug Logging

```python
import logging
logging.basicConfig(level=logging.DEBUG)
```

### Test Individual Components

```python
# In Python REPL
>>> from app.services.resume_parser import extract_skills_from_text
>>> skills = extract_skills_from_text("I know Python and React")
>>> print(skills)
['python', 'react']
```

### Inspect Request/Response

Enable FastAPI debug mode for detailed errors:

```powershell
uvicorn app.api.main:app --reload --log-level debug
```

---

## API Documentation

FastAPI automatically generates documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

---

## Git Workflow

### Branch Naming
- `feature/add-new-role`
- `fix/skill-matching-bug`
- `docs/update-readme`

### Commit Messages
```
feat: add mobile developer role
fix: correct skill matching weights
docs: update API reference
test: add role-based analysis tests
```

### Before Committing
```powershell
# Format code
black app/ data/ tests/

# Run tests
pytest tests/ -v

# Check types
mypy app/ --ignore-missing-imports
```

---

## Performance Optimization

### Model Loading
Models are loaded once at startup, not per request.

### Caching (Future)
```python
from functools import lru_cache

@lru_cache(maxsize=100)
def get_role_requirements(role_id: str, level: str):
    return get_role_level(role_id, level)
```

### Async Processing (Future)
```python
@app.post("/inference/analyze")
async def analyze(payload: AnalyzeRequest, background_tasks: BackgroundTasks):
    # Heavy processing in background
    background_tasks.add_task(log_analysis, payload)
    return run_analysis(payload)
```

---

## Deployment Checklist

- [ ] All tests pass
- [ ] Model artifacts exist
- [ ] Environment variables documented
- [ ] Dependencies pinned in requirements.txt
- [ ] Docker build succeeds
- [ ] API documentation accurate
- [ ] README updated
