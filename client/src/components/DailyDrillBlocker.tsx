/**
 * Daily Drill Blocker - CANNOT BE BYPASSED
 * Blocks all training access until today's drill is complete
 * Phase 6: Daily Drill Requirement
 */

import { useEffect, useState, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import { db } from "../lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import {
  DrillLoadingScreen,
  DrillBlockedHeader,
  TrainingBlockedWarning,
  WhyDrillsMatter,
  StatusCheckInfo,
  StartDrillButton,
} from "./daily-drill/DailyDrillBlockerComponents";
import { EXEMPT_ROUTES } from "./daily-drill/DailyDrillBlockerUtils";

interface DailyDrillBlockerProps {
  readonly children: React.ReactNode;
}

export default function DailyDrillBlocker({
  children,
}: DailyDrillBlockerProps) {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isBlocked, setIsBlocked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [checkCount, setCheckCount] = useState(0);

  const isExemptRoute = useCallback(() => {
    const exemptRoutes = EXEMPT_ROUTES.some((route) =>
      location.pathname.startsWith(route),
    );
    if (location.pathname === "/training") {
      const urlParams = new URLSearchParams(location.search);
      if (urlParams.get("tab") === "daily") return true;
    }
    return exemptRoutes;
  }, [location.pathname, location.search]);

  const checkDrillStatus = useCallback(async () => {
    if (!user || isExemptRoute()) {
      setIsBlocked(false);
      setLoading(false);
      return;
    }
    try {
      const today = new Date().toISOString().split("T")[0];
      const drillSnap = await getDoc(
        doc(db, "userProgress", user.uid, "dailyDrills", today),
      );
      setIsBlocked(!(drillSnap.exists() && drillSnap.data().completed));
    } catch {
      setIsBlocked(false);
    } finally {
      setLoading(false);
    }
  }, [user, isExemptRoute]);

  useEffect(() => {
    checkDrillStatus();
  }, [checkDrillStatus]);
  useEffect(() => {
    if (isBlocked && !loading) {
      const interval = setInterval(() => {
        setCheckCount((prev) => prev + 1);
        checkDrillStatus();
      }, 10000);
      return () => clearInterval(interval);
    }
  }, [isBlocked, loading, checkDrillStatus]);
  useEffect(() => {
    const handleFocus = () => {
      if (isBlocked) checkDrillStatus();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [isBlocked, checkDrillStatus]);

  const handleStartDrill = () => {
    try {
      navigate("/training?tab=daily");
    } catch {
      globalThis.location.href = "/training?tab=daily";
    }
  };

  if (loading) return <DrillLoadingScreen />;
  if (isBlocked) {
    return (
      <div className="fixed inset-0 bg-slate-900 flex items-center justify-center z-50 p-4">
        <div className="max-w-2xl w-full max-h-[90vh] bg-slate-800 border-2 border-yellow-500 rounded-lg shadow-2xl overflow-hidden flex flex-col">
          <DrillBlockedHeader />
          <div className="px-8 py-6 space-y-6 overflow-y-auto flex-1">
            <TrainingBlockedWarning />
            <WhyDrillsMatter />
            <StatusCheckInfo checkCount={checkCount} />
          </div>
          <StartDrillButton onClick={handleStartDrill} />
        </div>
      </div>
    );
  }
  return <>{children}</>;
}
