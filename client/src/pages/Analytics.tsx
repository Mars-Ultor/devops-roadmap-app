/**
 * Enhanced Analytics Dashboard
 * Comprehensive military training performance metrics
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { 
  BarChart3, Clock, Brain, Target, 
  Trophy, Zap, AlertTriangle, CheckCircle, Flame, Award,
  Activity, TrendingDown, Shield, TrendingUp
} from 'lucide-react';
import { useResetTokens } from '../hooks/useResetTokens';
import { useTimeAnalysis } from '../hooks/useTimeAnalysis';
import { useLearningVelocity } from '../hooks/useLearningVelocity';
import { TimeAnalysisChart } from '../components/analytics/TimeAnalysisChart';
import { LearningVelocityChart } from '../components/analytics/LearningVelocityChart';
import { TopicMasteryHeatmap } from '../components/analytics/TopicMasteryHeatmap';
import { PredictiveAnalytics } from '../components/analytics/PredictiveAnalytics';
import { usePredictiveAnalytics } from '../hooks/usePredictiveAnalytics';

interface AnalyticsData {
  // Study metrics
  totalStudyTime: number;
  avgSessionDuration: number;
  totalSessions: number;
  bestStudyHour: number;
  longestStreak: number;
  currentStreak: number;
  
  // Training metrics
  battleDrillsCompleted: number;
  battleDrillAvgTime: number;
  battleDrillSuccessRate: number;
  stressSessionsCompleted: number;
  productionScenariosCompleted: number;
  
  // Mastery progression
  crawlItems: number;
  walkItems: number;
  runGuidedItems: number;
  runIndependentItems: number;
  masteryRate: number;
  
  // Performance trends
  quizSuccessRate: number;
  labSuccessRate: number;
  avgQuizScore: number;
  avgLabScore: number;
  
  // Failure & recovery
  totalFailures: number;
  aarCompleted: number;
  lessonsLearned: number;
  resetTokensUsed: number;
  
  // Weak areas
  weakTopics: Array<{
    topic: string;
    easinessFactor: number;
    attempts: number;
    lastAttempt: Date;
  }>;
}

export default function Analytics() {
  const { user } = useAuthStore();
  const { getUsageStats } = useResetTokens();
  const { analysisData, formatHour, loading: timeAnalysisLoading } = useTimeAnalysis();
  const { predictiveData, loading: predictiveLoading } = usePredictiveAnalytics();
  const { velocityData } = useLearningVelocity();
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'all'>('week');
  const [activeTab, setActiveTab] = useState<'overview' | 'velocity' | 'mastery' | 'predictions'>('overview');
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    totalStudyTime: 0,
    avgSessionDuration: 0,
    totalSessions: 0,
    bestStudyHour: 14,
    longestStreak: 0,
    currentStreak: 0,
    battleDrillsCompleted: 0,
    battleDrillAvgTime: 0,
    battleDrillSuccessRate: 0,
    stressSessionsCompleted: 0,
    productionScenariosCompleted: 0,
    crawlItems: 0,
    walkItems: 0,
    runGuidedItems: 0,
    runIndependentItems: 0,
    masteryRate: 0,
    quizSuccessRate: 0,
    labSuccessRate: 0,
    avgQuizScore: 0,
    avgLabScore: 0,
    totalFailures: 0,
    aarCompleted: 0,
    lessonsLearned: 0,
    resetTokensUsed: 0,
    weakTopics: []
  });

  useEffect(() => {
    loadAnalytics();
  }, [user, timeRange, loadAnalytics]);

  const getDateFilter = useCallback(() => {
    const now = new Date();
    switch (timeRange) {
      case 'week': {
        const weekAgo = new Date(now);
        weekAgo.setDate(now.getDate() - 7);
        return weekAgo;
      }
      case 'month': {
        const monthAgo = new Date(now);
        monthAgo.setMonth(now.getMonth() - 1);
        return monthAgo;
      }
      case 'all':
      default:
        return new Date(0); // Beginning of time
    }
  }, []);

  const loadAnalytics = useCallback(async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const dateFilter = getDateFilter();
      const data: Partial<AnalyticsData> = {};

      // Study sessions
      const sessionsQuery = query(
        collection(db, 'studySessions'),
        where('userId', '==', user.uid),
        where('completed', '==', true),
        where('startTime', '>=', dateFilter)
      );
      const sessionsSnap = await getDocs(sessionsQuery);
      
      let totalTime = 0;
      const hourCounts: Record<number, number> = {};
      
      sessionsSnap.forEach(doc => {
        const sessionData = doc.data();
        totalTime += sessionData.duration || 0;
        const hour = sessionData.startTime?.toDate().getHours() || 14;
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });

      let bestHour = 14;
      let maxCount = 0;
      Object.entries(hourCounts).forEach(([hour, count]) => {
        if (count > maxCount) {
          maxCount = count;
          bestHour = parseInt(hour);
        }
      });

      data.totalStudyTime = totalTime;
      data.totalSessions = sessionsSnap.size;
      data.avgSessionDuration = sessionsSnap.size > 0 ? totalTime / sessionsSnap.size : 0;
      data.bestStudyHour = bestHour;

      // Battle drill performance
      const drillPerfQuery = query(
        collection(db, 'battleDrillPerformance'),
        where('userId', '==', user.uid)
      );
      const drillPerfSnap = await getDocs(drillPerfQuery);
      
      let drillCount = 0;
      let totalDrillTime = 0;
      let successfulDrills = 0;
      
      drillPerfSnap.forEach(doc => {
        const perf = doc.data();
        drillCount += perf.attempts || 0;
        totalDrillTime += perf.bestTime || 0;
        if (perf.bestTime && perf.bestTime <= 300) successfulDrills++;
      });

      data.battleDrillsCompleted = drillCount;
      data.battleDrillAvgTime = drillCount > 0 ? totalDrillTime / drillCount : 0;
      data.battleDrillSuccessRate = drillPerfSnap.size > 0 ? successfulDrills / drillPerfSnap.size : 0;

      // Stress training
      const stressQuery = query(
        collection(db, 'stressTrainingSessions'),
        where('userId', '==', user.uid),
        where('completed', '==', true)
      );
      const stressSnap = await getDocs(stressQuery);
      data.stressSessionsCompleted = stressSnap.size;

      // Production scenarios
      const scenarioQuery = query(
        collection(db, 'scenarioAttempts'),
        where('userId', '==', user.uid),
        where('completed', '==', true)
      );
      const scenarioSnap = await getDocs(scenarioQuery);
      data.productionScenariosCompleted = scenarioSnap.size;

      // Mastery progression
      const progressQuery = query(
        collection(db, 'progress'),
        where('userId', '==', user.uid)
      );
      const progressSnap = await getDocs(progressQuery);
      
      let crawl = 0, walk = 0, runGuided = 0, runIndependent = 0;
      const weakTopics: Array<{ topic: string; easinessFactor: number; attempts: number; lastAttempt: Date }> = [];
      
      progressSnap.forEach(doc => {
        const prog = doc.data();
        switch (prog.masteryLevel) {
          case 'crawl': crawl++; break;
          case 'walk': walk++; break;
          case 'run-guided': runGuided++; break;
          case 'run-independent': runIndependent++; break;
        }
        
        // Track weak areas (EF < 2.0)
        if (prog.easinessFactor && prog.easinessFactor < 2.0) {
          weakTopics.push({
            topic: prog.lessonId || prog.contentId || 'Unknown',
            easinessFactor: prog.easinessFactor,
            attempts: prog.repetitions || 0,
            lastAttempt: prog.lastReviewDate?.toDate() || new Date()
          });
        }
      });

      data.crawlItems = crawl;
      data.walkItems = walk;
      data.runGuidedItems = runGuided;
      data.runIndependentItems = runIndependent;
      data.masteryRate = progressSnap.size > 0 ? runIndependent / progressSnap.size : 0;
      data.weakTopics = weakTopics.sort((a, b) => a.easinessFactor - b.easinessFactor).slice(0, 5);

      // Quiz performance
      const quizAttemptsQuery = query(
        collection(db, 'quizAttempts'),
        where('userId', '==', user.uid)
      );
      const quizSnap = await getDocs(quizAttemptsQuery);
      
      let quizTotal = 0;
      let quizPassed = 0;
      let totalQuizScore = 0;
      
      quizSnap.forEach(doc => {
        const attempt = doc.data();
        quizTotal++;
        totalQuizScore += attempt.score || 0;
        if (attempt.passed) quizPassed++;
      });

      data.quizSuccessRate = quizTotal > 0 ? quizPassed / quizTotal : 0;
      data.avgQuizScore = quizTotal > 0 ? totalQuizScore / quizTotal : 0;

      // Lab performance
      const labQuery = query(
        collection(db, 'progress'),
        where('userId', '==', user.uid),
        where('type', '==', 'lab')
      );
      const labSnap = await getDocs(labQuery);
      
      let labTotal = 0;
      let labPassed = 0;
      let totalLabScore = 0;
      
      labSnap.forEach(doc => {
        const lab = doc.data();
        labTotal++;
        totalLabScore += lab.score || 0;
        if (lab.completed) labPassed++;
      });

      data.labSuccessRate = labTotal > 0 ? labPassed / labTotal : 0;
      data.avgLabScore = labTotal > 0 ? totalLabScore / labTotal : 0;

      // Failure log
      const failureQuery = query(
        collection(db, 'failureLogs'),
        where('userId', '==', user.uid)
      );
      const failureSnap = await getDocs(failureQuery);
      
      let aarCount = 0;
      let lessonsCount = 0;
      
      failureSnap.forEach(doc => {
        const failure = doc.data();
        if (failure.aarCompleted) aarCount++;
        lessonsCount += failure.lessonsLearned?.length || 0;
      });

      data.totalFailures = failureSnap.size;
      data.aarCompleted = aarCount;
      data.lessonsLearned = lessonsCount;

      // Reset tokens
      const tokenStats = await getUsageStats();
      data.resetTokensUsed = tokenStats.totalResetsUsed;

      // Calculate streaks
      const dailySessions = new Map<string, boolean>();
      sessionsSnap.forEach(doc => {
        const date = doc.data().startTime?.toDate().toISOString().split('T')[0];
        if (date) dailySessions.set(date, true);
      });

      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;
      const today = new Date();
      
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateKey = checkDate.toISOString().split('T')[0];
        
        if (dailySessions.has(dateKey)) {
          tempStreak++;
          if (i === 0 || tempStreak > 0) currentStreak = tempStreak;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          if (i === 0) currentStreak = 0;
          tempStreak = 0;
        }
      }

      data.currentStreak = currentStreak;
      data.longestStreak = longestStreak;

      setAnalytics(data as AnalyticsData);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [user?.uid, timeRange, getUsageStats, getDateFilter]);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMasteryDistribution = () => {
    const total = analytics.crawlItems + analytics.walkItems + analytics.runGuidedItems + analytics.runIndependentItems;
    if (total === 0) return [];
    
    return [
      { level: 'Crawl', count: analytics.crawlItems, percentage: (analytics.crawlItems / total) * 100, color: 'bg-red-500' },
      { level: 'Walk', count: analytics.walkItems, percentage: (analytics.walkItems / total) * 100, color: 'bg-yellow-500' },
      { level: 'Run-Guided', count: analytics.runGuidedItems, percentage: (analytics.runGuidedItems / total) * 100, color: 'bg-blue-500' },
      { level: 'Run-Independent', count: analytics.runIndependentItems, percentage: (analytics.runIndependentItems / total) * 100, color: 'bg-green-500' }
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading analytics...</div>
      </div>
    );
  }

  const masteryDist = getMasteryDistribution();

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <BarChart3 className="w-8 h-8 text-indigo-400" />
              <h1 className="text-3xl font-bold">Performance Analytics</h1>
            </div>
            
            {/* Time range selector */}
            <div className="flex gap-2">
              {(['week', 'month', 'all'] as const).map(range => (
                <button
                  key={range}
                  onClick={() => setTimeRange(range)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    timeRange === range 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {range === 'week' ? 'Last 7 Days' : range === 'month' ? 'Last 30 Days' : 'All Time'}
                </button>
              ))}
            </div>
          </div>
          <p className="text-gray-400">
            Comprehensive training metrics and performance insights
          </p>
        </div>

        {/* Analytics Tabs */}
        <div className="mb-8">
          <div className="flex gap-2 border-b border-gray-700">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'velocity', label: 'Learning Velocity', icon: Activity },
              { id: 'mastery', label: 'Topic Mastery', icon: Target },
              { id: 'predictions', label: 'Predictions', icon: TrendingUp }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as unknown)}
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
        {activeTab === 'overview' && (
          <div>
            {/* Key Metrics Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg p-6 border border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <Clock className="w-8 h-8 text-blue-200" />
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{formatDuration(analytics.totalStudyTime)}</div>
                <div className="text-sm text-blue-200">Study Time</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-orange-600 to-orange-800 rounded-lg p-6 border border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <Flame className="w-8 h-8 text-orange-200" />
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{analytics.currentStreak}</div>
                <div className="text-sm text-orange-200">Day Streak</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-800 rounded-lg p-6 border border-green-500">
            <div className="flex items-center justify-between mb-2">
              <Trophy className="w-8 h-8 text-green-200" />
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{Math.round(analytics.masteryRate * 100)}%</div>
                <div className="text-sm text-green-200">Mastery Rate</div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-lg p-6 border border-purple-500">
            <div className="flex items-center justify-between mb-2">
              <Target className="w-8 h-8 text-purple-200" />
              <div className="text-right">
                <div className="text-3xl font-bold text-white">{analytics.battleDrillsCompleted}</div>
                <div className="text-sm text-purple-200">Drills Complete</div>
              </div>
            </div>
          </div>
        </div>

        {/* Training Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Battle Drills */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-6 h-6 text-yellow-400" />
              <h2 className="text-xl font-semibold">Battle Drill Performance</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Completed</span>
                <span className="text-white font-semibold">{analytics.battleDrillsCompleted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Avg Time</span>
                <span className="text-white font-semibold">{formatTime(Math.round(analytics.battleDrillAvgTime))}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Success Rate</span>
                <span className="text-green-400 font-semibold">{Math.round(analytics.battleDrillSuccessRate * 100)}%</span>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-green-500 h-3 rounded-full transition-all"
                    style={{ width: `${analytics.battleDrillSuccessRate * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Advanced Training */}
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-semibold">Advanced Training</h2>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Stress Sessions</span>
                <span className="text-white font-semibold">{analytics.stressSessionsCompleted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Production Scenarios</span>
                <span className="text-white font-semibold">{analytics.productionScenariosCompleted}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Total Sessions</span>
                <span className="text-white font-semibold">{analytics.totalSessions}</span>
              </div>
              
              <div className="pt-4 border-t border-gray-700">
                <div className="text-sm text-gray-400">
                  {analytics.stressSessionsCompleted + analytics.productionScenariosCompleted} advanced training scenarios completed
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Mastery Progression */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <Activity className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-semibold">Mastery Progression</h2>
          </div>

          {masteryDist.length > 0 ? (
            <>
              <div className="mb-4">
                <div className="w-full bg-gray-700 rounded-full h-8 overflow-hidden flex">
                  {masteryDist.map((level, idx) => (
                    level.percentage > 0 && (
                      <div
                        key={idx}
                        className={`${level.color} flex items-center justify-center text-white text-xs font-semibold`}
                        style={{ width: `${level.percentage}%` }}
                        title={`${level.level}: ${level.count} items`}
                      >
                        {level.percentage > 10 ? `${Math.round(level.percentage)}%` : ''}
                      </div>
                    )
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {masteryDist.map((level, idx) => (
                  <div key={idx} className="bg-gray-900/50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className={`w-3 h-3 rounded-full ${level.color}`} />
                      <span className="text-sm text-gray-400">{level.level}</span>
                    </div>
                    <div className="text-2xl font-bold text-white">{level.count}</div>
                    <div className="text-xs text-gray-500">{Math.round(level.percentage)}% of total</div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No mastery data available yet
            </div>
          )}
        </div>

        {/* Quiz & Lab Performance */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6 text-blue-400" />
              <h2 className="text-xl font-semibold">Quiz Performance</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Success Rate</span>
                <span className={`font-semibold ${analytics.quizSuccessRate >= 0.7 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {Math.round(analytics.quizSuccessRate * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Average Score</span>
                <span className="text-white font-semibold">{Math.round(analytics.avgQuizScore)}%</span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all"
                  style={{ width: `${analytics.avgQuizScore}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle className="w-6 h-6 text-green-400" />
              <h2 className="text-xl font-semibold">Lab Performance</h2>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Completion Rate</span>
                <span className={`font-semibold ${analytics.labSuccessRate >= 0.7 ? 'text-green-400' : 'text-yellow-400'}`}>
                  {Math.round(analytics.labSuccessRate * 100)}%
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Average Score</span>
                <span className="text-white font-semibold">{Math.round(analytics.avgLabScore)}%</span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-2 overflow-hidden">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${analytics.avgLabScore}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Failure Analysis */}
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-orange-400" />
            <h2 className="text-xl font-semibold">Failure Analysis & Learning</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Total Failures</div>
              <div className="text-2xl font-bold text-orange-400">{analytics.totalFailures}</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">AARs Completed</div>
              <div className="text-2xl font-bold text-blue-400">{analytics.aarCompleted}</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Lessons Learned</div>
              <div className="text-2xl font-bold text-green-400">{analytics.lessonsLearned}</div>
            </div>
            <div className="bg-gray-900/50 rounded-lg p-4">
              <div className="text-sm text-gray-400 mb-1">Resets Used</div>
              <div className="text-2xl font-bold text-yellow-400">{analytics.resetTokensUsed}</div>
            </div>
          </div>

          <div className="bg-blue-900/20 border border-blue-700 rounded-lg p-4">
            <p className="text-sm text-blue-300">
              <span className="font-semibold">AAR Completion Rate:</span> {analytics.totalFailures > 0 ? Math.round((analytics.aarCompleted / analytics.totalFailures) * 100) : 0}%
              {analytics.aarCompleted < analytics.totalFailures && (
                <span className="ml-2 text-yellow-300">
                  ({analytics.totalFailures - analytics.aarCompleted} failures without AAR review)
                </span>
              )}
            </p>
          </div>
        </div>

        {/* Weak Areas */}
        {analytics.weakTopics.length > 0 && (
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-3 mb-6">
              <TrendingDown className="w-6 h-6 text-red-400" />
              <h2 className="text-xl font-semibold">Areas Needing Review</h2>
            </div>

            <div className="space-y-3">
              {analytics.weakTopics.map((topic, idx) => (
                <div key={idx} className="bg-gray-900/50 border border-red-800 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-white">{topic.topic}</div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-red-900/30 text-red-400 text-xs rounded">
                        EF: {topic.easinessFactor.toFixed(2)}
                      </span>
                      <span className="text-xs text-gray-500">{topic.attempts} attempts</span>
                    </div>
                  </div>
                  <div className="w-full bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-red-500 h-2 rounded-full transition-all"
                      style={{ width: `${Math.max(((topic.easinessFactor - 1.3) / (2.5 - 1.3)) * 100, 5)}%` }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 mt-2">
                    Last attempt: {topic.lastAttempt.toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 bg-yellow-900/20 border border-yellow-800 rounded-lg p-4">
              <p className="text-sm text-yellow-300">
                💡 <span className="font-semibold">Priority:</span> Focus review sessions on these topics to improve retention and mastery.
              </p>
            </div>
          </div>
        )}

        {/* Time Analysis Chart */}
        {!timeAnalysisLoading && analysisData && analysisData.totalDataPoints > 0 && (
          <TimeAnalysisChart 
            data={analysisData}
            formatHour={formatHour}
          />
        )}

        {/* Insights & Recommendations */}
        <div className="bg-gradient-to-r from-indigo-900/30 to-purple-900/30 border border-indigo-700 rounded-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-indigo-400" />
            <h2 className="text-xl font-semibold">Personalized Insights</h2>
          </div>

          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <span className="text-indigo-400">→</span>
              <span className="text-gray-300">
                <strong>Study Pattern:</strong> Your most productive hour is {analytics.bestStudyHour > 12 ? analytics.bestStudyHour - 12 : analytics.bestStudyHour}{analytics.bestStudyHour >= 12 ? 'PM' : 'AM'}. 
                Schedule important sessions during this time.
              </span>
            </div>

            <div className="flex items-start gap-3">
              <span className="text-indigo-400">→</span>
              <span className="text-gray-300">
                <strong>Consistency:</strong> Current streak is {analytics.currentStreak} days. {analytics.currentStreak >= 7 ? '🔥 Excellent discipline!' : 'Aim for 7+ days to build lasting habits.'}
              </span>
            </div>

            {analytics.masteryRate < 0.3 && (
              <div className="flex items-start gap-3">
                <span className="text-yellow-400">→</span>
                <span className="text-gray-300">
                  <strong>Mastery Focus:</strong> Only {Math.round(analytics.masteryRate * 100)}% of items at Run-Independent level. Focus on completing Battle Drills to build muscle memory.
                </span>
              </div>
            )}

            {analytics.quizSuccessRate < 0.7 && (
              <div className="flex items-start gap-3">
                <span className="text-orange-400">→</span>
                <span className="text-gray-300">
                  <strong>Quiz Performance:</strong> Success rate at {Math.round(analytics.quizSuccessRate * 100)}%. Review AAR feedback and focus on weak topics before retrying.
                </span>
              </div>
            )}

            {analytics.resetTokensUsed > 5 && (
              <div className="flex items-start gap-3">
                <span className="text-red-400">→</span>
                <span className="text-gray-300">
                  <strong>Reset Token Usage:</strong> {analytics.resetTokensUsed} resets used. High reset count suggests rushing through content. Slow down and focus on understanding.
                </span>
              </div>
            )}

            {analytics.battleDrillSuccessRate > 0.8 && (
              <div className="flex items-start gap-3">
                <span className="text-green-400">→</span>
                <span className="text-gray-300">
                  <strong>Battle Drill Excellence:</strong> {Math.round(analytics.battleDrillSuccessRate * 100)}% success rate! Your muscle memory is strong. Ready for production scenarios.
                </span>
              </div>
            )}
          </div>
        </div>
          </div>
        )}

        {activeTab === 'velocity' && velocityData && (
          <LearningVelocityChart data={velocityData} />
        )}

        {activeTab === 'mastery' && (
          <TopicMasteryHeatmap />
        )}

        {activeTab === 'predictions' && (
          <div className="space-y-6">
            {predictiveData && <PredictiveAnalytics data={predictiveData} />}
            {predictiveLoading && (
              <div className="text-center py-8">
                <div className="text-gray-400">Generating predictions...</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
