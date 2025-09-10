import { Link } from "react-router-dom";
import LOGO from "../../assets/logo-one.svg";
import ProfileInfoCard from "../ProfileInfoCard";

const Navbar = () => {
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
        <ProfileInfoCard />
      </div>
    </header>
  );
};

export default Navbar;
