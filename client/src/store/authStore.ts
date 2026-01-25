/* eslint-disable max-lines-per-function, max-depth */
import { create } from "zustand";
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User as FirebaseUser,
} from "firebase/auth";
import { doc, setDoc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../lib/firebase";

export interface UserProfile {
  uid: string;
  email: string;
  name: string;
  currentWeek: number;
  totalXP: number;
  createdAt: Date;
  lastLoginDate?: string; // YYYY-MM-DD format
  currentStreak?: number;
  longestStreak?: number;
}

interface AuthState {
  user: UserProfile | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  firebaseUser: null,
  loading: true,

  login: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password,
    );
    const userDoc = await getDoc(doc(db, "users", userCredential.user.uid));

    if (userDoc.exists()) {
      set({
        user: userDoc.data() as UserProfile,
        firebaseUser: userCredential.user,
        loading: false,
      });
    }
  },

  register: async (email, password, name) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    // Create user profile in Firestore
    const userProfile: UserProfile = {
      uid: userCredential.user.uid,
      email: email,
      name: name,
      currentWeek: 1,
      totalXP: 0,
      createdAt: new Date(),
    };

    await setDoc(doc(db, "users", userCredential.user.uid), userProfile);

    set({
      user: userProfile,
      firebaseUser: userCredential.user,
      loading: false,
    });
  },

  logout: async () => {
    await signOut(auth);
    set({ user: null, firebaseUser: null });
  },

  initAuth: () => {
    console.log("initAuth called");
    set({ loading: true });
    onAuthStateChanged(auth, async (firebaseUser) => {
      console.log("Auth state changed:", firebaseUser?.uid || "no user");
      if (firebaseUser) {
        try {
          const userDocRef = doc(db, "users", firebaseUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            console.log("User doc found");
            const userData = userDoc.data() as UserProfile;

            // Calculate and update streak
            const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD
            const lastLogin = userData.lastLoginDate;

            let currentStreak = userData.currentStreak || 0;
            let longestStreak = userData.longestStreak || 0;

            if (lastLogin !== today) {
              // Only update if not already logged in today
              if (lastLogin) {
                const lastDate = new Date(lastLogin);
                const todayDate = new Date(today);
                const diffDays = Math.floor(
                  (todayDate.getTime() - lastDate.getTime()) /
                    (1000 * 60 * 60 * 24),
                );

                if (diffDays === 1) {
                  // Consecutive day
                  currentStreak += 1;
                } else if (diffDays > 1) {
                  // Streak broken
                  currentStreak = 1;
                }
              } else {
                // First login ever
                currentStreak = 1;
              }

              longestStreak = Math.max(longestStreak, currentStreak);

              // Update Firestore with new streak data
              await updateDoc(userDocRef, {
                lastLoginDate: today,
                currentStreak,
                longestStreak,
              });

              userData.lastLoginDate = today;
              userData.currentStreak = currentStreak;
              userData.longestStreak = longestStreak;
            }

            set({
              user: userData,
              firebaseUser,
              loading: false,
            });
          } else {
            console.log("User doc not found");
            set({ user: null, firebaseUser: null, loading: false });
          }
        } catch (error) {
          console.error("Error fetching user doc:", error);
          set({ user: null, firebaseUser: null, loading: false });
        }
      } else {
        console.log("No firebase user, setting loading to false");
        set({ user: null, firebaseUser: null, loading: false });
      }
    });
  },
}));
