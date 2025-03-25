/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { createNewChat, fetchUserChat, sendChatMessage } from "@/api/chat";

interface ChatStore {
  currentChatId: string | null;
  error: string | null;
  isLoading: boolean;
  createChat: () => Promise<void>;
  fetchChat: (chatId: string) => Promise<void>;
  sendMessage: (chatId: string, message: string) => Promise<void>;
}

export const ChatStore = create<ChatStore>((set) => ({
  currentChatId: null,
  error: null,
  isLoading: false,

  createChat: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await createNewChat();
      if (!data.chat) {
        throw new Error("Error while creating chat");
      }
      set({ currentChatId: data.chatId, isLoading: false });
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error while creating chat",
        isLoading: false,
        currentChatId: null,
      });
      throw error;
    }
  },

  fetchChat: async (chatId: string) => {
    set({ isLoading: true, error: null });

    try {
      const data = await fetchUserChat(chatId);
      set({ currentChatId: chatId, isLoading: false });
      return data.chat;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error while fetching chat",
        isLoading: false,
        currentChatId: null,
      });
      throw error;
    }
  },

  sendMessage: async (chatId: string, message: string) => {
    set({ isLoading: true, error: null });

    try {
      const data = await sendChatMessage(chatId, message);
      set({ isLoading: false });
      return data.response; // ai message
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error while sending message",
        isLoading: false,
      });
      throw error;
    }
  },
}));
