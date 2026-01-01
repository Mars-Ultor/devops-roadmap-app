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