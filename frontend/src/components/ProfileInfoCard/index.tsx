import { useContext } from "react";
import { UserContext } from "../../context/userContext";
import { useNavigate } from "react-router-dom";
import { getAvatar } from "../Shared/getAvatar";
import axiosInstance from "../../utils/axios";
import { API_PATHS } from "../../utils/apiPaths";

const ProfileInfoCard = () => {
  const { user, clearUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axiosInstance.post(API_PATHS.AUTH.LOGOUT);
      clearUser();
      navigate("/");
    } catch {
      clearUser();
      navigate("/");
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
