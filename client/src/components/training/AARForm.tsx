/**
 * AARForm - Mandatory After Action Review
 * 6-question structured reflection required before progression
 */

import { useState } from 'react';
import { BookOpen, AlertCircle, CheckCircle } from 'lucide-react';
import type { AAR } from '../../types/training';

interface AARFormProps {
  contentId: string;
  contentType: 'lesson' | 'lab' | 'drill';
  contentTitle: string;
  onSubmit: (aarData: Omit<AAR, 'id' | 'userId' | 'createdAt' | 'aiReviewed'>) => Promise<void>;
  onCancel?: () => void;
}

const MIN_OBJECTIVE_WORDS = 20;
const MIN_ITEMS = 3;
const MIN_ROOT_CAUSES = 2;
const MIN_IMPROVEMENTS = 2;
const MIN_KNOWLEDGE_WORDS = 30;

export default function AARForm({
  contentId,
  contentType,
  contentTitle,
  onSubmit,
  onCancel
}: AARFormProps) {
  const [objective, setObjective] = useState('');
  const [whatWorked, setWhatWorked] = useState<string[]>(['', '', '']);
  const [whatDidntWork, setWhatDidntWork] = useState<string[]>(['', '']);
  const [rootCauses, setRootCauses] = useState<string[]>(['', '']);
  const [improvements, setImprovements] = useState<string[]>(['', '']);
  const [transferableKnowledge, setTransferableKnowledge] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(w => w.length > 0).length;
  };

  const updateArrayField = (
    array: string[],
    setter: (arr: string[]) => void,
    index: number,
    value: string
  ) => {
    const updated = [...array];
    updated[index] = value;
    setter(updated);
  };

  const addArrayField = (array: string[], setter: (arr: string[]) => void) => {
    setter([...array, '']);
  };

  const validateForm = () => {
    const objectiveWords = countWords(objective);
    const validWhatWorked = whatWorked.filter(w => w.trim().length > 0).length;
    const validWhatDidntWork = whatDidntWork.filter(w => w.trim().length > 0).length;
    const validRootCauses = rootCauses.filter(r => r.trim().length > 0).length;
    const validImprovements = improvements.filter(i => i.trim().length > 0).length;
    const knowledgeWords = countWords(transferableKnowledge);

    return (
      objectiveWords >= MIN_OBJECTIVE_WORDS &&
      validWhatWorked >= MIN_ITEMS &&
      validWhatDidntWork >= MIN_ROOT_CAUSES &&
      validRootCauses >= MIN_ROOT_CAUSES &&
      validImprovements >= MIN_IMPROVEMENTS &&
      knowledgeWords >= MIN_KNOWLEDGE_WORDS
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setShowValidation(true);
      return;
    }

    setSubmitting(true);
    try {
      const aarData: Omit<AAR, 'id' | 'userId' | 'createdAt' | 'aiReviewed'> = {
        [contentType === 'lesson' ? 'lessonId' : contentType === 'lab' ? 'labId' : 'drillId']: contentId,
        objective: objective.trim(),
        whatWorked: whatWorked.filter(w => w.trim().length > 0),
        whatDidntWork: whatDidntWork.filter(w => w.trim().length > 0),
        rootCauses: rootCauses.filter(r => r.trim().length > 0),
        improvements: improvements.filter(i => i.trim().length > 0),
        transferableKnowledge: transferableKnowledge.trim()
      };

      await onSubmit(aarData);
    } catch (error) {
      console.error('Error submitting AAR:', error);
      alert('Failed to submit AAR. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isValid = validateForm();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-xl border-2 border-indigo-500 max-w-4xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 rounded-t-xl">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-indigo-500 rounded-full flex items-center justify-center">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">After Action Review</h2>
              <p className="text-indigo-200 mt-1">
                Required for: {contentTitle}
              </p>
            </div>
          </div>
        </div>

        {/* Info Banner */}
        <div className="p-6 bg-indigo-900/30 border-b border-indigo-700">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-indigo-400 mt-0.5 flex-shrink-0" />
            <div className="text-sm text-indigo-100">
              <p className="font-semibold mb-1">Why AAR is Mandatory</p>
              <p>
                After Action Reviews are critical for deep learning. This structured reflection helps you 
                internalize lessons, identify patterns, and build transferable expertise. Complete all 6 questions 
                to proceed.
              </p>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[600px] overflow-y-auto">
          {/* Question 1: Objective */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              1. What was the objective of this {contentType}? (minimum {MIN_OBJECTIVE_WORDS} words)
            </label>
            <textarea
              value={objective}
              onChange={(e) => setObjective(e.target.value)}
              placeholder="Describe what you were trying to accomplish and why it matters..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={3}
            />
            <div className={`text-xs mt-1 ${
              countWords(objective) >= MIN_OBJECTIVE_WORDS ? 'text-green-400' : 'text-slate-500'
            }`}>
              {countWords(objective)}/{MIN_OBJECTIVE_WORDS} words {countWords(objective) >= MIN_OBJECTIVE_WORDS && '✓'}
            </div>
          </div>

          {/* Question 2: What Worked */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              2. What worked well? (minimum {MIN_ITEMS} items)
            </label>
            <div className="space-y-2">
              {whatWorked.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  value={item}
                  onChange={(e) => updateArrayField(whatWorked, setWhatWorked, index, e.target.value)}
                  placeholder={`Success #${index + 1}: What approach, tool, or technique worked?`}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ))}
            </div>
            {whatWorked.length < 10 && (
              <button
                type="button"
                onClick={() => addArrayField(whatWorked, setWhatWorked)}
                className="mt-2 text-sm text-indigo-400 hover:text-indigo-300"
              >
                + Add another success
              </button>
            )}
            <div className={`text-xs mt-1 ${
              whatWorked.filter(w => w.trim()).length >= MIN_ITEMS ? 'text-green-400' : 'text-slate-500'
            }`}>
              {whatWorked.filter(w => w.trim()).length}/{MIN_ITEMS} items {whatWorked.filter(w => w.trim()).length >= MIN_ITEMS && '✓'}
            </div>
          </div>

          {/* Question 3: What Didn't Work */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              3. What didn't work? (minimum {MIN_ROOT_CAUSES} items)
            </label>
            <div className="space-y-2">
              {whatDidntWork.map((item, index) => (
                <input
                  key={index}
                  type="text"
                  value={item}
                  onChange={(e) => updateArrayField(whatDidntWork, setWhatDidntWork, index, e.target.value)}
                  placeholder={`Challenge #${index + 1}: What failed or didn't go as expected?`}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              ))}
            </div>
            {whatDidntWork.length < 10 && (
              <button
                type="button"
                onClick={() => addArrayField(whatDidntWork, setWhatDidntWork)}
                className="mt-2 text-sm text-indigo-400 hover:text-indigo-300"
              >
                + Add another challenge
              </button>
            )}
            <div className={`text-xs mt-1 ${
              whatDidntWork.filter(w => w.trim()).length >= MIN_ROOT_CAUSES ? 'text-green-400' : 'text-slate-500'
            }`}>
              {whatDidntWork.filter(w => w.trim()).length}/{MIN_ROOT_CAUSES} items {whatDidntWork.filter(w => w.trim()).length >= MIN_ROOT_CAUSES && '✓'}
            </div>
          </div>

          {/* Question 4: Root Causes */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              4. Why didn't it work? Root causes (minimum {MIN_ROOT_CAUSES} items)
            </label>
            <div className="space-y-2">
              {rootCauses.map((item, index) => (
                <textarea
                  key={index}
                  value={item}
                  onChange={(e) => updateArrayField(rootCauses, setRootCauses, index, e.target.value)}
                  placeholder={`Root cause #${index + 1}: Explain the underlying reason for the failure...`}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                />
              ))}
            </div>
            {rootCauses.length < 5 && (
              <button
                type="button"
                onClick={() => addArrayField(rootCauses, setRootCauses)}
                className="mt-2 text-sm text-indigo-400 hover:text-indigo-300"
              >
                + Add another root cause
              </button>
            )}
            <div className={`text-xs mt-1 ${
              rootCauses.filter(r => r.trim()).length >= MIN_ROOT_CAUSES ? 'text-green-400' : 'text-slate-500'
            }`}>
              {rootCauses.filter(r => r.trim()).length}/{MIN_ROOT_CAUSES} items {rootCauses.filter(r => r.trim()).length >= MIN_ROOT_CAUSES && '✓'}
            </div>
          </div>

          {/* Question 5: Improvements */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              5. What would you do differently next time? (minimum {MIN_IMPROVEMENTS} items)
            </label>
            <div className="space-y-2">
              {improvements.map((item, index) => (
                <textarea
                  key={index}
                  value={item}
                  onChange={(e) => updateArrayField(improvements, setImprovements, index, e.target.value)}
                  placeholder={`Improvement #${index + 1}: Specific action you'll take differently...`}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows={2}
                />
              ))}
            </div>
            {improvements.length < 5 && (
              <button
                type="button"
                onClick={() => addArrayField(improvements, setImprovements)}
                className="mt-2 text-sm text-indigo-400 hover:text-indigo-300"
              >
                + Add another improvement
              </button>
            )}
            <div className={`text-xs mt-1 ${
              improvements.filter(i => i.trim()).length >= MIN_IMPROVEMENTS ? 'text-green-400' : 'text-slate-500'
            }`}>
              {improvements.filter(i => i.trim()).length}/{MIN_IMPROVEMENTS} items {improvements.filter(i => i.trim()).length >= MIN_IMPROVEMENTS && '✓'}
            </div>
          </div>

          {/* Question 6: Transferable Knowledge */}
          <div>
            <label className="block text-sm font-semibold text-white mb-2">
              6. What knowledge can you use in future situations? (minimum {MIN_KNOWLEDGE_WORDS} words)
            </label>
            <textarea
              value={transferableKnowledge}
              onChange={(e) => setTransferableKnowledge(e.target.value)}
              placeholder="Describe the principles, patterns, or insights you can apply to other problems..."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows={4}
            />
            <div className={`text-xs mt-1 ${
              countWords(transferableKnowledge) >= MIN_KNOWLEDGE_WORDS ? 'text-green-400' : 'text-slate-500'
            }`}>
              {countWords(transferableKnowledge)}/{MIN_KNOWLEDGE_WORDS} words {countWords(transferableKnowledge) >= MIN_KNOWLEDGE_WORDS && '✓'}
            </div>
          </div>

          {/* Validation Message */}
          {showValidation && !isValid && (
            <div className="bg-red-900/30 border border-red-600/30 rounded-lg p-4">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-200">
                  <p className="font-semibold mb-1">Please complete all required fields:</p>
                  <ul className="list-disc ml-4 space-y-1">
                    {countWords(objective) < MIN_OBJECTIVE_WORDS && (
                      <li>Objective needs {MIN_OBJECTIVE_WORDS - countWords(objective)} more words</li>
                    )}
                    {whatWorked.filter(w => w.trim()).length < MIN_ITEMS && (
                      <li>Add {MIN_ITEMS - whatWorked.filter(w => w.trim()).length} more success items</li>
                    )}
                    {whatDidntWork.filter(w => w.trim()).length < MIN_ROOT_CAUSES && (
                      <li>Add {MIN_ROOT_CAUSES - whatDidntWork.filter(w => w.trim()).length} more challenge items</li>
                    )}
                    {rootCauses.filter(r => r.trim()).length < MIN_ROOT_CAUSES && (
                      <li>Add {MIN_ROOT_CAUSES - rootCauses.filter(r => r.trim()).length} more root causes</li>
                    )}
                    {improvements.filter(i => i.trim()).length < MIN_IMPROVEMENTS && (
                      <li>Add {MIN_IMPROVEMENTS - improvements.filter(i => i.trim()).length} more improvements</li>
                    )}
                    {countWords(transferableKnowledge) < MIN_KNOWLEDGE_WORDS && (
                      <li>Transferable knowledge needs {MIN_KNOWLEDGE_WORDS - countWords(transferableKnowledge)} more words</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Success Message */}
          {isValid && (
            <div className="bg-green-900/30 border border-green-600/30 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-400">
                <CheckCircle className="w-5 h-5" />
                <span className="font-semibold">All requirements met! Ready to submit.</span>
              </div>
            </div>
          )}
        </form>

        {/* Actions */}
        <div className="p-6 border-t border-slate-700 flex gap-3">
          {onCancel && (
            <button
              type="button"
              onClick={onCancel}
              disabled={submitting}
              className="flex-1 px-6 py-3 bg-slate-700 hover:bg-slate-600 disabled:bg-slate-800 text-white font-semibold rounded-lg transition-colors"
            >
              Cancel
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={!isValid || submitting}
            className="flex-1 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
          >
            {submitting ? 'Submitting...' : 'Submit AAR'}
          </button>
        </div>
      </div>
    </div>
  );
}
