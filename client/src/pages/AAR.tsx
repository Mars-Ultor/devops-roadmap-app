/**
 * AAR (After Action Review) Page
 * Main page for AAR functionality
 */

import { useSearchParams, useNavigate } from "react-router-dom";
import { History, Plus } from "lucide-react";
import AARForm from "../components/aar/AARForm";
import AARHistory from "../components/aar/AARHistory";
import { useAuthStore } from "../store/authStore";
import { useProgress } from "../hooks/useProgress";

type AARView = "history" | "create";

interface NavTabProps {
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}
const NavTab = ({ label, icon, isActive, onClick }: NavTabProps) => (
  <button
    onClick={onClick}
    className={`flex items-center px-4 py-3 border-b-2 font-medium text-sm ${isActive ? "border-indigo-400 text-indigo-400" : "border-transparent text-gray-400 hover:text-white hover:border-gray-600"}`}
  >
    {icon}
    {label}
  </button>
);

export default function AARPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { completeLab } = useProgress();

  const view = (searchParams.get("view") as AARView) || "history";
  const lessonId = searchParams.get("lessonId") || "";
  const level =
    (searchParams.get("level") as
      | "crawl"
      | "walk"
      | "run-guided"
      | "run-independent") || "crawl";
  const labId = searchParams.get("labId") || "";

  const handleAARComplete = async (aarId: string) => {
    console.log("AAR completed with ID:", aarId);
    if (labId) {
      try {
        await completeLab(labId, 100, 1, 1);
      } catch (error) {
        console.error("Failed to complete lab after AAR:", error);
      }
    }
    navigate(searchParams.get("returnTo") || "/curriculum");
  };

  const handleViewChange = (newView: AARView) => {
    const params = new URLSearchParams(searchParams);
    params.set("view", newView);
    setSearchParams(params);
  };

  const renderCreateView = () => {
    if (!user?.uid || !lessonId || !labId) {
      return (
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-6 text-center">
            <h2 className="text-xl font-bold text-red-400 mb-2">
              Invalid AAR Request
            </h2>
            <p className="text-gray-300 mb-4">
              Missing required parameters for AAR creation.
            </p>
            <button
              onClick={() => navigate("/aar")}
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Go to AAR History
            </button>
          </div>
        </div>
      );
    }
    return (
      <AARForm
        userId={user.uid}
        lessonId={lessonId}
        level={level}
        labId={labId}
        onComplete={handleAARComplete}
        onCancel={() => handleViewChange("history")}
      />
    );
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <div className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-6xl mx-auto px-6">
          <div className="flex items-center space-x-1">
            <NavTab
              label="AAR History"
              icon={<History className="w-4 h-4 mr-2" />}
              isActive={view === "history"}
              onClick={() => handleViewChange("history")}
            />
            <NavTab
              label="Create AAR"
              icon={<Plus className="w-4 h-4 mr-2" />}
              isActive={view === "create"}
              onClick={() => handleViewChange("create")}
            />
          </div>
        </div>
      </div>
      <div className="py-6">
        {view === "create" ? renderCreateView() : <AARHistory />}
      </div>
    </div>
  );
}
