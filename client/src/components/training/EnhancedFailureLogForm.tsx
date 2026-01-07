/**
 * Enhanced Failure Log Form
 * Phase 9: Mandatory fields, pattern recognition, runbook generation
 * Refactored to use extracted components for ESLint compliance
 */

import { useState, useEffect } from 'react';
import type { FailureLog, FailureCategory, FailureSeverity } from '../../types/training';
import {
  MOCK_PATTERNS,
  generateRunbook,
  wordCount,
  type PatternDetection,
  type ValidationState
} from './EnhancedFailureLogFormUtils';
import {
  FormHeader,
  PatternAlert,
  ContextInfo,
  CategorySeveritySelector,
  WhatTriedSection,
  RootCauseSection,
  RunbookDisplay,
  FormActions,
  TitleField,
  DescriptionField,
  ErrorMessageField
} from './EnhancedFailureLogFormComponents';

interface EnhancedFailureLogFormProps {
  contentId: string;
  contentType: 'lesson' | 'lab' | 'drill' | 'project';
  contentTitle: string;
  onSubmit: (failureData: Omit<FailureLog, 'id' | 'userId' | 'timestamp' | 'isRecurring' | 'previousOccurrences'>) => Promise<void>;
  onCancel?: () => void;
  prefilledError?: string;
}

export default function EnhancedFailureLogForm({
  contentId,
  contentType,
  contentTitle,
  onSubmit,
  onCancel,
  prefilledError
}: EnhancedFailureLogFormProps) {
  const [category, setCategory] = useState<FailureCategory>('other');
  const [severity, setSeverity] = useState<FailureSeverity>('medium');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState(prefilledError || '');
  const [whatTried, setWhatTried] = useState<string[]>(['', '', '']);
  const [rootCause, setRootCause] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [validation, setValidation] = useState<ValidationState>({ whatTried: false, rootCause: false, isValid: false });
  const [patternDetection, setPatternDetection] = useState<PatternDetection | null>(null);
  const [generatedRunbook, setGeneratedRunbook] = useState<string>('');
  const [runbookCopied, setRunbookCopied] = useState(false);

  // Phase 9: Validate mandatory fields
  useEffect(() => {
    const validWhatTried = whatTried.filter(item => item.trim().length > 0).length >= 3;
    const validRootCause = wordCount(rootCause) >= 30;
    setValidation({ whatTried: validWhatTried, rootCause: validRootCause, isValid: validWhatTried && validRootCause && title.trim().length > 0 });
  }, [whatTried, rootCause, title]);

  // Phase 9: Pattern detection
  useEffect(() => {
    if (category !== 'other' && errorMessage.length > 10) {
      setTimeout(() => {
        if (MOCK_PATTERNS[category]) setPatternDetection(MOCK_PATTERNS[category]);
      }, 1000);
    }
  }, [category, errorMessage]);

  // Phase 9: Auto-generate runbook
  useEffect(() => {
    if (validation.isValid && category !== 'other') {
      setGeneratedRunbook(generateRunbook({ title, description, errorMessage, rootCause, whatTried, category, severity }));
    }
  }, [validation.isValid, category, whatTried, rootCause, title, description, errorMessage, severity]);

  const copyRunbook = () => {
    navigator.clipboard.writeText(generatedRunbook);
    setRunbookCopied(true);
    setTimeout(() => setRunbookCopied(false), 2000);
  };

  const handleWhatTriedChange = (index: number, value: string) => {
    const newWhatTried = [...whatTried];
    newWhatTried[index] = value;
    setWhatTried(newWhatTried);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validation.isValid) {
      alert('❌ Please complete all mandatory fields:\n• Title\n• At least 3 "What I Tried" items\n• Root Cause (minimum 30 words)');
      return;
    }
    setSubmitting(true);
    try {
      await onSubmit({
        contentType, contentId, contentTitle, category, severity,
        title: title.trim(),
        description: description.trim(),
        errorMessage: errorMessage.trim() || undefined,
        lessonsLearned: whatTried.filter(item => item.trim().length > 0),
        relatedConcepts: [rootCause.trim()]
      });
    } catch (error) {
      console.error('Error submitting failure log:', error);
      alert('Failed to log failure. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-slate-800 rounded-xl border-2 border-red-500/50 max-w-4xl w-full my-8">
        <FormHeader onCancel={onCancel} />
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {patternDetection && <PatternAlert pattern={patternDetection} />}
          <ContextInfo contentType={contentType} contentTitle={contentTitle} />
          <CategorySeveritySelector category={category} severity={severity} onCategoryChange={setCategory} onSeverityChange={setSeverity} />
          <TitleField value={title} onChange={setTitle} />
          <DescriptionField value={description} onChange={setDescription} />
          <ErrorMessageField value={errorMessage} onChange={setErrorMessage} />
          <WhatTriedSection whatTried={whatTried} validation={validation} onChange={handleWhatTriedChange} onAdd={() => setWhatTried([...whatTried, ''])} />
          <RootCauseSection rootCause={rootCause} wordCount={wordCount(rootCause)} validation={validation} onChange={setRootCause} />
          <RunbookDisplay runbook={generatedRunbook} copied={runbookCopied} onCopy={copyRunbook} />
          <FormActions validation={validation} submitting={submitting} onCancel={onCancel} />
        </form>
      </div>
    </div>
  );
}
