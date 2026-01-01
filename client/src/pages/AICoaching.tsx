/**
 * AI/ML Coaching Page
 * Comprehensive AI-powered coaching with machine learning insights
 */

import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { MLCoachingDashboard } from '../components/ai/MLCoachingDashboard';
import { MLModelManagementDashboard } from '../components/ai/MLModelManagementDashboard';
import {
  Brain,
  TrendingUp,
  Target,
  Users,
  BarChart3,
  Sparkles,
  Zap,
  Award,
  BookOpen,
  Settings
} from 'lucide-react';
import type { CoachContext } from '../../types/aiCoach';

export default function AICoachingPage() {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'coaching' | 'models'>('coaching');
  const [coachContext, setCoachContext] = useState<CoachContext | undefined>();

  // Initialize with sample context - in real app this would come from current lesson/session
  useEffect(() => {
    if (user?.uid) {
      setCoachContext({
        contentType: 'lesson',
        contentId: 'sample-lesson',
        userProgress: {
          attempts: 3,
          timeSpent: 45,
          hintsUsed: 1,
          successRate: 0.75,
          streakCount: 5
        },
        currentWeek: 6,
        performanceMetrics: {
          accuracy: 0.8,
          speed: 0.7,
          persistence: 0.9,
          learningVelocity: 0.85
        }
      });
    }
  }, [user?.uid]);

  const features = [
    {
      icon: Brain,
      title: 'ML-Powered Coaching',
      description: 'AI coach that learns from your patterns and adapts its teaching style',
      capabilities: ['Personalized feedback', 'Adaptive difficulty', 'Learning style detection']
    },
    {
      icon: TrendingUp,
      title: 'Performance Prediction',
      description: 'Machine learning models predict your completion timeline and success probability',
      capabilities: ['Completion forecasting', 'Risk assessment', 'Intervention recommendations']
    },
    {
      icon: Target,
      title: 'Skill Gap Analysis',
      description: 'Advanced algorithms identify knowledge gaps and recommend focused study',
      capabilities: ['Gap detection', 'Priority ranking', 'Targeted remediation']
    },
    {
      icon: BookOpen,
      title: 'Learning Path Optimization',
      description: 'ML-optimized learning sequences based on your progress and preferences',
      capabilities: ['Path recommendation', 'Topic sequencing', 'Time estimation']
    },
    {
      icon: Users,
      title: 'Style-Aware Teaching',
      description: 'Automatically detects and adapts to your preferred learning style',
      capabilities: ['Style classification', 'Method adaptation', 'Effectiveness tracking']
    },
    {
      icon: Sparkles,
      title: 'Intelligent Insights',
      description: 'Deep learning analysis provides actionable insights about your learning',
      capabilities: ['Pattern recognition', 'Trend analysis', 'Predictive recommendations']
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Brain className="w-8 h-8 text-indigo-400" />
              <h1 className="text-3xl font-bold">AI/ML Coaching</h1>
            </div>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium text-indigo-400 border border-indigo-400">
              Machine Learning Enhanced
            </span>
          </div>
          <p className="text-gray-400 text-lg">
            Experience the future of personalized learning with AI-powered coaching and machine learning insights
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 border-b border-gray-700">
            {[
              { id: 'coaching', label: 'AI Coaching', icon: Brain },
              { id: 'models', label: 'ML Models', icon: Settings }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === tab.id
                    ? 'border-indigo-400 text-indigo-400'
                    : 'border-transparent text-gray-400 hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'coaching' && (
          <div className="space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-700 rounded-lg">
              <div className="p-8">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <div className="relative">
                      <Brain className="w-16 h-16 text-indigo-400" />
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                        <Zap className="w-3 h-3 text-white" />
                      </div>
                    </div>
                  </div>
                  <h2 className="text-2xl font-bold">Your Personal AI Coach</h2>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    Powered by advanced machine learning algorithms, your AI coach analyzes your learning patterns,
                    predicts performance, and provides personalized guidance to accelerate your DevOps journey.
                  </p>
                  <div className="flex justify-center gap-4 mt-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900/30 text-green-400 border border-green-400">
                      <TrendingUp className="w-3 h-3 mr-1" />
                      Real-time Analysis
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900/30 text-blue-400 border border-blue-400">
                      <Target className="w-3 h-3 mr-1" />
                      Adaptive Learning
                    </span>
                    <span className="inline-flex items-3 py-1 rounded-full text-sm font-medium bg-purple-900/30 text-purple-400 border border-purple-400">
                      <Sparkles className="w-3 h-3 mr-1" />
                      ML-Powered
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Grid */}
            <div>
              <h3 className="text-xl font-bold mb-6">AI/ML Coaching Features</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {features.map((feature, index) => (
                  <div key={index} className="bg-gray-800 border border-gray-700 rounded-lg hover:bg-gray-750 transition-colors">
                    <div className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <feature.icon className="w-6 h-6 text-indigo-400" />
                        <h3 className="text-lg font-semibold">{feature.title}</h3>
                      </div>
                      <p className="text-gray-400 text-sm mb-4">{feature.description}</p>
                      <div className="space-y-2">
                        {feature.capabilities.map((capability, capIndex) => (
                          <div key={capIndex} className="flex items-center gap-2 text-sm">
                            <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></div>
                            <span className="text-gray-300">{capability}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* ML Coaching Dashboard */}
            <div>
              <h3 className="text-xl font-bold mb-6">Your ML-Powered Coaching Session</h3>
              <MLCoachingDashboard
                context={coachContext}
                onContextUpdate={setCoachContext}
              />
            </div>
          </div>
        )}

        {activeTab === 'models' && (
          <div className="space-y-8">
            {/* Models Header */}
            <div className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-blue-700 rounded-lg">
              <div className="p-8">
                <div className="text-center space-y-4">
                  <div className="flex justify-center">
                    <Settings className="w-16 h-16 text-blue-400" />
                  </div>
                  <h2 className="text-2xl font-bold">Machine Learning Models</h2>
                  <p className="text-gray-300 max-w-2xl mx-auto">
                    Explore the ML models powering your personalized coaching experience.
                    These models continuously learn and adapt to provide better insights.
                  </p>
                  <div className="flex justify-center gap-4 mt-6">
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-orange-900/30 text-orange-400 border border-orange-400">
                      <Brain className="w-3 h-3 mr-1" />
                      TensorFlow
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-900/30 text-blue-400 border border-blue-400">
                      <BarChart3 className="w-3 h-3 mr-1" />
                      ONNX
                    </span>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-900/30 text-green-400 border border-green-400">
                      <Award className="w-3 h-3 mr-1" />
                      85%+ Accuracy
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* ML Model Management Dashboard */}
            <MLModelManagementDashboard />
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 bg-gray-800/50 border border-gray-700 rounded-lg">
          <div className="p-6">
            <div className="text-center space-y-4">
              <h3 className="text-lg font-semibold">About ML-Enhanced Coaching</h3>
              <p className="text-gray-400 text-sm max-w-3xl mx-auto">
                Our AI coaching system uses multiple machine learning models trained on thousands of learning sessions
                to provide personalized guidance. The system analyzes your performance patterns, learning style,
                and progress trajectory to offer targeted recommendations and interventions.
              </p>
              <div className="flex justify-center gap-6 text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Continuously Learning
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  Privacy-First
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  Research-Backed
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}