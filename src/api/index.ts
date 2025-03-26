import axios from "axios";
import { useAuthStore } from "@/stores/authStore";

// Track refresh attempts globally
let refreshAttempts = 0;
const MAX_REFRESH_ATTEMPTS = 3; // Maximum number of refresh attempts

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
    // 4. We haven't exceeded max refresh attempts
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      useAuthStore.getState().isAuthenticated &&
      refreshAttempts < MAX_REFRESH_ATTEMPTS
    ) {
      originalRequest._retry = true;
      refreshAttempts++;

      try {
        // Call backend refresh endpoint
        await api.post("/auth/refresh");

        // Token has been refreshed and new cookies are set
        // Reset refresh attempts counter on success
        refreshAttempts = 0;

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

    // If we've exceeded max refresh attempts, log the user out and redirect
    if (refreshAttempts >= MAX_REFRESH_ATTEMPTS) {
      refreshAttempts = 0; // Reset for next session
      useAuthStore.getState().logout();

      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }

    // For other errors, just pass them through
    return Promise.reject(error);
  }
);

export default api;
