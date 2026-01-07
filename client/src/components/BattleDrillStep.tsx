import React from 'react';
import type { DrillStep, ValidationResult } from '../types';
import { StepNumber, ValidationCriteria, HintButton, StepInput, ValidationFeedback, HintsPanel } from './battle-drill/BattleDrillStepComponents';

interface BattleDrillStepProps {
  step: DrillStep;
  index: number;
  isCompleted: boolean;
  hintsVisible: boolean;
  input: string;
  validationResult?: ValidationResult;
  validating: boolean;
  onInputChange: (value: string) => void;
  onValidate: () => void;
  onComplete: () => void;
  onShowHint: () => void;
}

export const BattleDrillStep: React.FC<BattleDrillStepProps> = ({
  step, index, isCompleted, hintsVisible, input, validationResult, validating, onInputChange, onValidate, onComplete, onShowHint
}) => {
  return (
    <div className={`bg-slate-800 rounded-lg border-2 p-5 transition-all ${isCompleted ? 'border-green-500' : 'border-slate-700'}`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-start gap-3 flex-1">
          <StepNumber index={index} isCompleted={isCompleted} />
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">{step.description}</h3>
            <ValidationCriteria criteria={step.validationCriteria} validationResult={validationResult} />
          </div>
        </div>
        <div className="flex gap-2 ml-4">
          {!hintsVisible && !isCompleted && step.hints.length > 0 && <HintButton onClick={onShowHint} />}
        </div>
      </div>
      {!isCompleted && (
        <>
          <StepInput input={input} validating={validating} onInputChange={onInputChange} onValidate={onValidate} onComplete={onComplete} />
          {validationResult && <div className="mt-3"><ValidationFeedback result={validationResult} /></div>}
        </>
      )}
      {hintsVisible && <HintsPanel hints={step.hints} />}
    </div>
  );
};
