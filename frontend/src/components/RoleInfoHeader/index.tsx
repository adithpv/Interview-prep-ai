import { type FC } from "react";

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
  return (
    <div className="relative bg-white">
      <div className="container mx-auto px-10 md:px-6">
        <div className="relative z-10 flex h-[200px] flex-col justify-center">
          <div className="flex items-start">
            <div className="flex-grow">
              <div className="flex items-start justify-between">
                <div className="">
                  <h2 className="text-2xl font-medium">{role}</h2>
                  <p className="text-medium mt-1 text-sm text-gray-900">
                    {topicsToFocus}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-4 flex items-center gap-3">
            <div className="rounded-full bg-black px-3 py-1 text-[10px] font-semibold text-white">
              Experience: {experience} {experience === "1" ? "Year" : "Years"}
            </div>
            <div className="rounded-full bg-black px-3 py-1 text-[10px] font-semibold text-white">
              {questions} Q&A
            </div>
            <div className="rounded-full bg-black px-3 py-1 text-[10px] font-semibold text-white">
              Last Updated: {lastUpdated}
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 flex h-[200px] w-[40vw] items-center justify-center overflow-hidden bg-white md:w-[30vw]">
          <div className="animate-blob1 h-16 w-16 bg-lime-400 blur-[65px]" />
          <div className="animate-blob2 bg-lime-teal h-16 w-16 blur-[65px]" />
          <div className="animate-blob3 h-16 w-16 bg-cyan-400 blur-[45px]" />
          <div className="animate-blob4 h-16 w-16 bg-fuchsia-200 blur-[45px]" />
        </div>
      </div>
    </div>
  );
};

export default RoleInfoHeader;
