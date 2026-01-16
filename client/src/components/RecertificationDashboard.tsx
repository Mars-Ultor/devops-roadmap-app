import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import RecertificationDrillComponent from './RecertificationDrill';
import { RECERTIFICATION_DRILLS } from '../data/recertificationDrills';
import { CertificationService } from '../services/certificationService';
import type { RecertificationAttempt, RecertificationDrill } from '../types/training';
import { useRecertificationData } from '../hooks/useRecertificationData';
import {
  RecertificationHeader,
  UrgentRecertifications,
  CertificationsList,
  AvailableDrillsList,
  RecentAttemptsList,
  SkillDecayInfo
} from './recertification/RecertificationComponents';

export default function RecertificationDashboard() {
  const { user } = useAuthStore();
  const [selectedDrill, setSelectedDrill] = useState<RecertificationDrill | null>(null);
  const { certificationStatus, recentAttempts, loading, error, refreshData } = useRecertificationData(user?.uid);

  const hasPrerequisite = (prereq: string) => 
    certificationStatus.some(cert =>
      cert.skillId === prereq ||
      (prereq.includes('-completed') && cert.certificationLevel !== 'bronze')
    );

  const getAvailableDrills = () => 
    RECERTIFICATION_DRILLS.filter(drill =>
      drill.prerequisites.every(hasPrerequisite)
    );

  const getUpcomingRecertifications = () =>
    certificationStatus
      .filter(cert => cert.recertificationRequired)
      .sort((a, b) => a.expiresAt.getTime() - b.expiresAt.getTime());

  const handleDrillComplete = async (attempt: RecertificationAttempt) => {
    try {
      await CertificationService.submitRecertificationAttempt(attempt);
      await refreshData();
      setSelectedDrill(null);
    } catch (err) {
      console.error('Error submitting drill attempt:', err);
    }
  };

  if (selectedDrill) {
    return (
      <RecertificationDrillComponent
        drillId={selectedDrill.id}
        onComplete={handleDrillComplete}
        onCancel={() => setSelectedDrill(null)}
      />
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading certification data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error loading certification data</div>
          <div className="text-gray-400">{error}</div>
          <button onClick={() => globalThis.location.reload()} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="max-w-7xl mx-auto p-6 space-y-8">
        <RecertificationHeader
          certificationCount={certificationStatus.length}
          passedDrillsCount={recentAttempts.filter(a => a.passed).length}
        />
        <UrgentRecertifications
          certifications={getUpcomingRecertifications()}
          drills={RECERTIFICATION_DRILLS}
          onSelectDrill={setSelectedDrill}
        />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <CertificationsList certifications={certificationStatus} />
          <AvailableDrillsList drills={getAvailableDrills()} onSelectDrill={setSelectedDrill} />
        </div>
        <RecentAttemptsList attempts={recentAttempts} drills={RECERTIFICATION_DRILLS} />
        <SkillDecayInfo />
      </div>
    </div>
  );
}
