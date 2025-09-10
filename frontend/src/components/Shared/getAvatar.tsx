import type { User } from "../../context/userContext";

export const getAvatar = (user: User) => {
  if (user?.profileImageUrl) {
    return (
      <img
        src={user.profileImageUrl}
        alt="profile"
        className="mr-3 h-11 w-11 rounded-full bg-gray-300 object-cover"
      />
    );
  }

  const firstLetter = user?.name?.charAt(0).toUpperCase() || "?";
  return (
    <div className="mr-3 flex h-11 w-11 items-center justify-center rounded-full bg-amber-500 text-lg font-bold text-white">
      {firstLetter}
    </div>
  );
};
