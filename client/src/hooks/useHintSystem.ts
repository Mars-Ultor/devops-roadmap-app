/**
 * Hint System Hook
 * Manages hint timing, availability, and state for spaced practice
 */

import { useState, useEffect } from 'react';

interface Hint {
  id: number;
  text: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface UseHintSystemProps {
  hints: Hint[];
  hintsUnlocked: boolean;
  labStartTime: number;
  onHintViewed: (hintId: number, timestamp: Date) => void;
  currentTime?: number; // For testing
}

const HINT_DELAY = 5 * 60 * 1000; // 5 minutes
const SOLUTION_UNLOCK_TIME = 90 * 60 * 1000; // 90 minutes

export function useHintSystem({
  hints,
  hintsUnlocked,
  labStartTime,
  onHintViewed,
  currentTime
}: UseHintSystemProps) {
  const [viewedHints, setViewedHints] = useState<number[]>([]);
  const [lastHintTime, setLastHintTime] = useState<number | null>(null);
  const [nextHintAvailableIn, setNextHintAvailableIn] = useState(0);
  const [solutionAvailable, setSolutionAvailable] = useState(false);

  // Timer effect for updating hint availability and solution unlock
  useEffect(() => {
    const updateTimers = () => {
      const now = currentTime || Date.now();
      const timeSinceStart = now - labStartTime;

      // Check if solution is available (90 minutes)
      if (timeSinceStart >= SOLUTION_UNLOCK_TIME) {
        setSolutionAvailable(true);
      }

      // Update hint cooldown timer
      if (lastHintTime) {
        const timeSinceLastHint = now - lastHintTime;
        const remaining = Math.max(0, HINT_DELAY - timeSinceLastHint);
        setNextHintAvailableIn(remaining);
      } else {
        setNextHintAvailableIn(0);
      }
    };

    updateTimers();
    const interval = setInterval(updateTimers, 1000);
    return () => clearInterval(interval);
  }, [lastHintTime, labStartTime, currentTime]);

  const handleViewHint = (hintId: number) => {
    if (!canViewNextHint()) return;

    setViewedHints([...viewedHints, hintId]);
    setLastHintTime(currentTime || Date.now());
    onHintViewed(hintId, new Date());
  };

  const canViewNextHint = (): boolean => {
    if (!hintsUnlocked) return false;
    if (nextHintAvailableIn > 0) return false;
    if (viewedHints.length >= hints.length) return false;
    return true;
  };

  const getNextUnviewedHint = (): Hint | null => {
    const nextHint = hints.find(h => !viewedHints.includes(h.id));
    return nextHint || null;
  };

  const formatTime = (ms: number): string => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const getTimeUntilSolution = (): number => {
    const now = currentTime || Date.now();
    return Math.max(0, SOLUTION_UNLOCK_TIME - (now - labStartTime));
  };

  return {
    viewedHints,
    nextHintAvailableIn,
    solutionAvailable,
    handleViewHint,
    canViewNextHint,
    getNextUnviewedHint,
    formatTime,
    getTimeUntilSolution,
    HINT_DELAY,
    SOLUTION_UNLOCK_TIME
  };
}