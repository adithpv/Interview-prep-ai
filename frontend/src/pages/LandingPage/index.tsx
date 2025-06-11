import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";
import HERO from "../../assets/hero.png";
import { APP_FEATURES } from "../../utils/data";
import Login from "../Auth/Login";
import SignUp from "../Auth/SignUp";
import Modal from "../../components/Modal";

const LandingPage = () => {
  const [openAuthModel, setOpenAuthModel] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");
  const navigate = useNavigate();

  const handleCTA = () => {};

  return (
    <>
      <div className="min-h-full w-full bg-[#fffcef]">
        <div className="absolute top-0 left-0 h-[500px] w-[500px] bg-amber-200/20 blur-[65px]" />
        <div className="relative z-10 container mx-auto px-4 pt-6 pb-[200px]">
          <header className="mb-16 flex items-center justify-between">
            <div className="text-xl font-bold text-black">
              Interview Ready AI
            </div>
            <button
              className="cursor-pointer rounded-full border border-white bg-linear-to-r from-[#ff9324] to-[#e99a4b] px-7 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-black hover:text-white"
              onClick={() => setOpenAuthModel(true)}
            >
              Login / Sign up
            </button>
          </header>
          <div className="flex flex-col items-center md:flex-row">
            <div className="mb-8 w-full pr-4 md:mb-8 md:w-1/2">
              <div className="mb-2 flex items-center justify-start">
                <div className="flex items-center gap-2 rounded-full border border-amber-300 bg-amber-100 px-3 py-1 text-[13px] font-semibold text-amber-600">
                  <LuSparkles /> AI Powered
                </div>
              </div>
              <h1 className="mb-6 text-5xl leading-tight font-medium text-black">
                Ace Interview with <br />{" "}
                <span className="animate-text-shine bg-[radial-gradient(circle,_#FF9324_0%,_#FCD760_100%)] bg-[length:200_200%] bg-clip-text font-semibold text-transparent">
                  AI Powered
                </span>{" "}
                Learning
              </h1>
            </div>
            <div className="w-full md:w-1/2">
              <p className="mr-0 mb-6 text-[17px] text-gray-900 md:mr-20">
                Get interview questions tailored to your role, explore deeper
                insights when you need them, and expand your answers
                effortlessly. From structured prep to complete mastery,
                everything you need is in one place — your personalized
                interview toolkit, reimagined.
              </p>
              <button
                className="cursor-pointer rounded-full border border-yellow-50 bg-black px-7 py-2.5 text-sm font-semibold text-white transition-colors hover:border-yellow-300 hover:bg-yellow-100 hover:text-black"
                onClick={handleCTA}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 min-h-full w-full bg-[#FFFCEF]">
        <div>
          <section className="-mt-36 flex items-center justify-center">
            <img src={HERO} alt="hero" className="w-[60vw] rounded-lg" />
          </section>
        </div>

        <div className="mt-10 min-h-full w-full bg-[#fffcef]">
          <div className="container mx-auto px-4 pt-10 pb-20">
            <section className="mt-5">
              <h2 className="mb-12 text-center text-2xl font-medium">
                Features That Make You Shine
              </h2>
              <div className="flex flex-col items-center gap-8">
                {/* first 3 cards */}
                <div className="grid w-full grid-cols-1 gap-8 md:grid-cols-3">
                  {APP_FEATURES.slice(0, 3).map((feature) => (
                    <div
                      className="rounded-xl border border-amber-100 bg-[#fffef8] p-6 shadow-xs shadow-amber-100 transition hover:shadow-lg"
                      key={feature.id}
                    >
                      <h3 className="mb-3 text-base font-semibold">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>

                {/* Remaining card */}
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {APP_FEATURES.slice(3).map((feature) => (
                    <div
                      className="rounded-xl border border-amber-100 bg-[#fffef8] p-6 shadow-xs shadow-amber-100 transition-colors hover:shadow-lg"
                      key={feature.id}
                    >
                      <h3 className="mb-3 text-base font-semibold">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="text-secondary mt-5 bg-gray-50 p-5 text-center text-sm">
          Made with React
        </div>
      </div>

      <Modal
        isOpen={openAuthModel}
        onClose={() => {
          setOpenAuthModel(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div className="">
          {currentPage === "login" && <Login setCurrentPage={currentPage} />}
          {currentPage === "signup" && <SignUp setCurrentPage={currentPage} />}
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;
