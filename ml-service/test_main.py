"""
Basic tests for ML Service
"""

import pytest
from main import app, SimpleLearningPathPredictor
from fastapi.testclient import TestClient

client = TestClient(app)

def test_health_endpoint():
    """Test the health endpoint"""
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy", "service": "ml-service"}

def test_learning_path_prediction():
    """Test the learning path prediction"""
    predictor = SimpleLearningPathPredictor()

    # Test beginner level
    user_data = {
        "experience_level": "beginner",
        "interests": ["docker", "kubernetes"]
    }
    result = predictor.predict(user_data)
    assert "recommended_path" in result
    assert "estimated_completion_days" in result
    assert "confidence" in result
    assert result["confidence"] == 0.8

    # Test intermediate level
    user_data["experience_level"] = "intermediate"
    result = predictor.predict(user_data)
    assert len(result["recommended_path"]) > 0

    # Test advanced level
    user_data["experience_level"] = "advanced"
    result = predictor.predict(user_data)
    assert len(result["recommended_path"]) > 0

def test_predictor_is_loaded():
    """Test that the predictor reports as loaded"""
    predictor = SimpleLearningPathPredictor()
    assert predictor.is_loaded() == True