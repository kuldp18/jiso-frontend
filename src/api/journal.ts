import api from "@/api";
import { NewJournalEntry } from "@/types/journal.types";

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
