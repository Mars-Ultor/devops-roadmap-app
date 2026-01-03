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

# Import database manager
from database import db_manager

# Import ML models
from models.learning_path_predictor import LearningPathPredictor
from models.performance_predictor import PerformancePredictor
from models.learning_style_detector import LearningStyleDetector
from models.skill_gap_analyzer import SkillGapAnalyzer
from models.motivational_analyzer import MotivationalAnalyzer

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Application startup event triggered")
    try:
        # Test database connection
        test_user = db_manager.get_user_data("test")
        print("Database/mock data connection successful")
    except Exception as e:
        print(f"Warning: Database connection issue: {e}")
        print("Continuing with mock data mode")
    yield
    # Shutdown (if needed)
    pass

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
    models = {
        'learning-path-predictor': LearningPathPredictor(),
        'performance-predictor': PerformancePredictor(),
        'learning-style-detector': LearningStyleDetector(),
        'skill-gap-analyzer': SkillGapAnalyzer(),
        'motivational-analyzer': MotivationalAnalyzer(),
    }
    print("Models initialized successfully")
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
        # Fetch real user data from database
        user_data = db_manager.get_user_data(context.userId)

        if not user_data:
            # Fallback to context-based insights if no database data
            return await get_fallback_insights(context)

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

        # Process skill gaps
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

        # Determine learning style based on user behavior patterns
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

        # Calculate performance prediction
        performance_score = float(performance_result[0]) if hasattr(performance_result, '__len__') else float(performance_result)
        performance_prediction = {
            'completion_probability': min(max(performance_score, 0.0), 1.0),
            'estimated_time_to_completion': max(1, int((1 - performance_score) * 12)),  # weeks
            'confidence': 0.75
        }

        # Determine motivation level based on activity patterns
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

        insights = {
            'learningStyle': {
                'primary_style': learning_style,
                'confidence': style_confidence,
                'recommendations': [
                    'practice coding exercises' if learning_style == 'hands_on' else 'watch video tutorials',
                    'read documentation and guides',
                    'work through interactive labs'
                ]
            },
            'skillGaps': skill_gaps[:5],  # Top 5 gaps
            'optimalPath': {
                'recommended_topics': learning_path_recommendations,
                'reasoning': 'Based on your current progress and performance patterns'
            },
            'performancePrediction': performance_prediction,
            'motivationalProfile': {
                'motivation_level': motivation_level,
                'study_streak': study_streak,
                'recommended_actions': recommendations
            }
        }

        return insights

    except Exception as e:
        print(f"Error generating insights: {e}")
        # Fallback to context-based insights
        return await get_fallback_insights(context)


async def get_fallback_insights(context: CoachContext):
    """Fallback insights when database is unavailable"""
    return {
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
        ][:5],
        'optimalPath': {
            'recommended_topics': [
                {'topic': 'docker_fundamentals', 'score': 0.9, 'confidence': 85.0},
                {'topic': 'kubernetes_basics', 'score': 0.8, 'confidence': 80.0}
            ],
            'reasoning': 'Based on current progress data'
        },
        'performancePrediction': {
            'completion_probability': context.performanceScore,
            'estimated_time_to_completion': max(1, 12 - context.currentWeek),
            'confidence': 0.7
        },
        'motivationalProfile': {
            'motivation_level': 'high' if context.studyStreak > 5 else 'medium',
            'study_streak': context.studyStreak,
            'recommended_actions': ['set daily goals', 'track progress', 'celebrate milestones']
        }
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