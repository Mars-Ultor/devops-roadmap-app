/**
 * Hook for managing Failure Logs
 * Track all failures with context, resolution, and pattern detection
 */

import { useState, useCallback } from 'react';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  updateDoc,
  doc,
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import type { FailureLog, FailurePattern, FailureCategory } from '../types/training';

interface UseFailureLogReturn {
  logFailure: (failureData: Omit<FailureLog, 'id' | 'userId' | 'timestamp' | 'isRecurring' | 'previousOccurrences'>) => Promise<string>;
  updateFailure: (failureId: string, updates: Partial<Pick<FailureLog, 'rootCause' | 'resolution' | 'preventionStrategy' | 'lessonsLearned' | 'resolvedAt'>>) => Promise<void>;
  getFailureLogs: (contentId?: string, category?: FailureCategory) => Promise<FailureLog[]>;
  detectPatterns: () => Promise<FailurePattern[]>;
  loading: boolean;
}

export function useFailureLog(): UseFailureLogReturn {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  /**
   * Log a new failure
   * Automatically detects if this is a recurring failure
   */
  const logFailure = useCallback(async (
    failureData: Omit<FailureLog, 'id' | 'userId' | 'timestamp' | 'isRecurring' | 'previousOccurrences'>
  ): Promise<string> => {
    if (!user?.uid) throw new Error('User not authenticated');

    setLoading(true);
    try {
      // Check for similar previous failures (pattern detection)
      const previousFailures = await findSimilarFailures(
        user.uid, 
        failureData.category,
        failureData.title
      );

      const isRecurring = previousFailures.length > 0;
      const previousOccurrences = previousFailures.map(f => f.id);

      const failure: Omit<FailureLog, 'id'> = {
        ...failureData,
        userId: user.uid,
        timestamp: new Date(),
        isRecurring,
        previousOccurrences
      };

      const docRef = await addDoc(collection(db, 'failureLogs'), {
        ...failure,
        timestamp: serverTimestamp()
      });

      // Update pattern if recurring
      if (isRecurring) {
        await updateFailurePattern(user.uid, failureData.category, failureData.title, docRef.id);
      }

      return docRef.id;
    } catch (error) {
      console.error('Error logging failure:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  /**
   * Update failure with resolution details
   */
  const updateFailure = useCallback(async (
    failureId: string,
    updates: Partial<Pick<FailureLog, 'rootCause' | 'resolution' | 'preventionStrategy' | 'lessonsLearned' | 'resolvedAt'>>
  ): Promise<void> => {
    if (!user?.uid) throw new Error('User not authenticated');

    setLoading(true);
    try {
      const failureRef = doc(db, 'failureLogs', failureId);
      
      const updateData: any = { ...updates };
      
      // Calculate resolution time if marking as resolved
      if (updates.resolvedAt) {
        const failureDoc = await getDocs(query(
          collection(db, 'failureLogs'),
          where('__name__', '==', failureId)
        ));
        
        if (!failureDoc.empty) {
          const failureData = failureDoc.docs[0].data();
          const timestamp = failureData.timestamp?.toDate() || new Date();
          const resolvedAt = updates.resolvedAt;
          const timeToResolveMinutes = Math.floor((resolvedAt.getTime() - timestamp.getTime()) / 60000);
          updateData.timeToResolveMinutes = timeToResolveMinutes;
        }
        
        updateData.resolvedAt = serverTimestamp();
      }

      await updateDoc(failureRef, updateData);
    } catch (error) {
      console.error('Error updating failure:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  /**
   * Get failure logs with optional filtering
   */
  const getFailureLogs = useCallback(async (
    contentId?: string,
    category?: FailureCategory
  ): Promise<FailureLog[]> => {
    if (!user?.uid) return [];

    setLoading(true);
    try {
      let q = query(
        collection(db, 'failureLogs'),
        where('userId', '==', user.uid),
        orderBy('timestamp', 'desc')
      );

      if (contentId) {
        q = query(
          collection(db, 'failureLogs'),
          where('userId', '==', user.uid),
          where('contentId', '==', contentId),
          orderBy('timestamp', 'desc')
        );
      } else if (category) {
        q = query(
          collection(db, 'failureLogs'),
          where('userId', '==', user.uid),
          where('category', '==', category),
          orderBy('timestamp', 'desc')
        );
      }

      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          timestamp: data.timestamp?.toDate() || new Date(),
          resolvedAt: data.resolvedAt?.toDate()
        } as FailureLog;
      });
    } catch (error) {
      console.error('Error fetching failure logs:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  /**
   * Detect failure patterns
   */
  const detectPatterns = useCallback(async (): Promise<FailurePattern[]> => {
    if (!user?.uid) return [];

    setLoading(true);
    try {
      const q = query(
        collection(db, 'failurePatterns'),
        where('userId', '==', user.uid),
        orderBy('lastSeen', 'desc')
      );

      const snapshot = await getDocs(q);
      
      return snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          firstSeen: data.firstSeen?.toDate() || new Date(),
          lastSeen: data.lastSeen?.toDate() || new Date()
        } as FailurePattern;
      });
    } catch (error) {
      console.error('Error detecting patterns:', error);
      return [];
    } finally {
      setLoading(false);
    }
  }, [user?.uid]);

  return {
    logFailure,
    updateFailure,
    getFailureLogs,
    detectPatterns,
    loading
  };
}

/**
 * Find similar failures for pattern detection
 */
async function findSimilarFailures(
  userId: string,
  category: FailureCategory,
  title: string
): Promise<FailureLog[]> {
  try {
    const q = query(
      collection(db, 'failureLogs'),
      where('userId', '==', userId),
      where('category', '==', category)
    );

    const snapshot = await getDocs(q);
    
    const failures = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        timestamp: data.timestamp?.toDate() || new Date(),
        resolvedAt: data.resolvedAt?.toDate()
      } as FailureLog;
    });

    // Simple similarity check: same category and similar title
    const similarityThreshold = 0.5;
    return failures.filter(f => 
      calculateSimilarity(f.title.toLowerCase(), title.toLowerCase()) > similarityThreshold
    );
  } catch (error) {
    console.error('Error finding similar failures:', error);
    return [];
  }
}

/**
 * Calculate text similarity (simple word overlap)
 */
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.split(/\s+/));
  const words2 = new Set(str2.split(/\s+/));
  
  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);
  
  return intersection.size / union.size;
}

