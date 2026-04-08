from typing import List
from app.core.startup import get_model


class ReadinessModel:
    def __init__(self):
        self._model = get_model("readiness")

    def predict_proba(self, features: List[float]):
        if self._model is None:
            # default heuristic: use simple logistic on match ratio
            match_ratio, experience = features
            score = 0.5 * match_ratio + 0.05 * experience
            return [1 - score, score]
        return self._model.predict_proba([features])[0]

    def predict(self, features: List[float]):
        proba = self.predict_proba(features)
        return int(proba[1] >= 0.5)
