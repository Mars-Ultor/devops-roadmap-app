"""
DevOps Roadmap ML Service
Real machine learning models for intelligent coaching and personalization
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import numpy as np
import pandas as pd
from datetime import datetime
import joblib
import os
from pathlib import Path

# Import our ML models
from models.learning_path_predictor import LearningPathPredictor
from models.performance_predictor import PerformancePredictor
from models.learning_style_detector import LearningStyleDetector
from models.skill_gap_analyzer import SkillGapAnalyzer
from models.motivational_analyzer import MotivationalAnalyzer

app = FastAPI(
    title="DevOps Roadmap ML Service",
    description="Real ML models for intelligent DevOps learning",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # React dev servers
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize ML models
models = {}

def load_models():
    """Load all trained ML models"""
    global models

    try:
        models = {
            'learning_path_predictor': LearningPathPredictor(),
            'performance_predictor': PerformancePredictor(),
            'learning_style_detector': LearningStyleDetector(),
            'skill_gap_analyzer': SkillGapAnalyzer(),
            'motivational_analyzer': MotivationalAnalyzer()
        }

        # Load trained models
        for name, model in models.items():
            try:
                model.load_model()
                print(f"✅ Loaded model: {name}")
            except Exception as e:
                print(f"⚠️  Failed to load {name}: {e}")

        print("✅ All ML models loaded successfully")

    except Exception as e:
        print(f"❌ Error loading models: {e}")
        import traceback
        traceback.print_exc()
        # Initialize with fallback models
        models = {
            'learning_path_predictor': LearningPathPredictor(),
            'performance_predictor': PerformancePredictor(),
            'learning_style_detector': LearningStyleDetector(),
            'skill_gap_analyzer': SkillGapAnalyzer(),
            'motivational_analyzer': MotivationalAnalyzer()
        }

# Load models on startup
# load_models()  # Commented out for now - load on demand

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
        result = model.predict(input_data.features, input_data.metadata or {})

        return PredictionResponse(**result)

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

@app.post("/coach/insights")
async def get_coach_insights(context: CoachContext):
    """Get comprehensive ML-enhanced coaching insights"""
    try:
        # Prepare features for different models
        learning_style_features = [
            context.performanceScore,
            context.timeSpent / 3600,  # Convert to hours
            context.hintsUsed,
            context.errorRate,
            context.studyStreak
        ]

        skill_gap_features = []
        for topic in ['git', 'linux', 'docker', 'kubernetes', 'aws', 'terraform', 'jenkins', 'monitoring']:
            skill_gap_features.extend([
                context.topicScores.get(topic, 0),
                context.attemptCounts.get(topic, 0),
                context.timeSpentPerTopic.get(topic, 0),
                context.errorPatterns.get(topic, 0)
            ])

        performance_features = [
            context.studyStreak,
            context.avgScore,
            context.completionRate,
            context.struggleTime / 3600
        ]

        path_features = [
            context.currentWeek,
            context.performanceScore,
            context.timeSpent / 3600,
            context.hintsUsed,
            context.errorRate
        ] + skill_gap_features[:20]  # Limit features

        # Run predictions in parallel
        predictions = {}

        # Learning style prediction
        learning_style_result = models['learning_style_detector'].predict(learning_style_features)
        predictions['learning_style'] = learning_style_result

        # Skill gap analysis
        skill_gap_result = models['skill_gap_analyzer'].predict(skill_gap_features)
        predictions['skill_gaps'] = skill_gap_result

        # Performance prediction
        performance_result = models['performance_predictor'].predict(performance_features)
        predictions['performance'] = performance_result

        # Learning path prediction
        path_result = models['learning_path_predictor'].predict(path_features)
        predictions['path'] = path_result

        # Motivational analysis
        motivational_result = models['motivational_analyzer'].predict(performance_features + learning_style_features)
        predictions['motivational'] = motivational_result

        # Format insights
        insights = {
            "learningStyle": {
                "primary": ["visual", "kinesthetic", "reading", "auditory"][np.argmax(learning_style_result['prediction'])],
                "confidence": learning_style_result['confidence'],
                "recommendations": learning_style_result.get('explanation', '').split('. ')
            },
            "skillGaps": [
                {
                    "topic": topic,
                    "gapSize": gap,
                    "priority": "high" if gap > 0.7 else "medium" if gap > 0.4 else "low",
                    "recommendedActions": [f"Focus on {topic} fundamentals", f"Practice {topic} exercises"]
                }
                for topic, gap in zip(['git', 'linux', 'docker', 'kubernetes', 'aws', 'terraform', 'jenkins', 'monitoring'],
                                    skill_gap_result['prediction'][:8])
                if gap > 0.3
            ],
            "optimalPath": {
                "nextTopics": [f"Week {int(pred)+1}" for pred in path_result['prediction'][:3] if pred > 0.5],
                "estimatedTime": int(np.mean(path_result['prediction']) * 40),  # Estimate hours
                "confidence": path_result['confidence'],
                "reasoning": path_result.get('explanation', 'Based on current performance and skill assessment')
            },
            "performancePrediction": {
                "completionProbability": performance_result['prediction'][0],
                "estimatedCompletionDate": (datetime.now().replace(hour=0, minute=0, second=0, microsecond=0) +
                                          pd.Timedelta(days=int(12 * (1 - performance_result['prediction'][0])))).isoformat(),
                "riskFactors": ["Low study streak", "High error rate"] if performance_result['prediction'][0] < 0.6 else [],
                "interventions": ["Increase daily practice", "Focus on weak topics"] if performance_result['prediction'][0] < 0.7 else ["Continue current pace"]
            },
            "motivationalProfile": {
                "type": "achievement" if motivational_result['prediction'][0] > 0.5 else "mastery",
                "strengths": ["Persistent", "Goal-oriented"] if motivational_result['prediction'][0] > 0.5 else ["Detail-focused", "Knowledge-driven"],
                "recommendations": motivational_result.get('explanation', '').split('. ')
            }
        }

        return insights

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate insights: {str(e)}")

@app.post("/train/{model_name}")
async def train_model(model_name: str, training_data: Dict[str, Any]):
    """Train or fine-tune a model"""
    if model_name not in models:
        raise HTTPException(status_code=404, detail=f"Model {model_name} not found")

    try:
        model = models[model_name]

        # Extract training data
        X = np.array(training_data['inputs'])
        y = np.array(training_data['outputs'])

        # Train the model
        model.train(X, y)

        return {"message": f"Model {model_name} trained successfully"}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training failed: {str(e)}")

@app.get("/models")
async def list_models():
    """List all available models"""
    # Load models if not loaded
    if not models:
        load_models()

    return {
        "models": [
            {
                "name": name,
                "type": model.__class__.__name__,
                "loaded": model.is_loaded(),
                "features": getattr(model, 'feature_names', []),
                "metrics": getattr(model, 'get_metrics', lambda: {})()
            }
            for name, model in models.items()
        ]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)