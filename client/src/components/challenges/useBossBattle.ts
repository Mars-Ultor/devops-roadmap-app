/**
 * useBossBattle - Custom hook for Boss Battle state management
 */

import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuthStore } from '../../store/authStore';
import { 
  type BossBattle, 
  initializePhaseCompletion, 
  calculateScore, 
  generateBossBattle 
} from './BossBattleUtils';

interface UseBossBattleProps {
  isOpen: boolean;
  week: number;
  onComplete: (success: boolean) => void;
}

export function useBossBattle({ isOpen, week, onComplete }: UseBossBattleProps) {
  const { user } = useAuthStore();
  const [battle, setBattle] = useState<BossBattle | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [isActive, setIsActive] = useState(false);
  const [phaseCompletion, setPhaseCompletion] = useState<boolean[][]>([]);
  const [hasStarted, setHasStarted] = useState(false);

  // Load battle data
  useEffect(() => {
    const loadBossBattleData = async () => {
      if (!user) return;
      const battleRef = doc(db, 'bossBattles', `${user.uid}_week${week}`);
      const battleDoc = await getDoc(battleRef);

      if (battleDoc.exists()) {
        const data = battleDoc.data();
        setBattle(data.battle);
        setTimeRemaining(data.timeRemaining || data.battle.timeLimit);
        setHasStarted(data.hasStarted || false);
        setPhaseCompletion(data.phaseCompletion || initializePhaseCompletion(data.battle));
        if (data.hasStarted && data.timeRemaining > 0) setIsActive(true);
      } else {
        const newBattle = generateBossBattle(week);
        setBattle(newBattle);
        setTimeRemaining(newBattle.timeLimit);
        setPhaseCompletion(initializePhaseCompletion(newBattle));
      }
    };
    if (isOpen) loadBossBattleData();
  }, [isOpen, week, user]);

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
    if (!user || !battle) return;
    setIsActive(true);
    setHasStarted(true);
    const battleRef = doc(db, 'bossBattles', `${user.uid}_week${week}`);
    await setDoc(battleRef, {
      battle, hasStarted: true, startedAt: new Date().toISOString(),
      timeRemaining, phaseCompletion, currentPhase: 0, completedAt: null, passed: false
    }, { merge: true });
  };

  const handleSubmit = async () => {
    if (!user || !battle) return;
    const score = calculateScore(battle, phaseCompletion);
    const passed = score >= battle.minimumPassScore;
    const battleRef = doc(db, 'bossBattles', `${user.uid}_week${week}`);
    await setDoc(battleRef, {
      battle, completedAt: new Date().toISOString(), passed, score,
      timeUsed: battle.timeLimit - timeRemaining, phaseCompletion
    }, { merge: true });
    onComplete(passed);
    if (!passed) {
      alert(`Boss Battle Failed!\n\nYou scored ${score}% but need ${battle.minimumPassScore}% to pass.\n\nYou must retry this battle before advancing to Week ${week + 1}.`);
    }
  };

  const toggleTask = (phaseIndex: number, taskIndex: number) => {
    setPhaseCompletion(prev => {
      const newState = [...prev];
      newState[phaseIndex] = [...newState[phaseIndex]];
      newState[phaseIndex][taskIndex] = !newState[phaseIndex][taskIndex];
      return newState;
    });
  };

  const currentScore = calculateScore(battle, phaseCompletion);

  return {
    battle, timeRemaining, isActive, phaseCompletion,
    hasStarted, currentScore, handleStart, handleSubmit, toggleTask
  };
}
