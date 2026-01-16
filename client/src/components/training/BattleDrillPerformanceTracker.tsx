/* eslint-disable max-lines-per-function */
/**
 * Battle Drill Performance Tracker
 * Phase 7: Real-time timer, personal best tracking, performance trending, recertification
 */

import { useState, useEffect, useCallback, memo, useRef } from 'react';
import { TrendingUp, TrendingDown, Minus, Trophy, Target, AlertTriangle, Calendar } from 'lucide-react';
import { db } from '../../lib/firebase';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';

interface PerformanceData {
  attemptId: string;
  timestamp: Date;
  timeSeconds: number;
  score: number;
  hintsUsed: number;
  passed: boolean;
}

interface TrendAnalysis {
  trend: 'improving' | 'stable' | 'degrading';
  averageTime: number;
  averageScore: number;
  bestTime: number;
  bestScore: number;
  recentAttempts: number;
  needsRecertification: boolean;
  daysUntilRecertification: number;
  proficiencyLevel: 'novice' | 'competent' | 'proficient' | 'expert';
}

interface BattleDrillPerformanceTrackerProps {
  readonly userId: string;
  readonly drillId: string;
  readonly onRecertificationNeeded?: () => void;
}

// Separate component for performance analytics to prevent re-renders
const PerformanceAnalytics = memo(({ trendAnalysis, formatTime }: {
  trendAnalysis: TrendAnalysis;
  formatTime: (seconds: number) => string;
}) => {
  const getTrendIcon = () => {
    switch (trendAnalysis.trend) {
      case 'improving':
        return <TrendingUp className="w-5 h-5 text-green-400" />;
      case 'degrading':
        return <TrendingDown className="w-5 h-5 text-red-400" />;
      case 'stable':
        return <Minus className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getTrendColor = () => {
    switch (trendAnalysis.trend) {
      case 'improving':
        return 'text-green-400';
      case 'degrading':
        return 'text-red-400';
      case 'stable':
        return 'text-yellow-400';
    }
  };

  const getProficiencyBadge = (level: TrendAnalysis['proficiencyLevel']) => {
    const badges = {
      novice: { color: 'bg-gray-700 text-gray-300', icon: '🌱' },
      competent: { color: 'bg-blue-700 text-blue-300', icon: '📘' },
      proficient: { color: 'bg-purple-700 text-purple-300', icon: '⚡' },
      expert: { color: 'bg-yellow-700 text-yellow-300', icon: '👑' }
    };
    
    return badges[level];
  };

  return (
    <>
      {/* Performance Trending */}
      <div className="bg-slate-800 rounded-lg p-6 border-2 border-slate-700">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-400" />
            Performance Trending
          </h3>
          <div className={`flex items-center gap-2 ${getTrendColor()}`}>
            {getTrendIcon()}
            <span className="font-semibold capitalize">{trendAnalysis.trend}</span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-slate-900/50 p-3 rounded">
            <div className="text-gray-400 text-sm mb-1">Average Score</div>
            <div className="text-white text-xl font-bold">
              {trendAnalysis.averageScore.toFixed(1)}%
            </div>
          </div>
          <div className="bg-slate-900/50 p-3 rounded">
            <div className="text-gray-400 text-sm mb-1">Average Time</div>
            <div className="text-white text-xl font-bold">
              {formatTime(Math.round(trendAnalysis.averageTime))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-green-900/20 border border-green-600 p-3 rounded">
            <div className="flex items-center gap-2 text-green-400 text-sm mb-1">
              <Trophy className="w-4 h-4" />
              Personal Best
            </div>
            <div className="text-white font-bold">{formatTime(trendAnalysis.bestTime)}</div>
          </div>
          <div className="bg-green-900/20 border border-green-600 p-3 rounded">
            <div className="flex items-center gap-2 text-green-400 text-sm mb-1">
              <Trophy className="w-4 h-4" />
              Best Score
            </div>
            <div className="text-white font-bold">{trendAnalysis.bestScore}%</div>
          </div>
        </div>
      </div>

      {/* Proficiency & Recertification */}
      <div className="bg-slate-800 rounded-lg p-6 border-2 border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          Proficiency & Recertification
        </h3>

        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-gray-400 text-sm mb-1">Current Level</div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getProficiencyBadge(trendAnalysis.proficiencyLevel).color}`}>
                {getProficiencyBadge(trendAnalysis.proficiencyLevel).icon} {trendAnalysis.proficiencyLevel.toUpperCase()}
              </span>
            </div>
          </div>
          
          {trendAnalysis.needsRecertification ? (
            <div className="bg-red-900/30 border-2 border-red-600 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-red-400 font-semibold">
                <AlertTriangle className="w-5 h-5" />
                Recertification Required
              </div>
            </div>
          ) : (
            <div className="text-right">
              <div className="text-gray-400 text-sm mb-1">Next Recertification</div>
              <div className="text-white font-semibold">
                {trendAnalysis.daysUntilRecertification} days
              </div>
            </div>
          )}
        </div>

        <div className="bg-slate-900/50 p-4 rounded">
          <div className="text-sm text-gray-300">
            <strong>Recertification Schedule:</strong>
            <ul className="mt-2 space-y-1 list-disc list-inside">
              <li>🌱 Novice: Every 7 days</li>
              <li>📘 Competent: Every 14 days</li>
              <li>⚡ Proficient: Every 30 days</li>
              <li>👑 Expert: Every 90 days</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
});

PerformanceAnalytics.displayName = 'PerformanceAnalytics';

// Custom comparison function to prevent re-renders when trendAnalysis values are the same
const arePropsEqual = (
  prevProps: { trendAnalysis: TrendAnalysis; formatTime: (seconds: number) => string },
  nextProps: { trendAnalysis: TrendAnalysis; formatTime: (seconds: number) => string }
) => {
  const prev = prevProps.trendAnalysis;
  const next = nextProps.trendAnalysis;
  
  return (
    prev.trend === next.trend &&
    prev.averageTime === next.averageTime &&
    prev.averageScore === next.averageScore &&
    prev.bestTime === next.bestTime &&
    prev.bestScore === next.bestScore &&
    prev.recentAttempts === next.recentAttempts &&
    prev.needsRecertification === next.needsRecertification &&
    prev.daysUntilRecertification === next.daysUntilRecertification &&
    prev.proficiencyLevel === next.proficiencyLevel &&
    prevProps.formatTime === nextProps.formatTime
  );
};

const MemoizedPerformanceAnalytics = memo(PerformanceAnalytics, arePropsEqual);

function BattleDrillPerformanceTracker({
  userId,
  drillId,
  onRecertificationNeeded
}: BattleDrillPerformanceTrackerProps) {
  const [trendAnalysis, setTrendAnalysis] = useState<TrendAnalysis | null>(null);
  const [loading, setLoading] = useState(true);
  const loadedKeyRef = useRef<string>('');

  const analyzeTrendsFromHistory = useCallback((history: PerformanceData[]) => {
    if (history.length === 0) {
      return;
    }

    // Calculate averages
    const recentAttempts = history.slice(0, 5);
    const avgTime = recentAttempts.reduce((sum, p) => sum + p.timeSeconds, 0) / recentAttempts.length;
    const avgScore = recentAttempts.reduce((sum, p) => sum + p.score, 0) / recentAttempts.length;

    // Find personal bests
    const bestTime = Math.min(...history.map(p => p.timeSeconds));
    const bestScore = Math.max(...history.map(p => p.score));

    // Determine trend
    let trend: 'improving' | 'stable' | 'degrading' = 'stable';
    if (recentAttempts.length >= 3) {
      const recent3 = recentAttempts.slice(0, 3);
      const older3 = history.slice(3, 6);
      
      if (older3.length >= 3) {
        const recentAvg = recent3.reduce((sum, p) => sum + p.score, 0) / recent3.length;
        const olderAvg = older3.reduce((sum, p) => sum + p.score, 0) / older3.length;
        
        if (recentAvg > olderAvg + 10) trend = 'improving';
        else if (recentAvg < olderAvg - 10) trend = 'degrading';
      }
    }

    // Determine proficiency level based on average score
    let proficiencyLevel: TrendAnalysis['proficiencyLevel'] = 'novice';
    if (avgScore >= 95) proficiencyLevel = 'expert';
    else if (avgScore >= 85) proficiencyLevel = 'proficient';
    else if (avgScore >= 75) proficiencyLevel = 'competent';

    // Calculate recertification schedule
    const lastAttempt = history[0];
    const daysSinceLastAttempt = Math.floor((Date.now() - lastAttempt.timestamp.getTime()) / (1000 * 60 * 60 * 24));
    
    const recertificationDays: Record<TrendAnalysis['proficiencyLevel'], number> = {
      novice: 7,
      competent: 14,
      proficient: 30,
      expert: 90
    };

    const daysUntilRecertification = recertificationDays[proficiencyLevel] - daysSinceLastAttempt;
    const needsRecertification = daysUntilRecertification <= 0;

    if (needsRecertification && onRecertificationNeeded) {
      onRecertificationNeeded();
    }

    const newAnalysis: TrendAnalysis = {
      trend,
      averageTime: avgTime,
      averageScore: avgScore,
      bestTime,
      bestScore,
      recentAttempts: recentAttempts.length,
      needsRecertification,
      daysUntilRecertification: Math.max(0, daysUntilRecertification),
      proficiencyLevel
    };
    
    // Only update if analysis has actually changed (compare all values)
    setTrendAnalysis(prev => {
      if (!prev) return newAnalysis;
      
      // Deep comparison - only update if values changed
      if (
        prev.trend === newAnalysis.trend &&
        prev.averageTime === newAnalysis.averageTime &&
        prev.averageScore === newAnalysis.averageScore &&
        prev.bestTime === newAnalysis.bestTime &&
        prev.bestScore === newAnalysis.bestScore &&
        prev.recentAttempts === newAnalysis.recentAttempts &&
        prev.needsRecertification === newAnalysis.needsRecertification &&
        prev.daysUntilRecertification === newAnalysis.daysUntilRecertification &&
        prev.proficiencyLevel === newAnalysis.proficiencyLevel
      ) {
        return prev; // Return same object reference to prevent re-render
      }
      
      return newAnalysis;
    });
  }, [onRecertificationNeeded]);

  const loadPerformanceHistory = useCallback(async () => {
    const loadKey = `${userId}-${drillId}`;
    
    // Prevent double-loading for the same user/drill combination
    if (loadedKeyRef.current === loadKey) return;
    loadedKeyRef.current = loadKey;

    try {
      setLoading(true);
      const performanceRef = collection(db, 'battleDrillPerformance');
      const q = query(
        performanceRef,
        where('userId', '==', userId),
        where('drillId', '==', drillId),
        orderBy('timestamp', 'desc'),
        limit(10)
      );

      const snapshot = await getDocs(q);
      const history: PerformanceData[] = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          attemptId: doc.id,
          timestamp: data.timestamp?.toDate() || new Date(),
          timeSeconds: data.timeSeconds || 0,
          score: data.score || 0,
          hintsUsed: data.hintsUsed || 0,
          passed: data.passed || false
        };
      });

      // Analyze trends immediately after loading data
      if (history.length > 0) {
        analyzeTrendsFromHistory(history);
      }
    } catch (error) {
      console.error('Error loading performance history:', error);
    } finally {
      setLoading(false);
    }
  }, [userId, drillId, analyzeTrendsFromHistory]);

  useEffect(() => {
    loadPerformanceHistory();
  }, [loadPerformanceHistory]);

  const formatTime = useCallback((seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  }, []);

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
        <div className="text-gray-400 animate-pulse">Loading performance data...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Performance Analytics - Memoized to prevent flickering */}
      {trendAnalysis && <MemoizedPerformanceAnalytics trendAnalysis={trendAnalysis} formatTime={formatTime} />}
    </div>
  );
}

// Export with memo but allow currentAttemptTime to update (just optimize the heavy analysis)
export default memo(BattleDrillPerformanceTracker);
