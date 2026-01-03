/**
 * Performance Dashboard - Military Training Analytics
 * Real-time performance tracking and learning path optimization
 */

import { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Target,
  Clock,
  Zap,
  Shield,
  Award,
  AlertTriangle,
  CheckCircle,
  BarChart3
} from 'lucide-react';
import { aiCoachService } from '../../services/aiCoachEnhanced';
import type { PerformanceAnalytics, LearningPath, CoachContext } from '../../types/aiCoach';

interface PerformanceDashboardProps {
  userId: string;
  context: CoachContext;
}

export default function PerformanceDashboard({
  userId: _userId,
  context
}: PerformanceDashboardProps) {
  const [analytics, setAnalytics] = useState<PerformanceAnalytics | null>(null);
  const [learningPath, setLearningPath] = useState<LearningPath | null>(null);
  const [loading, setLoading] = useState(true);

  const loadPerformanceData = useCallback(async () => {
    setLoading(true);
    try {
      // Get performance analytics
      const performanceData = await aiCoachService['analyzePerformance'](context);
      setAnalytics(performanceData);

      // Generate learning path recommendations
      const pathData = await generateLearningPath(context, performanceData);
      setLearningPath(pathData);
    } catch (error) {
      console.error('Error loading performance data:', error);
    } finally {
      setLoading(false);
    }
  }, [context]);

  useEffect(() => {
    loadPerformanceData();
  }, [loadPerformanceData]);

  const generateLearningPath = async (
    context: CoachContext,
    analytics: PerformanceAnalytics
  ): Promise<LearningPath> => {
    // Simulate learning path generation
    await new Promise(resolve => setTimeout(resolve, 200));

    const currentLevel = context.masteryLevel || 'novice';
    const recommendations: LearningPath = {
      currentLevel,
      recommendedNext: [],
      blockedBy: [],
      estimatedCompletion: 12
    };

    // Determine next steps based on performance
    if (analytics.metrics.hintDependency > 0.5) {
      recommendations.blockedBy.push('hint dependency reduction');
    }

    if (analytics.metrics.persistenceScore < 0.4) {
      recommendations.blockedBy.push('persistence training');
    }

    if (analytics.trends.improving.includes('learning velocity')) {
      recommendations.recommendedNext.push('advanced scenarios');
    }

    if (analytics.trends.declining.includes('error rate')) {
      recommendations.recommendedNext.push('error handling drills');
    }

    return recommendations;
  };

  const getMetricColor = (value: number, thresholds: { good: number; warning: number }) => {
    if (value >= thresholds.good) return 'text-green-400';
    if (value >= thresholds.warning) return 'text-amber-400';
    return 'text-red-400';
  };

  const getTrendIcon = (trend: string[]) => {
    if (trend.length > 0) {
      return trend.includes('improving') ? TrendingUp : TrendingDown;
    }
    return Target;
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    return `${minutes}m`;
  };

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-slate-400">Analyzing performance...</span>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const TrendIcon = getTrendIcon(analytics.trends.improving);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-blue-400" />
            <h3 className="text-xl font-bold text-white">Performance Analytics</h3>
          </div>
          <div className="flex items-center gap-2">
            <TrendIcon className={`w-5 h-5 ${
              analytics.trends.improving.length > analytics.trends.declining.length
                ? 'text-green-400' : 'text-amber-400'
            }`} />
            <span className="text-sm text-slate-400">
              {analytics.trends.improving.length > analytics.trends.declining.length ? 'Improving' : 'Needs Focus'}
            </span>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-slate-900/50 rounded p-3">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-slate-400">Attempts</span>
            </div>
            <div className={`text-lg font-bold ${getMetricColor(analytics.metrics.averageAttempts, { good: 2, warning: 4 })}`}>
              {analytics.metrics.averageAttempts.toFixed(1)}
            </div>
          </div>

          <div className="bg-slate-900/50 rounded p-3">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="w-4 h-4 text-green-400" />
              <span className="text-xs text-slate-400">Avg Time</span>
            </div>
            <div className={`text-lg font-bold ${getMetricColor(analytics.metrics.averageTime, { good: 600, warning: 1800 })}`}>
              {formatTime(analytics.metrics.averageTime)}
            </div>
          </div>

          <div className="bg-slate-900/50 rounded p-3">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-slate-400">Hint Usage</span>
            </div>
            <div className={`text-lg font-bold ${getMetricColor(1 - analytics.metrics.hintDependency, { good: 0.7, warning: 0.4 })}`}>
              {(analytics.metrics.hintDependency * 100).toFixed(0)}%
            </div>
          </div>

          <div className="bg-slate-900/50 rounded p-3">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-4 h-4 text-red-400" />
              <span className="text-xs text-slate-400">Persistence</span>
            </div>
            <div className={`text-lg font-bold ${getMetricColor(analytics.metrics.persistenceScore, { good: 0.7, warning: 0.4 })}`}>
              {(analytics.metrics.persistenceScore * 100).toFixed(0)}%
            </div>
          </div>
        </div>
      </div>

      {/* Trends Analysis */}
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-400" />
          Performance Trends
        </h4>

        <div className="space-y-3">
          {analytics.trends.improving.length > 0 && (
            <div className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 mt-0.5" />
              <div>
                <div className="text-green-400 font-medium">Improving:</div>
                <div className="text-slate-300 text-sm">
                  {analytics.trends.improving.join(', ')}
                </div>
              </div>
            </div>
          )}

          {analytics.trends.declining.length > 0 && (
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-400 mt-0.5" />
              <div>
                <div className="text-amber-400 font-medium">Needs Attention:</div>
                <div className="text-slate-300 text-sm">
                  {analytics.trends.declining.join(', ')}
                </div>
              </div>
            </div>
          )}

          {analytics.trends.plateaued.length > 0 && (
            <div className="flex items-start gap-3">
              <Target className="w-5 h-5 text-blue-400 mt-0.5" />
              <div>
                <div className="text-blue-400 font-medium">Plateaued:</div>
                <div className="text-slate-300 text-sm">
                  {analytics.trends.plateaued.join(', ')}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Learning Path Recommendations */}
      {learningPath && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Award className="w-5 h-5 text-purple-400" />
            Learning Path
          </h4>

          <div className="space-y-4">
            <div>
              <div className="text-sm text-slate-400 mb-1">Current Level</div>
              <div className="text-white font-medium capitalize">{learningPath.currentLevel}</div>
            </div>

            {learningPath.recommendedNext.length > 0 && (
              <div>
                <div className="text-sm text-slate-400 mb-2">Recommended Next</div>
                <div className="space-y-1">
                  {learningPath.recommendedNext.map((item, index) => (
                    <div key={index} className="text-green-400 text-sm flex items-center gap-2">
                      <CheckCircle className="w-4 h-4" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {learningPath.blockedBy.length > 0 && (
              <div>
                <div className="text-sm text-slate-400 mb-2">Blocked By</div>
                <div className="space-y-1">
                  {learningPath.blockedBy.map((item, index) => (
                    <div key={index} className="text-amber-400 text-sm flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div>
              <div className="text-sm text-slate-400 mb-1">Estimated Completion</div>
              <div className="text-white font-medium">{learningPath.estimatedCompletion} weeks</div>
            </div>
          </div>
        </div>
      )}

      {/* Recommendations */}
      {analytics.recommendations.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-400" />
            Tactical Recommendations
          </h4>

          <div className="space-y-2">
            {analytics.recommendations.map((rec, index) => (
              <div key={index} className="bg-slate-900/50 rounded p-3 border-l-4 border-indigo-500">
                <div className="text-slate-200">{rec}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}