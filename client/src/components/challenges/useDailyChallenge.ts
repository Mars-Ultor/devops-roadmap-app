/**
 * useDailyChallenge - Custom hook for Daily Challenge state management
 */

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthStore } from '../../store/authStore';
import { type Challenge, generateRandomChallenge } from './DailyChallengeUtils';

interface UseDailyChallengeProps {
  isOpen: boolean;
  onComplete: (success: boolean, timeUsed: number) => void;
  onClose: () => void;
}

export function useDailyChallenge({ isOpen, onComplete, onClose }: UseDailyChallengeProps) {
  const { user } = useAuthStore();
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [showHints, setShowHints] = useState(false);
  const [completedCriteria, setCompletedCriteria] = useState<boolean[]>([]);

  // Load today's challenge
  useEffect(() => {
    const loadTodaysChallenge = async () => {
      if (!user) return;
      const today = new Date().toISOString().split('T')[0];
      const challengeRef = doc(db, 'dailyChallenges', `${user.uid}_${today}`);
      const challengeDoc = await getDoc(challengeRef);

      if (challengeDoc.exists()) {
        const data = challengeDoc.data();
        setChallenge(data.challenge);
        setTimeRemaining(data.challenge.timeLimit);
        setCompletedCriteria(new Array(data.challenge.successCriteria.length).fill(false));
      } else {
        const newChallenge = generateRandomChallenge(user.currentWeek);
        setChallenge(newChallenge);
        setTimeRemaining(newChallenge.timeLimit);
        setCompletedCriteria(new Array(newChallenge.successCriteria.length).fill(false));
        await setDoc(challengeRef, { challenge: newChallenge, startedAt: null, completedAt: null, success: false });
      }
    };
    if (isOpen) loadTodaysChallenge();
  }, [isOpen, user]);

  // Countdown timer
  useEffect(() => {
    if (!isActive || timeRemaining <= 0) return;
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) { setIsActive(false); return 0; }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isActive, timeRemaining]);

  const handleStart = async () => {
    if (!user || !challenge) return;
    setIsActive(true);
    const today = new Date().toISOString().split('T')[0];
    const challengeRef = doc(db, 'dailyChallenges', `${user.uid}_${today}`);
    await setDoc(challengeRef, { challenge, startedAt: new Date().toISOString(), completedAt: null, success: false }, { merge: true });
  };

  const handleSubmit = async () => {
    if (!user || !challenge) return;
    const allComplete = completedCriteria.every(c => c);
    const timeUsed = challenge.timeLimit - timeRemaining;
    const today = new Date().toISOString().split('T')[0];
    const challengeRef = doc(db, 'dailyChallenges', `${user.uid}_${today}`);
    await setDoc(challengeRef, { challenge, completedAt: new Date().toISOString(), success: allComplete, timeUsed }, { merge: true });
    onComplete(allComplete, timeUsed);
    onClose();
  };

  const toggleCriterion = (index: number) => {
    setCompletedCriteria(prev => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  const toggleHints = () => setShowHints(prev => !prev);
  const completedCount = completedCriteria.filter(c => c).length;

  return {
    challenge, timeRemaining, isActive, showHints, completedCriteria,
    completedCount, handleStart, handleSubmit, toggleCriterion, toggleHints
  };
}
