/**
 * StressMetricsDashboard - UI Components
 */

import {
  TrendingUp,
  Zap,
  Target,
  Award,
  BarChart3,
  Activity,
} from "lucide-react";
import type { StressMetrics } from "../../types/training";
import {
  STRESS_LEVEL_LABELS,
  STRESS_LEVEL_COLORS,
  STRESS_LEVELS,
  getAdaptabilityColor,
  getStressScoreColor,
  getDegradationColor,
} from "./StressMetricsDashboardUtils";

// Stat Card Component
interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
  footer?: React.ReactNode;
}

function StatCard({ icon, label, value, footer }: StatCardProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      {value}
      {footer}
    </div>
  );
}

// Overview Stats Grid
interface OverviewStatsProps {
  metrics: StressMetrics;
}

export function OverviewStats({ metrics }: OverviewStatsProps) {
  const toleranceIndex = STRESS_LEVELS.indexOf(metrics.stressToleranceLevel);

  return (
    <div className="grid grid-cols-4 gap-4">
      <StatCard
        icon={<BarChart3 className="w-4 h-4 text-gray-400" />}
        label="Total Sessions"
        value={
          <div className="text-3xl font-bold text-white">
            {metrics.totalSessions}
          </div>
        }
      />

      <StatCard
        icon={<Zap className="w-4 h-4 text-gray-400" />}
        label="Stress Tolerance"
        value={
          <div className="text-xl font-bold text-white capitalize">
            {metrics.stressToleranceLevel}
          </div>
        }
        footer={
          <div className="mt-2 flex gap-1">
            {STRESS_LEVELS.map((level, index) => (
              <div
                key={level}
                className={`h-1 flex-1 rounded ${
                  index <= toleranceIndex
                    ? STRESS_LEVEL_COLORS[level]
                    : "bg-gray-700"
                }`}
              />
            ))}
          </div>
        }
      />

      <StatCard
        icon={<Target className="w-4 h-4 text-gray-400" />}
        label="Adaptability"
        value={
          <div
            className={`text-3xl font-bold ${getAdaptabilityColor(metrics.averageAdaptabilityScore)}`}
          >
            {Math.round(metrics.averageAdaptabilityScore)}
          </div>
        }
      />

      <StatCard
        icon={<Activity className="w-4 h-4 text-gray-400" />}
        label="Avg Stress"
        value={
          <div
            className={`text-3xl font-bold ${getStressScoreColor(metrics.averageStressScore)}`}
          >
            {Math.round(metrics.averageStressScore)}
          </div>
        }
      />
    </div>
  );
}

// Sessions By Stress Level Section
interface SessionsByLevelProps {
  metrics: StressMetrics;
}

export function SessionsByLevel({ metrics }: SessionsByLevelProps) {
  const totalSessions = metrics.totalSessions;
  const maxSessions = Math.max(...Object.values(metrics.sessionsByStressLevel));
  const toleranceIndex = STRESS_LEVELS.indexOf(metrics.stressToleranceLevel);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <BarChart3 className="w-5 h-5" />
        Sessions by Stress Level
      </h3>
      <div className="space-y-3">
        {(["low", "medium", "high", "extreme"] as const).map((level) => {
          const count = metrics.sessionsByStressLevel[level] || 0;
          const percentage =
            totalSessions > 0 ? (count / totalSessions) * 100 : 0;
          const isUnlocked = STRESS_LEVELS.indexOf(level) <= toleranceIndex;

          return (
            <StressLevelBar
              key={level}
              level={level}
              count={count}
              percentage={percentage}
              maxSessions={maxSessions}
              isUnlocked={isUnlocked}
            />
          );
        })}
      </div>
    </div>
  );
}

interface StressLevelBarProps {
  level: string;
  count: number;
  percentage: number;
  maxSessions: number;
  isUnlocked: boolean;
}

