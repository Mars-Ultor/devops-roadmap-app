/**
 * Daily Challenge Modal
 * 5-minute randomized scenario every 24 hours
 */

import { type FC, useState, useEffect } from 'react';
import { X, Clock, Target, AlertCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../lib/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface DailyChallengeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onComplete: (success: boolean, timeUsed: number) => void;
}

interface Challenge {
  id: string;
  title: string;
  scenario: string;
  task: string;
  hints: string[];
  successCriteria: string[];
  timeLimit: number; // seconds
  difficulty: 'easy' | 'medium' | 'hard';
}

export const DailyChallengeModal: FC<DailyChallengeModalProps> = ({
  isOpen,
  onClose,
  onComplete
}) => {
  const { user } = useAuthStore();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [completedCriteria, setCompletedCriteria] = useState<boolean[]>([]);

  useEffect(() => {
    if (isOpen) {
      loadTodaysChallenge();
    }
  }, [isOpen]);

  // Countdown timer
  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleTimeExpired();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isActive, timeRemaining]);

  const loadTodaysChallenge = async () => {
    if (!user) return;

    const today = new Date().toISOString().split('T')[0];
    const challengeRef = doc(db, 'dailyChallenges', `${user.uid}_${today}`);
    const challengeDoc = await getDoc(challengeRef);

    if (challengeDoc.exists()) {
      const data = challengeDoc.data();
      setChallenge(data.challenge);
      setTimeRemaining(data.challenge.timeLimit);
      setCompletedCriteria(new Array(data.challenge.successCriteria.length).fill(false));
    } else {
      // Generate new challenge
      const newChallenge = generateRandomChallenge(user.currentWeek);
      setChallenge(newChallenge);
      setTimeRemaining(newChallenge.timeLimit);
      setCompletedCriteria(new Array(newChallenge.successCriteria.length).fill(false));

      // Save to Firestore
      await setDoc(challengeRef, {
        challenge: newChallenge,
        startedAt: null,
        completedAt: null,
        success: false
      });
    }
  };

  const handleStart = async () => {
    if (!user || !challenge) return;

    setIsActive(true);
    const today = new Date().toISOString().split('T')[0];
    const challengeRef = doc(db, 'dailyChallenges', `${user.uid}_${today}`);
    
    await setDoc(challengeRef, {
      challenge,
      startedAt: new Date().toISOString(),
      completedAt: null,
      success: false
    }, { merge: true });
  };

  const handleSubmit = async () => {
    if (!user || !challenge) return;

    const allComplete = completedCriteria.every(c => c);
    const timeUsed = challenge.timeLimit - timeRemaining;

    const today = new Date().toISOString().split('T')[0];
    const challengeRef = doc(db, 'dailyChallenges', `${user.uid}_${today}`);
    
    await setDoc(challengeRef, {
      challenge,
      completedAt: new Date().toISOString(),
      success: allComplete,
      timeUsed
    }, { merge: true });

    onComplete(allComplete, timeUsed);
    onClose();
  };

  const handleTimeExpired = async () => {
    if (!user || !challenge) return;

    const today = new Date().toISOString().split('T')[0];
    const challengeRef = doc(db, 'dailyChallenges', `${user.uid}_${today}`);
    
    await setDoc(challengeRef, {
      challenge,
      completedAt: new Date().toISOString(),
      success: false,
      timeUsed: challenge.timeLimit
    }, { merge: true });

    onComplete(false, challenge.timeLimit);
  };

  const toggleCriterion = (index: number) => {
    setCompletedCriteria(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getTimerColor = () => {
    if (!challenge) return 'text-slate-400';
    const percentRemaining = timeRemaining / challenge.timeLimit;
    if (percentRemaining > 0.5) return 'text-emerald-400';
    if (percentRemaining > 0.2) return 'text-amber-400';
    return 'text-red-400';
  };

  if (!isOpen || !challenge) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-amber-400" />
              <h2 className="text-2xl font-bold text-white">Daily Challenge</h2>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                challenge.difficulty === 'easy' ? 'bg-green-900/30 text-green-400' :
                challenge.difficulty === 'medium' ? 'bg-amber-900/30 text-amber-400' :
                'bg-red-900/30 text-red-400'
              }`}>
                {challenge.difficulty.toUpperCase()}
              </span>
            </div>
            <p className="text-slate-400 text-sm">{challenge.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white"
            disabled={isActive}
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Timer */}
        <div className="bg-slate-900 p-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-300">
            <Clock className="w-5 h-5" />
            <span className="text-sm">Time Limit: {challenge.timeLimit / 60} minutes</span>
          </div>
          <div className={`text-3xl font-mono font-bold ${getTimerColor()}`}>
            {formatTime(timeRemaining)}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Scenario */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-400" />
              Scenario
            </h3>
            <div className="bg-slate-900 rounded-lg p-4">
              <p className="text-slate-300 whitespace-pre-line">{challenge.scenario}</p>
            </div>
          </div>

          {/* Task */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Your Task</h3>
            <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-4">
              <p className="text-blue-200 font-medium">{challenge.task}</p>
            </div>
          </div>

          {/* Success Criteria */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">Success Criteria</h3>
            <div className="space-y-2">
              {challenge.successCriteria.map((criterion, index) => (
                <label
                  key={index}
                  className="flex items-start gap-3 bg-slate-900 rounded-lg p-3 cursor-pointer hover:bg-slate-800 transition-colors"
                >
                  <input
                    type="checkbox"
                    checked={completedCriteria[index]}
                    onChange={() => toggleCriterion(index)}
                    disabled={!isActive || timeRemaining === 0}
                    className="mt-1 w-4 h-4 rounded border-slate-600 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-900"
                  />
                  <span className={`text-sm ${completedCriteria[index] ? 'text-emerald-300 line-through' : 'text-slate-300'}`}>
                    {criterion}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Hints */}
          {challenge.hints.length > 0 && (
            <div>
              <button
                onClick={() => setShowHints(!showHints)}
                className="text-amber-400 hover:text-amber-300 text-sm font-medium"
              >
                {showHints ? 'Hide' : 'Show'} Hints ({challenge.hints.length})
              </button>
              {showHints && (
                <div className="mt-2 space-y-2">
                  {challenge.hints.map((hint, index) => (
                    <div key={index} className="bg-amber-900/20 border border-amber-500/30 rounded-lg p-3">
                      <p className="text-sm text-amber-200">💡 {hint}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-6 flex justify-between items-center">
          {!isActive ? (
            <>
              <p className="text-sm text-slate-400">
                This is a timed challenge. You have {challenge.timeLimit / 60} minutes to complete all criteria.
              </p>
              <button
                onClick={handleStart}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Start Challenge
              </button>
            </>
          ) : (
            <>
              <div className="text-sm text-slate-400">
                {completedCriteria.filter(c => c).length} / {challenge.successCriteria.length} criteria complete
              </div>
              <button
                onClick={handleSubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold"
              >
                Submit Challenge
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * Generate random challenge based on week difficulty
 */
function generateRandomChallenge(week: number): Challenge {
  const challenges: Challenge[] = [
    // Docker challenges
    {
      id: 'docker-debug-1',
      title: 'Container Crash Investigation',
      scenario: 'Production alert: Your nginx container keeps restarting every 30 seconds. Logs show "permission denied" errors. The application team is waiting for resolution.',
      task: 'Debug and fix the container crash. Container must run successfully for 2+ minutes.',
      hints: [
        'Check container logs with docker logs',
        'Inspect file permissions inside the container',
        'Review the Dockerfile or docker run command'
      ],
      successCriteria: [
        'Identified the root cause of the crash',
        'Container runs without restarting for 2+ minutes',
        'Documented the fix in a comment or file'
      ],
      timeLimit: 300, // 5 minutes
      difficulty: week <= 4 ? 'easy' : week <= 8 ? 'medium' : 'hard'
    },
    {
      id: 'docker-network-1',
      title: 'Multi-Container Communication',
      scenario: 'Your frontend container cannot connect to the backend API. Both are running but not communicating. The error is "Connection refused".',
      task: 'Fix container networking so frontend can reach backend API.',
      hints: [
        'Check if containers are on the same network',
        'Verify exposed ports match connection attempts',
        'Test connectivity with docker exec and curl'
      ],
      successCriteria: [
        'Created or used a Docker network',
        'Both containers connected to the network',
        'Frontend successfully calls backend API'
      ],
      timeLimit: 300,
      difficulty: week <= 4 ? 'medium' : week <= 8 ? 'medium' : 'hard'
    },
    // Kubernetes challenges
    {
      id: 'k8s-pod-failure-1',
      title: 'Pod CrashLoopBackOff',
      scenario: 'Your deployment shows pods in CrashLoopBackOff state. The application worked fine yesterday. Team reports no code changes.',
      task: 'Identify why pods are crashing and restore service.',
      hints: [
        'Check pod logs and events',
        'Review ConfigMaps and Secrets',
        'Check resource limits and requests'
      ],
      successCriteria: [
        'Found the root cause of crashes',
        'All pods running successfully',
        'Service is accessible'
      ],
      timeLimit: 300,
      difficulty: week <= 4 ? 'hard' : week <= 8 ? 'medium' : 'medium'
    },
    // Git challenges
    {
      id: 'git-merge-conflict-1',
      title: 'Urgent Merge Conflict',
      scenario: 'You need to merge feature branch into main, but there are conflicts. The release is scheduled in 10 minutes.',
      task: 'Resolve merge conflicts and complete the merge without breaking the build.',
      hints: [
        'Use git status to see conflicting files',
        'Look for conflict markers <<< === >>>',
        'Test the application after resolving'
      ],
      successCriteria: [
        'All merge conflicts resolved',
        'Code compiles/runs successfully',
        'Merge completed to main branch'
      ],
      timeLimit: 300,
      difficulty: week <= 4 ? 'easy' : week <= 8 ? 'medium' : 'hard'
    },
    // CI/CD challenges
    {
      id: 'cicd-pipeline-failure-1',
      title: 'Pipeline Blocking Deploy',
      scenario: 'The CI/CD pipeline failed at the test stage. The team is waiting to deploy. Build logs show "module not found" errors.',
      task: 'Fix the pipeline so tests pass and deployment can proceed.',
      hints: [
        'Check for missing dependencies',
        'Review pipeline configuration file',
        'Verify test environment setup'
      ],
      successCriteria: [
        'Identified the failing test',
        'Fixed the dependency issue',
        'Pipeline runs green end-to-end'
      ],
      timeLimit: 300,
      difficulty: week <= 4 ? 'medium' : week <= 8 ? 'medium' : 'hard'
    }
  ];

  return challenges[Math.floor(Math.random() * challenges.length)];
}
