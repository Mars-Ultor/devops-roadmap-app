/**
 * StressSessionPanel - UI Components
 */

import {
  Activity,
  Brain,
  Clock,
  AlertTriangle,
  Zap,
  CheckCircle2,
} from "lucide-react";
import type { StressTrainingSession } from "../../types/training";
import {
  formatTime,
  getStressColor,
  getStressBarColor,
  getFocusColor,
  getFocusBarColor,
  getTimeColor,
  getTimeBarColor,
  formatConditionType,
} from "./StressSessionPanelUtils";

// Scenario Header
interface ScenarioHeaderProps {
  readonly title: string;
  readonly description: string;
}

export function ScenarioHeader({ title, description }: ScenarioHeaderProps) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-white mb-2">{title}</h2>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

// Metric Card Base
interface MetricCardProps {
  readonly icon: React.ReactNode;
  readonly label: string;
  readonly value: number;
  readonly valueColor: string;
  readonly barColor: string;
  readonly barValue: number;
  readonly className?: string;
}

function MetricCard({
  icon,
  label,
  value,
  valueColor,
  barColor,
  barValue,
  className = "",
}: MetricCardProps) {
  return (
    <div className={`bg-gray-900/50 rounded-lg p-4 ${className}`}>
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-sm text-gray-400">{label}</span>
      </div>
      <div className={`text-3xl font-bold ${valueColor}`}>
        {Math.round(value)}
      </div>
      <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${barColor}`}
          style={{ width: `${barValue}%` }}
        />
      </div>
    </div>
  );
}

// Physiological Metrics Grid
interface MetricsGridProps {
  readonly session: StressTrainingSession;
  readonly remainingSeconds: number;
  readonly timeProgress: number;
  readonly isTimeWarning: boolean;
  readonly isTimeCritical: boolean;
}

export function MetricsGrid({
  session,
  remainingSeconds,
  timeProgress,
  isTimeWarning,
  isTimeCritical,
}: MetricsGridProps) {
  return (
    <div className="grid grid-cols-4 gap-4 mb-6">
      <MetricCard
        icon={<Zap className="w-4 h-4 text-gray-400" />}
        label="Stress"
        value={session.stressScore}
        valueColor={getStressColor(session.stressScore)}
        barColor={getStressBarColor(session.stressScore)}
        barValue={session.stressScore}
      />

      <MetricCard
        icon={<Activity className="w-4 h-4 text-gray-400" />}
        label="Fatigue"
        value={session.fatigueLevel}
        valueColor="text-gray-300"
        barColor="bg-gray-500"
        barValue={session.fatigueLevel}
      />

      <MetricCard
        icon={<Brain className="w-4 h-4 text-gray-400" />}
        label="Focus"
        value={session.focusLevel}
        valueColor={getFocusColor(session.focusLevel)}
        barColor={getFocusBarColor(session.focusLevel)}
        barValue={session.focusLevel}
      />

      <TimeMetric
        remainingSeconds={remainingSeconds}
        timeProgress={timeProgress}
        isTimeWarning={isTimeWarning}
        isTimeCritical={isTimeCritical}
      />
    </div>
  );
}

// Time Metric (special case)
interface TimeMetricProps {
  readonly remainingSeconds: number;
  readonly timeProgress: number;
  readonly isTimeWarning: boolean;
  readonly isTimeCritical: boolean;
}

function getRingClass(isTimeCritical: boolean, isTimeWarning: boolean): string {
  if (isTimeCritical) return "ring-2 ring-red-500 animate-pulse";
  if (isTimeWarning) return "ring-2 ring-yellow-500";
  return "";
}

function TimeMetric({
  remainingSeconds,
  timeProgress,
  isTimeWarning,
  isTimeCritical,
}: TimeMetricProps) {
  const ringClass = getRingClass(isTimeCritical, isTimeWarning);

  return (
    <div className={`bg-gray-900/50 rounded-lg p-4 ${ringClass}`}>
      <div className="flex items-center gap-2 mb-2">
        <Clock className="w-4 h-4 text-gray-400" />
        <span className="text-sm text-gray-400">Time Left</span>
      </div>
      <div
        className={`text-3xl font-bold ${getTimeColor(isTimeCritical, isTimeWarning)}`}
      >
        {formatTime(remainingSeconds)}
      </div>
      <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-1000 ${getTimeBarColor(isTimeCritical, isTimeWarning)}`}
          style={{ width: `${Math.min(100, timeProgress)}%` }}
        />
      </div>
    </div>
  );
}

