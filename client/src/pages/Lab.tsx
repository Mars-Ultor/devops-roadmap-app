import { useParams, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Trophy, BookOpen, Terminal as TerminalIcon, AlertTriangle } from 'lucide-react';
import LabTerminal from '../components/LabTerminal';
import EnhancedTerminal from '../components/EnhancedTerminal';
import ContentGate from '../components/ContentGate';
import ConstraintDisplay from '../components/training/ConstraintDisplay';
import TCSDisplay, { type TCSTask } from '../components/training/TCSDisplay';
import type { TCSTask as TerminalTCSTask } from '../types/tcs';
import { useProgress } from '../hooks/useProgress';
import { useStudySession } from '../hooks/useStudySession';
import { useAuthStore } from '../store/authStore';
import { ProgressiveConstraintsManager } from '../services/progressiveConstraints';
import AARForm from '../components/aar/AARForm';
import StepValidation, { type LabStep } from '../components/StepValidation';
import MandatoryAARModal from '../components/MandatoryAARModal';
import StruggleTimer, { type StruggleLog } from '../components/StruggleTimer';
import HintSystem from '../components/HintSystem';
import { StruggleTracker } from '../services/struggleTracker';

interface LabData {
  id: string;
  title: string;
  description: string;
  difficulty: string;
  estimatedTime: number;
  xp: number;
  tasks: string[];
  hints?: string[];
  tcsEnabled?: boolean; // Enhanced Terminal Command Simulation
  tcsScenarioId?: string;
  steps?: LabStep[]; // New step-based structure
  tcs?: TCSTask; // Phase 11: Task, Conditions, Standards
}

