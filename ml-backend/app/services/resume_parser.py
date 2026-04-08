"""Resume parsing service for skill extraction.

Uses trained TF-IDF + Multi-label Classifier model for skill extraction.
Falls back to keyword-based extraction if model not available.
"""

import re
from typing import List, Set
from data.skill_taxonomy import SKILL_TAXONOMY, normalize_skill
from app.core.startup import get_model, is_model_loaded


def extract_skills_from_text(text: str) -> List[str]:
    """Extract skills from resume or profile text.
    
    Uses trained ML model (TF-IDF + Multi-label Classifier) if available,
    otherwise falls back to keyword-based extraction.
    
    Args:
        text: Resume or profile text
        
    Returns:
        List of normalized skill names found in the text
    """
    if not text:
        return []
    
    # Try ML model first
    if is_model_loaded("skill_extractor"):
        return _extract_with_model(text)
    
    # Fallback to keyword matching
    return _extract_with_keywords(text)


def _extract_with_model(text: str) -> List[str]:
    """Extract skills using trained ML model."""
    model_data = get_model("skill_extractor")
    vectorizer = model_data["vectorizer"]
    classifier = model_data["classifier"]
    mlb = model_data["mlb"]
    
    # Transform text to TF-IDF features
    X = vectorizer.transform([text])
    
    # Predict skills
    predictions = classifier.predict(X)
    
    # Convert binary predictions back to skill names
    skills = mlb.inverse_transform(predictions)[0]
    
    return sorted(list(skills))


def _extract_with_keywords(text: str) -> List[str]:
    """Extract skills using keyword matching (fallback)."""
    text_lower = text.lower()
    
    # Replace common separators with spaces for better matching
    text_normalized = re.sub(r'[,;|•·\-/\\]', ' ', text_lower)
    text_normalized = re.sub(r'\s+', ' ', text_normalized)
    
    found_skills: Set[str] = set()
    
    # Check each skill in taxonomy
    for skill in SKILL_TAXONOMY:
        escaped_skill = re.escape(skill)
        pattern = r'(?:^|[\s,;.()])' + escaped_skill + r'(?:[\s,;.()]|$)'
        if re.search(pattern, text_normalized):
            found_skills.add(skill)
    
    # Also check for common variations/aliases
    alias_patterns = {
        r'\breact\.?js\b': 'react',
        r'\bvue\.?js\b': 'vue',
        r'\bangular\.?js\b': 'angular',
        r'\bnode\.?js\b': 'node.js',
        r'\bnext\.?js\b': 'next.js',
        r'\baws\b': 'aws',
        r'\bci\s*/?\s*cd\b': 'ci/cd',
        r'\bmachine\s+learning\b': 'machine learning',
        r'\bdeep\s+learning\b': 'deep learning',
        r'\brest\s*api\b': 'rest api',
        r'\bdata\s+analysis\b': 'data analysis',
        r'\bdata\s+visualization\b': 'data visualization',
        r'\bproblem\s+solving\b': 'problem solving',
        r'\bunit\s+testing\b': 'unit testing',
    }
    
    for pattern, skill in alias_patterns.items():
        if re.search(pattern, text_normalized):
            found_skills.add(skill)
    
    return sorted(found_skills)


def merge_skills(provided_skills: List[str], extracted_skills: List[str]) -> List[str]:
    """Merge provided skills with extracted skills, normalizing all.
    
    Args:
        provided_skills: Skills explicitly provided by user
        extracted_skills: Skills extracted from resume text
        
    Returns:
        Deduplicated list of normalized skills
    """
    all_skills: Set[str] = set()
    
    for skill in provided_skills:
        normalized = normalize_skill(skill)
        all_skills.add(normalized)
    
    for skill in extracted_skills:
        normalized = normalize_skill(skill)
        all_skills.add(normalized)
    
    return sorted(all_skills)
