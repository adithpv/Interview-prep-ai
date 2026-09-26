import { useEffect, useRef, useState } from "react";
import { LuChevronDown, LuPin, LuDiff, LuSparkles, LuCircleCheck, LuCircle, LuTrash } from "react-icons/lu";
import AiResponsePreview from "../AiResponsePreview";

interface QuestionCardProps {
  question: string;
  answer: string;
  isPinned: boolean;
  status?: 'learning' | 'mastered';
  onLearnMore: () => void;
  onTogglePin: () => void;
  onToggleStatus?: () => void;
  onDelete?: () => void;
}

const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  answer,
  isPinned,
  status = 'learning',
  onLearnMore,
  onTogglePin,
  onToggleStatus,
  onDelete,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [height, setHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isExpanded && contentRef.current) {
      const contentHeight = contentRef.current.scrollHeight;
      setHeight(contentHeight + 10);
    } else {
      setHeight(0);
    }
  }, [isExpanded]);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <>
      <div className={`mb-4 overflow-hidden rounded-lg border px-5 py-4 shadow-xl transition-colors ${status === 'mastered' ? 'border-green-100 bg-green-50/30 shadow-green-100/30' : 'border-gray-100/60 bg-white shadow-gray-100/70'}`}>
        <div className="flex cursor-pointer items-start justify-between">
          <div className="flex items-start gap-3.5">
            <span className="text-xs leading-tight font-semibold text-gray-400 md:text-[15px]">
              0
            </span>
            <h3
              className={`mr-0 text-xs font-medium md:mr-20 md:text-[14px] ${status === 'mastered' ? 'text-gray-600 line-through decoration-green-300' : 'text-gray-800'}`}
              onClick={toggleExpand}
            >
              {question}
            </h3>
          </div>
          <div className="relative ml-4 flex items-center justify-end">
            <div
              className={`flex ${isExpanded ? "md:flex" : "group-hover:flex md:hidden"}`}
            >
              {onToggleStatus && (
                <button
                  className={`mr-2 flex cursor-pointer items-center gap-2 rounded border px-3 py-1 text-xs font-medium text-nowrap transition-colors ${status === 'mastered' ? 'border-green-500 bg-green-50 text-green-700 hover:bg-green-100' : 'border-gray-200 bg-white text-gray-500 hover:border-green-500 hover:text-green-600'}`}
                  onClick={onToggleStatus}
                  title={status === 'mastered' ? "Mark as Learning" : "Mark as Mastered"}
                >
                  {status === 'mastered' ? (
                    <><LuCircleCheck className="text-xs" /><span className="hidden md:block">Mastered</span></>
                  ) : (
                    <><LuCircle className="text-xs" /><span className="hidden md:block">Mark Mastered</span></>
                  )}
                </button>
              )}
              <button
                className="hover:border-indigo-20 mr-2 flex cursor-pointer items-center gap-2 rounded border border-indigo-500 bg-indigo-50 px-3 py-1 text-xs font-medium text-nowrap text-indigo-800"
                onClick={onTogglePin}
              >
                {isPinned ? (
                  <LuDiff className="text-xs" />
                ) : (
                  <LuPin className="text-xs" />
                )}
              </button>
              {onDelete && (
                <button
                  className="mr-2 flex cursor-pointer items-center justify-center rounded border border-rose-200 bg-rose-50 px-3 py-1 text-rose-500 hover:bg-rose-100"
                  onClick={onDelete}
                  title="Delete Question"
                >
                  <LuTrash size={14} />
                </button>
              )}
              <button
                className="mr-2 flex cursor-pointer items-center gap-2 rounded border border-cyan-50 bg-cyan-50 px-3 py-2 text-xs font-medium text-nowrap text-cyan-800 hover:border-cyan-200"
                onClick={() => {
                  setIsExpanded(true);
                  onLearnMore();
                }}
              >
                <LuSparkles className="" />
                <span className="hidden md:block">Learn More</span>
              </button>
            </div>
            <button
              className="cursor-pointer text-gray-400 hover:text-gray-500"
              onClick={toggleExpand}
            >
              <LuChevronDown
                className={`transform transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`}
                size={20}
              />
            </button>
          </div>
        </div>
        <div
          className="overflow-hidden transition-all duration-300 ease-in-out"
          style={{ maxHeight: `${height}px` }}
        >
          <div
            ref={contentRef}
            className="mt-4 rounded-lg bg-gray-50 px-5 py-3 text-gray-700"
          >
            <AiResponsePreview content={answer} />
          </div>
        </div>
      </div>
    </>
  );
};

export default QuestionCard;
