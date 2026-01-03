/**
 * Predictive Analytics Hook
 * Estimates completion times and predicts learning outcomes
 */

import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';

export interface PredictiveData {
  completionPrediction: {
    estimatedCompletionDate: Date;
    confidence: number;
    remainingWeeks: number;
    remainingItems: number;
    currentPace: number;
    requiredPace: number;
    riskFactors: string[];
  };
  weakAreaPredictions: Array<{
    topic: string;
    riskLevel: 'low' | 'medium' | 'high';
    predictedStruggles: string;
    preventiveActions: string[];
    estimatedDifficulty: number;
  }>;
  performanceForecast: {
    nextWeekPrediction: {
      expectedItems: number;
      expectedMastery: number;
      confidence: number;
    };
    monthProjection: {
      totalItems: number;
      masteryRate: number;
      skillImprovements: string[];
    };
  };
  learningTrajectory: {
    currentTrajectory: 'accelerating' | 'steady' | 'plateauing' | 'declining';
    optimalTrajectory: 'accelerating' | 'steady';
    adjustments: string[];
  };
}

export function usePredictiveAnalytics() {
  const { user } = useAuthStore();
  const [predictiveData, setPredictiveData] = useState<PredictiveData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      generatePredictions();
    }
  }, [user]);

  const generatePredictions = async () => {
    if (!user) return;

    try {
      // Get historical data
      const [progressSnap, sessionsSnap, failuresSnap] = await Promise.all([
        getDocs(query(collection(db, 'progress'), where('userId', '==', user.uid))),
        getDocs(query(collection(db, 'studySessions'), where('userId', '==', user.uid))),
        getDocs(query(collection(db, 'failureLogs'), where('userId', '==', user.uid)))
      ]);

      // Calculate completion prediction
      const completionPrediction = calculateCompletionPrediction(progressSnap.docs);

      // Predict weak areas
      const weakAreaPredictions = predictWeakAreas(progressSnap.docs, failuresSnap.docs);

      // Generate performance forecast
      const performanceForecast = forecastPerformance(progressSnap.docs, sessionsSnap.docs);

      // Analyze learning trajectory
      const learningTrajectory = analyzeLearningTrajectory(progressSnap.docs);

      setPredictiveData({
        completionPrediction,
        weakAreaPredictions,
        performanceForecast,
        learningTrajectory
      });
    } catch (error) {
      console.error('Error generating predictions:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateCompletionPrediction = (progressDocs: { data: () => { completedAt?: { toDate: () => Date }; masteryLevel?: string } }[]): PredictiveData['completionPrediction'] => {
    const totalProgramItems = 200; // Estimated total items in program
    const completedItems = progressDocs.length;
    const remainingItems = Math.max(totalProgramItems - completedItems, 0);

    // Calculate current pace (items per week over last 4 weeks)
    const fourWeeksAgo = new Date();
    fourWeeksAgo.setDate(fourWeeksAgo.getDate() - 28);

    const recentProgress = progressDocs.filter(doc => {
      const completedAt = doc.data().completedAt?.toDate();
      return completedAt && completedAt >= fourWeeksAgo;
    });

    const currentPace = recentProgress.length / 4; // items per week

    // Calculate required pace (assume 12-week program)
    const totalWeeks = 12;
    const completedWeeks = Math.max(1, Math.ceil(completedItems / (totalProgramItems / totalWeeks)));
    const remainingWeeks = Math.max(totalWeeks - completedWeeks, 1);
    const requiredPace = remainingItems / remainingWeeks;

    // Estimate completion date
    const estimatedCompletionDate = currentPace > 0
      ? new Date(Date.now() + (remainingItems / currentPace) * 7 * 24 * 60 * 60 * 1000)
      : new Date(Date.now() + remainingWeeks * 7 * 24 * 60 * 60 * 1000);

    // Calculate confidence based on data consistency
    const progressVariance = calculateVariance(recentProgress.map(doc => {
      const data = doc.data();
      return data.score || 0;
    }));
    const confidence = Math.max(10, Math.min(95, 100 - progressVariance - (recentProgress.length < 10 ? 20 : 0)));

    // Identify risk factors
    const riskFactors: string[] = [];
    if (currentPace < requiredPace * 0.5) {
      riskFactors.push('Current pace is significantly below required pace');
    }
    if (progressVariance > 30) {
      riskFactors.push('Inconsistent performance may delay completion');
    }
    if (recentProgress.length < 5) {
      riskFactors.push('Limited recent data makes prediction less reliable');
    }
    if (remainingItems > totalProgramItems * 0.7) {
      riskFactors.push('Large portion of program still remaining');
    }

    return {
      estimatedCompletionDate,
      confidence: Math.round(confidence),
      remainingWeeks,
      remainingItems,
      currentPace: Math.round(currentPace * 10) / 10,
      requiredPace: Math.round(requiredPace * 10) / 10,
      riskFactors
    };
  };

  const predictWeakAreas = (progressDocs: { data: () => { contentId?: string; lessonId?: string; score?: number; timeSpentMinutes?: number } }[], failureDocs: { data: () => { topic?: string; contentId?: string; createdAt?: { toDate: () => Date } } }[]): PredictiveData['weakAreaPredictions'] => {
    const topicPerformance: Record<string, {
      scores: number[];
      attempts: number;
      failures: number;
      recentStruggles: number;
      avgTime: number;
    }> = {};

    // Analyze progress data
    progressDocs.forEach(doc => {
      const data = doc.data();
      const topic = data.contentId || data.lessonId || 'Unknown';
      const score = data.score || 0;
      const timeSpent = data.timeSpentMinutes || 0;

      if (!topicPerformance[topic]) {
        topicPerformance[topic] = { scores: [], attempts: 0, failures: 0, recentStruggles: 0, avgTime: 0 };
      }

      topicPerformance[topic].scores.push(score);
      topicPerformance[topic].attempts++;
      topicPerformance[topic].avgTime = timeSpent;

      if (score < 60) {
        topicPerformance[topic].recentStruggles++;
      }
    });

    // Analyze failure data
    failureDocs.forEach(doc => {
      const data = doc.data();
      const topic = data.topic || data.contentId || 'Unknown';

      if (topicPerformance[topic]) {
        topicPerformance[topic].failures++;
      }
    });

    // Generate predictions
    const predictions: PredictiveData['weakAreaPredictions'] = Object.entries(topicPerformance)
      .map(([topic, data]) => {
        const avgScore = data.scores.reduce((sum, s) => sum + s, 0) / data.scores.length;
        const failureRate = data.failures / Math.max(data.attempts, 1);
        const struggleRate = data.recentStruggles / Math.max(data.attempts, 1);

        // Calculate risk level
        let riskLevel: 'low' | 'medium' | 'high' = 'low';
        let riskScore = 0;

        if (avgScore < 50) riskScore += 3;
        else if (avgScore < 70) riskScore += 2;
        else if (avgScore < 80) riskScore += 1;

        if (failureRate > 0.3) riskScore += 3;
        else if (failureRate > 0.2) riskScore += 2;
        else if (failureRate > 0.1) riskScore += 1;

        if (struggleRate > 0.3) riskScore += 2;
        else if (struggleRate > 0.2) riskScore += 1;

        if (data.attempts < 3) riskScore += 1; // Less data = slightly higher risk

        if (riskScore >= 5) riskLevel = 'high';
        else if (riskScore >= 3) riskLevel = 'medium';

        // Generate prediction and actions
        const predictedStruggles = generateStrugglePrediction(avgScore, failureRate, struggleRate);
        const preventiveActions = generatePreventiveActions(riskLevel, data.attempts, avgScore);
        const estimatedDifficulty = Math.min(10, Math.max(1, 11 - (avgScore / 10)));

        return {
          topic,
          riskLevel,
          predictedStruggles,
          preventiveActions,
          estimatedDifficulty: Math.round(estimatedDifficulty * 10) / 10
        };
      })
      .filter(pred => pred.riskLevel !== 'low') // Only show concerning predictions
      .sort((a, b) => {
        const riskOrder = { high: 3, medium: 2, low: 1 };
        return riskOrder[b.riskLevel] - riskOrder[a.riskLevel];
      })
      .slice(0, 5); // Top 5 predictions

    return predictions;
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const forecastPerformance = (progressDocs: { data: () => { masteryLevel?: string } }[], _sessionDocs: { data: () => { startTime?: { toDate: () => Date } } }[]): PredictiveData['performanceForecast'] => {
    // Next week prediction
    const recentProgress = progressDocs.slice(-10); // Last 10 items
    const avgItemsPerWeek = recentProgress.length / 2; // Assuming 2 weeks of data
    const avgMasteryRate = recentProgress.reduce((sum, doc) => {
      const data = doc.data();
      return sum + (data.masteryLevel === 'run-independent' ? 1 : 0);
    }, 0) / recentProgress.length * 100;

    const nextWeekPrediction = {
      expectedItems: Math.round(avgItemsPerWeek),
      expectedMastery: Math.round(avgMasteryRate),
      confidence: Math.min(90, recentProgress.length * 9) // More data = higher confidence
    };

    // Month projection
    const monthlyItems = avgItemsPerWeek * 4;
    const projectedMasteryRate = Math.min(100, avgMasteryRate + 10); // Assume 10% improvement

    // Identify skill improvements based on recent progress
    const skillImprovements = identifySkillImprovements(progressDocs.slice(-20));

    const monthProjection = {
      totalItems: Math.round(monthlyItems),
      masteryRate: Math.round(projectedMasteryRate),
      skillImprovements
    };

    return {
      nextWeekPrediction,
      monthProjection
    };
  };

  const analyzeLearningTrajectory = (progressDocs: { data: () => { score?: number } }[]): PredictiveData['learningTrajectory'] => {
    if (progressDocs.length < 5) {
      return {
        currentTrajectory: 'steady',
        optimalTrajectory: 'steady',
        adjustments: ['Continue building study habits with regular sessions.']
      };
    }

    // Analyze recent performance trend
    const recentScores = progressDocs.slice(-10).map(doc => doc.data().score || 0);
    const earlierScores = progressDocs.slice(-20, -10).map(doc => doc.data().score || 0);

    const recentAvg = recentScores.reduce((sum, s) => sum + s, 0) / recentScores.length;
    const earlierAvg = earlierScores.length > 0
      ? earlierScores.reduce((sum, s) => sum + s, 0) / earlierScores.length
      : recentAvg;

    const improvement = recentAvg - earlierAvg;

    let currentTrajectory: 'accelerating' | 'steady' | 'plateauing' | 'declining';
    if (improvement > 10) currentTrajectory = 'accelerating';
    else if (improvement > 2) currentTrajectory = 'steady';
    else if (improvement > -5) currentTrajectory = 'plateauing';
    else currentTrajectory = 'declining';

    // Determine optimal trajectory
    const optimalTrajectory: 'accelerating' | 'steady' = progressDocs.length < 50 ? 'accelerating' : 'steady';

    // Generate adjustments
    const adjustments = generateTrajectoryAdjustments(currentTrajectory, optimalTrajectory, improvement);

    return {
      currentTrajectory,
      optimalTrajectory,
      adjustments
    };
  };

  const calculateVariance = (values: number[]): number => {
    if (values.length < 2) return 0;
    const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
    const variance = values.reduce((sum, val) => sum + Math.pow(val - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  };

  const generateStrugglePrediction = (avgScore: number, failureRate: number, struggleRate: number): string => {
    if (failureRate > 0.3) {
      return 'High likelihood of continued struggles due to frequent failures. May need significant additional practice.';
    }
    if (avgScore < 50) {
      return 'Significant challenges expected. Topic fundamentals may need complete review.';
    }
    if (struggleRate > 0.3) {
      return 'Recent performance indicates ongoing difficulties. Consider different learning approaches.';
    }
    return 'Moderate challenges expected. Additional focused practice recommended.';
  };

  const generatePreventiveActions = (riskLevel: string, attempts: number, avgScore: number): string[] => {
    const actions: string[] = [];

    if (riskLevel === 'high') {
      actions.push('Schedule dedicated review sessions for this topic');
      actions.push('Seek additional learning resources or tutorials');
      actions.push('Consider breaking topic into smaller, manageable parts');
    }

    if (attempts < 3) {
      actions.push('Complete more practice attempts to build familiarity');
    }

    if (avgScore < 70) {
      actions.push('Focus on understanding core concepts before advanced applications');
      actions.push('Use spaced repetition to reinforce learning');
    }

    actions.push('Review after-action reports for specific improvement areas');

    return actions.slice(0, 3); // Limit to 3 actions
  };

  const identifySkillImprovements = (recentProgress: { data: () => { masteryLevel?: string; score?: number; timeSpentMinutes?: number } }[]): string[] => {
    const improvements: string[] = [];
    const masteryLevels = recentProgress.map(doc => doc.data().masteryLevel);

    const runIndependentCount = masteryLevels.filter(level => level === 'run-independent').length;
    const runGuidedCount = masteryLevels.filter(level => level === 'run-guided').length;

    if (runIndependentCount > runGuidedCount) {
      improvements.push('Independent problem-solving');
    }

    const avgScore = recentProgress.reduce((sum, doc) => sum + (doc.data().score || 0), 0) / recentProgress.length;
    if (avgScore > 75) {
      improvements.push('Quiz performance');
    }

    // Add time-based improvements
    const avgTime = recentProgress.reduce((sum, doc) => sum + (doc.data().timeSpentMinutes || 0), 0) / recentProgress.length;
    if (avgTime < 15) {
      improvements.push('Learning efficiency');
    }

    return improvements.length > 0 ? improvements : ['Continued skill development'];
  };

  const generateTrajectoryAdjustments = (
    current: string,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _improvement: number
  ): string[] => {
    const adjustments: string[] = [];

    if (current === 'declining') {
      adjustments.push('Increase study frequency and duration');
      adjustments.push('Review study techniques and effectiveness');
      adjustments.push('Consider taking a short break to prevent burnout');
    } else if (current === 'plateauing') {
      adjustments.push('Try new learning approaches or resources');
      adjustments.push('Increase practice difficulty gradually');
      adjustments.push('Focus on weak areas identified in analytics');
    } else if (current === 'steady' && optimal === 'accelerating') {
      adjustments.push('Add more study sessions per week');
      adjustments.push('Incorporate advanced topics earlier');
      adjustments.push('Set more ambitious daily goals');
    }

    if (adjustments.length === 0) {
      adjustments.push('Continue current approach while monitoring progress');
    }

    return adjustments;
  };

  return {
    predictiveData,
    loading,
    generatePredictions
  };
}