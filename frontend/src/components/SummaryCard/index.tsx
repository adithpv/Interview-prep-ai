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
      className="group relative cursor-pointer overflow-hidden rounded-xl border border-gray-300/40 bg-white p-2 shadow-gray-100 hover:shadow-xl"
      onClick={onSelect}
    >
      <div
        className="relative cursor-pointer rounded-lg p-4"
        style={{ background: colors.bgColor }}
      >
        <div className="flex items-start">
          <div className="mr-4 flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-white">
            <span className="text-lg font-semibold text-black">
              {getInitials(role)}
            </span>
          </div>

          <div className="flex-grow">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-[17px] font-medium">{role}</h2>
                <p className="text-medium text-xs text-gray-900">
                  {topicsToFocus}
                </p>
              </div>
            </div>
          </div>
        </div>

        <button
          className="absolute top-0 right-0 hidden cursor-pointer items-center gap-2 rounded border border-rose-100 bg-rose-50 px-3 py-1 text-xs font-medium text-nowrap text-rose-500 group-hover:flex hover:border-rose-200"
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          <LuTrash2 />
        </button>
      </div>
      <div className="px-3 pb-3">
        <div className="mt-4 flex items-center gap-3">
          <div className="rounded-full border-[0.5px] border-gray-900 px-3 py-1 text-[10px] font-medium text-black">
            Experience: {experience} {experience === 1 ? "Year" : "Years"}
          </div>

          <div className="rounded-full border-[0.5px] border-gray-900 px-3 py-1 text-[10px] font-medium text-black">
            {questions} Q&A
          </div>
          <div className="rounded-full border-[0.5px] border-gray-900 px-3 py-1 text-[10px] font-medium text-black">
            Last Updated: {lastUpdated}
          </div>
        </div>
        <p className="mt-3 line-clamp-2 text-[12px] font-medium text-gray-500">
          {description}
        </p>
      </div>
    </div>
  );
};

export default SummaryCard;
