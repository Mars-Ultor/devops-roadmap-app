/**
 * AARHistory - Display past After Action Reviews
 */

import { useEffect, useState, type FC } from 'react';
import { BookOpen, Calendar, ChevronDown, ChevronUp } from 'lucide-react';
import type { AAR } from '../../types/training';

interface AARHistoryProps {
  contentId: string;
  contentType: 'lesson' | 'lab' | 'drill';
  getAARs: (contentId: string, contentType: 'lesson' | 'lab' | 'drill') => Promise<AAR[]>;
}

interface AARCardProps {
  aar: AAR;
  isExpanded: boolean;
  onToggle: () => void;
}

const AARSection: FC<{ title: string; color: string; items: string[] }> = ({ title, color, items }) => (
  <div>
    <h4 className={`text-sm font-semibold text-${color}-400 mb-1`}>{title}</h4>
    <ul className="text-slate-300 text-sm space-y-1 ml-4 list-disc">
      {items.map((item) => <li key={item}>{item}</li>)}
    </ul>
  </div>
);

const AARCard: FC<AARCardProps> = ({ aar, isExpanded, onToggle }) => (
  <div className="bg-slate-900 rounded-lg border border-slate-700 overflow-hidden">
    <button onClick={onToggle} className="w-full p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
      <div className="flex items-center gap-3">
        <Calendar className="w-4 h-4 text-slate-400" />
        <span className="text-white font-medium">
          {new Date(aar.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
    </button>
    {isExpanded && (
      <div className="p-4 border-t border-slate-700 space-y-4">
        <div><h4 className="text-sm font-semibold text-indigo-400 mb-1">Objective</h4><p className="text-slate-300 text-sm">{aar.objective}</p></div>
        <AARSection title="What Worked" color="green" items={aar.whatWorked} />
        <AARSection title="What Didn't Work" color="red" items={aar.whatDidntWork} />
        <AARSection title="Root Causes" color="amber" items={aar.rootCauses} />
        <AARSection title="Improvements for Next Time" color="blue" items={aar.improvements} />
        <div><h4 className="text-sm font-semibold text-purple-400 mb-1">Transferable Knowledge</h4><p className="text-slate-300 text-sm">{aar.transferableKnowledge}</p></div>
      </div>
    )}
  </div>
);

export default function AARHistory({ contentId, contentType, getAARs }: AARHistoryProps) {
  const [aars, setAARs] = useState<AAR[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    async function loadAARs() {
      setLoading(true);
      try { setAARs(await getAARs(contentId, contentType)); } 
      catch (error) { console.error('Error loading AARs:', error); } 
      finally { setLoading(false); }
    }
    loadAARs();
  }, [contentId, contentType, getAARs]);

  if (loading) return <div className="bg-slate-800 rounded-lg border border-slate-700 p-6"><p className="text-slate-400 text-center">Loading past AARs...</p></div>;
  if (aars.length === 0) return null;

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 p-6">
      <div className="flex items-center gap-3 mb-4">
        <BookOpen className="w-5 h-5 text-indigo-400" />
        <h3 className="text-lg font-bold text-white">Past After Action Reviews ({aars.length})</h3>
      </div>
      <div className="space-y-3">
        {aars.map((aar) => (
          <AARCard key={aar.id} aar={aar} isExpanded={expandedId === aar.id} onToggle={() => setExpandedId(expandedId === aar.id ? null : aar.id)} />
        ))}
      </div>
    </div>
  );
}
