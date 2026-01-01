import { useEffect, useState } from 'react';
import { collection, getDocs, query, where, getDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { BookOpen, Code, Trophy, Lock } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { curriculumLoader, type Week } from '../utils/curriculumLoader';

interface WeekProgress {
  weekNumber: number;
  completedLessons: number;
  totalLessons: number;
  completedLabs: number;
  totalLabs: number;
  percentage: number;
}

export default function Curriculum() {
  const { user } = useAuthStore();
  const [searchParams] = useSearchParams();
  const [weeks, setWeeks] = useState<Week[]>([]);
  const [weekProgress, setWeekProgress] = useState<Map<number, WeekProgress>>(new Map());
  const [loading, setLoading] = useState(true);
  const [recommendedStartWeek, setRecommendedStartWeek] = useState<number | null>(null);
  const [diagnosticStartWeek, setDiagnosticStartWeek] = useState<number | null>(null);

  // Get recommended start week from URL params and check diagnostic
  useEffect(() => {
    const startWeekParam = searchParams.get('startWeek');
    if (startWeekParam) {
      const startWeek = parseInt(startWeekParam);
      if (startWeek >= 1 && startWeek <= 12) {
        setRecommendedStartWeek(startWeek);
        // Scroll to the recommended week after a short delay
        setTimeout(() => {
          const element = document.getElementById(`week-${startWeek}`);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        }, 1000);
      }
    }

    // Check diagnostic results for unlocking logic
    const checkDiagnostic = async () => {
      if (user?.uid) {
        try {
          const diagnosticDoc = await getDoc(doc(db, 'diagnostics', user.uid));
          if (diagnosticDoc.exists()) {
            const diagnosticData = diagnosticDoc.data();
            setDiagnosticStartWeek(diagnosticData.suggestedStartWeek || 1);
          }
        } catch (error) {
          console.error('Error checking diagnostic results:', error);
        }
      }
    };

    checkDiagnostic();
  }, [searchParams, user]);


  // Helper function to check if a week is unlocked
  const isWeekUnlocked = (weekNumber: number): boolean => {
    if (weekNumber === 1) return true;

    // First check if user has diagnostic results that allow bypassing the gate
    if (diagnosticStartWeek !== null && diagnosticStartWeek <= weekNumber) {
      return true;
    }

    // Otherwise check progress requirements
    const previousWeek = weeks.find(w => w.weekNumber === weekNumber - 1);
    if (!previousWeek) return false;

    // Check if previous week has 80%+ completion
    const progress = weekProgress.get(weekNumber - 1);
    return progress ? progress.percentage >= 80 : false;
  };

  useEffect(() => {
    async function fetchCurriculum() {
      try {
        console.log('Curriculum: Starting to fetch curriculum...');
        // Load all weeks data
        const weeksData = await curriculumLoader.loadAllWeeks();
        console.log('Curriculum: Received weeks data:', weeksData.length, 'weeks');
        console.log('Curriculum: Week numbers:', weeksData.map(w => w.weekNumber));
        setWeeks(weeksData);

        // Fetch progress for each week
        if (user) {
          await fetchProgress(weeksData);
        }
      } catch (error) {
        console.error('Curriculum: Error fetching curriculum:', error);
      } finally {
        console.log('Curriculum: Finished loading, setting loading to false');
        setLoading(false);
      }
    }

    async function fetchProgress(weeksData: Week[]) {
      if (!user) return;

      try {
        // Fetch all progress records for the user
        const progressQuery = query(
          collection(db, 'progress'),
          where('userId', '==', user.uid)
        );
        const progressSnapshot = await getDocs(progressQuery);
        
        // Fetch all fully mastered lessons
        const masteryQuery = query(
          collection(db, 'masteryProgress'),
          where('userId', '==', user.uid),
          where('fullyMastered', '==', true)
        );
        const masterySnapshot = await getDocs(masteryQuery);
        
        // Create a map of completed items
        const completedLessons = new Set<string>();
        const completedLabs = new Set<string>();
        
        progressSnapshot.docs.forEach(doc => {
          const data = doc.data();
          if (data.type === 'lesson') {
            completedLessons.add(data.lessonId);
          } else if (data.type === 'lab') {
            completedLabs.add(data.labId);
          }
        });
        
        masterySnapshot.docs.forEach(doc => {
          const data = doc.data();
          completedLessons.add(data.lessonId);
        });

        // Calculate progress for each week
        const progressMap = new Map<number, WeekProgress>();
        
        weeksData.forEach(week => {
          const totalLessons = week.lessons.length;
          const totalLabs = week.labs.length;
          const totalItems = totalLessons + totalLabs;
          
          const completedLessonsCount = week.lessons.filter((l: any) => 
            completedLessons.has(l.id)
          ).length;
          
          const completedLabsCount = week.labs.filter((l: any) => 
            completedLabs.has(l.id)
          ).length;
          
          const completedItems = completedLessonsCount + completedLabsCount;
          const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
          
          progressMap.set(week.weekNumber, {
            weekNumber: week.weekNumber,
            completedLessons: completedLessonsCount,
            totalLessons,
            completedLabs: completedLabsCount,
            totalLabs,
            percentage
          });
        });
        
        setWeekProgress(progressMap);
      } catch (error) {
        console.error('Error fetching progress:', error);
      }
    }

    fetchCurriculum();
  }, [user]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-400">Loading curriculum...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">
            12-Week DevOps Curriculum 🚀
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl">
            From zero to job-ready in 3 months. Complete 33 hands-on labs, build real-world projects, and earn 6000+ XP on your journey to a DevOps career.
          </p>
        </div>

        {/* Cloud Resume Challenge Banner */}
        <div className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 rounded-2xl p-8 mb-12 overflow-hidden shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white opacity-5 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white opacity-5 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-yellow-400 rounded-full p-3">
                <Trophy className="w-8 h-8 text-indigo-900" />
              </div>
              <h2 className="text-3xl font-bold text-white">Cloud Resume Challenge</h2>
            </div>
            <p className="text-indigo-50 mb-6 text-lg leading-relaxed max-w-3xl">
              Build a cloud-native resume that showcases your AWS, Terraform, and CI/CD skills. This capstone project spans Weeks 7-9 and is your ticket to standing out to employers. Earn <span className="font-bold text-yellow-300">1800 XP</span> upon completion!
            </p>
            <Link 
              to="/projects"
              className="inline-flex items-center px-6 py-3 bg-white text-indigo-600 rounded-lg font-bold hover:bg-indigo-50 transition-all duration-300 hover:scale-105 shadow-lg"
            >
              View Challenge Details →
            </Link>
          </div>
        </div>

        {/* Weekly Curriculum */}
        <div className="space-y-6">
          {weeks.map((week) => {
            const progress = weekProgress.get(week.weekNumber);
            const percentage = progress?.percentage || 0;
            const isComplete = percentage === 100;
            
            // Hard gate: Week 1 always unlocked, others require 80% completion of previous week
            const canAccessWeek = isWeekUnlocked(week.weekNumber);
            const isLocked = !canAccessWeek;
            
            return (
            <div 
              key={week.weekNumber} 
              id={`week-${week.weekNumber}`}
              className={`bg-slate-800 rounded-xl p-8 border transition-all duration-300 ${
                recommendedStartWeek === week.weekNumber
                  ? 'border-green-500 shadow-xl shadow-green-500/20 ring-2 ring-green-500/50'
                  : isLocked 
                  ? 'border-slate-700 opacity-60' 
                  : 'border-slate-700 hover:border-indigo-500 hover:shadow-xl hover:shadow-indigo-500/10'
              }`}
            >
              {/* Recommended Start Week Banner */}
              {recommendedStartWeek === week.weekNumber && (
                <div className="mb-4 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg p-4 border border-green-500">
                  <div className="flex items-center gap-3">
                    <div className="bg-green-400 rounded-full p-2">
                      <Trophy className="w-5 h-5 text-green-900" />
                    </div>
                    <div>
                      <h4 className="text-white font-bold">🎯 Recommended Starting Point</h4>
                      <p className="text-green-100 text-sm">Based on your diagnostic quiz results, start here!</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Lock Indicator */}
              {isLocked && (
                <div className="absolute top-4 right-4 bg-slate-700 rounded-full p-2">
                  <Lock className="w-5 h-5 text-gray-400" />
                </div>
              )}
              
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg ${
                      isLocked 
                        ? 'bg-slate-700 text-gray-400' 
                        : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                    }`}>
                      {isLocked ? <Lock className="w-6 h-6" /> : week.weekNumber}
                    </div>
                    <div>
                      <h3 className={`text-2xl font-bold ${isLocked ? 'text-gray-500' : 'text-white'}`}>
                        {week.title}
                      </h3>
                      {week.project && !isLocked && (
                        <span className="inline-block mt-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-3 py-1 rounded-full text-xs font-bold">
                          ⭐ PROJECT WEEK
                        </span>
                      )}
                      {isLocked && (
                        <span className="inline-block mt-1 bg-slate-700 text-gray-400 px-3 py-1 rounded-full text-xs font-bold">
                          🔒 LOCKED - Complete Week {week.weekNumber - 1} (80%+)
                        </span>
                      )}
                    </div>
                  </div>
                  <p className={`mb-6 text-lg ${isLocked ? 'text-gray-500' : 'text-gray-300'}`}>
                    {week.description}
                  </p>

                  {/* Objectives */}
                  <div className="mb-6 bg-slate-900 rounded-lg p-4 border border-slate-700">
                    <h5 className="text-sm font-bold text-indigo-300 mb-3 uppercase tracking-wide">Learning Objectives</h5>
                    <ul className="space-y-2">
                      {week.objectives.map((obj, idx) => (
                        <li key={idx} className="text-sm text-gray-300 flex items-start">
                          <span className="text-indigo-400 mr-3 mt-1 text-lg">✓</span>
                          <span>{obj}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Lessons List */}
                  {!isLocked && week.lessons.length > 0 && (
                    <div className="mb-6">
                      <h5 className="text-sm font-bold text-indigo-300 mb-3 uppercase tracking-wide flex items-center">
                        <BookOpen className="w-4 h-4 mr-2" />
                        Lessons
                      </h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {week.lessons.map((lesson: any, idx: number) => (
                          <div
                            key={lesson.lessonId}
                            className="bg-slate-900 rounded-lg p-3 border border-slate-700 hover:border-indigo-500 transition-colors"
                          >
                            <div className="flex items-start space-x-3">
                              <span className="bg-indigo-600 text-white w-6 h-6 rounded flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                                {idx + 1}
                              </span>
                              <div className="flex-1 min-w-0">
                                <h6 className="font-medium text-white text-sm mb-1">{lesson.baseLesson.title}</h6>
                                <p className="text-xs text-gray-400 line-clamp-2">{lesson.baseLesson.description}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center space-x-6 mb-4">
                    <div className="flex items-center space-x-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">
                      <BookOpen className="w-5 h-5 text-indigo-400" />
                      <span className="text-gray-300 font-medium">{week.lessons.length} lessons</span>
                    </div>
                    <div className="flex items-center space-x-2 bg-slate-900 px-4 py-2 rounded-lg border border-slate-700">
                      <Code className="w-5 h-5 text-green-400" />
                      <span className="text-gray-300 font-medium">{week.labs.length} labs</span>
                    </div>
                    {week.project && (
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-purple-900 to-pink-900 px-4 py-2 rounded-lg border border-purple-600">
                        <Trophy className="w-5 h-5 text-yellow-400" />
                        <span className="text-yellow-100 font-medium">Capstone Project</span>
                      </div>
                    )}
                  </div>

                  {/* Quick Lab Links */}
                  {!isLocked && week.labs.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {week.labs.map((lab: any, idx: number) => (
                        <Link
                          key={idx}
                          to={`/lab/${lab.id}`}
                          className="text-xs bg-slate-700 hover:bg-indigo-600 text-gray-300 hover:text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium border border-slate-600 hover:border-indigo-500"
                        >
                          {lab.title}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex flex-col items-end space-y-3 ml-6">
                  <div className="text-right">
                    <div className="text-sm text-gray-400 mb-1">Progress</div>
                    <div className={`text-2xl font-bold ${
                      isComplete ? 'text-green-400' : 
                      percentage > 0 ? 'text-indigo-400' : 
                      'text-gray-400'
                    }`}>
                      {percentage}%
                    </div>
                    {progress && (
                      <div className="text-xs text-gray-500 mt-1">
                        {progress.completedLessons}/{progress.totalLessons} lessons · {progress.completedLabs}/{progress.totalLabs} labs
                      </div>
                    )}
                  </div>
                  {isLocked ? (
                    <button
                      disabled
                      className="px-6 py-3 rounded-lg font-bold bg-slate-700 text-gray-400 cursor-not-allowed shadow-lg"
                    >
                      🔒 Locked
                    </button>
                  ) : (
                    <Link
                      to={`/week/${week.weekNumber}`}
                      className={`px-6 py-3 rounded-lg font-bold transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl ${
                        isComplete 
                          ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700'
                          : percentage > 0
                          ? 'bg-gradient-to-r from-yellow-600 to-orange-600 text-white hover:from-yellow-700 hover:to-orange-700'
                          : 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                      }`}
                    >
                      {isComplete ? '✓ Completed' : percentage > 0 ? 'Continue →' : 'Start Week →'}
                    </Link>
                  )}
                </div>
              </div>
            </div>
          );
          })}
        </div>
      </div>
    </div>
  );
}

