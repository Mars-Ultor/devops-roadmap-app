/**
 * Adaptive AAR Form Component
 * Shows different AAR depths based on user's struggle metrics
 */

import { useState } from "react";
import type { StruggleMetrics, AARFormType } from "../../types/aar";
import { determineAARType } from "../../types/aar";
import type { AARLevel } from "./AARForm";
import AARForm from "./AARForm";
import { useAdaptiveAARSubmit } from "./useAdaptiveAARSubmit";
import {
  PerfectCompletionScreen,
  QuickReflectionScreen,
  FullAARRequiredScreen,
} from "./AdaptiveAARComponents";

interface AdaptiveAARFormProps {
  readonly userId: string;
  readonly lessonId: string;
  readonly level: AARLevel;
  readonly labId: string;
  readonly struggleMetrics: StruggleMetrics;
  readonly onComplete: (aarId: string | null) => void;
  readonly onCancel?: () => void;
}

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
  onCancel,
}: Readonly<AdaptiveAARFormProps>) {
  const aarType = determineAARType(struggleMetrics);
  const [selectedType, setSelectedType] = useState<AARFormType | null>(null);
  const [quickReflection, setQuickReflection] = useState<QuickReflection>({
    mainTakeaway: "",
    oneImprovement: "",
  });

  const { isSubmitting, handleSkip, handleQuickSubmit } = useAdaptiveAARSubmit({
    userId,
    lessonId,
    level,
    labId,
    struggleMetrics,
    onComplete,
  });

  // Show full AAR form if selected or required
  if (
    selectedType === "full" ||
    (aarType === "full" && selectedType === null)
  ) {
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

  // Perfect completion - show skip option
  if (aarType === "skip" && selectedType === null) {
    return (
      <PerfectCompletionScreen
        metrics={struggleMetrics}
        isSubmitting={isSubmitting}
        onSkip={handleSkip}
        onSelectType={setSelectedType}
      />
    );
  }

  // Quick reflection for minor struggles
  if (aarType === "quick" || selectedType === "quick") {
    return (
      <QuickReflectionScreen
        metrics={struggleMetrics}
        reflection={quickReflection}
        isSubmitting={isSubmitting}
        showBackButton={selectedType === "quick"}
        onReflectionChange={setQuickReflection}
        onSubmit={() => handleQuickSubmit(quickReflection)}
        onSelectFull={() => setSelectedType("full")}
        onBack={() => setSelectedType(null)}
      />
    );
  }

  // Full AAR required for significant struggles
  return (
    <FullAARRequiredScreen
      metrics={struggleMetrics}
      onStart={() => setSelectedType("full")}
    />
  );
}