export default function Lab() {
  const { labId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [labData, setLabData] = useState<LabData | null>(null);
  const [loading, setLoading] = useState(true);
  const [labCompleted, setLabCompleted] = useState(false);
  const [aarSubmitted, setAarSubmitted] = useState(false);
  const [startTime] = useState<number>(Date.now());
  const [timeSpent, setTimeSpent] = useState<number>(0);
  const [steps, setSteps] = useState<LabStep[]>([]);
  const [weekNumber, setWeekNumber] = useState<number>(1);
  const [hintsUsed, setHintsUsed] = useState<number>(0);
  const [resetsUsed] = useState<number>(0);
  const [tcsStandards, setTcsStandards] = useState<TCSTask['standards']>([]);
  const [hintsUnlocked, setHintsUnlocked] = useState<boolean>(false);
  
  const { getLabProgress, completeLab } = useProgress();
  
  // Track study session
  useStudySession({
    contentId: labId || '',
    contentType: 'lab'
  });

  // Track time spent
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  useEffect(() => {
    async function fetchLabData() {
      if (!labId) return;
      
      try {
        // Check if lab is already completed
        const isCompleted = await getLabProgress(labId);
        if (isCompleted) {
          setLabCompleted(true);
        }

        // Extract week number from labId (e.g., "w1-lab1" -> "week-1")
        const weekNum = parseInt(labId.split('-')[0].replace('w', ''));
        setWeekNumber(weekNum);
        const weekRef = doc(db, 'curriculum', `week-${weekNum}`);
        const weekSnap = await getDoc(weekRef);
        
        if (weekSnap.exists()) {
          const weekData = weekSnap.data();
          const lab = weekData.labs?.find((l: unknown) => (l as { id: string }).id === labId);
          if (lab) {
            setLabData(lab);
            
            // Initialize TCS standards if they exist
            if (lab.tcs && lab.tcs.standards) {
              setTcsStandards(lab.tcs.standards);
            }
            
            // Initialize steps if they exist, otherwise create default steps from tasks
            if (lab.steps && lab.steps.length > 0) {
              setSteps(lab.steps);
            } else {
              // Convert legacy tasks to steps
              const defaultSteps: LabStep[] = lab.tasks.map((task: string, index: number) => ({
                number: index + 1,
                title: `Task ${index + 1}`,
                description: task,
                validations: [
                  {
                    type: 'command_success',
                    cmd: 'echo "Task validation placeholder"'
                  }
                ],
                status: index === 0 ? 'in_progress' : 'locked',
                completedValidations: 0
              }));
              setSteps(defaultSteps);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching lab:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchLabData();
  }, [labId, getLabProgress]);

  // Phase 8: Copy-paste blocking for weeks 9-12
  useEffect(() => {
    return ProgressiveConstraintsManager.initializeCopyPasteBlocking(
      weekNumber,
      'textarea, input[type="text"], .terminal-input'
    );
  }, [weekNumber]);

  const handleStepComplete = (stepNumber: number) => {
    setSteps(prevSteps => {
      const newSteps = prevSteps.map(step => {
        if (step.number === stepNumber) {
          // Count how many validations passed for this step
          const passedValidations = step.validations.length; // All must pass to call this function
          return { 
            ...step, 
            status: 'completed' as const,
            completedValidations: passedValidations
          };
        }
        // Unlock next step if this one was completed
        if (step.number === stepNumber + 1 && step.status === 'locked') {
          return { ...step, status: 'in_progress' as const };
        }
        return step;
      });
      
      // Check if all steps are completed
      const allCompleted = newSteps.every(s => s.status === 'completed');
      if (allCompleted && !labCompleted) {
        setLabCompleted(true);
      }
      
      return newSteps;
    });
  };

  const handleLabComplete = async () => {
    if (!labData || labCompleted) return;

    // Check if all steps are completed
    const allStepsCompleted = steps.every(step => step.status === 'completed');
    if (!allStepsCompleted) {
      alert('Complete all steps before finishing the lab.');
      return;
    }
    
    // Mark lab as completed - this will trigger the mandatory AAR modal
    setLabCompleted(true);
  };

  const handleHintUnlocked = () => {
    setHintsUnlocked(true);
  };

  const handleStruggleLogged = (log: StruggleLog) => {
    // Persist to Firestore
    if (user && labData) {
      StruggleTracker.saveStruggleLog(user.uid, labId!, labData.title, log);
    }
  };

  const handleHintViewed = (hintId: number, timestamp: Date) => {
    setHintsUsed(prev => prev + 1);
    
    // Track in Firestore
    if (user) {
      StruggleTracker.trackHintView(user.uid, labId!, hintId, timestamp);
    }
  };

  const handleTCSStandardCheck = (standardId: string, met: boolean) => {
    setTcsStandards(prev => 
      prev.map(std => 
        std.id === standardId ? { ...std, met } : std
      )
    );
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-400">Loading lab...</div>
      </div>
    );
  }

  if (!labData) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-gray-400">Lab not found</div>
      </div>
    );
  }

  // Show mandatory AAR modal if lab completed but AAR not submitted
  if (labCompleted && !aarSubmitted && user) {
    return (
      <MandatoryAARModal
        labId={labId!}
        userId={user.uid}
        labTitle={labData.title}
        passed={true}
        onComplete={async () => {
          setAarSubmitted(true);
          
          // Actually complete the lab in the database
          try {
            if (labData) {
              await completeLab(labId!, labData.xp, steps.length, steps.length);
              console.log('Lab completed with XP:', labData.xp);
            }
          } catch (error) {
            console.error('Failed to complete lab:', error);
          }
          
          // Navigate back to training after a short delay
          setTimeout(() => {
            navigate('/training');
          }, 500);
        }}
      />
    );
  }

  return (
    <ContentGate>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <h1 className="text-3xl font-bold text-white">{labData.title}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                labData.difficulty === 'beginner' ? 'bg-green-600/20 text-green-400' :
                labData.difficulty === 'intermediate' ? 'bg-yellow-600/20 text-yellow-400' :
                'bg-red-600/20 text-red-400'
              }`}>
                {labData.difficulty}
              </span>
            </div>
            <p className="text-gray-400">{labData.description}</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-indigo-400">{labData.xp} XP</div>
            <div className="text-sm text-gray-400">{labData.estimatedTime} min estimate</div>
            <div className="text-sm text-yellow-400 mt-1">
              ⏱️ {Math.floor(timeSpent / 60)}:{(timeSpent % 60).toString().padStart(2, '0')} elapsed
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-400">Progress</span>
              {labData.tcsEnabled && (
                <span className="px-2 py-0.5 bg-indigo-900/40 border border-indigo-700 rounded text-xs text-indigo-400 flex items-center gap-1">
                  <TerminalIcon className="w-3 h-3" />
                  TCS Enhanced
                </span>
              )}
            </div>
            <span className="text-sm font-medium text-white">
              {steps.filter(s => s.status === 'completed').length} / {steps.length} steps
            </span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-500"
              style={{
                width: `${(steps.filter(s => s.status === 'completed').length / steps.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      {/* Phase 11: TCS (Task, Conditions, Standards) Display */}
      {labData.tcs && (
        <div className="mb-6">
          <TCSDisplay
            tcs={{
              ...labData.tcs,
              standards: tcsStandards
            }}
            onStandardCheck={handleTCSStandardCheck}
            readOnly={labCompleted}
          />
        </div>
      )}

      {/* Phase 8: Progressive Constraints Display */}
      <div className="mb-6">
        <ConstraintDisplay
          weekNumber={weekNumber}
          hintsUsed={hintsUsed}
          resetsUsed={resetsUsed}
        />
      </div>

      {/* Completion Banner */}
      {labCompleted && (
        <div className="mb-6 bg-gradient-to-r from-green-600/20 to-emerald-600/20 border-2 border-green-500 rounded-lg p-6">
          <div className="flex items-center space-x-4">
            <Trophy className="w-12 h-12 text-yellow-400" />
            <div>
              <h3 className="text-2xl font-bold text-white mb-1">Lab Completed! 🎉</h3>
              <p className="text-green-300">
                You earned {labData.xp} XP! Progress will be saved after AAR completion.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Mandatory AAR Modal - Blocks Navigation */}
      {labCompleted && !aarSubmitted && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={(e) => e.stopPropagation()} // Prevent closing
          onKeyDown={(e) => {
            if (e.key === 'Escape') {
              e.preventDefault();
              e.stopPropagation();
              alert('⚠️ AAR is mandatory. Complete it to save your progress.');
            }
          }}
        >
          <div className="bg-slate-800 border-2 border-red-500 rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-red-900/50 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">🔒 Mandatory After Action Review</h2>
                <p className="text-red-300">Complete your AAR to save progress and unlock navigation</p>
              </div>
            </div>

            <AARForm
              userId={user?.uid || ''}
              labId={labId!}
              lessonId={labId!.replace('lab', 'lesson')} // Derive lesson ID from lab ID (e.g., w1-lab1 -> w1-lesson1)
              level="crawl" // Labs are typically crawl-level activities
              onComplete={(aarId) => {
                setAarSubmitted(true);
                console.log('AAR completed:', aarId);
                navigate('/curriculum');
              }}
              onCancel={undefined} // No cancel allowed - AAR is mandatory
            />

            <div className="mt-6 p-4 bg-red-900/30 border-2 border-red-600 rounded-lg">
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <AlertTriangle className="w-5 h-5 text-red-400" />
                </div>
                <div className="flex-1">
                  <p className="text-red-300 text-sm font-medium mb-1">
                    <strong>⚠️ Navigation Blocked</strong>
                  </p>
                  <p className="text-red-200 text-xs">
                    You cannot leave this page until the AAR is completed. This ensures you reflect on your learning
                    and build better problem-solving skills. Attempting to close or refresh will lose your progress.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Instructions Sidebar */}
        <div className="lg:col-span-1 space-y-4">
          {/* Step Validation */}
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center space-x-2 mb-4">
              <BookOpen className="w-5 h-5 text-indigo-400" />
              <h3 className="text-lg font-semibold text-white">Lab Steps</h3>
            </div>
            <StepValidation
              steps={steps}
              onStepComplete={handleStepComplete}
            />
          </div>

          {/* Struggle Session Manager */}
          {labData.hints && labData.hints.length > 0 && user && !labCompleted && (
            <div className="space-y-4">
              <StruggleTimer
                startTime={startTime}
                onHintUnlocked={handleHintUnlocked}
                onStruggleLogged={handleStruggleLogged}
              />
              
              <HintSystem
                hints={labData.hints.map((text, index) => ({
                  id: index + 1,
                  text,
                  difficulty: index === 0 ? 'easy' : index === labData.hints!.length - 1 ? 'hard' : 'medium'
                }))}
                hintsUnlocked={hintsUnlocked}
                labStartTime={startTime}
                onHintViewed={handleHintViewed}
              />
            </div>
          )}
        </div>

        {/* Terminal */}
        <div className="lg:col-span-2">
          <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-700 bg-slate-900">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-sm text-gray-400 ml-4">Terminal - {labData.id}</span>
              </div>
            </div>
            <div className="h-[600px]">
              {labData.tcsEnabled ? (
                <EnhancedTerminal
                  tasks={createTcsTasks(labData)}
                  onTaskComplete={(taskId) => {
                    // Map task ID to step number and complete the step
                    const stepNumber = parseInt(taskId.split('-')[1]); // Extract number from task ID like "task-1"
                    handleStepComplete(stepNumber);
                  }}
                  onScenarioComplete={handleLabComplete}
                  timeLimit={labData.estimatedTime * 60}
                />
              ) : (
                <LabTerminal
                  labId={labData.id}
                  tasks={labData.tasks}
                  onTaskComplete={(taskIndex) => {
                    // Task index is 0-based, step number is 1-based
                    handleStepComplete(taskIndex + 1);
                  }}
                  onLabComplete={handleLabComplete}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </ContentGate>
  );
}

// Helper function to convert lab tasks to Terminal TCS tasks (for EnhancedTerminal)
function createTcsTasks(labData: LabData): TerminalTCSTask[] {
  return labData.tasks.map((description, idx) => ({
    id: `task-${idx}`,
    description,
    hint: labData.hints?.[idx],
    validators: [{
      pattern: /.*/,
      category: 'linux' as const,
      description,
      validate: () => ({ success: true, output: [], exitCode: 0 })
    }],
    points: Math.floor(labData.xp / labData.tasks.length)
  }));
}
