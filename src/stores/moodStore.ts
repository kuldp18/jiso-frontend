/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { createNewMoodEntry, getMoodEntries } from "@/api/mood";
import { MoodEntry } from "@/types/mood.types";

interface MoodStore {
  moodEntries: MoodEntry[];
  isLoading: boolean;
  error: string | null;
  createMoodEntry: (entry: MoodEntry) => Promise<void>;
  fetchMoodEntries: () => Promise<void>;
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
}));
