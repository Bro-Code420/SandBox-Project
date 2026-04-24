import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.startup import load_models_on_startup
from app.schemas.request import AnalyzeRequest
from app.services.inference_service import run_analysis

app = FastAPI(title="Career Readiness ML Backend")

# Configure CORS for Next.js frontend
# In local development, allow any origin so browser-hosted frontend can reach the backend.
allowed_origins = os.getenv("ML_BACKEND_ALLOW_ORIGINS")
if allowed_origins:
    allowed_origins = [origin.strip() for origin in allowed_origins.split(",") if origin.strip()]
else:
    allowed_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
async def startup_event():
    load_models_on_startup()


@app.get("/health")
async def health_check():
    """Health check endpoint to verify API is running."""
    return {"status": "healthy", "service": "Career Readiness ML Backend"}


@app.post("/inference/analyze")
async def analyze(payload: AnalyzeRequest):
    try:
        result = run_analysis(payload)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
