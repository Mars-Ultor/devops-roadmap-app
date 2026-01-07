/* eslint-disable max-lines-per-function */
/**
 * Production Scenarios Page
 * Real-world troubleshooting simulations
 */

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertTriangle, Clock, Users, DollarSign, BookOpen, ArrowLeft, Filter } from 'lucide-react';
import { PRODUCTION_SCENARIOS, getScenariosByDifficulty } from '../data/productionScenarios';
import { useProductionScenario } from '../hooks/useProductionScenario';
import type { ProductionScenario, ScenarioDifficulty, ScenarioCategory } from '../types/scenarios';

export default function ProductionScenarios() {
  const navigate = useNavigate();
  const { getPerformance } = useProductionScenario();
  const [difficultyFilter, setDifficultyFilter] = useState<ScenarioDifficulty | 'all'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ScenarioCategory | 'all'>('all');

  const getFilteredScenarios = (): ProductionScenario[] => {
    let scenarios = PRODUCTION_SCENARIOS;

    if (difficultyFilter !== 'all') {
      scenarios = getScenariosByDifficulty(difficultyFilter);
    }

    if (categoryFilter !== 'all') {
      scenarios = scenarios.filter(s => s.category === categoryFilter);
    }

    return scenarios;
  };

  const filteredScenarios = getFilteredScenarios();

  const getDifficultyColor = (difficulty: ScenarioDifficulty): string => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400 bg-green-900/30 border-green-700';
      case 'intermediate': return 'text-yellow-400 bg-yellow-900/30 border-yellow-700';
      case 'advanced': return 'text-orange-400 bg-orange-900/30 border-orange-700';
      case 'expert': return 'text-red-400 bg-red-900/30 border-red-700';
    }
  };

  const getImpactColor = (impact?: string): string => {
    switch (impact) {
      case 'low': return 'text-green-400';
      case 'medium': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/battle-drills')}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Battle Drills
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Production Scenarios</h1>
              <p className="text-gray-400">Real-world incident troubleshooting simulations</p>
            </div>
          </div>

          {/* Info Banner */}
          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4 mt-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-white font-semibold mb-1">Realistic Incident Response</h3>
                <p className="text-sm text-gray-300">
                  Practice diagnosing and resolving production incidents. Each scenario simulates a real-world outage
                  with symptoms, investigation steps, and resolution procedures.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 mb-6">
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-gray-400" />
            <span className="text-sm font-medium text-gray-300">Filters</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Difficulty Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Difficulty</label>
              <div className="flex flex-wrap gap-2">
                {['all', 'beginner', 'intermediate', 'advanced', 'expert'].map(diff => (
                  <button
                    key={diff}
                    onClick={() => setDifficultyFilter(diff as ScenarioDifficulty | 'all')}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize ${
                      difficultyFilter === diff
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
            </div>

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2">Category</label>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value as ScenarioCategory | 'all')}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
              >
                <option value="all">All Categories</option>
                <option value="deployment-failure">Deployment Failure</option>
                <option value="performance-degradation">Performance Degradation</option>
                <option value="security-incident">Security Incident</option>
                <option value="data-corruption">Data Corruption</option>
                <option value="service-outage">Service Outage</option>
                <option value="configuration-drift">Configuration Drift</option>
                <option value="resource-exhaustion">Resource Exhaustion</option>
                <option value="network-issues">Network Issues</option>
              </select>
            </div>
          </div>
        </div>

        {/* Scenarios Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredScenarios.map((scenario) => {
            const performance = getPerformance(scenario.id);
            
            return (
              <div
                key={scenario.id}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:border-gray-600 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-xl font-semibold text-white">{scenario.title}</h3>
                    </div>
                    <div className={`inline-block px-2 py-1 rounded text-xs font-medium border ${getDifficultyColor(scenario.difficulty)}`}>
                      {scenario.difficulty.toUpperCase()}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-400">{scenario.maxScore}</div>
                    <div className="text-xs text-gray-400">max points</div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-gray-300 text-sm mb-4">{scenario.description}</p>

                {/* Impact Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {scenario.affectedUsers && scenario.affectedUsers > 0 && (
                    <div className="bg-gray-900/50 rounded p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <Users className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">Affected</span>
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {scenario.affectedUsers.toLocaleString()}
                      </div>
                    </div>
                  )}
                  
                  {scenario.revenueImpact && scenario.revenueImpact > 0 && (
                    <div className="bg-gray-900/50 rounded p-2">
                      <div className="flex items-center gap-1 mb-1">
                        <DollarSign className="w-3 h-3 text-gray-400" />
                        <span className="text-xs text-gray-400">$/min</span>
                      </div>
                      <div className="text-sm font-semibold text-red-400">
                        ${scenario.revenueImpact.toLocaleString()}
                      </div>
                    </div>
                  )}
                  
                  <div className="bg-gray-900/50 rounded p-2">
                    <div className="flex items-center gap-1 mb-1">
                      <Clock className="w-3 h-3 text-gray-400" />
                      <span className="text-xs text-gray-400">Est. Time</span>
                    </div>
                    <div className="text-sm font-semibold text-white">
                      {scenario.estimatedTimeToResolve} min
                    </div>
                  </div>
                </div>

                {/* Business Impact */}
                <div className="bg-gray-900/50 rounded p-3 mb-4">
                  <div className="flex items-center gap-2 mb-1">
                    <AlertTriangle className={`w-4 h-4 ${getImpactColor(scenario.rootCause.impact)}`} />
                    <span className="text-xs font-semibold text-gray-400">Business Impact</span>
                  </div>
                  <p className="text-sm text-gray-300">{scenario.businessImpact}</p>
                </div>

                {/* Learning Objectives */}
                <div className="mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <BookOpen className="w-4 h-4 text-gray-400" />
                    <span className="text-xs font-semibold text-gray-400">You'll Learn</span>
                  </div>
                  <ul className="space-y-1">
                    {scenario.learningObjectives.slice(0, 3).map((obj, index) => (
                      <li key={index} className="text-xs text-gray-300 flex items-start gap-2">
                        <span className="text-blue-400">→</span>
                        {obj}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Performance Stats */}
                {performance && (
                  <div className="bg-blue-900/20 border border-blue-700 rounded p-3 mb-4">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <div className="text-gray-400">Attempts</div>
                        <div className="text-white font-semibold">{performance.attempts}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Best Score</div>
                        <div className="text-white font-semibold">{performance.bestScore}</div>
                      </div>
                      <div>
                        <div className="text-gray-400">Mastery</div>
                        <div className="text-white font-semibold capitalize">{performance.masteryLevel}</div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Button */}
                <button
                  onClick={() => navigate(`/scenario/${scenario.id}`)}
                  className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-semibold transition-colors"
                >
                  {performance?.attempts ? 'Try Again' : 'Start Scenario'}
                </button>
              </div>
            );
          })}
        </div>

        {filteredScenarios.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            No scenarios match your filters. Try different options.
          </div>
        )}
      </div>
    </div>
  );
}
