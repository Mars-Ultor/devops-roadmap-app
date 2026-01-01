"""
Learning Path Predictor Model
Predicts optimal next topics based on current progress and performance
"""

import numpy as np
from typing import List, Dict, Any, Optional
from .base_model import BaseMLModel


class LearningPathPredictor(BaseMLModel):
    """Predicts optimal learning path based on user performance"""

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

        # Topic names for predictions
        self.topic_names = [
            'git_basics', 'linux_commands', 'docker_fundamentals',
            'kubernetes_basics', 'aws_services', 'terraform_intro',
            'ci_cd_jenkins', 'monitoring_prometheus', 'advanced_docker',
            'k8s_advanced', 'cloud_architecture', 'infrastructure_as_code',
            'devsecops', 'microservices', 'observability'
        ]

        # Simple weights for prediction (learned during training)
        self.weights = None

    def _create_model(self):
        """Initialize the model"""
        # Simple linear model weights
        self.weights = np.random.randn(len(self.feature_names), len(self.topic_names)) * 0.1

    def _preprocess_features(self, features: List[float]) -> np.ndarray:
        """Preprocess input features"""
        # Ensure we have the right number of features
        if len(features) < len(self.feature_names):
            # Pad with zeros
            features.extend([0.0] * (len(self.feature_names) - len(features)))
        elif len(features) > len(self.feature_names):
            # Truncate
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