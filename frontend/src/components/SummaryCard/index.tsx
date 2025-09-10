import { type FC } from "react";
import { LuTrash2 } from "react-icons/lu";
import { getInitials } from "../../utils/helper";

interface SummaryCardProps {
  colors: { id: number; bgColor: string };
  role: string;
  topicsToFocus: string;
  experience: string | number;
  questions: string | number;
  description: string;
  lastUpdated: string;
  onSelect: () => void;
  onDelete: () => void;
}

const SummaryCard: FC<SummaryCardProps> = ({
  colors,
  role,
  topicsToFocus,
  experience,
  questions,
  description,
  lastUpdated,
  onSelect,
  onDelete,
}) => {
  return (
    <div
      className="group relative flex cursor-pointer flex-col rounded-2xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-lg"
      onClick={onSelect}
    >
      <div
        className="relative flex items-center gap-4 p-5"
        style={{ background: colors.bgColor }}
      >
        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-xl bg-white text-base font-semibold text-gray-800 shadow">
          {getInitials(role)}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-900">{role}</h2>
          <p className="text-sm text-gray-700">{topicsToFocus}</p>
        </div>
        <button
          className="absolute top-4 right-4 hidden items-center justify-center rounded-md border border-rose-200 bg-rose-50 p-2 text-rose-500 opacity-0 transition group-hover:flex group-hover:opacity-100 hover:bg-rose-100"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <LuTrash2 size={16} />
        </button>
      </div>
      <div className="px-5 pb-5">
        <div className="mt-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
            {experience} {experience === 1 ? "Year" : "Years"}
          </span>
          <span className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
            {questions} Q&A
          </span>
          <span className="rounded-full border border-gray-300 bg-gray-50 px-3 py-1 text-xs font-medium text-gray-700">
            Updated {lastUpdated}
          </span>
        </div>
        <p className="mt-3 line-clamp-2 text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
