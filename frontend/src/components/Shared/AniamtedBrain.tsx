import { motion } from "framer-motion";
import { LuLightbulb } from "react-icons/lu";

const AnimatedLightbulb = () => {
  return (
    <motion.div
      animate={{
        scale: [1, 1.1, 1],
        opacity: [0.7, 1, 0.7],
      }}
      transition={{
        duration: 3,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className="flex h-28 w-full items-center justify-center bg-black"
    >
      <LuLightbulb className="h-10 w-10 text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]" />
    </motion.div>
  );
};

export default AnimatedLightbulb;
