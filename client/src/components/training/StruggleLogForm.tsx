/**
 * StruggleLogForm - Mandatory reflection before requesting hints
 */

import { useState } from "react";
import type { StruggleLog } from "../../types/training";
import { validateStruggleLogForm } from "./StruggleLogFormUtils";
import {
  SubmittedState,
  FormHeader,
  LockedNotice,
  AttemptedSolutionsSection,
  StuckLocationSection,
  HypothesisSection,
  SubmitButton,
} from "./StruggleLogFormComponents";

interface StruggleLogFormProps {
  onSubmit: (log: StruggleLog) => Promise<void>;
  hintsUnlocked: boolean;
}

export default function StruggleLogForm({
  onSubmit,
  hintsUnlocked,
}: StruggleLogFormProps) {
  const [attemptedSolutions, setAttemptedSolutions] = useState<string[]>([
    "",
    "",
    "",
  ]);
  const [stuckLocation, setStuckLocation] = useState("");
  const [hypothesis, setHypothesis] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleAttemptChange = (index: number, value: string) => {
    const updated = [...attemptedSolutions];
    updated[index] = value;
    setAttemptedSolutions(updated);
  };

  const handleAddAttempt = () => {
    setAttemptedSolutions([...attemptedSolutions, ""]);
  };

  const validation = validateStruggleLogForm(
    attemptedSolutions,
    stuckLocation,
    hypothesis,
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid || !hintsUnlocked) return;

    setSubmitting(true);
    try {
      const log: StruggleLog = {
        attemptedSolutions: attemptedSolutions.filter((a) => a.trim()),
        stuckLocation: stuckLocation.trim(),
        hypothesis: hypothesis.trim(),
        createdAt: new Date(),
      };

      await onSubmit(log);
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting struggle log:", error);
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return <SubmittedState />;
  }

  return (
    <div className="bg-slate-800 border-2 border-slate-700 rounded-lg p-6">
      <FormHeader />
      <LockedNotice hintsUnlocked={hintsUnlocked} />

      <form onSubmit={handleSubmit} className="space-y-6">
        <AttemptedSolutionsSection
          attemptedSolutions={attemptedSolutions}
          hintsUnlocked={hintsUnlocked}
          onAttemptChange={handleAttemptChange}
          onAddAttempt={handleAddAttempt}
        />

        <StuckLocationSection
          value={stuckLocation}
          hintsUnlocked={hintsUnlocked}
          onChange={setStuckLocation}
        />

        <HypothesisSection
          value={hypothesis}
          hintsUnlocked={hintsUnlocked}
          onChange={setHypothesis}
        />

        <SubmitButton
          isValid={validation.isValid}
          hintsUnlocked={hintsUnlocked}
          submitting={submitting}
        />
      </form>
    </div>
  );
}
