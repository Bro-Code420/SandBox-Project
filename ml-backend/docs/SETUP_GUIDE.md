# Setup Guide

## Prerequisites

- **Python 3.10+** (tested with 3.13)
- **pip** package manager
- **Git** for version control

## Installation

### 1. Clone the Repository

```powershell
git clone https://github.com/devanshthaware/semicolon-code-league-1.0-project.git
cd semicolon-code-league-1.0-project/ml-backend
```

### 2. Create Virtual Environment

**Windows (PowerShell):**
```powershell
python -m venv venv
venv\Scripts\Activate.ps1
```

**Linux/macOS:**
```bash
python -m venv venv
source venv/bin/activate
```

### 3. Install Dependencies

```powershell
pip install -r requirements.txt
```

**Dependencies installed:**
- `fastapi==0.95.2` - Web framework
- `uvicorn[standard]==0.22.0` - ASGI server
- `scikit-learn==1.3.2` - Machine learning
- `joblib==1.3.2` - Model serialization
- `pandas==2.2.2` - Data manipulation
- `numpy==1.26.4` - Numerical computing
- `sentence-transformers==2.2.2` - Skill embeddings
- `xgboost==2.0.3` - Gap ranking model
- `scipy==1.11.4` - Scientific computing

### 4. Train All ML Models

```powershell
$env:PYTHONPATH = "."
python scripts/train_all.py
```

This trains and saves all 5 ML models:

| Model | Algorithm | Output File |
|-------|-----------|-------------|
| Readiness Predictor | LogisticRegression | `readiness_v1.joblib` |
| Skill Extractor | TF-IDF + MultiLabel Classifier | `skill_extractor_*.joblib` |
| Skill Embeddings | Sentence Transformers | `skill_embeddings.joblib` |
| Gap Ranker | XGBoost | `gap_ranker_model.joblib` |
| Recommender | TruncatedSVD | `recommender_*.joblib` |

**Expected output:**
```
============================================================
TRAINING ALL ML MODELS
============================================================
[1/5] Training Readiness Prediction Model...
✓ Readiness model trained
[2/5] Training Skill Extraction Model...
✓ Skill extractor trained
[3/5] Generating Skill Embeddings...
✓ Skill embeddings generated
[4/5] Training Gap Ranking Model...
✓ Gap ranker trained
[5/5] Training Resource Recommender...
✓ Recommender trained
============================================================
TRAINING COMPLETE
============================================================
```

### 5. Verify Installation

Run the smoke test (no server required):

```powershell
$env:PYTHONPATH = "."
python scripts/smoke_test.py
```

Expected output:
```
Found model at: ...\ml\artifacts\readiness_v1.joblib
============================================================
TEST 1: Backward-compatible mode (custom skill list)
============================================================
Status: 200
Readiness: Needs Upskilling (29.17%)
...
All smoke tests passed!
```

## Running the Server

### Development Mode (with auto-reload)

```powershell
$env:PYTHONPATH = "."
uvicorn app.api.main:app --reload --port 8000
```

### Production Mode

```powershell
$env:PYTHONPATH = "."
uvicorn app.api.main:app --host 0.0.0.0 --port 8000 --workers 4
```

### Verify Server is Running

Open in browser: http://localhost:8000/docs

Or test with curl:
```powershell
curl http://localhost:8000/docs
```

## Running Tests

### All Tests

```powershell
$env:PYTHONPATH = "."
pytest tests/ -v
```

### Specific Test

```powershell
$env:PYTHONPATH = "."
pytest tests/test_api.py::test_analyze_endpoint_role_based -v
```

### With Coverage

```powershell
pip install pytest-cov
$env:PYTHONPATH = "."
pytest tests/ --cov=app --cov-report=html
```

## Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PYTHONPATH` | - | Must be set to project root |

### File Paths

| Path | Description |
|------|-------------|
| `ml/artifacts/` | Trained model storage |
| `data/` | Static data files |
| `logs/` | Application logs (if configured) |

## Troubleshooting

### ModuleNotFoundError: No module named 'app'

**Solution:** Set PYTHONPATH to the project root:
```powershell
$env:PYTHONPATH = "."
# or
$env:PYTHONPATH = "C:\path\to\ml-backend"
```

### Model not found error

**Solution:** Train the model first:
```powershell
python ml/training/train_readiness.py
```

### Port already in use

**Solution:** Use a different port:
```powershell
uvicorn app.api.main:app --port 8001
```

Or kill the existing process:
```powershell
# Find process using port 8000
netstat -ano | findstr :8000
# Kill by PID
taskkill /PID <PID> /F
```

### Import errors after code changes

**Solution:** Restart the uvicorn server (or ensure `--reload` is enabled)

## Docker Setup (Optional)

### Dockerfile

```dockerfile
FROM python:3.10-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Train model during build
RUN python ml/training/train_readiness.py

ENV PYTHONPATH=/app

EXPOSE 8000

CMD ["uvicorn", "app.api.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Build and Run

```powershell
docker build -t career-readiness-ml .
docker run -p 8000:8000 career-readiness-ml
```

## IDE Setup

### VS Code

Recommended extensions:
- Python
- Pylance
- Python Test Explorer

**settings.json:**
```json
{
  "python.analysis.extraPaths": ["${workspaceFolder}"],
  "python.envFile": "${workspaceFolder}/.env",
  "python.testing.pytestEnabled": true,
  "python.testing.pytestArgs": ["tests/"]
}
```

### PyCharm

1. Mark `ml-backend` as Sources Root
2. Configure Python interpreter to use virtual environment
3. Set pytest as test runner
