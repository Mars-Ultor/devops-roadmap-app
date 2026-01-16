/* eslint-disable max-lines-per-function */
/**
 * Time Analysis Visualization
 * Shows performance by hour with recommendations
 */

import { type FC } from 'react';
import { Clock, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import type { TimeAnalysisData } from '../../hooks/useTimeAnalysis';

interface TimeAnalysisChartProps {
  data: TimeAnalysisData;
  formatHour: (hour: number) => string;
}

export const TimeAnalysisChart: FC<TimeAnalysisChartProps> = ({ data, formatHour }) => {
  const { hourlyPerformance, recommendation, totalDataPoints } = data;

  const maxScore = Math.max(...hourlyPerformance.map(h => h.averageScore), 1);
  const maxSessions = Math.max(...hourlyPerformance.map(h => h.totalSessions), 1);

  const getBarColor = (hour: number) => {
    if (recommendation.bestHours.includes(hour)) return 'bg-emerald-500';
    if (recommendation.worstHours.includes(hour)) return 'bg-red-500';
    return 'bg-blue-500';
  };

  const getConfidenceBadge = () => {
    const colors = {
      low: 'bg-amber-900/30 text-amber-300',
      medium: 'bg-blue-900/30 text-blue-300',
      high: 'bg-emerald-900/30 text-emerald-300'
    };
    return colors[recommendation.confidenceLevel];
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Clock className="w-6 h-6 text-blue-400" />
            Study Time Analysis
          </h3>
          <p className="text-slate-400 text-sm mt-1">Based on {totalDataPoints} completed sessions</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getConfidenceBadge()}`}>
          {recommendation.confidenceLevel} confidence
        </span>
      </div>

      {/* Recommendation Card */}
      <div className="bg-gradient-to-r from-blue-900/30 to-purple-900/30 border border-blue-500/30 rounded-lg p-4 mb-6">
        <div className="flex items-start gap-3">
          <AlertCircle className="w-5 h-5 text-blue-400 mt-1" />
          <div>
            <h4 className="text-white font-semibold mb-2">Optimal Study Time</h4>
            <p className="text-blue-200 text-sm mb-3">{recommendation.recommendation}</p>
            <div className="flex gap-4 text-sm">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span className="text-slate-300">
                  Best: <strong className="text-emerald-300">{recommendation.peakPerformanceWindow}</strong>
                </span>
              </div>
              {recommendation.worstHours.length > 0 && (
                <div className="flex items-center gap-2">
                  <TrendingDown className="w-4 h-4 text-red-400" />
                  <span className="text-slate-300">
                    Avoid: <strong className="text-red-300">
                      {recommendation.worstHours.map(h => formatHour(h)).join(', ')}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hourly Chart */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-slate-400 mb-2">
          <span>Hour of Day</span>
          <span>Performance</span>
        </div>
        {hourlyPerformance.map(hourData => (
          <div key={hourData.hour} className="flex items-center gap-3">
            {/* Hour Label */}
            <div className="w-16 text-sm text-slate-300 font-mono">
              {formatHour(hourData.hour)}
            </div>

            {/* Performance Bar */}
            <div className="flex-1 h-8 bg-slate-900 rounded-lg overflow-hidden relative">
              {hourData.totalSessions > 0 ? (
                <>
                  <div 
                    className={`h-full ${getBarColor(hourData.hour)} transition-all`}
                    style={{ width: `${(hourData.averageScore / maxScore) * 100}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-between px-3">
                    <span className="text-xs text-white font-semibold">
                      {Math.round(hourData.averageScore)}%
                    </span>
                    <span className="text-xs text-slate-300">
                      {hourData.totalSessions} session{hourData.totalSessions !== 1 ? 's' : ''}
                    </span>
                  </div>
                </>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <span className="text-xs text-slate-600">No data</span>
                </div>
              )}
            </div>

            {/* Session Count Indicator */}
            <div className="w-20">
              <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-slate-500"
                  style={{ width: `${(hourData.totalSessions / maxSessions) * 100}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 mt-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-emerald-500 rounded"></div>
          <span className="text-slate-300">Peak Performance</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-blue-500 rounded"></div>
          <span className="text-slate-300">Average</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-500 rounded"></div>
          <span className="text-slate-300">Low Performance</span>
        </div>
      </div>
    </div>
  );
};
