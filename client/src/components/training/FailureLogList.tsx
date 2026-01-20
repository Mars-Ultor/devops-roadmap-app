/**
 * FailureLogList - Display failure logs with filtering and resolution tracking
 * Refactored to use extracted components
 */

import { useState, useEffect } from "react";
import { useFailureLog } from "../../hooks/useFailureLog";
import FailureResolutionForm from "./FailureResolutionForm";
import type { FailureLog, FailureCategory } from "../../types/training";
import { calculateStats } from "./FailureLogListUtils";
import {
  StatsDisplay,
  Filters,
  FailureItem,
  EmptyState,
} from "./FailureLogListComponents";

interface FailureLogListProps {
  contentId?: string;
  showFilters?: boolean;
}

export default function FailureLogList({
  contentId,
  showFilters = true,
}: FailureLogListProps) {
  const { getFailureLogs, updateFailure, loading } = useFailureLog();
  const [failures, setFailures] = useState<FailureLog[]>([]);
  const [filteredFailures, setFilteredFailures] = useState<FailureLog[]>([]);
  const [selectedFailure, setSelectedFailure] = useState<FailureLog | null>(
    null,
  );
  const [showResolutionForm, setShowResolutionForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<FailureCategory | "all">(
    "all",
  );
  const [statusFilter, setStatusFilter] = useState<
    "all" | "resolved" | "unresolved"
  >("all");

  const loadFailures = async () => {
    const logs = await getFailureLogs(contentId);
    setFailures(logs);
  };

  const applyFilters = () => {
    let filtered = [...failures];
    if (categoryFilter !== "all")
      filtered = filtered.filter((f) => f.category === categoryFilter);
    if (statusFilter === "resolved")
      filtered = filtered.filter((f) => f.resolvedAt !== undefined);
    else if (statusFilter === "unresolved")
      filtered = filtered.filter((f) => f.resolvedAt === undefined);
    setFilteredFailures(filtered);
  };

  useEffect(() => {
    loadFailures();
  }, [contentId]); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    applyFilters();
  }, [failures, categoryFilter, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleResolve = (failure: FailureLog) => {
    setSelectedFailure(failure);
    setShowResolutionForm(true);
  };

  const handleResolutionSubmit = async (
    updates: Partial<
      Pick<
        FailureLog,
        | "rootCause"
        | "resolution"
        | "preventionStrategy"
        | "lessonsLearned"
        | "resolvedAt"
      >
    >,
  ) => {
    if (!selectedFailure) return;
    await updateFailure(selectedFailure.id, updates);
    await loadFailures();
    setShowResolutionForm(false);
    setSelectedFailure(null);
  };

  if (loading && failures.length === 0) {
    return (
      <div className="text-center py-12 text-slate-400">
        Loading failure logs...
      </div>
    );
  }

  const stats = calculateStats(failures);

  return (
    <div className="space-y-6">
      <StatsDisplay stats={stats} />
      {showFilters && (
        <Filters
          categoryFilter={categoryFilter}
          statusFilter={statusFilter}
          onCategoryChange={setCategoryFilter}
          onStatusChange={setStatusFilter}
        />
      )}
      <div className="space-y-3">
        {filteredFailures.length === 0 ? (
          <EmptyState hasFailures={failures.length > 0} />
        ) : (
          filteredFailures.map((failure) => (
            <FailureItem
              key={failure.id}
              failure={failure}
              onResolve={handleResolve}
            />
          ))
        )}
      </div>
      {showResolutionForm && selectedFailure && (
        <FailureResolutionForm
          failure={selectedFailure}
          onSubmit={handleResolutionSubmit}
          onCancel={() => {
            setShowResolutionForm(false);
            setSelectedFailure(null);
          }}
        />
      )}
    </div>
  );
}
