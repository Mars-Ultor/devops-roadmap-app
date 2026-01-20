import { useMasterTrainingSessionState } from "./master-training-session/useMasterTrainingSessionState";
import { useMasterTrainingSessionActions } from "./master-training-session/useMasterTrainingSessionActions";
import type { SessionState, SessionActions } from "./master-training-session/useMasterTrainingSessionState";

export { type SessionState, type SessionActions };

export function useMasterTrainingSession() {
  const [state, setters] = useMasterTrainingSessionState();
  const actions = useMasterTrainingSessionActions({ state, setters });

  return {
    state,
    actions,
  };
}
