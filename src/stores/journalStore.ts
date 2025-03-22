/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { createNewJournalEntry, getJournalEntries } from "@/api/journal";
import { JournalEntry, NewJournalEntry } from "@/types/journal.types";

interface JournalStore {
  journalEntries: JournalEntry[];
  isLoading: boolean;
  error: string | null;
  createJournalEntry: (entry: NewJournalEntry) => Promise<void>;
  fetchJournalEntries: () => Promise<void>;
}

export const useJournalStore = create<JournalStore>((set) => ({
  journalEntries: [],
  isLoading: false,
  error: null,

  createJournalEntry: async (entry: NewJournalEntry) => {
    set({ isLoading: true, error: null });

    try {
      const data = await createNewJournalEntry(entry);
      set((state) => ({
        journalEntries: [...state.journalEntries, data.entry],
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Error while creating new journal entry",
        isLoading: false,
      });
    }
  },
  fetchJournalEntries: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await getJournalEntries();
      set({ journalEntries: data.entries, isLoading: false });
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message ||
          "Error while fetching journal entries",
        isLoading: false,
      });
    }
  },
}));
