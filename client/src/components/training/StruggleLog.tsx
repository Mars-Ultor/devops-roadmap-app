/**
 * StruggleLog - Mandatory documentation before accessing hints
 * Forces reflection on what's been tried and where user is stuck
 */

import { useState } from 'react';
import { FileText, CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

export interface StruggleEntry {
  timestamp: Date;
  whatTried: string[];
  whereStuck: string;
  suspectedProblem: string;
  hintsUsed: number;
}

interface StruggleLogProps {
  onSubmit: (entry: StruggleEntry) => void;
  isOpen: boolean;
  onCancel?: () => void;
}

export default function StruggleLog({ onSubmit, isOpen, onCancel }: StruggleLogProps) {
  const [whatTried, setWhatTried] = useState<string[]>(['', '', '']);
  const [whereStuck, setWhereStuck] = useState('');
  const [suspectedProblem, setSuspectedProblem] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  if (!isOpen) return null;

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    // Validate whatTried (minimum 3 non-empty entries)
    const validTries = whatTried.filter(t => t.trim().length > 0);
    if (validTries.length < 3) {
      newErrors.push('You must document at least 3 things you\'ve tried');
    }

    // Validate whereStuck
    if (whereStuck.trim().length < 20) {
      newErrors.push('Please describe specifically where you\'re stuck (minimum 20 characters)');
    }

    // Validate suspectedProblem
    if (suspectedProblem.trim().length < 15) {
      newErrors.push('Please describe what you think the problem might be (minimum 15 characters)');
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const entry: StruggleEntry = {
      timestamp: new Date(),
      whatTried: whatTried.filter(t => t.trim().length > 0),
      whereStuck: whereStuck.trim(),
      suspectedProblem: suspectedProblem.trim(),
      hintsUsed: 0
    };

    onSubmit(entry);
    
    // Reset form
    setWhatTried(['', '', '']);
    setWhereStuck('');
    setSuspectedProblem('');
    setErrors([]);
  };

  const updateTried = (index: number, value: string) => {
    const updated = [...whatTried];
    updated[index] = value;
    setWhatTried(updated);
  };

  const addMoreTried = () => {
    setWhatTried([...whatTried, '']);
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-xl border-2 border-indigo-500 max-w-3xl w-full shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 to-purple-900 p-6 rounded-t-xl sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-500 rounded-full flex items-center justify-center">
              <FileText className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white">Struggle Log</h2>
              <p className="text-indigo-200 text-sm mt-1">
                Document your troubleshooting before accessing hints
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Why This Matters */}
          <div className="bg-blue-900/20 rounded-lg p-4 border border-blue-700">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-blue-400 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="text-blue-300 font-semibold mb-1">Why log your struggle?</p>
                <ul className="text-blue-200/80 space-y-1 ml-4 list-disc">
                  <li>Forces systematic troubleshooting instead of random guessing</li>
                  <li>Builds your personal debugging methodology</li>
                  <li>Creates a reference for similar future problems</li>
                  <li>Prevents hint dependency - you've earned the help</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Errors */}
          {errors.length > 0 && (
            <div className="bg-red-900/20 rounded-lg p-4 border border-red-700">
              <div className="flex items-start gap-2">
                <XCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-red-300 font-semibold mb-2">Please complete all fields:</p>
                  <ul className="text-sm text-red-200/80 space-y-1">
                    {errors.map((error, idx) => (
                      <li key={idx}>• {error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* What Have You Tried? */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              What have you tried? <span className="text-red-400">*</span>
              <span className="text-slate-500 text-xs ml-2">(minimum 3 things)</span>
            </label>
            <div className="space-y-2">
              {whatTried.map((tried, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-700 flex items-center justify-center text-xs text-slate-300 mt-2 flex-shrink-0">
                    {idx + 1}
                  </div>
                  <textarea
                    value={tried}
                    onChange={(e) => updateTried(idx, e.target.value)}
                    placeholder={`e.g., ${
                      idx === 0 ? 'Checked pod logs with kubectl logs' :
                      idx === 1 ? 'Verified service selector matches pod labels' :
                      'Tested connectivity with curl from another pod'
                    }`}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none h-20"
                  />
                  {tried.trim().length > 0 && (
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-2 flex-shrink-0" />
                  )}
                </div>
              ))}
            </div>
            <button
              onClick={addMoreTried}
              className="mt-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              + Add another attempt
            </button>
          </div>

          {/* Where Specifically Are You Stuck? */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              Where specifically are you stuck? <span className="text-red-400">*</span>
            </label>
            <textarea
              value={whereStuck}
              onChange={(e) => setWhereStuck(e.target.value)}
              placeholder="e.g., I can deploy the pod but the service isn't routing traffic to it. When I curl the service ClusterIP, I get connection refused. The pod is running and healthy according to kubectl get pods."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none h-32"
            />
            <div className="text-xs text-slate-500 mt-1">
              {whereStuck.length}/20 characters minimum
            </div>
          </div>

          {/* What Do You Think The Problem Is? */}
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-2">
              What do you think the problem might be? <span className="text-red-400">*</span>
            </label>
            <textarea
              value={suspectedProblem}
              onChange={(e) => setSuspectedProblem(e.target.value)}
              placeholder="e.g., I suspect the service selector might not match the pod labels, or maybe the target port is wrong in the service definition. Could also be a network policy blocking traffic."
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 resize-none h-24"
            />
            <div className="text-xs text-slate-500 mt-1">
              {suspectedProblem.length}/15 characters minimum
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-700">
            {onCancel && (
              <button
                onClick={onCancel}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            )}
            <button
              onClick={handleSubmit}
              className="ml-auto px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-lg transition-colors flex items-center gap-2"
            >
              <FileText className="w-5 h-5" />
              Submit & Unlock Hints
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
