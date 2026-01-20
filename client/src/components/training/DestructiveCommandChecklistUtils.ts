/**
 * Utility functions and types for DestructiveCommandChecklist
 */

export interface ChecklistState {
  backup: boolean;
  rollback: boolean;
  tested: boolean;
  understands: boolean;
}

export const INITIAL_CHECKLIST_STATE: ChecklistState = {
  backup: false,
  rollback: false,
  tested: false,
  understands: false,
};

export interface ChecklistItem {
  key: keyof ChecklistState;
  label: string;
  helpText: string;
}

export const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    key: "backup",
    label: "I have backed up the current state or can restore from a snapshot",
    helpText: "Document your backup method and verify restoration works",
  },
  {
    key: "rollback",
    label: "I have documented rollback steps and tested them",
    helpText: "Write down exact commands to undo this operation",
  },
  {
    key: "tested",
    label: "I have tested this in isolation or a non-production environment",
    helpText: "Verify the command works as expected in a safe context first",
  },
  {
    key: "understands",
    label: "I fully understand what this command will do and its consequences",
    helpText: "Can you explain each flag and parameter without looking it up?",
  },
];

export function isChecklistComplete(checklist: ChecklistState): boolean {
  return Object.values(checklist).every((v) => v);
}
