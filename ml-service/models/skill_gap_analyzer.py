"""
Skill Gap Analyzer Model
Analyzes skill gaps across different DevOps topics
"""

import numpy as np
from typing import List, Dict, Any, Optional
from .base_model import BaseMLModel


class SkillGapAnalyzer(BaseMLModel):
    """Analyzes skill gaps across DevOps topics"""

    def __init__(self):
        # Topics to analyze
        self.topics = ['git', 'linux', 'docker', 'kubernetes', 'aws', 'terraform', 'jenkins', 'monitoring']
        super().__init__("skill_gap_analyzer")

        # Create feature names for each topic
        self.feature_names = []
        for topic in self.topics:
            self.feature_names.extend([
                f'{topic}_score',
                f'{topic}_attempts',
                f'{topic}_time_spent',
                f'{topic}_errors'
            ])

        # Simple regression weights
        self.weights = None

    def _create_model(self):
        """Initialize the model"""
        self.weights = np.random.randn(len(self.feature_names), len(self.topics)) * 0.1

    def _preprocess_features(self, features: List[float]) -> np.ndarray:
        """Preprocess input features"""
        expected_features = len(self.topics) * 4  # 4 features per topic

        # Ensure we have the right number of features
        if len(features) < expected_features:
            # Pad with zeros
            features.extend([0.0] * (expected_features - len(features)))
        elif len(features) > expected_features:
            # Truncate
            features = features[:expected_features]

        return np.array(features)

    def _train_model(self, X: np.ndarray, y: np.ndarray):
        """Train using simple multi-output regression"""
        if self.weights is None:
            self.weights = np.random.randn(X.shape[1], y.shape[1]) * 0.1

        # Simple gradient descent
        learning_rate = 0.01
        for _ in range(50):
            predictions = np.dot(X, self.weights)
            errors = y - predictions
            self.weights += learning_rate * np.dot(X.T, errors) / len(X)

    def _predict_model(self, X: np.ndarray) -> np.ndarray:
        """Make predictions"""
        if self.weights is None:
            return np.zeros((X.shape[0], len(self.topics)))

        predictions = np.dot(X, self.weights)

        # Ensure predictions are between 0 and 1 (gap scores)
        predictions = np.clip(predictions, 0.0, 1.0)

        return predictions

    def generate_synthetic_data(self, n_samples: int = 1000) -> tuple:
        """Generate synthetic training data for skill gap analysis"""
        np.random.seed(42)

        X = np.zeros((n_samples, len(self.feature_names)))
        y = np.zeros((n_samples, len(self.topics)))

        for i in range(n_samples):
            for j, topic in enumerate(self.topics):
                base_idx = j * 4

                # Generate realistic scores for each topic
                skill_level = np.random.beta(2, 2)  # Overall skill level for this topic

                X[i, base_idx] = skill_level  # score (0-1)
                X[i, base_idx + 1] = np.random.poisson(8)  # attempts
                X[i, base_idx + 2] = np.random.exponential(2)  # time_spent
                X[i, base_idx + 3] = np.random.poisson(2)  # errors

                # Gap is inverse of skill level, with some noise
                y[i, j] = np.clip(1 - skill_level + np.random.normal(0, 0.1), 0, 1)

        return X, y

    def analyze_skill_gaps(self, features: List[float]) -> Dict[str, Any]:
        """Analyze skill gaps with detailed breakdown"""
        predictions = self.predict(features)[0]

        skill_gaps = {}
        total_gap = 0

        for i, topic in enumerate(self.topics):
            gap_score = float(predictions[i])
            skill_gaps[topic] = {
                'gap_score': gap_score,
                'proficiency_level': 'high' if gap_score < 0.3 else 'medium' if gap_score < 0.7 else 'low',
                'priority': 'high' if gap_score > 0.7 else 'medium' if gap_score > 0.4 else 'low'
            }
            total_gap += gap_score

        avg_gap = total_gap / len(self.topics)

        return {
            'skill_gaps': skill_gaps,
            'average_gap': float(avg_gap),
            'overall_assessment': 'needs_improvement' if avg_gap > 0.6 else 'developing' if avg_gap > 0.3 else 'strong',
            'recommendations': self._get_gap_recommendations(skill_gaps),
            'focus_areas': sorted([topic for topic, data in skill_gaps.items() if data['gap_score'] > 0.5],
                                key=lambda x: skill_gaps[x]['gap_score'], reverse=True)
        }

    def _get_gap_recommendations(self, skill_gaps: Dict[str, Dict]) -> List[str]:
        """Get recommendations based on skill gaps"""
        recommendations = []
        high_priority_gaps = [topic for topic, data in skill_gaps.items() if data['priority'] == 'high']

        if high_priority_gaps:
            recommendations.append(f"Focus on improving skills in: {', '.join(high_priority_gaps[:3])}")

        if len(high_priority_gaps) > 3:
            recommendations.append("Consider breaking down learning into smaller, focused sessions")

        low_gap_topics = [topic for topic, data in skill_gaps.items() if data['gap_score'] < 0.3]
        if low_gap_topics:
            recommendations.append(f"Build upon your strong areas: {', '.join(low_gap_topics[:2])}")

        return recommendations if recommendations else ["Continue practicing across all topics to maintain balance"]

        return np.array(features)

    def _generate_explanation(self, prediction: np.ndarray, features: List[float], metadata: Optional[Dict[str, Any]]) -> str:
        """Generate explanation for skill gap analysis"""
        gaps = prediction[0] if len(prediction.shape) > 1 else prediction

        # Find top skill gaps
        gap_scores = list(zip(self.topics, gaps))
        gap_scores.sort(key=lambda x: x[1], reverse=True)

        top_gaps = gap_scores[:3]  # Top 3 skill gaps

        explanation = "Skill gap analysis: "
        for topic, gap in top_gaps:
            if gap > 0.5:
                explanation += f"High gap in {topic} ({gap:.1%}), "
            elif gap > 0.3:
                explanation += f"Moderate gap in {topic} ({gap:.1%}), "

        explanation = explanation.rstrip(', ') + ". "

        # Overall assessment
        avg_gap = np.mean(gaps)
        if avg_gap > 0.6:
            explanation += "Significant skill gaps detected - focus on fundamentals."
        elif avg_gap > 0.4:
            explanation += "Moderate skill gaps - targeted practice recommended."
        else:
            explanation += "Strong skill foundation - ready for advanced topics."

        return explanation

    def generate_synthetic_data(self, n_samples: int = 1000) -> tuple:
        """Generate synthetic skill gap data"""
        np.random.seed(42)

        n_features = len(self.topics) * 4
        X = np.random.randn(n_samples, n_features)

        # Generate skill gap targets for each topic
        y = np.zeros((n_samples, len(self.topics)))

        for i in range(n_samples):
            for j, topic in enumerate(self.topics):
                # Extract features for this topic
                base_idx = j * 4
                score = (X[i, base_idx] + 1) / 2  # 0-1 scale
                attempts = max(0, X[i, base_idx + 1] * 5 + 10)  # 0-20 attempts
                time_spent = max(0, X[i, base_idx + 2] * 10 + 20)  # 0-40 hours
                errors = max(0, X[i, base_idx + 3] * 3 + 5)  # 0-10 errors

                # Calculate skill gap (inverse of mastery)
                # Lower score, fewer attempts, less time, more errors = higher gap
                gap_score = 1.0 - (
                    score * 0.4 +
                    min(1.0, attempts / 20) * 0.2 +
                    min(1.0, time_spent / 40) * 0.2 +
                    (1.0 - min(1.0, errors / 10)) * 0.2
                )

                y[i, j] = max(0.0, min(1.0, gap_score))

        return X, y