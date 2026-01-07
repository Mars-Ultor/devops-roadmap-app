/**
 * MandatoryAARModal - Blocks navigation until AAR is submitted
 * Refactored to use extracted components and custom hook
 */

import { MIN_WORD_COUNTS } from './MandatoryAARUtils';
import {
  AARHeader,
  ErrorsDisplay,
  AIFeedbackDisplay,
  TextAreaField,
  ArrayField,
  AARFooter
} from './MandatoryAARComponents';
import { useMandatoryAAR } from './useMandatoryAAR';
import type { AARData } from './MandatoryAARUtils';

interface MandatoryAARModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (aar: AARData) => Promise<void>;
  labTitle: string;
}

export default function MandatoryAARModal({ isOpen, onClose, onSubmit, labTitle }: MandatoryAARModalProps) {
  const {
    formData, errors, submitting, aiErrors, showAIFeedback,
    updateField, addWorkItem, addDidntWorkItem, handleSubmit
  } = useMandatoryAAR({ onSubmit, onClose });

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-3xl w-full my-8">
        <AARHeader labTitle={labTitle} />

        <div className="p-6">
          <ErrorsDisplay errors={errors} />
          <AIFeedbackDisplay aiErrors={aiErrors} showAIFeedback={showAIFeedback} />

          <div className="space-y-6">
            <TextAreaField
              label="1. What was I trying to accomplish?"
              minWords={MIN_WORD_COUNTS.objective}
              value={formData.objective}
              onChange={(v) => updateField('objective', v)}
              placeholder="Describe the objective of this lab in 2-3 sentences..."
            />

            <ArrayField
              label="2. What worked well?"
              minItems={3}
              minWords={MIN_WORD_COUNTS.whatWorked}
              items={formData.whatWorked}
              onChange={(items) => updateField('whatWorked', items)}
              onAdd={addWorkItem}
              addLabel="Add another success"
              placeholderBase="Success - Be specific about what worked and why"
              icon="success"
            />

            <ArrayField
              label="3. What didn't work?"
              minItems={2}
              minWords={MIN_WORD_COUNTS.whatDidntWork}
              items={formData.whatDidntWork}
              onChange={(items) => updateField('whatDidntWork', items)}
              onAdd={addDidntWorkItem}
              addLabel="Add another failure/struggle"
              placeholderBase="Failure/Struggle - What went wrong and what you tried"
              icon="failure"
            />

            <TextAreaField
              label="4. Why didn't it work? (Root cause, not symptoms)"
              minWords={MIN_WORD_COUNTS.rootCause}
              value={formData.rootCause}
              onChange={(v) => updateField('rootCause', v)}
              placeholder="Analyze the root cause - not just 'it didn't work' but WHY it didn't work..."
              hasAIError={!!aiErrors.rootCause}
              rows={4}
            />

            <TextAreaField
              label="5. What would I do differently next time?"
              minWords={MIN_WORD_COUNTS.nextTime}
              value={formData.nextTime}
              onChange={(v) => updateField('nextTime', v)}
              placeholder="Specific changes you'll make when facing similar challenges..."
              hasAIError={!!aiErrors.nextTime}
            />

            <TextAreaField
              label="6. What did I learn that I can use in future tasks?"
              minWords={MIN_WORD_COUNTS.transferableKnowledge}
              value={formData.transferableKnowledge}
              onChange={(v) => updateField('transferableKnowledge', v)}
              placeholder="What knowledge from this lab applies to other DevOps scenarios?..."
              hasAIError={!!aiErrors.transferableKnowledge}
              rows={4}
            />
          </div>

          <AARFooter submitting={submitting} onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  );
}
