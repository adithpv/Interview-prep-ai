import { motion } from "framer-motion";
import LOGO from "../../assets/logo-one.svg";
import ProfileInfoCard from "../ProfileInfoCard";
import type { User } from "../../context/userContext";

interface HeroProps {
  user: User | null;
  handleCTA: () => void;
  setOpenAuthModel: (isOpen: boolean) => void;
}

const Hero = ({ user, handleCTA, setOpenAuthModel }: HeroProps) => {
  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16"
      >
        <div className="flex items-center justify-between">
          <motion.div
            className="flex items-center gap-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="flex h-10 w-10 items-center justify-center">
              <img
                src={LOGO}
                alt="App Logo"
                className="h-6 w-6 object-contain"
              />
            </div>

            <span className="text-2xl font-semibold text-neutral-900">
              Interview Prep
            </span>
          </motion.div>

          {user ? (
            <ProfileInfoCard />
          ) : (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-neutral-900 pt-3 pr-6 pb-3 pl-6 text-sm font-medium text-white transition hover:bg-black"
              onClick={() => setOpenAuthModel(true)}
            >
              Get started
            </motion.button>
          )}
        </div>
      </motion.header>
      <div className="">
        <motion.h1
          className="text-4xl font-medium tracking-tight text-neutral-900 sm:text-5xl md:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Get interview questions tailored to your —{" "}
          <span className="font-normal italic">
            role, skills, and experience
          </span>
        </motion.h1>

        <motion.p
          className="mt-5 font-sans leading-relaxed text-neutral-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Simply enter your job role, topics, and years of experience — get back
          curated interview questions with clear answers, and dive deeper
          whenever you need.
        </motion.p>

        <motion.div
          className="mt-8 flex items-center gap-3"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-neutral-900 pt-3 pr-6 pb-3 pl-6 text-sm font-medium text-white transition hover:bg-black"
            onClick={handleCTA}
          >
            Get started
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 rounded-full border border-black/10 pt-3 pr-6 pb-3 pl-6 text-sm font-medium transition hover:bg-white/60"
          >
            Explore Answers
          </motion.button>
        </motion.div>
      </div>
    </>
  );
};

export default Hero;
