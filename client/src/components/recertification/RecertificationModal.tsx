/* eslint-disable max-lines-per-function */
/**
 * Recertification Modal
 * Monthly skill re-testing with all battle drills
 */

import { type FC, useState } from 'react';
import { X, AlertTriangle, CheckCircle, XCircle, Shield } from 'lucide-react';
import type { SkillDecayAlert } from '../../hooks/useRecertification';

interface RecertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  skillDecayAlerts: SkillDecayAlert[];
  onComplete: (results: Record<string, boolean>) => void;
}

const RECERTIFICATION_DRILLS = [
  { id: 'docker-basics', name: 'Docker Basics', category: 'docker', timeLimit: 180 },
  { id: 'docker-networking', name: 'Docker Networking', category: 'docker', timeLimit: 180 },
  { id: 'k8s-deployment', name: 'Kubernetes Deployment', category: 'kubernetes', timeLimit: 240 },
  { id: 'k8s-troubleshooting', name: 'Kubernetes Troubleshooting', category: 'kubernetes', timeLimit: 240 },
  { id: 'cicd-pipeline', name: 'CI/CD Pipeline', category: 'cicd', timeLimit: 300 },
  { id: 'network-config', name: 'Network Configuration', category: 'networking', timeLimit: 180 },
  { id: 'scripting-automation', name: 'Shell Scripting', category: 'scripting', timeLimit: 240 },
  { id: 'incident-response', name: 'Incident Response', category: 'general', timeLimit: 300 }
];

