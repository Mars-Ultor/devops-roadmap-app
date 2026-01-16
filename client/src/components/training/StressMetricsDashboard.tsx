/**
 * Stress Metrics Dashboard Component
 * Historical stress performance analytics
 */

import type { StressMetrics } from '../../types/training';
import { getDegradationStatus, STRESS_LEVELS } from './StressMetricsDashboardUtils';
import {
  OverviewStats,
  SessionsByLevel,
  DegradationAnalysis,
  NextSteps
} from './StressMetricsDashboardComponents';

interface StressMetricsDashboardProps {
  metrics: StressMetrics;
}

export function StressMetricsDashboard({ metrics }: StressMetricsDashboardProps) {
  const toleranceLevel = metrics.stressToleranceLevel;
  const toleranceIndex = STRESS_LEVELS.indexOf(toleranceLevel);
  const degradationStatus = getDegradationStatus(metrics.performanceDegradation.degradationRate);

  return (
    <div className="space-y-6">
      <OverviewStats metrics={metrics} />
      <SessionsByLevel metrics={metrics} />
      <DegradationAnalysis metrics={metrics} degradationStatus={degradationStatus} />
      <NextSteps toleranceLevel={toleranceLevel} toleranceIndex={toleranceIndex} />
    </div>
  );
}
