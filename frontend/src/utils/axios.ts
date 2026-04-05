import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Avoid infinite loops
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        await axios.post(`${BASE_URL}/api/auth/refresh`, {}, { withCredentials: true });
        return axiosInstance(originalRequest);
      } catch (err) {
        window.location.href = "/";
      }
    } else if (error.response?.status === 500) {
      console.error("Server error, Please try again later");
    } else if (error?.code === "ENCONNABORTED") {
      console.error("Request timeout, Please try again later");
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
