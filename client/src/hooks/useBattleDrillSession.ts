/**
 * Battle Drill Session Hook - Refactored
 * Manages drill execution, timing, and validation
 */
import { useAuth } from "../contexts/AuthContext";

export const useBattleDrillSession = (drillId: string | undefined) => {
  const { user } = useAuth();
  const state = useBattleDrillState();

  const {
    drill,
    performance,
    sessionStarted,
    sessionComplete,
    elapsedSeconds,
    completedSteps,
    showHints,
    stepInputs,
    validationResults,
    validatingStep,
    sessionResult,
    showAARForm,
    aarSubmitted,
    submittedAAR,
    showFailureLog,
    coachContext,
    setDrill,
    setPerformance,
    setElapsedSeconds,
    setCoachContext,
  } = state;

  useBattleDrillEffects(drillId, user, { drill, sessionStarted, sessionComplete, completedSteps, showHints, elapsedSeconds }, { setDrill, setPerformance, setElapsedSeconds, setCoachContext });

  const { handleStart, handleStepInput, handleValidateStep, handleStepComplete, handleShowHint, handleComplete, handleSubmitAAR, handleLogFailure, resetSession } = useBattleDrillCallbacks({ drill, completedSteps, showHints, stepInputs }, { setSessionStarted: state.setSessionStarted, setElapsedSeconds, setCompletedSteps: state.setCompletedSteps, setShowHints: state.setShowHints, setStepInputs: state.setStepInputs, setValidationResults: state.setValidationResults, setValidatingStep: state.setValidatingStep, setSessionComplete: state.setSessionComplete, setSessionResult: state.setSessionResult, setShowAARForm: state.setShowAARForm, setAARSubmitted: state.setAARSubmitted, setSubmittedAAR: state.setSubmittedAAR, setShowFailureLog: state.setShowFailureLog });

  const { formatTime, getTimeColor } = useBattleDrillUtilities({
    elapsedSeconds,
    drill,
  });

  return {
    state: {
      drill,
      sessionStarted,
      sessionComplete,
      elapsedSeconds,
      completedSteps,
      showHints,
      stepInputs,
      validationResults,
      validatingStep,
      sessionResult,
      showAARForm,
      aarSubmitted,
      submittedAAR,
      showFailureLog,
      coachContext,
      performance,
    },
    actions: {
      handleStart,
      handleStepInput,
      handleValidateStep,
      handleStepComplete,
      handleShowHint,
      handleComplete,
      handleSubmitAAR,
      handleLogFailure,
      resetSession,
      formatTime,
      getTimeColor,
    },
  };
};
