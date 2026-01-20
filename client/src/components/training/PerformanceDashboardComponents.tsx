/**
 * PerformanceDashboardComponents - Extracted UI components
 */

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
  BarChart3,
} from "lucide-react";
import type { PerformanceAnalytics, LearningPath } from "../../types/aiCoach";
import {
  getMetricColor,
  formatTime,
  getTrendStatus,
} from "./PerformanceDashboardUtils";

export function LoadingState() {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-slate-400">Analyzing performance...</span>
      </div>
    </div>
  );
}

interface HeaderSectionProps {
  readonly analytics: PerformanceAnalytics;
}

export function HeaderSection({ analytics }: HeaderSectionProps) {
  const trendStatus = getTrendStatus(analytics);
  const TrendIcon =
    analytics.trends.improving.length > 0 ? TrendingUp : TrendingDown;
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <BarChart3 className="w-6 h-6 text-blue-400" />
          <h3 className="text-xl font-bold text-white">
            Performance Analytics
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <TrendIcon
            className={`w-5 h-5 ${trendStatus.improving ? "text-green-400" : "text-amber-400"}`}
          />
          <span className="text-sm text-slate-400">{trendStatus.text}</span>
        </div>
      </div>
      <MetricsGrid analytics={analytics} />
    </div>
  );
}

function MetricsGrid({
  analytics,
}: {
  readonly analytics: PerformanceAnalytics;
}) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <MetricCard
        icon={<Target className="w-4 h-4 text-blue-400" />}
        label="Attempts"
        value={analytics.metrics.averageAttempts.toFixed(1)}
        color={getMetricColor(analytics.metrics.averageAttempts, {
          good: 2,
          warning: 4,
        })}
      />
      <MetricCard
        icon={<Clock className="w-4 h-4 text-green-400" />}
        label="Avg Time"
        value={formatTime(analytics.metrics.averageTime)}
        color={getMetricColor(analytics.metrics.averageTime, {
          good: 600,
          warning: 1800,
        })}
      />
      <MetricCard
        icon={<Zap className="w-4 h-4 text-purple-400" />}
        label="Hint Usage"
        value={`${(analytics.metrics.hintDependency * 100).toFixed(0)}%`}
        color={getMetricColor(1 - analytics.metrics.hintDependency, {
          good: 0.7,
          warning: 0.4,
        })}
      />
      <MetricCard
        icon={<Shield className="w-4 h-4 text-red-400" />}
        label="Persistence"
        value={`${(analytics.metrics.persistenceScore * 100).toFixed(0)}%`}
        color={getMetricColor(analytics.metrics.persistenceScore, {
          good: 0.7,
          warning: 0.4,
        })}
      />
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
  color,
}: {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly value: string;
  readonly color: string;
}) {
  return (
    <div className="bg-slate-900/50 rounded p-3">
      <div className="flex items-center gap-2 mb-1">
        {icon}
        <span className="text-xs text-slate-400">{label}</span>
      </div>
      <div className={`text-lg font-bold ${color}`}>{value}</div>
    </div>
  );
}

export function TrendsSection({
  analytics,
}: {
  readonly analytics: PerformanceAnalytics;
}) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5 text-blue-400" />
        Performance Trends
      </h4>
      <div className="space-y-3">
        {analytics.trends.improving.length > 0 && (
          <TrendItem
            icon={<CheckCircle className="w-5 h-5 text-green-400" />}
            label="Improving:"
            color="text-green-400"
            items={analytics.trends.improving}
          />
        )}
        {analytics.trends.declining.length > 0 && (
          <TrendItem
            icon={<AlertTriangle className="w-5 h-5 text-amber-400" />}
            label="Needs Attention:"
            color="text-amber-400"
            items={analytics.trends.declining}
          />
        )}
        {analytics.trends.plateaued.length > 0 && (
          <TrendItem
            icon={<Target className="w-5 h-5 text-blue-400" />}
            label="Plateaued:"
            color="text-blue-400"
            items={analytics.trends.plateaued}
          />
        )}
      </div>
    </div>
  );
}

function TrendItem({
  icon,
  label,
  color,
  items,
}: {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly color: string;
  readonly items: string[];
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5">{icon}</span>
      <div>
        <div className={`${color} font-medium`}>{label}</div>
        <div className="text-slate-300 text-sm">{items.join(", ")}</div>
      </div>
    </div>
  );
}

export function LearningPathSection({
  learningPath,
}: {
  readonly learningPath: LearningPath;
}) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Award className="w-5 h-5 text-purple-400" />
        Learning Path
      </h4>
      <div className="space-y-4">
        <div>
          <div className="text-sm text-slate-400 mb-1">Current Level</div>
          <div className="text-white font-medium capitalize">
            {learningPath.currentLevel}
          </div>
        </div>
        {learningPath.recommendedNext.length > 0 && (
          <div>
            <div className="text-sm text-slate-400 mb-2">Recommended Next</div>
            <div className="space-y-1">
              {learningPath.recommendedNext.map((item) => (
                <div
                  key={item}
                  className="text-green-400 text-sm flex items-center gap-2"
                >
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
              {learningPath.blockedBy.map((item) => (
                <div
                  key={item}
                  className="text-amber-400 text-sm flex items-center gap-2"
                >
                  <AlertTriangle className="w-4 h-4" />
                  {item}
                </div>
              ))}
            </div>
          </div>
        )}
        <div>
          <div className="text-sm text-slate-400 mb-1">
            Estimated Completion
          </div>
          <div className="text-white font-medium">
            {learningPath.estimatedCompletion} weeks
          </div>
        </div>
      </div>
    </div>
  );
}

export function RecommendationsSection({
  recommendations,
}: {
  readonly recommendations: string[];
}) {
  if (recommendations.length === 0) return null;
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-indigo-400" />
        Tactical Recommendations
      </h4>
      <div className="space-y-2">
        {recommendations.map((rec) => (
          <div
            key={rec}
            className="bg-slate-900/50 rounded p-3 border-l-4 border-indigo-500"
          >
            <div className="text-slate-200">{rec}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
