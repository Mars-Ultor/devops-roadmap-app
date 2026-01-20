/**
 * Recertification Drill View Components
 * Results and Quiz views extracted from RecertificationDrill.tsx
 */

import React from "react";
import type {
  RecertificationDrill,
  RecertificationAttempt,
  RecertificationAnswer,
} from "../types/training";
import {
  DrillHeader,
  DrillProgressBar,
  MultipleChoiceOptions,
  TrueFalseOptions,
  DrillNavigation,
  DrillResultsStats,
  DrillRequirementsCheck,
  QuestionReviewItem,
} from "./RecertificationDrillComponents";

// Results View Props
interface ResultsViewProps {
  drill: RecertificationDrill;
  attempt: RecertificationAttempt;
  answers: RecertificationAnswer[];
  onRetry: () => void;
  onCancel?: () => void;
}

// Results View Component
export function DrillResultsView({
  drill,
  attempt,
  answers,
  onRetry,
  onCancel,
}: ResultsViewProps) {
  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl overflow-hidden border border-slate-700">
          <DrillHeader
            title={drill.title}
            subtitle="Recertification Results"
            certLevel={drill.certificationLevel}
          />
          <div className="p-6">
            <DrillResultsStats
              score={attempt.score}
              passed={attempt.passed}
              timeSpentMinutes={attempt.timeSpentMinutes}
            />
            <DrillRequirementsCheck
              score={attempt.score}
              timeSpentMinutes={attempt.timeSpentMinutes}
              certLevel={drill.certificationLevel}
              timeLimit={drill.timeLimitMinutes}
            />
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">
                Question Review
              </h3>
              {drill.questions.map((question, index) => (
                <QuestionReviewItem
                  key={question.id}
                  question={question}
                  answer={answers[index]}
                />
              ))}
            </div>
            <div className="mt-8 flex justify-center space-x-4">
              <button
                onClick={onRetry}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Take Another Drill
              </button>
              {onCancel && (
                <button
                  onClick={onCancel}
                  className="px-6 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-colors"
                >
                  Back to Dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Quiz View Props
interface QuizViewProps {
  drill: RecertificationDrill;
  currentIndex: number;
  timeRemaining: number;
  answers: RecertificationAnswer[];
  onAnswer: (answer: string | number | boolean) => void;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

// Quiz View Component
export function DrillQuizView({
  drill,
  currentIndex,
  timeRemaining,
  answers,
  onAnswer,
  onPrevious,
  onNext,
  onSubmit,
}: QuizViewProps) {
  const currentQuestion = drill.questions[currentIndex];
  const currentAnswer = answers[currentIndex];

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl overflow-hidden border border-slate-700">
          <DrillHeader
            title={drill.title}
            subtitle={drill.description}
            certLevel={drill.certificationLevel}
            timeRemaining={timeRemaining}
          />
          <DrillProgressBar
            current={currentIndex}
            total={drill.questions.length}
          />
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                {currentQuestion.question}
              </h3>
              {currentQuestion.type === "multiple-choice" &&
                currentQuestion.options && (
                  <MultipleChoiceOptions
                    options={currentQuestion.options}
                    selectedAnswer={
                      typeof currentAnswer?.answer === "number"
                        ? currentAnswer.answer
                        : null
                    }
                    onSelect={(i) => onAnswer(i)}
                  />
                )}
              {currentQuestion.type === "true-false" && (
                <TrueFalseOptions
                  selectedAnswer={
                    typeof currentAnswer?.answer === "boolean"
                      ? currentAnswer.answer
                      : null
                  }
                  onSelect={(v) => onAnswer(v)}
                />
              )}
            </div>
            <DrillNavigation
              currentIndex={currentIndex}
              totalQuestions={drill.questions.length}
              answers={answers}
              onPrevious={onPrevious}
              onNext={onNext}
              onSubmit={onSubmit}
              canProceed={!!currentAnswer}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
