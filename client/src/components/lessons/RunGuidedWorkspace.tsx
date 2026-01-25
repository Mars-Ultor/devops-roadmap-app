/**
 * RunGuidedWorkspace - Workspace for completing run-guided level tasks
 * Provides checkpoint-based work tracking with hints available
 */

import { useState, useEffect, useCallback } from "react";
import { Sparkles, Send } from "lucide-react";
import LabTerminal from "../LabTerminal";
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
  readonly terminalEnabled?: boolean;
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

// Extract terminal component to reduce main function length
function PracticeTerminal({ lessonId }: { lessonId: string }) {
  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-semibold mb-4 text-green-400">
        Linux Terminal Practice
      </h3>
      <p className="text-slate-300 mb-4">
        Use this simulated Linux terminal to practice the commands you'll document below.
        Available commands: pwd, ls, cd, mkdir, touch, cat, chmod, echo, clear, help
      </p>
      <div className="bg-slate-900 rounded border border-slate-600 p-2">
        <LabTerminal
          labId={`${lessonId}-practice`}
          tasks={[]} // No specific tasks for practice terminal
          onTaskComplete={() => {}} // No task completion tracking needed
          onLabComplete={() => {}} // No lab completion needed
        />
      </div>
    </div>
  );
}

// Custom hook for RunGuided workspace state management
function useRunGuidedState(lessonId: string, onSaveDraft: (responses: Record<string, string>, notes: string) => void) {
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

  return {
    responses,
    setResponses,
    generalNotes,
    setGeneralNotes,
    completedCheckpoints,
    setCompletedCheckpoints,
    elapsedTime,
    hintsUsed,
    setHintsUsed,
    handleSaveDraft,
  };
}

export default function RunGuidedWorkspace({
  lessonId,
  checkpoints,
  resourcesAllowed,
  terminalEnabled = false,
  onSubmit,
  onSaveDraft,
}: RunGuidedWorkspaceProps) {
  const {
    responses,
    setResponses,
    generalNotes,
    setGeneralNotes,
    completedCheckpoints,
    setCompletedCheckpoints,
    elapsedTime,
    hintsUsed,
    setHintsUsed,
    handleSaveDraft,
  } = useRunGuidedState(lessonId, onSaveDraft);

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

      {/* Terminal for hands-on practice */}
      {terminalEnabled && <PracticeTerminal lessonId={lessonId} />}

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
