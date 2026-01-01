"""
Base ML Model Class - Simplified version without sklearn dependencies
"""

import numpy as np
import joblib
import os
from pathlib import Path
from typing import Dict, Any, List, Optional
from abc import ABC, abstractmethod


class BaseMLModel(ABC):
    """Base class for all ML models"""

    def __init__(self, model_name: str):
        self.model_name = model_name
        self.model = None
        self.is_trained = False
        self.metrics = {
            'accuracy': 0.0,
            'precision': 0.0,
            'recall': 0.0,
            'f1_score': 0.0
        }
        self.feature_names = []

        # Create models directory if it doesn't exist
        self.models_dir = Path(__file__).parent / "saved_models"
        self.models_dir.mkdir(exist_ok=True)

    @abstractmethod
    def _create_model(self):
        """Create the specific ML model"""
        pass

    @abstractmethod
    def _preprocess_features(self, features: List[float]) -> np.ndarray:
        """Preprocess input features"""
        pass

    def train(self, X: np.ndarray, y: np.ndarray, test_size: float = 0.2):
        """Train the model"""
        try:
            # Simple train/test split (without sklearn)
            n_samples = len(X)
            n_test = int(n_samples * test_size)
            indices = np.random.permutation(n_samples)
            test_indices = indices[:n_test]
            train_indices = indices[n_test:]

            X_train = X[train_indices]
            X_test = X[test_indices]
            y_train = y[train_indices]
            y_test = y[test_indices]

            # Fit scaler on training data
            self._fit_scaler(X_train)

            # Scale features
            X_train_scaled = self._scale_features(X_train)
            X_test_scaled = self._scale_features(X_test)

            # Create and train model
            self._create_model()
            self._train_model(X_train_scaled, y_train)

            # Evaluate
            self._evaluate(X_test_scaled, y_test)

            self.is_trained = True
            self.save_model()

            return True

        except Exception as e:
            print(f"Training failed for {self.model_name}: {e}")
            return False

    def predict(self, features: List[float]) -> np.ndarray:
        """Make prediction for single input"""
        if not self.is_trained:
            return np.array([0.5])  # Default prediction

        try:
            # Preprocess features
            X = self._preprocess_features(features)
            X_scaled = self._scale_features(X)

            # Make prediction
            return self._predict_model(X_scaled)

        except Exception as e:
            print(f"Prediction failed for {self.model_name}: {e}")
            return np.array([0.5])

    def _fit_scaler(self, X: np.ndarray):
        """Fit scaler on training data"""
        self.scaler_mean = np.mean(X, axis=0)
        self.scaler_std = np.std(X, axis=0) + 1e-8  # Add small value to avoid division by zero

    def _scale_features(self, X: np.ndarray) -> np.ndarray:
        """Scale features using fitted scaler"""
        if not hasattr(self, 'scaler_mean'):
            return X
        return (X - self.scaler_mean) / self.scaler_std

    @abstractmethod
    def _train_model(self, X: np.ndarray, y: np.ndarray):
        """Train the specific model"""
        pass

    @abstractmethod
    def _predict_model(self, X: np.ndarray) -> np.ndarray:
        """Make predictions with the trained model"""
        pass

    def _evaluate(self, X_test: np.ndarray, y_test: np.ndarray):
        """Evaluate model performance"""
        try:
            predictions = self._predict_model(X_test)

            # Simple accuracy calculation
            if len(y_test.shape) > 1 and y_test.shape[1] > 1:
                # Multi-class
                pred_classes = np.argmax(predictions, axis=1)
                true_classes = np.argmax(y_test, axis=1)
                accuracy = np.mean(pred_classes == true_classes)
            else:
                # Binary
                pred_binary = (predictions > 0.5).astype(int).flatten()
                y_test_flat = y_test.flatten()
                accuracy = np.mean(pred_binary == y_test_flat)

            self.metrics['accuracy'] = float(accuracy)
            self.metrics['precision'] = float(accuracy)  # Simplified
            self.metrics['recall'] = float(accuracy)     # Simplified
            self.metrics['f1_score'] = float(accuracy)   # Simplified

        except Exception as e:
            print(f"Evaluation failed: {e}")
            self.metrics['accuracy'] = 0.5

    def save_model(self):
        """Save model to disk"""
        try:
            model_path = self.models_dir / f"{self.model_name}.joblib"
            model_data = {
                'model': self.model,
                'scaler_mean': getattr(self, 'scaler_mean', None),
                'scaler_std': getattr(self, 'scaler_std', None),
                'is_trained': self.is_trained,
                'metrics': self.metrics,
                'feature_names': self.feature_names,
                'model_name': self.model_name
            }
            joblib.dump(model_data, model_path)
        except Exception as e:
            print(f"Failed to save model {self.model_name}: {e}")

    def load_model(self) -> bool:
        """Load model from disk"""
        try:
            model_path = self.models_dir / f"{self.model_name}.joblib"
            if model_path.exists():
                model_data = joblib.load(model_path)
                self.model = model_data.get('model')
                self.scaler_mean = model_data.get('scaler_mean')
                self.scaler_std = model_data.get('scaler_std')
                self.is_trained = model_data.get('is_trained', False)
                self.metrics = model_data.get('metrics', {})
                self.feature_names = model_data.get('feature_names', [])
                return True
            return False
        except Exception as e:
            print(f"Failed to load model {self.model_name}: {e}")
            return False

    def get_model_info(self) -> Dict[str, Any]:
        """Get model information"""
        return {
            'name': self.model_name,
            'is_trained': self.is_trained,
            'features': self.feature_names,
            'metrics': self.metrics,
            'type': self.__class__.__name__
        }

    def generate_synthetic_data(self, n_samples: int = 1000, n_features: int = 10) -> tuple:
        """Generate synthetic training data"""
        X = np.random.randn(n_samples, n_features)
        y = np.random.randint(0, 2, n_samples)
        return X, y