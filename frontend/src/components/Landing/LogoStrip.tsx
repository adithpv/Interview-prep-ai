import { motion } from "framer-motion";
import { FaGoogle, FaApple, FaMicrosoft, FaAmazon } from "react-icons/fa";
import { SiNetflix } from "react-icons/si";
import { FaMeta } from "react-icons/fa6";

const LogoStrip = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.7 }}
      className="mt-12 border-t border-black/10 pt-8"
    >
      <div className="grid grid-cols-2 place-items-center gap-6 text-neutral-500 sm:grid-cols-3 md:grid-cols-6">
        {/* Google */}
        <div className="flex items-center gap-2">
          <FaGoogle className="h-5 w-5 text-[#4285F4]" />
          <span className="font-sans text-sm font-medium">Google</span>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-2">
          <FaMeta className="h-5 w-5 text-[#0866FF]" />
          <span className="font-sans text-sm font-medium">Meta</span>
        </div>

        {/* Netflix */}
        <div className="flex items-center gap-2">
          <SiNetflix className="h-5 w-5 text-[#E50914]" />
          <span className="font-sans text-sm font-medium">Netflix</span>
        </div>

        {/* Apple */}
        <div className="flex items-center gap-2">
          <FaApple className="h-5 w-5 text-black" />
          <span className="font-sans text-sm font-medium">Apple</span>
        </div>

        {/* Microsoft */}
        <div className="flex items-center gap-2">
          <FaMicrosoft className="h-5 w-5 text-[#00A4EF]" />
          <span className="font-sans text-sm font-medium">Microsoft</span>
        </div>

        {/* Amazon */}
        <div className="flex items-center gap-2">
          <FaAmazon className="h-5 w-5 text-[#FF9900]" />
          <span className="font-sans text-sm font-medium">Amazon</span>
        </div>
      </div>
    </motion.div>
  );
};

export default LogoStrip;
