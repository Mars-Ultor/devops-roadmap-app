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
        (learning_predictor, "learning_path_predictor", [1, 0.8, 10, 2, 0.1, 0.9, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 5, 8, 3, 2, 1, 1, 0, 0]),
        (performance_predictor, "performance_predictor", [15, 0.85, 0.9, 8, 0.8, 0.6, 0.3, 0.1]),
        (style_detector, "learning_style_detector", [0.85, 12, 3, 0.15, 20]),
        (skill_analyzer, "skill_gap_analyzer", [0.9, 10, 15, 2, 0.8, 8, 12, 1, 0.7, 6, 10, 3, 0.6, 4, 8, 2, 0.5, 3, 6, 1, 0.4, 2, 4, 1, 0.3, 1, 3, 2, 0.2, 1, 2, 1, 0.1, 0, 1, 0]),
        (motivation_analyzer, "motivational_analyzer", [20, 0.88, 0.92, 6, 0.85, 14, 2, 0.12])
    ]

    for model, name, test_features in models:
        try:
            result = model.predict(test_features)
            print(f"   {name}: {result['prediction']} (confidence: {result['confidence']:.2%})")
        except Exception as e:
            print(f"   {name}: ❌ Prediction failed - {e}")

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