/**
 * TCS (Task, Conditions, Standards) Display Component
 * Phase 11: Military-style task definition for every lab
 * 
 * Displays:
 * - TASK: What you will accomplish
 * - CONDITIONS: Resources, time limits, restrictions
 * - STANDARDS: Pass/fail criteria checklist
 */

import { type TCSTask } from './TCSDisplayUtils';
import {
  TCSHeader,
  TaskSection,
  ConditionsSection,
  StandardsSection
} from './TCSDisplayComponents';

interface TCSDisplayProps {
  tcs: TCSTask;
  onStandardCheck?: (standardId: string, met: boolean) => void;
  readOnly?: boolean;
}

export default function TCSDisplay({ tcs, onStandardCheck, readOnly = false }: TCSDisplayProps) {
  const allRequiredMet = tcs.standards
    .filter(s => s.required)
    .every(s => s.met === true);

  return (
    <div className="bg-slate-800 rounded-lg border-2 border-indigo-500 overflow-hidden">
      <TCSHeader />

      <div className="p-6 space-y-6">
        <TaskSection task={tcs.task} />
        <ConditionsSection conditions={tcs.conditions} />
        <StandardsSection
          standards={tcs.standards}
          allRequiredMet={allRequiredMet}
          readOnly={readOnly}
          onStandardCheck={onStandardCheck}
        />
      </div>
    </div>
  );
}

// Re-export types for consumers
export type { TCSTask, TCSStandard } from './TCSDisplayUtils';
