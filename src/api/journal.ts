import api from "@/api";
import { EditJournalEntry, NewJournalEntry } from "@/types/journal.types";

export const createNewJournalEntry = async (entry: NewJournalEntry) => {
  try {
    const response = await api.post("/journals/create", entry);
    return response.data;
  } catch (error) {
    console.error("Error while creating new journal entry:", error);
    throw error;
  }
};

export const getJournalEntries = async () => {
  try {
    const response = await api.get("/journals");
    return response.data;
  } catch (error) {
    console.error("Error while fetching journal entries:", error);
    throw error;
  }
};

export const deleteJournalEntry = async (journalId: string) => {
  try {
    const response = await api.delete(`/journals/${journalId}`);
    return response.data;
  } catch (error) {
    console.error("Error while deleting journal entry:", error);
    throw error;
  }
};

export const editJournalEntry = async (
  journalId: string,
  newEntry: EditJournalEntry
) => {
  try {
    const response = await api.patch(`/journals/${journalId}`, newEntry);
    return response.data;
  } catch (error) {
    console.error("Error while editing journal entry:", error);
    throw error;
  }
};
