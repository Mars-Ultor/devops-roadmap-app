/**
 * Accountability System Hook - Refactored
 * Manage weekly commitments and accountability partners
 */

import { useState, useEffect, useCallback } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc, orderBy, limit } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuthStore } from '../store/authStore';
import type { 
  WeeklyCommitment, 
  Commitment, 
  AccountabilityPartner,
  AccountabilityCheckIn,
  PublicCommitment,
  AccountabilityStats
} from '../types/accountability';
import {
  getCurrentWeekInfo, createCommitment, updateCommitmentWithProgress,
  calculateOverallStatus, getDefaultAccountabilityStats, calculateAccountabilityStats
} from './accountability/accountabilityUtils';

export function useAccountability() {
  const { user } = useAuthStore();
  const [currentWeekCommitment, setCurrentWeekCommitment] = useState<WeeklyCommitment | null>(null);
  const [partners, setPartners] = useState<AccountabilityPartner[]>([]);
  const [publicCommitments, setPublicCommitments] = useState<PublicCommitment[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCurrentWeekCommitment = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const { weekNumber } = getCurrentWeekInfo();
      const snapshot = await getDocs(query(collection(db, 'weeklyCommitments'), where('userId', '==', user.uid), where('weekNumber', '==', weekNumber)));
      if (!snapshot.empty) {
        const data = snapshot.docs[0].data();
        setCurrentWeekCommitment({ id: snapshot.docs[0].id, ...data, weekStart: data.weekStart.toDate(), weekEnd: data.weekEnd.toDate(), createdAt: data.createdAt.toDate(), completedAt: data.completedAt?.toDate() } as WeeklyCommitment);
      } else { setCurrentWeekCommitment(null); }
    } catch (e) { console.error('Error loading week commitment:', e); }
    finally { setLoading(false); }
  }, [user?.uid]);

  const loadPartners = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const snapshot = await getDocs(query(collection(db, 'accountabilityPartners'), where('userId', '==', user.uid), where('status', '==', 'active')));
      setPartners(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), startedAt: doc.data().startedAt.toDate(), lastCheckIn: doc.data().lastCheckIn?.toDate() })) as AccountabilityPartner[]);
    } catch (e) { console.error('Error loading partners:', e); }
  }, [user?.uid]);

  const loadPublicCommitments = useCallback(async () => {
    if (!user?.uid) return;
    try {
      const snapshot = await getDocs(query(collection(db, 'publicCommitments'), where('userId', '==', user.uid), orderBy('createdAt', 'desc'), limit(5)));
      setPublicCommitments(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), targetDate: doc.data().targetDate.toDate(), createdAt: doc.data().createdAt.toDate(), completedAt: doc.data().completedAt?.toDate() })) as PublicCommitment[]);
    } catch (e) { console.error('Error loading public commitments:', e); }
  }, [user?.uid]);

  useEffect(() => {
    if (user?.uid) { loadCurrentWeekCommitment(); loadPartners(); loadPublicCommitments(); }
  }, [user?.uid, loadCurrentWeekCommitment, loadPartners, loadPublicCommitments]);

  const createWeeklyCommitment = async (commitments: Omit<Commitment, 'id' | 'current' | 'status'>[]): Promise<void> => {
    if (!user?.uid) throw new Error('Not authenticated');
    const { weekNumber, weekStart, weekEnd } = getCurrentWeekInfo();
    await addDoc(collection(db, 'weeklyCommitments'), { userId: user.uid, weekNumber, weekStart, weekEnd, commitments: commitments.map(createCommitment), createdAt: new Date(), overallStatus: 'in-progress' });
    await loadCurrentWeekCommitment();
  };

  const updateCommitmentProgress = async (commitmentId: string, progress: number): Promise<void> => {
    if (!currentWeekCommitment) return;
    const updatedCommitments = currentWeekCommitment.commitments.map(c => c.id === commitmentId ? updateCommitmentWithProgress(c, progress) : c);
    const overallStatus = calculateOverallStatus(updatedCommitments);
    await updateDoc(doc(db, 'weeklyCommitments', currentWeekCommitment.id), { commitments: updatedCommitments, overallStatus, completedAt: overallStatus === 'completed' ? new Date() : null });
    await loadCurrentWeekCommitment();
  };

  const deleteIndividualCommitment = async (commitmentId: string): Promise<void> => {
    if (!currentWeekCommitment) return;
    const updatedCommitments = currentWeekCommitment.commitments.filter(c => c.id !== commitmentId);
    if (updatedCommitments.length === 0) { await deleteDoc(doc(db, 'weeklyCommitments', currentWeekCommitment.id)); setCurrentWeekCommitment(null); }
    else { await updateDoc(doc(db, 'weeklyCommitments', currentWeekCommitment.id), { commitments: updatedCommitments, overallStatus: calculateOverallStatus(updatedCommitments), completedAt: calculateOverallStatus(updatedCommitments) === 'completed' ? new Date() : null }); await loadCurrentWeekCommitment(); }
  };

  const deleteWeeklyCommitment = async (): Promise<void> => {
    if (!currentWeekCommitment?.id) return;
    await deleteDoc(doc(db, 'weeklyCommitments', currentWeekCommitment.id));
    setCurrentWeekCommitment(null);
  };

  const completeWeeklyCheckIn = async (reflection: string, nextWeekFocus: string): Promise<void> => {
    if (!user?.uid || !currentWeekCommitment) return;
    const { weekNumber } = getCurrentWeekInfo();
    const completedCount = currentWeekCommitment.commitments.filter(c => c.status === 'completed').length;
    const checkIn: Omit<AccountabilityCheckIn, 'id'> = { userId: user.uid, weekNumber, checkInDate: new Date(), completed: true, commitmentsMet: completedCount, commitmentsTotal: currentWeekCommitment.commitments.length, weekReflection: reflection, nextWeekFocus };
    await addDoc(collection(db, 'accountabilityCheckIns'), checkIn);
  };

  const makePublicCommitment = async (commitment: string, targetDate: Date, witnesses: string[]): Promise<void> => {
    if (!user?.uid) throw new Error('Not authenticated');
    await addDoc(collection(db, 'publicCommitments'), { userId: user.uid, userName: user.email?.split('@')[0] || 'User', commitment, targetDate, witnesses, status: 'pending', createdAt: new Date() });
    await loadPublicCommitments();
  };

  const getAccountabilityStats = async (): Promise<AccountabilityStats> => {
    if (!user?.uid) return getDefaultAccountabilityStats();
    try {
      const [commitmentsSnap, checkInsSnap, publicSnap] = await Promise.all([
        getDocs(query(collection(db, 'weeklyCommitments'), where('userId', '==', user.uid), orderBy('weekNumber', 'desc'))),
        getDocs(query(collection(db, 'accountabilityCheckIns'), where('userId', '==', user.uid))),
        getDocs(query(collection(db, 'publicCommitments'), where('userId', '==', user.uid)))
      ]);
      return calculateAccountabilityStats(commitmentsSnap.docs.map(d => d.data() as { overallStatus?: string; commitments: Array<{ status: string }> }), checkInsSnap.size, publicSnap.docs.map(d => d.data() as { status?: string }));
    } catch (e) { console.error('Error getting accountability stats:', e); return getDefaultAccountabilityStats(); }
  };

  return { currentWeekCommitment, partners, publicCommitments, loading, createWeeklyCommitment, updateCommitmentProgress, deleteIndividualCommitment, deleteWeeklyCommitment, completeWeeklyCheckIn, makePublicCommitment, getAccountabilityStats, refreshCommitment: loadCurrentWeekCommitment };
}
