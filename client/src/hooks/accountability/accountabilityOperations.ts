/**
 * Accountability Operations Utils
 * Extracted functions from useAccountability hook
 * For ESLint compliance (max-lines-per-function)
 */

import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import type {
  WeeklyCommitment,
  Commitment,
  AccountabilityPartner,
  AccountabilityCheckIn,
  PublicCommitment,
  AccountabilityStats,
} from "../../types/accountability";
import {
  getCurrentWeekInfo,
  createCommitment,
  updateCommitmentWithProgress,
  calculateOverallStatus,
  getDefaultAccountabilityStats,
  calculateAccountabilityStats,
} from "./accountabilityUtils";

export const loadCurrentWeekCommitmentFromDB = async (
  userId: string
): Promise<WeeklyCommitment | null> => {
  const { weekNumber } = getCurrentWeekInfo();
  const q = query(
    collection(db, "weeklyCommitments"),
    where("userId", "==", userId),
    where("weekNumber", "==", weekNumber)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const data = snapshot.docs[0].data();
  return {
    id: snapshot.docs[0].id,
    ...data,
    weekStart: data.weekStart.toDate(),
    weekEnd: data.weekEnd.toDate(),
    createdAt: data.createdAt.toDate(),
    completedAt: data.completedAt?.toDate(),
    commitments: data.commitments.map((c: Commitment & { createdAt: Timestamp; completedAt?: Timestamp }) => ({
      ...c,
      createdAt: c.createdAt.toDate(),
      completedAt: c.completedAt?.toDate(),
    })),
  } as WeeklyCommitment;
};

export const loadPartnersFromDB = async (
  userId: string
): Promise<AccountabilityPartner[]> => {
  const q = query(
    collection(db, "accountabilityPartners"),
    where("userId", "==", userId),
    where("status", "==", "active")
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    startedAt: doc.data().startedAt.toDate(),
    lastCheckIn: doc.data().lastCheckIn?.toDate(),
  })) as AccountabilityPartner[];
};

export const loadPublicCommitmentsFromDB = async (
  userId: string
): Promise<PublicCommitment[]> => {
  const q = query(
    collection(db, "publicCommitments"),
    where("userId", "==", userId),
    orderBy("createdAt", "desc"),
    limit(5)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
    targetDate: doc.data().targetDate.toDate(),
    createdAt: doc.data().createdAt.toDate(),
    completedAt: doc.data().completedAt?.toDate(),
  })) as PublicCommitment[];
};

export const createWeeklyCommitmentInDB = async (
  userId: string,
  commitments: Omit<Commitment, "id" | "current" | "status">[]
): Promise<void> => {
  const { weekNumber, weekStart, weekEnd } = getCurrentWeekInfo();
  await addDoc(collection(db, "weeklyCommitments"), {
    userId,
    weekNumber,
    weekStart,
    weekEnd,
    commitments: commitments.map(createCommitment),
    createdAt: new Date(),
    overallStatus: "in-progress",
  });
};

export const updateCommitmentProgressInDB = async (
  commitmentId: string,
  currentWeekCommitment: WeeklyCommitment,
  progress: number
): Promise<void> => {
  const updatedCommitments = currentWeekCommitment.commitments.map((c) =>
    c.id === commitmentId ? updateCommitmentWithProgress(c, progress) : c
  );
  const overallStatus = calculateOverallStatus(updatedCommitments);
  await updateDoc(doc(db, "weeklyCommitments", currentWeekCommitment.id), {
    commitments: updatedCommitments,
    overallStatus,
    completedAt: overallStatus === "completed" ? new Date() : null,
  });
};

export const deleteIndividualCommitmentFromDB = async (
  commitmentId: string,
  currentWeekCommitment: WeeklyCommitment
): Promise<void> => {
  const updatedCommitments = currentWeekCommitment.commitments.filter(
    (c) => c.id !== commitmentId
  );
  if (updatedCommitments.length === 0) {
    await deleteDoc(doc(db, "weeklyCommitments", currentWeekCommitment.id));
  } else {
    await updateDoc(doc(db, "weeklyCommitments", currentWeekCommitment.id), {
      commitments: updatedCommitments,
      overallStatus: calculateOverallStatus(updatedCommitments),
      completedAt:
        calculateOverallStatus(updatedCommitments) === "completed"
          ? new Date()
          : null,
    });
  }
};

export const deleteWeeklyCommitmentFromDB = async (
  commitmentId: string
): Promise<void> => {
  await deleteDoc(doc(db, "weeklyCommitments", commitmentId));
};

export const completeWeeklyCheckInInDB = async (
  userId: string,
  currentWeekCommitment: WeeklyCommitment,
  reflection: string,
  nextWeekFocus: string
): Promise<void> => {
  const { weekNumber } = getCurrentWeekInfo();
  const completedCount = currentWeekCommitment.commitments.filter(
    (c) => c.status === "completed"
  ).length;
  const checkIn: Omit<AccountabilityCheckIn, "id"> = {
    userId,
    weekNumber,
    checkInDate: new Date(),
    completed: true,
    commitmentsMet: completedCount,
    commitmentsTotal: currentWeekCommitment.commitments.length,
    weekReflection: reflection,
    nextWeekFocus,
  };
  await addDoc(collection(db, "accountabilityCheckIns"), checkIn);
};

export const makePublicCommitmentInDB = async (
  userId: string,
  userName: string,
  commitment: string,
  targetDate: Date,
  witnesses: string[]
): Promise<void> => {
  await addDoc(collection(db, "publicCommitments"), {
    userId,
    userName,
    commitment,
    targetDate,
    witnesses,
    status: "pending",
    createdAt: new Date(),
  });
};

export const getAccountabilityStatsFromDB = async (
  userId: string
): Promise<AccountabilityStats> => {
  try {
    const [commitmentsSnap, checkInsSnap, publicSnap] = await Promise.all([
      getDocs(
        query(
          collection(db, "weeklyCommitments"),
          where("userId", "==", userId),
          orderBy("weekNumber", "desc")
        )
      ),
      getDocs(
        query(
          collection(db, "accountabilityCheckIns"),
          where("userId", "==", userId)
        )
      ),
      getDocs(
        query(
          collection(db, "publicCommitments"),
          where("userId", "==", userId)
        )
      ),
    ]);
    return calculateAccountabilityStats(
      commitmentsSnap.docs.map(
        (d) =>
          d.data() as {
            overallStatus?: string;
            commitments: Array<{ status: string }>;
          }
      ),
      checkInsSnap.size,
      publicSnap.docs.map((d) => d.data() as { status?: string })
    );
  } catch (e) {
    console.error("Error getting accountability stats:", e);
    return getDefaultAccountabilityStats();
  }
};