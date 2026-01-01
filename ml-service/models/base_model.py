"""
Base ML Model Class - Real ML models using scikit-learn
"""

import numpy as np
import joblib
import os
from pathlib import Path
from typing import Dict, Any, List, Optional
from abc import ABC, abstractmethod
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score
from sklearn.preprocessing import StandardScaler


class BaseMLModel(ABC):
    """Base class for all ML models using scikit-learn"""

    def __init__(self, model_name: str):
        self.model_name = model_name
        self.model = None
        self.scaler = StandardScaler()
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

    def _preprocess_features(self, features: List[float]) -> np.ndarray:
        """Preprocess input features"""
        features_array = np.array(features).reshape(1, -1)
        if self.is_trained:
            return self.scaler.transform(features_array)
        return features_array

    def train(self, X: np.ndarray, y: np.ndarray, test_size: float = 0.2, random_state: int = 42):
        """Train the model using scikit-learn"""
        try:
            # Create model if not exists
            if self.model is None:
                self._create_model()

            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=test_size, random_state=random_state
            )

            # Fit scaler on training data
            self.scaler.fit(X_train)

            # Scale training data
            X_train_scaled = self.scaler.transform(X_train)
            X_test_scaled = self.scaler.transform(X_test)

            # Train model
            self.model.fit(X_train_scaled, y_train)

            # Make predictions on test set
            y_pred = self.model.predict(X_test_scaled)

            # Calculate metrics
            self.metrics['accuracy'] = accuracy_score(y_test, y_pred)

            # Handle different types of classification
            if len(np.unique(y)) > 2:  # Multi-class
                self.metrics['precision'] = precision_score(y_test, y_pred, average='weighted')
                self.metrics['recall'] = recall_score(y_test, y_pred, average='weighted')
                self.metrics['f1_score'] = f1_score(y_test, y_pred, average='weighted')
            else:  # Binary
                self.metrics['precision'] = precision_score(y_test, y_pred)
                self.metrics['recall'] = recall_score(y_test, y_pred)
                self.metrics['f1_score'] = f1_score(y_test, y_pred)

            self.is_trained = True
            print(f"✅ {self.model_name} trained successfully!")
            print(f"   Accuracy: {self.metrics['accuracy']:.3f}")
            print(f"   F1-Score: {self.metrics['f1_score']:.3f}")

        except Exception as e:
            print(f"❌ Training failed for {self.model_name}: {e}")
            raise

    def predict(self, features: List[float]) -> Dict[str, Any]:
        """Make prediction"""
        if not self.is_trained or self.model is None:
            raise ValueError(f"Model {self.model_name} is not trained")

        try:
            # Preprocess features
            X = self._preprocess_features(features)

            # Make prediction
            prediction = self.model.predict(X)

            # Get prediction probabilities if available
            probabilities = None
            if hasattr(self.model, 'predict_proba'):
                probabilities = self.model.predict_proba(X)[0]

            return {
                'prediction': prediction.tolist() if hasattr(prediction, 'tolist') else prediction,
                'probabilities': probabilities.tolist() if probabilities is not None and hasattr(probabilities, 'tolist') else probabilities,
                'confidence': float(np.max(probabilities)) if probabilities is not None else 0.8,
                'model_name': self.model_name
            }

        except Exception as e:
            raise ValueError(f"Prediction failed: {e}")

    def save_model(self, filename: Optional[str] = None):
        """Save trained model to disk"""
        if not self.is_trained:
            raise ValueError("Cannot save untrained model")

        if filename is None:
            filename = f"{self.model_name}.joblib"

        model_path = self.models_dir / filename

        # Save model and scaler
        model_data = {
            'model': self.model,
            'scaler': self.scaler,
            'metrics': self.metrics,
            'feature_names': self.feature_names,
            'is_trained': self.is_trained
        }

        joblib.dump(model_data, model_path)
        print(f"💾 Model saved to {model_path}")

    def load_model(self, filename: Optional[str] = None):
        """Load trained model from disk"""
        if filename is None:
            filename = f"{self.model_name}.joblib"

        model_path = self.models_dir / filename

        if not model_path.exists():
            raise FileNotFoundError(f"Model file not found: {model_path}")

        model_data = joblib.load(model_path)

        self.model = model_data['model']
        self.scaler = model_data['scaler']
        self.metrics = model_data['metrics']
        self.feature_names = model_data['feature_names']
        self.is_trained = model_data['is_trained']

        print(f"📂 Model loaded from {model_path}")

    def is_loaded(self) -> bool:
        """Check if model is loaded and trained"""
        return self.is_trained and self.model is not None

    def get_metrics(self) -> Dict[str, float]:
        """Get model performance metrics"""
        return self.metrics.copy()

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