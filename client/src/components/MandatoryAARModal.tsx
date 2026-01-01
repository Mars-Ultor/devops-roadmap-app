/**
 * Mandatory AAR Modal - CANNOT BE CLOSED
 * Blocks navigation until AAR is submitted after lab completion
 * Phase 4: Mandatory AAR
 */

import { useState } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { addDoc, collection } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface MandatoryAARModalProps {
  labId: string;
  userId: string;
  labTitle: string;
  passed: boolean;
  onComplete: () => void;
}

const AAR_QUESTIONS = [
  {
    id: 'objective',
    question: 'What was I trying to accomplish?',
    minWords: 20,
    placeholder: 'Describe the lab objective and your goal...'
  },
  {
    id: 'worked',
    question: 'What worked well? (List at least 3 things)',
    minWords: 30,
    placeholder: 'List successful approaches, commands that worked, good decisions...'
  },
  {
    id: 'didntWork',
    question: "What didn't work?",
    minWords: 20,
    placeholder: 'What failed, what errors occurred, what took longer than expected...'
  },
  {
    id: 'why',
    question: "Why didn't it work?",
    minWords: 30,
    placeholder: 'Root cause analysis - be specific about WHY things failed...'
  },
  {
    id: 'differently',
    question: 'What would I do differently next time?',
    minWords: 20,
    placeholder: 'Specific changes to approach, workflow, or preparation...'
  },
  {
    id: 'learned',
    question: 'What did I learn that I can use later?',
    minWords: 20,
    placeholder: 'Key takeaways, commands to remember, concepts understood...'
  }
];

export default function MandatoryAARModal({
  labId,
  userId,
  labTitle,
  passed,
  onComplete
}: MandatoryAARModalProps) {
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [aiValidation, setAiValidation] = useState<Record<string, string>>({});

  const countWords = (text: string): number => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  const handleResponseChange = (questionId: string, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
    // Clear error when user starts typing
    if (errors[questionId]) {
      setErrors(prev => ({ ...prev, [questionId]: '' }));
    }
    // Clear AI validation when editing
    if (aiValidation[questionId]) {
      setAiValidation(prev => ({ ...prev, [questionId]: '' }));
    }
  };

  const validateResponse = (answer: string, minWords: number): string | null => {
    if (!answer || answer.trim().length === 0) {
      return 'This question is required';
    }

    const wordCount = countWords(answer);
    if (wordCount < minWords) {
      return `Too brief. Need at least ${minWords} words (currently ${wordCount})`;
    }

    // Check for low-effort responses
    const lowEffortPatterns = [
      /^(it didn't work|nothing|n\/a|idk|i don't know)\.?$/i,
      /^.{1,15}$/,  // Very short responses
      /^(yes|no|maybe|ok|okay)\.?$/i
    ];

    for (const pattern of lowEffortPatterns) {
      if (pattern.test(answer.trim())) {
        return 'Please provide a meaningful, detailed response';
      }
    }

    return null;
  };

  const handleSubmit = async () => {
    // Validate all responses
    const newErrors: Record<string, string> = {};
    let hasErrors = false;

    AAR_QUESTIONS.forEach(q => {
      const answer = responses[q.id] || '';
      const error = validateResponse(answer, q.minWords);
      if (error) {
        newErrors[q.id] = error;
        hasErrors = true;
      }
    });

    if (hasErrors) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    try {
      // Save AAR to Firestore
      await addDoc(collection(db, 'aars'), {
        userId,
        labId,
        labTitle,
        passed,
        responses,
        submittedAt: new Date(),
        wordCounts: AAR_QUESTIONS.reduce((acc, q) => {
          acc[q.id] = countWords(responses[q.id] || '');
          return acc;
        }, {} as Record<string, number>)
      });

      // AAR submitted successfully - allow navigation
      onComplete();
    } catch (error) {
      console.error('Error submitting AAR:', error);
      alert('Error submitting AAR. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const isComplete = AAR_QUESTIONS.every(q => {
    const answer = responses[q.id] || '';
    return countWords(answer) >= q.minWords;
  });

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="max-w-3xl w-full bg-slate-800 border-2 border-indigo-500 rounded-lg shadow-2xl my-8">
        {/* Header - NON-CLOSEABLE */}
        <div className="bg-indigo-900/30 border-b-2 border-indigo-500 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white mb-1">
                After Action Review Required
              </h2>
              <p className="text-indigo-200 text-sm">
                {labTitle} - {passed ? 'Passed' : 'Failed'}
              </p>
            </div>
            {/* No close button - cannot be dismissed! */}
            <div className="text-red-400 flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              <span className="text-sm font-medium">Cannot Skip</span>
            </div>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-red-900/20 border-b border-red-700 px-6 py-3">
          <div className="flex items-start">
            <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-red-200">
              <strong>Mandatory Reflection:</strong> You must complete this AAR before continuing. 
              No navigation, no skipping, no shortcuts. Reflection builds competence.
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="px-6 py-6 space-y-6 max-h-[60vh] overflow-y-auto">
          {AAR_QUESTIONS.map((q, index) => {
            const answer = responses[q.id] || '';
            const wordCount = countWords(answer);
            const isValid = wordCount >= q.minWords;
            const error = errors[q.id];

            return (
              <div key={q.id} className="space-y-2">
                <label className="block">
                  <div className="flex items-start justify-between mb-2">
                    <span className="text-white font-medium">
                      {index + 1}. {q.question}
                    </span>
                    <span className={`text-sm flex items-center ${
                      isValid ? 'text-green-400' : 'text-slate-400'
                    }`}>
                      {isValid && <CheckCircle className="w-4 h-4 mr-1" />}
                      {wordCount}/{q.minWords} words
                    </span>
                  </div>
                  <textarea
                    value={answer}
                    onChange={(e) => handleResponseChange(q.id, e.target.value)}
                    placeholder={q.placeholder}
                    className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 min-h-[100px] ${
                      error 
                        ? 'border-red-500 focus:ring-red-500' 
                        : isValid
                        ? 'border-green-500 focus:ring-green-500'
                        : 'border-slate-600 focus:ring-indigo-500'
                    }`}
                  />
                </label>
                {error && (
                  <p className="text-red-400 text-sm flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {error}
                  </p>
                )}
                {aiValidation[q.id] && (
                  <p className="text-yellow-400 text-sm">
                    💡 {aiValidation[q.id]}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="border-t border-slate-700 px-6 py-4 bg-slate-900/50">
          <div className="flex items-center justify-between mb-3">
            <div className="text-sm text-slate-400">
              {isComplete ? (
                <span className="text-green-400 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  All questions answered
                </span>
              ) : (
                <span>
                  Complete all questions with minimum word counts
                </span>
              )}
            </div>
            <div className="text-sm text-slate-400">
              {AAR_QUESTIONS.filter(q => countWords(responses[q.id] || '') >= q.minWords).length}/{AAR_QUESTIONS.length} complete
            </div>
          </div>
          <button
            onClick={handleSubmit}
            disabled={!isComplete || submitting}
            className={`w-full px-6 py-3 rounded-lg font-medium transition-all ${
              isComplete && !submitting
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            {submitting ? 'Submitting...' : 'Submit AAR and Continue'}
          </button>
          <p className="text-center text-slate-500 text-xs mt-2">
            Navigation blocked until AAR complete
          </p>
        </div>
      </div>
    </div>
  );
}
