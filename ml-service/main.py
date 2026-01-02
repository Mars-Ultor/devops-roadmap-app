"""
DevOps Roadmap ML Service
Full ML service using trained models from the models directory
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
import os
from pathlib import Path

# Import ML models
from models.learning_path_predictor import LearningPathPredictor
from models.performance_predictor import PerformancePredictor
from models.learning_style_detector import LearningStyleDetector
from models.skill_gap_analyzer import SkillGapAnalyzer
from models.motivational_analyzer import MotivationalAnalyzer

app = FastAPI(
    title="DevOps Roadmap ML Service",
    description="ML service for intelligent DevOps learning",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML models with correct naming (hyphens to match client expectations)
models = {
    'learning-path-predictor': LearningPathPredictor(),
    'performance-predictor': PerformancePredictor(),
    'learning-style-detector': LearningStyleDetector(),
    'skill-gap-analyzer': SkillGapAnalyzer(),
    'motivational-analyzer': MotivationalAnalyzer(),
}

# Pydantic models for API
class MLInput(BaseModel):
    features: List[float]
    metadata: Optional[Dict[str, Any]] = None

class PredictionResponse(BaseModel):
    prediction: List[float]
    confidence: float
    probabilities: Optional[List[float]] = None
    explanation: Optional[str] = None
    feature_importance: Optional[Dict[str, float]] = None

class CoachContext(BaseModel):
    userId: str
    contentId: str
    currentWeek: int
    performanceScore: float
    timeSpent: int
    hintsUsed: int
    errorRate: float
    studyStreak: int
    avgScore: float
    completionRate: float
    struggleTime: int
    topicScores: Dict[str, float]
    attemptCounts: Dict[str, int]
    timeSpentPerTopic: Dict[str, int]
    errorPatterns: Dict[str, int]

class MLCoachInsights(BaseModel):
    learningStyle: Dict[str, Any]
    skillGaps: List[Dict[str, Any]]
    optimalPath: Dict[str, Any]
    performancePrediction: Dict[str, Any]
    motivationalProfile: Dict[str, Any]

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "DevOps Roadmap ML Service",
        "status": "running",
        "models_loaded": list(models.keys())
    }

@app.get("/health")
async def health():
    """Detailed health check"""
    return {
        "status": "healthy",
        "timestamp": datetime.now().isoformat(),
        "models": {
            name: model.is_loaded() for name, model in models.items()
        }
    }

@app.post("/predict/{model_name}")
async def predict(model_name: str, input_data: MLInput):
    """Run prediction on specified model"""
    if model_name not in models:
        raise HTTPException(status_code=404, detail=f"Model {model_name} not found")

    try:
        model = models[model_name]

        # Use the ML model's predict method with features array
        prediction_result = model.predict(input_data.features)

        # Convert numpy array to list if needed
        if hasattr(prediction_result, 'tolist'):
            prediction_list = prediction_result.tolist()
        else:
            prediction_list = list(prediction_result) if isinstance(prediction_result, (list, tuple)) else [float(prediction_result)]

        # Create response based on model type
        response_data = {
            'prediction': prediction_list,
            'confidence': 0.8,  # Default confidence
            'probabilities': None,
            'explanation': f'Prediction from {model_name} model',
            'feature_importance': None
        }

        # Add model-specific explanations
        if model_name == 'learning-path-predictor':
            response_data['explanation'] = 'Recommended learning path based on user performance data'
        elif model_name == 'performance-predictor':
            response_data['explanation'] = 'Performance prediction for completion probability'
        elif model_name == 'learning-style-detector':
            response_data['explanation'] = 'Detected learning style preferences (visual, kinesthetic, reading, auditory)'
        elif model_name == 'skill-gap-analyzer':
            response_data['explanation'] = 'Identified skill gaps and areas needing improvement'
        elif model_name == 'motivational-analyzer':
            response_data['explanation'] = 'Motivational analysis and engagement predictions'

class MLTrainingData(BaseModel):
    inputs: List[List[float]]
    outputs: List[List[float]]
    metadata: Optional[Dict[str, Any]] = None

@app.post("/train/{model_name}")
async def train_model(model_name: str, training_data: MLTrainingData):
    """Train or fine-tune a model with new data"""
    if model_name not in models:
        raise HTTPException(status_code=404, detail=f"Model {model_name} not found")

    try:
        model = models[model_name]

        # Convert to numpy arrays
        import numpy as np
        X = np.array(training_data.inputs)
        y = np.array(training_data.outputs)

        # Train the model
        model.train(X, y)

        return {
            "message": f"Model {model_name} training completed successfully",
            "status": "success"
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")

@app.post("/coach/insights")
async def get_coach_insights(context: CoachContext):
    """Get comprehensive ML-enhanced coaching insights"""
    try:
        # Use simple models for insights
        learning_path_result = models['learning_path_predictor'].predict({
            'experience_level': 'intermediate' if context.currentWeek > 3 else 'beginner',
            'interests': list(context.topicScores.keys())[:3] if context.topicScores else []
        })

        performance_result = models['performance_predictor'].predict({
            'scores': [context.avgScore, context.performanceScore]
        })

        # Create simplified insights
        insights = {
            'learningStyle': {
                'primary_style': 'visual' if context.hintsUsed < 3 else 'hands_on',
                'confidence': 0.7,
                'recommendations': ['practice coding exercises', 'watch video tutorials']
            },
            'skillGaps': [
                {
                    'topic': topic,
                    'gap_score': max(0, 1.0 - score),
                    'priority': 'high' if score < 0.6 else 'medium'
                }
                for topic, score in context.topicScores.items()
                if score < 0.8
            ][:5],  # Top 5 gaps
            'optimalPath': learning_path_result,
            'performancePrediction': performance_result,
            'motivationalProfile': {
                'motivation_level': 'high' if context.studyStreak > 5 else 'medium',
                'recommended_actions': ['set daily goals', 'track progress', 'celebrate milestones']
            }
        }

        return insights

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate insights: {str(e)}")

@app.get("/models")
async def list_models():
    """List all available models"""
    return {
        "models": [
            {
                "name": name,
                "type": model.__class__.__name__,
                "loaded": model.is_trained,
                "features": getattr(model, 'feature_names', []),
                "metrics": getattr(model, 'metrics', {"accuracy": 0.0})
            }
            for name, model in models.items()
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))