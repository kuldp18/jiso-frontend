import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Refresh token interceptor - handles refreshing the token when it expires
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh if:
    // 1. Status is 401 (Unauthorized)
    // 2. We haven't tried to refresh already for this request
    // 3. The user is logged in according to the auth store
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      useAuthStore.getState().isAuthenticated
    ) {
      originalRequest._retry = true;

      try {
        // Call backend refresh endpoint
        await api.post("/auth/refresh");

        // Token has been refreshed and new cookies are set
        // Retry the original request with the new token
        return api(originalRequest);
      } catch (refreshError) {
        // Clear authentication state on refresh failure
        useAuthStore.getState().logout();

        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // For other errors, just pass them through
    return Promise.reject(error);
  }
);

export default api;
