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

def test_performance_predictor_api():
    """Test the performance predictor API"""
    # Features: study_streak, avg_score, completion_rate, struggle_time_hours, learning_style_visual, kinesthetic, reading, auditory
    features = [5.0, 0.85, 0.9, 2.5, 0.8, 0.6, 0.4, 0.2]
    input_data = {
        "features": features,
        "metadata": {"user_id": "test-user", "lesson": "docker-basics"}
    }

    response = client.post("/predict/performance-predictor", json=input_data)
    assert response.status_code == 200
    data = response.json()

    assert "prediction" in data
    assert "confidence" in data
    assert "explanation" in data
    assert len(data["prediction"]) > 0

def test_learning_style_detector_api():
    """Test the learning style detector API"""
    # Features: performance_score, time_spent_hours, hints_used, error_rate, study_streak
    features = [0.85, 3.5, 2, 0.15, 7]
    input_data = {
        "features": features,
        "metadata": {"user_id": "test-user", "assessment_type": "quiz"}
    }

    response = client.post("/predict/learning-style-detector", json=input_data)
    assert response.status_code == 200
    data = response.json()

    assert "prediction" in data
    assert "confidence" in data
    assert "explanation" in data
    assert len(data["prediction"]) == 4  # 4 learning styles

def test_skill_gap_analyzer_api():
    """Test the skill gap analyzer API"""
    # Features for skill gap analysis
    features = [0.7, 0.8, 0.6, 0.9, 0.5]
    input_data = {
        "features": features,
        "metadata": {"user_id": "test-user", "target_skill": "kubernetes"}
    }

    response = client.post("/predict/skill-gap-analyzer", json=input_data)
    assert response.status_code == 200
    data = response.json()

    assert "prediction" in data
    assert "confidence" in data
    assert "explanation" in data

def test_motivational_analyzer_api():
    """Test the motivational analyzer API"""
    # Features for motivation analysis
    features = [0.8, 0.9, 0.7, 0.6, 0.85]
    input_data = {
        "features": features,
        "metadata": {"user_id": "test-user", "current_streak": 5}
    }

    response = client.post("/predict/motivational-analyzer", json=input_data)
    assert response.status_code == 200
    data = response.json()

    assert "prediction" in data
    assert "confidence" in data
    assert "explanation" in data