export const RecertificationModal: FC<RecertificationModalProps> = ({
  isOpen,
  onClose,
  skillDecayAlerts,
  onComplete
}) => {
  const [currentDrillIndex, setCurrentDrillIndex] = useState(0);
  const [drillResults, setDrillResults] = useState<Record<string, boolean>>({});
  const [isTestingMode, setIsTestingMode] = useState(false);

  if (!isOpen) return null;

  const currentDrill = RECERTIFICATION_DRILLS[currentDrillIndex];
  const totalDrills = RECERTIFICATION_DRILLS.length;
  const completedDrills = Object.keys(drillResults).length;
  const passedDrills = Object.values(drillResults).filter(Boolean).length;

  const handleDrillResult = (passed: boolean) => {
    setDrillResults(prev => ({
      ...prev,
      [currentDrill.id]: passed
    }));

    if (currentDrillIndex < totalDrills - 1) {
      setCurrentDrillIndex(prev => prev + 1);
    } else {
      // All drills complete
      onComplete({
        ...drillResults,
        [currentDrill.id]: passed
      });
    }
  };

  const formatDate = (date: Date) => {
    const days = Math.ceil((Date.now() - date.getTime()) / (1000 * 60 * 60 * 24));
    return `${days} days ago`;
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-red-900/50 to-slate-800 border-b border-red-500/50 p-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <Shield className="w-8 h-8 text-red-400" />
                <div>
                  <h2 className="text-3xl font-bold text-white">Recertification Required</h2>
                  <p className="text-slate-300 text-sm mt-1">Monthly skill verification - All drills must pass</p>
                </div>
              </div>
            </div>
            {isTestingMode ? null : (
              <button
                onClick={onClose}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            )}
          </div>
        </div>

        {isTestingMode ? (
          <>
            {/* Testing Mode */}
            <div className="p-6 bg-slate-900 border-b border-slate-700">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-sm text-slate-400">Drill {completedDrills + 1} of {totalDrills}</p>
                  <h3 className="text-2xl font-bold text-white">{currentDrill.name}</h3>
                </div>
                <div className="text-right">
                  <p className="text-sm text-slate-400">Time Limit</p>
                  <p className="text-2xl font-bold text-amber-400">{currentDrill.timeLimit / 60} min</p>
                </div>
              </div>
              <div className="w-full bg-slate-700 rounded-full h-2">
                <div 
                  className="bg-emerald-500 h-2 rounded-full transition-all"
                  style={{ width: `${(completedDrills / totalDrills) * 100}%` }}
                />
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="bg-blue-900/20 border border-blue-500/50 rounded-lg p-6">
                <h4 className="text-white font-semibold mb-3">Drill Instructions</h4>
                <p className="text-blue-200 mb-4">
                  Complete the {currentDrill.name} drill within {currentDrill.timeLimit / 60} minutes.
                  You must achieve 100% accuracy to pass this drill.
                </p>
                <p className="text-sm text-slate-400">
                  Navigate to <strong className="text-white">Battle Drills</strong> → <strong className="text-white">{currentDrill.name}</strong> to begin.
                  Return here when complete.
                </p>
              </div>

              {/* Results Summary */}
              {completedDrills > 0 && (
                <div>
                  <h4 className="text-white font-semibold mb-3">Progress: {passedDrills}/{completedDrills} passed</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(drillResults).map(([drillId, passed]) => {
                      const drill = RECERTIFICATION_DRILLS.find(d => d.id === drillId);
                      return (
                        <div key={drillId} className={`rounded-lg p-2 text-sm flex items-center gap-2 ${
                          passed ? 'bg-emerald-900/30 text-emerald-300' : 'bg-red-900/30 text-red-300'
                        }`}>
                          {passed ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                          {drill?.name}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Testing Mode Footer */}
            <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-6 flex gap-3">
              <button
                onClick={() => handleDrillResult(false)}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Failed ✗
              </button>
              <button
                onClick={() => handleDrillResult(true)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg font-semibold"
              >
                Passed ✓
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Skill Decay Alerts */}
            {skillDecayAlerts.length > 0 && (
              <div className="p-6 bg-red-900/20 border-b border-red-500/30">
                <h3 className="text-xl font-bold text-red-300 mb-4 flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6" />
                  Skill Decay Detected
                </h3>
                <div className="space-y-3">
                  {skillDecayAlerts.map((alert) => (
                    <div key={alert.skill} className="bg-slate-900 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="text-white font-semibold">{alert.skill}</h4>
                          <p className="text-sm text-slate-400">Last practiced: {formatDate(alert.lastPracticed)}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          alert.decayPercentage > 40 ? 'bg-red-900/50 text-red-300' : 'bg-amber-900/50 text-amber-300'
                        }`}>
                          {alert.decayPercentage}% decay
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Historical: </span>
                          <span className="text-emerald-300 font-semibold">{alert.historicalPerformance}%</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Recent: </span>
                          <span className="text-red-300 font-semibold">{alert.recentPerformance}%</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recertification Info */}
            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-xl font-bold text-white mb-3">Why Recertification?</h3>
                <div className="bg-slate-900 rounded-lg p-4 space-y-2 text-slate-300">
                  <p>• Skills degrade without practice - "use it or lose it"</p>
                  <p>• Monthly verification ensures you maintain job-ready competency</p>
                  <p>• Real DevOps roles require consistent performance under pressure</p>
                  <p>• You must pass ALL {totalDrills} drills to recertify</p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-bold text-white mb-3">Recertification Drills ({totalDrills} total)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {RECERTIFICATION_DRILLS.map((drill) => (
                    <div key={drill.id} className="bg-slate-900 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-white font-medium">{drill.name}</p>
                          <p className="text-sm text-slate-400">{drill.timeLimit / 60} minute limit</p>
                        </div>
                        {drillResults[drill.id] !== undefined && (
                          drillResults[drill.id] ? (
                            <CheckCircle className="w-5 h-5 text-emerald-400" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-400" />
                          )
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-amber-900/20 border border-amber-500/50 rounded-lg p-4">
                <p className="text-amber-200 text-sm">
                  <strong>Warning:</strong> You cannot access new content until recertification is complete.
                  Failed drills must be retaken immediately.
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="sticky bottom-0 bg-slate-800 border-t border-slate-700 p-6">
              <button
                onClick={() => setIsTestingMode(true)}
                className="w-full bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg font-bold text-lg"
              >
                Begin Recertification ({totalDrills} Drills)
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
