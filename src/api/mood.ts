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

export const deleteMoodEntry = async (moodId: string) => {
  try {
    const response = await api.delete(`/moods/${moodId}`);
    return response.data;
  } catch (error) {
    console.error("Error while deleting mood entry:", error);
    throw error;
  }
};

export const editMoodEntry = async (
  moodId: string,
  newEntry: {
    emotions?: string[];
    description?: string;
  }
) => {
  try {
    const response = await api.patch(`/moods/${moodId}`, newEntry);
    return response.data;
  } catch (error) {
    console.error("Error while editing mood entry:", error);
    throw error;
  }
};
