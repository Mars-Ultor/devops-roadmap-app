/* eslint-disable max-lines-per-function */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Brain, CheckCircle, Award, ArrowRight } from 'lucide-react';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  category: 'linux' | 'git' | 'aws' | 'docker' | 'kubernetes' | 'ci-cd';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
}

const diagnosticQuestions: Question[] = [
  // Linux Questions
  {
    id: 'linux-1',
    question: 'What command lists all files including hidden ones?',
    options: ['ls', 'ls -l', 'ls -a', 'ls -h'],
    correctAnswer: 2,
    category: 'linux',
    difficulty: 'beginner'
  },
  {
    id: 'linux-2',
    question: 'Which command changes file permissions in Linux?',
    options: ['chown', 'chmod', 'chgrp', 'chperm'],
    correctAnswer: 1,
    category: 'linux',
    difficulty: 'intermediate'
  },
  {
    id: 'linux-3',
    question: 'What does the command "grep -r pattern ." do?',
    options: [
      'Search for pattern in current file only',
      'Recursively search for pattern in all files',
      'Replace pattern in all files',
      'Remove files matching pattern'
    ],
    correctAnswer: 1,
    category: 'linux',
    difficulty: 'intermediate'
  },
  
  // Git Questions
  {
    id: 'git-1',
    question: 'What command creates a new Git repository?',
    options: ['git create', 'git init', 'git start', 'git new'],
    correctAnswer: 1,
    category: 'git',
    difficulty: 'beginner'
  },
  {
    id: 'git-2',
    question: 'What is the purpose of "git stash"?',
    options: [
      'Delete uncommitted changes',
      'Temporarily save uncommitted changes',
      'Commit changes to a new branch',
      'Push changes to remote'
    ],
    correctAnswer: 1,
    category: 'git',
    difficulty: 'intermediate'
  },
  {
    id: 'git-3',
    question: 'What does "git rebase" do?',
    options: [
      'Combines branches by creating a merge commit',
      'Deletes a branch',
      'Reapplies commits on top of another base',
      'Resets the repository to initial state'
    ],
    correctAnswer: 2,
    category: 'git',
    difficulty: 'advanced'
  },
  
  // AWS Questions
  {
    id: 'aws-1',
    question: 'What is Amazon S3 primarily used for?',
    options: ['Compute', 'Storage', 'Database', 'Networking'],
    correctAnswer: 1,
    category: 'aws',
    difficulty: 'beginner'
  },
  {
    id: 'aws-2',
    question: 'What service would you use to run containers without managing servers?',
    options: ['EC2', 'ECS Fargate', 'Lambda', 'S3'],
    correctAnswer: 1,
    category: 'aws',
    difficulty: 'intermediate'
  },
  {
    id: 'aws-3',
    question: 'What is the purpose of AWS IAM?',
    options: [
      'Monitor applications',
      'Manage access and permissions',
      'Store data',
      'Deploy applications'
    ],
    correctAnswer: 1,
    category: 'aws',
    difficulty: 'intermediate'
  },
  
  // Docker Questions
  {
    id: 'docker-1',
    question: 'What is a Docker container?',
    options: [
      'A virtual machine',
      'A lightweight isolated environment',
      'A cloud service',
      'A programming language'
    ],
    correctAnswer: 1,
    category: 'docker',
    difficulty: 'beginner'
  },
  {
    id: 'docker-2',
    question: 'What file defines a Docker image?',
    options: ['docker.yaml', 'Dockerfile', 'container.json', 'image.txt'],
    correctAnswer: 1,
    category: 'docker',
    difficulty: 'intermediate'
  },
  
  // Kubernetes Questions
  {
    id: 'k8s-1',
    question: 'What is Kubernetes primarily used for?',
    options: [
      'Container orchestration',
      'Code compilation',
      'Database management',
      'Web hosting'
    ],
    correctAnswer: 0,
    category: 'kubernetes',
    difficulty: 'beginner'
  },
  {
    id: 'k8s-2',
    question: 'What is a Kubernetes Pod?',
    options: [
      'A cluster of nodes',
      'A group of one or more containers',
      'A storage volume',
      'A network policy'
    ],
    correctAnswer: 1,
    category: 'kubernetes',
    difficulty: 'intermediate'
  },
  
  // CI/CD Questions
  {
    id: 'cicd-1',
    question: 'What does CI/CD stand for?',
    options: [
      'Code Integration/Code Deployment',
      'Continuous Integration/Continuous Deployment',
      'Container Integration/Container Development',
      'Cloud Integration/Cloud Delivery'
    ],
    correctAnswer: 1,
    category: 'ci-cd',
    difficulty: 'beginner'
  },
  {
    id: 'cicd-2',
    question: 'What is the main benefit of automated testing in CI/CD?',
    options: [
      'Faster code writing',
      'Early bug detection',
      'Reduced server costs',
      'Better documentation'
    ],
    correctAnswer: 1,
    category: 'ci-cd',
    difficulty: 'intermediate'
  }
];

