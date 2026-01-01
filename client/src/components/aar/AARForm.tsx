/**
 * After Action Review (AAR) Form Component
 * Mandatory structured reflection after every lab completion
 */

import { useState, useEffect } from 'react';
import { Save, X, CheckCircle, AlertCircle, BookOpen, Target, AlertTriangle } from 'lucide-react';
import { aarService } from '../../services/aarService';
import type { AARFormData, AARValidationResult } from '../../types/aar';

interface AARFormProps {
  userId: string;
  lessonId: string;
  level: 'crawl' | 'walk' | 'run-guided' | 'run-independent';
  labId: string;
  onComplete: (aarId: string) => void;
  onCancel?: () => void;
}

export default function AARForm({ userId, lessonId, level, labId, onComplete, onCancel }: AARFormProps) {
  const [formData, setFormData] = useState<AARFormData>({
    whatWasAccomplished: '',
    whatWorkedWell: [''],
    whatDidNotWork: [''],
    whyDidNotWork: '',
    whatWouldIDoDifferently: '',
    whatDidILearn: ''
  });

  const [validation, setValidation] = useState<AARValidationResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showValidation, setShowValidation] = useState(false);

  // Auto-validate on form changes
  useEffect(() => {
    const result = aarService.validateAARForm(formData);
    setValidation(result);
  }, [formData]);

  const handleTextChange = (field: 'whatWasAccomplished' | 'whyDidNotWork' | 'whatWouldIDoDifferently' | 'whatDidILearn', value: string) => {
    setFormData((prev: AARFormData) => ({ ...prev, [field]: value }));
  };

  const handleListItemChange = (field: 'whatWorkedWell' | 'whatDidNotWork', index: number, value: string) => {
    setFormData((prev: AARFormData) => ({
      ...prev,
      [field]: prev[field].map((item: string, i: number) => i === index ? value : item)
    }));
  };

  const addListItem = (field: 'whatWorkedWell' | 'whatDidNotWork') => {
    setFormData((prev: AARFormData) => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeListItem = (field: 'whatWorkedWell' | 'whatDidNotWork', index: number) => {
    if (formData[field].length > 1) {
      setFormData((prev: AARFormData) => ({
        ...prev,
        [field]: prev[field].filter((_: string, i: number) => i !== index)
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setShowValidation(true);

    if (!validation?.isValid) {
      return;
    }

    setIsSubmitting(true);
    try {
      const aar = await aarService.createAAR(userId, lessonId, level, labId, formData);
      onComplete(aar.id);
    } catch (error) {
      console.error('Failed to create AAR:', error);
      alert('Failed to save AAR. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getWordCount = (text: string) => text.trim().split(/\s+/).filter(word => word.length > 0).length;

  const renderTextField = (
    field: 'whatWasAccomplished' | 'whyDidNotWork' | 'whatWouldIDoDifferently' | 'whatDidILearn',
    label: string,
    placeholder: string,
    minWords: number,
    required: boolean = true,
    rows: number = 3
  ) => {
    const value = formData[field] as string;
    const wordCount = getWordCount(value);
    const hasError = showValidation && validation?.errors[field];
    const isValid = wordCount >= minWords;

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {label} {required && <span className="text-red-400">*</span>}
          <span className="ml-2 text-xs text-gray-500">
            (Min {minWords} words - Current: {wordCount})
          </span>
        </label>
        <textarea
          value={value}
          onChange={(e) => handleTextChange(field, e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className={`w-full px-3 py-2 bg-slate-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
            hasError ? 'border-red-500' : isValid ? 'border-green-500' : 'border-slate-600'
          }`}
        />
        {hasError && (
          <p className="text-sm text-red-400 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {validation.errors[field]}
          </p>
        )}
        {isValid && (
          <p className="text-sm text-green-400 flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            Meets minimum requirements
          </p>
        )}
      </div>
    );
  };

  const renderListField = (
    field: 'whatWorkedWell' | 'whatDidNotWork',
    label: string,
    placeholder: string,
    minItems: number
  ) => {
    const items = formData[field];
    const hasError = showValidation && validation?.errors[field];
    const isValid = items.length >= minItems && items.every(item => item.trim().length > 0);

    return (
      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-300">
          {label} <span className="text-red-400">*</span>
          <span className="ml-2 text-xs text-gray-500">
            (Min {minItems} items - Current: {items.length})
          </span>
        </label>
        {items.map((item: string, index: number) => (
          <div key={index} className="flex items-center space-x-2">
            <input
              type="text"
              value={item}
              onChange={(e) => handleListItemChange(field, index, e.target.value)}
              placeholder={`${placeholder} ${index + 1}`}
              className={`flex-1 px-3 py-2 bg-slate-700 border rounded-md text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                hasError && !item.trim() ? 'border-red-500' : 'border-slate-600'
              }`}
            />
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => removeListItem(field, index)}
                className="p-2 text-red-400 hover:text-red-300"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addListItem(field)}
          className="text-indigo-400 hover:text-indigo-300 text-sm"
        >
          + Add another item
        </button>
        {hasError && (
          <p className="text-sm text-red-400 flex items-center">
            <AlertCircle className="w-4 h-4 mr-1" />
            {validation.errors[field]}
          </p>
        )}
        {isValid && (
          <p className="text-sm text-green-400 flex items-center">
            <CheckCircle className="w-4 h-4 mr-1" />
            Meets minimum requirements
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-slate-800 rounded-lg shadow-xl">
        <div className="p-6 border-b border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-white flex items-center">
                <BookOpen className="w-6 h-6 mr-2 text-indigo-400" />
                After Action Review (AAR)
              </h2>
              <p className="text-gray-400 mt-1">
                Complete this mandatory reflection to finish your lab and unlock the next lesson.
              </p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-400">Lesson {lessonId}</div>
              <div className="text-sm text-indigo-400 capitalize">{level} Level</div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-8">
          {/* What was I trying to accomplish? */}
          {renderTextField(
            'whatWasAccomplished',
            '1. What was I trying to accomplish?',
            'Describe the objective of this lab in 2-3 sentences. What was the expected outcome?',
            20,
            true,
            4
          )}

          {/* What worked well? */}
          {renderListField(
            'whatWorkedWell',
            '2. What worked well?',
            'Specific thing that went well',
            3
          )}

          {/* What didn't work? */}
          {renderListField(
            'whatDidNotWork',
            '3. What didn\'t work?',
            'Specific problem or struggle encountered',
            2
          )}

          {/* Why didn't it work? */}
          {renderTextField(
            'whyDidNotWork',
            '4. Why didn\'t it work?',
            'Analyze the root causes, not just symptoms. What was the underlying reason for the failures?',
            15,
            true,
            4
          )}

          {/* What would I do differently? */}
          {renderTextField(
            'whatWouldIDoDifferently',
            '5. What would I do differently next time?',
            'Specific changes to your approach, process, or preparation that would improve outcomes.',
            15,
            true,
            4
          )}

          {/* What did I learn? */}
          {renderTextField(
            'whatDidILearn',
            '6. What did I learn that I can use in future tasks?',
            'Transferable knowledge or skills that apply beyond this specific lab.',
            15,
            true,
            4
          )}

          {/* Form validation summary */}
          {showValidation && validation && (
            <div className={`p-4 rounded-md ${validation.isValid ? 'bg-green-900/50 border border-green-700' : 'bg-red-900/50 border border-red-700'}`}>
              <div className="flex items-center">
                {validation.isValid ? (
                  <CheckCircle className="w-5 h-5 text-green-400 mr-2" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-red-400 mr-2" />
                )}
                <span className={`font-medium ${validation.isValid ? 'text-green-400' : 'text-red-400'}`}>
                  {validation.isValid ? 'Ready to submit!' : 'Please complete all required fields'}
                </span>
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex justify-between pt-6 border-t border-slate-700">
            <div className="flex items-center text-sm text-gray-400">
              <Target className="w-4 h-4 mr-1" />
              AAR completion required to proceed
            </div>
            <div className="flex space-x-3">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="px-4 py-2 text-gray-400 hover:text-white border border-slate-600 rounded-md hover:border-slate-500"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={isSubmitting || !validation?.isValid}
                className="px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Complete AAR
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}