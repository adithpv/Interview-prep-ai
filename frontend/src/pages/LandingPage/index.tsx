import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import Login from "../Auth/Login";
import SignUp from "../Auth/SignUp";
import Modal from "../../components/Modal";
import { UserContext } from "../../context/userContext";
import Hero from "../../components/Landing/Hero";
import ProductDemo from "../../components/Landing/ProductDemo";
import FeaturePoints from "../../components/Landing/FeaturePoints";
import LogoStrip from "../../components/Landing/LogoStrip";
import Footer from "../../components/Footer";

const LandingPage = () => {
  const [openAuthModel, setOpenAuthModel] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModel(true);
    } else {
      navigate("/dashboard");
    }
  };

  return (
    <>
      <section className="relative mx-4 mt-6 mb-10 overflow-hidden rounded-[32px] border border-black/10">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-amber-50 to-orange-100"></div>
        <div className="mr-auto ml-auto max-w-7xl pt-16 pr-6 pb-16 pl-6 md:py-20">
          <div className="grid items-start gap-10 md:grid-cols-2">
            <div>
              <Hero
                user={user}
                handleCTA={handleCTA}
                setOpenAuthModel={setOpenAuthModel}
              />
              <FeaturePoints />
            </div>
            <ProductDemo />
          </div>
          <LogoStrip />
        </div>
      </section>
      <Footer setOpenAuthModel={setOpenAuthModel} />
      <Modal
        isOpen={openAuthModel}
        onClose={() => {
          setOpenAuthModel(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div className="">
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;
