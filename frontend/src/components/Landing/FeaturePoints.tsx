import { motion } from "framer-motion";
import { LuTarget, LuZap, LuTrendingUp } from "react-icons/lu";

const FeaturePoints = () => {
  return (
    <motion.div
      className="mt-8 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5 }}
    >
      <div className="flex items-start gap-4">
        <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
          <LuTarget className="h-4 w-4 text-amber-600" />
        </div>
        <div className="">
          <h4 className="mb-1 text-base font-semibold text-neutral-900">
            AI-Powered Personalization
          </h4>
          <p className="text-sm leading-relaxed text-neutral-600">
            Enter your role, skills, and experience — we instantly generate
            interview questions that match what recruiters really ask.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
          <LuZap className="h-4 w-4 text-amber-600" />
        </div>
        <div className="">
          <h4 className="mb-1 text-base font-semibold text-neutral-900">
            Real-Time Feedback
          </h4>
          <p className="text-sm leading-relaxed text-neutral-600">
            Each answer comes with explanations, so you don’t just memorize —
            you actually understand.
          </p>
        </div>
      </div>

      <div className="flex items-start gap-4">
        <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-amber-100">
          <LuTrendingUp className="h-4 w-4 text-amber-600" />
        </div>
        <div className="">
          <h4 className="mb-1 text-base font-semibold text-neutral-900">
            Progress Tracking
          </h4>
          <p className="text-sm leading-relaxed text-neutral-600">
            Save questions, revisit answers, and build your own interview-ready
            knowledge base over time.
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default FeaturePoints;
