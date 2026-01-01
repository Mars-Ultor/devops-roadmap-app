"""
Learning Path Predictor Model
Predicts optimal next topics based on current progress and performance
"""

import numpy as np
from typing import List, Dict, Any, Optional
from .base_model import BaseMLModel
from sklearn.ensemble import RandomForestClassifier
from sklearn.multioutput import MultiOutputClassifier


class LearningPathPredictor(BaseMLModel):
    """Predicts optimal learning path based on user performance using Random Forest"""

    def __init__(self):
        super().__init__("learning_path_predictor")
        self.feature_names = [
            'current_week', 'performance_score', 'time_spent_hours',
            'hints_used', 'error_rate', 'git_score', 'linux_score',
            'docker_score', 'k8s_score', 'aws_score', 'terraform_score',
            'jenkins_score', 'monitoring_score', 'git_attempts',
            'linux_attempts', 'docker_attempts', 'k8s_attempts',
            'aws_attempts', 'terraform_attempts', 'jenkins_attempts',
            'monitoring_attempts'
        ]

        # Topic names for predictions (multi-label classification)
        self.topic_names = [
            'git_basics', 'linux_commands', 'docker_fundamentals',
            'kubernetes_basics', 'aws_services', 'terraform_intro',
            'ci_cd_jenkins', 'monitoring_prometheus', 'advanced_docker',
            'k8s_advanced', 'cloud_architecture', 'infrastructure_as_code',
            'devsecops', 'microservices', 'observability'
        ]

    def _create_model(self):
        """Initialize the Random Forest model for multi-label classification"""
        # Use Random Forest with MultiOutputClassifier for predicting multiple topics
        base_classifier = RandomForestClassifier(
            n_estimators=100,
            max_depth=10,
            random_state=42,
            n_jobs=-1
        )
        self.model = MultiOutputClassifier(base_classifier, n_jobs=-1)

    def predict(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict optimal learning path"""
        if not self.is_trained:
            # Fallback to rule-based if model not trained
            return self._rule_based_prediction(user_data)

        try:
            # Extract features from user data
            features = self._extract_features(user_data)

            # Make prediction using trained model
            result = super().predict(features)

            # Convert predictions to topic recommendations
            predictions = result['prediction'][0] if isinstance(result['prediction'], list) and len(result['prediction']) > 0 else result['prediction']

            recommended_topics = []
            confidence_scores = []

            if hasattr(predictions, '__iter__') and not isinstance(predictions, (str, bytes)):
                for i, pred in enumerate(predictions):
                    if pred == 1:  # Topic recommended
                        recommended_topics.append(self.topic_names[i])
                        # Use feature importance or probability as confidence
                        confidence_scores.append(result.get('confidence', 0.8))
            else:
                # Single prediction case
                if predictions == 1:
                    recommended_topics = [self.topic_names[0]]
                    confidence_scores = [result.get('confidence', 0.8)]

            return {
                'recommended_path': recommended_topics[:5],  # Top 5 recommendations
                'estimated_completion_days': len(recommended_topics) * 7,
                'confidence': np.mean(confidence_scores) if confidence_scores else 0.8,
                'total_topics': len(recommended_topics),
                'model_used': 'random_forest'
            }

        except Exception as e:
            print(f"ML prediction failed, falling back to rules: {e}")
            return self._rule_based_prediction(user_data)

    def _extract_features(self, user_data: Dict[str, Any]) -> List[float]:
        """Extract numerical features from user data"""
        features = []

        # Basic performance features
        features.append(user_data.get('current_week', 1))
        features.append(user_data.get('performance_score', 0.5))
        features.append(user_data.get('time_spent', 0) / 3600)  # Convert to hours
        features.append(user_data.get('hints_used', 0))
        features.append(user_data.get('error_rate', 0.2))

        # Topic scores (pad with 0.5 if missing)
        topic_scores = user_data.get('topic_scores', {})
        for topic in ['git', 'linux', 'docker', 'kubernetes', 'aws', 'terraform', 'jenkins', 'monitoring']:
            features.append(topic_scores.get(topic, 0.5))

        # Topic attempts (pad with 1 if missing)
        attempt_counts = user_data.get('attempt_counts', {})
        for topic in ['git', 'linux', 'docker', 'kubernetes', 'aws', 'terraform', 'jenkins', 'monitoring']:
            features.append(attempt_counts.get(topic, 1))

        return features

    def _rule_based_prediction(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        """Fallback rule-based prediction"""
        experience = 'intermediate' if user_data.get('current_week', 1) > 3 else 'beginner'
        interests = list(user_data.get('topic_scores', {}).keys())[:3] if user_data.get('topic_scores') else []

        if experience == 'beginner':
            path = ['git_basics', 'linux_commands', 'docker_fundamentals']
        elif experience == 'intermediate':
            path = ['kubernetes_basics', 'aws_services', 'terraform_intro']
        else:
            path = ['ci_cd_jenkins', 'monitoring_prometheus', 'cloud_architecture']

        return {
            'recommended_path': path,
            'estimated_completion_days': len(path) * 7,
            'confidence': 0.7,
            'total_topics': len(path),
            'model_used': 'rule_based_fallback'
        }