/**
 * Update or create failure pattern
 */
async function updateFailurePattern(
  userId: string,
  category: FailureCategory,
  title: string,
  failureId: string
): Promise<void> {
  try {
    // Check if pattern exists
    const q = query(
      collection(db, 'failurePatterns'),
      where('userId', '==', userId),
      where('category', '==', category)
    );

    const snapshot = await getDocs(q);
    
    // Find matching pattern
    const patternDoc = snapshot.docs.find(doc => {
      const data = doc.data();
      return calculateSimilarity(data.pattern.toLowerCase(), title.toLowerCase()) > 0.5;
    });

    if (patternDoc) {
      // Update existing pattern
      const patternRef = doc(db, 'failurePatterns', patternDoc.id);
      const data = patternDoc.data();
      
      await updateDoc(patternRef, {
        occurrences: (data.occurrences || 0) + 1,
        failureIds: [...(data.failureIds || []), failureId],
        lastSeen: serverTimestamp()
      });
    } else {
      // Create new pattern
      await addDoc(collection(db, 'failurePatterns'), {
        userId,
        pattern: title,
        category,
        occurrences: 1,
        failureIds: [failureId],
        firstSeen: serverTimestamp(),
        lastSeen: serverTimestamp(),
        resolved: false,
        recommendedActions: []
      });
    }
  } catch (error) {
    console.error('Error updating failure pattern:', error);
  }
}
