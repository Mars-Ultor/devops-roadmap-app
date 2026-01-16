/**
 * useDailyDrill Hook - Manages daily drill requirement and enforcement
 * Blocks access to lessons/labs until daily drill is completed
 */

import { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { doc, getDoc, setDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';

interface DailyDrillState {
  dailyDrillRequired: boolean;
  dailyDrillCompleted: boolean;
  loading: boolean;
  completeDailyDrill: () => Promise<void>;
  checkDailyDrill: () => Promise<boolean>;
}

export function useDailyDrill(): DailyDrillState {
  const { user } = useAuthStore();
  const [dailyDrillRequired, setDailyDrillRequired] = useState(false);
  const [dailyDrillCompleted, setDailyDrillCompleted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      checkDailyDrill();
    } else {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const checkDailyDrill = async (): Promise<boolean> => {
    if (!user?.uid) {
      setLoading(false);
      return false;
    }

    try {
      setLoading(true);
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Check if user has completed ANY content (if not, don't require drill yet)
      const progressQuery = query(
        collection(db, 'progress'),
        where('userId', '==', user.uid),
        where('completed', '==', true)
      );
      const progressSnap = await getDocs(progressQuery);
      
      // Only require daily drill if user has completed at least one lesson/lab
      if (progressSnap.empty) {
        setDailyDrillRequired(false);
        setDailyDrillCompleted(true); // Don't block new users
        setLoading(false);
        return true;
      }

      // Check if drill was completed today
      const drillDocRef = doc(db, 'dailyDrills', `${user.uid}_${today}`);
      const drillDoc = await getDoc(drillDocRef);
      
      if (drillDoc.exists() && drillDoc.data()?.completed) {
        setDailyDrillRequired(false);
        setDailyDrillCompleted(true);
        setLoading(false);
        return true;
      } else {
        setDailyDrillRequired(true);
        setDailyDrillCompleted(false);
        setLoading(false);
        return false;
      }
    } catch (error) {
      console.error('Error checking daily drill:', error);
      setLoading(false);
      return false;
    }
  };

  const completeDailyDrill = async (): Promise<void> => {
    if (!user?.uid) return;

    try {
      const today = new Date().toISOString().split('T')[0];
      const drillDocRef = doc(db, 'dailyDrills', `${user.uid}_${today}`);
      
      await setDoc(drillDocRef, {
        userId: user.uid,
        date: today,
        completed: true,
        completedAt: new Date(),
        timestamp: Date.now()
      });

      setDailyDrillRequired(false);
      setDailyDrillCompleted(true);
    } catch (error) {
      console.error('Error completing daily drill:', error);
      throw error;
    }
  };

  return {
    dailyDrillRequired,
    dailyDrillCompleted,
    loading,
    completeDailyDrill,
    checkDailyDrill
  };
}
