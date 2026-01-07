/**
 * DailyDrillModal - Blocks access until daily drill is completed
 * Refactored to use extracted components and custom hook
 */

import { useDailyDrill } from './useDailyDrill';
import {
  LoadingState,
  DrillHeader,
  SelectionInfo,
  WhyDailyDrills,
  DrillDisplay,
  DrillFooter
} from './DailyDrillModalComponents';

interface DailyDrillModalProps {
  isOpen: boolean;
  onComplete: () => void;
  canDismiss?: boolean;
}

export default function DailyDrillModal({ isOpen, onComplete, canDismiss = false }: DailyDrillModalProps) {
  const { selectedDrill, drillCandidate, loading } = useDailyDrill(isOpen);

  if (!isOpen) return null;
  if (loading || !selectedDrill) return <LoadingState />;

  const handleStart = () => onComplete();

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl border-2 border-indigo-500 max-w-2xl w-full shadow-2xl">
        <DrillHeader canDismiss={canDismiss} onDismiss={onComplete} />
        <div className="p-6 space-y-6">
          {drillCandidate && <SelectionInfo candidate={drillCandidate} />}
          <WhyDailyDrills />
          <DrillDisplay drill={selectedDrill} />
          <DrillFooter canDismiss={canDismiss} onDismiss={onComplete} onStart={handleStart} />
        </div>
      </div>
    </div>
  );
}
