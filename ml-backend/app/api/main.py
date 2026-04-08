from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from app.core.startup import load_models_on_startup
from app.schemas.request import AnalyzeRequest
from app.services.inference_service import run_analysis

app = FastAPI(title="Career Readiness ML Backend")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://*.vercel.app",  # For production
    ],
    allow_credentials=True,
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
