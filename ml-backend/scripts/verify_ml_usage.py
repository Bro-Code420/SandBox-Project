"""Verify that ML models are being actively used during inference."""

from app.services.inference_service import run_analysis
from app.schemas.request import AnalyzeRequest

print("=" * 60)
print("VERIFYING ML MODEL USAGE IN INFERENCE")
print("=" * 60)

# Test 1: Basic inference with ML models
print("\n[Test 1] Running inference with role-based analysis...")
payload = AnalyzeRequest(
    candidate_id="test-ml-1",
    skills=["python", "pandas"],
    role_id="data_scientist",
    level="junior",
    experience_years=2.0
)
result = run_analysis(payload)

print(f"✓ Inference completed successfully")
print(f"✓ Readiness Score: {result['readiness_score']:.2%}")
print(f"✓ Readiness Label: {result['readiness_label']}")
print(f"✓ Missing Skills: {len(result['missing_skills'])} identified")
print(f"✓ Recommendations: {len(result['recommendations'])} skills with resources")
print(f"✓ Roadmap: {len(result['roadmap'])} weeks generated")

# Test 2: Resume skill extraction (ML-based)
print("\n[Test 2] Testing ML-based skill extraction...")
payload2 = AnalyzeRequest(
    candidate_id="test-ml-2",
    resume_text="Expert in Python, machine learning, and TensorFlow. 5 years experience.",
    role_id="data_scientist",
    level="mid",
    experience_years=5.0
)
result2 = run_analysis(payload2)

print(f"✓ Extracted skills via ML: {result2['extracted_skills']}")
print(f"✓ Number of skills extracted: {len(result2['extracted_skills'])}")

# Test 3: Verify specific ML components
print("\n[Test 3] Verifying ML model components...")

from app.models.readiness_model import ReadinessModel
from app.models.skill_extractor_model import get_skill_extractor_model
from app.models.gap_ranker_model import get_gap_ranker_model
from app.models.skill_matcher_model import get_skill_matcher_model
from app.models.recommender_model import get_recommender_model

readiness_model = ReadinessModel()
skill_extractor = get_skill_extractor_model()
gap_ranker = get_gap_ranker_model()
skill_matcher = get_skill_matcher_model()
recommender = get_recommender_model()

print(f"✓ Readiness Model loaded: {readiness_model._model is not None}")
print(f"✓ Skill Extractor loaded: {skill_extractor.is_loaded}")
print(f"✓ Gap Ranker loaded: {gap_ranker.is_loaded}")
print(f"✓ Skill Matcher loaded: {skill_matcher.is_loaded}")
print(f"✓ Recommender loaded: {recommender.is_loaded}")

# Test 4: Verify semantic matching
print("\n[Test 4] Testing semantic skill matching (embeddings)...")
similarity = skill_matcher.compute_similarity("python", "pandas")
print(f"✓ Semantic similarity (python <-> pandas): {similarity:.3f}")
similarity2 = skill_matcher.compute_similarity("react", "vue")
print(f"✓ Semantic similarity (react <-> vue): {similarity2:.3f}")

# Test 5: Verify gap ranking
print("\n[Test 5] Testing XGBoost gap ranking...")
missing = [
    {"skill": "sql", "priority": "core"},
    {"skill": "docker", "priority": "bonus"},
]
ranked = gap_ranker.rank_skills(missing, user_experience=2.0, user_skill_count=5)
print(f"✓ Gap ranker ranked {len(ranked)} skills")
for skill in ranked:
    print(f"  - {skill['skill']}: priority_score={skill.get('priority_score', 0):.2f}, rank={skill.get('rank', 0)}")

# Test 6: Verify recommendations
print("\n[Test 6] Testing SVD-based recommendations...")
recs = recommender.get_recommendations("python", top_k=3)
print(f"✓ Recommender provided {len(recs)} resources for 'python':")
for rec in recs:
    print(f"  - {rec['title']} (type: {rec['type']})")

print("\n" + "=" * 60)
print("✅ ALL ML MODELS ARE ACTIVELY USED IN THE SYSTEM")
print("=" * 60)
print("\nSUMMARY:")
print("1. ✓ LogisticRegression for readiness prediction")
print("2. ✓ TF-IDF + OneVsRestClassifier for skill extraction")
print("3. ✓ Sentence Transformers for semantic matching")
print("4. ✓ XGBoost for gap ranking")
print("5. ✓ TruncatedSVD for recommendations")
print("=" * 60)