export default function DiagnosticQuiz() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResults, setShowResults] = useState(false);
  const [calculating, setCalculating] = useState(false);

  const handleAnswer = (questionId: string, answerIndex: number) => {
    setAnswers({ ...answers, [questionId]: answerIndex });
  };

  const handleNext = () => {
    if (currentQuestion < diagnosticQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateResults();
    }
  };

  const calculateResults = async () => {
    setCalculating(true);

    // Calculate score by category
    const categoryScores: Record<string, { correct: number; total: number }> = {
      linux: { correct: 0, total: 0 },
      git: { correct: 0, total: 0 },
      aws: { correct: 0, total: 0 },
      docker: { correct: 0, total: 0 },
      kubernetes: { correct: 0, total: 0 },
      'ci-cd': { correct: 0, total: 0 }
    };

    let totalCorrect = 0;
    
    diagnosticQuestions.forEach(q => {
      categoryScores[q.category].total++;
      if (answers[q.id] === q.correctAnswer) {
        categoryScores[q.category].correct++;
        totalCorrect++;
      }
    });

    // Determine skill level and recommended path
    const overallPercentage = (totalCorrect / diagnosticQuestions.length) * 100;
    let skillLevel: 'beginner' | 'intermediate' | 'advanced';
    let recommendedMode: 'express' | 'deep-dive';
    let suggestedStartWeek = 1;

    if (overallPercentage >= 70) {
      skillLevel = 'advanced';
      recommendedMode = 'express';
      suggestedStartWeek = 5; // Skip first 4 weeks
    } else if (overallPercentage >= 40) {
      skillLevel = 'intermediate';
      recommendedMode = 'express';
      suggestedStartWeek = 3; // Skip first 2 weeks
    } else {
      skillLevel = 'beginner';
      recommendedMode = 'deep-dive';
      suggestedStartWeek = 1;
    }

    // Save diagnostic results to Firestore
    if (user) {
      try {
        await setDoc(doc(db, 'diagnostics', user.uid), {
          userId: user.uid,
          completedAt: new Date(),
          totalQuestions: diagnosticQuestions.length,
          totalCorrect,
          overallPercentage,
          categoryScores,
          skillLevel,
          recommendedMode,
          suggestedStartWeek,
          answers
        });
      } catch (error) {
        console.error('Error saving diagnostic results:', error);
      }
    }

    setCalculating(false);
    setShowResults(true);
  };

  const getRecommendation = () => {
    const totalCorrect = diagnosticQuestions.filter(
      q => answers[q.id] === q.correctAnswer
    ).length;
    const percentage = (totalCorrect / diagnosticQuestions.length) * 100;

    if (percentage >= 70) {
      return {
        level: 'Advanced',
        mode: 'Express Mode',
        startWeek: 5,
        message: 'You have strong foundational knowledge! We recommend starting at Week 5 and using Express Mode to move quickly through familiar concepts.',
        color: 'text-green-400'
      };
    } else if (percentage >= 40) {
      return {
        level: 'Intermediate',
        mode: 'Express Mode',
        startWeek: 3,
        message: 'You have some experience! Start at Week 3 and use Express Mode, but feel free to review earlier weeks if needed.',
        color: 'text-blue-400'
      };
    } else {
      return {
        level: 'Beginner',
        mode: 'Deep Dive Mode',
        startWeek: 1,
        message: 'Welcome to DevOps! Start from Week 1 with Deep Dive Mode for comprehensive learning and hands-on practice.',
        color: 'text-yellow-400'
      };
    }
  };

  const currentQ = diagnosticQuestions[currentQuestion];
  const progress = ((currentQuestion + 1) / diagnosticQuestions.length) * 100;
  const totalCorrect = diagnosticQuestions.filter(
    q => answers[q.id] === q.correctAnswer
  ).length;
  const percentage = (totalCorrect / diagnosticQuestions.length) * 100;

  if (showResults) {
    const recommendation = getRecommendation();
    
    return (
      <div className="min-h-screen bg-slate-900 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
            <div className="text-center mb-8">
              <Award className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h1 className="text-3xl font-bold text-white mb-2">
                Diagnostic Complete!
              </h1>
              <p className="text-lg text-slate-300">
                Here's your personalized learning path
              </p>
            </div>

            {/* Score */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg p-6 mb-8">
              <div className="text-center">
                <div className="text-6xl font-bold text-white mb-2">
                  {percentage.toFixed(0)}%
                </div>
                <div className="text-xl text-indigo-100">
                  {totalCorrect} out of {diagnosticQuestions.length} correct
                </div>
              </div>
            </div>

            {/* Recommendation */}
            <div className="bg-slate-900 rounded-lg p-6 border border-slate-700 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Your Personalized Path
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Skill Level:</span>
                  <span className={`text-xl font-bold ${recommendation.color}`}>
                    {recommendation.level}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Recommended Mode:</span>
                  <span className="text-xl font-bold text-white">
                    {recommendation.mode}
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">Start at:</span>
                  <span className="text-xl font-bold text-white">
                    Week {recommendation.startWeek}
                  </span>
                </div>
              </div>

              <div className="mt-6 p-4 bg-blue-900/20 border border-blue-600/30 rounded-lg">
                <p className="text-slate-300">{recommendation.message}</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => navigate(`/training?tab=curriculum&startWeek=${recommendation.startWeek}`)}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                Start Learning
                <ArrowRight className="w-5 h-5" />
              </button>
              
              <button
                onClick={() => navigate('/training?tab=curriculum')}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                View Full Curriculum
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (calculating) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Brain className="w-16 h-16 text-indigo-400 mx-auto mb-4 animate-pulse" />
          <p className="text-xl text-white">Analyzing your results...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Brain className="w-8 h-8 text-indigo-400" />
            <h1 className="text-3xl font-bold text-white">Diagnostic Assessment</h1>
          </div>
          <p className="text-lg text-slate-300">
            Answer these questions to personalize your learning path
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-slate-400">
              Question {currentQuestion + 1} of {diagnosticQuestions.length}
            </span>
            <span className="text-sm text-slate-400">{progress.toFixed(0)}%</span>
          </div>
          <div className="w-full bg-slate-700 rounded-full h-2">
            <div
              className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-slate-800 rounded-lg p-8 border border-slate-700">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <span className="px-3 py-1 bg-indigo-600/20 text-indigo-400 text-xs rounded-full">
                {currentQ.category.toUpperCase()}
              </span>
              <span className="px-3 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">
                {currentQ.difficulty}
              </span>
            </div>
            <h2 className="text-2xl font-semibold text-white">
              {currentQ.question}
            </h2>
          </div>

          <div className="space-y-3 mb-8">
            {currentQ.options.map((option, index) => {
              const isSelected = answers[currentQ.id] === index;
              
              return (
                <button
                  key={index}
                  onClick={() => handleAnswer(currentQ.id, index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                    isSelected
                      ? 'border-indigo-500 bg-indigo-600/20'
                      : 'border-slate-700 bg-slate-900 hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-600'
                          : 'border-slate-600'
                      }`}
                    >
                      {isSelected && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-white">{option}</span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNext}
            disabled={answers[currentQ.id] === undefined}
            className={`w-full py-3 px-6 rounded-lg font-semibold flex items-center justify-center gap-2 ${
              answers[currentQ.id] !== undefined
                ? 'bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            {currentQuestion < diagnosticQuestions.length - 1 ? 'Next Question' : 'See Results'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
