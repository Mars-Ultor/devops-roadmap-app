/**
 * RunGuidedWorkspace - Workspace for completing run-guided level tasks
 * Provides checkpoint-based work tracking with hints available
 */

import { useState, useEffect, useCallback } from "react";
import { Sparkles, Send } from "lucide-react";
import {
  RunGuidedTimerBar,
  CheckpointCard,
  AllowedResources,
  GeneralNotesEditor,
} from "./RunGuidedComponents";

interface Checkpoint {
  checkpoint: string;
  description: string;
  validationCriteria?: string[];
  hintIfStuck?: string;
}

interface RunGuidedWorkspaceProps {
  readonly lessonId: string;
  readonly checkpoints: Checkpoint[];
  readonly resourcesAllowed?: string[];
  readonly onSubmit: (
    responses: Record<string, string>,
    notes: string,
    hintsUsed: number,
  ) => void;
  readonly onSaveDraft: (
    responses: Record<string, string>,
    notes: string,
  ) => void;
}

function loadSavedData(lessonId: string) {
  const saved = localStorage.getItem(`run-guided-draft-${lessonId}`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return { responses: {}, notes: "", completedCheckpoints: [] };
    }
  }
  return { responses: {}, notes: "", completedCheckpoints: [] };
}

export default function RunGuidedWorkspace({
  lessonId,
  checkpoints,
  resourcesAllowed,
  onSubmit,
  onSaveDraft,
}: RunGuidedWorkspaceProps) {
  const savedData = loadSavedData(lessonId);

  const [responses, setResponses] = useState<Record<string, string>>(
    savedData.responses || {},
  );
  const [generalNotes, setGeneralNotes] = useState(savedData.notes || "");
  const [completedCheckpoints, setCompletedCheckpoints] = useState<Set<number>>(
    new Set(savedData.completedCheckpoints || []),
  );
  const [elapsedTime, setElapsedTime] = useState(0);
  const [hintsUsed, setHintsUsed] = useState(0);

  const handleSaveDraft = useCallback(() => {
    const data = {
      responses,
      notes: generalNotes,
      completedCheckpoints: Array.from(completedCheckpoints),
    };
    localStorage.setItem(`run-guided-draft-${lessonId}`, JSON.stringify(data));
    onSaveDraft(responses, generalNotes);
  }, [responses, generalNotes, completedCheckpoints, lessonId, onSaveDraft]);

  useEffect(() => {
    const interval = setInterval(
      () => setElapsedTime((prev) => prev + 1),
      1000,
    );
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const timeout = setTimeout(handleSaveDraft, 30000);
    return () => clearTimeout(timeout);
  }, [handleSaveDraft]);

  const totalWordCount =
    Object.values(responses).join(" ").trim().split(/\s+/).filter(Boolean)
      .length + generalNotes.trim().split(/\s+/).filter(Boolean).length;
  const allComplete = completedCheckpoints.size === checkpoints.length;
  const canSubmit = allComplete && totalWordCount >= 50;

  return (
    <div className="space-y-6">
      <RunGuidedTimerBar
        elapsedTime={elapsedTime}
        wordCount={totalWordCount}
        completedCheckpoints={completedCheckpoints.size}
        totalCheckpoints={checkpoints.length}
        onSaveDraft={handleSaveDraft}
      />

      {resourcesAllowed && resourcesAllowed.length > 0 && (
        <AllowedResources resources={resourcesAllowed} />
      )}

      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-white">Checkpoints</h3>
        {checkpoints.map((cp, i) => (
          <CheckpointCard
            key={`cp-${cp.checkpoint}`}
            checkpoint={cp}
            index={i}
            isComplete={completedCheckpoints.has(i)}
            response={responses[cp.checkpoint] || ""}
            onToggleComplete={() => {
              const newSet = new Set(completedCheckpoints);
              if (newSet.has(i)) newSet.delete(i);
              else newSet.add(i);
              setCompletedCheckpoints(newSet);
            }}
            onResponseChange={(v) =>
              setResponses((prev) => ({ ...prev, [cp.checkpoint]: v }))
            }
            onHintUsed={() => setHintsUsed((prev) => prev + 1)}
          />
        ))}
      </div>

      <GeneralNotesEditor notes={generalNotes} onChange={setGeneralNotes} />

      <div className="flex items-center justify-between">
        <span
          className={`text-sm ${canSubmit ? "text-green-400" : "text-amber-400"}`}
        >
          {canSubmit
            ? "✓ Ready to submit"
            : `⚠️ ${checkpoints.length - completedCheckpoints.size} checkpoint(s) incomplete`}
        </span>
        <button
          onClick={() =>
            canSubmit && onSubmit(responses, generalNotes, hintsUsed)
          }
          disabled={!canSubmit}
          className={`flex items-center space-x-2 px-6 py-3 rounded-lg font-semibold transition ${
            canSubmit
              ? "bg-cyan-600 hover:bg-cyan-700 text-white"
              : "bg-slate-700 text-slate-500 cursor-not-allowed"
          }`}
        >
          <Sparkles className="w-5 h-5" />
          <span>Submit</span>
          <Send className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
