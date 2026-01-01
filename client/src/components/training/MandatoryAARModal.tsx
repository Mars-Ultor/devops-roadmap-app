import { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, X, Brain } from 'lucide-react';
import { useAIAAREnhancement } from '../../hooks/useAIAAREnhancement';

interface AARData {
  objective: string;
  whatWorked: string[];
  whatDidntWork: string[];
  rootCause: string;
  nextTime: string;
  transferableKnowledge: string;
}

interface MandatoryAARModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (aar: AARData) => Promise<void>;
  labTitle: string;
}

const MIN_WORD_COUNTS = {
  objective: 20,
  whatWorked: 15, // per item, min 3 items
  whatDidntWork: 15, // per item, min 2 items
  rootCause: 30,
  nextTime: 20,
  transferableKnowledge: 25
};

export default function MandatoryAARModal({ isOpen, onClose, onSubmit, labTitle }: MandatoryAARModalProps) {
  const [formData, setFormData] = useState<AARData>({
    objective: '',
    whatWorked: ['', '', ''],
    whatDidntWork: ['', ''],
    rootCause: '',
    nextTime: '',
    transferableKnowledge: ''
  });
  const [errors, setErrors] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [aiErrors, setAiErrors] = useState<Record<string, string>>({});
  const [showAIFeedback, setShowAIFeedback] = useState(false);
  const { analyzeResponse } = useAIAAREnhancement();

  // AI validation on blur
  useEffect(() => {
    const validateWithAI = () => {
      const newAiErrors: Record<string, string> = {};

      // Check root cause
      const rootCauseAnalysis = analyzeResponse(formData.rootCause, 'what-happened');
      if (rootCauseAnalysis?.isVague) {
        newAiErrors.rootCause = rootCauseAnalysis.reason + ': ' + rootCauseAnalysis.suggestedImprovement;
      }

      // Check transferable knowledge
      const learnedAnalysis = analyzeResponse(formData.transferableKnowledge, 'what-learned');
      if (learnedAnalysis?.isVague) {
        newAiErrors.transferableKnowledge = learnedAnalysis.reason + ': ' + learnedAnalysis.suggestedImprovement;
      }

      // Check next time
      const nextTimeAnalysis = analyzeResponse(formData.nextTime, 'what-change');
      if (nextTimeAnalysis?.isVague) {
        newAiErrors.nextTime = nextTimeAnalysis.reason + ': ' + nextTimeAnalysis.suggestedImprovement;
      }

      setAiErrors(newAiErrors);
      setShowAIFeedback(Object.keys(newAiErrors).length > 0);
    };

    // Only validate if fields have content
    if (formData.rootCause || formData.transferableKnowledge || formData.nextTime) {
      validateWithAI();
    }
  }, [formData.rootCause, formData.transferableKnowledge, formData.nextTime, analyzeResponse]);

  if (!isOpen) return null;

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    // AI vagueness check must pass
    if (Object.keys(aiErrors).length > 0) {
      newErrors.push('Fix AI-detected issues before submitting (see highlighted fields)');
    }

    // Validate objective (min 20 words)
    if (countWords(formData.objective) < MIN_WORD_COUNTS.objective) {
      newErrors.push(`Objective must be at least ${MIN_WORD_COUNTS.objective} words (currently ${countWords(formData.objective)})`);
    }

    // Validate whatWorked (min 3 items, each 15+ words)
    const workedItems = formData.whatWorked.filter(item => item.trim().length > 0);
    if (workedItems.length < 3) {
      newErrors.push(`List at least 3 things that worked well`);
    } else {
      workedItems.forEach((item, idx) => {
        if (countWords(item) < MIN_WORD_COUNTS.whatWorked) {
          newErrors.push(`"What worked" item ${idx + 1} needs at least ${MIN_WORD_COUNTS.whatWorked} words (currently ${countWords(item)})`);
        }
      });
    }

    // Validate whatDidntWork (min 2 items, each 15+ words)
    const didntWorkItems = formData.whatDidntWork.filter(item => item.trim().length > 0);
    if (didntWorkItems.length < 2) {
      newErrors.push(`List at least 2 failures or struggles`);
    } else {
      didntWorkItems.forEach((item, idx) => {
        if (countWords(item) < MIN_WORD_COUNTS.whatDidntWork) {
          newErrors.push(`"What didn't work" item ${idx + 1} needs at least ${MIN_WORD_COUNTS.whatDidntWork} words (currently ${countWords(item)})`);
        }
      });
    }

    // Validate root cause (min 30 words)
    if (countWords(formData.rootCause) < MIN_WORD_COUNTS.rootCause) {
      newErrors.push(`Root cause analysis must be at least ${MIN_WORD_COUNTS.rootCause} words (currently ${countWords(formData.rootCause)})`);
    }

    // Validate next time (min 20 words)
    if (countWords(formData.nextTime) < MIN_WORD_COUNTS.nextTime) {
      newErrors.push(`"What would I do differently" must be at least ${MIN_WORD_COUNTS.nextTime} words (currently ${countWords(formData.nextTime)})`);
    }

    // Validate transferable knowledge (min 25 words)
    if (countWords(formData.transferableKnowledge) < MIN_WORD_COUNTS.transferableKnowledge) {
      newErrors.push(`Transferable knowledge must be at least ${MIN_WORD_COUNTS.transferableKnowledge} words (currently ${countWords(formData.transferableKnowledge)})`);
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setSubmitting(true);
    try {
      await onSubmit(formData);
      onClose();
    } catch (error) {
      console.error('Failed to submit AAR:', error);
      setErrors(['Failed to submit AAR. Please try again.']);
    } finally {
      setSubmitting(false);
    }
  };

  const addWorkItem = () => {
    setFormData({ ...formData, whatWorked: [...formData.whatWorked, ''] });
  };

  const addDidntWorkItem = () => {
    setFormData({ ...formData, whatDidntWork: [...formData.whatDidntWork, ''] });
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-xl border border-slate-700 max-w-3xl w-full my-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-orange-600 p-6 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <AlertTriangle className="w-8 h-8 text-white" />
                <h2 className="text-2xl font-bold text-white">Mandatory After Action Review</h2>
              </div>
              <p className="text-red-100 text-sm">You must complete this AAR before proceeding</p>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="bg-slate-900 border border-slate-700 rounded-lg p-4 mb-6">
            <p className="text-gray-300">
              <strong className="text-white">Lab:</strong> {labTitle}
            </p>
            <p className="text-gray-400 text-sm mt-2">
              Reflection is critical for learning. Answer each question thoroughly - minimum word counts are enforced.
            </p>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-900/20 border border-red-600/30 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <AlertTriangle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-red-400 font-semibold mb-2">Please fix the following:</h4>
                  <ul className="list-disc list-inside text-red-300 text-sm space-y-1">
                    {errors.map((error, idx) => (
                      <li key={idx}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* AI Feedback */}
          {showAIFeedback && Object.keys(aiErrors).length > 0 && (
            <div className="bg-amber-900/20 border border-amber-600/30 rounded-lg p-4 mb-6">
              <div className="flex items-start space-x-3">
                <Brain className="w-5 h-5 text-amber-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-amber-400 font-semibold mb-2">AI Detected Vague Responses:</h4>
                  <ul className="list-disc list-inside text-amber-300 text-sm space-y-1">
                    {Object.entries(aiErrors).map(([field, error]) => (
                      <li key={field}><strong>{field}:</strong> {error}</li>
                    ))}
                  </ul>
                  <p className="text-amber-200 text-xs mt-2">
                    Be specific! Include technical details like error messages, commands, root causes, and actionable steps.
                  </p>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-6">
            {/* 1. Objective */}
            <div>
              <label className="block text-white font-semibold mb-2">
                1. What was I trying to accomplish? <span className="text-red-400">*</span>
                <span className="text-gray-400 text-sm font-normal ml-2">(min {MIN_WORD_COUNTS.objective} words)</span>
              </label>
              <textarea
                value={formData.objective}
                onChange={(e) => setFormData({ ...formData, objective: e.target.value })}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-gray-300 min-h-[80px] focus:border-indigo-500 focus:outline-none"
                placeholder="Describe the objective of this lab in 2-3 sentences..."
              />
              <p className="text-xs text-gray-500 mt-1">{countWords(formData.objective)} words</p>
            </div>

            {/* 2. What Worked */}
            <div>
              <label className="block text-white font-semibold mb-2">
                2. What worked well? <span className="text-red-400">*</span>
                <span className="text-gray-400 text-sm font-normal ml-2">(min 3 items, {MIN_WORD_COUNTS.whatWorked}+ words each)</span>
              </label>
              {formData.whatWorked.map((item, idx) => (
                <div key={idx} className="mb-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-400 mt-3 flex-shrink-0" />
                    <div className="flex-1">
                      <textarea
                        value={item}
                        onChange={(e) => {
                          const newWorked = [...formData.whatWorked];
                          newWorked[idx] = e.target.value;
                          setFormData({ ...formData, whatWorked: newWorked });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-gray-300 min-h-[60px] focus:border-indigo-500 focus:outline-none"
                        placeholder={`Success #${idx + 1} - Be specific about what worked and why...`}
                      />
                      <p className="text-xs text-gray-500 mt-1">{countWords(item)} words</p>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addWorkItem}
                className="text-green-400 hover:text-green-300 text-sm font-medium"
              >
                + Add another success
              </button>
            </div>

            {/* 3. What Didn't Work */}
            <div>
              <label className="block text-white font-semibold mb-2">
                3. What didn't work? <span className="text-red-400">*</span>
                <span className="text-gray-400 text-sm font-normal ml-2">(min 2 items, {MIN_WORD_COUNTS.whatDidntWork}+ words each)</span>
              </label>
              {formData.whatDidntWork.map((item, idx) => (
                <div key={idx} className="mb-3">
                  <div className="flex items-start space-x-2">
                    <X className="w-5 h-5 text-red-400 mt-3 flex-shrink-0" />
                    <div className="flex-1">
                      <textarea
                        value={item}
                        onChange={(e) => {
                          const newDidntWork = [...formData.whatDidntWork];
                          newDidntWork[idx] = e.target.value;
                          setFormData({ ...formData, whatDidntWork: newDidntWork });
                        }}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-gray-300 min-h-[60px] focus:border-indigo-500 focus:outline-none"
                        placeholder={`Failure/Struggle #${idx + 1} - What went wrong and what you tried...`}
                      />
                      <p className="text-xs text-gray-500 mt-1">{countWords(item)} words</p>
                    </div>
                  </div>
                </div>
              ))}
              <button
                onClick={addDidntWorkItem}
                className="text-red-400 hover:text-red-300 text-sm font-medium"
              >
                + Add another failure/struggle
              </button>
            </div>

            {/* 4. Root Cause */}
            <div>
              <label className="block text-white font-semibold mb-2">
                4. Why didn't it work? (Root cause, not symptoms) <span className="text-red-400">*</span>
                <span className="text-gray-400 text-sm font-normal ml-2">(min {MIN_WORD_COUNTS.rootCause} words)</span>
              </label>
              <textarea
                value={formData.rootCause}
                onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
                className={`w-full bg-slate-900 border rounded-lg p-3 text-gray-300 min-h-[100px] focus:outline-none ${
                  aiErrors.rootCause ? 'border-amber-500 focus:border-amber-400' : 'border-slate-700 focus:border-indigo-500'
                }`}
                placeholder="Analyze the root cause - not just 'it didn't work' but WHY it didn't work..."
              />
              <p className="text-xs text-gray-500 mt-1">{countWords(formData.rootCause)} words</p>
            </div>

            {/* 5. Next Time */}
            <div>
              <label className="block text-white font-semibold mb-2">
                5. What would I do differently next time? <span className="text-red-400">*</span>
                <span className="text-gray-400 text-sm font-normal ml-2">(min {MIN_WORD_COUNTS.nextTime} words)</span>
              </label>
              <textarea
                value={formData.nextTime}
                onChange={(e) => setFormData({ ...formData, nextTime: e.target.value })}
                className={`w-full bg-slate-900 border rounded-lg p-3 text-gray-300 min-h-[80px] focus:outline-none ${
                  aiErrors.nextTime ? 'border-amber-500 focus:border-amber-400' : 'border-slate-700 focus:border-indigo-500'
                }`}
                placeholder="Specific changes you'll make when facing similar challenges..."
              />
              <p className="text-xs text-gray-500 mt-1">{countWords(formData.nextTime)} words</p>
            </div>

            {/* 6. Transferable Knowledge */}
            <div>
              <label className="block text-white font-semibold mb-2">
                6. What did I learn that I can use in future tasks? <span className="text-red-400">*</span>
                <span className="text-gray-400 text-sm font-normal ml-2">(min {MIN_WORD_COUNTS.transferableKnowledge} words)</span>
              </label>
              <textarea
                value={formData.transferableKnowledge}
                onChange={(e) => setFormData({ ...formData, transferableKnowledge: e.target.value })}
                className={`w-full bg-slate-900 border rounded-lg p-3 text-gray-300 min-h-[100px] focus:outline-none ${
                  aiErrors.transferableKnowledge ? 'border-amber-500 focus:border-amber-400' : 'border-slate-700 focus:border-indigo-500'
                }`}
                placeholder="What knowledge from this lab applies to other DevOps scenarios?..."
              />
              <p className="text-xs text-gray-500 mt-1">{countWords(formData.transferableKnowledge)} words</p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700">
            <p className="text-gray-400 text-sm">
              <span className="text-red-400">*</span> You must complete this AAR to proceed
            </p>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 disabled:from-gray-600 disabled:to-gray-700 text-white rounded-lg font-bold transition-all"
            >
              {submitting ? 'Submitting...' : 'Submit AAR & Continue'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
