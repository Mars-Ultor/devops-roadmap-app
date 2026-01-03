/**
 * DailyChallenge Page - Scenario Challenge System
 * Quick 5-10 minute scenario-based skill application
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Play,
  CheckCircle,
  XCircle,
  Circle,
  Target,
  Lightbulb,
  Terminal,
  Code,
  Globe,
  AlertTriangle,
  BookOpen
} from 'lucide-react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { ScenarioChallengeService } from '../services/scenarioChallenge';
import type { ChallengeScenario, ChallengeAttempt } from '../types/scenarios';
import { useAuthStore } from '../store/authStore';
import { TimerCountdown } from '../components/stress/TimerCountdown';

export default function DailyChallenge() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [scenario, setScenario] = useState<ChallengeScenario | null>(null);
  const [attempt, setAttempt] = useState<ChallengeAttempt | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [completedObjectives, setCompletedObjectives] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState('');
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [showHints, setShowHints] = useState(false);
  const [availableHints, setAvailableHints] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const challengeService = ScenarioChallengeService.getInstance();

  useEffect(() => {
    console.log('DailyChallenge: user =', user);
    if (!user) {
      console.log('DailyChallenge: No user, would redirect to login');
      // navigate('/login');
      // return;
    }

    // Get user's current week from their profile
    const userCurrentWeek = user?.currentWeek || 1;

    // Get daily challenge for user based on their unlocked week
    const dailyScenario = challengeService.getDailyChallenge(user?.uid || 'test-user', userCurrentWeek);

    if (dailyScenario) {
      setScenario(dailyScenario);
    } else {
      // If no unlocked challenges available, show null (don't show locked challenges)
      setScenario(null);
    }

    setLoading(false);
  }, [user, navigate, challengeService]);

  const startChallenge = () => {
    if (!scenario || !user) return;

    const newAttempt = challengeService.startScenarioAttempt(user.uid, scenario.id);
    if (newAttempt) {
      setAttempt(newAttempt);
      setIsActive(true);
    }
  };

  const completeObjective = (objectiveId: string) => {
    if (!completedObjectives.includes(objectiveId)) {
      setCompletedObjectives([...completedObjectives, objectiveId]);
    }
  };

  const executeCommand = () => {
    if (!currentCommand.trim() || !attempt) return;

    // Simulate command execution (in real implementation, this would connect to actual terminal)
    const success = Math.random() > 0.3; // 70% success rate for demo

    challengeService.recordCommand(
      attempt.attemptId,
      currentCommand,
      success,
      success ? 'Command executed successfully' : undefined,
      success ? undefined : 'Command failed',
      'terminal'
    );

    setCommandHistory([...commandHistory, currentCommand]);
    setCurrentCommand('');
  };

  const handleUseHint = (hintId: string) => {
    if (!attempt) return;

    const penalty = challengeService.useHint(attempt.attemptId, hintId);
    setAvailableHints(availableHints.filter(id => id !== hintId));

    // Apply penalty to score (would be handled by service)
    console.log(`Hint used with ${penalty}x penalty`);
  };

  const completeChallenge = async (passed: boolean) => {
    if (!attempt || !user) return;

    const finalAttempt = challengeService.completeScenarioAttempt(
      attempt.attemptId,
      completedObjectives,
      passed
    );

    if (finalAttempt) {
      setAttempt(finalAttempt);
      setIsActive(false);

      // Save completion to Firestore so ContentGate recognizes it
      try {
        const today = new Date().toISOString().split('T')[0];
        const drillRef = doc(db, 'userProgress', user.uid, 'dailyDrills', today);
        
        await setDoc(drillRef, {
          completed: true,
          completedAt: new Date(),
          score: finalAttempt.score || 0,
          passed: passed,
          timeTaken: finalAttempt.timeSpent || 0,
          scenarioId: scenario?.id || 'unknown',
          updatedAt: new Date()
        });

        console.log('Daily drill completion saved to Firestore');
      } catch (error) {
        console.error('Error saving drill completion:', error);
      }
    }
  };

  const getAvailableHintsList = () => {
    if (!attempt || !scenario) return [];

    const hintIds = challengeService.getAvailableHints(attempt.attemptId);
    return scenario.hints.filter(hint => hintIds.includes(hint.id));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading daily challenge...</div>
      </div>
    );
  }

  if (!scenario) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center text-white">
          <AlertTriangle className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
          <h2 className="text-2xl font-bold mb-2">No Challenge Available</h2>
          <p className="text-gray-400">Check back tomorrow for your daily challenge!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 border-b border-slate-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Target className="w-6 h-6 text-blue-400" />
              Daily Challenge
            </h1>
            <p className="text-gray-400">{scenario.title}</p>
          </div>

          <div className="flex items-center gap-4">
            {isActive && attempt && (
              <TimerCountdown
                sessionId={attempt.attemptId}
                initialTimeSeconds={scenario.timeLimitSeconds}
                onTimeUp={() => completeChallenge(false)}
                className="text-lg"
              />
            )}

            <div className="text-right">
              <div className="text-sm text-gray-400">Difficulty</div>
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-2 h-2 rounded-full ${
                      i < scenario.estimatedDifficulty
                        ? 'bg-yellow-400'
                        : 'bg-gray-600'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Challenge Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Scenario Description */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Scenario
              </h2>
              <p className="text-gray-300 leading-relaxed">{scenario.scenario}</p>

              {!isActive && (
                <button
                  onClick={startChallenge}
                  className="mt-4 bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                  <Play className="w-4 h-4" />
                  Start Challenge
                </button>
              )}
            </div>

            {/* Objectives */}
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-green-400" />
                Objectives
              </h3>
              <div className="space-y-3">
                {scenario.objectives.map((objective, index) => {
                  const objectiveId = `obj_${index}`;
                  const isCompleted = completedObjectives.includes(objectiveId);

                  return (
                    <div
                      key={index}
                      className={`flex items-start gap-3 p-3 rounded border ${
                        isCompleted
                          ? 'bg-green-900/20 border-green-500'
                          : 'bg-slate-700/50 border-slate-600'
                      }`}
                    >
                      <button
                        onClick={() => completeObjective(objectiveId)}
                        disabled={!isActive}
                        className={`mt-0.5 ${
                          isCompleted
                            ? 'text-green-400'
                            : 'text-gray-400 hover:text-green-400'
                        }`}
                      >
                        {isCompleted ? (
                          <CheckCircle className="w-5 h-5" />
                        ) : (
                          <Circle className="w-5 h-5" />
                        )}
                      </button>
                      <span className={isCompleted ? 'line-through text-gray-400' : ''}>
                        {objective}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Terminal/Command Interface */}
            {isActive && (
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Terminal className="w-5 h-5 text-blue-400" />
                  Command Terminal
                </h3>

                {/* Command History */}
                <div className="bg-black rounded p-4 mb-4 h-48 overflow-y-auto font-mono text-sm">
                  {commandHistory.length === 0 ? (
                    <div className="text-gray-500">No commands executed yet...</div>
                  ) : (
                    commandHistory.map((cmd, index) => (
                      <div key={index} className="mb-1">
                        <span className="text-green-400">$</span> {cmd}
                      </div>
                    ))
                  )}
                </div>

                {/* Command Input */}
                <div className="flex gap-2">
                  <span className="text-green-400 font-mono">$</span>
                  <input
                    type="text"
                    value={currentCommand}
                    onChange={(e) => setCurrentCommand(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && executeCommand()}
                    placeholder="Enter command..."
                    className="flex-1 bg-slate-700 border border-slate-600 rounded px-3 py-2 font-mono text-sm focus:outline-none focus:border-blue-500"
                    disabled={!isActive}
                  />
                  <button
                    onClick={executeCommand}
                    disabled={!currentCommand.trim() || !isActive}
                    className="bg-blue-600 hover:bg-blue-500 disabled:bg-gray-600 px-4 py-2 rounded font-semibold transition-colors"
                  >
                    Execute
                  </button>
                </div>
              </div>
            )}

            {/* Completion Actions */}
            {isActive && (
              <div className="flex gap-4">
                <button
                  onClick={() => completeChallenge(true)}
                  className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                  <CheckCircle className="w-5 h-5" />
                  Complete Challenge
                </button>
                <button
                  onClick={() => completeChallenge(false)}
                  className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  Abandon Challenge
                </button>
              </div>
            )}

            {/* Results */}
            {attempt && !isActive && (
              <div className={`p-6 rounded-lg border ${
                attempt.passed
                  ? 'bg-green-900/20 border-green-500'
                  : 'bg-red-900/20 border-red-500'
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  {attempt.passed ? (
                    <CheckCircle className="w-8 h-8 text-green-400" />
                  ) : (
                    <XCircle className="w-8 h-8 text-red-400" />
                  )}
                  <div>
                    <h3 className="text-xl font-bold">
                      {attempt.passed ? 'Challenge Completed!' : 'Challenge Incomplete'}
                    </h3>
                    <p className="text-gray-400">Score: {attempt.score}/100</p>
                  </div>
                </div>

                <p className="text-gray-300 mb-4">{attempt.feedback}</p>

                <div className="flex gap-4">
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="bg-blue-600 hover:bg-blue-500 px-4 py-2 rounded font-semibold transition-colors"
                  >
                    Back to Dashboard
                  </button>
                  <button
                    onClick={() => window.location.reload()}
                    className="bg-gray-600 hover:bg-gray-500 px-4 py-2 rounded font-semibold transition-colors"
                  >
                    Try Again
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Hints */}
            {isActive && (
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <button
                  onClick={() => setShowHints(!showHints)}
                  className="flex items-center gap-2 w-full text-left font-semibold mb-2"
                >
                  <Lightbulb className="w-5 h-5 text-yellow-400" />
                  Hints ({getAvailableHintsList().length} available)
                </button>

                {showHints && (
                  <div className="space-y-2">
                    {getAvailableHintsList().map((hint) => (
                      <div key={hint.id} className="bg-slate-700 p-3 rounded border border-slate-600">
                        <p className="text-sm text-gray-300 mb-2">{hint.content}</p>
                        <button
                          onClick={() => handleUseHint(hint.id)}
                          className="text-xs bg-yellow-600 hover:bg-yellow-500 px-2 py-1 rounded transition-colors"
                        >
                          Use Hint (-{Math.round(hint.penalty * 10)}% score)
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Resources */}
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                <Globe className="w-5 h-5 text-blue-400" />
                Resources
              </h3>
              <div className="space-y-2">
                {scenario.resources
                  .filter(resource => resource.available)
                  .map((resource, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      {resource.type === 'documentation' && <BookOpen className="w-4 h-4 text-blue-400" />}
                      {resource.type === 'tool' && <Code className="w-4 h-4 text-green-400" />}
                      {resource.type === 'command' && <Terminal className="w-4 h-4 text-purple-400" />}
                      <span>{resource.title}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Tags */}
            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <h3 className="font-semibold mb-3">Skills Covered</h3>
              <div className="flex flex-wrap gap-2">
                {scenario.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-slate-700 text-xs rounded-full text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}