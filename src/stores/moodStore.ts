/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import {
  createNewMoodEntry,
  deleteMoodEntry,
  editMoodEntry,
  getMoodEntries,
} from "@/api/mood";
import { MoodEntry } from "@/types/mood.types";

interface MoodStore {
  moodEntries: MoodEntry[];
  isLoading: boolean;
  error: string | null;
  createMoodEntry: (entry: MoodEntry) => Promise<void>;
  fetchMoodEntries: () => Promise<void>;
  deleteMood: (moodId: string) => Promise<void>;
  editMood: (
    moodId: string,
    newEntry: {
      emotions?: string[];
      description?: string;
    }
  ) => Promise<void>;
}

export const useMoodStore = create<MoodStore>((set) => ({
  moodEntries: [],
  isLoading: false,
  error: null,

  createMoodEntry: async (entry: MoodEntry) => {
    set({ isLoading: true, error: null });

    try {
      const data = await createNewMoodEntry(entry);
      set((state) => ({
        moodEntries: [...state.moodEntries, data.entry],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Error while creating new mood entry",
        isLoading: false,
      });
    }
  },

  fetchMoodEntries: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await getMoodEntries();
      set({ moodEntries: data.entries, isLoading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Error while fetching mood entries",
        isLoading: false,
      });
    }
  },

  deleteMood: async (moodId: string) => {
    set({ isLoading: true, error: null });

    try {
      await deleteMoodEntry(moodId);
      set((state) => ({
        moodEntries: state.moodEntries.filter((entry) => entry._id !== moodId),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Error while deleting mood entry",
        isLoading: false,
      });
    }
  },

  editMood: async (
    moodId: string,
    newEntry: {
      emotions?: string[];
      description?: string;
    }
  ) => {
    set({ isLoading: true, error: null });

    try {
      const data = await editMoodEntry(moodId, newEntry);
      set((state) => ({
        moodEntries: state.moodEntries.map((entry) =>
          entry._id === moodId ? { ...entry, ...data.entry } : entry
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Error while editing mood entry",
        isLoading: false,
      });
    }
  },
}));
