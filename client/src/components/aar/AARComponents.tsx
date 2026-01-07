import React from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { type AARQuestion, countWords } from './aarData';

// Modal Header
interface ModalHeaderProps {
  labTitle: string;
  passed: boolean;
}

export const AARModalHeader: React.FC<ModalHeaderProps> = ({ labTitle, passed }) => (
  <div className="bg-indigo-900/30 border-b-2 border-indigo-500 px-6 py-4">
    <div className="flex items-center justify-between">
      <div>
        <h2 className="text-2xl font-bold text-white mb-1">After Action Review Required</h2>
        <p className="text-indigo-200 text-sm">{labTitle} - {passed ? 'Passed' : 'Failed'}</p>
      </div>
      <div className="text-red-400 flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        <span className="text-sm font-medium">Cannot Skip</span>
      </div>
    </div>
  </div>
);

// Warning Banner
export const AARWarningBanner: React.FC = () => (
  <div className="bg-red-900/20 border-b border-red-700 px-6 py-3">
    <div className="flex items-start">
      <AlertCircle className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-red-200">
        <strong>Mandatory Reflection:</strong> You must complete this AAR before continuing. 
        No navigation, no skipping, no shortcuts. Reflection builds competence.
      </p>
    </div>
  </div>
);

// Question Field
interface QuestionFieldProps {
  question: AARQuestion;
  index: number;
  answer: string;
  error?: string;
  aiValidation?: string;
  onChange: (questionId: string, value: string) => void;
}

export const AARQuestionField: React.FC<QuestionFieldProps> = ({
  question,
  index,
  answer,
  error,
  aiValidation,
  onChange
}) => {
  const wordCount = countWords(answer);
  const isValid = wordCount >= question.minWords;

  const getBorderClass = () => {
    if (error) return 'border-red-500 focus:ring-red-500';
    if (isValid) return 'border-green-500 focus:ring-green-500';
    return 'border-slate-600 focus:ring-indigo-500';
  };

  return (
    <div className="space-y-2">
      <label className="block">
        <div className="flex items-start justify-between mb-2">
          <span className="text-white font-medium">
            {index + 1}. {question.question}
          </span>
          <span className={`text-sm flex items-center ${isValid ? 'text-green-400' : 'text-slate-400'}`}>
            {isValid && <CheckCircle className="w-4 h-4 mr-1" />}
            {wordCount}/{question.minWords} words
          </span>
        </div>
        <textarea
          value={answer}
          onChange={(e) => onChange(question.id, e.target.value)}
          placeholder={question.placeholder}
          className={`w-full px-4 py-3 bg-slate-700 border rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 min-h-[100px] ${getBorderClass()}`}
        />
      </label>
      {error && (
        <p className="text-red-400 text-sm flex items-center">
          <AlertCircle className="w-4 h-4 mr-1" />
          {error}
        </p>
      )}
      {aiValidation && (
        <p className="text-yellow-400 text-sm">💡 {aiValidation}</p>
      )}
    </div>
  );
};

// Footer
interface FooterProps {
  isComplete: boolean;
  completedCount: number;
  totalCount: number;
  submitting: boolean;
  onSubmit: () => void;
}

export const AARModalFooter: React.FC<FooterProps> = ({
  isComplete,
  completedCount,
  totalCount,
  submitting,
  onSubmit
}) => (
  <div className="border-t border-slate-700 px-6 py-4 bg-slate-900/50">
    <div className="flex items-center justify-between mb-3">
      <div className="text-sm text-slate-400">
        {isComplete ? (
          <span className="text-green-400 flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            All questions answered
          </span>
        ) : (
          <span>Complete all questions with minimum word counts</span>
        )}
      </div>
      <div className="text-sm text-slate-400">{completedCount}/{totalCount} complete</div>
    </div>
    <button
      onClick={onSubmit}
      disabled={!isComplete || submitting}
      className={`w-full px-6 py-3 rounded-lg font-medium transition-all ${
        isComplete && !submitting
          ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
          : 'bg-slate-700 text-slate-500 cursor-not-allowed'
      }`}
    >
      {submitting ? 'Submitting...' : 'Submit AAR and Continue'}
    </button>
    <p className="text-center text-slate-500 text-xs mt-2">Navigation blocked until AAR complete</p>
  </div>
);
