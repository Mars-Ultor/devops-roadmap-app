-- CreateTable
CREATE TABLE "AfterActionReview" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "labId" TEXT NOT NULL,
    "completedAt" DATETIME NOT NULL,
    "whatWasAccomplished" TEXT NOT NULL,
    "whatWorkedWell" JSONB NOT NULL,
    "whatDidNotWork" JSONB NOT NULL,
    "whyDidNotWork" TEXT NOT NULL,
    "whatWouldIDoDifferently" TEXT NOT NULL,
    "whatDidILearn" TEXT NOT NULL,
    "wordCounts" JSONB NOT NULL,
    "qualityScore" REAL,
    "aiReview" JSONB,
    "patterns" JSONB,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "AfterActionReview_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
