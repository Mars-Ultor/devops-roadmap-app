/**
 * Custom hook for Adaptive AAR submission handlers
 */

import { useState, useCallback } from "react";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "../../lib/firebase";
import { aarService } from "../../services/aarService";
import type { StruggleMetrics } from "../../types/aar";
import type { AARLevel } from "./AARForm";

interface QuickReflection {
  mainTakeaway: string;
  oneImprovement: string;
}

interface UseAdaptiveAARSubmitProps {
  userId: string;
  lessonId: string;
  level: AARLevel;
  labId: string;
  struggleMetrics: StruggleMetrics;
  onComplete: (aarId: string | null) => void;
}

/** Build AAR data for skipped submission */
function buildSkipAARData(props: UseAdaptiveAARSubmitProps) {
  return {
    userId: props.userId,
    lessonId: props.lessonId,
    level: props.level,
    labId: props.labId,
    completedAt: serverTimestamp(),
    aarType: "skipped",
    struggleMetrics: props.struggleMetrics,
    whatWasAccomplished: "Perfect completion - no reflection needed",
    whatWorkedWell: ["Completed without issues"],
    whatDidNotWork: [],
    whyDidNotWork: "",
    whatWouldIDoDifferently: "",
    whatDidILearn: "",
    wordCounts: {
      whatWasAccomplished: 5,
      whyDidNotWork: 0,
      whatWouldIDoDifferently: 0,
      whatDidILearn: 0,
    },
    aiReview: {
      reviewedAt: new Date().toISOString(),
      reviewer: "ai",
      score: 10,
      feedback:
        "Great job! You completed this level perfectly with no struggles.",
      suggestions: [],
      followUpQuestions: [],
    },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

/** Build AAR data for quick reflection submission */
function buildQuickAARData(
  props: UseAdaptiveAARSubmitProps,
  quickReflection: QuickReflection,
) {
  const aiReview = aarService.generateAIReview(
    {
      whatWasAccomplished: "Quick reflection after minor struggles",
      whatWorkedWell: ["Completed the level"],
      whatDidNotWork: ["Minor issues encountered"],
      whyDidNotWork: "Minor challenges",
      whatWouldIDoDifferently: quickReflection.oneImprovement,
      whatDidILearn: quickReflection.mainTakeaway,
    },
    {
      whatWasAccomplished: 5,
      whyDidNotWork: 2,
      whatWouldIDoDifferently: 10,
      whatDidILearn: 10,
    },
  );

  return {
    userId: props.userId,
    lessonId: props.lessonId,
    level: props.level,
    labId: props.labId,
    completedAt: serverTimestamp(),
    aarType: "quick",
    struggleMetrics: props.struggleMetrics,
    whatWasAccomplished: "Quick reflection after minor struggles",
    whatWorkedWell: ["Completed the level"],
    whatDidNotWork: ["Minor issues encountered"],
    whyDidNotWork: "Minor challenges",
    whatWouldIDoDifferently: quickReflection.oneImprovement,
    whatDidILearn: quickReflection.mainTakeaway,
    wordCounts: {
      whatWasAccomplished: 5,
      whyDidNotWork: 2,
      whatWouldIDoDifferently: aarService.countWords(
        quickReflection.oneImprovement,
      ),
      whatDidILearn: aarService.countWords(quickReflection.mainTakeaway),
    },
    aiReview: { ...aiReview, reviewedAt: aiReview.reviewedAt.toISOString() },
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };
}

export function useAdaptiveAARSubmit(props: UseAdaptiveAARSubmitProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSkip = useCallback(async () => {
    setIsSubmitting(true);
    try {
      const docRef = await addDoc(
        collection(db, "afterActionReviews"),
        buildSkipAARData(props),
      );
      props.onComplete(docRef.id);
    } catch (error) {
      console.error("Error saving skipped AAR:", error);
      setIsSubmitting(false);
    }
  }, [props]);

  const handleQuickSubmit = useCallback(
    async (quickReflection: QuickReflection) => {
      if (
        !quickReflection.mainTakeaway.trim() ||
        !quickReflection.oneImprovement.trim()
      )
        return;
      setIsSubmitting(true);
      try {
        const docRef = await addDoc(
          collection(db, "afterActionReviews"),
          buildQuickAARData(props, quickReflection),
        );
        props.onComplete(docRef.id);
      } catch (error) {
        console.error("Error saving quick AAR:", error);
        setIsSubmitting(false);
      }
    },
    [props],
  );

  return { isSubmitting, handleSkip, handleQuickSubmit };
}
