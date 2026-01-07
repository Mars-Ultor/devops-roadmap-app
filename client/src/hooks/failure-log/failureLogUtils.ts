/**
 * Failure Log Utilities
 * Helper functions for failure tracking and pattern detection
 */

import { collection, query, where, getDocs, addDoc, updateDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import type { FailureLog, FailureCategory } from '../../types/training';

/** Calculate text similarity (simple word overlap) */
export function calculateSimilarity(str1: string, str2: string): number {
  const words1 = new Set(str1.split(/\s+/));
  const words2 = new Set(str2.split(/\s+/));
  const intersection = new Set([...words1].filter(w => words2.has(w)));
  const union = new Set([...words1, ...words2]);
  return intersection.size / union.size;
}

/** Find similar failures for pattern detection */
export async function findSimilarFailures(
  userId: string,
  category: FailureCategory,
  title: string
): Promise<FailureLog[]> {
  try {
    const snapshot = await getDocs(query(collection(db, 'failureLogs'), where('userId', '==', userId), where('category', '==', category)));
    const failures = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), timestamp: doc.data().timestamp?.toDate() || new Date(), resolvedAt: doc.data().resolvedAt?.toDate() } as FailureLog));
    const similarityThreshold = 0.5;
    return failures.filter(f => calculateSimilarity(f.title.toLowerCase(), title.toLowerCase()) > similarityThreshold);
  } catch (error) { console.error('Error finding similar failures:', error); return []; }
}

/** Update or create failure pattern */
export async function updateFailurePattern(
  userId: string,
  category: FailureCategory,
  title: string,
  failureId: string
): Promise<void> {
  try {
    const snapshot = await getDocs(query(collection(db, 'failurePatterns'), where('userId', '==', userId), where('category', '==', category)));
    const patternDoc = snapshot.docs.find(d => calculateSimilarity(d.data().pattern.toLowerCase(), title.toLowerCase()) > 0.5);
    
    if (patternDoc) {
      const data = patternDoc.data();
      await updateDoc(doc(db, 'failurePatterns', patternDoc.id), { occurrences: (data.occurrences || 0) + 1, failureIds: [...(data.failureIds || []), failureId], lastSeen: serverTimestamp() });
    } else {
      await addDoc(collection(db, 'failurePatterns'), { userId, pattern: title, category, occurrences: 1, failureIds: [failureId], firstSeen: serverTimestamp(), lastSeen: serverTimestamp(), resolved: false, recommendedActions: [] });
    }
  } catch (error) { console.error('Error updating failure pattern:', error); }
}

/** Build query with optional filters */
export function buildFailureQuery(userId: string, contentId?: string, category?: FailureCategory) {
  if (contentId) {
    return query(collection(db, 'failureLogs'), where('userId', '==', userId), where('contentId', '==', contentId));
  } else if (category) {
    return query(collection(db, 'failureLogs'), where('userId', '==', userId), where('category', '==', category));
  }
  return query(collection(db, 'failureLogs'), where('userId', '==', userId));
}
