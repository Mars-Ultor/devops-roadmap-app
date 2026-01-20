/**
 * StruggleLog - Mandatory documentation before accessing hints
 * Forces reflection on what's been tried and where user is stuck
 */

import { useState } from "react";
import {
  type StruggleEntry,
  INITIAL_FORM_STATE,
  validateForm,
  createEntry,
} from "./StruggleLogUtils";
import {
  StruggleLogHeader,
  WhyThisMatters,
  ErrorsDisplay,
  WhatTriedSection,
  WhereStuckSection,
  SuspectedProblemSection,
  ActionButtons,
} from "./StruggleLogComponents";

interface StruggleLogProps {
  onSubmit: (entry: StruggleEntry) => void;
  isOpen: boolean;
  onCancel?: () => void;
}

export default function StruggleLog({
  onSubmit,
  isOpen,
  onCancel,
}: StruggleLogProps) {
  const [whatTried, setWhatTried] = useState<string[]>(
    INITIAL_FORM_STATE.whatTried,
  );
  const [whereStuck, setWhereStuck] = useState(INITIAL_FORM_STATE.whereStuck);
  const [suspectedProblem, setSuspectedProblem] = useState(
    INITIAL_FORM_STATE.suspectedProblem,
  );
  const [errors, setErrors] = useState<string[]>(INITIAL_FORM_STATE.errors);

  if (!isOpen) return null;

  const handleSubmit = () => {
    const formState = { whatTried, whereStuck, suspectedProblem, errors };
    const validationErrors = validateForm(formState);

    if (validationErrors.length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(createEntry(formState));

    // Reset form
    setWhatTried(INITIAL_FORM_STATE.whatTried);
    setWhereStuck(INITIAL_FORM_STATE.whereStuck);
    setSuspectedProblem(INITIAL_FORM_STATE.suspectedProblem);
    setErrors(INITIAL_FORM_STATE.errors);
  };

  const updateTried = (index: number, value: string) => {
    const updated = [...whatTried];
    updated[index] = value;
    setWhatTried(updated);
  };

  const addMoreTried = () => {
    setWhatTried([...whatTried, ""]);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl border-2 border-indigo-500 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        <StruggleLogHeader />

        <div className="p-6 space-y-6">
          <WhyThisMatters />
          <ErrorsDisplay errors={errors} />
          <WhatTriedSection
            whatTried={whatTried}
            onUpdate={updateTried}
            onAddMore={addMoreTried}
          />
          <WhereStuckSection value={whereStuck} onChange={setWhereStuck} />
          <SuspectedProblemSection
            value={suspectedProblem}
            onChange={setSuspectedProblem}
          />
          <ActionButtons onCancel={onCancel} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}

// Re-export types for consumers
export type { StruggleEntry } from "./StruggleLogUtils";
