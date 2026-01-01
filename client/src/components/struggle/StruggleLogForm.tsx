/**
 * StruggleLogForm Component
 * Forces users to document their struggle before accessing hints
 */

import { useState } from 'react';
import { BookOpen, Plus, X, AlertCircle, CheckCircle } from 'lucide-react';
import type { StruggleLog } from '../../types/struggle';
import { STRUGGLE_SESSION_CONFIG } from '../../types/struggle';

interface StruggleLogFormProps {
  onSubmit: (log: Omit<StruggleLog, 'id' | 'timestamp'>) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export default function StruggleLogForm({
  onSubmit,
  onCancel,
  isSubmitting = false
}: StruggleLogFormProps) {
  const [formData, setFormData] = useState<{
    problemDescription: string;
    approachesTried: string[];
    currentStuckPoint: string;
    timeSpentMinutes: number;
    confidenceLevel: 1 | 2 | 3 | 4 | 5;
    learningPoints: string;
  }>({
    problemDescription: '',
    approachesTried: [''],
    currentStuckPoint: '',
    timeSpentMinutes: STRUGGLE_SESSION_CONFIG.MIN_STRUGGLE_TIME_MINUTES,
    confidenceLevel: 1 as const,
    learningPoints: ''
  });

  const [errors, setErrors] = useState<string[]>([]);

  const addApproach = () => {
    setFormData(prev => ({
      ...prev,
      approachesTried: [...prev.approachesTried, '']
    }));
  };

  const removeApproach = (index: number) => {
    if (formData.approachesTried.length > 1) {
      setFormData(prev => ({
        ...prev,
        approachesTried: prev.approachesTried.filter((_, i) => i !== index)
      }));
    }
  };

  const updateApproach = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      approachesTried: prev.approachesTried.map((approach, i) =>
        i === index ? value : approach
      )
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: string[] = [];

    if (!formData.problemDescription.trim()) {
      newErrors.push('Problem description is required');
    }

    const validApproaches = formData.approachesTried.filter(a => a.trim());
    if (validApproaches.length < STRUGGLE_SESSION_CONFIG.MIN_APPROACHES_REQUIRED) {
      newErrors.push(`At least ${STRUGGLE_SESSION_CONFIG.MIN_APPROACHES_REQUIRED} different approaches must be documented`);
    }

    if (!formData.currentStuckPoint.trim()) {
      newErrors.push('Current stuck point must be described');
    }

    if (formData.timeSpentMinutes < STRUGGLE_SESSION_CONFIG.MIN_STRUGGLE_TIME_MINUTES) {
      newErrors.push(`Minimum ${STRUGGLE_SESSION_CONFIG.MIN_STRUGGLE_TIME_MINUTES} minutes of struggle required`);
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    const validApproaches = formData.approachesTried.filter(a => a.trim());

    onSubmit({
      problemDescription: formData.problemDescription.trim(),
      approachesTried: validApproaches,
      currentStuckPoint: formData.currentStuckPoint.trim(),
      timeSpentMinutes: formData.timeSpentMinutes,
      confidenceLevel: formData.confidenceLevel,
      learningPoints: formData.learningPoints.trim() || undefined
    });
  };

  const isFormValid = () => {
    return formData.problemDescription.trim() &&
           formData.approachesTried.filter(a => a.trim()).length >= STRUGGLE_SESSION_CONFIG.MIN_APPROACHES_REQUIRED &&
           formData.currentStuckPoint.trim() &&
           formData.timeSpentMinutes >= STRUGGLE_SESSION_CONFIG.MIN_STRUGGLE_TIME_MINUTES;
  };

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700 max-w-2xl mx-auto">
      <div className="flex items-center space-x-3 mb-6">
        <BookOpen className="w-6 h-6 text-blue-400" />
        <div>
          <h2 className="text-xl font-bold text-white">Document Your Struggle</h2>
          <p className="text-sm text-gray-400">
            Before accessing hints, you must document your genuine problem-solving attempts
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Problem Description */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Problem Description *
          </label>
          <textarea
            value={formData.problemDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, problemDescription: e.target.value }))}
            placeholder="Describe the problem you're trying to solve..."
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            required
          />
        </div>

        {/* Approaches Tried */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-300">
              Approaches Tried * (Minimum {STRUGGLE_SESSION_CONFIG.MIN_APPROACHES_REQUIRED})
            </label>
            <button
              type="button"
              onClick={addApproach}
              className="flex items-center space-x-1 px-2 py-1 bg-slate-700 text-gray-300 rounded text-xs hover:bg-slate-600 transition-colors"
            >
              <Plus className="w-3 h-3" />
              <span>Add Approach</span>
            </button>
          </div>

          <div className="space-y-2">
            {formData.approachesTried.map((approach, index) => (
              <div key={index} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={approach}
                  onChange={(e) => updateApproach(index, e.target.value)}
                  placeholder={`Approach ${index + 1}...`}
                  className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                {formData.approachesTried.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeApproach(index)}
                    className="p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Current Stuck Point */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Where Are You Currently Stuck? *
          </label>
          <textarea
            value={formData.currentStuckPoint}
            onChange={(e) => setFormData(prev => ({ ...prev, currentStuckPoint: e.target.value }))}
            placeholder="Describe exactly where you're stuck and what you don't understand..."
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            required
          />
        </div>

        {/* Time Spent */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Time Spent Struggling (minutes) *
          </label>
          <input
            type="number"
            min={STRUGGLE_SESSION_CONFIG.MIN_STRUGGLE_TIME_MINUTES}
            value={formData.timeSpentMinutes}
            onChange={(e) => setFormData(prev => ({ ...prev, timeSpentMinutes: parseInt(e.target.value) || 0 }))}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Minimum {STRUGGLE_SESSION_CONFIG.MIN_STRUGGLE_TIME_MINUTES} minutes required
          </p>
        </div>

        {/* Confidence Level */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Confidence Level (1-5)
          </label>
          <div className="flex items-center space-x-2">
            <input
              type="range"
              min="1"
              max="5"
              value={formData.confidenceLevel}
              onChange={(e) => setFormData(prev => ({ ...prev, confidenceLevel: parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5 }))}
              className="flex-1"
            />
            <span className="text-white font-mono w-8 text-center">
              {formData.confidenceLevel}
            </span>
          </div>
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>Completely Lost</span>
            <span>Confident</span>
          </div>
        </div>

        {/* Learning Points */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            What Have You Learned So Far? (Optional)
          </label>
          <textarea
            value={formData.learningPoints}
            onChange={(e) => setFormData(prev => ({ ...prev, learningPoints: e.target.value }))}
            placeholder="Any insights or concepts you've discovered..."
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={2}
          />
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-900/50 border border-red-700 rounded-md p-3">
            <div className="flex items-start space-x-2">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
              <div>
                <h4 className="text-sm font-medium text-red-400 mb-1">
                  Please Complete Required Fields:
                </h4>
                <ul className="text-xs text-red-200 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index}>• {error}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Submit Buttons */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-700">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-slate-700 text-gray-300 rounded-md hover:bg-slate-600 transition-colors"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={!isFormValid() || isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-slate-600 disabled:cursor-not-allowed transition-colors flex items-center space-x-2"
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                <span>Submit Struggle Log</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}