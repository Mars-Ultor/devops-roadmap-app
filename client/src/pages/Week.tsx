/* eslint-disable max-lines-per-function, complexity, max-depth, sonarjs/cognitive-complexity */
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { collection, getDocs, query, where, doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ArrowLeft, BookOpen, Code, CheckCircle } from 'lucide-react';
import { useProgress, type LessonProgress } from '../hooks/useProgress';
import { useAuthStore } from '../store/authStore';
import LessonMasteryDisplay, { type LessonMastery } from '../components/LessonMasteryDisplay';
import { curriculumLoader, type Week } from '../utils/curriculumLoader';
import type { Lab } from '../data/baseWeeks';
import type { LessonMastery as FirestoreMastery } from '../types/training';

export default function Week() {
  const { weekNumber } = useParams<{ weekNumber: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [week, setWeek] = useState<Week | null>(null);
  const [loading, setLoading] = useState(true);
  const [lessonProgressMap, setLessonProgressMap] = useState<Map<string, LessonProgress>>(new Map());
  const [labProgressMap, setLabProgressMap] = useState<Map<string, boolean>>(new Map());
  const [masteryMap, setMasteryMap] = useState<Map<string, LessonMastery>>(new Map());
  
  const { getLessonProgress, isLessonDueForReview, getLabProgress } = useProgress();

  useEffect(() => {
    async function fetchWeek() {
      if (!weekNumber) return;
      
      const weekNum = Number.parseInt(weekNumber);
      
      try {
        // Check prerequisite: Week 1 always accessible, others require 80% completion of previous week
        // OR diagnostic recommendation allows access (only UP TO suggested start week)
        if (weekNum > 1) {
          // First check if user has diagnostic results that allow bypassing the gate
          let diagnosticAllowsAccess = false;
          if (user?.uid) {
            try {
              const diagnosticDoc = await getDoc(doc(db, 'diagnostics', user.uid));
              if (diagnosticDoc.exists()) {
                const diagnosticData = diagnosticDoc.data();
                const suggestedStartWeek = diagnosticData.suggestedStartWeek || 1;
                // Diagnostic unlocks ONLY UP TO the suggested start week (not beyond)
                // e.g., if diagnostic suggests week 5, unlock weeks 1-5 but not 6+
                if (weekNum <= suggestedStartWeek) {
                  diagnosticAllowsAccess = true;
                  console.log(`🎯 Diagnostic allows access to Week ${weekNum} (recommended start: Week ${suggestedStartWeek})`);
                }
              }
            } catch (error) {
              console.error('Error checking diagnostic results:', error);
            }
          }

          // If diagnostic doesn't allow access, check progress requirements
          if (!diagnosticAllowsAccess) {
            try {
              const prevWeekData = await curriculumLoader.loadWeek(weekNum - 1);

              // Fetch user's progress for previous week
              const progressQuery = query(
                collection(db, 'progress'),
                where('userId', '==', user?.uid)
              );
              const progressSnapshot = await getDocs(progressQuery);

              const completedLessons = new Set<string>();
              const completedLabs = new Set<string>();

              progressSnapshot.docs.forEach(doc => {
                const data = doc.data();
                if (data.type === 'lesson') completedLessons.add(data.lessonId);
                else if (data.type === 'lab') completedLabs.add(data.labId);
              });

              const prevTotalItems = prevWeekData.lessons.length + prevWeekData.labs.length;
              const prevCompletedItems =
                prevWeekData.lessons.filter((l: { id: string }) => completedLessons.has(l.id)).length +
                prevWeekData.labs.filter((l: Lab) => completedLabs.has(l.id)).length;

              const prevPercentage = prevTotalItems > 0
                ? Math.round((prevCompletedItems / prevTotalItems) * 100)
                : 0;

              // Hard gate: Redirect if previous week not 80%+ complete
              if (prevPercentage < 80) {
                console.log(`🔒 Week ${weekNum} locked. Previous week only ${prevPercentage}% complete (need 80%)`);
                navigate('/curriculum');
                return;
              }
            } catch (error) {
              console.error('Error loading previous week data:', error);
            }
          }
        }

        // Load current week data
        try {
          const weekData = await curriculumLoader.loadWeek(weekNum);

          if (weekData) {
            setWeek(weekData);

          // Preload adjacent weeks for better UX
          curriculumLoader.preloadCurrentWeek(weekNum).catch(error => {
            console.warn('Failed to preload adjacent weeks:', error);
          });

          // Fetch progress for all lessons in this week
          const progressMap = new Map<string, LessonProgress>();
          const masteryDataMap = new Map<string, LessonMastery>();
          
          for (const lesson of weekData.lessons) {
            const progress = await getLessonProgress(lesson.lessonId);
            if (progress) {
              progressMap.set(lesson.lessonId, progress);
            }
            
            // Load mastery data from Firestore
            if (user?.uid) {
              const masteryRef = doc(db, 'masteryProgress', `${user.uid}_${lesson.lessonId}`);
              const masterySnap = await getDoc(masteryRef);
              
              if (masterySnap.exists()) {
                const firestoreMastery = masterySnap.data() as FirestoreMastery;
                
                // Convert Firestore mastery to display format
                const getCrawlStatus = () => {
                  if (firestoreMastery.crawl.perfectCompletions >= firestoreMastery.crawl.requiredPerfectCompletions) return 'completed';
                  if (firestoreMastery.crawl.unlocked) return 'in_progress';
                  return 'locked';
                };

                const getWalkStatus = () => {
                  if (firestoreMastery.walk.perfectCompletions >= firestoreMastery.walk.requiredPerfectCompletions) return 'completed';
                  if (firestoreMastery.walk.unlocked) return 'in_progress';
                  return 'locked';
                };

                const getRunGuidedStatus = () => {
                  if (firestoreMastery.runGuided.perfectCompletions >= firestoreMastery.runGuided.requiredPerfectCompletions) return 'completed';
                  if (firestoreMastery.runGuided.unlocked) return 'in_progress';
                  return 'locked';
                };

                const getRunIndependentStatus = () => {
                  if (firestoreMastery.runIndependent.perfectCompletions >= firestoreMastery.runIndependent.requiredPerfectCompletions) return 'completed';
                  if (firestoreMastery.runIndependent.unlocked) return 'in_progress';
                  return 'locked';
                };

                const displayMastery: LessonMastery = {
                  levels: {
                    crawl: {
                      name: "Crawl - Guided",
                      requiredPerfect: firestoreMastery.crawl.requiredPerfectCompletions,
                      perfectCount: firestoreMastery.crawl.perfectCompletions,
                      status: getCrawlStatus()
                    },
                    walk: {
                      name: "Walk - Fill-in-Blanks",
                      requiredPerfect: firestoreMastery.walk.requiredPerfectCompletions,
                      perfectCount: firestoreMastery.walk.perfectCompletions,
                      status: getWalkStatus()
                    },
                    runGuided: {
                      name: "Run - Conceptual",
                      requiredPerfect: firestoreMastery.runGuided.requiredPerfectCompletions,
                      perfectCount: firestoreMastery.runGuided.perfectCompletions,
                      status: getRunGuidedStatus()
                    },
                    runIndependent: {
                      name: "Run - Independent",
                      requiredPerfect: firestoreMastery.runIndependent.requiredPerfectCompletions,
                      perfectCount: firestoreMastery.runIndependent.perfectCompletions,
                      status: getRunIndependentStatus()
                    }
                  }
                };
                
                masteryDataMap.set(lesson.lessonId, displayMastery);
              }
            }
          }
          setLessonProgressMap(progressMap);
          setMasteryMap(masteryDataMap);

          // Fetch progress for all labs in this week
          const labMap = new Map<string, boolean>();
          for (const lab of weekData.labs) {
            const isCompleted = await getLabProgress(lab.id);
            labMap.set(lab.id, isCompleted);
          }
          setLabProgressMap(labMap);
        }
      } catch (error) {
        console.error('Error loading current week data:', error);
      }
    } catch (error) {
      console.error('Error fetching week:', error);
    } finally {
      setLoading(false);
    }
    }

    fetchWeek();
  }, [weekNumber, getLessonProgress, getLabProgress, navigate, user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-400">Loading week...</div>
      </div>
    );
  }

  if (!week) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-gray-400 mb-4">Week not found</p>
          <button
            onClick={() => navigate('/curriculum')}
            className="text-indigo-400 hover:text-indigo-300"
          >
            ← Back to Curriculum
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/curriculum')}
          className="flex items-center text-gray-400 hover:text-white mb-4 transition"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Curriculum
        </button>
        
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Week {week.weekNumber}: {week.title}
            </h1>
            <p className="text-gray-400 mb-4">{week.description}</p>
            
            {/* Learning Objectives */}
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700 mb-6">
              <h3 className="text-lg font-semibold text-white mb-3">Learning Objectives</h3>
              <ul className="space-y-2">
                {week.learningObjectives.map((obj) => (
                  <li key={obj} className="text-gray-400 flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-400 mr-2 flex-shrink-0 mt-0.5" />
                    {obj}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          <div className="text-right">
            <div className="text-sm text-gray-400 mb-1">Progress</div>
            <div className="text-2xl font-bold text-white">
              {week ? Math.round(
                ((lessonProgressMap.size + labProgressMap.size) / 
                (week.lessons.length + week.labs.length)) * 100
              ) : 0}%
            </div>
          </div>
        </div>
      </div>

      {/* Lessons */}
      {week.lessons.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-indigo-400" />
            Lessons
          </h2>
          <div className="space-y-4">
            {week.lessons.map((lesson, idx) => {
              const progress = lessonProgressMap.get(lesson.lessonId);
              const isDue = progress && isLessonDueForReview(progress);

              const getBorderClass = () => {
                if (!progress) return 'border-slate-700';
                if (isDue) return 'border-yellow-600/50';
                return 'border-green-600/50';
              };

              return (
                <div
                  key={lesson.lessonId}
                  className={`bg-slate-800 rounded-lg p-6 border transition ${getBorderClass()}`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          progress
                            ? 'bg-green-600 text-white'
                            : 'bg-slate-700 text-gray-300'
                        }`}>
                          {progress ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-white">{lesson.baseLesson.title}</h3>
                        <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">
                          +50 XP
                        </span>
                        {progress && (
                          <span className={`text-xs px-2 py-1 rounded ${
                            isDue
                              ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
                              : 'bg-green-600/20 text-green-400'
                          }`}>
                            {isDue ? '🔔 Review Due' : '✓ Completed'}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 mb-3 ml-11">{lesson.baseLesson.description}</p>
                    </div>
                  </div>

                  {/* Mastery Levels */}
                  <LessonMasteryDisplay
                    lesson={{
                      ...lesson,
                      mastery: masteryMap.get(lesson.lessonId)
                    }}
                    isLocked={false}
                    onLevelClick={(level) => {
                      navigate(`/lesson/${lesson.lessonId}/${level}`);
                    }}
                  />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Labs */}
      {week.labs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-4 flex items-center">
            <Code className="w-6 h-6 mr-2 text-green-400" />
            Hands-On Labs
          </h2>
          <div className="space-y-4">
            {week.labs.map((lab, idx) => {
              const isCompleted = labProgressMap.get(lab.id) || false;
              
              return (
                <div
                  key={lab.id}
                  className={`bg-slate-800 rounded-lg p-6 border transition ${
                    isCompleted 
                      ? 'border-green-600/50 hover:border-green-500' 
                      : 'border-slate-700 hover:border-green-500'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          isCompleted 
                            ? 'bg-green-600 text-white' 
                            : 'bg-green-600/30 text-green-300'
                        }`}>
                          {isCompleted ? <CheckCircle className="w-5 h-5" /> : idx + 1}
                        </span>
                        <h3 className="text-lg font-semibold text-white">{lab.title}</h3>
                        <span className="text-xs bg-green-600 text-white px-2 py-1 rounded">
                          +{lab.xp} XP
                        </span>
                        {isCompleted && (
                          <span className="text-xs px-2 py-1 rounded bg-green-600/20 text-green-400">
                            ✓ Completed
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 mb-3 ml-11">{lab.description}</p>
                      
                      {/* Tasks Preview */}
                      <div className="ml-11">
                        <div className="text-sm font-medium text-gray-300 mb-2">Tasks:</div>
                        <ul className="space-y-1">
                          {lab.tasks.slice(0, 3).map((task) => (
                            <li key={task} className="text-sm text-gray-400 flex items-start">
                              <span className="text-green-400 mr-2">•</span>
                              {task}
                            </li>
                          ))}
                          {lab.tasks.length > 3 && (
                            <li className="text-sm text-gray-500 ml-4">
                              +{lab.tasks.length - 3} more tasks...
                            </li>
                          )}
                        </ul>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <Link
                        to={`/lab/${lab.id}`}
                        className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition ${
                          isCompleted
                            ? 'bg-green-600/50 hover:bg-green-600/70 text-white border border-green-500/50'
                            : 'bg-green-600 hover:bg-green-700 text-white'
                        }`}
                      >
                        <Code className="w-4 h-4" />
                        <span>{isCompleted ? 'Review Lab' : 'Start Lab'}</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Skill Assessment - Pre/Post Week Assessments */}
      {week.weekNumber <= 3 && (
        <div className="mb-8">
          <div className="bg-gradient-to-br from-blue-900 to-cyan-900 rounded-xl p-8 border-2 border-blue-500">
            <h2 className="text-2xl font-bold text-white mb-3 flex items-center">
              <span className="bg-blue-400 rounded-full p-2 mr-3">
                📊
              </span>{' '}
              Skill Assessment
            </h2>
            <p className="text-blue-100 mb-6 text-lg">
              Measure your knowledge growth before and after completing this week's content.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-800/30 rounded-lg p-5 border border-blue-600/50">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">📝</span>{' '}
                  Pre-Assessment
                </h3>
                <p className="text-blue-200 text-sm mb-4">
                  Take this before starting the week to establish your baseline knowledge.
                </p>
                <Link
                  to={`/week/${week.weekNumber}/assessment?type=pre`}
                  className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Start Pre-Assessment
                </Link>
              </div>
              <div className="bg-cyan-800/30 rounded-lg p-5 border border-cyan-600/50">
                <h3 className="text-white font-semibold mb-2 flex items-center gap-2">
                  <span className="text-2xl">🎓</span>{' '}
                  Post-Assessment
                </h3>
                <p className="text-cyan-200 text-sm mb-4">
                  Complete this after finishing the week to see how much you've learned!
                </p>
                <Link
                  to={`/week/${week.weekNumber}/assessment?type=post`}
                  className="inline-flex items-center gap-2 bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg font-medium transition"
                >
                  Start Post-Assessment
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Week Project - Hands-On Application */}
      {week.weekNumber <= 5 && (
        <div className="mb-8">
          <div className="bg-gradient-to-br from-purple-900 to-pink-900 rounded-xl p-8 border-2 border-purple-500">
            <h2 className="text-2xl font-bold text-white mb-3 flex items-center">
              <span className="bg-purple-400 rounded-full p-2 mr-3">
                🚀
              </span>
              Week {week.weekNumber} Project
            </h2>
            <p className="text-purple-100 mb-4 text-lg">
              Apply what you've learned in a real-world hands-on project. Build your portfolio and earn XP!
            </p>
            <ul className="text-purple-200 space-y-2 mb-6">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Practical, real-world scenario
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Step-by-step guidance and resources
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                Earn {week.weekNumber * 50 + 150} XP upon completion
              </li>
            </ul>
            <Link
              to={`/week/${week.weekNumber}/project`}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-bold hover:from-purple-400 hover:to-pink-400 transition-all shadow-lg hover:shadow-xl"
            >
              <span className="text-xl">💻</span>
              <span>Start Week {week.weekNumber} Project</span>
            </Link>
          </div>
        </div>
      )}

      {/* Quiz Section - Show for all weeks */}
      {week.weekNumber <= 6 || week.weekNumber >= 10 ? (
        <div className="mb-8">
          <div className="bg-gradient-to-br from-amber-900 to-orange-900 rounded-xl p-8 border-2 border-amber-500">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-white mb-3 flex items-center">
                  <span className="bg-yellow-400 rounded-full p-2 mr-3">
                    🎯
                  </span>
                  Week {week.weekNumber} Knowledge Quiz
                </h2>
                <p className="text-amber-100 mb-4 text-lg">
                  Test your understanding of this week's concepts. Score 70% or higher to earn 150 XP!
                </p>
                <ul className="text-amber-200 space-y-2 mb-6">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    10 multiple-choice questions
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Passing score: 70%
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-400" />
                    Earn 150 XP upon passing
                  </li>
                </ul>
                <Link
                  to={`/quiz/week${week.weekNumber}-quiz`}
                  className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 px-6 py-3 rounded-lg font-bold hover:from-yellow-400 hover:to-orange-400 transition-all shadow-lg hover:shadow-xl"
                >
                  <span className="text-xl">📝</span>
                  <span>Take Quiz</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Project */}
      {week.project && (
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-3">Capstone Project</h2>
          <p className="text-indigo-100 mb-4">{week.project.description}</p>
          <Link
            to="/projects"
            className="inline-flex items-center px-4 py-2 bg-white text-purple-600 rounded-md font-medium hover:bg-purple-50 transition"
          >
            View Project Details
          </Link>
        </div>
      )}
    </div>
  );
}
