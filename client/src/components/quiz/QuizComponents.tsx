import React from "react";
import { CheckCircle2, XCircle, Award, RotateCcw } from "lucide-react";
import type { QuizQuestion } from "./Quiz";

// Answer Review Item
interface AnswerReviewItemProps {
  question: QuizQuestion;
  userAnswer: number | null;
}

export const AnswerReviewItem: React.FC<AnswerReviewItemProps> = ({
  question,
  userAnswer,
}) => {
  const isCorrect = userAnswer === question.correctAnswer;

  return (
    <div
      className={`p-4 rounded-lg border-2 ${
        isCorrect
          ? "border-green-500 bg-green-900/10"
          : "border-red-500 bg-red-900/10"
      }`}
    >
      <div className="flex items-start gap-3 mb-3">
        {isCorrect ? (
          <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
        ) : (
          <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
        )}
        <div className="flex-1">
          <p className="text-white font-medium mb-2">{question.question}</p>
          <p className="text-sm text-slate-400">
            Your answer:{" "}
            <span className={isCorrect ? "text-green-400" : "text-red-400"}>
              {userAnswer === null
                ? "Not answered"
                : question.options[userAnswer]}
            </span>
          </p>
          {!isCorrect && (
            <p className="text-sm text-green-400 mt-1">
              Correct answer: {question.options[question.correctAnswer]}
            </p>
          )}
          {question.explanation && (
            <p className="text-sm text-slate-300 mt-2 italic">
              💡 {question.explanation}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

// Quiz Results Component
interface QuizResultsProps {
  score: number;
  passed: boolean;
  passingScore: number;
  xpReward: number;
  questions: QuizQuestion[];
  selectedAnswers: (number | null)[];
  awarding: boolean;
  onRetake: () => void;
  onClaimReward: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  passed,
  passingScore,
  xpReward,
  questions,
  selectedAnswers,
  awarding,
  onRetake,
  onClaimReward,
}) => (
  <div className="bg-slate-800 rounded-lg p-4 sm:p-8 border border-slate-700">
    <div className="text-center mb-8">
      <div
        className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
          passed
            ? "bg-green-900/30 text-green-400"
            : "bg-red-900/30 text-red-400"
        }`}
      >
        {passed ? (
          <CheckCircle2 className="w-12 h-12" />
        ) : (
          <XCircle className="w-12 h-12" />
        )}
      </div>

      <h2 className="text-3xl font-bold text-white mb-2">
        {passed ? "Quiz Passed!" : "Keep Trying!"}
      </h2>

      <p className="text-xl text-slate-300 mb-4">
        Your Score:{" "}
        <span
          className={`font-bold ${passed ? "text-green-400" : "text-red-400"}`}
        >
          {score}%
        </span>
      </p>

      <p className="text-slate-400">
        {passed
          ? `You passed with a score of ${score}%! Passing score: ${passingScore}%`
          : `You need ${passingScore}% to pass. Review the material and try again!`}
      </p>
    </div>

    {/* Answer Review */}
    <div className="space-y-6 mb-8">
      <h3 className="text-xl font-semibold text-white mb-4">Answer Review</h3>
      {questions.map((q, index) => (
        <AnswerReviewItem
          key={q.question}
          question={q}
          userAnswer={selectedAnswers[index]}
          index={index}
        />
      ))}
    </div>

    {/* Actions */}
    <div className="flex gap-4">
      <button
        onClick={onRetake}
        className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-medium hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
      >
        <RotateCcw className="w-5 h-5" />
        Retake Quiz
      </button>

      {passed && (
        <button
          onClick={onClaimReward}
          disabled={awarding}
          className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 rounded-lg font-medium hover:from-indigo-500 hover:to-purple-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {awarding ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              <span>Claiming...</span>
            </>
          ) : (
            <>
              <Award className="w-5 h-5" />
              <span>Claim {xpReward} XP</span>
            </>
          )}
        </button>
      )}
    </div>
  </div>
);

// Quiz Option Button
interface QuizOptionProps {
  option: string;
  index: number;
  isSelected: boolean;
  onSelect: (index: number) => void;
}

const QuizOption: React.FC<QuizOptionProps> = ({
  option,
  index,
  isSelected,
  onSelect,
}) => (
  <button
    onClick={() => onSelect(index)}
    className={`w-full text-left p-4 sm:p-4 rounded-lg border-2 transition-all min-h-[44px] sm:min-h-0 ${
      isSelected
        ? "border-indigo-500 bg-indigo-900/30 text-white"
        : "border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500 hover:bg-slate-700"
    }`}
  >
    <div className="flex items-center gap-3">
      <div
        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
          isSelected ? "border-indigo-400 bg-indigo-500" : "border-slate-500"
        }`}
      >
        {isSelected && <div className="w-3 h-3 bg-white rounded-full" />}
      </div>
      <span>{option}</span>
    </div>
  </button>
);

// Quiz Navigation
interface QuizNavigationProps {
  currentQuestion: number;
  isLastQuestion: boolean;
  canSubmit: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const QuizNavigation: React.FC<QuizNavigationProps> = ({
  currentQuestion,
  isLastQuestion,
  canSubmit,
  onPrevious,
  onNext,
  onSubmit,
}) => (
  <div className="flex flex-col sm:flex-row justify-between gap-3">
    <button
      onClick={onPrevious}
      disabled={currentQuestion === 0}
      className="px-6 py-3 min-h-[44px] bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
    >
      Previous
    </button>

    <div className="flex gap-3">
      {isLastQuestion ? (
        <button
          onClick={onSubmit}
          disabled={!canSubmit}
          className="px-8 py-3 min-h-[44px] bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-500 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Submit Quiz
        </button>
      ) : (
        <button
          onClick={onNext}
          className="px-6 py-3 min-h-[44px] bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
        >
          Next
        </button>
      )}
    </div>
  </div>
);

// Quiz Question View Component
interface QuizQuestionViewProps {
  title: string;
  currentQuestion: number;
  totalQuestions: number;
  question: QuizQuestion;
  userAnswer: number | null;
  answeredCount: number;
  onSelectAnswer: (index: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  canSubmit: boolean;
}

export const QuizQuestionView: React.FC<QuizQuestionViewProps> = ({
  title,
  currentQuestion,
  totalQuestions,
  question,
  userAnswer,
  answeredCount,
  onSelectAnswer,
  onPrevious,
  onNext,
  onSubmit,
  canSubmit,
}) => {
  const progress = ((currentQuestion + 1) / totalQuestions) * 100;
  const isLastQuestion = currentQuestion === totalQuestions - 1;

  return (
    <div className="bg-slate-800 rounded-lg p-4 sm:p-8 border border-slate-700">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <span className="text-slate-400 text-sm">
            Question {currentQuestion + 1} of {totalQuestions}
          </span>
        </div>
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-xl text-white font-medium mb-6">
          {question.question}
        </h3>
        <div className="space-y-3">
          {question.options.map((option, idx) => (
            <QuizOption
              key={option}
              option={option}
              index={idx}
              isSelected={userAnswer === idx}
              onSelect={onSelectAnswer}
            />
          ))}
        </div>
      </div>

      <QuizNavigation
        currentQuestion={currentQuestion}
        isLastQuestion={isLastQuestion}
        canSubmit={canSubmit}
        onPrevious={onPrevious}
        onNext={onNext}
        onSubmit={onSubmit}
      />

      <div className="mt-6 text-center text-sm text-slate-400">
        Answered: {answeredCount} / {totalQuestions}
      </div>
    </div>
  );
};
