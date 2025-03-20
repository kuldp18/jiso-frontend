import { create } from "zustand";
import { UserSignupData, User } from "@/types/auth.types";
import {
  signupUser,
  verifyUserEmail,
  checkAuthStatus,
  logoutUser,
} from "@/api/auth";

// Define the shape of your auth store state

interface AuthStore {
  user: User | null;
  isAuthenticated: boolean;
  error: string | null;
  isLoading: boolean;
  isCheckingAuth: boolean;
  signup: (userData: UserSignupData) => Promise<void>;
  verifyEmail: (email: string | undefined, pin: string) => Promise<void>;
  checkAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,

  signup: async (userData: UserSignupData) => {
    set({ isLoading: true, error: null });

    try {
      const data = await signupUser(userData);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error while signing up",
        isLoading: false,
      });
      throw error;
    }
  },

  verifyEmail: async (email: string | undefined, pin: string) => {
    set({ isLoading: true, error: null });
    try {
      const data = await verifyUserEmail(email, pin);
      set({ user: data.user, isAuthenticated: true, isLoading: false });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error while verifying email",
        isLoading: false,
      });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const data = await checkAuthStatus();
      set({
        user: data.user,
        isAuthenticated: true,
        isCheckingAuth: false,
      });
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      set({
        error: null,
        isCheckingAuth: false,
        isAuthenticated: false,
      });
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await logoutUser();
      set({ user: null, isAuthenticated: false, isLoading: false });
      return data;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error while logging out",
        isLoading: false,
      });
      throw error;
    }
  },
}));
