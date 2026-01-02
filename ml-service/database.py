"""
Database connection and queries for ML service
"""

import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from typing import Dict, List, Any, Optional
from dotenv import load_dotenv
from datetime import datetime

# Load environment variables
load_dotenv()

class DatabaseManager:
    """Manages database connections and queries for ML service"""

    def __init__(self):
        # Get database URL from environment (same as server)
        database_url = os.getenv("DATABASE_URL")
        if not database_url:
            print("Warning: DATABASE_URL not set, using mock data mode")
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
        if not self.engine:
            # Return mock data when database is not available
            return self._get_mock_user_data(user_id)

        with self.SessionLocal() as session:
            try:
                # Get user basic info
                user_query = text("""
                    SELECT id, "currentWeek", "totalXP", "createdAt"
                    FROM "User" WHERE id = :user_id
                """)
                user_result = session.execute(user_query, {"user_id": user_id}).fetchone()

                if not user_result:
                    return self._get_mock_user_data(user_id)

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
                print("Falling back to mock data")
                return self._get_mock_user_data(user_id)

    def _get_mock_user_data(self, user_id: str) -> Dict[str, Any]:
        """Generate mock user data for development/testing"""
        import random
        random.seed(hash(user_id) % 1000)  # Deterministic mock data based on user_id

        current_week = random.randint(1, 12)
        total_xp = random.randint(0, 5000)

        # Generate mock progress
        progress = []
        completed_lessons = 0
        for week in range(1, current_week + 1):
            for lesson_num in range(1, 6):  # Assume 5 lessons per week
                lesson_id = f"week{week}-lesson{lesson_num}"
                completed = random.random() < 0.8  # 80% completion rate
                if completed:
                    completed_lessons += 1
                    score = random.randint(70, 100)
                    completed_at = datetime.now()
                else:
                    score = None
                    completed_at = None

                progress.append({
                    "week_id": week,
                    "lesson_id": lesson_id,
                    "completed": completed,
                    "score": score,
                    "completed_at": completed_at
                })

        # Generate mock lab sessions
        lab_sessions = []
        for i in range(random.randint(5, 20)):
            lab_sessions.append({
                "exercise_id": f"lab-{i+1}",
                "passed": random.random() < 0.7,  # 70% pass rate
                "submitted_at": datetime.now()
            })

        # Generate mock AARs
        aars = []
        for i in range(random.randint(2, 10)):
            aars.append({
                "lesson_id": f"week{random.randint(1, current_week)}-lesson{random.randint(1, 5)}",
                "level": random.choice(["crawl", "walk-guided", "run-independent"]),
                "completed_at": datetime.now(),
                "quality_score": random.uniform(3.0, 9.0),
                "what_worked_well": ["Good examples", "Clear instructions"],
                "what_did_not_work": ["Too fast pace"],
                "word_counts": {"total": random.randint(50, 200)}
            })

        # Generate mock badges
        badges = []
        badge_types = ["linux-explorer", "git-master", "docker-expert", "k8s-specialist"]
        for badge_type in random.sample(badge_types, random.randint(0, 3)):
            badges.append({
                "badge_type": badge_type,
                "earned_at": datetime.now()
            })

        # Generate mock projects
        projects = []
        project_ids = ["project-1", "project-2", "project-3"]
        for project_id in random.sample(project_ids, random.randint(0, 2)):
            projects.append({
                "project_id": project_id,
                "completed": random.random() < 0.6,  # 60% completion rate
                "completed_at": datetime.now() if random.random() < 0.6 else None
            })

        return {
            "user_id": user_id,
            "current_week": current_week,
            "total_xp": total_xp,
            "created_at": datetime.now(),
            "progress": progress,
            "lab_sessions": lab_sessions,
            "aars": aars,
            "badges": badges,
            "projects": projects
        }

    def extract_ml_features(self, user_data: Dict[str, Any]) -> Dict[str, List[float]]:
        """Extract ML features from user data for different models"""
        if not user_data:
            # Return default features for each model
            return {
                'learning_path': [1.0, 0.5, 2.0, 3.0, 0.2] + [0.5] * 16,  # 21 features
                'performance': [5.0, 0.7, 0.8, 1.0, 0.6, 0.3, 0.8, 0.2],  # 8 features
                'learning_style': [0.7, 0.8, 0.6, 0.9, 0.5, 0.4, 0.3, 0.2],  # 8 features
                'skill_gap': [0.8, 0.7, 0.6, 0.5, 0.4, 0.3, 0.2, 0.1],  # 8 features
                'motivation': [0.7, 0.8, 0.6, 0.5, 0.9]  # 5 features
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