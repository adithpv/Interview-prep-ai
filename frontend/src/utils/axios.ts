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

import { toast } from "./errorHandler";

let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: unknown) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

axiosInstance.interceptors.response.use(
  (response) => {
    // Unwrap the standardized API response
    if (response.data && typeof response.data === "object" && "success" in response.data) {
      if (response.data.success) {
        if (response.data.data !== undefined) {
          response.data = response.data.data;
        }
      }
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => {
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await axios.post(`${BASE_URL}/api/auth/refresh`, {}, { withCredentials: true });
        processQueue(null);
        return axiosInstance(originalRequest);
      } catch (err) {
        processQueue(err);
        if (window.location.pathname !== "/") {
          window.location.href = "/";
        }
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    } else if (error.response?.status === 500) {
      toast.error("Server Error", { description: "Please try again later." });
    } else if (error?.code === "ENCONNABORTED") {
      toast.error("Request Timeout", { description: "Please try again later." });
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
