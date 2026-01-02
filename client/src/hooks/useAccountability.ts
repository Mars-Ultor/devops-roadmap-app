/**
 * Accountability System Hook
 * Manage weekly commitments and accountability partners
 */

import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import type { 
  WeeklyCommitment, 
  Commitment, 
  AccountabilityPartner,
  AccountabilityCheckIn,
  PublicCommitment,
  AccountabilityStats,
  CommitmentStatus
} from '../types/accountability';

export function useAccountability() {
  const { user } = useAuthStore();
  const [currentWeekCommitment, setCurrentWeekCommitment] = useState<WeeklyCommitment | null>(null);
  const [partners, setPartners] = useState<AccountabilityPartner[]>([]);
  const [publicCommitments, setPublicCommitments] = useState<PublicCommitment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.uid) {
      loadCurrentWeekCommitment();
      loadPartners();
      loadPublicCommitments();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.uid]);

  const getCurrentWeek = (): { weekNumber: number; weekStart: Date; weekEnd: Date } => {
    const now = new Date();
    const start = new Date(now.getFullYear(), 0, 1);
    const diff = now.getTime() - start.getTime();
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    const weekNumber = Math.ceil(diff / oneWeek);

    const dayOfWeek = now.getDay();
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() + daysToMonday);
    weekStart.setHours(0, 0, 0, 0);
    
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    return { weekNumber, weekStart, weekEnd };
  };

  const loadCurrentWeekCommitment = async () => {
    if (!user?.uid) return;

    try {
      const { weekNumber } = getCurrentWeek();
      
      const commitmentQuery = query(
        collection(db, 'weeklyCommitments'),
        where('userId', '==', user.uid),
        where('weekNumber', '==', weekNumber)
      );
      
      const snapshot = await getDocs(commitmentQuery);
      
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setCurrentWeekCommitment({
          id: snapshot.docs[0].id,
          ...data,
          weekStart: data.weekStart.toDate(),
          weekEnd: data.weekEnd.toDate(),
          createdAt: data.createdAt.toDate(),
          completedAt: data.completedAt?.toDate()
        } as WeeklyCommitment);
      } else {
        setCurrentWeekCommitment(null);
      }
    } catch (error) {
      console.error('Error loading week commitment:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadPartners = async () => {
    if (!user?.uid) return;

    try {
      const partnersQuery = query(
        collection(db, 'accountabilityPartners'),
        where('userId', '==', user.uid),
        where('status', '==', 'active')
      );
      
      const snapshot = await getDocs(partnersQuery);
      const partnerList: AccountabilityPartner[] = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        partnerList.push({
          id: doc.id,
          ...data,
          startedAt: data.startedAt.toDate(),
          lastCheckIn: data.lastCheckIn?.toDate()
        } as AccountabilityPartner);
      });
      
      setPartners(partnerList);
    } catch (error) {
      console.error('Error loading partners:', error);
    }
  };

  const loadPublicCommitments = async () => {
    if (!user?.uid) return;

    try {
      const publicQuery = query(
        collection(db, 'publicCommitments'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc'),
        limit(5)
      );
      
      const snapshot = await getDocs(publicQuery);
      const commitments: PublicCommitment[] = [];
      
      snapshot.forEach(doc => {
        const data = doc.data();
        commitments.push({
          id: doc.id,
          ...data,
          targetDate: data.targetDate.toDate(),
          createdAt: data.createdAt.toDate(),
          completedAt: data.completedAt?.toDate()
        } as PublicCommitment);
      });
      
      setPublicCommitments(commitments);
    } catch (error) {
      console.error('Error loading public commitments:', error);
    }
  };

  const createWeeklyCommitment = async (commitments: Omit<Commitment, 'id' | 'current' | 'status'>[]): Promise<void> => {
    if (!user?.uid) throw new Error('Not authenticated');

    const { weekNumber, weekStart, weekEnd } = getCurrentWeek();

    const weeklyCommitment: Omit<WeeklyCommitment, 'id'> = {
      userId: user.uid,
      weekNumber,
      weekStart,
      weekEnd,
      commitments: commitments.map(c => ({
        ...c,
        id: Math.random().toString(36).substr(2, 9),
        current: 0,
        status: 'pending' as CommitmentStatus
      })),
      createdAt: new Date(),
      overallStatus: 'in-progress'
    };

    await addDoc(collection(db, 'weeklyCommitments'), weeklyCommitment);
    await loadCurrentWeekCommitment();
  };

  const updateCommitmentProgress = async (commitmentId: string, progress: number): Promise<void> => {
    if (!currentWeekCommitment) return;

    const updatedCommitments = currentWeekCommitment.commitments.map(c => {
      if (c.id === commitmentId) {
        const newCurrent = Math.min(progress, c.target);
        return {
          ...c,
          current: newCurrent,
          status: newCurrent >= c.target ? 'completed' as CommitmentStatus : 'in-progress' as CommitmentStatus
        };
      }
      return c;
    });

    const allCompleted = updatedCommitments.every(c => c.status === 'completed');
    const anyFailed = updatedCommitments.some(c => c.status === 'failed');

    await updateDoc(doc(db, 'weeklyCommitments', currentWeekCommitment.id), {
      commitments: updatedCommitments,
      overallStatus: allCompleted ? 'completed' : anyFailed ? 'failed' : 'in-progress',
      completedAt: allCompleted ? new Date() : null
    });

    await loadCurrentWeekCommitment();
  };

  const deleteIndividualCommitment = async (commitmentId: string): Promise<void> => {
    if (!currentWeekCommitment) return;

    const updatedCommitments = currentWeekCommitment.commitments.filter(c => c.id !== commitmentId);

    if (updatedCommitments.length === 0) {
      // If no commitments left, delete the entire weekly commitment
      await deleteDoc(doc(db, 'weeklyCommitments', currentWeekCommitment.id));
      setCurrentWeekCommitment(null);
    } else {
      // Update with remaining commitments
      const allCompleted = updatedCommitments.every(c => c.status === 'completed');
      const anyFailed = updatedCommitments.some(c => c.status === 'failed');

      await updateDoc(doc(db, 'weeklyCommitments', currentWeekCommitment.id), {
        commitments: updatedCommitments,
        overallStatus: allCompleted ? 'completed' : anyFailed ? 'failed' : 'in-progress',
        completedAt: allCompleted ? new Date() : null
      });

      await loadCurrentWeekCommitment();
    }
  };

  const deleteWeeklyCommitment = async (): Promise<void> => {
    if (!currentWeekCommitment?.id) return;

    await deleteDoc(doc(db, 'weeklyCommitments', currentWeekCommitment.id));
    setCurrentWeekCommitment(null);
  };

  const completeWeeklyCheckIn = async (reflection: string, nextWeekFocus: string): Promise<void> => {
    if (!user?.uid || !currentWeekCommitment) return;

    const { weekNumber } = getCurrentWeek();
    const completedCount = currentWeekCommitment.commitments.filter(c => c.status === 'completed').length;

    const checkIn: Omit<AccountabilityCheckIn, 'id'> = {
      userId: user.uid,
      weekNumber,
      checkInDate: new Date(),
      completed: true,
      commitmentsMet: completedCount,
      commitmentsTotal: currentWeekCommitment.commitments.length,
      weekReflection: reflection,
      nextWeekFocus
    };

    await addDoc(collection(db, 'accountabilityCheckIns'), checkIn);
  };

  const makePublicCommitment = async (
    commitment: string, 
    targetDate: Date, 
    witnesses: string[]
  ): Promise<void> => {
    if (!user?.uid) throw new Error('Not authenticated');

    const publicCommitment: Omit<PublicCommitment, 'id'> = {
      userId: user.uid,
      userName: user.email?.split('@')[0] || 'User',
      commitment,
      targetDate,
      witnesses,
      status: 'pending',
      createdAt: new Date()
    };

    await addDoc(collection(db, 'publicCommitments'), publicCommitment);
    await loadPublicCommitments();
  };

  const getAccountabilityStats = async (): Promise<AccountabilityStats> => {
    if (!user?.uid) {
      return {
        weeklyCompletionRate: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalCommitments: 0,
        completedCommitments: 0,
        failedCommitments: 0,
        avgCommitmentsPerWeek: 0,
        partnerCheckIns: 0,
        publicCommitmentsMade: 0,
        publicCommitmentsKept: 0
      };
    }

    try {
      // Load all weekly commitments
      const commitmentsQuery = query(
        collection(db, 'weeklyCommitments'),
        where('userId', '==', user.uid),
        orderBy('weekNumber', 'desc')
      );
      const commitmentsSnap = await getDocs(commitmentsQuery);

      let totalCommitments = 0;
      let completedCommitments = 0;
      let failedCommitments = 0;

      commitmentsSnap.forEach(doc => {
        const data = doc.data();
        data.commitments.forEach((c: Commitment) => {
          totalCommitments++;
          if (c.status === 'completed') completedCommitments++;
          if (c.status === 'failed') failedCommitments++;
        });
      });

      // Calculate streaks
      let currentStreak = 0;
      let longestStreak = 0;
      let tempStreak = 0;

      commitmentsSnap.docs.reverse().forEach(doc => {
        const data = doc.data();
        if (data.overallStatus === 'completed') {
          tempStreak++;
          longestStreak = Math.max(longestStreak, tempStreak);
        } else {
          if (tempStreak > 0) currentStreak = tempStreak;
          tempStreak = 0;
        }
      });

      // Check-ins
      const checkInsQuery = query(
        collection(db, 'accountabilityCheckIns'),
        where('userId', '==', user.uid)
      );
      const checkInsSnap = await getDocs(checkInsQuery);

      // Public commitments
      const publicQuery = query(
        collection(db, 'publicCommitments'),
        where('userId', '==', user.uid)
      );
      const publicSnap = await getDocs(publicQuery);
      
      let publicKept = 0;
      publicSnap.forEach(doc => {
        if (doc.data().status === 'completed') publicKept++;
      });

      return {
        weeklyCompletionRate: commitmentsSnap.size > 0 ? completedCommitments / totalCommitments : 0,
        currentStreak,
        longestStreak,
        totalCommitments,
        completedCommitments,
        failedCommitments,
        avgCommitmentsPerWeek: commitmentsSnap.size > 0 ? totalCommitments / commitmentsSnap.size : 0,
        partnerCheckIns: checkInsSnap.size,
        publicCommitmentsMade: publicSnap.size,
        publicCommitmentsKept: publicKept
      };
    } catch (error) {
      console.error('Error getting accountability stats:', error);
      return {
        weeklyCompletionRate: 0,
        currentStreak: 0,
        longestStreak: 0,
        totalCommitments: 0,
        completedCommitments: 0,
        failedCommitments: 0,
        avgCommitmentsPerWeek: 0,
        partnerCheckIns: 0,
        publicCommitmentsMade: 0,
        publicCommitmentsKept: 0
      };
    }
  };

  return {
    currentWeekCommitment,
    partners,
    publicCommitments,
    loading,
    createWeeklyCommitment,
    updateCommitmentProgress,
    deleteIndividualCommitment,
    deleteWeeklyCommitment,
    completeWeeklyCheckIn,
    makePublicCommitment,
    getAccountabilityStats,
    refreshCommitment: loadCurrentWeekCommitment
  };
}
