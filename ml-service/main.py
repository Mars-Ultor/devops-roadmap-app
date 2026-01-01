"""
DevOps Roadmap ML Service
Simplified version for deployment - using rule-based logic instead of complex ML models
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
import os
from pathlib import Path

app = FastAPI(
    title="DevOps Roadmap ML Service",
    description="Simplified ML service for intelligent DevOps learning",
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

# Simple rule-based "models" instead of complex ML
class SimpleLearningPathPredictor:
    def predict(self, user_data: Dict[str, Any]) -> Dict[str, Any]:
        # Simple rule-based prediction
        experience = user_data.get('experience_level', 'beginner')
        interests = user_data.get('interests', [])

        if experience == 'beginner':
            path = ['week1', 'week2', 'week3']
        elif experience == 'intermediate':
            path = ['week4', 'week5', 'week6']
        else:
            path = ['week7', 'week8', 'week9']

        return {
            'recommended_path': path,
            'estimated_completion_days': len(path) * 7,
            'confidence': 0.8
        }

    def is_loaded(self) -> bool:
        return True

class SimplePerformancePredictor:
    def predict(self, quiz_data: Dict[str, Any]) -> Dict[str, Any]:
        # Simple performance prediction based on quiz scores
        scores = quiz_data.get('scores', [])
        if not scores:
            avg_score = 0.5
        else:
            avg_score = sum(scores) / len(scores)

        if avg_score > 0.8:
            performance = 'excellent'
            next_difficulty = 'advanced'
        elif avg_score > 0.6:
            performance = 'good'
            next_difficulty = 'intermediate'
        else:
            performance = 'needs_improvement'
            next_difficulty = 'beginner'

        return {
            'performance_level': performance,
            'next_difficulty': next_difficulty,
            'predicted_score': avg_score,
            'recommendations': ['practice_more', 'review_materials'] if avg_score < 0.7 else []
        }

    def is_loaded(self) -> bool:
        return True

# Initialize simple models
models = {
    'learning_path_predictor': SimpleLearningPathPredictor(),
    'performance_predictor': SimplePerformancePredictor(),
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
        # For simple models, use metadata if available, otherwise create basic input
        if input_data.metadata:
            result = model.predict(input_data.metadata)
        else:
            # Create basic input from features
            basic_input = {'scores': input_data.features} if model_name == 'performance_predictor' else {'experience_level': 'beginner', 'interests': []}
            result = model.predict(basic_input)

        # Convert result to PredictionResponse format
        return PredictionResponse(
            prediction=[result.get('predicted_score', 0.5)],
            confidence=result.get('confidence', 0.8),
            probabilities=None,
            explanation=str(result),
            feature_importance=None
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

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
                "loaded": model.is_loaded(),
                "features": ["Simple rule-based predictions"],
                "metrics": {"simplicity": 1.0, "reliability": 0.8}
            }
            for name, model in models.items()
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))