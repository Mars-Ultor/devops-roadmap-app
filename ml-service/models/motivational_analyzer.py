"""
Motivational Analyzer Model
Analyzes user motivation and engagement patterns
"""

import numpy as np
from typing import List, Dict, Any, Optional
from .base_model import BaseMLModel


class MotivationalAnalyzer(BaseMLModel):
    """Analyzes user motivation and learning engagement"""

    def __init__(self):
        self.motivation_types = ['achievement', 'mastery', 'social', 'autonomy']
        super().__init__("motivational_analyzer")
        self.feature_names = [
            'study_streak', 'avg_score', 'completion_rate', 'struggle_time_hours',
            'performance_score', 'time_spent_hours', 'hints_used', 'error_rate'
        ]

        # Simple classification weights
        self.weights = None

    def _create_model(self):
        """Initialize the model"""
        self.weights = np.random.randn(len(self.feature_names), len(self.motivation_types)) * 0.1

    def _preprocess_features(self, features: List[float]) -> np.ndarray:
        """Preprocess input features"""
        # Ensure we have the right number of features
        if len(features) < len(self.feature_names):
            # Pad with zeros
            features.extend([0.0] * (len(self.feature_names) - len(features)))
        elif len(features) > len(self.feature_names):
            # Truncate
            features = features[:len(self.feature_names)]

        return np.array(features)

    def _train_model(self, X: np.ndarray, y: np.ndarray):
        """Train using simple multi-class classification"""
        if self.weights is None:
            self.weights = np.random.randn(X.shape[1], y.shape[1]) * 0.1

        # Simple gradient descent for multi-class
        learning_rate = 0.01
        for _ in range(50):
            logits = np.dot(X, self.weights)
            # Softmax
            exp_logits = np.exp(logits - np.max(logits, axis=1, keepdims=True))
            probabilities = exp_logits / np.sum(exp_logits, axis=1, keepdims=True)

            # Cross-entropy loss gradient
            errors = probabilities - y
            self.weights -= learning_rate * np.dot(X.T, errors) / len(X)

    def _predict_model(self, X: np.ndarray) -> np.ndarray:
        """Make predictions"""
        if self.weights is None:
            # Return uniform probabilities if not trained
            return np.full((X.shape[0], len(self.motivation_types)), 1/len(self.motivation_types))

        logits = np.dot(X, self.weights)
        # Softmax
        exp_logits = np.exp(logits - np.max(logits, axis=1, keepdims=True))
        probabilities = exp_logits / np.sum(exp_logits, axis=1, keepdims=True)

        return probabilities

    def generate_synthetic_data(self, n_samples: int = 1000) -> tuple:
        """Generate synthetic training data for motivational analysis"""
        np.random.seed(42)

        X = np.random.randn(n_samples, len(self.feature_names))

        # Make features more realistic
        X[:, 0] = np.random.poisson(5, n_samples)      # study_streak
        X[:, 1] = np.random.beta(2, 2, n_samples)      # avg_score
        X[:, 2] = np.random.beta(3, 1, n_samples)      # completion_rate
        X[:, 3] = np.random.exponential(1, n_samples)  # struggle_time_hours
        X[:, 4] = np.random.beta(2, 2, n_samples)      # performance_score
        X[:, 5] = np.random.exponential(2, n_samples)  # time_spent_hours
        X[:, 6] = np.random.poisson(3, n_samples)      # hints_used
        X[:, 7] = np.random.beta(1, 3, n_samples)      # error_rate

        # Generate target: motivation types
        y = np.zeros((n_samples, len(self.motivation_types)))

        for i in range(n_samples):
            streak = X[i, 0]
            score = X[i, 1]
            completion = X[i, 2]
            struggle = X[i, 3]

            # Determine motivation type based on patterns
            if score > 0.8 and completion > 0.8:  # High achievers
                y[i, 0] = 0.7  # achievement
                y[i, 1] = 0.2  # mastery
                y[i, 2] = 0.05 # social
                y[i, 3] = 0.05 # autonomy
            elif struggle < 0.5 and score > 0.6:  # Consistent learners
                y[i, 0] = 0.2
                y[i, 1] = 0.7  # mastery
                y[i, 2] = 0.05
                y[i, 3] = 0.05
            elif streak > 7:  # Dedicated learners
                y[i, 0] = 0.1
                y[i, 1] = 0.2
                y[i, 2] = 0.1
                y[i, 3] = 0.6  # autonomy
            else:  # Social learners or struggling
                y[i, 0] = 0.1
                y[i, 1] = 0.1
                y[i, 2] = 0.6  # social
                y[i, 3] = 0.2

        return X, y

    def _generate_explanation(self, prediction: np.ndarray, features: List[float], metadata: Optional[Dict[str, Any]]) -> str:
        """Generate explanation for motivational analysis"""
        motivation_idx = np.argmax(prediction)
        primary_type = self.motivation_types[motivation_idx]
        confidence = float(np.max(prediction))

        explanations = {
            'achievement': "Driven by goals, achievements, and recognition",
            'mastery': "Motivated by learning new skills and personal growth",
            'social': "Inspired by collaboration and helping others",
            'autonomy': "Motivated by independence and self-directed learning"
        }

        return f"Primary motivation: {explanations.get(primary_type, 'Unknown')} (confidence: {confidence:.1%})"

    def analyze_motivation(self, features: List[float]) -> Dict[str, Any]:
        """Analyze motivation with detailed breakdown"""
        prediction = self.predict(features)[0]

        motivation_idx = np.argmax(prediction)
        primary_type = self.motivation_types[motivation_idx]

        motivation_levels = {}
        for i, mtype in enumerate(self.motivation_types):
            motivation_levels[mtype] = float(prediction[i])

        return {
            'primary_motivation': primary_type,
            'motivation_levels': motivation_levels,
            'confidence': float(np.max(prediction)),
            'explanation': self._generate_explanation(prediction, features, None),
            'recommendations': self._get_motivation_recommendations(primary_type, features)
        }

    def _get_motivation_recommendations(self, primary_type: str, features: List[float]) -> List[str]:
        """Get motivation-based recommendations"""
        recommendations = []

        if primary_type == 'achievement':
            recommendations.extend([
                "Set clear learning goals and track progress",
                "Celebrate milestones and achievements",
                "Consider gamification elements in learning"
            ])
        elif primary_type == 'mastery':
            recommendations.extend([
                "Focus on deep understanding of concepts",
                "Challenge yourself with increasingly difficult tasks",
                "Emphasize skill development over grades"
            ])
        elif primary_type == 'social':
            recommendations.extend([
                "Join study groups or online communities",
                "Participate in peer learning activities",
                "Share knowledge and help others learn"
            ])
        elif primary_type == 'autonomy':
            recommendations.extend([
                "Create personalized learning schedules",
                "Choose topics that interest you most",
                "Set your own pace and learning methods"
            ])

        # Add general recommendations based on features
        if len(features) > 0 and features[0] < 3:  # Low study streak
            recommendations.append("Build consistency in your learning routine")

        return recommendations

        study_streak = int(features[0]) if features else 0
        avg_score = features[1] if len(features) > 1 else 0.5
        completion_rate = features[2] if len(features) > 2 else 0.5

        explanation = f"Primary motivation type: {primary_type} (confidence: {confidence:.1%}). "

        if primary_type == 'achievement':
            explanation += "Driven by goals and accomplishments. "
            explanation += "Recommend setting clear milestones and celebrating progress."
        elif primary_type == 'mastery':
            explanation += "Driven by learning and skill development. "
            explanation += "Recommend challenging projects and skill-building opportunities."
        elif primary_type == 'social':
            explanation += "Driven by collaboration and community. "
            explanation += "Recommend study groups and peer learning activities."
        elif primary_type == 'autonomy':
            explanation += "Driven by independence and self-direction. "
            explanation += "Recommend flexible learning paths and self-paced study."

        explanation += f" Based on {study_streak} day streak, {avg_score:.1%} average score, "
        explanation += f"and {completion_rate:.1%} completion rate."

        return explanation

    def generate_synthetic_data(self, n_samples: int = 1000) -> tuple:
        """Generate synthetic motivational data"""
        np.random.seed(42)

        X = np.random.randn(n_samples, len(self.feature_names))

        # Generate motivation type targets (0-3 for 4 types)
        y = np.zeros(n_samples, dtype=int)

        for i in range(n_samples):
            study_streak = max(0, X[i, 0] * 10 + 15)  # 0-30 days
            avg_score = (X[i, 1] + 1) / 2  # 0-1 scale
            completion_rate = (X[i, 2] + 1) / 2  # 0-1 scale
            struggle_time = max(0, X[i, 3] * 5 + 10)  # 0-20 hours
            performance_score = (X[i, 4] + 1) / 2  # 0-1 scale
            time_spent = max(0, X[i, 5] * 5 + 10)  # 0-20 hours
            hints_used = max(0, X[i, 6] * 3 + 5)  # 0-10 hints

            # Determine motivation type based on patterns
            if study_streak > 20 and avg_score > 0.8:  # High achievers
                y[i] = 0  # achievement
            elif time_spent > 15 and hints_used < 3:  # Deep learners
                y[i] = 1  # mastery
            elif completion_rate > 0.8 and struggle_time < 5:  # Consistent performers
                y[i] = 2  # social (community-oriented)
            else:  # Independent learners
                y[i] = 3  # autonomy

            # Add some realistic variation
            if np.random.random() < 0.15:  # 15% chance of different type
                y[i] = np.random.randint(0, 4)

        return X, y