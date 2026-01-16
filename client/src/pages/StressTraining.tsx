/* eslint-disable max-lines-per-function */
/**
 * Stress Training Page
 * Progressive stress scenario training
 */

import { useState, useEffect } from 'react';
import { Zap, TrendingUp, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStressTraining } from '../hooks/useStressTraining';
import { StressScenarioCard } from '../components/training/StressScenarioCard';
import { StressSessionPanel } from '../components/training/StressSessionPanel';
import { StressMetricsDashboard } from '../components/training/StressMetricsDashboard';
import { STRESS_SCENARIOS, getScenarioByStressLevel } from '../data/stressScenarios';
import type { StressScenario } from '../types/training';

type ViewMode = 'scenarios' | 'session' | 'metrics';
type FilterLevel = 'all' | 'low' | 'medium' | 'high' | 'extreme';

export default function StressTraining() {
  const {
    currentSession,
    stressMetrics,
    loading,
    error,
    startSession,
    completeSession,
    canAttemptStressLevel
  } = useStressTraining();

  const [viewMode, setViewMode] = useState<ViewMode>('scenarios');
  const [selectedScenario, setSelectedScenario] = useState<StressScenario | null>(null);
  const [filterLevel, setFilterLevel] = useState<FilterLevel>('all');

  useEffect(() => {
    if (currentSession && !currentSession.completedAt) {
      setViewMode('session');
    } else if (currentSession?.completedAt) {
      setViewMode('scenarios');
    }
  }, [currentSession]);

  const handleScenarioSelect = (scenario: StressScenario) => {
    const levelCheck = scenario.stressLevel as 'low' | 'medium' | 'high' | 'extreme';
    if (!canAttemptStressLevel(levelCheck)) return;
    setSelectedScenario(scenario);
  };

  const handleStartSession = async () => {
    if (!selectedScenario) return;
    await startSession(selectedScenario);
    setSelectedScenario(null);
  };

  const handleCompleteSession = async (success: boolean) => {
    await completeSession(success);
    setViewMode('scenarios');
  };

  const filteredScenarios = filterLevel === 'all'
    ? STRESS_SCENARIOS
    : getScenarioByStressLevel(filterLevel);

  const stressLevels: FilterLevel[] = ['all', 'low', 'medium', 'high', 'extreme'];

  if (loading && !currentSession) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading stress training...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <Link
            to="/battle-drills"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Battle Drills
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold mb-2 flex items-center gap-3">
                <Zap className="w-10 h-10 text-yellow-400" />
                Stress Training
              </h1>
              <p className="text-gray-400">
                Build resilience through progressive pressure scenarios
              </p>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-gray-800 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('scenarios')}
                className={`px-4 py-2 rounded transition-colors ${
                  viewMode === 'scenarios'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                Scenarios
              </button>
              <button
                onClick={() => setViewMode('metrics')}
                className={`px-4 py-2 rounded transition-colors flex items-center gap-2 ${
                  viewMode === 'metrics'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                <TrendingUp className="w-4 h-4" />
                Analytics
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-900/20 border border-red-700 rounded-lg text-red-400">
            {error}
          </div>
        )}

        {/* Scenarios View */}
        {viewMode === 'scenarios' && (
          <div>
            {/* Filters */}
            <div className="mb-6 flex gap-2">
              {stressLevels.map((level) => (
                <button
                  key={level}
                  onClick={() => setFilterLevel(level)}
                  className={`px-4 py-2 rounded-lg transition-colors capitalize ${
                    filterLevel === level
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:text-white'
                  }`}
                >
                  {level === 'all' ? 'All Levels' : `${level} Stress`}
                </button>
              ))}
            </div>

            {/* Scenario Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredScenarios.map((scenario) => {
                const levelCheck = scenario.stressLevel as 'low' | 'medium' | 'high' | 'extreme';
                return (
                  <StressScenarioCard
                    key={scenario.id}
                    scenario={scenario}
                    onSelect={() => handleScenarioSelect(scenario)}
                    locked={!canAttemptStressLevel(levelCheck)}
                    selected={selectedScenario?.id === scenario.id}
                  />
                );
              })}
            </div>

            {/* Start Session Modal */}
            {selectedScenario && (
              <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
                <div className="bg-gray-800 rounded-lg p-6 max-w-2xl w-full border border-gray-700">
                  <h2 className="text-2xl font-bold mb-4">Start Stress Training?</h2>
                  <p className="text-gray-300 mb-6">
                    You're about to begin <span className="font-semibold text-white">{selectedScenario.title}</span>.
                    This is a <span className="font-semibold capitalize">{String(selectedScenario.stressLevel)}</span> stress scenario.
                  </p>

                  <div className="bg-gray-900/50 rounded-lg p-4 mb-6">
                    <h3 className="text-sm font-semibold text-gray-400 mb-3">You will face:</h3>
                    <ul className="space-y-2">
                      {selectedScenario.conditions.map((condition) => (
                        <li key={condition.description} className="text-sm text-gray-300 flex items-start gap-2">
                          <span className="text-yellow-400">▸</span>
                          {condition.description}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={handleStartSession}
                      className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg font-semibold transition-colors"
                    >
                      Start Session
                    </button>
                    <button
                      onClick={() => setSelectedScenario(null)}
                      className="flex-1 px-6 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg font-semibold transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Session View */}
        {viewMode === 'session' && currentSession && !currentSession.completedAt && (
          <div>
            <StressSessionPanel session={currentSession} />

            {/* Session Controls */}
            <div className="mt-6 flex gap-3 justify-center">
              <button
                onClick={() => handleCompleteSession(true)}
                disabled={currentSession.tasksCompleted < currentSession.totalTasks}
                className="px-8 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-semibold transition-colors"
              >
                Complete Session
              </button>
              <button
                onClick={() => handleCompleteSession(false)}
                className="px-8 py-3 bg-red-600 hover:bg-red-700 rounded-lg font-semibold transition-colors"
              >
                Abort Session
              </button>
            </div>
          </div>
        )}

        {/* Metrics View */}
        {viewMode === 'metrics' && stressMetrics && (
          <StressMetricsDashboard metrics={stressMetrics} />
        )}

        {viewMode === 'metrics' && !stressMetrics && (
          <div className="text-center py-12 text-gray-400">
            Complete your first stress training session to see analytics.
          </div>
        )}
      </div>
    </div>
  );
}
