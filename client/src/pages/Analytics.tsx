/**
 * Enhanced Analytics Dashboard
 * Comprehensive military training performance metrics
 */

import { useState, useCallback, type FC } from 'react';
import { BarChart3, Activity, Target, TrendingUp, type LucideIcon } from 'lucide-react';
import { useTimeAnalysis } from '../hooks/useTimeAnalysis';
import { useLearningVelocity } from '../hooks/useLearningVelocity';
import { LearningVelocityChart } from '../components/analytics/LearningVelocityChart';
import { TopicMasteryHeatmap } from '../components/analytics/TopicMasteryHeatmap';
import { PredictiveAnalytics } from '../components/analytics/PredictiveAnalytics';
import { usePredictiveAnalytics } from '../hooks/usePredictiveAnalytics';
import AnalyticsOverview from '../components/analytics/AnalyticsOverview';

type TimeRange = 'week' | 'month' | 'all';
type TabId = 'overview' | 'velocity' | 'mastery' | 'predictions';

interface TabButtonProps { label: string; icon: LucideIcon; isActive: boolean; onClick: () => void; }
const TabButton: FC<TabButtonProps> = ({ label, icon: Icon, isActive, onClick }) => (
  <button onClick={onClick} className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${isActive ? 'border-indigo-400 text-indigo-400' : 'border-transparent text-gray-400 hover:text-gray-300'}`}>
    <Icon className="w-4 h-4" />{label}
  </button>
);

const TIME_LABELS: Record<TimeRange, string> = { week: 'Last 7 Days', month: 'Last 30 Days', all: 'All Time' };
const TABS: Array<{ id: TabId; label: string; icon: LucideIcon }> = [
  { id: 'overview', label: 'Overview', icon: BarChart3 },
  { id: 'velocity', label: 'Learning Velocity', icon: Activity },
  { id: 'mastery', label: 'Topic Mastery', icon: Target },
  { id: 'predictions', label: 'Predictions', icon: TrendingUp }
];

export default function Analytics() { // eslint-disable-line max-lines-per-function
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
  }, [loadAnalytics]);

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
  }, [timeRange]);

  const loadStudySessionsData = useCallback(async (dateFilter: Date, data: Partial<AnalyticsData>) => {
    const sessionsQuery = query(
      collection(db, 'studySessions'),
      where('userId', '==', user?.uid),
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
        bestHour = Number.parseInt(hour);
      }
    });

    data.totalStudyTime = totalTime;
    data.totalSessions = sessionsSnap.size;
    data.avgSessionDuration = sessionsSnap.size > 0 ? totalTime / sessionsSnap.size : 0;
    data.bestStudyHour = bestHour;

    return sessionsSnap;
  }, []);

  const loadBattleDrillData = useCallback(async (data: Partial<AnalyticsData>) => {
    const drillPerfQuery = query(
      collection(db, 'battleDrillPerformance'),
      where('userId', '==', user?.uid)
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
  }, []);

  const loadProgressData = useCallback(async (data: Partial<AnalyticsData>) => {
    const progressQuery = query(
      collection(db, 'progress'),
      where('userId', '==', user?.uid)
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
      if (prog.easinessFactor && prog.easinessFactor < 2) {
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
    data.weakTopics = weakTopics.toSorted((a, b) => a.easinessFactor - b.easinessFactor).slice(0, 5);

    return progressSnap;
  }, []);

  const loadQuizData = useCallback(async (data: Partial<AnalyticsData>) => {
    const quizAttemptsQuery = query(
      collection(db, 'quizAttempts'),
      where('userId', '==', user?.uid)
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
  }, []);

  const loadLabData = useCallback(async (data: Partial<AnalyticsData>) => {
    const labQuery = query(
      collection(db, 'progress'),
      where('userId', '==', user?.uid),
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
  }, []);

  const loadFailureData = useCallback(async (data: Partial<AnalyticsData>) => {
    const failureQuery = query(
      collection(db, 'failureLogs'),
      where('userId', '==', user?.uid)
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
  }, []);

  const calculateStreaks = useCallback((sessionsSnap: QuerySnapshot) => {
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

    return { currentStreak, longestStreak };
  }, []);

  const loadAnalytics = useCallback(async () => {
    if (!user?.uid) return;

    setLoading(true);
    try {
      const dateFilter = getDateFilter();
      const data: Partial<AnalyticsData> = {};

      // Load all data sections
      const sessionsSnap = await loadStudySessionsData(dateFilter, data);
      await loadBattleDrillData(data);
      await loadProgressData(data);
      await loadQuizData(data);
      await loadLabData(data);
      await loadFailureData(data);

      // Additional data
      const stressQuery = query(
        collection(db, 'stressTrainingSessions'),
        where('userId', '==', user.uid),
        where('completed', '==', true)
      );
      const stressSnap = await getDocs(stressQuery);
      data.stressSessionsCompleted = stressSnap.size;

      const scenarioQuery = query(
        collection(db, 'scenarioAttempts'),
        where('userId', '==', user.uid),
        where('completed', '==', true)
      );
      const scenarioSnap = await getDocs(scenarioQuery);
      data.productionScenariosCompleted = scenarioSnap.size;

      // Reset tokens
      const tokenStats = await getUsageStats();
      data.resetTokensUsed = tokenStats.totalResetsUsed;

      // Calculate streaks
      const { currentStreak, longestStreak } = calculateStreaks(sessionsSnap);
      data.currentStreak = currentStreak;
      data.longestStreak = longestStreak;

      setAnalytics(data);
    } catch (error) {
      console.error('Error loading analytics:', error);
    } finally {
      setLoading(false);
    }
  }, [getDateFilter, loadStudySessionsData, loadBattleDrillData, loadProgressData, loadQuizData, loadLabData, loadFailureData, calculateStreaks]);

  const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    return `${mins}:${(seconds % 60).toString().padStart(2, '0')}`;
  };

  if (loading) return <div className="min-h-screen bg-gray-900 flex items-center justify-center"><div className="text-white">Loading analytics...</div></div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3"><BarChart3 className="w-8 h-8 text-indigo-400" /><h1 className="text-3xl font-bold">Performance Analytics</h1></div>
            <div className="flex gap-2">
              {(['week', 'month', 'all'] as const).map(range => (
                <button key={range} onClick={() => setTimeRange(range)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${timeRange === range ? 'bg-indigo-600 text-white' : 'bg-gray-800 text-gray-400 hover:bg-gray-700'}`}>
                  {TIME_LABELS[range]}
                </button>
              ))}
            </div>
          </div>
          <p className="text-gray-400">Comprehensive training metrics and performance insights</p>
        </div>
        <div className="mb-8">
          <div className="flex gap-2 border-b border-gray-700">
            {TABS.map(tab => <TabButton key={tab.id} {...tab} isActive={activeTab === tab.id} onClick={() => setActiveTab(tab.id)} />)}
          </div>
        </div>
        {activeTab === 'overview' && <AnalyticsOverview analytics={analytics} analysisData={analysisData} timeAnalysisLoading={timeAnalysisLoading} formatHour={formatHour} formatDuration={formatDuration} formatTime={formatTime} />}
        {activeTab === 'velocity' && velocityData && <LearningVelocityChart data={velocityData} />}
        {activeTab === 'mastery' && <TopicMasteryHeatmap />}
        {activeTab === 'predictions' && (
          <div className="space-y-6">
            {predictiveData && <PredictiveAnalytics data={predictiveData} />}
            {predictiveLoading && <div className="text-center py-8"><div className="text-gray-400">Generating predictions...</div></div>}
          </div>
        )}
      </div>
    </div>
  );
}
