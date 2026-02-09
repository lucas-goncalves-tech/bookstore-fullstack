import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

let isRefreshing = false;
let refreshFailed = false;
let failedQueue: Array<{
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}> = [];

const processQueue = (error: AxiosError | null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve();
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    // Skip refresh attempt for auth endpoints to avoid infinite loops
    const isAuthEndpoint = originalRequest?.url?.includes("/auth/");

    // If refresh already failed in this session, don't try again
    if (refreshFailed || isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Queue requests while refresh is in progress
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          // After queue resolves, check if refresh failed
          if (refreshFailed) {
            return Promise.reject(error);
          }
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await api.get("/auth/refresh");
        processQueue(null);
        return api(originalRequest);
      } catch (refreshError) {
        refreshFailed = true;
        processQueue(refreshError as AxiosError);
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

// Reset refresh state on successful login (call this from your login flow)
export const resetRefreshState = () => {
  refreshFailed = false;
  isRefreshing = false;
  failedQueue = [];
};
