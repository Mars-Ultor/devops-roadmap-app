/**
 * Weekly Boss Battle Modal
 * 2-hour comprehensive challenge that blocks week progression
 */

import { type FC, useState, useEffect } from 'react';
import { X, Swords, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface BossBattleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (success: boolean) => void;
  week: number;
}

interface BossBattle {
  id: string;
  week: number;
  title: string;
  scenario: string;
  objective: string;
  phases: BattlePhase[];
  timeLimit: number; // seconds (7200 = 2 hours)
  minimumPassScore: number; // percentage
}

interface BattlePhase {
  name: string;
  description: string;
  tasks: string[];
  points: number;
}

export const BossBattleModal: FC<BossBattleModalProps> = ({
  isOpen,
  onClose,
  onComplete,
  week
}) => {
  const { user } = useAuthStore();
  const [battle, setBattle] = useState<BossBattle | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [phaseCompletion, setPhaseCompletion] = useState<boolean[][]>([]);
  const [currentPhase, setCurrentPhase] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);

  useEffect(() => {
    const loadBossBattleData = async () => {
      if (!user) return;

      const battleRef = doc(db, 'bossBattles', `${user.uid}_week${week}`);
      const battleDoc = await getDoc(battleRef);

      if (battleDoc.exists()) {
        const data = battleDoc.data();
        setBattle(data.battle);
        setTimeRemaining(data.timeRemaining || data.battle.timeLimit);
        setHasStarted(data.hasStarted || false);
        setPhaseCompletion(data.phaseCompletion || initializePhaseCompletion(data.battle));
        setCurrentPhase(data.currentPhase || 0);
        
        if (data.hasStarted && data.timeRemaining > 0) {
          setIsActive(true);
        }
      } else {
        const newBattle = generateBossBattle(week);
        setBattle(newBattle);
        setTimeRemaining(newBattle.timeLimit);
        setPhaseCompletion(initializePhaseCompletion(newBattle));
        setCurrentPhase(0);
      }
    };

    if (isOpen) {
      loadBossBattleData();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, week, user?.uid]);

  // Countdown timer
  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeRemaining]);

  const loadBossBattle = async () => {
    if (!user) return;

    const battleRef = doc(db, 'bossBattles', `${user.uid}_week${week}`);
    const battleDoc = await getDoc(battleRef);

    if (battleDoc.exists()) {
      const data = battleDoc.data();
      setBattle(data.battle);
      setTimeRemaining(data.timeRemaining || data.battle.timeLimit);
      setHasStarted(data.hasStarted || false);
      setPhaseCompletion(data.phaseCompletion || initializePhaseCompletion(data.battle));
      setCurrentPhase(data.currentPhase || 0);
      
      if (data.hasStarted && data.timeRemaining > 0) {
        setIsActive(true);
      }
    } else {
      const newBattle = generateBossBattle(week);
      setBattle(newBattle);
      setTimeRemaining(newBattle.timeLimit);
      setPhaseCompletion(initializePhaseCompletion(newBattle));
      setCurrentPhase(0);
    }
  };

  const initializePhaseCompletion = (battle: BossBattle): boolean[][] => {
    return battle.phases.map(phase => new Array(phase.tasks.length).fill(false));
  };

  const handleStart = async () => {
    if (!user || !battle) return;

    setIsActive(true);
    setHasStarted(true);
    
    const battleRef = doc(db, 'bossBattles', `${user.uid}_week${week}`);
    await setDoc(battleRef, {
      battle,
      hasStarted: true,
      startedAt: new Date().toISOString(),
      timeRemaining,
      phaseCompletion,
      currentPhase,
      completedAt: null,
      passed: false
    }, { merge: true });
  };

  const handleSubmit = async () => {
    if (!user || !battle) return;

    const score = calculateScore();
    const passed = score >= battle.minimumPassScore;

    const battleRef = doc(db, 'bossBattles', `${user.uid}_week${week}`);
    await setDoc(battleRef, {
      battle,
      completedAt: new Date().toISOString(),
      passed,
      score,
      timeUsed: battle.timeLimit - timeRemaining,
      phaseCompletion
    }, { merge: true });

    onComplete(passed);
    
    if (!passed) {
      alert(`Boss Battle Failed!\n\nYou scored ${score}% but need ${battle.minimumPassScore}% to pass.\n\nYou must retry this battle before advancing to Week ${week + 1}.`);
    }
  };

  const handleTimeExpired = async () => {
    if (!user || !battle) return;

    const score = calculateScore();
    const passed = score >= battle.minimumPassScore;

    const battleRef = doc(db, 'bossBattles', `${user.uid}_week${week}`);
    await setDoc(battleRef, {
      battle,
      completedAt: new Date().toISOString(),
      passed,
      score,
      timeUsed: battle.timeLimit,
      phaseCompletion
    }, { merge: true });

    onComplete(passed);
    
    alert('Time expired! Submitting what you\'ve completed...');
  };

  const toggleTask = (phaseIndex: number, taskIndex: number) => {
    setPhaseCompletion(prev => {
      const newState = [...prev];
      newState[phaseIndex] = [...newState[phaseIndex]];
      newState[phaseIndex][taskIndex] = !newState[phaseIndex][taskIndex];
      return newState;
    });
  };

  const calculateScore = (): number => {
    if (!battle) return 0;

    let earnedPoints = 0;
    let totalPoints = 0;

    battle.phases.forEach((phase, phaseIndex) => {
      totalPoints += phase.points;
      const completedTasks = phaseCompletion[phaseIndex]?.filter(t => t).length || 0;
      const phasePercentage = completedTasks / phase.tasks.length;
      earnedPoints += phase.points * phasePercentage;
    });

    return Math.round((earnedPoints / totalPoints) * 100);
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (!battle) return 'text-slate-400';
    const percentRemaining = timeRemaining / battle.timeLimit;
    if (percentRemaining > 0.5) return 'text-emerald-400';
    if (percentRemaining > 0.2) return 'text-amber-400';
    return 'text-red-400';
  };

  if (!isOpen || !battle) return null;

  const currentScore = calculateScore();
  const isPhaseComplete = (phaseIndex: number) => {
    return phaseCompletion[phaseIndex]?.every(t => t) || false;
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-900/50 to-slate-800 border-b border-red-500/50 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Swords className="w-8 h-8 text-red-400" />
                <div>
                  <h2 className="text-3xl font-bold text-white">Week {week} Boss Battle</h2>
                  <p className="text-slate-300 text-sm mt-1">{battle.title}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="bg-slate-900/50 rounded-lg px-4 py-2">
                  <div className="text-xs text-slate-400">Time Remaining</div>
                  <div className={`text-2xl font-mono font-bold ${getTimerColor()}`}>
                    {formatTime(timeRemaining)}
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg px-4 py-2">
                  <div className="text-xs text-slate-400">Current Score</div>
                  <div className={`text-2xl font-bold ${currentScore >= battle.minimumPassScore ? 'text-emerald-400' : 'text-amber-400'}`}>
                    {currentScore}%
                  </div>
                </div>
                <div className="bg-slate-900/50 rounded-lg px-4 py-2">
                  <div className="text-xs text-slate-400">Pass Threshold</div>
                  <div className="text-2xl font-bold text-slate-300">
                    {battle.minimumPassScore}%
                  </div>
                </div>
              </div>
            </div>
            {!isActive && (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {/* Warning Banner */}
        {!hasStarted && (
          <div className="bg-red-900/20 border-y border-red-500/50 p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-red-400 mt-1" />
              <div>
                <h3 className="text-red-300 font-semibold mb-1">WARNING: This is a Boss Battle</h3>
                <ul className="text-sm text-red-200 space-y-1">
                  <li>• You have {battle.timeLimit / 3600} hours to complete this challenge</li>
                  <li>• You must score at least {battle.minimumPassScore}% to pass</li>
                  <li>• You CANNOT advance to Week {week + 1} until you pass this battle</li>
                  <li>• Once started, the timer cannot be paused</li>
                  <li>• This tests everything you've learned this week</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Scenario */}
          <div>
            <h3 className="text-xl font-bold text-white mb-3">Mission Scenario</h3>
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-slate-300 whitespace-pre-line mb-4">{battle.scenario}</p>
              <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-3">
                <p className="text-blue-200 font-semibold">Objective: {battle.objective}</p>
              </div>
            </div>
          </div>

          {/* Phases */}
          {battle.phases.map((phase, phaseIndex) => (
            <div key={phaseIndex} className="bg-slate-900 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Phase {phaseIndex + 1}: {phase.name}
                  {isPhaseComplete(phaseIndex) && (
                    <CheckCircle className="w-5 h-5 text-emerald-400" />
                  )}
                </h3>
                <span className="text-sm text-slate-400">{phase.points} points</span>
              </div>
              <p className="text-slate-300 text-sm mb-4">{phase.description}</p>
              
              <div className="space-y-2">
                {phase.tasks.map((task, taskIndex) => (
                  <label
                    key={taskIndex}
                    className="flex items-start gap-3 bg-slate-800 rounded-lg p-3 cursor-pointer hover:bg-slate-700 transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={phaseCompletion[phaseIndex]?.[taskIndex] || false}
                      onChange={() => toggleTask(phaseIndex, taskIndex)}
                      disabled={!isActive || timeRemaining === 0}
                      className="mt-1 w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
                    />
                    <span className={`text-sm ${phaseCompletion[phaseIndex]?.[taskIndex] ? 'text-emerald-300 line-through' : 'text-slate-300'}`}>
                      {task}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-6">
          {!isActive ? (
            <div className="flex justify-between items-center">
              <p className="text-sm text-slate-400">
                Ready to begin? Make sure you have {battle.timeLimit / 3600} hours available.
              </p>
              <button
                onClick={handleStart}
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-lg font-bold text-lg flex items-center gap-2"
              >
                <Swords className="w-5 h-5" />
                Start Boss Battle
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm text-slate-400">
                  {phaseCompletion.flat().filter(t => t).length} / {battle.phases.reduce((sum, p) => sum + p.tasks.length, 0)} tasks complete
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  {currentScore >= battle.minimumPassScore ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle className="w-4 h-4" /> Currently passing
                    </span>
                  ) : (
                    <span className="text-amber-400 flex items-center gap-1">
                      <XCircle className="w-4 h-4" /> Need {battle.minimumPassScore - currentScore}% more to pass
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleSubmit}
                className={`px-8 py-3 rounded-lg font-bold text-lg ${
                  currentScore >= battle.minimumPassScore
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    : 'bg-amber-600 hover:bg-amber-700 text-white'
                }`}
              >
                Submit Battle {currentScore >= battle.minimumPassScore && '✓'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Generate boss battle based on week
 */
function generateBossBattle(week: number): BossBattle {
  // Example boss battles for different weeks
  const battles: Record<number, BossBattle> = {
    4: {
      id: 'week4-boss',
      week: 4,
      title: 'Production Deployment Crisis',
      scenario: `It's Friday 4pm. The CEO just announced a major client demo Monday morning.
      
Your team deployed a new feature to production but it's causing cascading failures:
- The web application returns 502 errors intermittently
- Database connections are timing out
- Docker containers are restarting randomly
- CI/CD pipeline is blocked by failed tests

You have 2 hours to diagnose and fix everything before the weekend.`,
      objective: 'Restore full production functionality and ensure stable deployment pipeline',
      phases: [
        {
          name: 'Emergency Diagnosis',
          description: 'Identify all failing components and root causes',
          tasks: [
            'Check Docker container health and logs',
            'Verify database connectivity and connection pool',
            'Review application error logs',
            'Inspect load balancer and reverse proxy config',
            'Document all identified issues'
          ],
          points: 25
        },
        {
          name: 'Critical Fixes',
          description: 'Resolve immediate production blockers',
          tasks: [
            'Fix container restart loops',
            'Restore database connections',
            'Clear application errors',
            'Verify end-to-end user flow works'
          ],
          points: 40
        },
        {
          name: 'Pipeline Recovery',
          description: 'Unblock CI/CD and enable future deployments',
          tasks: [
            'Fix failing unit tests',
            'Repair broken integration tests',
            'Verify pipeline runs green end-to-end',
            'Deploy a successful build to staging'
          ],
          points: 25
        },
        {
          name: 'Post-Incident',
          description: 'Documentation and prevention',
          tasks: [
            'Write incident timeline and root cause analysis',
            'Create runbook for this failure scenario',
            'Implement monitoring alerts to catch this earlier'
          ],
          points: 10
        }
      ],
      timeLimit: 7200, // 2 hours
      minimumPassScore: 80
    },
    8: {
      id: 'week8-boss',
      week: 8,
      title: 'Multi-Service Orchestration',
      scenario: `You're deploying a microservices architecture with:
- Frontend (React)
- Backend API (Node.js)
- Database (PostgreSQL)
- Cache (Redis)
- Message Queue (RabbitMQ)

Everything must work together in Docker with proper networking, persistence, and health checks.`,
      objective: 'Deploy and verify a fully functional multi-container application',
      phases: [
        {
          name: 'Infrastructure Setup',
          description: 'Build the foundation',
          tasks: [
            'Create Docker network for services',
            'Set up persistent volumes for data',
            'Configure environment variables',
            'Write docker-compose.yml'
          ],
          points: 20
        },
        {
          name: 'Service Deployment',
          description: 'Deploy all microservices',
          tasks: [
            'Deploy PostgreSQL with initialization scripts',
            'Deploy Redis with persistence',
            'Deploy RabbitMQ with management UI',
            'Deploy Backend API with database migrations',
            'Deploy Frontend with API connection'
          ],
          points: 35
        },
        {
          name: 'Integration Testing',
          description: 'Verify service communication',
          tasks: [
            'Frontend can reach Backend API',
            'Backend can read/write to PostgreSQL',
            'Backend can set/get from Redis',
            'Backend can publish/consume messages from RabbitMQ',
            'All health checks passing'
          ],
          points: 30
        },
        {
          name: 'Production Readiness',
          description: 'Make it deployment-ready',
          tasks: [
            'Implement rolling updates',
            'Add resource limits and requests',
            'Configure logging aggregation',
            'Create backup/restore script for database'
          ],
          points: 15
        }
      ],
      timeLimit: 7200,
      minimumPassScore: 75
    }
  };

  return battles[week] || battles[4]; // Fallback to week 4 boss if specific week not defined
}
