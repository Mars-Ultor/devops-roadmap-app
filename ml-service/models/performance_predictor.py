"""
Performance Predictor Model
Predicts completion probability and performance metrics using XGBoost
"""

import numpy as np
from typing import List, Dict, Any, Optional
from .base_model import BaseMLModel
from xgboost import XGBClassifier
from sklearn.ensemble import GradientBoostingRegressor


class PerformancePredictor(BaseMLModel):
    """Predicts user performance and completion probability using XGBoost"""

    def __init__(self):
        super().__init__("performance_predictor")
        self.feature_names = [
            'study_streak', 'avg_score', 'completion_rate',
            'struggle_time_hours', 'learning_style_visual',
            'learning_style_kinesthetic', 'learning_style_reading',
            'learning_style_auditory', 'current_week', 'hints_used',
            'error_rate', 'time_spent_week'
        ]

        # Two models: one for classification (performance level), one for regression (score prediction)
        self.classifier = None
        self.regressor = None

    def _create_model(self):
        """Initialize XGBoost models"""
        # Classifier for performance level prediction
        self.classifier = XGBClassifier(
            n_estimators=100,
            max_depth=6,
            learning_rate=0.1,
            random_state=42,
            n_jobs=-1
        )

        # Regressor for score prediction
        self.regressor = GradientBoostingRegressor(
            n_estimators=100,
            max_depth=4,
            learning_rate=0.1,
            random_state=42
        )

        # Use classifier as primary model for base class
        self.model = self.classifier

    def predict(self, quiz_data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict performance metrics"""
        if not self.is_trained:
            # Fallback to rule-based if model not trained
            return self._rule_based_prediction(quiz_data)

        try:
            # Extract features from quiz data
            features = self._extract_features(quiz_data)

            # Make prediction using trained classifier
            result = super().predict(features)

            # Get performance level from prediction
            prediction = result['prediction']
            if isinstance(prediction, (list, np.ndarray)) and len(prediction) > 0:
                perf_level_idx = int(prediction[0])
            else:
                perf_level_idx = int(prediction)

            performance_levels = ['needs_improvement', 'good', 'excellent']
            performance_level = performance_levels[min(perf_level_idx, len(performance_levels) - 1)]

            # Determine next difficulty and recommendations
            if performance_level == 'excellent':
                next_difficulty = 'advanced'
                recommendations = ['continue_current_pace', 'explore_advanced_topics']
            elif performance_level == 'good':
                next_difficulty = 'intermediate'
                recommendations = ['practice_more', 'review_weak_areas']
            else:
                next_difficulty = 'beginner'
                recommendations = ['focus_on_fundamentals', 'use_more_hints', 'additional_practice']

            # Calculate predicted score from quiz data
            scores = quiz_data.get('scores', [])
            predicted_score = np.mean(scores) if scores else 0.5

            return {
                'performance_level': performance_level,
                'next_difficulty': next_difficulty,
                'predicted_score': float(predicted_score),
                'recommendations': recommendations,
                'confidence': result.get('confidence', 0.8),
                'model_used': 'xgboost'
            }

        except Exception as e:
            print(f"ML prediction failed, falling back to rules: {e}")
            return self._rule_based_prediction(quiz_data)

    def _extract_features(self, quiz_data: Dict[str, Any]) -> List[float]:
        """Extract numerical features from quiz data"""
        features = []

        # Basic quiz performance
        scores = quiz_data.get('scores', [])
        features.append(len(scores))  # study_streak (number of attempts)
        features.append(np.mean(scores) if scores else 0.5)  # avg_score
        features.append(1.0 if scores else 0.5)  # completion_rate (simplified)

        # Time and struggle metrics
        features.append(quiz_data.get('struggle_time', 0) / 3600)  # Convert to hours

        # Learning style (simplified - assume mixed)
        features.extend([0.25, 0.25, 0.25, 0.25])  # Equal weights for all styles

        # Additional context features
        features.append(quiz_data.get('current_week', 1))
        features.append(quiz_data.get('hints_used', 0))
        features.append(quiz_data.get('error_rate', 0.2))
        features.append(quiz_data.get('time_spent_week', 10))  # Default 10 hours

        return features

    def _rule_based_prediction(self, quiz_data: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback rule-based prediction"""
        scores = quiz_data.get('scores', [])
        if not scores:
            avg_score = 0.5
        else:
            avg_score = sum(scores) / len(scores)

        if avg_score > 0.8:
            performance = 'excellent'
            next_difficulty = 'advanced'
        elif avg_score > 0.6:
            performance = 'good'
            next_difficulty = 'intermediate'
        else:
            performance = 'needs_improvement'
            next_difficulty = 'beginner'

        return {
            'performance_level': performance,
            'next_difficulty': next_difficulty,
            'predicted_score': avg_score,
            'recommendations': ['practice_more', 'review_materials'] if avg_score < 0.7 else [],
            'confidence': 0.7,
            'model_used': 'rule_based_fallback'
        }
        if self.weights is None:
            self.weights = np.random.randn(X.shape[1]) * 0.1
            self.bias = np.mean(y)

        # Simple gradient descent
        learning_rate = 0.01
        for _ in range(50):
            predictions = np.dot(X, self.weights) + self.bias
            errors = y.flatten() - predictions
            self.weights += learning_rate * np.dot(X.T, errors) / len(X)
            self.bias += learning_rate * np.mean(errors)

    def _predict_model(self, X: np.ndarray) -> np.ndarray:
        """Make predictions"""
        if self.weights is None:
            return np.full((X.shape[0], 1), 0.5)

        predictions = np.dot(X, self.weights) + self.bias

        # Ensure predictions are between 0 and 1
        predictions = np.clip(predictions, 0.0, 1.0)

        return predictions.reshape(-1, 1)

    def generate_synthetic_data(self, n_samples: int = 1000) -> tuple:
        """Generate synthetic training data for performance prediction"""
        np.random.seed(42)

        X = np.random.randn(n_samples, len(self.feature_names))

        # Make features more realistic
        X[:, 0] = np.random.poisson(7, n_samples)      # study_streak (0-20)
        X[:, 1] = np.random.beta(2, 2, n_samples)      # avg_score (0-1)
        X[:, 2] = np.random.beta(3, 1, n_samples)      # completion_rate (0-1)
        X[:, 3] = np.random.exponential(1, n_samples)  # struggle_time_hours

        # Learning styles (should sum to ~1)
        learning_styles = np.random.dirichlet([1, 1, 1, 1], n_samples)
        X[:, 4:8] = learning_styles

        # Generate target: completion probability
        # Based on study habits and learning styles
        base_completion = (
            X[:, 0] * 0.02 +  # study_streak
            X[:, 1] * 0.4 +   # avg_score
            X[:, 2] * 0.4 -   # completion_rate
            X[:, 3] * 0.1     # struggle_time (negative impact)
        )

        # Add some noise
        y = np.clip(base_completion + np.random.normal(0, 0.1, n_samples), 0, 1)

        return X, y.reshape(-1, 1)

    def _generate_explanation(self, prediction: np.ndarray, features: List[float], metadata: Optional[Dict[str, Any]]) -> str:
        """Generate explanation for performance prediction"""
        completion_prob = prediction[0]
        study_streak = int(features[0]) if features else 0
        avg_score = features[1] if len(features) > 1 else 0.5
        completion_rate = features[2] if len(features) > 2 else 0.5

        if completion_prob > 0.8:
            return f"Your completion probability is very high at {completion_prob:.2f} based on strong study habits"
        elif completion_prob > 0.6:
            return f"Your completion probability is good at {completion_prob:.2f} with room for improvement"
        else:
            return f"Your completion probability is {completion_prob:.2f} - consider adjusting your study approach"

    def predict_completion_probability(self, features: List[float]) -> Dict[str, Any]:
        """Predict completion probability with detailed analysis"""
        prediction = self.predict(features)[0]

        return {
            'completion_probability': float(prediction),
            'confidence_level': 'high' if prediction > 0.8 else 'medium' if prediction > 0.6 else 'low',
            'estimated_completion_time': f"{int(12 * (1 - prediction) + 4)} weeks",
            'recommendations': self._get_recommendations(prediction, features)
        }

    def _get_recommendations(self, prediction: float, features: List[float]) -> List[str]:
        """Get personalized recommendations based on prediction"""
        recommendations = []

        if prediction < 0.6:
            recommendations.append("Consider reviewing foundational concepts")
            recommendations.append("Increase study time and practice frequency")

        if len(features) > 3 and features[3] > 2:  # High struggle time
            recommendations.append("Focus on understanding core concepts before advancing")

        if len(features) > 0 and features[0] < 3:  # Low study streak
            recommendations.append("Build a consistent study routine")

        return recommendations if recommendations else ["Continue current learning pace"]
        completion_rate = features[2] if len(features) > 2 else 0.5

        explanation = f"Completion probability: {completion_prob:.1%}. "

        if completion_prob > 0.8:
            explanation += "High likelihood of success. "
        elif completion_prob > 0.6:
            explanation += "Good chance of completion with consistent effort. "
        else:
            explanation += "May need additional support and practice. "

        explanation += f"Based on {study_streak} day streak, {avg_score:.1%} average score, "
        explanation += f"and {completion_rate:.1%} completion rate."

        return explanation

    def generate_synthetic_data(self, n_samples: int = 1000) -> tuple:
        """Generate synthetic performance data"""
        np.random.seed(42)

        X = np.random.randn(n_samples, len(self.feature_names))

        # Generate completion probability targets
        # Based on study habits and performance
        y = np.zeros(n_samples)

        for i in range(n_samples):
            study_streak = max(0, X[i, 0] * 10 + 15)  # 0-30 days
            avg_score = (X[i, 1] + 1) / 2  # 0-1 scale
            completion_rate = (X[i, 2] + 1) / 2  # 0-1 scale
            struggle_time = max(0, X[i, 3] * 5 + 10)  # 0-20 hours

            # Calculate completion probability
            base_prob = (study_streak * 0.02 + avg_score * 0.4 + completion_rate * 0.4)
            penalty = struggle_time * 0.01  # Penalty for excessive struggle time

            y[i] = min(1.0, max(0.0, base_prob - penalty))

            # Add some realistic noise
            y[i] += np.random.normal(0, 0.05)
            y[i] = np.clip(y[i], 0, 1)

        return X, y