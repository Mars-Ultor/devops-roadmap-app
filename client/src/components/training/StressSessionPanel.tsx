/**
 * Stress Session Panel Component
 * Live session UI with physiological metrics
 */

import type { StressTrainingSession } from "../../types/training";
import { useStressSession } from "./useStressSession";
import {
  ScenarioHeader,
  MetricsGrid,
  ActiveConditions,
  SuccessCriteria,
  ProgressSection,
  WarningMessages,
} from "./StressSessionPanelComponents";

interface StressSessionPanelProps {
  session: StressTrainingSession;
}

export function StressSessionPanel({ session }: StressSessionPanelProps) {
  const { remainingSeconds, timeProgress, isTimeWarning, isTimeCritical } =
    useStressSession(session);

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-6">
      <ScenarioHeader
        title={session.scenario.title}
        description={session.scenario.description}
      />

      <MetricsGrid
        session={session}
        remainingSeconds={remainingSeconds}
        timeProgress={timeProgress}
        isTimeWarning={isTimeWarning}
        isTimeCritical={isTimeCritical}
      />

      <ActiveConditions conditions={session.scenario.conditions} />

      <SuccessCriteria
        criteria={session.scenario.successCriteria}
        tasksCompleted={session.tasksCompleted}
      />

      <ProgressSection
        tasksCompleted={session.tasksCompleted}
        totalTasks={session.totalTasks}
        errorsCount={session.errorsCount}
      />

      <WarningMessages
        isTimeWarning={isTimeWarning}
        isTimeCritical={isTimeCritical}
      />
    </div>
  );
}
