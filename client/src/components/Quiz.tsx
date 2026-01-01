import { useState } from 'react';
import { doc, updateDoc, arrayUnion, increment } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import { CheckCircle2, XCircle, Award, RotateCcw } from 'lucide-react';

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation?: string;
}

interface QuizProps {
  quizId: string;
  title: string;
  questions: QuizQuestion[];
  passingScore: number; // Percentage (e.g., 70 for 70%)
  xpReward: number;
  weekId?: string;
}

export default function Quiz({ quizId, title, questions, passingScore, xpReward }: QuizProps) {
  const { user } = useAuthStore();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [showResults, setShowResults] = useState(false);
  const [awarding, setAwarding] = useState(false);

  const handleSelectAnswer = (optionIndex: number) => {
    const newAnswers = [...selectedAnswers];
    newAnswers[currentQuestion] = optionIndex;
    setSelectedAnswers(newAnswers);
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmit = () => {
    setShowResults(true);
  };

  const calculateScore = () => {
    let correct = 0;
    selectedAnswers.forEach((answer, index) => {
      if (answer === questions[index].correctAnswer) {
        correct++;
      }
    });
    return Math.round((correct / questions.length) * 100);
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setSelectedAnswers(new Array(questions.length).fill(null));
    setShowResults(false);
  };

  const handleClaimReward = async () => {
    if (!user || awarding) return;

    const score = calculateScore();
    if (score < passingScore) {
      alert(`You need ${passingScore}% to pass. You scored ${score}%. Try again!`);
      return;
    }

    setAwarding(true);
    try {
      const userRef = doc(db, 'users', user.uid);
      
      await updateDoc(userRef, {
        completedQuizzes: arrayUnion(quizId),
        xp: increment(xpReward)
      });

      alert(`🎉 Congratulations! You earned ${xpReward} XP!`);
      
      // Refresh user data
      setTimeout(() => window.location.reload(), 1000);
    } catch (error) {
      console.error('Error claiming reward:', error);
      alert('Failed to award XP. Please try again.');
    } finally {
      setAwarding(false);
    }
  };

  const score = showResults ? calculateScore() : 0;
  const passed = score >= passingScore;

  if (showResults) {
    return (
      <div className="bg-slate-800 rounded-lg p-4 sm:p-8 border border-slate-700">
        <div className="text-center mb-8">
          <div className={`inline-flex items-center justify-center w-20 h-20 rounded-full mb-4 ${
            passed ? 'bg-green-900/30 text-green-400' : 'bg-red-900/30 text-red-400'
          }`}>
            {passed ? (
              <CheckCircle2 className="w-12 h-12" />
            ) : (
              <XCircle className="w-12 h-12" />
            )}
          </div>
          
          <h2 className="text-3xl font-bold text-white mb-2">
            {passed ? 'Quiz Passed!' : 'Keep Trying!'}
          </h2>
          
          <p className="text-xl text-slate-300 mb-4">
            Your Score: <span className={`font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>
              {score}%
            </span>
          </p>
          
          {passed ? (
            <p className="text-slate-400">
              You passed with a score of {score}%! Passing score: {passingScore}%
            </p>
          ) : (
            <p className="text-slate-400">
              You need {passingScore}% to pass. Review the material and try again!
            </p>
          )}
        </div>

        {/* Answer Review */}
        <div className="space-y-6 mb-8">
          <h3 className="text-xl font-semibold text-white mb-4">Answer Review</h3>
          {questions.map((q, index) => {
            const userAnswer = selectedAnswers[index];
            const isCorrect = userAnswer === q.correctAnswer;
            
            return (
              <div key={index} className={`p-4 rounded-lg border-2 ${
                isCorrect ? 'border-green-500 bg-green-900/10' : 'border-red-500 bg-red-900/10'
              }`}>
                <div className="flex items-start gap-3 mb-3">
                  {isCorrect ? (
                    <CheckCircle2 className="w-6 h-6 text-green-400 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="w-6 h-6 text-red-400 flex-shrink-0 mt-1" />
                  )}
                  <div className="flex-1">
                    <p className="text-white font-medium mb-2">{q.question}</p>
                    <p className="text-sm text-slate-400">
                      Your answer: <span className={isCorrect ? 'text-green-400' : 'text-red-400'}>
                        {userAnswer !== null ? q.options[userAnswer] : 'Not answered'}
                      </span>
                    </p>
                    {!isCorrect && (
                      <p className="text-sm text-green-400 mt-1">
                        Correct answer: {q.options[q.correctAnswer]}
                      </p>
                    )}
                    {q.explanation && (
                      <p className="text-sm text-slate-300 mt-2 italic">
                        💡 {q.explanation}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex gap-4">
          <button
            onClick={handleRetake}
            className="flex-1 bg-slate-700 text-white py-3 rounded-lg font-medium hover:bg-slate-600 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            Retake Quiz
          </button>
          
          {passed && (
            <button
              onClick={handleClaimReward}
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
  }

  const currentQ = questions[currentQuestion];
  const userAnswer = selectedAnswers[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="bg-slate-800 rounded-lg p-4 sm:p-8 border border-slate-700">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <span className="text-slate-400 text-sm">
            Question {currentQuestion + 1} of {questions.length}
          </span>
        </div>
        
        {/* Progress Bar */}
        <div className="w-full bg-slate-700 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="mb-8">
        <h3 className="text-xl text-white font-medium mb-6">{currentQ.question}</h3>
        
        {/* Options */}
        <div className="space-y-3">
          {currentQ.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelectAnswer(index)}
              className={`w-full text-left p-4 sm:p-4 rounded-lg border-2 transition-all min-h-[44px] sm:min-h-0 ${
                userAnswer === index
                  ? 'border-indigo-500 bg-indigo-900/30 text-white'
                  : 'border-slate-600 bg-slate-700/50 text-slate-300 hover:border-slate-500 hover:bg-slate-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                  userAnswer === index
                    ? 'border-indigo-400 bg-indigo-500'
                    : 'border-slate-500'
                }`}>
                  {userAnswer === index && (
                    <div className="w-3 h-3 bg-white rounded-full" />
                  )}
                </div>
                <span>{option}</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-col sm:flex-row justify-between gap-3">
        <button
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
          className="px-6 py-3 min-h-[44px] bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        
        <div className="flex gap-3">
          {currentQuestion === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              disabled={selectedAnswers.some(a => a === null)}
              className="px-8 py-3 min-h-[44px] bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg font-medium hover:from-green-500 hover:to-emerald-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Submit Quiz
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="px-6 py-3 min-h-[44px] bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>

      {/* Answer Counter */}
      <div className="mt-6 text-center text-sm text-slate-400">
        Answered: {selectedAnswers.filter(a => a !== null).length} / {questions.length}
      </div>
    </div>
  );
}
