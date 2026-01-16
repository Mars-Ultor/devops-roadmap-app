/**
 * Component for rendering Run-Independent level content
 */

import RunIndependentWorkspace from './RunIndependentWorkspace';
import type { RunIndependentContent } from '../types/lessonContent';

interface RunIndependentLevelContentProps {
  content: RunIndependentContent;
  onSubmit: () => void;
  onSaveDraft: (draft: string) => void;
  savedDraft: string;
}

export function RunIndependentLevelContent({
  content,
  onSubmit,
  onSaveDraft,
  savedDraft
}: RunIndependentLevelContentProps) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-800 rounded-lg p-6 border border-purple-600">
        <h2 className="text-xl font-semibold mb-4 text-purple-400">Mission Objective</h2>
        <p className="text-white text-lg font-medium">{content.objective}</p>
      </div>

      {/* Workspace Component */}
      <RunIndependentWorkspace
        objective={content.objective}
        companyProfile={content.companyProfile}
        successCriteria={content.successCriteria || []}
        timeTarget={content.timeTarget}
        minimumRequirements={content.minimumRequirements}
        evaluationRubric={content.evaluationRubric}
        onSubmit={onSubmit}
        onSaveDraft={onSaveDraft}
        savedDraft={savedDraft}
      />
    </div>
  );
}