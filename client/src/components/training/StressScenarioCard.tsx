/**
 * Stress Scenario Card Component
 * Displays stress training scenario with difficulty indicators
 */

import { Clock, Zap, AlertTriangle, Users, Lock } from 'lucide-react';
import type { StressScenario } from '../../types/training';

interface StressScenarioCardProps {
  scenario: StressScenario;
  onSelect: () => void;
  locked?: boolean;
  selected?: boolean;
}

const stressLevelConfig = {
  none: { color: 'gray', label: 'No Stress', intensity: 0 },
  low: { color: 'green', label: 'Low Stress', intensity: 1 },
  medium: { color: 'yellow', label: 'Medium Stress', intensity: 2 },
  high: { color: 'orange', label: 'High Stress', intensity: 3 },
  extreme: { color: 'red', label: 'Extreme Stress', intensity: 4 }
};

export function StressScenarioCard({ scenario, onSelect, locked = false, selected = false }: StressScenarioCardProps) {
  const config = stressLevelConfig[scenario.stressLevel];
  const duration = Math.floor(scenario.duration / 60);

  return (
    <button
      onClick={onSelect}
      disabled={locked}
      className={`
        w-full text-left p-4 rounded-lg border-2 transition-all
        ${locked ? 'opacity-50 cursor-not-allowed bg-gray-800/30 border-gray-700' : 
          selected ? 'border-blue-500 bg-blue-900/20' : 
          'border-gray-700 bg-gray-800/50 hover:border-gray-600 hover:bg-gray-800'}
      `}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-white">{scenario.title}</h3>
            {locked && <Lock className="w-4 h-4 text-gray-500" />}
          </div>
          
          {/* Stress Level Badge */}
          <div className={`
            inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium
            ${config.color === 'gray' ? 'bg-gray-700 text-gray-300' :
              config.color === 'green' ? 'bg-green-900/50 text-green-300' :
              config.color === 'yellow' ? 'bg-yellow-900/50 text-yellow-300' :
              config.color === 'orange' ? 'bg-orange-900/50 text-orange-300' :
              'bg-red-900/50 text-red-300'}
          `}>
            <Zap className="w-3 h-3" />
            {config.label}
          </div>
        </div>

        {/* Bonus Reward */}
        <div className="text-right">
          <div className="text-xs text-gray-400">Bonus XP</div>
          <div className="text-lg font-bold text-yellow-400">+{scenario.bonusReward}</div>
        </div>
      </div>

      {/* Description */}
      <p className="text-sm text-gray-300 mb-3">{scenario.description}</p>

      {/* Conditions Overview */}
      <div className="flex flex-wrap gap-2 mb-3">
        {scenario.conditions.map((condition, index) => (
          <div
            key={index}
            className="flex items-center gap-1 px-2 py-1 bg-gray-700/50 rounded text-xs text-gray-300"
          >
            {condition.type === 'time-pressure' && <Clock className="w-3 h-3" />}
            {condition.type === 'multi-tasking' && <Users className="w-3 h-3" />}
            {condition.type === 'production-incident' && <AlertTriangle className="w-3 h-3" />}
            {condition.type === 'interruption' && <Zap className="w-3 h-3" />}
            {condition.type === 'resource-constraint' && <Lock className="w-3 h-3" />}
            <span>{condition.description}</span>
          </div>
        ))}
      </div>

      {/* Metadata */}
      <div className="flex items-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          <span>{duration} min</span>
        </div>
        <div className="flex items-center gap-1">
          <AlertTriangle className="w-3 h-3" />
          <span>{scenario.successCriteria.length} objectives</span>
        </div>
      </div>

      {/* Locked Message */}
      {locked && (
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-400">
            🔒 Complete {String(scenario.stressLevel) === 'medium' ? 'low' : 
                         String(scenario.stressLevel) === 'high' ? 'medium' : 
                         String(scenario.stressLevel) === 'extreme' ? 'high' : 'previous'} stress scenarios to unlock
          </p>
        </div>
      )}
    </button>
  );
}
