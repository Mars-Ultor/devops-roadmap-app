/**
 * Hook for managing After Action Reviews (AAR)
 * Mandatory reflection after completing lessons, labs, and drills
 */

import { useState, useCallback } from 'react';
import { collection, addDoc, query, where, getDocs, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import type { AAR } from '../types/training';

interface UseAARReturn {
  submitAAR: (aarData: Omit<AAR, 'id' | 'userId' | 'createdAt' | 'aiReviewed'>) => Promise<AAR>;
  getAARs: (contentId: string, contentType: 'lesson' | 'lab' | 'drill') => Promise<AAR[]>;
  loading: boolean;
}

export function useAAR(): UseAARReturn {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const submitAAR = useCallback(async (
    aarData: Omit<AAR, 'id' | 'userId' | 'createdAt' | 'aiReviewed'>
  ): Promise<AAR> => {
    if (!user?.uid) throw new Error('User not authenticated');

    setLoading(true);
    try {
      const now = new Date();
      const aar: Omit<AAR, 'id'> = {
        ...aarData,
        userId: user.uid,
        createdAt: now,
        aiReviewed: false
      };

      const docRef = await addDoc(collection(db, 'afterActionReviews'), {
        ...aar,
        createdAt: serverTimestamp()
      });

      return {
        id: docRef.id,
        ...aar
      };
    } catch (error) {
      console.error('Error submitting AAR:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  const getAARs = useCallback(async (
    contentId: string,
    contentType: 'lesson' | 'lab' | 'drill'
  ): Promise<AAR[]> => {
    if (!user?.uid) return [];

    setLoading(true);
    try {
      const fieldName = contentType === 'lesson' ? 'lessonId' : contentType === 'lab' ? 'labId' : 'drillId';
      
      const q = query(
        collection(db, 'afterActionReviews'),
        where('userId', '==', user.uid),
        where(fieldName, '==', contentId)
      );

      const snapshot = await getDocs(q);
      const aars: AAR[] = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate() || new Date()
      } as AAR));

      return aars.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    } catch (error) {
      console.error('Error fetching AARs:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  return {
    submitAAR,
    getAARs,
    loading
  };
}

/**
 * Check if AAR is required before allowing progression
 */
export async function checkAARRequired(
  userId: string,
  contentId: string,
  contentType: 'lesson' | 'lab' | 'drill'
): Promise<boolean> {
  try {
    const fieldName = contentType === 'lesson' ? 'lessonId' : contentType === 'lab' ? 'labId' : 'drillId';
    
    const q = query(
      collection(db, 'afterActionReviews'),
      where('userId', '==', userId),
      where(fieldName, '==', contentId)
    );

    const snapshot = await getDocs(q);
    return snapshot.empty; // AAR required if none exist
  } catch (error) {
    console.error('Error checking AAR requirement:', error);
    return true; // Default to requiring AAR on error
  }
}
