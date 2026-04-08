from fastapi.testclient import TestClient
from app.api.main import app


client = TestClient(app)


def test_analyze_endpoint_backward_compatible():
    """Test backward-compatible mode with custom skill list."""
    payload = {
        "candidate_id": "unit-1",
        "skills": ["python", "pandas"],
        "target_role_skills": ["python", "sql", "aws"],
        "experience_years": 3.0
    }
    response = client.post("/inference/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "readiness_label" in data
    assert "readiness_score" in data
    assert "missing_skills" in data
    assert "skill_analysis" in data
    assert "explanation" in data
    assert "recommendations" in data
    assert "roadmap" in data


def test_analyze_endpoint_role_based():
    """Test role-based analysis with role_id and level."""
    payload = {
        "candidate_id": "unit-2",
        "skills": ["python", "pandas", "numpy"],
        "role_id": "data_scientist",
        "level": "junior",
        "experience_years": 2.0
    }
    response = client.post("/inference/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["role_title"] == "Data Scientist"
    assert data["role_level"] == "junior"
    assert "skill_analysis" in data
    assert "matched_core" in data["skill_analysis"]
    assert "weighted_score" in data["skill_analysis"]


def test_analyze_endpoint_resume_extraction():
    """Test skill extraction from resume text."""
    payload = {
        "candidate_id": "unit-3",
        "resume_text": "Experienced in Python, SQL, and machine learning.",
        "role_id": "data_scientist",
        "level": "intern",
        "experience_years": 0.5
    }
    response = client.post("/inference/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["extracted_skills"] is not None
    assert "python" in data["extracted_skills"]
    assert "sql" in data["extracted_skills"]


def test_readiness_thresholds():
    """Test that readiness labels follow doc-specified thresholds."""
    # High-skill candidate should be "Industry Ready" or "Almost Ready"
    payload = {
        "skills": ["python", "pandas", "numpy", "scikit-learn", "sql", "data visualization", "machine learning"],
        "role_id": "data_scientist",
        "level": "junior",
        "experience_years": 5.0
    }
    response = client.post("/inference/analyze", json=payload)
    data = response.json()
    assert data["readiness_label"] in ["Industry Ready", "Almost Ready"]
    
    # Low-skill candidate should be "Needs Upskilling"
    payload = {
        "skills": ["html"],
        "role_id": "data_scientist",
        "level": "senior",
        "experience_years": 0.0
    }
    response = client.post("/inference/analyze", json=payload)
    data = response.json()
    assert data["readiness_label"] == "Needs Upskilling"
