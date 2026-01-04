import React, { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { RECERTIFICATION_DRILLS, CERTIFICATION_REQUIREMENTS } from '../data/recertificationDrills';
import type {
  RecertificationDrill,
  RecertificationAttempt,
  RecertificationAnswer,
  CertificationLevel
} from '../types/training';
import {
  CheckCircle,
  XCircle,
  BookOpen,
  Timer
} from 'lucide-react';

interface RecertificationDrillProps {
  drillId?: string;
  onComplete?: (attempt: RecertificationAttempt) => void;
  onCancel?: () => void;
}

export default function RecertificationDrillComponent({
  drillId,
  onComplete,
  onCancel
}: RecertificationDrillProps) {
  const { user } = useAuthStore();
  const [currentDrill, setCurrentDrill] = useState<RecertificationDrill | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<RecertificationAnswer[]>([]);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [showResults, setShowResults] = useState(false);
  const [attempt, setAttempt] = useState<RecertificationAttempt | null>(null);

  const handleSubmit = useCallback((autoSubmit = false) => {
    if (!currentDrill || !user) return;

    const endTime = new Date();
    const timeSpentMinutes = (endTime.getTime() - startTime.getTime()) / (1000 * 60);

    // Calculate score
    const correctAnswers = answers.filter(a => a.correct).length;
    const totalQuestions = currentDrill.questions.length;
    const score = Math.round((correctAnswers / totalQuestions) * 100);

    const passingScore = currentDrill.passingScore;
    const passed = score >= passingScore;

    const attemptResult: RecertificationAttempt = {
      id: `attempt-${Date.now()}`,
      drillId: currentDrill.id,
      userId: user.uid,
      startedAt: startTime,
      completedAt: endTime,
      score,
      passed,
      timeSpentMinutes,
      answers,
      feedback: autoSubmit ? 'Time expired - auto-submitted' : undefined
    };

    setAttempt(attemptResult);
    setShowResults(true);

    if (onComplete) {
      onComplete(attemptResult);
    }
  }, [currentDrill, user, startTime, answers, onComplete]);

  // Load drill data
  useEffect(() => {
    if (drillId) {
      const drill = RECERTIFICATION_DRILLS.find(d => d.id === drillId);
      if (drill) {
        setCurrentDrill(drill);
        setTimeRemaining(drill.timeLimitMinutes * 60); // Convert to seconds
        setStartTime(new Date());
      }
    }
  }, [drillId]);

  // Timer countdown
  useEffect(() => {
    if (timeRemaining > 0 && !showResults) {
      const timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0 && !showResults) {
      handleSubmit(true); // Auto-submit when time runs out
    }
  }, [timeRemaining, showResults, handleSubmit]);

  const handleAnswer = (answer: string | number | boolean) => {
    const question = currentDrill!.questions[currentQuestionIndex];
    const timeSpent = Date.now() - startTime.getTime();

    const answerObj: RecertificationAnswer = {
      questionId: question.id,
      answer,
      correct: answer === question.correctAnswer,
      timeSpentSeconds: Math.floor(timeSpent / 1000)
    };

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = answerObj;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestionIndex < currentDrill!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getCertificationColor = (level: CertificationLevel) => {
    switch (level) {
      case 'bronze': return 'text-amber-600 bg-amber-100';
      case 'silver': return 'text-gray-600 bg-gray-100';
      case 'gold': return 'text-yellow-600 bg-yellow-100';
      case 'platinum': return 'text-purple-600 bg-purple-100';
      case 'master': return 'text-red-600 bg-red-100';
    }
  };

  if (!currentDrill) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-8">
        <div className="text-center">
          <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-300">Loading drill...</h3>
        </div>
      </div>
    );
  }

  if (showResults && attempt) {
    const requirements = CERTIFICATION_REQUIREMENTS[currentDrill.certificationLevel];

    return (
      <div className="min-h-screen bg-slate-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl overflow-hidden border border-slate-700">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">{currentDrill.title}</h2>
                  <p className="text-blue-100">Recertification Results</p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCertificationColor(currentDrill.certificationLevel)}`}>
                  {currentDrill.certificationLevel.toUpperCase()}
                </div>
              </div>
            </div>

            {/* Results Summary */}
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 border border-slate-600">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">{attempt.score}%</div>
                    <div className="text-sm text-gray-400">Your Score</div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 border border-slate-600">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {attempt.passed ? (
                        <CheckCircle className="h-8 w-8 text-green-500 mx-auto" />
                      ) : (
                        <XCircle className="h-8 w-8 text-red-500 mx-auto" />
                      )}
                    </div>
                    <div className="text-sm text-gray-400">
                      {attempt.passed ? 'PASSED' : 'FAILED'}
                    </div>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-xl p-6 border border-slate-600">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-white mb-1">
                      {Math.round(attempt.timeSpentMinutes)}m
                    </div>
                    <div className="text-sm text-gray-400">Time Spent</div>
                  </div>
                </div>
              </div>

              {/* Requirements Check */}
              <div className="bg-slate-800 rounded-lg p-4 mb-6 border border-slate-700">
                <h3 className="text-lg font-medium text-white mb-3">Certification Requirements</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-300">Passing Score:</span>
                    <span className={attempt.score >= requirements.minScore ? 'text-green-400' : 'text-red-400'}>
                      {attempt.score}% / {requirements.minScore}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-300">Time Limit:</span>
                    <span className={attempt.timeSpentMinutes <= currentDrill.timeLimitMinutes ? 'text-green-400' : 'text-red-400'}>
                      {Math.round(attempt.timeSpentMinutes)}m / {currentDrill.timeLimitMinutes}m
                    </span>
                  </div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-white">Question Review</h3>
                {currentDrill.questions.map((question, index) => {
                  const answer = answers[index];
                  return (
                    <div key={question.id} className="border border-slate-700 rounded-lg p-4 bg-slate-800">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-medium text-white mb-2">{question.question}</p>
                          <div className="mb-2">
                            {answer?.correct ? (
                              <div className="flex items-center text-green-400">
                                <CheckCircle className="h-5 w-5 mr-2" />
                                Correct
                              </div>
                            ) : (
                              <div className="flex items-center text-red-400">
                                <XCircle className="h-5 w-5 mr-2" />
                                Incorrect
                              </div>
                            )}
                          </div>
                          <div className="text-sm text-gray-400">
                            {question.explanation}
                          </div>
                        </div>
                        <div className="ml-4">
                          <span className={`px-2 py-1 rounded text-xs ${
                            answer?.correct ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'
                          }`}>
                            {answer?.correct ? '✓' : '✗'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Action Buttons */}
              <div className="mt-8 flex justify-center space-x-4">
                <button
                  onClick={() => window.location.reload()}
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

  const currentQuestion = currentDrill.questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestionIndex];

  return (
    <div className="min-h-screen bg-slate-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg shadow-xl overflow-hidden border border-slate-700">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">{currentDrill.title}</h2>
                <p className="text-blue-100">{currentDrill.description}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${getCertificationColor(currentDrill.certificationLevel)}`}>
                  {currentDrill.certificationLevel.toUpperCase()}
                </div>
                <div className="flex items-center text-white">
                  <Timer className="h-5 w-5 mr-2" />
                  <span className={timeRemaining < 300 ? 'text-red-300 font-bold' : ''}>
                    {formatTime(timeRemaining)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="bg-slate-800 px-6 py-3 border-b border-slate-700">
            <div className="flex items-center justify-between text-sm text-gray-300">
              <span>Question {currentQuestionIndex + 1} of {currentDrill.questions.length}</span>
              <span>{Math.round(((currentQuestionIndex + 1) / currentDrill.questions.length) * 100)}% Complete</span>
            </div>
            <div className="mt-2 bg-slate-700 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestionIndex + 1) / currentDrill.questions.length) * 100}%` }}
              />
            </div>
          </div>

          {/* Question */}
          <div className="p-6">
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                {currentQuestion.question}
              </h3>

              {/* Answer Options */}
              {currentQuestion.type === 'multiple-choice' && currentQuestion.options && (
                <div className="space-y-3">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        currentAnswer?.answer === index
                          ? 'border-blue-500 bg-blue-900/50'
                          : 'border-slate-600 hover:border-slate-500 bg-slate-800 hover:bg-slate-700'
                      }`}
                    >
                      <span className="font-medium text-white">
                        {String.fromCharCode(65 + index)}. {option}
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {currentQuestion.type === 'true-false' && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleAnswer(true)}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      currentAnswer?.answer === true
                        ? 'border-green-500 bg-green-900/50'
                        : 'border-slate-600 hover:border-slate-500 bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    <span className="font-medium text-white">True</span>
                  </button>
                  <button
                    onClick={() => handleAnswer(false)}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      currentAnswer?.answer === false
                        ? 'border-red-500 bg-red-900/50'
                        : 'border-slate-600 hover:border-slate-500 bg-slate-800 hover:bg-slate-700'
                    }`}
                  >
                    <span className="font-medium text-white">False</span>
                  </button>
                </div>
              )}
            </div>

            {/* Navigation */}
            <div className="flex justify-between items-center">
              <button
                onClick={handlePrevious}
                disabled={currentQuestionIndex === 0}
                className="px-6 py-2 bg-slate-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-600 transition-colors"
              >
                Previous
              </button>

              <div className="flex space-x-2">
                {currentDrill.questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full ${
                      index === currentQuestionIndex
                        ? 'bg-blue-600'
                        : answers[index]
                        ? 'bg-green-500'
                        : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>

              {currentQuestionIndex === currentDrill.questions.length - 1 ? (
                <button
                  onClick={() => handleSubmit()}
                  disabled={answers.length !== currentDrill.questions.length}
                  className="px-6 py-2 bg-green-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 transition-colors"
                >
                  Submit Drill
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}