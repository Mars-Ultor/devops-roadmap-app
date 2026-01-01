/**
 * WeeklyBossBattle Page - Scenario Challenge System
 * Comprehensive 2-hour scenario mastery challenges
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sword,
  Shield,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  TrendingUp,
  Award,
  BookOpen,
  Terminal,
  Users,
  Zap
} from 'lucide-react';
import { ScenarioChallengeService } from '../services/scenarioChallenge';
import { getScenariosByType } from '../data/scenarios';
import type { ChallengeScenario, ChallengeAttempt } from '../types/scenarios';
import { useAuthStore } from '../store/authStore';
import TimerCountdown from '../components/stress/TimerCountdown';

export default function WeeklyBossBattle() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [scenarios, setScenarios] = useState<ChallengeScenario[]>([]);
  const [selectedScenario, setSelectedScenario] = useState<ChallengeScenario | null>(null);
  const [attempt, setAttempt] = useState<ChallengeAttempt | null>(null);
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<'selection' | 'briefing' | 'execution' | 'debrief'>('selection');
  const [completedObjectives, setCompletedObjectives] = useState<string[]>([]);
  const [investigationNotes, setInvestigationNotes] = useState('');
  const [resolutionSteps, setResolutionSteps] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const challengeService = ScenarioChallengeService.getInstance();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    // Load weekly boss battle scenarios
    const weeklyScenarios = getScenariosByType('weekly');
    setScenarios(weeklyScenarios);
    setLoading(false);
  }, [user, navigate]);

  const selectScenario = (scenario: ChallengeScenario) => {
    setSelectedScenario(scenario);
    setCurrentPhase('briefing');
  };

  const startBattle = () => {
    if (!selectedScenario || !user) return;

    const newAttempt = challengeService.startScenarioAttempt(user.uid, selectedScenario.id);
    if (newAttempt) {
      setAttempt(newAttempt);
      setIsActive(true);
      setCurrentPhase('execution');
    }
  };

  const completeObjective = (objectiveId: string) => {
    if (!completedObjectives.includes(objectiveId)) {
      setCompletedObjectives([...completedObjectives, objectiveId]);
    }
  };

  const addResolutionStep = (step: string) => {
    setResolutionSteps([...resolutionSteps, step]);
  };

  const completeBattle = (passed: boolean) => {
    if (!attempt) return;

    const finalAttempt = challengeService.completeScenarioAttempt(
      attempt.attemptId,
      completedObjectives,
      passed
    );

    if (finalAttempt) {
      setAttempt(finalAttempt);
      setIsActive(false);
      setCurrentPhase('debrief');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white">Loading weekly boss battle...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-900 to-orange-900 border-b border-red-700 p-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-3">
              <Sword className="w-8 h-8 text-yellow-400" />
              Weekly Boss Battle
            </h1>
            <p className="text-red-200">2-hour comprehensive scenario mastery</p>
          </div>

          {isActive && attempt && selectedScenario && (
            <div className="flex items-center gap-4">
              <TimerCountdown
                sessionId={attempt.attemptId}
                initialTimeSeconds={selectedScenario.timeLimitSeconds}
                onTimeUp={() => completeBattle(false)}
                className="text-xl font-bold"
              />
              <div className="text-right">
                <div className="text-sm text-red-200">Boss Level</div>
                <div className="text-2xl font-bold text-yellow-400">
                  {selectedScenario.estimatedDifficulty}/5
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6">
        {/* Scenario Selection Phase */}
        {currentPhase === 'selection' && (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Choose Your Battle</h2>
              <p className="text-gray-400">Select a boss battle scenario to conquer</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {scenarios.map((scenario) => (
                <div
                  key={scenario.id}
                  className="bg-slate-800 rounded-lg p-6 border-2 border-slate-700 hover:border-red-500 transition-colors cursor-pointer"
                  onClick={() => selectScenario(scenario)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-red-400">{scenario.title}</h3>
                      <p className="text-gray-400 text-sm">{scenario.description}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: 5 }, (_, i) => (
                        <div
                          key={i}
                          className={`w-3 h-3 rounded-full ${
                            i < scenario.estimatedDifficulty
                              ? 'bg-red-400'
                              : 'bg-gray-600'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span>{Math.round(scenario.timeLimitSeconds / 3600 * 10) / 10} hours</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Target className="w-4 h-4 text-green-400" />
                      <span>{scenario.objectives.length} objectives</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-1">
                    {scenario.tags.slice(0, 3).map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-red-900/50 text-red-200 text-xs rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Briefing Phase */}
        {currentPhase === 'briefing' && selectedScenario && (
          <div className="space-y-6">
            <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <Shield className="w-8 h-8 text-blue-400" />
                <div>
                  <h2 className="text-2xl font-bold">Mission Briefing</h2>
                  <p className="text-gray-400">Review the scenario and prepare your strategy</p>
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-red-400">{selectedScenario.title}</h3>
                  <p className="text-gray-300 mb-4">{selectedScenario.scenario}</p>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-blue-400" />
                      <span>Time Limit: {Math.round(selectedScenario.timeLimitSeconds / 60)} minutes</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-green-400" />
                      <span>Objectives: {selectedScenario.objectives.length}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-yellow-400" />
                      <span>Difficulty: {selectedScenario.estimatedDifficulty}/5</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Business Impact</h4>
                  <div className="bg-red-900/20 border border-red-500 rounded p-3 mb-4">
                    <p className="text-red-200 text-sm">
                      <strong>CRITICAL:</strong> This scenario represents a production incident
                      with significant business impact. Your response time and accuracy matter.
                    </p>
                  </div>

                  <h4 className="font-semibold mb-2">Prerequisites</h4>
                  <div className="space-y-1">
                    {selectedScenario.prerequisites?.map((prereq, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span>{prereq}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => setCurrentPhase('selection')}
                  className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded font-semibold transition-colors"
                >
                  Back to Selection
                </button>
                <button
                  onClick={startBattle}
                  className="bg-red-600 hover:bg-red-500 px-6 py-2 rounded font-semibold flex items-center gap-2 transition-colors"
                >
                  <Sword className="w-4 h-4" />
                  Start Battle
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Execution Phase */}
        {currentPhase === 'execution' && selectedScenario && attempt && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Execution Area */}
            <div className="lg:col-span-2 space-y-6">
              {/* Current Scenario Status */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-xl font-bold mb-4 text-red-400">Battle Status</h3>
                <p className="text-gray-300 mb-4">{selectedScenario.scenario}</p>

                {/* Investigation Notes */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Investigation Notes</label>
                  <textarea
                    value={investigationNotes}
                    onChange={(e) => setInvestigationNotes(e.target.value)}
                    placeholder="Document your investigation findings..."
                    className="w-full bg-slate-700 border border-slate-600 rounded p-3 text-sm focus:outline-none focus:border-blue-500"
                    rows={4}
                  />
                </div>

                {/* Resolution Steps */}
                <div className="mb-4">
                  <label className="block text-sm font-medium mb-2">Resolution Steps</label>
                  <div className="space-y-2">
                    {resolutionSteps.map((step, index) => (
                      <div key={index} className="flex items-center gap-2 bg-slate-700 p-2 rounded">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-sm">{step}</span>
                      </div>
                    ))}
                    <input
                      type="text"
                      placeholder="Add resolution step..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                          addResolutionStep(e.currentTarget.value.trim());
                          e.currentTarget.value = '';
                        }
                      }}
                      className="w-full bg-slate-700 border border-slate-600 rounded px-3 py-2 text-sm focus:outline-none focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Objectives */}
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-400" />
                  Battle Objectives ({completedObjectives.length}/{selectedScenario.objectives.length})
                </h3>
                <div className="space-y-3">
                  {selectedScenario.objectives.map((objective, index) => {
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
                          className={`mt-0.5 ${
                            isCompleted
                              ? 'text-green-400'
                              : 'text-gray-400 hover:text-green-400'
                          }`}
                        >
                          {isCompleted ? (
                            <CheckCircle className="w-5 h-5" />
                          ) : (
                            <div className="w-5 h-5 border-2 border-current rounded" />
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

              {/* Battle Actions */}
              <div className="flex gap-4">
                <button
                  onClick={() => completeBattle(true)}
                  className="bg-green-600 hover:bg-green-500 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                  <Award className="w-5 h-5" />
                  Complete Battle
                </button>
                <button
                  onClick={() => completeBattle(false)}
                  className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded-lg font-semibold flex items-center gap-2 transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                  Retreat
                </button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Progress Metrics */}
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-blue-400" />
                  Battle Metrics
                </h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Objectives:</span>
                    <span>{completedObjectives.length}/{selectedScenario.objectives.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Investigation:</span>
                    <span>{investigationNotes.length} chars</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Resolution Steps:</span>
                    <span>{resolutionSteps.length}</span>
                  </div>
                </div>
              </div>

              {/* Resources */}
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-blue-400" />
                  Available Resources
                </h4>
                <div className="space-y-2">
                  {selectedScenario.resources
                    .filter(resource => resource.available)
                    .map((resource, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        {resource.type === 'documentation' && <BookOpen className="w-4 h-4 text-blue-400" />}
                        {resource.type === 'tool' && <Terminal className="w-4 h-4 text-green-400" />}
                        <span>{resource.title}</span>
                      </div>
                    ))}
                </div>
              </div>

              {/* Team Communication (Simulated) */}
              <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-400" />
                  Team Communication
                </h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <div>• SRE Team: "Database CPU at 95%"</div>
                  <div>• Dev Team: "Users reporting timeouts"</div>
                  <div>• Management: "What's the ETA?"</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Debrief Phase */}
        {currentPhase === 'debrief' && attempt && selectedScenario && (
          <div className="space-y-6">
            <div className={`p-8 rounded-lg border-2 ${
              attempt.passed
                ? 'bg-green-900/20 border-green-500'
                : 'bg-red-900/20 border-red-500'
            }`}>
              <div className="text-center mb-6">
                {attempt.passed ? (
                  <Award className="w-16 h-16 mx-auto mb-4 text-yellow-400" />
                ) : (
                  <XCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
                )}
                <h2 className="text-3xl font-bold mb-2">
                  {attempt.passed ? 'Boss Defeated!' : 'Battle Lost'}
                </h2>
                <p className="text-xl text-gray-400">Score: {attempt.score}/100</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400">
                    {Math.round(attempt.timeSpentSeconds / 60)}m
                  </div>
                  <div className="text-sm text-gray-400">Time Spent</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400">
                    {completedObjectives.length}
                  </div>
                  <div className="text-sm text-gray-400">Objectives Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-400">
                    {attempt.hintsUsed.length}
                  </div>
                  <div className="text-sm text-gray-400">Hints Used</div>
                </div>
              </div>

              <div className="bg-slate-800/50 p-4 rounded mb-6">
                <h3 className="font-semibold mb-2">Battle Feedback</h3>
                <p className="text-gray-300">{attempt.feedback}</p>
              </div>

              <div className="flex gap-4 justify-center">
                <button
                  onClick={() => navigate('/dashboard')}
                  className="bg-blue-600 hover:bg-blue-500 px-6 py-2 rounded font-semibold transition-colors"
                >
                  Back to Dashboard
                </button>
                <button
                  onClick={() => window.location.reload()}
                  className="bg-gray-600 hover:bg-gray-500 px-6 py-2 rounded font-semibold transition-colors"
                >
                  Fight Again
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}