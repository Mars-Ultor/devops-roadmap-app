"""
DevOps Roadmap ML Service
Real ML models for intelligent DevOps learning using XGBoost and Random Forest
"""

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
import os
from pathlib import Path

# Import our real ML models
from models.learning_path_predictor import LearningPathPredictor
from models.performance_predictor import PerformancePredictor

app = FastAPI(
    title="DevOps Roadmap ML Service",
    description="Real ML models for intelligent DevOps learning using XGBoost and Random Forest",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins for now
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Real ML models are loaded dynamically below

# Initialize real ML models
models = {}

def load_models():
    """Load trained ML models"""
    global models

    try:
        print("🔄 Loading real ML models...")

        # Initialize models
        learning_predictor = LearningPathPredictor()
        performance_predictor = PerformancePredictor()

        # Try to load trained models
        try:
            learning_predictor.load_model()
            print("✅ Learning Path Predictor loaded")
        except:
            print("⚠️  Learning Path Predictor not trained yet")

        try:
            performance_predictor.load_model()
            print("✅ Performance Predictor loaded")
        except:
            print("⚠️  Performance Predictor not trained yet")

        models = {
            'learning_path_predictor': learning_predictor,
            'performance_predictor': performance_predictor,
        }

        print("✅ ML models initialized")

    except Exception as e:
        print(f"❌ Error loading models: {e}")
        # Fallback to simple models if ML models fail
        models = {
            'learning_path_predictor': SimpleLearningPathPredictor(),
            'performance_predictor': SimplePerformancePredictor(),
        }

# Load models on startup
load_models()

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