// Active Conditions Section
interface ActiveConditionsProps {
  readonly conditions: StressTrainingSession["scenario"]["conditions"];
}

export function ActiveConditions({ conditions }: ActiveConditionsProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">
        ACTIVE CONDITIONS
      </h3>
      <div className="grid grid-cols-2 gap-3">
        {conditions.map((condition) => (
          <div
            key={condition.type}
            className="flex items-start gap-3 p-3 bg-gray-900/30 rounded border border-gray-700"
          >
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div>
              <div className="text-sm font-medium text-white mb-1">
                {formatConditionType(condition.type)}
              </div>
              <div className="text-xs text-gray-400">
                {condition.description}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Success Criteria Section
interface SuccessCriteriaProps {
  readonly criteria: string[];
  readonly tasksCompleted: number;
}

export function SuccessCriteria({
  criteria,
  tasksCompleted,
}: SuccessCriteriaProps) {
  return (
    <div className="mb-6">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">
        SUCCESS CRITERIA
      </h3>
      <div className="space-y-2">
        {criteria.map((criterion, index) => {
          const isComplete = index < tasksCompleted;
          return (
            <div
              key={index} // eslint-disable-line react/no-array-index-key
              className={`flex items-center gap-3 p-3 rounded ${
                isComplete
                  ? "bg-green-900/20 border border-green-700"
                  : "bg-gray-900/30 border border-gray-700"
              }`}
            >
              {isComplete ? (
                <CheckCircle2 className="w-5 h-5 text-green-400 flex-shrink-0" />
              ) : (
                <div className="w-5 h-5 rounded-full border-2 border-gray-600 flex-shrink-0" />
              )}
              <span
                className={`text-sm ${isComplete ? "text-green-300 line-through" : "text-gray-300"}`}
              >
                {criterion}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Progress Section
interface ProgressSectionProps {
  readonly tasksCompleted: number;
  readonly totalTasks: number;
  readonly errorsCount: number;
}

export function ProgressSection({
  tasksCompleted,
  totalTasks,
  errorsCount,
}: ProgressSectionProps) {
  return (
    <div className="bg-gray-900/50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-400">Progress</span>
        <span className="text-sm font-semibold text-white">
          {tasksCompleted} / {totalTasks} Complete
        </span>
      </div>
      <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
          style={{ width: `${(tasksCompleted / totalTasks) * 100}%` }}
        />
      </div>
      {errorsCount > 0 && (
        <div className="mt-2 text-xs text-orange-400">
          ⚠️ {errorsCount} error{errorsCount === 1 ? "" : "s"} encountered
        </div>
      )}
    </div>
  );
}

// Warning Messages
interface WarningMessagesProps {
  readonly isTimeWarning: boolean;
  readonly isTimeCritical: boolean;
}

export function WarningMessages({
  isTimeWarning,
  isTimeCritical,
}: WarningMessagesProps) {
  return (
    <>
      {isTimeWarning && !isTimeCritical && (
        <div className="mt-4 p-3 bg-yellow-900/20 border border-yellow-700 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">
              TIME WARNING: Less than 25% time remaining
            </span>
          </div>
        </div>
      )}

      {isTimeCritical && (
        <div className="mt-4 p-3 bg-red-900/20 border border-red-700 rounded-lg animate-pulse">
          <div className="flex items-center gap-2 text-red-400">
            <AlertTriangle className="w-4 h-4" />
            <span className="text-sm font-medium">
              CRITICAL: Less than 10% time remaining!
            </span>
          </div>
        </div>
      )}
    </>
  );
}
