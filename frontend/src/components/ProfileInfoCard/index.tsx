import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    clearUser();
    navigate("/");
  };
  return (
    user && (
      <div className="flex items-center">
        <img
          src={user?.profileImageUrl}
          alt="profile"
          className="mr-3 h-11 w-11 rounded-full bg-gray-300"
        />
        <div>
          <div className="text-[15px] leading-3 font-bold text-black">
            {user?.name || ""}
          </div>
          <button
            className="text-semibold cursor-pointer text-amber-600 hover:underline"
            onClick={handleLogout}
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default ProfileInfoCard;
