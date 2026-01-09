/* eslint-disable max-lines-per-function, complexity, sonarjs/no-duplicate-string */
import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Clock, Award, CheckCircle, Target, Brain, Zap, Lock, AlertTriangle } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import ContentGate from '../components/ContentGate';
import StruggleSessionManager from '../components/struggle/StruggleSessionManager';
import AdaptiveAARForm from '../components/aar/AdaptiveAARForm';
import MasteryGate from '../components/MasteryGate';
import { WalkLevelContent } from '../components/lessons/WalkLevelContent';
import RunIndependentWorkspace from '../components/lessons/RunIndependentWorkspace';
import RunGuidedWorkspace from '../components/lessons/RunGuidedWorkspace';
import { useMastery } from '../hooks/useMastery';
import type { MasteryLevel } from '../types/training';
import { loadLessonContent } from '../utils/lessonContentLoader';
import type { LeveledLessonContent } from '../types/lessonContent';
import type { StruggleMetrics } from '../types/aar';
import { curriculumLoader } from '../utils/curriculumLoader';

/** Helper to get next level name for display */
function getNextLevelDisplayName(currentLevel: MasteryLevel): string | undefined {
  const levelMap: Record<MasteryLevel, string | undefined> = {
    'crawl': 'Walk',
    'walk': 'Run-Guided',
    'run-guided': 'Run-Independent',
    'run-independent': undefined
  };
  return levelMap[currentLevel];
}

/** Helper to get next level ID for navigation */
function getNextLevelId(currentLevel: MasteryLevel): MasteryLevel | null {
  const levelMap: Record<MasteryLevel, MasteryLevel | null> = {
    'crawl': 'walk',
    'walk': 'run-guided',
    'run-guided': 'run-independent',
    'run-independent': null
  };
  return levelMap[currentLevel];
}

interface LessonData {
  id: string;
  title: string;
  description: string;
  duration: string;
  xp: number;
  content: {
    crawl: LessonContent;
    walk: LessonContent;
    runGuided: LessonContent;
    runIndependent: LessonContent;
  };
}

interface LessonContent {
  videoId?: string;
  instructions: string;
  objectives: string[];
  hints?: string[];
  quiz?: unknown[];
  labInstructions?: string;
}

