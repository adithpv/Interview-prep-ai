import { useContext } from "react";
import { Link } from "react-router-dom";
import { LuLayoutDashboard } from "react-icons/lu";
import LOGO from "../../assets/logo-one.svg";
import ProfileInfoCard from "../ProfileInfoCard";
import { UserContext } from "../../context/userContext";

const Navbar = () => {
  const { user } = useContext(UserContext);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl shadow-sm">
            <img src={LOGO} alt="Logo" className="h-5 w-5 object-contain" />
          </div>
          <span className="text-lg font-semibold tracking-tight text-neutral-900">
            Interview Prep
          </span>
        </Link>
        <div className="flex items-center gap-4">
          {user && (
            <Link
              to="/dashboard"
              className="flex items-center justify-center rounded-full bg-gray-100 p-2.5 text-gray-700 transition hover:bg-amber-100 hover:text-amber-700"
              title="Go to Dashboard"
            >
              <LuLayoutDashboard size={20} />
            </Link>
          )}
          <ProfileInfoCard />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
