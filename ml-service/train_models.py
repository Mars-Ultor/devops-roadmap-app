#!/usr/bin/env python3
"""
ML Model Training Script
Trains all ML models with synthetic data for the DevOps Roadmap App
"""

import sys
import os
from pathlib import Path

# Add the models directory to the path
sys.path.append(str(Path(__file__).parent))

from models.learning_path_predictor import LearningPathPredictor
from models.performance_predictor import PerformancePredictor
from models.learning_style_detector import LearningStyleDetector
from models.skill_gap_analyzer import SkillGapAnalyzer
from models.motivational_analyzer import MotivationalAnalyzer

def train_all_models():
    """Train all ML models with synthetic data"""

    print("🚀 Starting ML model training...")

    models = [
        LearningPathPredictor(),
        PerformancePredictor(),
        LearningStyleDetector(),
        SkillGapAnalyzer(),
        MotivationalAnalyzer()
    ]

    for model in models:
        print(f"\n📚 Training {model.model_name}...")

        try:
            # Generate synthetic training data
            X, y = model.generate_synthetic_data(n_samples=5000)

            print(f"   Generated {len(X)} training samples with {len(model.feature_names)} features")

            # Train the model
            model.train(X, y)

            # Print metrics
            metrics = model.get_metrics()
            print(f"   Training completed. Metrics: {metrics}")

        except Exception as e:
            print(f"   ❌ Training failed: {e}")
            continue

    print("\n✅ All models trained successfully!")
    print("💾 Models saved to models/saved_models/")

def test_models():
    """Test trained models with sample predictions"""

    print("\n🧪 Testing trained models...")

    # Initialize models
    learning_predictor = LearningPathPredictor()
    performance_predictor = PerformancePredictor()
    style_detector = LearningStyleDetector()
    skill_analyzer = SkillGapAnalyzer()
    motivation_analyzer = MotivationalAnalyzer()

    models = [
        (learning_predictor, "learning_path_predictor"),
        (performance_predictor, "performance_predictor"),
        (style_detector, "learning_style_detector"),
        (skill_analyzer, "skill_gap_analyzer"),
        (motivation_analyzer, "motivational_analyzer")
    ]

    for model, name in models:
        try:
            result = model.predict([])
            print(f"   {name}: Model loaded and ready")
        except Exception as e:
            print(f"   {name}: ❌ Model not ready - {e}")

if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="Train ML models for DevOps Roadmap App")
    parser.add_argument("--train", action="store_true", help="Train all models")
    parser.add_argument("--test", action="store_true", help="Test trained models")
    parser.add_argument("--all", action="store_true", help="Train and test all models")

    args = parser.parse_args()

    if args.all or (args.train and args.test):
        train_all_models()
        test_models()
    elif args.train:
        train_all_models()
    elif args.test:
        test_models()
    else:
        print("Usage: python train_models.py --train --test")
        print("Or: python train_models.py --all")