export default function MasteryLesson() {
  const { lessonId, level: levelParam } = useParams<{ lessonId: string; level: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [lessonData, setLessonData] = useState<LessonData | null>(null);
  const [detailedContent, setDetailedContent] = useState<LeveledLessonContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [aarSubmitted, setAarSubmitted] = useState(false);
  const [weekNumber, setWeekNumber] = useState<number | null>(null);
  const [struggleMetrics, setStruggleMetrics] = useState<StruggleMetrics>({
    hintsUsed: 0,
    validationErrors: 0,
    timeSpentSeconds: 0,
    retryCount: 0,
    isPerfectCompletion: true
  });
  const [startTime] = useState<number>(Date.now());
  const [completedExercises, setCompletedExercises] = useState<number[]>([]);
  const [runIndependentDraft, setRunIndependentDraft] = useState<string>('');

  const level = levelParam as MasteryLevel;

  // Mastery tracking
  const {
    mastery,
    loading: masteryLoading,
    currentLevel,
    recordAttempt,
    getLevelProgress,
    canAccessLevel,
    isLevelMastered,
    refreshMastery
  } = useMastery(lessonId || '');

  // Validate level parameter
  const validLevels: MasteryLevel[] = ['crawl', 'walk', 'run-guided', 'run-independent'];
  const isValidParams = lessonId && levelParam && validLevels.includes(level);

  // Handler for AAR completion
  const handleAARComplete = useCallback(async () => {
    setAarSubmitted(true);
    await refreshMastery();
    
    if (mastery && isLevelMastered(level)) {
      const nextLevel = getNextLevelId(level);
      if (nextLevel) {
        const userConfirmed = globalThis.confirm(
          `🎉 You've mastered this level!\n\nWould you like to continue to the next level (${nextLevel})?`
        );
        if (userConfirmed) {
          navigate(`/lesson/${lessonId}/${nextLevel}`);
          return;
        }
      }
    }
    navigate(weekNumber ? `/week/${weekNumber}` : '/curriculum');
  }, [mastery, isLevelMastered, level, lessonId, weekNumber, navigate, refreshMastery]);

  useEffect(() => {
    if (!lessonId || !isValidParams) return;

    async function fetchLessonData() {
      try {
        console.log('🔍 Looking for lessonId:', lessonId);

        // Load all weeks data to find the lesson
        const allWeeks = await curriculumLoader.loadAllWeeks();

        // Load basic lesson data from local curriculum data
        let lessonInfo = null;
        let foundWeek = null;
        for (const week of allWeeks) {
          console.log('🔍 Checking week', week.weekNumber, 'lessons:', week.lessons.map(l => ({ id: l.id, lessonId: l.lessonId })));
          const foundLesson = week.lessons.find(l => l.id === lessonId || l.lessonId === lessonId);
          if (foundLesson) {
            console.log('✅ Found lesson:', foundLesson);
            lessonInfo = foundLesson;
            foundWeek = week.weekNumber;
            break;
          }
        }

        if (lessonInfo && foundWeek) {
          setWeekNumber(foundWeek);
          // Create lesson data structure from curriculum info
          const data: LessonData = {
            id: lessonInfo.id || lessonInfo.lessonId,
            title: lessonInfo.baseLesson.title,
            description: lessonInfo.baseLesson.description,
            duration: lessonInfo.baseLesson.estimatedTimePerLevel.crawl.toString(),
            xp: 100, // Default XP, could be calculated based on completion
            content: {
              crawl: { 
                instructions: '', 
                objectives: lessonInfo.baseLesson.learningObjectives 
              },
              walk: { 
                instructions: '', 
                objectives: lessonInfo.baseLesson.learningObjectives 
              },
              runGuided: { 
                instructions: '', 
                objectives: lessonInfo.baseLesson.learningObjectives 
              },
              runIndependent: { 
                instructions: '', 
                objectives: lessonInfo.baseLesson.learningObjectives 
              }
            }
          };
          setLessonData(data);
        }

        // Load detailed mastery content
        const content = await loadLessonContent(lessonId!);
        setDetailedContent(content);
      } catch (error) {
        console.error('Error fetching lesson:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLessonData();
  }, [lessonId, isValidParams]);

  // Early return for invalid parameters (after all hooks)
  if (!isValidParams) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Invalid lesson or level</div>
      </div>
    );
  }

  const getLevelConfig = (level: MasteryLevel) => {
    switch (level) {
      case 'crawl':
        return {
          name: 'Crawl - Guided Learning',
          icon: <BookOpen className="w-5 h-5" />,
          color: 'text-blue-400',
          bgColor: 'bg-blue-900/20',
          description: 'Step-by-step guided instruction with full support',
          showHints: true,
          showVideo: true,
          allowStruggle: false
        };
      case 'walk':
        return {
          name: 'Walk - Interactive Learning',
          icon: <Target className="w-5 h-5" />,
          color: 'text-green-400',
          bgColor: 'bg-green-900/20',
          description: 'Fill-in-the-blanks with some independence',
          showHints: true,
          showVideo: false,
          allowStruggle: true
        };
      case 'run-guided':
        return {
          name: 'Run-Guided - Conceptual Mastery',
          icon: <Brain className="w-5 h-5" />,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-900/20',
          description: 'Conceptual understanding with minimal guidance',
          showHints: false,
          showVideo: false,
          allowStruggle: true
        };
      case 'run-independent':
        return {
          name: 'Run-Independent - Full Mastery',
          icon: <Zap className="w-5 h-5" />,
          color: 'text-purple-400',
          bgColor: 'bg-purple-900/20',
          description: 'Complete independence with no assistance',
          showHints: false,
          showVideo: false,
          allowStruggle: true
        };
    }
  };

  if (loading || masteryLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading lesson...</div>
      </div>
    );
  }

  // Check if user can access this level
  if (mastery && !canAccessLevel(level)) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6">
        <div className="max-w-md bg-slate-800 border-2 border-red-500 rounded-lg p-8">
          <div className="flex flex-col items-center text-center">
            <Lock className="w-16 h-16 text-red-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Level Locked</h2>
            <p className="text-slate-300 mb-4">
              You must master the previous level before accessing this one.
            </p>
            <button
              onClick={() => navigate(`/lesson/${lessonId}/${currentLevel}`)}
              className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
            >
              Go to Current Level ({currentLevel})
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!lessonData) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Lesson not found</div>
      </div>
    );
  }

  const getContentKey = (level: MasteryLevel): keyof LessonData['content'] => {
    switch (level) {
      case 'crawl': return 'crawl';
      case 'walk': return 'walk';
      case 'run-guided': return 'runGuided';
      case 'run-independent': return 'runIndependent';
    }
  };

  const levelConfig = getLevelConfig(level);
  const rawContent = detailedContent ? detailedContent[getContentKey(level)] : null;

  // Render content based on level type
  const renderLevelContent = () => {
    if (!rawContent && !detailedContent) {
      return (
        <div className="bg-yellow-900/20 border border-yellow-600 rounded-lg p-6">
          <h3 className="text-yellow-400 font-semibold mb-2">Content In Development</h3>
          <p className="text-yellow-200">
            This lesson content is being developed. Please check back soon for detailed mastery-level content.
          </p>
        </div>
      );
    }

    if (!rawContent) {
      return (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <p className="text-slate-400">No content available for this level yet.</p>
        </div>
      );
    }

    // Crawl Level: Steps
    if (level === 'crawl' && 'steps' in rawContent) {
      return (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h2 className="text-xl font-semibold mb-4">Introduction</h2>
            <p className="text-slate-300">{rawContent.introduction}</p>
          </div>
          
          {rawContent.steps.map((step) => (
            <div key={`step-${step.stepNumber}`} className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center font-bold">
                  {step.stepNumber}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-white mb-2">{step.instruction}</h3>
                  
                  {step.command && (
                    <div className="bg-slate-900 border border-slate-700 rounded p-3 mb-3">
                      <code className="text-green-400 text-sm">{step.command}</code>
                    </div>
                  )}
                  
                  <p className="text-slate-300 mb-4">{step.explanation}</p>
                  
                  {step.expectedOutput && (
                    <div className="bg-blue-900/20 border border-blue-600/30 rounded p-3 mb-3">
                      <div className="text-sm text-blue-300 font-semibold mb-1">Expected Understanding:</div>
                      <div className="text-sm text-blue-200">{step.expectedOutput}</div>
                    </div>
                  )}
                  
                  {step.validationCriteria && step.validationCriteria.length > 0 && (
                    <div className="mb-3">
                      <div className="text-sm font-semibold text-green-400 mb-2">✓ Validation Criteria:</div>
                      <ul className="space-y-1">
                        {step.validationCriteria.map((criteria, i) => (
                          <li key={`vc-${step.stepNumber}-${i}`} className="text-sm text-slate-300 flex items-start">
                            <span className="text-green-400 mr-2">•</span>
                            {criteria}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {step.commonMistakes && step.commonMistakes.length > 0 && (
                    <div>
                      <div className="text-sm font-semibold text-red-400 mb-2">⚠️ Common Mistakes:</div>
                      <ul className="space-y-1">
                        {step.commonMistakes.map((mistake, i) => (
                          <li key={`cm-${step.stepNumber}-${i}`} className="text-sm text-red-200 flex items-start">
                            <span className="text-red-400 mr-2">•</span>
                            {mistake}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      );
    }

    // Walk Level: Exercises with interactive fill-in-the-blank
    if (level === 'walk' && 'exercises' in rawContent) {
      return (
        <WalkLevelContent
          content={rawContent}
          onExerciseComplete={(exerciseNumber, correct) => {
            if (!completedExercises.includes(exerciseNumber)) {
              setCompletedExercises([...completedExercises, exerciseNumber]);
            }
            if (!correct) {
              setStruggleMetrics(prev => ({
                ...prev,
                validationErrors: prev.validationErrors + 1,
                isPerfectCompletion: false
              }));
            }
          }}
          completedExercises={completedExercises}
        />
      );
    }

    // Run-Guided Level: Conceptual guidance with workspace
    if (level === 'run-guided' && 'objective' in rawContent) {
      const handleRunGuidedSubmit = (responses: Record<string, string>, notes: string, hintsUsed: number) => {
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        setStruggleMetrics(prev => ({
          ...prev,
          hintsUsed: hintsUsed,
          timeSpentSeconds: timeSpent,
          isPerfectCompletion: hintsUsed === 0
        }));
        setCompleted(true);
      };

      const handleRunGuidedSaveDraft = (responses: Record<string, string>, notes: string) => {
        // Draft is saved in the workspace component via localStorage
        console.log('Run-guided draft saved', { responses, notes });
      };

      return (
        <div className="space-y-6">
          {/* Objective */}
          <div className="bg-slate-800 rounded-lg p-6 border border-cyan-600">
            <h2 className="text-xl font-semibold mb-4 text-cyan-400">Objective</h2>
            <p className="text-white text-lg">{rawContent.objective}</p>
          </div>
          
          {/* Conceptual Guidance */}
          {'conceptualGuidance' in rawContent && rawContent.conceptualGuidance && (
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="font-semibold mb-3 text-yellow-400">Conceptual Guidance</h3>
              <ul className="space-y-2">
                {rawContent.conceptualGuidance.map((guidance, i) => (
                  <li key={`cg-${i}-${guidance.slice(0, 10)}`} className="text-slate-300 flex items-start">
                    <span className="text-yellow-400 mr-2">→</span>
                    {guidance}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Key Concepts */}
          {'keyConceptsToApply' in rawContent && rawContent.keyConceptsToApply && (
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="font-semibold mb-3 text-purple-400">Key Concepts to Apply</h3>
              <ul className="space-y-2">
                {rawContent.keyConceptsToApply.map((concept, i) => (
                  <li key={`kc-${i}-${concept.slice(0, 10)}`} className="text-slate-300 flex items-start">
                    <span className="text-purple-400 mr-2">▸</span>
                    {concept}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Workspace with Checkpoints */}
          {'checkpoints' in rawContent && rawContent.checkpoints && (
            <RunGuidedWorkspace
              lessonId={lessonId || ''}
              checkpoints={rawContent.checkpoints}
              resourcesAllowed={rawContent.resourcesAllowed}
              onSubmit={handleRunGuidedSubmit}
              onSaveDraft={handleRunGuidedSaveDraft}
            />
          )}
        </div>
      );
    }

    // Run-Independent Level: Objective, criteria, and workspace
    if (level === 'run-independent' && 'objective' in rawContent) {
      const handleRunIndependentSubmit = () => {
        // Calculate time spent
        const timeSpent = Math.floor((Date.now() - startTime) / 1000);
        setStruggleMetrics(prev => ({
          ...prev,
          timeSpentSeconds: timeSpent,
          isPerfectCompletion: true // Run-independent is always "perfect" if completed
        }));
        setCompleted(true);
      };

      const handleSaveDraft = (draft: string) => {
        setRunIndependentDraft(draft);
        // Could also save to localStorage or Firestore for persistence
        localStorage.setItem(`run-independent-draft-${lessonId}`, draft);
      };

      // Load saved draft on mount
      const savedDraft = runIndependentDraft || localStorage.getItem(`run-independent-draft-${lessonId}`) || '';

      return (
        <div className="space-y-6">
          <div className="bg-slate-800 rounded-lg p-6 border border-purple-600">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Mission Objective</h2>
            <p className="text-white text-lg font-medium">{rawContent.objective}</p>
          </div>
          
          {/* Workspace Component */}
          <RunIndependentWorkspace
            objective={rawContent.objective}
            successCriteria={rawContent.successCriteria || []}
            timeTarget={rawContent.timeTarget}
            onSubmit={handleRunIndependentSubmit}
            onSaveDraft={handleSaveDraft}
            savedDraft={savedDraft}
          />
        </div>
      );
    }

    // Fallback
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <p className="text-slate-400">Content format not recognized for this level.</p>
      </div>
    );
  };

  return (
    <ContentGate contentType="lesson" contentId={lessonId}>
      <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => navigate(weekNumber ? `/week/${weekNumber}` : '/curriculum')}
              className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to {weekNumber ? `Week ${weekNumber}` : 'Curriculum'}</span>
            </button>

            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full ${levelConfig.bgColor}`}>
              {levelConfig.icon}
              <span className={`text-sm font-medium ${levelConfig.color}`}>
                {levelConfig.name}
              </span>
            </div>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{lessonData.title}</h1>
              <p className="text-slate-400 mb-4">{levelConfig.description}</p>

              <div className="flex items-center space-x-6 text-sm text-slate-500">
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{lessonData.duration}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Award className="w-4 h-4" />
                  <span>{lessonData.xp} XP</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-2xl font-bold text-indigo-400">{lessonData.xp}</div>
              <div className="text-sm text-slate-500">XP Reward</div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Base lesson info */}
            {detailedContent?.baseLesson && (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h2 className="text-xl font-semibold mb-4">Learning Objectives</h2>
                <ul className="space-y-2">
                  {detailedContent.baseLesson.learningObjectives.map((objective, idx) => (
                    <li key={`lo-${idx}-${objective.slice(0, 20)}`} className="flex items-start space-x-2">
                      <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                      <span className="text-slate-300">{objective}</span>
                    </li>
                  ))}
                </ul>
                
                {detailedContent.baseLesson.prerequisites.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-700">
                    <h3 className="text-sm font-semibold text-slate-400 mb-2">Prerequisites:</h3>
                    <ul className="space-y-1">
                      {detailedContent.baseLesson.prerequisites.map((prereq, idx) => (
                        <li key={`pr-${idx}-${prereq.slice(0, 20)}`} className="text-sm text-slate-400">• {prereq}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
            
            {/* Level-specific content */}
            {renderLevelContent()}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Level info */}
            {detailedContent?.baseLesson && (
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h3 className="font-semibold mb-2">Estimated Time</h3>
                <div className="flex items-center space-x-2 text-slate-300">
                  <Clock className="w-5 h-5" />
                  <span>
                    {level === 'crawl' && detailedContent.baseLesson.estimatedTimePerLevel.crawl}
                    {level === 'walk' && detailedContent.baseLesson.estimatedTimePerLevel.walk}
                    {level === 'run-guided' && detailedContent.baseLesson.estimatedTimePerLevel.runGuided}
                    {level === 'run-independent' && detailedContent.baseLesson.estimatedTimePerLevel.runIndependent}
                    {' minutes'}
                  </span>
                </div>
              </div>
            )}

            {/* Struggle Session (for levels that allow it) */}
            {levelConfig.allowStruggle && (
              <StruggleSessionManager
                labId={lessonId}
                userId={user?.uid || ''}
                availableHints={[]}
                onSessionComplete={(session) => {
                  console.log('Struggle session completed:', session);
                }}
                onHintUsed={(hint) => {
                  console.log('Hint used:', hint);
                }}
              />
            )}

            {/* Mastery Gate Display */}
            {mastery && getLevelProgress(level) && (
              <>
                {console.log('🟣 MasteryGate Render - Level:', level)}
                {console.log('🟣 MasteryGate Render - Progress:', getLevelProgress(level))}
                {console.log('🟣 MasteryGate Render - Full Mastery:', mastery)}
                <MasteryGate
                  level={level}
                  progress={getLevelProgress(level)!}
                  nextLevelName={getNextLevelDisplayName(level)}
                />
              </>
            )}

            {/* Complete Button */}
            <button
              onClick={async () => {
                console.log('🔵 COMPLETE BUTTON CLICKED');
                console.log('🔵 Mastery object exists?', !!mastery);
                console.log('🔵 User ID:', user?.uid);
                console.log('🔵 Lesson ID:', lessonId);
                console.log('🔵 Current Level:', level);
                
                // Calculate time spent
                const timeSpent = Math.floor((Date.now() - startTime) / 1000);
                
                // Update struggle metrics with final values
                const finalMetrics: StruggleMetrics = {
                  ...struggleMetrics,
                  timeSpentSeconds: timeSpent,
                  isPerfectCompletion: struggleMetrics.hintsUsed === 0 && struggleMetrics.validationErrors === 0 && struggleMetrics.retryCount === 0
                };
                setStruggleMetrics(finalMetrics);
                
                // Determine if this was a perfect completion
                const isPerfect = finalMetrics.isPerfectCompletion;
                
                console.log('🔵 Recording attempt:', { level, isPerfect, timeSpent, struggleMetrics: finalMetrics });
                console.log('🔵 Mastery state BEFORE recordAttempt:', JSON.stringify(mastery, null, 2));
                
                // Record the attempt
                if (mastery) {
                  console.log('🔵 Calling recordAttempt...');
                  const result = await recordAttempt(level, isPerfect, timeSpent);
                  
                  console.log('🔵 Attempt recorded:', result);
                  console.log('🔵 Current mastery state AFTER:', mastery);
                  
                  if (!isPerfect) {
                    // Don't show alert - let the AAR handle it
                  } else if (result?.levelMastered) {
                    alert(
                      `🎉 Level Mastered!\n\n` +
                      `You've achieved ${getLevelProgress(level)?.requiredPerfectCompletions} perfect completions!` +
                      (result.nextLevelUnlocked ? `\n\nNext level unlocked!` : '')
                    );
                  } else {
                    // Show progress update
                    const progress = getLevelProgress(level);
                    if (progress) {
                      alert(
                        `✅ Progress Updated!\n\n` +
                        `Perfect completions: ${progress.perfectCompletions}/${progress.requiredPerfectCompletions}\n` +
                        `Total attempts: ${progress.attempts}\n\n` +
                        `Complete ${progress.requiredPerfectCompletions - progress.perfectCompletions} more perfect attempt(s) to master this level.`
                      );
                    }
                  }
                }
                
                setCompleted(true);
              }}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              Complete Level
            </button>
            
            {/* Performance Warning */}
            {(struggleMetrics.hintsUsed > 0 || struggleMetrics.validationErrors > 0) && (
              <div className="bg-yellow-900/20 border border-yellow-700 rounded-lg p-3">
                <div className="flex items-start space-x-2">
                  <AlertTriangle className="w-4 h-4 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <div className="text-xs text-yellow-300">
                    <p className="font-medium mb-1">Not Perfect</p>
                    {struggleMetrics.hintsUsed > 0 && <p>• {struggleMetrics.hintsUsed} hint(s) used</p>}
                    {struggleMetrics.validationErrors > 0 && <p>• {struggleMetrics.validationErrors} error(s)</p>}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Adaptive AAR Modal */}
      {completed && !aarSubmitted && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
          <AdaptiveAARForm
            userId={user?.uid || ''}
            lessonId={lessonId}
            level={level}
            labId=""
            struggleMetrics={struggleMetrics}
            onComplete={handleAARComplete}
            onCancel={() => {
              globalThis.alert('AAR is required to save your progress.');
            }}
          />
        </div>
      )}
    </div>
    </ContentGate>
  );
}