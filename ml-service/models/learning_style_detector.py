"""
Learning Style Detector Model
Detects user's preferred learning style (visual, kinesthetic, reading, auditory)
"""

import numpy as np
from typing import List, Dict, Any, Optional
from .base_model import BaseMLModel


class LearningStyleDetector(BaseMLModel):
    """Detects user's learning style preferences"""

    def __init__(self):
        super().__init__("learning_style_detector")
        self.feature_names = [
            'performance_score', 'time_spent_hours', 'hints_used',
            'error_rate', 'study_streak'
        ]

        self.learning_styles = ['visual', 'kinesthetic', 'reading', 'auditory']

        # Simple classification weights
        self.weights = None

    def _create_model(self):
        """Initialize the model"""
        self.weights = np.random.randn(len(self.feature_names), len(self.learning_styles)) * 0.1

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
            return np.full((X.shape[0], len(self.learning_styles)), 1/len(self.learning_styles))

        logits = np.dot(X, self.weights)
        # Softmax
        exp_logits = np.exp(logits - np.max(logits, axis=1, keepdims=True))
        probabilities = exp_logits / np.sum(exp_logits, axis=1, keepdims=True)

        return probabilities

    def generate_synthetic_data(self, n_samples: int = 1000) -> tuple:
        """Generate synthetic training data for learning style detection"""
        np.random.seed(42)

        X = np.random.randn(n_samples, len(self.feature_names))

        # Make features more realistic
        X[:, 0] = np.random.beta(2, 2, n_samples)      # performance_score (0-1)
        X[:, 1] = np.random.exponential(2, n_samples)  # time_spent_hours
        X[:, 2] = np.random.poisson(3, n_samples)      # hints_used
        X[:, 3] = np.random.beta(1, 3, n_samples)      # error_rate
        X[:, 4] = np.random.poisson(5, n_samples)      # study_streak

        # Generate target: learning style preferences
        y = np.zeros((n_samples, len(self.learning_styles)))

        for i in range(n_samples):
            perf = X[i, 0]
            time_spent = X[i, 1]
            hints = X[i, 2]
            errors = X[i, 3]

            # Determine learning style based on patterns
            if hints > 4:  # High hints usage suggests visual learner
                y[i, 0] = 0.6  # visual
                y[i, 1] = 0.2  # kinesthetic
                y[i, 2] = 0.1  # reading
                y[i, 3] = 0.1  # auditory
            elif time_spent > 3:  # High time spent suggests kinesthetic
                y[i, 0] = 0.2
                y[i, 1] = 0.6  # kinesthetic
                y[i, 2] = 0.1
                y[i, 3] = 0.1
            elif perf > 0.7:  # High performance suggests reading
                y[i, 0] = 0.1
                y[i, 1] = 0.1
                y[i, 2] = 0.6  # reading
                y[i, 3] = 0.2
            else:  # Default to auditory
                y[i, 0] = 0.1
                y[i, 1] = 0.1
                y[i, 2] = 0.2
                y[i, 3] = 0.6  # auditory

        return X, y

    def _generate_explanation(self, prediction: np.ndarray, features: List[float], metadata: Optional[Dict[str, Any]]) -> str:
        """Generate explanation for learning style detection"""
        style_idx = np.argmax(prediction)
        primary_style = self.learning_styles[style_idx]
        confidence = float(np.max(prediction))

        explanations = {
            'visual': "You learn best through visual aids, diagrams, and demonstrations",
            'kinesthetic': "You learn best through hands-on practice and physical activities",
            'reading': "You learn best through reading and written materials",
            'auditory': "You learn best through listening and verbal explanations"
        }

        return f"{explanations.get(primary_style, 'Unknown style')} (confidence: {confidence:.1%})"

    def detect_learning_style(self, features: List[float]) -> Dict[str, Any]:
        """Detect learning style with detailed analysis"""
        prediction = self.predict(features)[0]

        style_idx = np.argmax(prediction)
        primary_style = self.learning_styles[style_idx]

        return {
            'primary_style': primary_style,
            'style_probabilities': {
                style: float(prob) for style, prob in zip(self.learning_styles, prediction)
            },
            'confidence': float(np.max(prediction)),
            'explanation': self._generate_explanation(prediction, features, None),
            'recommendations': self._get_style_recommendations(primary_style)
        }

    def _get_style_recommendations(self, primary_style: str) -> List[str]:
        """Get learning recommendations based on style"""
        recommendations = {
            'visual': [
                "Use diagrams and flowcharts to understand concepts",
                "Watch video tutorials and demonstrations",
                "Create mind maps for complex topics"
            ],
            'kinesthetic': [
                "Practice with hands-on labs and exercises",
                "Build and deploy actual projects",
                "Use interactive simulations"
            ],
            'reading': [
                "Read documentation and technical articles",
                "Take detailed notes during learning",
                "Study code examples and documentation"
            ],
            'auditory': [
                "Listen to podcasts and audio tutorials",
                "Participate in discussions and Q&A sessions",
                "Explain concepts aloud to reinforce learning"
            ]
        }

        return recommendations.get(primary_style, ["Continue exploring different learning methods"])

        performance_score = features[0] if features else 0.5
        time_spent = features[1] if len(features) > 1 else 5
        hints_used = int(features[2]) if len(features) > 2 else 5

        explanation = f"Detected {primary_style} learning style (confidence: {confidence:.1%}). "

        if primary_style == 'visual':
            explanation += "You learn best through diagrams, videos, and visual aids. "
        elif primary_style == 'kinesthetic':
            explanation += "You learn best through hands-on practice and experimentation. "
        elif primary_style == 'reading':
            explanation += "You learn best through reading and written materials. "
        elif primary_style == 'auditory':
            explanation += "You learn best through lectures and audio content. "

        explanation += f"Based on {performance_score:.1%} performance, {time_spent:.1f} hours spent, "
        explanation += f"and {hints_used} hints used."

        return explanation

    def generate_synthetic_data(self, n_samples: int = 1000) -> tuple:
        """Generate synthetic learning style data"""
        np.random.seed(42)

        X = np.random.randn(n_samples, len(self.feature_names))

        # Generate learning style targets (0-3 for 4 styles)
        y = np.zeros(n_samples, dtype=int)

        for i in range(n_samples):
            performance = (X[i, 0] + 1) / 2  # 0-1 scale
            time_spent = max(0, X[i, 1] * 5 + 10)  # 0-20 hours
            hints_used = max(0, X[i, 2] * 3 + 5)  # 0-10 hints
            error_rate = max(0, min(1, (X[i, 3] + 1) / 2))  # 0-1 scale

            # Determine learning style based on patterns
            if hints_used > 7:  # High hints usage suggests visual learner
                y[i] = 0  # visual
            elif time_spent > 15:  # High time spent suggests kinesthetic learner
                y[i] = 1  # kinesthetic
            elif error_rate < 0.3:  # Low error rate suggests reading learner
                y[i] = 2  # reading
            else:  # Default to auditory
                y[i] = 3  # auditory

            # Add some realistic variation
            if np.random.random() < 0.2:  # 20% chance of different style
                y[i] = np.random.randint(0, 4)

        return X, y