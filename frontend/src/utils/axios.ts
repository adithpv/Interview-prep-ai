import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

let csrfTokenPromise: Promise<string> | null = null;

axiosInstance.interceptors.request.use(
  async (config) => {
    if (config.method && !["get", "head", "options"].includes(config.method.toLowerCase())) {
      if (!axiosInstance.defaults.headers.common["x-csrf-token"]) {
        if (!csrfTokenPromise) {
          csrfTokenPromise = axios.get(`${BASE_URL}/api/csrf-token`, { withCredentials: true }).then(res => res.data.token);
        }
        const token = await csrfTokenPromise;
        axiosInstance.defaults.headers.common["x-csrf-token"] = token;
        config.headers["x-csrf-token"] = token;
      } else {
        config.headers["x-csrf-token"] = axiosInstance.defaults.headers.common["x-csrf-token"];
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
        return Promise.reject(error);
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
