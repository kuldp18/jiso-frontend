/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import {
  createNewJournalEntry,
  deleteJournalEntry,
  editJournalEntry,
  getJournalEntries,
} from "@/api/journal";
import {
  EditJournalEntry,
  JournalEntry,
  NewJournalEntry,
} from "@/types/journal.types";

interface JournalStore {
  journalEntries: JournalEntry[];
  isLoading: boolean;
  error: string | null;
  createJournalEntry: (entry: NewJournalEntry) => Promise<void>;
  fetchJournalEntries: () => Promise<void>;
  editJournal: (journalId: string, newEntry: EditJournalEntry) => Promise<void>;
  deleteJournal: (journalId: string) => Promise<void>;
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
      if (error.response?.status === 404) {
        set({
          journalEntries: [],
          isLoading: false,
          error: null,
        });
      } else {
        set({
          error:
            error.response?.data?.message ||
            "Error while fetching journal entries",
          isLoading: false,
        });
      }
    }
  },

  editJournal: async (journalId: string, newEntry: EditJournalEntry) => {
    set({ isLoading: true, error: null });

    try {
      const data = await editJournalEntry(journalId, newEntry);
      set((state) => ({
        journalEntries: state.journalEntries.map((entry) =>
          entry._id === journalId ? { ...entry, ...data.journalEntry } : entry
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Error while editing journal entry",
        isLoading: false,
      });
    }
  },

  deleteJournal: async (journalId: string) => {
    set({ isLoading: true, error: null });

    try {
      await deleteJournalEntry(journalId);
      set((state) => ({
        journalEntries: state.journalEntries.filter(
          (entry) => entry._id !== journalId
        ),
        isLoading: false,
      }));
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Error while deleting journal entry",
        isLoading: false,
      });
    }
  },
}));
