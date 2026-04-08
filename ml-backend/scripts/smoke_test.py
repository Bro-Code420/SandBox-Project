"""Run training (if needed) and a basic inference smoke test using TestClient.

This does not require running a server; it exercises the pipeline and API layer.
Tests both backward-compatible mode and new role-based analysis.
"""
from pathlib import Path
import runpy
import time
import json


def ensure_trained():
    out = Path(__file__).resolve().parents[1] / "ml" / "artifacts" / "readiness_v1.joblib"
    if not out.exists():
        print("Model not found, running training...")
        runpy.run_path(Path(__file__).resolve().parents[1] / "ml" / "training" / "train_readiness.py")
        time.sleep(0.5)
    else:
        print(f"Found model at: {out}")


def run_api_smoke():
    from fastapi.testclient import TestClient
    from app.api.main import app

    client = TestClient(app)
    
    print("\n" + "="*60)
    print("TEST 1: Backward-compatible mode (custom skill list)")
    print("="*60)
    payload = {
        "candidate_id": "smoke-1",
        "skills": ["python", "pandas"],
        "target_role_skills": ["python", "sql", "aws"],
        "experience_years": 2.5,
    }
    resp = client.post("/inference/analyze", json=payload)
    print(f"Status: {resp.status_code}")
    data = resp.json()
    print(f"Readiness: {data['readiness_label']} ({data['readiness_score']:.2%})")
    print(f"Missing skills: {[s['skill'] for s in data['missing_skills']]}")
    
    print("\n" + "="*60)
    print("TEST 2: Role-based analysis (Data Scientist Junior)")
    print("="*60)
    payload = {
        "candidate_id": "smoke-2",
        "skills": ["python", "pandas", "numpy", "sql"],
        "role_id": "data_scientist",
        "level": "junior",
        "experience_years": 1.5,
    }
    resp = client.post("/inference/analyze", json=payload)
    print(f"Status: {resp.status_code}")
    data = resp.json()
    print(f"Role: {data.get('role_title')} ({data.get('role_level')})")
    print(f"Readiness: {data['readiness_label']} ({data['readiness_score']:.2%})")
    print(f"Skill Analysis:")
    print(f"  - Matched core: {data['skill_analysis']['matched_core']}")
    print(f"  - Matched secondary: {data['skill_analysis']['matched_secondary']}")
    print(f"  - Weighted score: {data['skill_analysis']['weighted_score']:.2%}")
    print(f"Missing skills ({len(data['missing_skills'])}):")
    for gap in data['missing_skills'][:5]:
        print(f"  - {gap['skill']} ({gap['priority']}, weight={gap['weight']})")
    print(f"Explanation factors:")
    for factor in data['explanation']['factors']:
        print(f"  - {factor}")
    print(f"Roadmap: {len(data['roadmap'])} weeks")
    for week in data['roadmap']:
        print(f"  Week {week['week']}: {week['skills']} ({week['estimated_hours']}h)")
    
    print("\n" + "="*60)
    print("TEST 3: Resume text skill extraction")
    print("="*60)
    payload = {
        "candidate_id": "smoke-3",
        "resume_text": """Software Engineer with 3 years experience.
        Skills: Python, JavaScript, React, Node.js, SQL, Docker, AWS.
        Built REST APIs and worked with PostgreSQL databases.
        Experience with CI/CD pipelines and Git version control.""",
        "role_id": "fullstack_developer",
        "level": "junior",
        "experience_years": 3.0,
    }
    resp = client.post("/inference/analyze", json=payload)
    print(f"Status: {resp.status_code}")
    data = resp.json()
    print(f"Extracted skills: {data.get('extracted_skills')}")
    print(f"Readiness: {data['readiness_label']} ({data['readiness_score']:.2%})")
    print(f"Recommendations ({len(data['recommendations'])} skills):")
    for rec in data['recommendations'][:3]:
        print(f"  - {rec['skill']}: {len(rec['resources'])} resources")
    
    print("\n" + "="*60)
    print("All smoke tests passed!")
    print("="*60)


if __name__ == "__main__":
    ensure_trained()
    run_api_smoke()
