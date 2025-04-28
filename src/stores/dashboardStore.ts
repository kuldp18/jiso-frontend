/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import {
  getDashboardSummary,
  getMoodAnalytics,
  getJournalAnalytics,
  getGoalAnalytics,
  getInsightAnalytics,
  getChatAnalytics,
} from "@/api/dashboard";

interface DashboardState {
  isLoading: boolean;
  error: string | null;
  dashboardData: any | null;
  moodAnalytics: any | null;
  journalAnalytics: any | null;
  goalAnalytics: any | null;
  insightAnalytics: any | null;
  chatAnalytics: any | null;

  // Actions
  fetchDashboardSummary: () => Promise<any>;
  fetchMoodAnalytics: (period?: string) => Promise<any>;
  fetchJournalAnalytics: (period?: string) => Promise<any>;
  fetchGoalAnalytics: () => Promise<any>;
  fetchInsightAnalytics: () => Promise<any>;
  fetchChatAnalytics: (period?: string) => Promise<any>;
  clearDashboard: () => void;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  isLoading: false,
  error: null,
  dashboardData: null,
  moodAnalytics: null,
  journalAnalytics: null,
  goalAnalytics: null,
  insightAnalytics: null,
  chatAnalytics: null,

  fetchDashboardSummary: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getDashboardSummary();
      // Handle data structure correctly - the structure seems to have a 'data' property that wasn't being accessed
      const dashboardData = response.data || response;
      set({
        dashboardData,
        isLoading: false,
      });
      return dashboardData;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to load dashboard data";
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw new Error(errorMessage);
    }
  },

  fetchMoodAnalytics: async (period = "30days") => {
    set({ isLoading: true, error: null });
    try {
      const response = await getMoodAnalytics(period);
      const data = response.data;
      set({
        moodAnalytics: data,
        isLoading: false,
      });
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to load mood analytics";
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw new Error(errorMessage);
    }
  },

  fetchJournalAnalytics: async (period = "30days") => {
    set({ isLoading: true, error: null });
    try {
      const response = await getJournalAnalytics(period);
      const data = response.data;
      set({
        journalAnalytics: data,
        isLoading: false,
      });
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to load journal analytics";
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw new Error(errorMessage);
    }
  },

  fetchGoalAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getGoalAnalytics();
      const data = response.data;
      set({
        goalAnalytics: data,
        isLoading: false,
      });
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to load goal analytics";
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw new Error(errorMessage);
    }
  },

  fetchInsightAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await getInsightAnalytics();
      const data = response.data;
      set({
        insightAnalytics: data,
        isLoading: false,
      });
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to load insight analytics";
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw new Error(errorMessage);
    }
  },

  fetchChatAnalytics: async (period = "30days") => {
    set({ isLoading: true, error: null });
    try {
      const response = await getChatAnalytics(period);
      const data = response.data;
      set({
        chatAnalytics: data,
        isLoading: false,
      });
      return data;
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || "Failed to load chat analytics";
      set({
        error: errorMessage,
        isLoading: false,
      });
      throw new Error(errorMessage);
    }
  },

  clearDashboard: () => {
    set({
      dashboardData: null,
      moodAnalytics: null,
      journalAnalytics: null,
      goalAnalytics: null,
      insightAnalytics: null,
      chatAnalytics: null,
      error: null,
    });
  },
}));
