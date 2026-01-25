"""
Database connection and queries for ML service
"""

import os
import importlib
from typing import Dict, List, Any, Optional, TYPE_CHECKING
from datetime import datetime

# Type checking imports for when dependencies are available
if TYPE_CHECKING:
    from sqlalchemy import create_engine, text  # type: ignore[import]
    from sqlalchemy.orm import sessionmaker  # type: ignore[import]
    from dotenv import load_dotenv  # type: ignore[import]

# Try to import database dependencies (may not be available in all environments)
DB_DEPENDENCIES_AVAILABLE = False
create_engine = None
text = None
sessionmaker = None
load_dotenv = None

try:
    sqlalchemy = importlib.import_module('sqlalchemy')  # type: ignore[import]
    sqlalchemy_orm = importlib.import_module('sqlalchemy.orm')  # type: ignore[import]
    dotenv = importlib.import_module('dotenv')  # type: ignore[import]
    
    create_engine = sqlalchemy.create_engine
    text = sqlalchemy.text
    sessionmaker = sqlalchemy_orm.sessionmaker
    load_dotenv = dotenv.load_dotenv
    DB_DEPENDENCIES_AVAILABLE = True
except ImportError:
    print("Database dependencies not available, running in limited mode")

# Load environment variables if dotenv is available
if DB_DEPENDENCIES_AVAILABLE and load_dotenv is not None:
    load_dotenv()

