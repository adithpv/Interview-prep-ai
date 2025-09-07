import { LuSparkles } from "react-icons/lu";
import { FaReact, FaGithub, FaLinkedin } from "react-icons/fa";
import { SiTailwindcss, SiMongodb } from "react-icons/si";
import LOGO from "../../assets/logo-one.svg";
import GEMINI_ICON from "../../assets/gemini-color.svg";

interface FooterProps {
  setOpenAuthModel: (isOpen: boolean) => void;
}

const Footer = ({ setOpenAuthModel }: FooterProps) => {
  return (
    <footer className="relative mx-4 mb-8 rounded-[40px] border border-white/10 bg-neutral-950 text-white shadow-[0_8px_30px_rgba(0,0,0,0.18)] sm:mx-6">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_20%_-20%,rgba(255,255,255,0.06),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_80%_120%,rgba(255,255,255,0.05),transparent_60%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0d_1px,transparent_1px)] [background-size:20px_20px] opacity-[0.15]"></div>
      </div>
      <div className="relative mx-auto max-w-7xl px-6 py-10 sm:px-8">
        <h2 className="text-[12vw] leading-[0.9] font-semibold tracking-tighter sm:text-[9vw] lg:text-[6vw]">
          <span className="block">Smart Interview Prep</span>
          <span className="block text-white/60">Role-Based Q&A</span>
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-white/60">Get Started</p>
            <a
              href="/dashboard"
              className="mt-2 inline-flex items-center gap-3 text-xl font-medium tracking-tight text-white sm:text-2xl"
            >
              <img
                src={LOGO}
                alt="App Logo"
                className="h-6 w-6 flex-shrink-0 object-contain"
              />
              Interview Prep
            </a>
          </div>
          <div>
            <p className="text-sm text-white/60">Quick Access</p>
            <a
              className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-medium text-gray-900 transition hover:bg-white/90"
              onClick={() => setOpenAuthModel(true)}
            >
              <LuSparkles className="h-5 w-5" />
              Generate Questions
            </a>
          </div>
          <div>
            <p className="text-sm text-white/60">Built With</p>
            <div className="mt-2 flex flex-wrap items-center gap-3">
              {/* React */}
              <a
                href="https://react.dev/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-blue-500 transition-shadow duration-300 hover:shadow-[0_0_25px_#61DAFB]"
                aria-label="React"
              >
                <FaReact className="text-2xl" />
              </a>
              {/* Gemini */}
              <a
                href="https://gemini.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white transition-shadow duration-300 hover:shadow-[0_0_25px_#8952E3]"
                aria-label="Gemini AI"
              >
                <img src={GEMINI_ICON} alt="Gemini AI" className="h-6 w-6" />
              </a>
              {/* MongoDB */}
              <a
                href="https://www.mongodb.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-green-600 transition-shadow duration-300 hover:shadow-[0_0_25px_#47A248]"
                aria-label="MongoDB"
              >
                <SiMongodb className="text-2xl" />
              </a>
              {/* Tailwind CSS */}
              <a
                href="https://tailwindcss.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-sky-500 transition-shadow duration-300 hover:shadow-[0_0_25px_#38BDF8]"
                aria-label="Tailwind CSS"
              >
                <SiTailwindcss className="text-2xl" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-white/10"></div>
        <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <p className="text-sm text-white/60">Quick Tips</p>
            <div className="mt-3 grid grid-cols-1 gap-2 text-sm">
              <p>✔ Practice role-based questions first</p>
              <p>✔ Speak your answers out loud</p>
              <p>✔ Review common HR questions</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-white/60">Connect</p>
            <div className="mt-3 flex items-center gap-4">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 hover:bg-white/90"
              >
                <FaGithub className="text-xl" />
              </a>
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-blue-600 hover:bg-white/90"
              >
                <FaLinkedin className="text-xl" />
              </a>
            </div>
          </div>
        </div>

        <p className="mt-6 text-center text-xs text-white/70">
          © {new Date().getFullYear()} Smart Interview Prep — Made for learners
          worldwide
        </p>
      </div>
    </footer>
  );
};

export default Footer;
