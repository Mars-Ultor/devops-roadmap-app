/**
 * Progressive Constraints Manager
 * Phase 8: Week-based restrictions to build resilience
 *
 * Weeks 1-4 (Crawl): Unlimited support
 * Weeks 5-8 (Walk): Reduced support (3 hints, 5 resets)
 * Weeks 9-12 (Run): Strict (1 hint, 2 resets, copy-paste blocked)
 */

export interface ConstraintLevel {
  phase: "crawl" | "walk" | "run";
  maxHints: number;
  maxResets: number;
  copyPasteBlocked: boolean;
  description: string;
}

export interface ConstraintStatus {
  level: ConstraintLevel;
  hintsRemaining: number;
  resetsRemaining: number;
  hintsUsed: number;
  resetsUsed: number;
}

export class ProgressiveConstraintsManager {
  private static CONSTRAINTS: Record<
    "crawl" | "walk" | "run",
    ConstraintLevel
  > = {
    crawl: {
      phase: "crawl",
      maxHints: Infinity,
      maxResets: Infinity,
      copyPasteBlocked: false,
      description: "Full support available - focus on learning",
    },
    walk: {
      phase: "walk",
      maxHints: 3,
      maxResets: 5,
      copyPasteBlocked: false,
      description: "Reduced support - build independence",
    },
    run: {
      phase: "run",
      maxHints: 1,
      maxResets: 2,
      copyPasteBlocked: true,
      description: "Minimal support - demonstrate mastery",
    },
  };

  /**
   * Get constraint level based on current week
   */
  static getConstraintLevel(weekNumber: number): ConstraintLevel {
    if (weekNumber <= 4) {
      return this.CONSTRAINTS.crawl;
    } else if (weekNumber <= 8) {
      return this.CONSTRAINTS.walk;
    } else {
      return this.CONSTRAINTS.run;
    }
  }

  /**
   * Check if hint is allowed
   */
  static canUseHint(weekNumber: number, hintsUsed: number): boolean {
    const level = this.getConstraintLevel(weekNumber);
    return hintsUsed < level.maxHints;
  }

  /**
   * Check if reset is allowed
   */
  static canUseReset(weekNumber: number, resetsUsed: number): boolean {
    const level = this.getConstraintLevel(weekNumber);
    return resetsUsed < level.maxResets;
  }

  /**
   * Check if copy-paste should be blocked
   */
  static isCopyPasteBlocked(weekNumber: number): boolean {
    const level = this.getConstraintLevel(weekNumber);
    return level.copyPasteBlocked;
  }

  /**
   * Get current constraint status
   */
  static getConstraintStatus(
    weekNumber: number,
    hintsUsed: number,
    resetsUsed: number,
  ): ConstraintStatus {
    const level = this.getConstraintLevel(weekNumber);

    return {
      level,
      hintsRemaining:
        level.maxHints === Infinity
          ? Infinity
          : Math.max(0, level.maxHints - hintsUsed),
      resetsRemaining:
        level.maxResets === Infinity
          ? Infinity
          : Math.max(0, level.maxResets - resetsUsed),
      hintsUsed,
      resetsUsed,
    };
  }

  /**
   * Get warning message when approaching limits
   */
  static getWarningMessage(
    weekNumber: number,
    hintsUsed: number,
    resetsUsed: number,
  ): string | null {
    const level = this.getConstraintLevel(weekNumber);

    if (level.maxHints !== Infinity && hintsUsed >= level.maxHints - 1) {
      return `⚠️ Last hint available! You have ${level.maxHints - hintsUsed} hint(s) remaining.`;
    }

    if (level.maxResets !== Infinity && resetsUsed >= level.maxResets - 1) {
      return `⚠️ Running low on resets! You have ${level.maxResets - resetsUsed} reset(s) remaining.`;
    }

    return null;
  }

  /**
   * Initialize copy-paste blocking for terminal/code inputs
   * Call this in useEffect to set up event listeners
   */
  static initializeCopyPasteBlocking(
    weekNumber: number,
    elementSelector: string,
  ): () => void {
    if (!this.isCopyPasteBlocked(weekNumber)) {
      return () => {}; // No blocking needed
    }

    const handlePaste = (e: ClipboardEvent) => {
      const target = e.target as HTMLElement;

      // Check if target matches the selector or is within it
      if (target.matches(elementSelector) || target.closest(elementSelector)) {
        e.preventDefault();

        // Show toast notification
        const toast = document.createElement("div");
        toast.className =
          "fixed top-4 right-4 bg-red-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center gap-2";
        toast.innerHTML = `
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <span>Copy-paste blocked (Weeks 9-12)</span>
        `;
        document.body.appendChild(toast);

        setTimeout(() => {
          toast.remove();
        }, 3000);
      }
    };

    document.addEventListener("paste", handlePaste);

    // Return cleanup function
    return () => {
      document.removeEventListener("paste", handlePaste);
    };
  }

  /**
   * Get visual indicator for current constraint level
   */
  static getConstraintBadge(weekNumber: number): {
    color: string;
    icon: string;
    label: string;
  } {
    const level = this.getConstraintLevel(weekNumber);

    switch (level.phase) {
      case "crawl":
        return {
          color: "bg-green-700 text-green-300",
          icon: "🌱",
          label: "CRAWL - Full Support",
        };
      case "walk":
        return {
          color: "bg-yellow-700 text-yellow-300",
          icon: "🚶",
          label: "WALK - Reduced Support",
        };
      case "run":
        return {
          color: "bg-red-700 text-red-300",
          icon: "🏃",
          label: "RUN - Minimal Support",
        };
    }
  }
}
