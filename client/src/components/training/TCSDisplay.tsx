/**
 * TCS (Task, Conditions, Standards) Display Component
 * Phase 11: Military-style task definition for every lab
 * 
 * Displays:
 * - TASK: What you will accomplish
 * - CONDITIONS: Resources, time limits, restrictions
 * - STANDARDS: Pass/fail criteria checklist
 */

import { Target, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export interface TCSTask {
  task: string;
  conditions: {
    timeLimit?: number; // minutes
    resources: string[];
    restrictions: string[];
    environment: string;
  };
  standards: {
    id: string;
    description: string;
    required: boolean;
    met?: boolean;
  }[];
}

interface TCSDisplayProps {
  tcs: TCSTask;
  onStandardCheck?: (standardId: string, met: boolean) => void;
  readOnly?: boolean;
}

export default function TCSDisplay({ tcs, onStandardCheck, readOnly = false }: TCSDisplayProps) {
  const allRequiredMet = tcs.standards
    .filter(s => s.required)
    .every(s => s.met === true);

  const getStandardStatus = (standard: typeof tcs.standards[0]) => {
    if (standard.met === true) return 'met';
    if (standard.met === false) return 'failed';
    return 'pending';
  };

  return (
    <div className="bg-slate-800 rounded-lg border-2 border-indigo-500 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-4 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-indigo-900/50 flex items-center justify-center">
            <Target className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Task, Conditions, Standards (TCS)</h3>
            <p className="text-indigo-300 text-sm">Military-style task definition</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* TASK */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded bg-blue-900/50 flex items-center justify-center">
              <span className="text-blue-300 font-bold text-sm">T</span>
            </div>
            <h4 className="text-lg font-semibold text-blue-300">TASK</h4>
          </div>
          <div className="bg-slate-900/50 border-l-4 border-blue-500 rounded-r-lg p-4">
            <p className="text-white text-base leading-relaxed">{tcs.task}</p>
          </div>
        </div>

        {/* CONDITIONS */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded bg-yellow-900/50 flex items-center justify-center">
              <span className="text-yellow-300 font-bold text-sm">C</span>
            </div>
            <h4 className="text-lg font-semibold text-yellow-300">CONDITIONS</h4>
          </div>
          <div className="bg-slate-900/50 border-l-4 border-yellow-500 rounded-r-lg p-4 space-y-4">
            {/* Time Limit */}
            {tcs.conditions.timeLimit && (
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm font-semibold text-yellow-300">Time Limit</span>
                </div>
                <p className="text-white ml-6">{tcs.conditions.timeLimit} minutes</p>
              </div>
            )}

            {/* Environment */}
            <div>
              <p className="text-sm font-semibold text-yellow-300 mb-2">Environment</p>
              <p className="text-white">{tcs.conditions.environment}</p>
            </div>

            {/* Resources */}
            <div>
              <p className="text-sm font-semibold text-yellow-300 mb-2">Available Resources</p>
              <ul className="space-y-1">
                {tcs.conditions.resources.map((resource, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-white">
                    <span className="text-green-400 mt-1">✓</span>
                    <span>{resource}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Restrictions */}
            {tcs.conditions.restrictions.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-yellow-300 mb-2">Restrictions</p>
                <ul className="space-y-1">
                  {tcs.conditions.restrictions.map((restriction, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-white">
                      <span className="text-red-400 mt-1">✗</span>
                      <span>{restriction}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* STANDARDS */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-green-900/50 flex items-center justify-center">
                <span className="text-green-300 font-bold text-sm">S</span>
              </div>
              <h4 className="text-lg font-semibold text-green-300">STANDARDS</h4>
            </div>
            {allRequiredMet ? (
              <div className="flex items-center gap-2 px-3 py-1 bg-green-900/30 border border-green-600 rounded-full">
                <CheckCircle className="w-4 h-4 text-green-400" />
                <span className="text-sm font-semibold text-green-400">All Standards Met</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-1 bg-slate-700 border border-slate-600 rounded-full">
                <AlertCircle className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-400">
                  {tcs.standards.filter(s => s.met).length}/{tcs.standards.filter(s => s.required).length} Required
                </span>
              </div>
            )}
          </div>
          
          <div className="bg-slate-900/50 border-l-4 border-green-500 rounded-r-lg p-4">
            <p className="text-sm text-green-300 mb-4 italic">
              All required standards must be met. This is pass/fail - no partial credit.
            </p>
            
            <div className="space-y-3">
              {tcs.standards.map((standard) => {
                const status = getStandardStatus(standard);
                
                return (
                  <div
                    key={standard.id}
                    className={`flex items-start gap-3 p-3 rounded-lg border-2 transition-all ${
                      status === 'met'
                        ? 'bg-green-900/20 border-green-600'
                        : status === 'failed'
                        ? 'bg-red-900/20 border-red-600'
                        : 'bg-slate-800 border-slate-600'
                    }`}
                  >
                    {!readOnly && onStandardCheck ? (
                      <button
                        onClick={() => onStandardCheck(standard.id, !standard.met)}
                        className="mt-0.5 focus:outline-none"
                      >
                        {status === 'met' ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : status === 'failed' ? (
                          <XCircle className="w-6 h-6 text-red-400" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-slate-500 hover:border-indigo-400 transition-colors" />
                        )}
                      </button>
                    ) : (
                      <div className="mt-0.5">
                        {status === 'met' ? (
                          <CheckCircle className="w-6 h-6 text-green-400" />
                        ) : status === 'failed' ? (
                          <XCircle className="w-6 h-6 text-red-400" />
                        ) : (
                          <div className="w-6 h-6 rounded-full border-2 border-slate-500" />
                        )}
                      </div>
                    )}
                    
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={`font-medium ${
                          status === 'met' ? 'text-green-300' :
                          status === 'failed' ? 'text-red-300' :
                          'text-white'
                        }`}>
                          {standard.description}
                        </p>
                        {standard.required && (
                          <span className="px-2 py-0.5 bg-red-900/30 border border-red-600 rounded text-xs text-red-300 whitespace-nowrap">
                            REQUIRED
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pass/Fail Summary */}
            <div className={`mt-4 p-4 rounded-lg border-2 ${
              allRequiredMet
                ? 'bg-green-900/30 border-green-600'
                : 'bg-slate-800 border-slate-600'
            }`}>
              <p className={`text-sm font-semibold ${
                allRequiredMet ? 'text-green-300' : 'text-slate-300'
              }`}>
                {allRequiredMet
                  ? '✅ PASS: All required standards met. Task complete.'
                  : '⏳ IN PROGRESS: Complete all required standards to pass.'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
