/**
 * Recertification Drill Sub-Components
 * Extracted from RecertificationDrill.tsx for ESLint compliance
 */

import React from 'react';
import { CheckCircle, XCircle, BookOpen, Timer } from 'lucide-react';
import type { 
  RecertificationAnswer,
  RecertificationQuestion,
  CertificationLevel 
} from '../types/training';
import { CERTIFICATION_REQUIREMENTS } from '../data/recertificationDrills';
import { formatDrillTime, getCertificationColor } from './recertification/recertificationDrillUtils';

// Loading State Component
export function DrillLoadingState() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
      <div className="text-center">
        <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-300">Loading drill...</h3>
      </div>
    </div>
  );
}

// Drill Header Component
interface DrillHeaderProps {
  readonly title: string;
  readonly subtitle: string;
  readonly certLevel: CertificationLevel;
  readonly timeRemaining?: number;
}

export function DrillHeader({ title, subtitle, certLevel, timeRemaining }: DrillHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="text-blue-100">{subtitle}</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCertificationColor(certLevel)}`}>
            {certLevel.toUpperCase()}
          </div>
          {timeRemaining !== undefined && (
            <div className="flex items-center text-white">
              <Timer className="h-5 w-5 mr-2" />
              <span className={timeRemaining < 300 ? 'text-red-300 font-bold' : ''}>
                {formatDrillTime(timeRemaining)}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Progress Bar Component
interface DrillProgressProps {
  readonly current: number;
  readonly total: number;
}

export function DrillProgressBar({ current, total }: DrillProgressProps) {
  const percentage = Math.round(((current + 1) / total) * 100);
  return (
    <div className="bg-slate-800 px-6 py-3 border-b border-slate-700">
      <div className="flex items-center justify-between text-sm text-gray-300">
        <span>Question {current + 1} of {total}</span>
        <span>{percentage}% Complete</span>
      </div>
      <div className="mt-2 bg-slate-700 rounded-full h-2">
        <div className="bg-blue-600 h-2 rounded-full transition-all duration-300" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}

// Multiple Choice Options Component
interface MultipleChoiceProps {
  readonly options: string[];
  readonly selectedAnswer: number | null;
  readonly onSelect: (index: number) => void;
}

export function MultipleChoiceOptions({ options, selectedAnswer, onSelect }: MultipleChoiceProps) {
  return (
    <div className="space-y-3">
      {options.map((option, index) => {
        const isSelected = selectedAnswer === index;
        const baseClass = isSelected 
          ? 'border-blue-500 bg-blue-900/50' 
          : 'border-slate-600 hover:border-slate-500 bg-slate-800 hover:bg-slate-700';
        return (
          <button key={`option-${option}`} onClick={() => onSelect(index)}
            className={`w-full text-left p-4 rounded-lg border-2 transition-all ${baseClass}`}>
            <span className="font-medium text-white">{String.fromCodePoint(65 + index)}. {option}</span>
          </button>
        );
      })}
    </div>
  );
}

// True/False Options Component
interface TrueFalseProps {
  readonly selectedAnswer: boolean | null;
  readonly onSelect: (value: boolean) => void;
}

export function TrueFalseOptions({ selectedAnswer, onSelect }: TrueFalseProps) {
  const trueClass = selectedAnswer === true 
    ? 'border-green-500 bg-green-900/50' 
    : 'border-slate-600 hover:border-slate-500 bg-slate-800 hover:bg-slate-700';
  const falseClass = selectedAnswer === false 
    ? 'border-red-500 bg-red-900/50' 
    : 'border-slate-600 hover:border-slate-500 bg-slate-800 hover:bg-slate-700';
  return (
    <div className="flex space-x-4">
      <button onClick={() => onSelect(true)} className={`flex-1 p-4 rounded-lg border-2 transition-all ${trueClass}`}>
        <span className="font-medium text-white">True</span>
      </button>
      <button onClick={() => onSelect(false)} className={`flex-1 p-4 rounded-lg border-2 transition-all ${falseClass}`}>
        <span className="font-medium text-white">False</span>
      </button>
    </div>
  );
}

// Question Navigation Component
interface DrillNavigationProps {
  readonly currentIndex: number;
  readonly totalQuestions: number;
  readonly answers: RecertificationAnswer[];
  readonly onPrevious: () => void;
  readonly onNext: () => void;
  readonly onSubmit: () => void;
  readonly canProceed: boolean;
}

export function DrillNavigation({ currentIndex, totalQuestions, answers, onPrevious, onNext, onSubmit, canProceed }: DrillNavigationProps) {
  const isLastQuestion = currentIndex === totalQuestions - 1;
  const allAnswered = answers.length === totalQuestions;
  
  return (
    <div className="flex justify-between items-center">
      <button onClick={onPrevious} disabled={currentIndex === 0}
        className="px-6 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors">
        Previous
      </button>
      <div className="flex space-x-2">
        {Array.from({ length: totalQuestions }).map((_, index) => {
          let dotColor;
          if (index === currentIndex) {
            dotColor = 'bg-blue-600';
          } else if (answers[index]) {
            dotColor = 'bg-green-500';
          } else {
            dotColor = 'bg-gray-300';
          }
          return (
            // eslint-disable-next-line react/no-array-index-key
            <div key={index} className={`w-3 h-3 rounded-full ${dotColor}`} />
          );
        })}
      </div>
      {isLastQuestion ? (
        <button onClick={onSubmit} disabled={!allAnswered}
          className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors">
          Submit Drill
        </button>
      ) : (
        <button onClick={onNext} disabled={!canProceed}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors">
          Next
        </button>
      )}
    </div>
  );
}

// Results Stats Component
interface ResultsStatsProps {
  readonly score: number;
  readonly passed: boolean;
  readonly timeSpentMinutes: number;
}

export function DrillResultsStats({ score, passed, timeSpentMinutes }: ResultsStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 border border-slate-600">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-1">{score}%</div>
          <div className="text-sm text-gray-400">Your Score</div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 border border-slate-600">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-1">
            {passed ? <CheckCircle className="h-8 w-8 text-green-500 mx-auto" /> : <XCircle className="h-8 w-8 text-red-500 mx-auto" />}
          </div>
          <div className="text-sm text-gray-400">{passed ? 'PASSED' : 'FAILED'}</div>
        </div>
      </div>
      <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 border border-slate-600">
        <div className="text-center">
          <div className="text-3xl font-bold text-white mb-1">{Math.round(timeSpentMinutes)}m</div>
          <div className="text-sm text-gray-400">Time Spent</div>
        </div>
      </div>
    </div>
  );
}

// Requirements Check Component
interface RequirementsCheckProps {
  readonly score: number;
  readonly timeSpentMinutes: number;
  readonly certLevel: CertificationLevel;
  readonly timeLimit: number;
}

export function DrillRequirementsCheck({ score, timeSpentMinutes, certLevel, timeLimit }: RequirementsCheckProps) {
  const requirements = CERTIFICATION_REQUIREMENTS[certLevel];
  return (
    <div className="bg-slate-800 rounded-lg p-4 mb-6 border border-slate-700">
      <h3 className="text-lg font-medium text-white mb-3">Certification Requirements</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-300">Passing Score:</span>
          <span className={score >= requirements.minScore ? 'text-green-400' : 'text-red-400'}>
            {score}% / {requirements.minScore}%
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-300">Time Limit:</span>
          <span className={timeSpentMinutes <= timeLimit ? 'text-green-400' : 'text-red-400'}>
            {Math.round(timeSpentMinutes)}m / {timeLimit}m
          </span>
        </div>
      </div>
    </div>
  );
}

// Question Review Item Component
interface QuestionReviewProps {
  readonly question: RecertificationQuestion;
  readonly answer?: RecertificationAnswer;
}

export function QuestionReviewItem({ question, answer }: QuestionReviewProps) {
  const isCorrect = answer?.correct;
  const badgeClass = isCorrect ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300';
  
  return (
    <div className="border border-slate-700 rounded-lg p-4 bg-slate-800">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="font-medium text-white mb-2">{question.question}</p>
          <div className="mb-2">
            {isCorrect ? (
              <div className="flex items-center text-green-400"><CheckCircle className="h-5 w-5 mr-2" />Correct</div>
            ) : (
              <div className="flex items-center text-red-400"><XCircle className="h-5 w-5 mr-2" />Incorrect</div>
            )}
          </div>
          <div className="text-sm text-gray-400">{question.explanation}</div>
        </div>
        <div className="ml-4">
          <span className={`px-2 py-1 rounded text-xs ${badgeClass}`}>{isCorrect ? '✓' : '✗'}</span>
        </div>
      </div>
    </div>
  );
}
