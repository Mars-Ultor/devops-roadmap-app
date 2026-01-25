"""
DevOps Roadmap ML Service
Full ML service using trained models from the models directory
"""

from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
from datetime import datetime
import os
from pathlib import Path

# Import database manager (optional)
try:
    from database import db_manager
    DB_AVAILABLE = True
except ImportError:
    print("Database module not available, running in mock mode")
    DB_AVAILABLE = False

# Import ML models (import individually to avoid potential import conflicts)
try:
    from models.learning_path_predictor import LearningPathPredictor
    LEARNING_PATH_AVAILABLE = True
except ImportError as e:
    print(f"Learning path predictor not available: {e}")
    LEARNING_PATH_AVAILABLE = False

try:
    from models.performance_predictor import PerformancePredictor
    PERFORMANCE_AVAILABLE = True
except ImportError as e:
    print(f"Performance predictor not available: {e}")
    PERFORMANCE_AVAILABLE = False

try:
    from models.learning_style_detector import LearningStyleDetector
    LEARNING_STYLE_AVAILABLE = True
except ImportError as e:
    print(f"Learning style detector not available: {e}")
    LEARNING_STYLE_AVAILABLE = False

try:
    from models.skill_gap_analyzer import SkillGapAnalyzer
    SKILL_GAP_AVAILABLE = True
except ImportError as e:
    print(f"Skill gap analyzer not available: {e}")
    SKILL_GAP_AVAILABLE = False

try:
    from models.motivational_analyzer import MotivationalAnalyzer
    MOTIVATIONAL_AVAILABLE = True
except ImportError as e:
    print(f"Motivational analyzer not available: {e}")
    MOTIVATIONAL_AVAILABLE = False

# Import Redis cache (optional)
try:
    from cache import redis_cache
    REDIS_AVAILABLE = True
except ImportError:
    print("Redis cache not available, running without caching")
    REDIS_AVAILABLE = False

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Application startup event triggered")
    try:
        if DB_AVAILABLE:
            # Test database connection
            test_user = db_manager.get_user_data("test")
            print("Database connection successful")
        else:
            print("Running in mock mode (no database)")

        if REDIS_AVAILABLE:
            # Initialize Redis connection
            redis_cache.connect()
            print("Redis cache initialized")
        else:
            print("Running without Redis cache")

    except Exception as e:
        print(f"Warning: Service initialization issue: {e}")
        print("Continuing with limited functionality")
    yield
    # Shutdown
    if REDIS_AVAILABLE:
        redis_cache.disconnect()

