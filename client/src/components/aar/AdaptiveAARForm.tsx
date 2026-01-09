/**
 * Adaptive AAR Form Component
 * Shows different AAR depths based on user's struggle metrics:
 * - Skip: Perfect completion with no struggles - optional quick reflection
 * - Quick: Minor struggles - abbreviated form
 * - Full: Significant struggles - complete detailed AAR
 */

import { useState } from 'react';
import { CheckCircle, Sparkles, AlertTriangle, FileText, Zap, X } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { aarService } from '../../services/aarService';
import type { StruggleMetrics, AARFormType } from '../../types/aar';
import { determineAARType } from '../../types/aar';
import type { AARLevel } from './AARForm';
import AARForm from './AARForm';

interface AdaptiveAARFormProps {
  readonly userId: string;
  readonly lessonId: string;
  readonly level: AARLevel;
  readonly labId: string;
  readonly struggleMetrics: StruggleMetrics;
  readonly onComplete: (aarId: string | null) => void;
  readonly onCancel?: () => void;
}

/** Quick reflection for minor struggles */
interface QuickReflection {
  mainTakeaway: string;
  oneImprovement: string;
}

export default function AdaptiveAARForm({
  userId,
  lessonId,
  level,
  labId,
  struggleMetrics,
  onComplete,
  onCancel
}: Readonly<AdaptiveAARFormProps>) {
  const aarType = determineAARType(struggleMetrics);
  const [selectedType, setSelectedType] = useState<AARFormType | null>(null);
  const [quickReflection, setQuickReflection] = useState<QuickReflection>({
    mainTakeaway: '',
    oneImprovement: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If user chose full AAR or struggle metrics require it, show full form
  if (selectedType === 'full' || (aarType === 'full' && selectedType === null)) {
    return (
      <AARForm
        userId={userId}
        lessonId={lessonId}
        level={level}
        labId={labId}
        onComplete={onComplete}
        onCancel={onCancel}
      />
    );
  }

  // Handle skip submission (minimal data)
  const handleSkip = async () => {
    setIsSubmitting(true);
    try {
      const aarData = {
        userId,
        lessonId,
        level,
        labId,
        completedAt: serverTimestamp(),
        aarType: 'skipped',
        struggleMetrics,
        whatWasAccomplished: 'Perfect completion - no reflection needed',
        whatWorkedWell: ['Completed without issues'],
        whatDidNotWork: [],
        whyDidNotWork: '',
        whatWouldIDoDifferently: '',
        whatDidILearn: '',
        wordCounts: { whatWasAccomplished: 5, whyDidNotWork: 0, whatWouldIDoDifferently: 0, whatDidILearn: 0 },
        aiReview: {
          reviewedAt: new Date().toISOString(),
          reviewer: 'ai',
          score: 10,
          feedback: 'Great job! You completed this level perfectly with no struggles.',
          suggestions: [],
          followUpQuestions: []
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'afterActionReviews'), aarData);
      onComplete(docRef.id);
    } catch (error) {
      console.error('Error saving skipped AAR:', error);
      setIsSubmitting(false);
    }
  };

  // Handle quick reflection submission
  const handleQuickSubmit = async () => {
    if (!quickReflection.mainTakeaway.trim() || !quickReflection.oneImprovement.trim()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const aiReview = aarService.generateAIReview(
        {
          whatWasAccomplished: 'Quick reflection after minor struggles',
          whatWorkedWell: ['Completed the level'],
          whatDidNotWork: ['Minor issues encountered'],
          whyDidNotWork: 'Minor challenges',
          whatWouldIDoDifferently: quickReflection.oneImprovement,
          whatDidILearn: quickReflection.mainTakeaway
        },
        { whatWasAccomplished: 5, whyDidNotWork: 2, whatWouldIDoDifferently: 10, whatDidILearn: 10 }
      );

      const aarData = {
        userId,
        lessonId,
        level,
        labId,
        completedAt: serverTimestamp(),
        aarType: 'quick',
        struggleMetrics,
        whatWasAccomplished: 'Quick reflection after minor struggles',
        whatWorkedWell: ['Completed the level'],
        whatDidNotWork: ['Minor issues encountered'],
        whyDidNotWork: 'Minor challenges',
        whatWouldIDoDifferently: quickReflection.oneImprovement,
        whatDidILearn: quickReflection.mainTakeaway,
        wordCounts: {
          whatWasAccomplished: 5,
          whyDidNotWork: 2,
          whatWouldIDoDifferently: aarService.countWords(quickReflection.oneImprovement),
          whatDidILearn: aarService.countWords(quickReflection.mainTakeaway)
        },
        aiReview: {
          ...aiReview,
          reviewedAt: aiReview.reviewedAt.toISOString()
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, 'afterActionReviews'), aarData);
      onComplete(docRef.id);
    } catch (error) {
      console.error('Error saving quick AAR:', error);
      setIsSubmitting(false);
    }
  };

  // Render struggle summary
  const renderStruggleSummary = () => (
    <div className="bg-slate-700/50 rounded-lg p-4 mb-6">
      <h3 className="text-sm font-medium text-slate-300 mb-3">Your Performance</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
        <div>
          <div className={`text-2xl font-bold ${struggleMetrics.hintsUsed === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
            {struggleMetrics.hintsUsed}
          </div>
          <div className="text-xs text-slate-400">Hints Used</div>
        </div>
        <div>
          <div className={`text-2xl font-bold ${struggleMetrics.validationErrors === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
            {struggleMetrics.validationErrors}
          </div>
          <div className="text-xs text-slate-400">Errors</div>
        </div>
        <div>
          <div className={`text-2xl font-bold ${struggleMetrics.retryCount === 0 ? 'text-green-400' : 'text-yellow-400'}`}>
            {struggleMetrics.retryCount}
          </div>
          <div className="text-xs text-slate-400">Retries</div>
        </div>
        <div>
          <div className="text-2xl font-bold text-blue-400">
            {Math.floor(struggleMetrics.timeSpentSeconds / 60)}m
          </div>
          <div className="text-xs text-slate-400">Time Spent</div>
        </div>
      </div>
    </div>
  );

  // Skip option screen
  if (aarType === 'skip' && selectedType === null) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-slate-800 rounded-lg shadow-xl p-6">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-900/30 rounded-full mb-4">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Perfect Completion! 🎉</h2>
            <p className="text-slate-300">
              You nailed it with no hints, errors, or retries.
            </p>
          </div>

          {renderStruggleSummary()}

          <div className="space-y-3">
            <button
              onClick={handleSkip}
              disabled={isSubmitting}
              className="w-full flex items-center justify-center space-x-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              <Zap className="w-5 h-5" />
              <span>{isSubmitting ? 'Saving...' : 'Skip Reflection & Continue'}</span>
            </button>
            
            <button
              onClick={() => setSelectedType('quick')}
              className="w-full flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-6 rounded-lg transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              <span>Quick Reflection (Optional)</span>
            </button>
            
            <button
              onClick={() => setSelectedType('full')}
              className="w-full flex items-center justify-center space-x-2 bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 font-medium py-2 px-6 rounded-lg transition-colors text-sm"
            >
              <FileText className="w-4 h-4" />
              <span>Full AAR (For Extra Practice)</span>
            </button>
          </div>

          <p className="text-xs text-slate-500 text-center mt-4">
            Since you completed perfectly, detailed reflection isn't required.
          </p>
        </div>
      </div>
    );
  }

  // Quick reflection screen
  if (aarType === 'quick' || selectedType === 'quick') {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-slate-800 rounded-lg shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-900/30 rounded-lg">
                <Sparkles className="w-6 h-6 text-yellow-400" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">Quick Reflection</h2>
                <p className="text-sm text-slate-400">Minor struggles - abbreviated review</p>
              </div>
            </div>
            {selectedType === 'quick' && (
              <button
                onClick={() => setSelectedType(null)}
                className="p-1 hover:bg-slate-700 rounded"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
            )}
          </div>

          {renderStruggleSummary()}

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                What's your main takeaway from this exercise?
              </label>
              <textarea
                value={quickReflection.mainTakeaway}
                onChange={(e) => setQuickReflection(prev => ({ ...prev, mainTakeaway: e.target.value }))}
                placeholder="The key thing I learned or reinforced..."
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">
                One thing you'd do differently?
              </label>
              <textarea
                value={quickReflection.oneImprovement}
                onChange={(e) => setQuickReflection(prev => ({ ...prev, oneImprovement: e.target.value }))}
                placeholder="Next time I would..."
                className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
              />
            </div>

            <div className="flex space-x-3">
              <button
                onClick={handleQuickSubmit}
                disabled={isSubmitting || !quickReflection.mainTakeaway.trim() || !quickReflection.oneImprovement.trim()}
                className="flex-1 flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                <CheckCircle className="w-5 h-5" />
                <span>{isSubmitting ? 'Saving...' : 'Submit Quick Reflection'}</span>
              </button>
              
              <button
                onClick={() => setSelectedType('full')}
                className="flex items-center justify-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white font-medium py-3 px-4 rounded-lg transition-colors"
              >
                <FileText className="w-5 h-5" />
                <span>Full AAR</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Full AAR required screen (for significant struggles)
  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="bg-slate-800 rounded-lg shadow-xl p-6">
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-900/30 rounded-full mb-4">
            <AlertTriangle className="w-10 h-10 text-red-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Reflection Required</h2>
          <p className="text-slate-300">
            You encountered significant struggles. A detailed AAR will help you learn from this experience.
          </p>
        </div>

        {renderStruggleSummary()}

        <button
          onClick={() => setSelectedType('full')}
          className="w-full flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
        >
          <FileText className="w-5 h-5" />
          <span>Start Full AAR</span>
        </button>

        <p className="text-xs text-slate-500 text-center mt-4">
          Deep reflection on struggles is what accelerates mastery.
        </p>
      </div>
    </div>
  );
}
