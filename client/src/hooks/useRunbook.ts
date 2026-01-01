/**
 * Hook for Personal Runbook generation and management
 * Note: This hook expects failure entries to be passed in, as the FailureLog page
 * manages its own local state
 */

import { useMemo } from 'react';
import { generatePersonalRunbook } from '../services/runbookGenerator';

interface FailureEntry {
  id: string;
  entryNumber: number;
  task: string;
  whatBroke: string;
  whatTried: string[];
  rootCause: string;
  solution: string;
  timeWasted: number;
  keyLesson: string;
  prevention: string;
  quickCheck: string;
  category: string;
  createdAt: Date;
}

export function useRunbook(entries: FailureEntry[]) {
  const runbook = useMemo(() => {
    if (!entries || entries.length === 0) {
      return null;
    }
    
    try {
      return generatePersonalRunbook(entries);
    } catch (error) {
      console.error('Error generating runbook:', error);
      return null;
    }
  }, [entries]);

  return {
    runbook,
    loading: false
  };
}
