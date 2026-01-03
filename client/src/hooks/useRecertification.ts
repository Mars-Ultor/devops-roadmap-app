/**
 * Recertification System Hook
 * Tracks skill decay and requires monthly re-testing
 */

import { useState, useEffect, useCallback } from 'react';
import { useAuthStore } from '../store/authStore';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';

export interface SkillDecayAlert {
  skill: string;
  category: string;
  recentPerformance: number; // percentage
  historicalPerformance: number; // percentage
  decayPercentage: number;
  lastPracticed: Date;
  requiresRecertification: boolean;
}

interface RecertificationStatus {
  lastRecertDate: Date | null;
  nextRecertDue: Date | null;
  daysUntilDue: number;
  isOverdue: boolean;
  skillsNeedingRecert: SkillDecayAlert[];
}

export function useRecertification() {
  const { user } = useAuthStore();
  const [status, setStatus] = useState<RecertificationStatus | null>(null);
  const [loading, setLoading] = useState(true);

  const analyzeSkillDecay = useCallback(async (): Promise<SkillDecayAlert[]> => {
    if (!user) return [];

    const alerts: SkillDecayAlert[] = [];
    const categories = ['docker', 'kubernetes', 'cicd', 'networking', 'scripting'];

    for (const category of categories) {
      // Get recent performance (last 7 days)
      const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const recentQuery = query(
        collection(db, 'progress'),
        where('userId', '==', user.uid),
        where('category', '==', category),
        where('completedAt', '>=', sevenDaysAgo)
      );
      const recentSnap = await getDocs(recentQuery);
      const recentScores = recentSnap.docs.map(d => d.data().score || 0);
      const recentPerformance = recentScores.length > 0
        ? recentScores.reduce((sum, s) => sum + s, 0) / recentScores.length
        : 0;

      // Get historical performance (30-60 days ago)
      const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000);
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      const historicalQuery = query(
        collection(db, 'progress'),
        where('userId', '==', user.uid),
        where('category', '==', category),
        where('completedAt', '>=', sixtyDaysAgo),
        where('completedAt', '<=', thirtyDaysAgo)
      );
      const historicalSnap = await getDocs(historicalQuery);
      const historicalScores = historicalSnap.docs.map(d => d.data().score || 0);
      const historicalPerformance = historicalScores.length > 0
        ? historicalScores.reduce((sum, s) => sum + s, 0) / historicalScores.length
        : 100;

      // Calculate decay
      if (historicalPerformance > 0) {
        const decayPercentage = ((historicalPerformance - recentPerformance) / historicalPerformance) * 100;

        // Alert if decay > 25% or no recent activity
        if (decayPercentage > 25 || recentScores.length === 0) {
          const lastPracticedDocs = await getDocs(query(
            collection(db, 'progress'),
            where('userId', '==', user.uid),
            where('category', '==', category)
          ));

          const lastPracticed = lastPracticedDocs.docs.length > 0
            ? lastPracticedDocs.docs
                .map(d => d.data().completedAt?.toDate())
                .filter(d => d)
                .sort((a, b) => b!.getTime() - a!.getTime())[0]!
            : new Date(0);

          alerts.push({
            skill: category.charAt(0).toUpperCase() + category.slice(1),
            category,
            recentPerformance: Math.round(recentPerformance),
            historicalPerformance: Math.round(historicalPerformance),
            decayPercentage: Math.round(decayPercentage),
            lastPracticed,
            requiresRecertification: decayPercentage > 40 || recentScores.length === 0
          });
        }
      }
    }

    return alerts.sort((a, b) => b.decayPercentage - a.decayPercentage);
  }, [user]);

  useEffect(() => {
    if (user) {
      checkRecertificationStatus();
    }
  }, [user]); // Removed checkRecertificationStatus from dependencies

  const checkRecertificationStatus = useCallback(async () => {
    if (!user) return;

    try {
      // Get recertification record
      const recertDoc = await getDoc(doc(db, 'recertifications', user.uid));
      const recertData = recertDoc.data();

      const lastRecertDate = recertData?.lastRecertDate?.toDate() || null;
      const nextRecertDue = lastRecertDate
        ? new Date(lastRecertDate.getTime() + 30 * 24 * 60 * 60 * 1000) // 30 days
        : null;

      const daysUntilDue = nextRecertDue
        ? Math.ceil((nextRecertDue.getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 30;

      const isOverdue = daysUntilDue < 0;

      // Analyze skill decay
      const skillsNeedingRecert = await analyzeSkillDecay();

      setStatus({
        lastRecertDate,
        nextRecertDue,
        daysUntilDue,
        isOverdue,
        skillsNeedingRecert
      });
    } catch (error) {
      console.error('Error checking recertification status:', error);
    } finally {
      setLoading(false);
    }
  }, [user, analyzeSkillDecay]);

  const completeRecertification = async (drillResults: Record<string, boolean>) => {
    if (!user) return;

    const allPassed = Object.values(drillResults).every(r => r);
    
    await setDoc(doc(db, 'recertifications', user.uid), {
      lastRecertDate: new Date(),
      drillResults,
      passed: allPassed,
      skillsRecertified: Object.keys(drillResults)
    }, { merge: true });

    await checkRecertificationStatus();
  };

  return {
    status,
    loading,
    checkRecertificationStatus,
    completeRecertification
  };
}
