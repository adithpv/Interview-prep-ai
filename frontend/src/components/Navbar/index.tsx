import { Link } from "react-router-dom";
import ProfileInfoCard from "../ProfileInfoCard";

const Navbar = () => {
  return (
    <div className="backdrop-blur=[2px] h-16 border-b border-gray-200/50 bg-white py-2.5">
      <div className="container mx-auto flex items-center justify-between gap-5">
        <Link to="/">
          <h2 className="text-lg leading-5 font-medium text-black md:text-xl">
            Interview Ready AI
          </h2>
        </Link>
        <ProfileInfoCard />
      </div>
    </div>
  );
};

export default Navbar;
