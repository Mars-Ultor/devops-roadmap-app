/**
 * After Action Review (AAR) Form Component
 * Mandatory structured reflection after every lab completion
 */

import { AARTextField, AARListField } from './AARFormFields';
import { AARFormHeader, AARValidationSummary, AARFormActions } from './AARFormComponents';
import { useAARFormState } from './useAARFormState';

/** AAR mastery level type */
export type AARLevel = 'crawl' | 'walk' | 'run-guided' | 'run-independent';

interface AARFormProps {
  readonly userId: string;
  readonly lessonId: string;
  readonly level: AARLevel;
  readonly labId: string;
  readonly onComplete: (aarId: string) => void;
  readonly onCancel?: () => void;
  readonly onError?: (error: Error) => void;
}

export default function AARForm({
  userId,
  lessonId,
  level,
  labId,
  onComplete,
  onCancel,
  onError
}: Readonly<AARFormProps>) {
  const {
    formData,
    validation,
    isSubmitting,
    showValidation,
    submitError,
    handleTextChange,
    handleListItemChange,
    addListItem,
    removeListItem,
    handleSubmit
  } = useAARFormState({ userId, lessonId, level, labId, onComplete, onError });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-slate-800 rounded-lg shadow-xl">
        <AARFormHeader lessonId={lessonId} level={level} />
        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          <AARTextField field="whatWasAccomplished" label="1. What was I trying to accomplish?"
            placeholder="Describe the objective of this lab in 2-3 sentences. What was the expected outcome?"
            minWords={20} value={formData.whatWasAccomplished} onChange={(v) => handleTextChange('whatWasAccomplished', v)}
            showValidation={showValidation} validation={validation} rows={4} />
          <AARListField field="whatWorkedWell" label="2. What worked well?" placeholder="Specific thing that went well"
            minItems={3} items={formData.whatWorkedWell} onItemChange={(i, v) => handleListItemChange('whatWorkedWell', i, v)}
            onAddItem={() => addListItem('whatWorkedWell')} onRemoveItem={(i) => removeListItem('whatWorkedWell', i)}
            showValidation={showValidation} validation={validation} />
          <AARListField field="whatDidNotWork" label="3. What didn't work?" placeholder="Specific problem or struggle encountered"
            minItems={2} items={formData.whatDidNotWork} onItemChange={(i, v) => handleListItemChange('whatDidNotWork', i, v)}
            onAddItem={() => addListItem('whatDidNotWork')} onRemoveItem={(i) => removeListItem('whatDidNotWork', i)}
            showValidation={showValidation} validation={validation} />
          <AARTextField field="whyDidNotWork" label="4. Why didn't it work?"
            placeholder="Analyze the root causes, not just symptoms. What was the underlying reason for the failures?"
            minWords={15} value={formData.whyDidNotWork} onChange={(v) => handleTextChange('whyDidNotWork', v)}
            showValidation={showValidation} validation={validation} rows={4} />
          <AARTextField field="whatWouldIDoDifferently" label="5. What would I do differently next time?"
            placeholder="Specific changes to your approach, process, or preparation that would improve outcomes."
            minWords={15} value={formData.whatWouldIDoDifferently} onChange={(v) => handleTextChange('whatWouldIDoDifferently', v)}
            showValidation={showValidation} validation={validation} rows={4} />
          <AARTextField field="whatDidILearn" label="6. What did I learn that I can use in future tasks?"
            placeholder="Transferable knowledge or skills that apply beyond this specific lab."
            minWords={15} value={formData.whatDidILearn} onChange={(v) => handleTextChange('whatDidILearn', v)}
            showValidation={showValidation} validation={validation} rows={4} />
          {validation && <AARValidationSummary validation={validation} show={showValidation} />}
          {submitError && (
            <div className="p-4 rounded-md bg-red-900/50 border border-red-700" role="alert">
              <span className="text-red-400">{submitError}</span>
            </div>
          )}
          <AARFormActions onCancel={onCancel} isSubmitting={isSubmitting} isValid={validation?.isValid ?? false} />
        </form>
      </div>
    </div>
  );
}