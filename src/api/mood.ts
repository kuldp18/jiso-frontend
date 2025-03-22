import api from "@/api";
import { MoodEntry } from "@/types/mood.types";

export const createNewMoodEntry = async (entry: MoodEntry) => {
  try {
    const response = await api.post("/moods/create", entry);
    return response.data;
  } catch (error) {
    console.error("Error while creating new mood entry:", error);
    throw error;
  }
};

export const getMoodEntries = async () => {
  try {
    const response = await api.get("/moods");
    return response.data;
  } catch (error) {
    console.error("Error while fetching mood entries:", error);
    throw error;
  }
};
