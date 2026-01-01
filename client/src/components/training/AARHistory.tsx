/**
 * AARHistory - Display past After Action Reviews
 */

import { useEffect, useState } from 'react';
import { BookOpen, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import type { AAR } from '../../types/training';

interface AARHistoryProps {
  contentId: string;
  contentType: 'lesson' | 'lab' | 'drill';
  getAARs: (contentId: string, contentType: 'lesson' | 'lab' | 'drill') => Promise<AAR[]>;
}

export default function AARHistory({ contentId, contentType, getAARs }: AARHistoryProps) {
  const [aars, setAARs] = useState<AAR[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadAARs() {
      setLoading(true);
      try {
        const data = await getAARs(contentId, contentType);
        setAARs(data);
      } catch (error) {
        console.error('Error loading AARs:', error);
      } finally {
        setLoading(false);
      }
    }

    loadAARs();
  }, [contentId, contentType, getAARs]);

  if (loading) {
    return (
      <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
        <p className="text-slate-400 text-center">Loading past AARs...</p>
      </div>
    );
  }

  if (aars.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-bold text-white">Past After Action Reviews ({aars.length})</h3>
      </div>

      <div className="space-y-3">
        {aars.map((aar) => {
          const isExpanded = expandedId === aar.id;

          return (
            <div
              key={aar.id}
              className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden"
            >
              {/* Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : aar.id)}
                className="w-full p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <Calendar className="w-4 h-4 text-slate-400" />
                  <span className="text-white font-medium">
                    {new Date(aar.createdAt).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
                {isExpanded ? (
                  <ChevronUp className="w-5 h-5 text-slate-400" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-slate-400" />
                )}
              </button>

              {/* Content */}
              {isExpanded && (
                <div className="p-4 border-t border-slate-700 space-y-4">
                  {/* Objective */}
                  <div>
                    <h4 className="text-sm font-semibold text-indigo-400 mb-1">Objective</h4>
                    <p className="text-slate-300 text-sm">{aar.objective}</p>
                  </div>

                  {/* What Worked */}
                  <div>
                    <h4 className="text-sm font-semibold text-green-400 mb-1">What Worked</h4>
                    <ul className="text-slate-300 text-sm space-y-1 ml-4 list-disc">
                      {aar.whatWorked.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* What Didn't Work */}
                  <div>
                    <h4 className="text-sm font-semibold text-red-400 mb-1">What Didn't Work</h4>
                    <ul className="text-slate-300 text-sm space-y-1 ml-4 list-disc">
                      {aar.whatDidntWork.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Root Causes */}
                  <div>
                    <h4 className="text-sm font-semibold text-amber-400 mb-1">Root Causes</h4>
                    <ul className="text-slate-300 text-sm space-y-1 ml-4 list-disc">
                      {aar.rootCauses.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Improvements */}
                  <div>
                    <h4 className="text-sm font-semibold text-blue-400 mb-1">Improvements for Next Time</h4>
                    <ul className="text-slate-300 text-sm space-y-1 ml-4 list-disc">
                      {aar.improvements.map((item, idx) => (
                        <li key={idx}>{item}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Transferable Knowledge */}
                  <div>
                    <h4 className="text-sm font-semibold text-purple-400 mb-1">Transferable Knowledge</h4>
                    <p className="text-slate-300 text-sm">{aar.transferableKnowledge}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
