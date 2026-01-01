/**
 * Learning Velocity Chart
 * Shows progress speed and learning acceleration over time
 */

import type { FC } from 'react';
import { TrendingUp, TrendingDown, Activity, Target } from 'lucide-react';

interface LearningVelocityData {
  weeklyProgress: Array<{
    week: number;
    itemsCompleted: number;
    avgTimePerItem: number;
    masteryRate: number;
    date: Date;
  }>;
  velocityTrend: 'accelerating' | 'steady' | 'decelerating';
  projectedCompletion: Date | null;
  currentPace: number; // items per week
  optimalPace: number; // recommended items per week
}

interface LearningVelocityChartProps {
  data?: LearningVelocityData;
}

export const LearningVelocityChart: FC<LearningVelocityChartProps> = ({ data }) => {
  // Handle undefined data gracefully
  if (!data || !data.weeklyProgress) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-lg p-8">
        <div className="text-center">
          <div className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-400 mb-2">Learning Velocity</h3>
          <p className="text-gray-500">Velocity data is being calculated...</p>
        </div>
      </div>
    );
  }

  const { weeklyProgress, velocityTrend, projectedCompletion, currentPace, optimalPace } = data;

  const getTrendIcon = () => {
    switch (velocityTrend) {
      case 'accelerating':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'decelerating':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      default:
        return <Activity className="w-5 h-5 text-blue-400" />;
    }
  };

  const getTrendColor = () => {
    switch (velocityTrend) {
      case 'accelerating':
        return 'text-green-400';
      case 'decelerating':
        return 'text-red-400';
      default:
        return 'text-blue-400';
    }
  };

  const maxItems = Math.max(...weeklyProgress.map(w => w.itemsCompleted), 1);

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Target className="w-6 h-6 text-indigo-400" />
            Learning Velocity
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            Progress speed and completion trajectory
          </p>
        </div>
        <div className="flex items-center gap-2">
          {getTrendIcon()}
          <span className={`text-sm font-semibold capitalize ${getTrendColor()}`}>
            {velocityTrend}
          </span>
        </div>
      </div>

      {/* Velocity Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Current Pace</div>
          <div className="text-2xl font-bold text-white">{currentPace}</div>
          <div className="text-xs text-slate-500">items/week</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Optimal Pace</div>
          <div className="text-2xl font-bold text-indigo-400">{optimalPace}</div>
          <div className="text-xs text-slate-500">items/week</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Projected Completion</div>
          <div className="text-lg font-bold text-white">
            {projectedCompletion ? projectedCompletion.toLocaleDateString() : 'N/A'}
          </div>
          <div className="text-xs text-slate-500">estimated</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="text-sm text-slate-400 mb-1">Trend</div>
          <div className={`text-lg font-bold capitalize ${getTrendColor()}`}>
            {velocityTrend}
          </div>
          <div className="text-xs text-slate-500">learning speed</div>
        </div>
      </div>

      {/* Weekly Progress Chart */}
      <div className="space-y-3">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Week</span>
          <span>Items Completed</span>
        </div>
        {weeklyProgress.map((week, idx) => (
          <div key={idx} className="flex items-center gap-3">
            {/* Week Label */}
            <div className="w-12 text-sm text-slate-300 font-mono">
              W{week.week}
            </div>

            {/* Progress Bar */}
            <div className="flex-1 h-8 bg-slate-900 rounded-lg overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg transition-all"
                style={{ width: `${(week.itemsCompleted / maxItems) * 100}%` }}
              />
              <div className="absolute inset-0 flex items-center justify-between px-3">
                <span className="text-xs text-white font-semibold">
                  {week.itemsCompleted} items
                </span>
                <span className="text-xs text-slate-300">
                  {week.masteryRate.toFixed(1)}% mastery
                </span>
              </div>
            </div>

            {/* Time Indicator */}
            <div className="w-16 text-right">
              <div className="text-xs text-slate-400">
                {Math.round(week.avgTimePerItem)}m
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Insights */}
      <div className="mt-6 bg-slate-900/50 rounded-lg p-4">
        <h4 className="text-white font-semibold mb-2">Velocity Insights</h4>
        <div className="space-y-2 text-sm text-slate-300">
          {velocityTrend === 'accelerating' && (
            <p>🚀 <strong>Accelerating:</strong> Your learning speed is increasing. Keep up the momentum!</p>
          )}
          {velocityTrend === 'decelerating' && (
            <p>⚠️ <strong>Decelerating:</strong> Learning pace is slowing. Consider reviewing study habits or taking breaks.</p>
          )}
          {velocityTrend === 'steady' && (
            <p>📊 <strong>Steady Pace:</strong> Consistent learning velocity. Good balance of quality and quantity.</p>
          )}
          {currentPace < optimalPace * 0.7 && (
            <p>🎯 <strong>Pace Check:</strong> Current pace is {Math.round((currentPace / optimalPace) * 100)}% of optimal. Consider increasing study frequency.</p>
          )}
          {currentPace > optimalPace * 1.3 && (
            <p>⚖️ <strong>Quality Focus:</strong> High pace detected. Ensure retention by focusing on understanding over speed.</p>
          )}
        </div>
      </div>
    </div>
  );
};