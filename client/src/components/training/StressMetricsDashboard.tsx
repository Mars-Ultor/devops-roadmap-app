/**
 * Stress Metrics Dashboard Component
 * Historical stress performance analytics
 */

import { TrendingUp, Zap, Target, Award, BarChart3, Activity } from 'lucide-react';
import type { StressMetrics } from '../../types/training';

interface StressMetricsDashboardProps {
  metrics: StressMetrics;
}

const stressLevelLabels: Record<string, string> = {
  none: 'None',
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  extreme: 'Extreme'
};

const stressLevelColors: Record<string, string> = {
  none: 'bg-gray-600',
  low: 'bg-green-600',
  medium: 'bg-yellow-600',
  high: 'bg-orange-600',
  extreme: 'bg-red-600'
};

export function StressMetricsDashboard({ metrics }: StressMetricsDashboardProps) {
  const totalSessions = metrics.totalSessions;
  const maxSessions = Math.max(...Object.values(metrics.sessionsByStressLevel));

  const toleranceLevel = metrics.stressToleranceLevel;
  const toleranceIndex = ['none', 'low', 'medium', 'high', 'extreme'].indexOf(toleranceLevel);

  const degradationStatus = 
    metrics.performanceDegradation.degradationRate < 10 ? 'excellent' :
    metrics.performanceDegradation.degradationRate < 20 ? 'good' :
    metrics.performanceDegradation.degradationRate < 30 ? 'fair' : 'needs-improvement';

  return (
    <div className="space-y-6">
      {/* Overview Stats */}
      <div className="grid grid-cols-4 gap-4">
        {/* Total Sessions */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <BarChart3 className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Total Sessions</span>
          </div>
          <div className="text-3xl font-bold text-white">{totalSessions}</div>
        </div>

        {/* Stress Tolerance */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Zap className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Stress Tolerance</span>
          </div>
          <div className="text-xl font-bold text-white capitalize">{toleranceLevel}</div>
          <div className="mt-2 flex gap-1">
            {['none', 'low', 'medium', 'high', 'extreme'].map((level, index) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded ${
                  index <= toleranceIndex ? stressLevelColors[level] : 'bg-gray-700'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Average Adaptability */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Adaptability</span>
          </div>
          <div className={`text-3xl font-bold ${
            metrics.averageAdaptabilityScore >= 80 ? 'text-green-400' :
            metrics.averageAdaptabilityScore >= 60 ? 'text-yellow-400' :
            'text-orange-400'
          }`}>
            {Math.round(metrics.averageAdaptabilityScore)}
          </div>
        </div>

        {/* Avg Stress Score */}
        <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-400">Avg Stress</span>
          </div>
          <div className={`text-3xl font-bold ${
            metrics.averageStressScore < 40 ? 'text-green-400' :
            metrics.averageStressScore < 60 ? 'text-yellow-400' :
            'text-orange-400'
          }`}>
            {Math.round(metrics.averageStressScore)}
          </div>
        </div>
      </div>

      {/* Sessions by Stress Level */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Sessions by Stress Level
        </h3>
        <div className="space-y-3">
          {(['low', 'medium', 'high', 'extreme'] as const).map((level) => {
            const count = metrics.sessionsByStressLevel[level] || 0;
            const percentage = totalSessions > 0 ? (count / totalSessions) * 100 : 0;
            const isUnlocked = ['none', 'low', 'medium', 'high', 'extreme'].indexOf(level) <= toleranceIndex;

            return (
              <div key={level} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={`capitalize ${isUnlocked ? 'text-white' : 'text-gray-500'}`}>
                      {stressLevelLabels[level]}
                    </span>
                    {!isUnlocked && <span className="text-xs text-gray-500">🔒</span>}
                  </div>
                  <span className="text-gray-400">
                    {count} session{count !== 1 ? 's' : ''} ({Math.round(percentage)}%)
                  </span>
                </div>
                <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${stressLevelColors[level]} transition-all duration-500`}
                    style={{ width: maxSessions > 0 ? `${(count / maxSessions) * 100}%` : '0%' }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Performance Degradation Analysis */}
      <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5" />
          Performance Degradation Analysis
        </h3>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Normal Accuracy</div>
            <div className="text-2xl font-bold text-green-400">
              {metrics.performanceDegradation.normalAccuracy.toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Stressed Accuracy</div>
            <div className="text-2xl font-bold text-yellow-400">
              {metrics.performanceDegradation.stressedAccuracy.toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-gray-900/50 rounded-lg p-4">
            <div className="text-sm text-gray-400 mb-1">Degradation Rate</div>
            <div className={`text-2xl font-bold ${
              degradationStatus === 'excellent' ? 'text-green-400' :
              degradationStatus === 'good' ? 'text-yellow-400' :
              degradationStatus === 'fair' ? 'text-orange-400' :
              'text-red-400'
            }`}>
              {metrics.performanceDegradation.degradationRate.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Degradation Insights */}
        <div className="space-y-2">
          {degradationStatus === 'excellent' && (
            <div className="p-3 bg-green-900/20 border border-green-700 rounded-lg">
              <div className="flex items-center gap-2 text-green-400">
                <Award className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Excellent! Your performance under stress is near baseline. Keep it up!
                </span>
              </div>
            </div>
          )}
          
          {degradationStatus === 'good' && (
            <div className="p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
              <div className="flex items-center gap-2 text-yellow-400">
                <TrendingUp className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Good stress management. Minor performance drop is normal.
                </span>
              </div>
            </div>
          )}
          
          {degradationStatus === 'fair' && (
            <div className="p-3 bg-orange-900/20 border border-orange-700 rounded-lg">
              <div className="flex items-center gap-2 text-orange-400">
                <Target className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Moderate degradation. Practice more stress scenarios to improve resilience.
                </span>
              </div>
            </div>
          )}
          
          {degradationStatus === 'needs-improvement' && (
            <div className="p-3 bg-red-900/20 border border-red-700 rounded-lg">
              <div className="flex items-center gap-2 text-red-400">
                <Zap className="w-4 h-4" />
                <span className="text-sm font-medium">
                  Significant degradation under stress. Focus on lower stress levels first.
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Next Steps */}
      <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-white mb-3">Next Steps</h3>
        {toleranceIndex < 4 ? (
          <p className="text-gray-300 text-sm">
            Complete <span className="font-semibold text-white">3 successful sessions</span> at{' '}
            <span className="font-semibold capitalize text-white">
              {stressLevelLabels[toleranceLevel]}
            </span> level to unlock{' '}
            <span className="font-semibold capitalize text-white">
              {stressLevelLabels[['low', 'medium', 'high', 'extreme'][toleranceIndex + 1]]}
            </span> stress scenarios.
          </p>
        ) : (
          <p className="text-gray-300 text-sm">
            🎉 <span className="font-semibold text-white">Maximum stress tolerance achieved!</span> You can handle extreme pressure scenarios. Keep practicing to maintain your skills.
          </p>
        )}
      </div>
    </div>
  );
}