function StressLevelBar({
  level,
  count,
  percentage,
  maxSessions,
  isUnlocked,
}: StressLevelBarProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          <span
            className={`capitalize ${isUnlocked ? "text-white" : "text-gray-500"}`}
          >
            {STRESS_LEVEL_LABELS[level]}
          </span>
          {!isUnlocked && <span className="text-xs text-gray-500">🔒</span>}
        </div>
        <span className="text-gray-400">
          {count} session{count !== 1 ? "s" : ""} ({Math.round(percentage)}%)
        </span>
      </div>
      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full ${STRESS_LEVEL_COLORS[level]} transition-all duration-500`}
          style={{
            width: maxSessions > 0 ? `${(count / maxSessions) * 100}%` : "0%",
          }}
        />
      </div>
    </div>
  );
}

// Performance Degradation Section
interface DegradationAnalysisProps {
  metrics: StressMetrics;
  degradationStatus: string;
}

export function DegradationAnalysis({
  metrics,
  degradationStatus,
}: DegradationAnalysisProps) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <TrendingUp className="w-5 h-5" />
        Performance Degradation Analysis
      </h3>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <DegradationStat
          label="Normal Accuracy"
          value={metrics.performanceDegradation.normalAccuracy.toFixed(1)}
          color="text-green-400"
        />
        <DegradationStat
          label="Stressed Accuracy"
          value={metrics.performanceDegradation.stressedAccuracy.toFixed(1)}
          color="text-yellow-400"
        />
        <DegradationStat
          label="Degradation Rate"
          value={metrics.performanceDegradation.degradationRate.toFixed(1)}
          color={getDegradationColor(degradationStatus)}
        />
      </div>

      <DegradationInsights status={degradationStatus} />
    </div>
  );
}

interface DegradationStatProps {
  label: string;
  value: string;
  color: string;
}

function DegradationStat({ label, value, color }: DegradationStatProps) {
  return (
    <div className="bg-gray-900/50 rounded-lg p-4">
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${color}`}>{value}%</div>
    </div>
  );
}

// Degradation Insights
function DegradationInsights({ status }: { status: string }) {
  const insights: Record<
    string,
    { color: string; border: string; icon: React.ReactNode; message: string }
  > = {
    excellent: {
      color: "text-green-400",
      border: "bg-green-900/20 border-green-700",
      icon: <Award className="w-4 h-4" />,
      message:
        "Excellent! Your performance under stress is near baseline. Keep it up!",
    },
    good: {
      color: "text-yellow-400",
      border: "bg-yellow-900/20 border-yellow-700",
      icon: <TrendingUp className="w-4 h-4" />,
      message: "Good stress management. Minor performance drop is normal.",
    },
    fair: {
      color: "text-orange-400",
      border: "bg-orange-900/20 border-orange-700",
      icon: <Target className="w-4 h-4" />,
      message:
        "Moderate degradation. Practice more stress scenarios to improve resilience.",
    },
    "needs-improvement": {
      color: "text-red-400",
      border: "bg-red-900/20 border-red-700",
      icon: <Zap className="w-4 h-4" />,
      message:
        "Significant degradation under stress. Focus on lower stress levels first.",
    },
  };

  const insight = insights[status];
  if (!insight) return null;

  return (
    <div className="space-y-2">
      <div className={`p-3 ${insight.border} border rounded-lg`}>
        <div className={`flex items-center gap-2 ${insight.color}`}>
          {insight.icon}
          <span className="text-sm font-medium">{insight.message}</span>
        </div>
      </div>
    </div>
  );
}

// Next Steps Section
interface NextStepsProps {
  toleranceLevel: string;
  toleranceIndex: number;
}

export function NextSteps({ toleranceLevel, toleranceIndex }: NextStepsProps) {
  return (
    <div className="bg-gradient-to-r from-blue-900/20 to-purple-900/20 border border-blue-700 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-white mb-3">Next Steps</h3>
      {toleranceIndex < 4 ? (
        <p className="text-gray-300 text-sm">
          Complete{" "}
          <span className="font-semibold text-white">
            3 successful sessions
          </span>{" "}
          at{" "}
          <span className="font-semibold capitalize text-white">
            {STRESS_LEVEL_LABELS[toleranceLevel]}
          </span>{" "}
          level to unlock{" "}
          <span className="font-semibold capitalize text-white">
            {STRESS_LEVEL_LABELS[STRESS_LEVELS[toleranceIndex + 1]]}
          </span>{" "}
          stress scenarios.
        </p>
      ) : (
        <p className="text-gray-300 text-sm">
          🎉{" "}
          <span className="font-semibold text-white">
            Maximum stress tolerance achieved!
          </span>{" "}
          You can handle extreme pressure scenarios. Keep practicing to maintain
          your skills.
        </p>
      )}
    </div>
  );
}
