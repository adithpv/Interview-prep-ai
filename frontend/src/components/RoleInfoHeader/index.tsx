import { type FC } from "react";
import { useNavigate } from "react-router-dom";
import { LuArrowLeft } from "react-icons/lu";

interface RoleInfoHeaderProps {
  role?: string;
  topicsToFocus?: string;
  experience?: string;
  questions: number | string;
  descriptions?: string;
  lastUpdated: string;
}

const RoleInfoHeader: FC<RoleInfoHeaderProps> = ({
  role,
  topicsToFocus,
  experience,
  questions,
  lastUpdated,
}) => {
  const navigate = useNavigate();

  return (
    <div className="relative w-full bg-gray-50">
      <div className="relative mx-auto max-w-5xl px-6 py-16 sm:px-8 lg:px-12">
        <div className="relative z-10 rounded-2xl border border-gray-200 bg-white/80 p-8 shadow-lg backdrop-blur-md">
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-6 flex cursor-pointer items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
          >
            <LuArrowLeft size={18} />
            Back to Dashboard
          </button>
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">
                {role}
              </h2>
              <p className="mt-2 text-sm font-medium text-gray-600 sm:text-base">
                {topicsToFocus}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full bg-gray-900 px-4 py-1.5 text-xs font-semibold text-white shadow-sm sm:text-sm">
                {experience} {experience === "1" ? "Year" : "Years"}
              </span>
              <span className="rounded-full bg-emerald-500/90 px-4 py-1.5 text-xs font-semibold text-white shadow-sm sm:text-sm">
                {questions} Q&A
              </span>
              <span className="rounded-full bg-cyan-500/90 px-4 py-1.5 text-xs font-semibold text-white shadow-sm sm:text-sm">
                Updated {lastUpdated}
              </span>
            </div>
          </div>
        </div>
        <div className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-lime-300/30 blur-3xl" />
        <div className="absolute bottom-0 left-0 h-32 w-32 rounded-full bg-cyan-300/30 blur-2xl" />
        <div className="absolute top-20 right-20 h-28 w-28 rounded-full bg-emerald-400/30 blur-2xl" />
      </div>
    </div>
  );
};

export default RoleInfoHeader;
