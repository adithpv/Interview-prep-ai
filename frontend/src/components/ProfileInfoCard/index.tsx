import { useContext, useState } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { getAvatar } from "../Shared/getAvatar";
import axiosInstance from "../../utils/axios";
import { API_PATHS } from "../../utils/apiPaths";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
      clearUser();
      navigate("/");
    } catch {
      clearUser();
      navigate("/");
    } finally {
      setIsLoggingOut(false);
    }
  };
  return (
    user && (
      <div className="flex items-center">
        {getAvatar(user)}
        <div>
          <div className="text-[15px] leading-3 font-bold text-black">
            {user?.name || ""}
          </div>
          <button
            className="text-semibold cursor-pointer text-amber-600 hover:underline disabled:cursor-not-allowed disabled:opacity-50"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging out..." : "Logout"}
          </button>
        </div>
      </div>
    )
  );
};

export default ProfileInfoCard;
