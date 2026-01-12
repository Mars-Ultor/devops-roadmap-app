/**
 * Component for rendering Run-Guided level content
 */

import RunGuidedWorkspace from './RunGuidedWorkspace';
import type { RunGuidedContent } from '../types/lessonContent';

interface RunGuidedLevelContentProps {
  content: RunGuidedContent;
  lessonId: string;
  onSubmit: (responses: Record<string, string>, notes: string, hintsUsed: number) => void;
  onSaveDraft: (responses: Record<string, string>, notes: string) => void;
}

export function RunGuidedLevelContent({
  content,
  lessonId,
  onSubmit,
  onSaveDraft
}: RunGuidedLevelContentProps) {
  return (
    <div className="space-y-6">
      {/* Objective */}
      <div className="bg-slate-800 rounded-lg p-6 border border-cyan-600">
        <h2 className="text-xl font-semibold mb-4 text-cyan-400">Objective</h2>
        <p className="text-white text-lg">{content.objective}</p>
      </div>

      {/* Conceptual Guidance */}
      {content.conceptualGuidance && content.conceptualGuidance.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="font-semibold mb-3 text-yellow-400">Conceptual Guidance</h3>
          <ul className="space-y-2">
            {content.conceptualGuidance.map((guidance) => (
              <li key={guidance} className="text-slate-300 flex items-start">
                <span className="text-yellow-400 mr-2">→</span>
                {guidance}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Key Concepts */}
      {content.keyConceptsToApply && content.keyConceptsToApply.length > 0 && (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="font-semibold mb-3 text-purple-400">Key Concepts to Apply</h3>
          <ul className="space-y-2">
            {content.keyConceptsToApply.map((concept) => (
              <li key={concept} className="text-slate-300 flex items-start">
                <span className="text-purple-400 mr-2">▸</span>
                {concept}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Workspace with Checkpoints */}
      {content.checkpoints && content.checkpoints.length > 0 && (
        <RunGuidedWorkspace
          lessonId={lessonId}
          checkpoints={content.checkpoints}
          resourcesAllowed={content.resourcesAllowed}
          onSubmit={onSubmit}
          onSaveDraft={onSaveDraft}
        />
      )}
    </div>
  );
}