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
            features = features[:len(self.feature_names)]

        return np.array(features).reshape(1, -1)

    def _train_model(self, X: np.ndarray, y: np.ndarray):
        """Train the model using simple linear regression"""
        # Simple pseudo-training: adjust weights based on data patterns
        if self.weights is None:
            self.weights = np.random.randn(X.shape[1], y.shape[1]) * 0.1

        # Simple gradient descent-like update (very basic)
        learning_rate = 0.01
        for _ in range(10):  # Few iterations
            predictions = np.dot(X, self.weights)
            errors = y - predictions
            self.weights += learning_rate * np.dot(X.T, errors) / len(X)

    def _predict_model(self, X: np.ndarray) -> np.ndarray:
        """Make predictions"""
        if self.weights is None:
            # Return random predictions if not trained
            return np.random.rand(X.shape[0], len(self.topic_names))

        # Linear prediction
        raw_predictions = np.dot(X, self.weights)

        # Apply sigmoid to get probabilities between 0 and 1
        predictions = 1 / (1 + np.exp(-raw_predictions))

        return predictions

    def generate_synthetic_data(self, n_samples: int = 1000) -> tuple:
        """Generate synthetic training data for learning paths"""
        np.random.seed(42)

        X = np.random.randn(n_samples, len(self.feature_names))

        # Make some features more realistic
        X[:, 0] = np.random.randint(1, 13, n_samples)  # current_week (1-12)
        X[:, 1] = np.random.beta(2, 2, n_samples)      # performance_score (0-1)
        X[:, 2] = np.random.exponential(2, n_samples)  # time_spent_hours
        X[:, 3] = np.random.poisson(3, n_samples)      # hints_used
        X[:, 4] = np.random.beta(1, 3, n_samples)      # error_rate

        # Topic scores (0-1)
        for i in range(5, 13):
            X[:, i] = np.random.beta(2, 2, n_samples)

        # Topic attempts (1-20)
        for i in range(13, 21):
            X[:, i] = np.random.poisson(5, n_samples)

        # Generate target: recommended topics based on current progress
        y = np.zeros((n_samples, len(self.topic_names)))

        for i in range(n_samples):
            current_week = X[i, 0]
            performance = X[i, 1]

            # Recommend topics based on week and performance
            if current_week <= 3:
                # Early weeks: focus on basics
                y[i, 0] = 0.9  # git_basics
                y[i, 1] = 0.8  # linux_commands
            elif current_week <= 6:
                # Mid weeks: container and cloud basics
                y[i, 2] = 0.9  # docker_fundamentals
                y[i, 3] = 0.8  # kubernetes_basics
                y[i, 4] = 0.7  # aws_services
            else:
                # Later weeks: advanced topics
                if performance > 0.7:
                    y[i, 8] = 0.9  # advanced_docker
                    y[i, 9] = 0.8  # k8s_advanced
                    y[i, 10] = 0.7  # cloud_architecture
                else:
                    y[i, 5] = 0.8  # terraform_intro
                    y[i, 6] = 0.7  # ci_cd_jenkins

        return X, y

    def get_recommended_topics(self, features: List[float], top_k: int = 3) -> List[Dict[str, Any]]:
        """Get top recommended topics with scores"""
        predictions = self.predict(features)[0]

        # Get top k recommendations
        top_indices = np.argsort(predictions)[-top_k:][::-1]

        recommendations = []
        for idx in top_indices:
            recommendations.append({
                'topic': self.topic_names[idx],
                'score': float(predictions[idx]),
                'confidence': min(float(predictions[idx]) * 100, 95.0)
            })

        return recommendations
        """Generate explanation for learning path prediction"""
        current_week = int(features[0]) if features else 1
        performance_score = features[1] if len(features) > 1 else 0.5

        # Get top recommended topics
        top_indices = np.argsort(prediction[0])[-3:][::-1]  # Top 3
        top_topics = [self.topic_names[i] for i in top_indices if i < len(self.topic_names)]

        explanation = f"Based on Week {current_week} progress and {performance_score:.1%} performance score, "
        explanation += f"recommended next topics: {', '.join(top_topics)}. "

        if performance_score > 0.8:
            explanation += "Strong performance suggests advancing to advanced topics."
        elif performance_score > 0.6:
            explanation += "Good progress - continue with current difficulty level."
        else:
            explanation += "Focus on building fundamentals before advancing."

        return explanation

    def generate_synthetic_data(self, n_samples: int = 1000) -> tuple:
        """Generate synthetic learning path data"""
        np.random.seed(42)

        X = np.random.randn(n_samples, len(self.feature_names))

        # Generate multi-output targets (recommended topics)
        y = np.zeros((n_samples, len(self.topic_names)))

        for i in range(n_samples):
            # Base recommendations on current week and performance
            current_week = max(1, min(12, int(X[i, 0] * 3 + 6)))  # Weeks 1-12
            performance = (X[i, 1] + 1) / 2  # 0-1 scale

            # Recommend topics based on week and performance
            if current_week <= 3:
                # Early weeks - focus on basics
                y[i, 0] = 1  # git_basics
                y[i, 1] = 1  # linux_commands
                if performance > 0.7:
                    y[i, 2] = 1  # docker_fundamentals
            elif current_week <= 6:
                # Mid weeks - containers and cloud
                y[i, 2] = 1  # docker_fundamentals
                y[i, 3] = 1  # kubernetes_basics
                y[i, 4] = 1  # aws_services
                if performance > 0.6:
                    y[i, 5] = 1  # terraform_intro
            else:
                # Later weeks - advanced topics
                y[i, 8] = 1  # advanced_docker
                y[i, 9] = 1  # k8s_advanced
                y[i, 10] = 1  # cloud_architecture
                if performance > 0.8:
                    y[i, 13] = 1  # microservices

        return X, y