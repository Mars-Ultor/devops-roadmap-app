import type {
  CertificationStatus,
  CertificationLevel,
  RecertificationAttempt,
} from "../types/training";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001";

export class CertificationService {
  private static async getAuthHeaders() {
    // For now, we'll use a simple approach. In a real app, you'd get the token from auth context
    const token = localStorage.getItem("authToken");
    return {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  static async getUserCertifications(): Promise<CertificationStatus[]> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/certifications`, {
        headers: await this.getAuthHeaders(),
      });

      if (!response.ok) {
        throw new Error("Failed to fetch certifications");
      }

      const data = await response.json();
      return data.map((cert: unknown) => ({
        userId: (cert as { userId: string }).userId,
        skillId: (cert as { skillId: string }).skillId,
        certificationLevel: (cert as { certificationLevel: string })
          .certificationLevel as CertificationLevel,
        earnedAt: new Date((cert as { earnedAt: string }).earnedAt),
        expiresAt: new Date((cert as { expiresAt: string }).expiresAt),
        lastRecertifiedAt: new Date(
          (cert as { lastRecertifiedAt: string }).lastRecertifiedAt,
        ),
        recertificationRequired: (cert as { recertificationRequired: boolean })
          .recertificationRequired,
        gracePeriodDays: (cert as { gracePeriodDays: number }).gracePeriodDays,
        consecutivePasses: (cert as { consecutivePasses: number })
          .consecutivePasses,
        totalAttempts: (cert as { totalAttempts: number }).totalAttempts,
      }));
    } catch (error) {
      console.error("Error fetching certifications:", error);
      return [];
    }
  }

  static async getRecertificationAttempts(): Promise<RecertificationAttempt[]> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/certifications/attempts`,
        {
          headers: await this.getAuthHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to fetch recertification attempts");
      }

      const data = await response.json();
      return data.map((attempt: unknown) => ({
        id: (attempt as { id: string }).id,
        userId: (attempt as { userId: string }).userId,
        drillId: (attempt as { drillId: string }).drillId,
        score: (attempt as { score: number }).score,
        passed: (attempt as { passed: boolean }).passed,
        timeSpentMinutes: (attempt as { timeSpentMinutes: number })
          .timeSpentMinutes,
        completedAt: (attempt as { completedAt?: string }).completedAt
          ? new Date((attempt as { completedAt: string }).completedAt)
          : undefined,
      }));
    } catch (error) {
      console.error("Error fetching recertification attempts:", error);
      return [];
    }
  }

  static async createOrUpdateCertification(
    skillId: string,
    certificationLevel: CertificationLevel,
    expiresAt: Date,
    gracePeriodDays: number = 30,
  ): Promise<CertificationStatus | null> {
    try {
      const response = await fetch(`${API_BASE_URL}/api/certifications`, {
        method: "POST",
        headers: await this.getAuthHeaders(),
        body: JSON.stringify({
          skillId,
          certificationLevel,
          expiresAt: expiresAt.toISOString(),
          gracePeriodDays,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create/update certification");
      }

      const data = await response.json();
      return {
        userId: data.userId,
        skillId: data.skillId,
        certificationLevel: data.certificationLevel as CertificationLevel,
        earnedAt: new Date(data.earnedAt),
        expiresAt: new Date(data.expiresAt),
        lastRecertifiedAt: new Date(data.lastRecertifiedAt),
        recertificationRequired: data.recertificationRequired,
        gracePeriodDays: data.gracePeriodDays,
        consecutivePasses: data.consecutivePasses,
        totalAttempts: data.totalAttempts,
      };
    } catch (error) {
      console.error("Error creating/updating certification:", error);
      return null;
    }
  }

  static async submitRecertificationAttempt(
    attempt: RecertificationAttempt,
  ): Promise<RecertificationAttempt | null> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/certifications/attempt`,
        {
          method: "POST",
          headers: await this.getAuthHeaders(),
          body: JSON.stringify({
            certificationId: attempt.id, // Note: This might need to be adjusted based on your API
            drillId: attempt.drillId,
            score: attempt.score,
            passed: attempt.passed,
            timeSpentMinutes: attempt.timeSpentMinutes,
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit recertification attempt");
      }

      const data = await response.json();
      return {
        id: data.id,
        userId: data.userId,
        drillId: data.drillId,
        score: data.score,
        passed: data.passed,
        timeSpentMinutes: data.timeSpentMinutes,
        completedAt: new Date(data.completedAt),
      };
    } catch (error) {
      console.error("Error submitting recertification attempt:", error);
      return null;
    }
  }

  static async markCertificationForRecertification(
    certificationId: string,
  ): Promise<boolean> {
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/certifications/${certificationId}/require-recertification`,
        {
          method: "POST",
          headers: await this.getAuthHeaders(),
        },
      );

      return response.ok;
    } catch (error) {
      console.error("Error marking certification for recertification:", error);
      return false;
    }
  }
}
