import type { CertificationLevel } from "../../types/training";

export const getCertificationColor = (level: CertificationLevel): string => {
  switch (level) {
    case "bronze":
      return "text-amber-600 bg-amber-100 border-amber-200";
    case "silver":
      return "text-gray-600 bg-gray-100 border-gray-200";
    case "gold":
      return "text-yellow-600 bg-yellow-100 border-yellow-200";
    case "platinum":
      return "text-purple-600 bg-purple-100 border-purple-200";
    case "master":
      return "text-red-600 bg-red-100 border-red-200";
  }
};

export const getUrgencyColor = (daysUntilExpiry: number): string => {
  if (daysUntilExpiry < 0) return "text-red-600 bg-red-50 border-red-200";
  if (daysUntilExpiry <= 7)
    return "text-orange-600 bg-orange-50 border-orange-200";
  if (daysUntilExpiry <= 30)
    return "text-yellow-600 bg-yellow-50 border-yellow-200";
  return "text-green-600 bg-green-50 border-green-200";
};

export const calculateDaysUntilExpiry = (expiresAt: Date): number => {
  const now = new Date();
  const diffTime = expiresAt.getTime() - now.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
