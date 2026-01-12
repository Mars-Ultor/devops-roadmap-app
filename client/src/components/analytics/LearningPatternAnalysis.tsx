/* eslint-disable max-lines-per-function */
/**
 * Learning Pattern Analysis
 * Identifies patterns in study behavior and performance correlations
 */

import type { FC } from 'react';
import { Brain, Clock, TrendingUp, AlertTriangle, Lightbulb, Target } from 'lucide-react';

interface LearningPatternData {
  patterns: {
    studyConsistency: {
      score: number; // 0-100
      description: string;
      recommendation: string;
    };
    timeOptimization: {
      optimalHours: number[];
      wastedHours: number[];
      efficiency: number; // percentage
    };
    topicStruggles: Array<{
      topic: string;
      pattern: string;
      frequency: number;
      suggestion: string;
    }>;
    performanceCorrelations: Array<{
      factor: string;
      correlation: number; // -1 to 1
      insight: string;
    }>;
    adaptiveRecommendations: string[];
  };
  insights: Array<{
    type: 'success' | 'warning' | 'info';
    title: string;
    description: string;
    actionable: boolean;
  }>;
}

interface LearningPatternAnalysisProps {
  data: LearningPatternData;
}

export const LearningPatternAnalysis: FC<LearningPatternAnalysisProps> = ({ data }) => {
  const { patterns, insights } = data;

  const getCorrelationColor = (correlation: number) => {
    if (correlation > 0.5) return 'text-green-400';
    if (correlation > 0.2) return 'text-blue-400';
    if (correlation > -0.2) return 'text-yellow-400';
    if (correlation > -0.5) return 'text-orange-400';
    return 'text-red-400';
  };

  const getCorrelationStrength = (correlation: number) => {
    const abs = Math.abs(correlation);
    if (abs > 0.7) return 'Strong';
    if (abs > 0.5) return 'Moderate';
    if (abs > 0.3) return 'Weak';
    return 'Very Weak';
  };

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Lightbulb className="w-5 h-5 text-blue-400" />;
      default:
        return <Brain className="w-5 h-5 text-purple-400" />;
    }
  };

  const formatHour = (hour: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const getDisplayHour = () => {
      if (hour === 0) return 12;
      if (hour > 12) return hour - 12;
      return hour;
    };
    const displayHour = getDisplayHour();
    return `${displayHour}${period}`;
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-2xl font-bold text-white flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-400" />
            Learning Pattern Analysis
          </h3>
          <p className="text-slate-400 text-sm mt-1">
            AI-powered insights into your learning behavior
          </p>
        </div>
        <div className="bg-purple-900/30 border border-purple-700 rounded-lg px-3 py-1">
          <span className="text-purple-300 text-sm font-semibold">
            {insights.length} Insights Found
          </span>
        </div>
      </div>

      {/* Study Consistency */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-white">Study Consistency</h4>
          <span className={`text-lg font-bold ${(() => {
            if (patterns.studyConsistency.score >= 80) return 'text-green-400';
            if (patterns.studyConsistency.score >= 60) return 'text-yellow-400';
            return 'text-red-400';
          })()}`}>
            {patterns.studyConsistency.score}/100
          </span>
        </div>
        <p className="text-slate-300 text-sm mb-3">{patterns.studyConsistency.description}</p>
        <div className="w-full bg-slate-700 rounded-full h-2 mb-3">
          <div
            className={`h-2 rounded-full transition-all ${(() => {
              if (patterns.studyConsistency.score >= 80) return 'bg-green-500';
              if (patterns.studyConsistency.score >= 60) return 'bg-yellow-500';
              return 'bg-red-500';
            })()}`}
            style={{ width: `${patterns.studyConsistency.score}%` }}
          />
        </div>
        <p className="text-slate-400 text-sm">{patterns.studyConsistency.recommendation}</p>
      </div>

      {/* Time Optimization */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-semibold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-400" />
            Time Optimization
          </h4>
          <span className="text-blue-400 text-sm font-semibold">
            {patterns.timeOptimization.efficiency}% Efficient
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-900/20 border border-green-700 rounded-lg p-4">
            <h5 className="text-green-400 font-semibold mb-2">Peak Performance Hours</h5>
            <div className="flex flex-wrap gap-2">
              {patterns.timeOptimization.optimalHours.map(hour => (
                <span key={hour} className="bg-green-800 text-green-300 px-2 py-1 rounded text-xs">
                  {formatHour(hour)}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-red-900/20 border border-red-700 rounded-lg p-4">
            <h5 className="text-red-400 font-semibold mb-2">Low Performance Hours</h5>
            <div className="flex flex-wrap gap-2">
              {patterns.timeOptimization.wastedHours.map(hour => (
                <span key={hour} className="bg-red-800 text-red-300 px-2 py-1 rounded text-xs">
                  {formatHour(hour)}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Performance Correlations */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-4">Performance Correlations</h4>
        <div className="space-y-3">
          {patterns.performanceCorrelations.map((correlation) => (
            <div key={correlation.factor} className="bg-slate-900/50 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white font-medium">{correlation.factor}</span>
                <div className="flex items-center gap-2">
                  <span className={`text-sm font-semibold ${getCorrelationColor(correlation.correlation)}`}>
                    {correlation.correlation > 0 ? '+' : ''}{correlation.correlation.toFixed(2)}
                  </span>
                  <span className="text-slate-400 text-xs">
                    ({getCorrelationStrength(correlation.correlation)})
                  </span>
                </div>
              </div>
              <p className="text-slate-300 text-sm">{correlation.insight}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Topic Struggle Patterns */}
      {patterns.topicStruggles.length > 0 && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold text-white mb-4">Topic Struggle Patterns</h4>
          <div className="space-y-3">
            {patterns.topicStruggles.map((struggle) => (
              <div key={struggle.topic} className="bg-orange-900/20 border border-orange-700 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white font-medium">{struggle.topic}</span>
                  <span className="text-orange-400 text-sm">
                    {struggle.frequency} occurrences
                  </span>
                </div>
                <p className="text-slate-300 text-sm mb-2">{struggle.pattern}</p>
                <p className="text-orange-300 text-sm font-semibold">{struggle.suggestion}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Insights */}
      <div className="mb-6">
        <h4 className="text-lg font-semibold text-white mb-4">Key Insights</h4>
        <div className="space-y-3">
          {insights.map((insight) => (
            <div key={insight.title} className={`rounded-lg p-4 border ${
              insight.type === 'success' ? 'bg-green-900/20 border-green-700' :
              insight.type === 'warning' ? 'bg-yellow-900/20 border-yellow-700' :
              'bg-blue-900/20 border-blue-700'
            }`}>
              <div className="flex items-start gap-3">
                {getInsightIcon(insight.type)}
                <div className="flex-1">
                  <h5 className="text-white font-semibold mb-1">{insight.title}</h5>
                  <p className="text-slate-300 text-sm mb-2">{insight.description}</p>
                  {insight.actionable && (
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-indigo-400" />
                      <span className="text-indigo-300 text-xs font-semibold">Actionable Insight</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Adaptive Recommendations */}
      <div className="bg-indigo-900/20 border border-indigo-700 rounded-lg p-4">
        <h4 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-indigo-400" />
          Adaptive Recommendations
        </h4>
        <ul className="space-y-2">
          {patterns.adaptiveRecommendations.map((rec) => (
            <li key={rec} className="flex items-start gap-3 text-slate-300">
              <span className="text-indigo-400 mt-1">•</span>
              <span className="text-sm">{rec}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};