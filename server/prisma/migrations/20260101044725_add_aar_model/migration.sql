-- CreateTable
CREATE TABLE "AfterActionReview" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "completedAt" TIMESTAMP(3) NOT NULL,
    "whatWasAccomplished" TEXT NOT NULL,
    "whatWorkedWell" JSONB NOT NULL,
    "whatDidNotWork" JSONB NOT NULL,
    "whyDidNotWork" TEXT NOT NULL,
    "whatWouldIDoDifferently" TEXT NOT NULL,
    "whatDidILearn" TEXT NOT NULL,
    "wordCounts" JSONB NOT NULL,
    "qualityScore" DOUBLE PRECISION,
    "aiReview" JSONB,
    "patterns" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AfterActionReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AfterActionReview" ADD CONSTRAINT "AfterActionReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
