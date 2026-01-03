"""
Basic tests for ML Service
"""

import pytest
from main import app
from fastapi.testclient import TestClient

client = TestClient(app)

def test_health_endpoint():
    """Test the health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert "models" in data
    # Check that learning-path-predictor is loaded
    assert "learning-path-predictor" in data["models"]

def test_root_endpoint():
    """Test the root endpoint"""
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "DevOps Roadmap ML Service" in data["message"]
    assert data["status"] == "running"

def test_models_endpoint():
    """Test the models listing endpoint"""
    response = client.get("/models")
    assert response.status_code == 200
    data = response.json()
    assert "models" in data
    assert len(data["models"]) > 0

    # Check that learning-path-predictor is in the list
    model_names = [model["name"] for model in data["models"]]
    assert "learning-path-predictor" in model_names

def test_learning_path_prediction_api():
    """Test the learning path prediction through API"""
    # Test with sample features (this matches the actual API)
    features = [1.0, 0.8, 2.0, 1.0, 0.1]  # Sample feature values
    input_data = {
        "features": features,
        "metadata": {"experience_level": "beginner", "interests": ["docker", "kubernetes"]}
    }

    response = client.post("/predict/learning-path-predictor", json=input_data)
    assert response.status_code == 200
    data = response.json()

    assert "prediction" in data
    assert "confidence" in data
    assert "explanation" in data
    assert len(data["prediction"]) > 0
    assert data["confidence"] > 0

def test_invalid_model():
    """Test prediction with invalid model name"""
    input_data = {"features": [1.0, 0.8, 2.0, 1.0, 0.1]}
    response = client.post("/predict/invalid-model", json=input_data)
    assert response.status_code == 404