#!/usr/bin/env python3
"""
ML Model Training Script
Trains real ML models with synthetic but realistic training data
"""

import sys
import os
from pathlib import Path
import numpy as np
import pandas as pd
from typing import List, Dict, Any

# Add the models directory to the path
sys.path.append(str(Path(__file__).parent))

from models.learning_path_predictor import LearningPathPredictor
from models.performance_predictor import PerformancePredictor


def generate_learning_path_data(n_samples: int = 1000) -> tuple:
    """Generate realistic training data for learning path prediction"""
    np.random.seed(42)

    data = []

    for _ in range(n_samples):
        # Generate user profile
        current_week = np.random.randint(1, 13)
        experience_level = np.random.choice(['beginner', 'intermediate', 'advanced'],
                                          p=[0.4, 0.4, 0.2])

        # Performance metrics
        base_performance = np.random.normal(0.7, 0.2)
        performance_score = np.clip(base_performance, 0, 1)

        time_spent = np.random.exponential(20) + 5  # Hours spent
        hints_used = np.random.poisson(3)
        error_rate = np.clip(np.random.normal(0.15, 0.1), 0, 1)

        # Topic scores based on experience and performance
        topic_base = {
            'beginner': [0.6, 0.5, 0.4, 0.2, 0.1, 0.1, 0.0, 0.0],
            'intermediate': [0.8, 0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2],
            'advanced': [0.9, 0.9, 0.9, 0.8, 0.8, 0.7, 0.6, 0.5]
        }[experience_level]

        topic_scores = [np.clip(score + np.random.normal(0, 0.1), 0, 1)
                       for score in topic_base]

        # Topic attempts
        topic_attempts = [np.random.poisson(5) + 1 for _ in range(8)]

        # Determine recommended topics based on current progress
        recommended_topics = []

        # Git and Linux are always good starters
        if topic_scores[0] < 0.8:  # git
            recommended_topics.append(0)  # git_basics
        if topic_scores[1] < 0.8:  # linux
            recommended_topics.append(1)  # linux_commands

        # Docker and K8s for intermediate
        if current_week >= 4 and topic_scores[2] < 0.8:  # docker
            recommended_topics.append(2)  # docker_fundamentals
        if current_week >= 7 and topic_scores[3] < 0.8:  # k8s
            recommended_topics.append(3)  # kubernetes_basics

        # Cloud and IaC for advanced
        if current_week >= 9 and topic_scores[4] < 0.8:  # aws
            recommended_topics.append(4)  # aws_services
        if current_week >= 11 and topic_scores[5] < 0.8:  # terraform
            recommended_topics.append(5)  # terraform_intro

        # DevOps tools
        if current_week >= 5 and topic_scores[6] < 0.8:  # jenkins
            recommended_topics.append(6)  # ci_cd_jenkins
        if current_week >= 8 and topic_scores[7] < 0.8:  # monitoring
            recommended_topics.append(7)  # monitoring_prometheus

        # Create feature vector
        features = [
            current_week, performance_score, time_spent, hints_used, error_rate,
            *topic_scores, *topic_attempts
        ]

        # Create target vector (multi-label: which topics to recommend)
        targets = [1 if i in recommended_topics else 0 for i in range(8)]

        data.append((features, targets))

    # Split into features and targets
    X = np.array([d[0] for d in data])
    y = np.array([d[1] for d in data])

    return X, y


def generate_performance_data(n_samples: int = 1000) -> tuple:
    """Generate realistic training data for performance prediction"""
    np.random.seed(123)

    data = []

    for _ in range(n_samples):
        # Study patterns
        study_streak = np.random.poisson(5) + 1
        avg_score = np.random.beta(2, 1)  # Skewed toward higher scores
        completion_rate = np.random.beta(3, 1)

        # Struggle and time metrics
        struggle_time = np.random.exponential(30)  # Minutes
        current_week = np.random.randint(1, 13)
        hints_used = np.random.poisson(2)
        error_rate = np.random.beta(1, 3)  # Skewed toward lower error rates
        time_spent_week = np.random.exponential(15) + 5

        # Learning style preferences (simplified)
        learning_styles = np.random.dirichlet([1, 1, 1, 1])  # Equal preference

        # Determine performance level based on metrics
        performance_score = (
            avg_score * 0.4 +
            completion_rate * 0.3 +
            (1 - error_rate) * 0.2 +
            min(study_streak / 10, 1) * 0.1
        )

        # Classify performance level
        if performance_score > 0.8:
            performance_level = 2  # excellent
        elif performance_score > 0.6:
            performance_level = 1  # good
        else:
            performance_level = 0  # needs_improvement

        # Create feature vector
        features = [
            study_streak, avg_score, completion_rate, struggle_time / 60,  # Convert to hours
            *learning_styles, current_week, hints_used, error_rate, time_spent_week
        ]

        data.append((features, performance_level))

    # Split into features and targets
    X = np.array([d[0] for d in data])
    y = np.array([d[1] for d in data])

    return X, y


def train_all_models():
    """Train all ML models with realistic synthetic data"""

    print("🚀 Starting real ML model training...")
    print("=" * 50)

    models = []

    # Train Learning Path Predictor
    print("\n📚 Training Learning Path Predictor...")
    learning_predictor = LearningPathPredictor()
    X_path, y_path = generate_learning_path_data(2000)
    learning_predictor.train(X_path, y_path)
    learning_predictor.save_model()
    models.append(learning_predictor)

    # Train Performance Predictor
    print("\n🎯 Training Performance Predictor...")
    performance_predictor = PerformancePredictor()
    X_perf, y_perf = generate_performance_data(1500)
    performance_predictor.train(X_perf, y_perf)
    performance_predictor.save_model()
    models.append(performance_predictor)

    print("\n" + "=" * 50)
    print("✅ All real ML models trained and saved successfully!")
    print(f"💾 Models saved to: {learning_predictor.models_dir}")

    # Print summary
    print("\n📊 Training Summary:")
    for model in models:
        print(f"  • {model.model_name}:")
        print(".3f"        print(".3f"        print(".3f"
    print("\n🎯 Ready for deployment!")


if __name__ == "__main__":
    train_all_models()
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