/**
 * TCS Header - Refactored
 * Header component for Terminal Command Simulation
 */

import React from 'react';
import { Terminal, Clock, Target, CheckCircle } from 'lucide-react';

interface TCSHeaderProps {
  title: string;
  description?: string;
  timeRemaining?: number;
  completedTasks: number;
  totalTasks: number;
  onReset?: () => void;
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

export default function TCSHeader({ title, description, timeRemaining, completedTasks, totalTasks, onReset }: TCSHeaderProps) {
  const progress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  const isComplete = completedTasks === totalTasks && totalTasks > 0;

  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isComplete ? 'bg-green-600' : 'bg-indigo-600'}`}>
            {isComplete ? <CheckCircle className="w-6 h-6 text-white" /> : <Terminal className="w-6 h-6 text-white" />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">{title}</h2>
            {description && <p className="text-sm text-slate-400">{description}</p>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          {timeRemaining !== undefined && (
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg ${timeRemaining < 60 ? 'bg-red-900/30 text-red-400' : timeRemaining < 300 ? 'bg-yellow-900/30 text-yellow-400' : 'bg-slate-700 text-slate-300'}`}>
              <Clock className="w-4 h-4" />
              <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
            </div>
          )}
          {onReset && (
            <button onClick={onReset} className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-sm">Reset</button>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Target className="w-4 h-4 text-slate-400" />
        <div className="flex-1 bg-slate-700 rounded-full h-2">
          <div className={`h-2 rounded-full transition-all duration-300 ${isComplete ? 'bg-green-500' : 'bg-indigo-500'}`} style={{ width: `${progress}%` }} />
        </div>
        <span className="text-sm text-slate-400">{completedTasks}/{totalTasks}</span>
      </div>
    </div>
  );
}
