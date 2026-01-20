/**
 * TokenManagement - View token allocation, usage stats, and history
 * Refactored to use extracted components
 */

import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useResetTokens } from "../hooks/useResetTokens";
import type { TokenUsageStats } from "../types/tokens";
import {
  PageHeader,
  CurrentWeekSection,
  StatsSection,
  RecentHistory,
  PhilosophyReminder,
} from "./TokenManagementComponents";

export default function TokenManagement() {
  const navigate = useNavigate();
  const { currentAllocation, recentResets, loading, getUsageStats } =
    useResetTokens();
  const [stats, setStats] = useState<TokenUsageStats | null>(null);

  const loadStats = useCallback(async () => {
    const usageStats = await getUsageStats();
    setStats(usageStats);
  }, [getUsageStats]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white">Loading token information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <PageHeader onBack={() => navigate("/dashboard")} />
        <CurrentWeekSection allocation={currentAllocation} />
        {stats && <StatsSection stats={stats} />}
        <RecentHistory resets={recentResets} />
        <PhilosophyReminder />
      </div>
    </div>
  );
}
