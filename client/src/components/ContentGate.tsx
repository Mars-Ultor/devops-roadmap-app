/**
 * ContentGate Component
 * Blocks access to training content until daily drill is completed
 * Phase 6: Daily Drill Blocker
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  GateLoadingScreen,
  GateHeader,
  WhyDrillsMatterSection,
  DrillDetailsSection,
  SpacedRepetitionInfo,
  GateFooter,
} from "./content-gate/ContentGateComponents";

interface ContentGateProps {
  readonly children: React.ReactNode;
}

export default function ContentGate({ children }: ContentGateProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isBlocked, setIsBlocked] = useState(true);
  const [loading, setLoading] = useState(true);

  const checkDailyDrillStatus = useCallback(async () => {
    if (!user) {
      setIsBlocked(true);
      setLoading(false);
      return;
    }
    try {
      const today = new Date().toISOString().split("T")[0];
      const drillSnap = await getDoc(
        doc(db, "userProgress", user.uid, "dailyDrills", today),
      );
      setIsBlocked(drillSnap.exists() ? !drillSnap.data().completed : true);
    } catch {
      setIsBlocked(false);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    checkDailyDrillStatus();
  }, [user, location.pathname, checkDailyDrillStatus]);
  useEffect(() => {
    const handleFocus = () => checkDailyDrillStatus();
    globalThis.addEventListener("focus", handleFocus);
    return () => globalThis.removeEventListener("focus", handleFocus);
  }, [checkDailyDrillStatus]);
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
      }
    };
    globalThis.addEventListener("keydown", handleKeyDown);
    return () => globalThis.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleStartDrill = () => {
    try {
      navigate("/training?tab=daily");
    } catch {
      globalThis.location.href = "/training?tab=daily";
    }
  };

  if (loading) return <GateLoadingScreen />;
  if (isBlocked) {
    return (
      <div className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div
          className="bg-slate-800 border-2 border-yellow-500 rounded-lg p-8 max-w-2xl w-full shadow-2xl"
          role="alertdialog"
          aria-modal="true"
        >
          <GateHeader />
          <WhyDrillsMatterSection />
          <DrillDetailsSection />
          <SpacedRepetitionInfo />
          <GateFooter onStart={handleStartDrill} />
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
