import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Refresh token interceptor - handles refreshing the token when it expires
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Call your backend refresh endpoint
        await api.post("/auth/refresh");

        // Token has been refreshed and new cookies are set
        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // If refresh token is invalid or expired, redirect to login
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    // For other errors, just pass them through
    return Promise.reject(error);
  }
);

export default api;
