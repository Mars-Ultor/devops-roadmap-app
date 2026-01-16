/* eslint-disable max-lines-per-function */
/**
 * Scenario Execution Page
 * Interactive troubleshooting simulation
 */

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, CheckCircle2, Lightbulb, ArrowLeft, BookOpen } from 'lucide-react';
import { getScenarioById } from '../data/productionScenarios';
import { useProductionScenario } from '../hooks/useProductionScenario';
import type { ProductionScenario, InvestigationStep, ResolutionStep } from '../types/scenarios';

type Phase = 'briefing' | 'investigation' | 'diagnosis' | 'resolution' | 'review';

export default function ScenarioExecution() {
  const { scenarioId } = useParams<{ scenarioId: string }>();
  const navigate = useNavigate();
  const {
    currentAttempt,
    startScenario,
    completeInvestigationStep,
    incrementHintsUsed,
    identifyRootCause,
    completeResolutionStep,
    completeScenario
  } = useProductionScenario();

  const [scenario, setScenario] = useState<ProductionScenario | null>(null);
  const [phase, setPhase] = useState<Phase>('briefing');
  const [selectedSteps, setSelectedSteps] = useState<Set<string>>(new Set());
  const [showHints, setShowHints] = useState<Map<string, number>>(new Map());
  const [rootCauseGuess, setRootCauseGuess] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState<string[]>(['', '', '']);
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    if (scenarioId) {
      const found = getScenarioById(scenarioId);
      if (found) {
        setScenario(found);
      }
    }
  }, [scenarioId]);

  useEffect(() => {
    if (currentAttempt && phase !== 'briefing') {
      const interval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - currentAttempt.startedAt.getTime()) / 1000);
        setElapsedTime(elapsed);
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [currentAttempt, phase]);

  const getPhaseIndicatorClassName = (phaseName: string, currentPhase: string, index: number): string => {
    const phases = ['briefing', 'investigation', 'diagnosis', 'resolution', 'review'];
    const currentPhaseIndex = phases.indexOf(currentPhase);

    if (phaseName === currentPhase) {
      return 'bg-blue-600 text-white';
    } else if (currentPhaseIndex > index) {
      return 'bg-green-900/30 text-green-400';
    } else {
      return 'bg-gray-800 text-gray-500';
    }
  };

  const getPhaseCircleClassName = (phaseName: string, currentPhase: string, index: number): string => {
    const phases = ['briefing', 'investigation', 'diagnosis', 'resolution', 'review'];
    const currentPhaseIndex = phases.indexOf(currentPhase);

    if (currentPhaseIndex > index) {
      return 'bg-green-600';
    } else if (phaseName === currentPhase) {
      return 'bg-white text-blue-600';
    } else {
      return 'bg-gray-700';
    }
  };

  const getPhaseCircleContent = (phaseName: string, currentPhase: string, index: number): string | number => {
    const phases = ['briefing', 'investigation', 'diagnosis', 'resolution', 'review'];
    const currentPhaseIndex = phases.indexOf(currentPhase);

    return currentPhaseIndex > index ? '✓' : index + 1;
  };

  const handleStart = async () => {
    if (scenario) {
      await startScenario(scenario);
      setPhase('investigation');
    }
  };

  const handleCompleteStep = (step: InvestigationStep) => {
    completeInvestigationStep(step.id);
    setSelectedSteps(prev => new Set(prev).add(step.id));
  };

  const handleShowHint = (stepId: string) => {
    const currentHintIndex = showHints.get(stepId) || 0;
    setShowHints(new Map(showHints).set(stepId, currentHintIndex + 1));
    incrementHintsUsed();
  };

  const handleDiagnosis = () => {
    if (scenario) {
      const correct = identifyRootCause(scenario.rootCause.id);
      if (correct) {
        setPhase('resolution');
      }
    }
  };

  const handleCompleteResolution = (step: ResolutionStep) => {
    completeResolutionStep(step.id);
    setSelectedSteps(prev => new Set(prev).add(step.id));
  };

  const handleFinish = async (success: boolean) => {
    const validLessons = lessonsLearned.filter(l => l.trim().length >= 20);
    await completeScenario(success, validLessons);
    setPhase('review');
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!scenario) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">
        Loading scenario...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/scenarios')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Scenarios
          </button>

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{scenario.title}</h1>
              <div className="flex items-center gap-4 text-sm text-gray-400">
                <span className="capitalize">{scenario.difficulty}</span>
                <span>•</span>
                <span>{scenario.estimatedTimeToResolve} min estimated</span>
                {currentAttempt && (
                  <>
                    <span>•</span>
                    <span className="text-white font-semibold">{formatTime(elapsedTime)}</span>
                  </>
                )}
              </div>
            </div>
            {currentAttempt && (
              <div className="text-right">
                <div className="text-sm text-gray-400">Hints Used</div>
                <div className="text-2xl font-bold text-yellow-400">{currentAttempt.hintsUsed}</div>
              </div>
            )}
          </div>
        </div>

        {/* Phase Indicator */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto">
          {['briefing', 'investigation', 'diagnosis', 'resolution', 'review'].map((p, index) => (
            <div
              key={p}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${getPhaseIndicatorClassName(p, phase, index)}`}
            >
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${getPhaseCircleClassName(p, phase, index)}`}>
                {getPhaseCircleContent(p, phase, index)}
              </div>
              <span className="text-sm font-medium capitalize whitespace-nowrap">{p}</span>
            </div>
          ))}
        </div>

        {/* Briefing Phase */}
        {phase === 'briefing' && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <div className="mb-6">
              <div className="flex items-center gap-3 mb-4">
                <AlertTriangle className="w-8 h-8 text-red-400" />
                <h2 className="text-2xl font-bold">Incident Briefing</h2>
              </div>
              <p className="text-gray-300 text-lg mb-4">{scenario.description}</p>
              
              <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mb-6">
                <div className="font-semibold text-red-400 mb-2">Business Impact:</div>
                <p className="text-gray-300">{scenario.businessImpact}</p>
                {scenario.affectedUsers && (
                  <div className="mt-2 text-sm text-gray-400">
                    Affected Users: <span className="text-white font-semibold">{scenario.affectedUsers.toLocaleString()}</span>
                  </div>
                )}
                {scenario.revenueImpact && (
                  <div className="mt-1 text-sm text-gray-400">
                    Revenue Impact: <span className="text-red-400 font-semibold">${scenario.revenueImpact}/min</span>
                  </div>
                )}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                Initial Symptoms
              </h3>
              <div className="space-y-3">
                {scenario.symptoms.map((symptom) => (
                  <div key={`${symptom.type}-${symptom.description}`} className="bg-gray-900/50 border border-gray-700 rounded p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                          symptom.severity === 'critical' ? 'bg-red-900/50 text-red-400' :
                          symptom.severity === 'error' ? 'bg-orange-900/50 text-orange-400' :
                          symptom.severity === 'warning' ? 'bg-yellow-900/50 text-yellow-400' :
                          'bg-blue-900/50 text-blue-400'
                        }`}>
                          {symptom.severity.toUpperCase()}
                        </span>
                        <span className="text-xs text-gray-400">{symptom.type}</span>
                      </div>
                      {symptom.source && (
                        <span className="text-xs text-gray-500">{symptom.source}</span>
                      )}
                    </div>
                    <p className="text-gray-300">{symptom.description}</p>
                    {symptom.timestamp && (
                      <div className="text-xs text-gray-500 mt-2">{symptom.timestamp}</div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                Learning Objectives
              </h3>
              <ul className="space-y-2">
                {scenario.learningObjectives.map((obj) => (
                  <li key={obj} className="flex items-start gap-2 text-gray-300">
                    <span className="text-blue-400">→</span>
                    {obj}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleStart}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold text-lg transition-colors"
            >
              Start Investigation
            </button>
          </div>
        )}

        {/* Investigation Phase */}
        {phase === 'investigation' && (
          <div className="space-y-6">
            <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
              <h2 className="text-xl font-bold mb-2">Investigation Phase</h2>
              <p className="text-gray-300">
                Complete investigation steps to gather information. Use hints wisely - each one costs points!
              </p>
            </div>

            <div className="space-y-4">
              {scenario.investigationSteps.map((step) => {
                const completed = selectedSteps.has(step.id);
                const hintIndex = showHints.get(step.id) || 0;

                return (
                  <div
                    key={step.id}
                    className={`bg-gray-800 border rounded-lg p-6 ${
                      completed ? 'border-green-700' : 'border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{step.description}</h3>
                        {step.command && (
                          <div className="bg-gray-900 border border-gray-700 rounded p-3 mb-3">
                            <div className="text-xs text-gray-400 mb-1">Suggested Command:</div>
                            <code className="text-green-400 text-sm">{step.command}</code>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-gray-400">
                          <Clock className="w-4 h-4" />
                          <span>Est. {Math.floor(step.timeEstimate / 60)} min</span>
                        </div>
                      </div>
                      {completed && (
                        <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                      )}
                    </div>

                    {!completed && step.hints && hintIndex < step.hints.length && (
                      <button
                        onClick={() => handleShowHint(step.id)}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-900/30 border border-yellow-700 text-yellow-400 rounded-lg hover:bg-yellow-900/50 transition-colors mb-3"
                      >
                        <Lightbulb className="w-4 h-4" />
                        Show Hint ({hintIndex + 1}/{step.hints.length})
                      </button>
                    )}

                    {hintIndex > 0 && step.hints && (
                      <div className="bg-yellow-900/20 border border-yellow-700 rounded p-3 mb-3">
                        <div className="text-xs text-yellow-400 font-semibold mb-1">Hint:</div>
                        <p className="text-sm text-gray-300">{step.hints[hintIndex - 1]}</p>
                      </div>
                    )}

                    {!completed && (
                      <button
                        onClick={() => handleCompleteStep(step)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                      >
                        Mark Complete
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setPhase('diagnosis')}
              disabled={selectedSteps.size < scenario.investigationSteps.length}
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              Proceed to Diagnosis ({selectedSteps.size}/{scenario.investigationSteps.length} steps completed)
            </button>
          </div>
        )}

        {/* Diagnosis Phase */}
        {phase === 'diagnosis' && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Root Cause Analysis</h2>
            <p className="text-gray-300 mb-6">
              Based on your investigation, what is the root cause of this incident?
            </p>

            <textarea
              value={rootCauseGuess}
              onChange={(e) => setRootCauseGuess(e.target.value)}
              placeholder="Describe the root cause you've identified..."
              className="w-full h-32 bg-gray-900 border border-gray-700 rounded-lg p-4 text-white placeholder-gray-500 mb-4"
            />

            <button
              onClick={handleDiagnosis}
              disabled={rootCauseGuess.length < 20}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              Submit Diagnosis
            </button>
          </div>
        )}

        {/* Resolution Phase */}
        {phase === 'resolution' && (
          <div className="space-y-6">
            <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <CheckCircle2 className="w-6 h-6 text-green-400" />
                <h2 className="text-xl font-bold">Root Cause Identified!</h2>
              </div>
              <p className="text-gray-300">{scenario.rootCause.description}</p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Resolution Steps</h3>
              <div className="space-y-4">
                {scenario.resolutionSteps.map((step, index) => {
                  const completed = selectedSteps.has(step.id);

                  return (
                    <div
                      key={step.id}
                      className={`bg-gray-800 border rounded-lg p-6 ${
                        completed ? 'border-green-700' : 'border-gray-700'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-semibold text-gray-400">Step {index + 1}</span>
                            {!step.canRollback && (
                              <span className="px-2 py-0.5 bg-red-900/30 border border-red-700 text-red-400 text-xs rounded">
                                NO ROLLBACK
                              </span>
                            )}
                          </div>
                          <h4 className="text-lg font-semibold text-white mb-2">{step.description}</h4>
                          {step.command && (
                            <div className="bg-gray-900 border border-gray-700 rounded p-3 mb-3">
                              <code className="text-green-400 text-sm">{step.command}</code>
                            </div>
                          )}
                          {step.validation && (
                            <div className="text-sm text-gray-400 mb-2">
                              <span className="font-semibold">Validation:</span> {step.validation}
                            </div>
                          )}
                        </div>
                        {completed && (
                          <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0" />
                        )}
                      </div>

                      {!completed && (
                        <button
                          onClick={() => handleCompleteResolution(step)}
                          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                        >
                          Execute & Verify
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
              <h3 className="text-lg font-semibold mb-4">Lessons Learned (minimum 20 characters each)</h3>
              {lessonsLearned.map((lesson, index) => (
                <div key={lesson || `lesson-${index}`} className="mb-4">
                  <label className="block text-sm text-gray-400 mb-2">Lesson {index + 1}</label>
                  <textarea
                    value={lesson}
                    onChange={(e) => {
                      const newLessons = [...lessonsLearned];
                      newLessons[index] = e.target.value;
                      setLessonsLearned(newLessons);
                    }}
                    placeholder="What did you learn from this incident?"
                    className="w-full h-20 bg-gray-900 border border-gray-700 rounded-lg p-3 text-white placeholder-gray-500"
                  />
                  <div className="text-xs text-gray-500 mt-1">
                    {lesson.length}/20 characters
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => handleFinish(true)}
              disabled={
                selectedSteps.size < scenario.investigationSteps.length + scenario.resolutionSteps.length ||
                lessonsLearned.filter(l => l.trim().length >= 20).length < 3
              }
              className="w-full px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
            >
              Complete Scenario
            </button>
          </div>
        )}

        {/* Review Phase */}
        {phase === 'review' && currentAttempt && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
            <div className="text-center mb-8">
              <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
              <h2 className="text-3xl font-bold mb-2">Scenario Complete!</h2>
              <p className="text-gray-400">Your performance has been recorded</p>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                <div className="text-gray-400 text-sm mb-1">Final Score</div>
                <div className="text-3xl font-bold text-yellow-400">{currentAttempt.score}</div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                <div className="text-gray-400 text-sm mb-1">Efficiency</div>
                <div className="text-3xl font-bold text-blue-400">{currentAttempt.efficiency}%</div>
              </div>
              <div className="bg-gray-900/50 rounded-lg p-4 text-center">
                <div className="text-gray-400 text-sm mb-1">Accuracy</div>
                <div className="text-3xl font-bold text-green-400">{currentAttempt.accuracyScore}%</div>
              </div>
            </div>

            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-4">Prevention Measures</h3>
              <ul className="space-y-2">
                {scenario.preventionMeasures.map((measure) => (
                  <li key={measure} className="flex items-start gap-2 text-gray-300">
                    <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                    {measure}
                  </li>
                ))}
              </ul>
            </div>

            <button
              onClick={() => navigate('/scenarios')}
              className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
            >
              Return to Scenarios
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
