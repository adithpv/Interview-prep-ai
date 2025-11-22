import { motion } from "framer-motion";
import { LuSparkles } from "react-icons/lu";
import HERO from "../../assets/hero.png";
import AnimatedBrain from "../Shared/AniamtedBrain";

const ProductDemo = () => {
  return (
    <div className="relative">
      <motion.article
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="group relative overflow-hidden rounded-3xl border border-neutral-800 bg-neutral-900 shadow-[0_2.8px_2.2px_rgba(0,_0,_0,_0.034),_0_6.7px_5.3px_rgba(0,_0,_0,_0.048),_0_12.5px_10px_rgba(0,_0,_0,_0.06),_0_22.3px_17.9px_rgba(0,_0,_0,_0.072),_0_41.8px_33.4px_rgba(0,_0,_0,_0.086),_0_100px_80px_rgba(0,_0,_0,_0.12)] transition-shadow hover:shadow-md"
      >
        <div className="pt-6 pr-6 pb-6 pl-6 sm:p-8">
          <div className="relative h-56 overflow-hidden rounded-2xl bg-neutral-900 ring-1 ring-white/5 ring-inset sm:h-64">
            <svg
              className="absolute inset-0 h-full w-full text-neutral-800"
              aria-hidden="true"
            >
              <defs>
                <pattern
                  id="grid"
                  width="24"
                  height="24"
                  patternUnits="userSpaceOnUse"
                >
                  <path
                    d="M24 0H0V24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  ></path>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)"></rect>
            </svg>
            <span className="absolute top-4 left-6 h-0.5 w-10 rounded bg-amber-500"></span>
            <div className="absolute top-8 right-6 w-[78%] rounded-2xl border border-neutral-800 bg-neutral-900 shadow-lg sm:top-10 sm:right-10">
              <div className="flex items-center gap-2 border-b border-neutral-800 px-4 py-3">
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-800"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-800"></span>
                <span className="h-2.5 w-2.5 rounded-full bg-neutral-800"></span>
                <div className="ml-3 h-2 w-24 rounded bg-neutral-800"></div>
              </div>
              <div className="grid grid-cols-3 gap-3 p-4">
                <div className="col-span-2 overflow-hidden rounded-lg border border-neutral-800">
                  <img
                    src={HERO}
                    alt="Interview Dashboard"
                    className="h-28 w-full object-cover"
                  />
                </div>
                <div className="overflow-hidden rounded-lg border border-neutral-800">
                  <AnimatedBrain />
                </div>
                <div className="h-24 rounded-lg border border-neutral-800 bg-neutral-900"></div>
                <div className="h-24 rounded-lg border border-neutral-800 bg-neutral-900"></div>
                <div className="h-24 rounded-lg border border-neutral-800 bg-neutral-900"></div>
              </div>
            </div>
          </div>
          <div className="mt-6 sm:mt-8">
            <div className="flex items-center gap-3">
              <LuSparkles className="h-5 w-5 text-neutral-400" />
              <h3 className="text-xl font-semibold tracking-tight text-neutral-100 sm:text-2xl">
                Your Personal Q&A Bank
              </h3>
            </div>
            <p className="mt-3 text-sm text-neutral-400">
              Explore questions and answers, expand topics on demand, and get
              interview-ready faster.
            </p>
          </div>
        </div>
      </motion.article>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="relative mt-8 w-full max-w-xl"
      >
        <div className="absolute -top-5 left-1/2 h-9 w-[calc(100%-3rem)] -translate-x-1/2 rounded-2xl bg-amber-900/10 shadow-[0_6px_20px_rgba(245,158,11,0.25)]"></div>
        <article className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 text-white shadow-2xl ring-1 ring-white/15">
          <div className="pointer-events-none absolute inset-x-0 -top-10 h-24 bg-gradient-to-b from-white/40 to-transparent"></div>
          <div className="pt-4 pr-4 pb-4 pl-4 sm:p-5">
            <div className="flex items-start gap-3">
              <div className="shrink-0 rounded-xl bg-gradient-to-b from-slate-900 to-slate-800 p-2.5 shadow-md ring-1 ring-white/10">
                <LuSparkles className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="truncate text-[15px] font-semibold tracking-tight sm:text-base">
                    Interview Tip: Role-Focused Prep
                  </h3>
                  <span className="shrink-0 text-xs text-white/85 sm:text-sm">
                    2m ago
                  </span>
                </div>
                <p className="mt-1 text-sm leading-6 text-white/90">
                  Focus on role-specific topics. If you're a React developer,
                  practice state management, hooks, and performance optimization
                  — these come up often.
                </p>
              </div>
            </div>
          </div>
        </article>
      </motion.div>
    </div>
  );
};

export default ProductDemo;