app = FastAPI(
    title="DevOps Roadmap ML Service",
    description="ML service for intelligent DevOps learning",
    version="1.0.0",
    lifespan=lifespan
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
try:
    models = {}
    
    if LEARNING_PATH_AVAILABLE:
        models['learning-path-predictor'] = LearningPathPredictor()
    if PERFORMANCE_AVAILABLE:
        models['performance-predictor'] = PerformancePredictor()
    if LEARNING_STYLE_AVAILABLE:
        models['learning-style-detector'] = LearningStyleDetector()
    if SKILL_GAP_AVAILABLE:
        models['skill-gap-analyzer'] = SkillGapAnalyzer()
    if MOTIVATIONAL_AVAILABLE:
        models['motivational-analyzer'] = MotivationalAnalyzer()
    
    print(f"Models initialized successfully: {len(models)} models loaded")
except Exception as e:
    print(f"Failed to initialize models: {e}")
    raise

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
        # Create cache key based on model and input features
        cache_key = f"predict:{model_name}:{hash(str(input_data.features))}"

        # Try to get from cache first
        cached_result = redis_cache.get(cache_key)
        if cached_result:
            return cached_result

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

        # Cache the result for 15 minutes (predictions are relatively stable)
        redis_cache.set(cache_key, response_data, 900)

        return response_data

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

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
    """Get comprehensive ML-enhanced coaching insights using real user data"""
    try:
        # Create cache key based on user ID and context
        cache_key = f"coach:insights:{context.userId}:{context.currentWeek}:{hash(str(context.dict()))}"

        # Try to get from cache first
        cached_result = redis_cache.get(cache_key)
        if cached_result:
            return cached_result

        # Fetch real user data from database
        user_data = db_manager.get_user_data(context.userId)

        if not user_data:
            # Return error when no database data available
            raise HTTPException(status_code=404, detail="User data not found")

        # Extract ML features from real data
        features = db_manager.extract_ml_features(user_data)

        # Get predictions from actual ML models using appropriate features
        learning_path_result = models['learning_path_predictor'].predict(features['learning_path'])
        performance_result = models['performance_predictor'].predict(features['performance'])
        learning_style_result = models['learning_style_detector'].predict(features['learning_style'])
        skill_gap_result = models['skill_gap_analyzer'].predict(features['skill_gap'])
        motivation_result = models['motivational_analyzer'].predict(features['motivation'])

        # Process learning path recommendations
        learning_path_recommendations = models['learning_path_predictor'].get_recommended_topics(features, top_k=5)

        # Process all insights using helper functions
        skill_gaps = _process_skill_gaps(skill_gap_result)
        learning_style_info = _determine_learning_style(user_data)
        performance_prediction = _calculate_performance_prediction(performance_result)
        motivation_profile = _determine_motivation_profile(user_data)

        insights = {
            'learningStyle': learning_style_info,
            'skillGaps': skill_gaps[:5],  # Top 5 gaps
            'optimalPath': {
                'recommended_topics': learning_path_recommendations,
                'reasoning': 'Based on your current progress and performance patterns'
            },
            'performancePrediction': performance_prediction,
            'motivationalProfile': motivation_profile
        }

        # Cache the result for 10 minutes
        redis_cache.set(cache_key, insights, 600)

        return insights

    except Exception as e:
        print(f"Error generating insights: {e}")
        raise HTTPException(status_code=500, detail="Failed to generate coaching insights")


def _process_skill_gaps(skill_gap_result):
    """Process skill gap predictions and return formatted skill gaps list"""
    skill_gaps = []
    if hasattr(skill_gap_result, '__len__') and len(skill_gap_result) > 0:
        # Map skill gap predictions to topics
        topic_names = ['git_basics', 'linux_commands', 'docker_fundamentals',
                      'kubernetes_basics', 'aws_services', 'terraform_intro',
                      'ci_cd_jenkins', 'monitoring_prometheus']

        for i, gap_score in enumerate(skill_gap_result[0][:len(topic_names)]):
            if gap_score > 0.3:  # Threshold for identifying gaps
                skill_gaps.append({
                    'topic': topic_names[i],
                    'gap_score': float(gap_score),
                    'priority': 'high' if gap_score > 0.7 else 'medium'
                })

    # Sort skill gaps by priority and score
    skill_gaps.sort(key=lambda x: (0 if x['priority'] == 'high' else 1, -x['gap_score']))
    return skill_gaps


def _determine_learning_style(user_data):
    """Determine learning style based on user behavior patterns"""
    learning_style = "visual"  # Default
    style_confidence = 0.6

    if user_data.get("lab_sessions"):
        # Analyze lab session patterns to determine learning style
        passed_labs = sum(1 for lab in user_data["lab_sessions"] if lab["passed"])
        total_labs = len(user_data["lab_sessions"])
        pass_rate = passed_labs / total_labs if total_labs > 0 else 0

        if pass_rate > 0.8:
            learning_style = "hands_on"
            style_confidence = 0.8
        elif pass_rate > 0.6:
            learning_style = "reading_writing"
            style_confidence = 0.7
        else:
            learning_style = "visual"
            style_confidence = 0.6

    return {
        'primary_style': learning_style,
        'confidence': style_confidence,
        'recommendations': [
            'practice coding exercises' if learning_style == 'hands_on' else 'watch video tutorials',
            'read documentation and guides',
            'work through interactive labs'
        ]
    }


def _calculate_performance_prediction(performance_result):
    """Calculate performance prediction from ML model results"""
    performance_score = float(performance_result[0]) if hasattr(performance_result, '__len__') else float(performance_result)
    return {
        'completion_probability': min(max(performance_score, 0.0), 1.0),
        'estimated_time_to_completion': max(1, int((1 - performance_score) * 12)),  # weeks
        'confidence': 0.75
    }


def _determine_motivation_profile(user_data):
    """Determine motivation level and generate recommendations based on activity patterns"""
    motivation_level = "medium"
    study_streak = 0

    if user_data.get("progress"):
        # Calculate recent activity
        recent_progress = [p for p in user_data["progress"]
                         if p.get("completed_at") and
                         (datetime.now() - p["completed_at"]).days < 7]
        if len(recent_progress) > 3:
            motivation_level = "high"
        elif len(recent_progress) > 1:
            motivation_level = "medium"
        else:
            motivation_level = "low"

    # Generate personalized recommendations
    recommendations = []
    if motivation_level == "low":
        recommendations.extend([
            "Set small daily goals to rebuild momentum",
            "Review previously completed material to regain confidence",
            "Connect with the community for support and motivation"
        ])
    elif motivation_level == "medium":
        recommendations.extend([
            "Maintain consistent study schedule",
            "Focus on one topic at a time for deeper understanding",
            "Practice hands-on exercises regularly"
        ])
    else:
        recommendations.extend([
            "Challenge yourself with advanced topics",
            "Contribute to open source projects",
            "Mentor other learners in the community"
        ])

    return {
        'motivation_level': motivation_level,
        'study_streak': study_streak,
        'recommended_actions': recommendations
    }

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
    print("Starting ML service...")
    uvicorn.run(app, host="0.0.0.0", port=int(os.getenv("PORT", 8000)))