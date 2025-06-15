import { createContext, useState, useEffect } from "react";
import type { ReactNode } from "react";
import axiosInstance from "../utils/axios";
import { API_PATHS } from "../utils/apiPaths";

interface User {
  _id: string;
  name: string;
  email: string;
  profileImageUrl?: string;
}

interface UserContextType {
  user: User | null;
  loading: boolean;
  updateUser: (userData: User & { token?: string }) => void;
  clearUser: () => void;
}

export const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  updateUser: () => {},
  clearUser: () => {},
});

interface UserProviderProps {
  children: ReactNode;
}

const UserProvider = ({ children }: UserProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    if (!accessToken) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get<{ user: User }>(
          API_PATHS.AUTH.GET_PROFILE,
        );
        setUser(response.data.user);
      } catch (error) {
        console.error("User not authenticated", error);
        clearUser();
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const updateUser = (userData: User & { token?: string }) => {
    setUser(userData);
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }
    setLoading(false);
  };

  const clearUser = () => {
    setUser(null);
    localStorage.removeItem("token");
  };

  return (
    <UserContext.Provider value={{ user, loading, updateUser, clearUser }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
