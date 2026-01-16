/**
 * AARForm - Mandatory After Action Review
 * 6-question structured reflection required before progression
 * Refactored to use extracted components and custom hook for ESLint compliance
 */

import type { AAR } from '../../types/training';
import { MIN_OBJECTIVE_WORDS, MIN_ITEMS, MIN_ROOT_CAUSES, MIN_IMPROVEMENTS, MIN_KNOWLEDGE_WORDS } from './AARFormUtils';
import { AARHeader, AARInfoBanner, TextFieldWithCount, ArrayInputField, ValidationMessages, AARFormActions } from './AARFormComponents';
import { useAARForm } from './useAARForm';

interface AARFormProps {
  contentId: string;
  contentType: 'lesson' | 'lab' | 'drill';
  contentTitle: string;
  onSubmit: (aarData: Omit<AAR, 'id' | 'userId' | 'createdAt' | 'aiReviewed'>) => Promise<void>;
  onCancel?: () => void;
}

export default function AARForm({ contentId, contentType, contentTitle, onSubmit, onCancel }: AARFormProps) {
  const form = useAARForm({ contentId, contentType, onSubmit });

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-xl border-2 border-indigo-500 max-w-4xl w-full my-8">
        <AARHeader contentTitle={contentTitle} />
        <AARInfoBanner />
        <form onSubmit={form.handleSubmit} className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
          <TextFieldWithCount
            label={`1. What was the objective of this ${contentType}? (minimum ${MIN_OBJECTIVE_WORDS} words)`}
            value={form.objective} onChange={form.setObjective}
            placeholder="Describe what you were trying to accomplish and why it matters..."
            minWords={MIN_OBJECTIVE_WORDS}
          />
          <ArrayInputField
            label={`2. What worked well? (minimum ${MIN_ITEMS} items)`}
            items={form.whatWorked} minItems={MIN_ITEMS}
            onItemChange={form.updateWhatWorked} onAddItem={form.addWhatWorked}
            placeholder={(i) => `Success #${i + 1}: What approach, tool, or technique worked?`}
            addLabel="Add another success"
          />
          <ArrayInputField
            label={`3. What didn't work? (minimum ${MIN_ROOT_CAUSES} items)`}
            items={form.whatDidntWork} minItems={MIN_ROOT_CAUSES}
            onItemChange={form.updateWhatDidntWork} onAddItem={form.addWhatDidntWork}
            placeholder={(i) => `Challenge #${i + 1}: What failed or didn't go as expected?`}
            addLabel="Add another challenge"
          />
          <ArrayInputField
            label={`4. Why didn't it work? Root causes (minimum ${MIN_ROOT_CAUSES} items)`}
            items={form.rootCauses} minItems={MIN_ROOT_CAUSES} maxItems={5}
            onItemChange={form.updateRootCauses} onAddItem={form.addRootCauses}
            placeholder={(i) => `Root cause #${i + 1}: Explain the underlying reason for the failure...`}
            addLabel="Add another root cause" isTextarea
          />
          <ArrayInputField
            label={`5. What would you do differently next time? (minimum ${MIN_IMPROVEMENTS} items)`}
            items={form.improvements} minItems={MIN_IMPROVEMENTS} maxItems={5}
            onItemChange={form.updateImprovements} onAddItem={form.addImprovements}
            placeholder={(i) => `Improvement #${i + 1}: Specific action you'll take differently...`}
            addLabel="Add another improvement" isTextarea
          />
          <TextFieldWithCount
            label={`6. What knowledge can you use in future situations? (minimum ${MIN_KNOWLEDGE_WORDS} words)`}
            value={form.transferableKnowledge} onChange={form.setTransferableKnowledge}
            placeholder="Describe the principles, patterns, or insights you can apply to other problems..."
            minWords={MIN_KNOWLEDGE_WORDS} rows={4}
          />
          <ValidationMessages
            showValidation={form.showValidation} isValid={form.isValid}
            objective={form.objective} whatWorked={form.whatWorked} whatDidntWork={form.whatDidntWork}
            rootCauses={form.rootCauses} improvements={form.improvements} transferableKnowledge={form.transferableKnowledge}
          />
        </form>
        <AARFormActions isValid={form.isValid} submitting={form.submitting} onSubmit={form.handleSubmit} onCancel={onCancel} />
      </div>
    </div>
  );
}