class DatabaseManager:
    """Manages database connections and queries for ML service"""

    def __init__(self):
        if not DB_DEPENDENCIES_AVAILABLE:
            print("Database dependencies not available")
            self.engine = None
            return

        # Get database URL from environment (same as server)
        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            print("Warning: DATABASE_URL not set, using mock data mode")
            self.engine = None
            return

        # Check if required functions are available
        if create_engine is None or sessionmaker is None:
            print("Warning: SQLAlchemy functions not available, using mock data mode")
            self.engine = None
            return

        try:
            # Create SQLAlchemy engine
            self.engine = create_engine(database_url)
            self.SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=self.engine)
            print("Database connection established")
        except Exception as e:
            print(f"Warning: Could not connect to database: {e}")
            print("Falling back to mock data mode")
            self.engine = None

    def get_user_data(self, user_id: str) -> Dict[str, Any]:
        """Get comprehensive user data for ML analysis"""
        if not DB_DEPENDENCIES_AVAILABLE or not self.engine or self.SessionLocal is None or text is None:
            # Return empty data when database dependencies are not available
            print("Database dependencies not available, returning empty data")
            return {}

        with self.SessionLocal() as session:
            try:
                # Get user basic info
                user_query = text("""
                    SELECT id, "currentWeek", "totalXP", "createdAt"
                    FROM "User" WHERE id = :user_id
                """)
                user_result = session.execute(user_query, {"user_id": user_id}).fetchone()

                if not user_result:
                    return {}

                # Get progress data
                progress_query = text("""
                    SELECT "weekId", "lessonId", completed, score, "completedAt"
                    FROM "Progress"
                    WHERE "userId" = :user_id
                    ORDER BY "weekId", "lessonId"
                """)
                progress_results = session.execute(progress_query, {"user_id": user_id}).fetchall()

                # Get lab sessions
                lab_query = text("""
                    SELECT "exerciseId", passed, "submittedAt"
                    FROM "LabSession"
                    WHERE "userId" = :user_id
                    ORDER BY "submittedAt"
                """)
                lab_results = session.execute(lab_query, {"user_id": user_id}).fetchall()

                # Get AAR data
                aar_query = text("""
                    SELECT "lessonId", level, "completedAt", "qualityScore",
                           "whatWorkedWell", "whatDidNotWork", "wordCounts"
                    FROM "AfterActionReview"
                    WHERE "userId" = :user_id
                    ORDER BY "completedAt"
                """)
                aar_results = session.execute(aar_query, {"user_id": user_id}).fetchall()

                # Get badges
                badge_query = text("""
                    SELECT "badgeType", "earnedAt"
                    FROM "Badge"
                    WHERE "userId" = :user_id
                    ORDER BY "earnedAt"
                """)
                badge_results = session.execute(badge_query, {"user_id": user_id}).fetchall()

                # Get projects
                project_query = text("""
                    SELECT "projectId", completed, "completedAt"
                    FROM "Project"
                    WHERE "userId" = :user_id
                """)
                project_results = session.execute(project_query, {"user_id": user_id}).fetchall()

                return {
                    "user_id": user_result[0],
                    "current_week": user_result[1] or 1,
                    "total_xp": user_result[2] or 0,
                    "created_at": user_result[3],
                    "progress": [
                        {
                            "week_id": p[0],
                            "lesson_id": p[1],
                            "completed": p[2],
                            "score": p[3],
                            "completed_at": p[4]
                        } for p in progress_results
                    ],
                    "lab_sessions": [
                        {
                            "exercise_id": l[0],
                            "passed": l[1],
                            "submitted_at": l[2]
                        } for l in lab_results
                    ],
                    "aars": [
                        {
                            "lesson_id": a[0],
                            "level": a[1],
                            "completed_at": a[2],
                            "quality_score": a[3],
                            "what_worked_well": a[4],
                            "what_did_not_work": a[5],
                            "word_counts": a[6]
                        } for a in aar_results
                    ],
                    "badges": [
                        {
                            "badge_type": b[0],
                            "earned_at": b[1]
                        } for b in badge_results
                    ],
                    "projects": [
                        {
                            "project_id": p[0],
                            "completed": p[1],
                            "completed_at": p[2]
                        } for p in project_results
                    ]
                }

            except Exception as e:
                print(f"Error fetching user data from database: {e}")
                return {}

    def extract_ml_features(self, user_data: Dict[str, Any]) -> Dict[str, List[float]]:
        """Extract ML features from user data for different models"""
        if not user_data:
            # Return default features for each model when no data available
            return {
                'learning_path': [0.0] * 21,  # 21 features
                'performance': [0.0] * 8,     # 8 features
                'learning_style': [0.0] * 8,  # 8 features
                'skill_gap': [0.0] * 8,       # 8 features
                'motivation': [0.0] * 5       # 5 features
            }

        features = {}

        # Learning Path Predictor features (21 features)
        learning_path_features = []

        # Basic metrics
        learning_path_features.append(user_data.get("current_week", 1))
        learning_path_features.append(user_data.get("total_xp", 0) / 1000.0)

        # Progress analysis
        progress = user_data.get("progress", [])
        if progress:
            completed_count = sum(1 for p in progress if p["completed"])
            total_score = sum(p["score"] or 0 for p in progress)
            avg_score = total_score / len(progress) if progress else 0
            completion_rate = completed_count / len(progress) if progress else 0

            learning_path_features.extend([
                completed_count / 50.0,  # completion count
                avg_score / 100.0,       # avg score
                completion_rate,         # completion rate
                len(progress) / 50.0     # total attempts
            ])
        else:
            learning_path_features.extend([0.0, 0.0, 0.0, 0.0])

        # Lab performance
        labs = user_data.get("lab_sessions", [])
        if labs:
            passed_count = sum(1 for l in labs if l["passed"])
            pass_rate = passed_count / len(labs) if labs else 0
            learning_path_features.extend([pass_rate, len(labs) / 20.0])
        else:
            learning_path_features.extend([0.0, 0.0])

        # Topic-specific scores (simplified mapping)
        # Map general progress to topic areas
        topic_performance = {}
        for p in progress:
            lesson_id = p["lesson_id"]
            if "git" in lesson_id.lower():
                topic_performance["git"] = max(topic_performance.get("git", 0), p["score"] or 0)
            elif "linux" in lesson_id.lower():
                topic_performance["linux"] = max(topic_performance.get("linux", 0), p["score"] or 0)
            elif "docker" in lesson_id.lower():
                topic_performance["docker"] = max(topic_performance.get("docker", 0), p["score"] or 0)
            elif "kubernetes" in lesson_id.lower() or "k8s" in lesson_id.lower():
                topic_performance["k8s"] = max(topic_performance.get("k8s", 0), p["score"] or 0)
            elif "aws" in lesson_id.lower():
                topic_performance["aws"] = max(topic_performance.get("aws", 0), p["score"] or 0)
            elif "terraform" in lesson_id.lower():
                topic_performance["terraform"] = max(topic_performance.get("terraform", 0), p["score"] or 0)
            elif "jenkins" in lesson_id.lower() or "ci" in lesson_id.lower():
                topic_performance["jenkins"] = max(topic_performance.get("jenkins", 0), p["score"] or 0)
            elif "monitoring" in lesson_id.lower():
                topic_performance["monitoring"] = max(topic_performance.get("monitoring", 0), p["score"] or 0)

        # Add topic scores (8 topics)
        for topic in ["git", "linux", "docker", "k8s", "aws", "terraform", "jenkins", "monitoring"]:
            score = topic_performance.get(topic, 0) / 100.0
            learning_path_features.append(score)

        # Add topic attempts (8 topics) - simplified
        for topic in ["git", "linux", "docker", "k8s", "aws", "terraform", "jenkins", "monitoring"]:
            attempts = sum(1 for p in progress if topic in p["lesson_id"].lower())
            learning_path_features.append(min(attempts / 10.0, 1.0))  # Normalize

        features['learning_path'] = learning_path_features

        # Performance Predictor features (8 features)
        performance_features = []
        performance_features.append(len(user_data.get("progress", [])))  # study_streak proxy
        performance_features.append(sum(p.get("score", 0) for p in user_data.get("progress", [])) /
                                   max(len(user_data.get("progress", [])), 1) / 100.0)  # avg_score
        performance_features.append(sum(1 for p in user_data.get("progress", []) if p.get("completed", False)) /
                                   max(len(user_data.get("progress", [])), 1))  # completion_rate
        performance_features.append(1.0)  # struggle_time_hours (placeholder)

        # Learning style one-hot (simplified)
        labs_passed = sum(1 for l in user_data.get("lab_sessions", []) if l.get("passed", False))
        total_labs = len(user_data.get("lab_sessions", []))
        pass_rate = labs_passed / max(total_labs, 1)

        if pass_rate > 0.8:
            performance_features.extend([0.2, 0.8, 0.6, 0.4])  # kinesthetic heavy
        elif pass_rate > 0.6:
            performance_features.extend([0.6, 0.4, 0.8, 0.2])  # reading heavy
        else:
            performance_features.extend([0.8, 0.3, 0.4, 0.5])  # visual heavy

        features['performance'] = performance_features

        # Learning Style Detector features (8 features) - simplified
        style_features = [0.5] * 8  # Default neutral
        if user_data.get("aars"):
            # Analyze AAR content for learning style indicators
            aar_count = len(user_data["aars"])
            style_features[0] = min(aar_count / 10.0, 1.0)  # Visual indicators

        features['learning_style'] = style_features

        # Skill Gap Analyzer features (8 features)
        skill_features = []
        for topic in ["git", "linux", "docker", "k8s", "aws", "terraform", "jenkins", "monitoring"]:
            # Calculate gap as 1 - performance
            performance = topic_performance.get(topic, 0) / 100.0
            gap = 1.0 - performance
            skill_features.append(gap)

        features['skill_gap'] = skill_features

        # Motivational Analyzer features (5 features)
        motivation_features = []
        recent_activity = len([p for p in user_data.get("progress", [])
                              if p.get("completed_at") and
                              (datetime.now() - p["completed_at"].replace(tzinfo=None)).days < 7])
        motivation_features.append(recent_activity / 7.0)  # weekly activity
        motivation_features.append(len(user_data.get("badges", [])) / 10.0)  # achievement score
        motivation_features.append(len(user_data.get("projects", [])) / 3.0)  # project completion
        motivation_features.append(len(user_data.get("aars", [])) / 20.0)  # reflection score
        motivation_features.append(user_data.get("total_xp", 0) / 5000.0)  # xp progress

        features['motivation'] = motivation_features

        return features

# Global database manager instance
db_manager = DatabaseManager()