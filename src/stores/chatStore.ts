/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import {
  createNewChat,
  fetchAllUserChats,
  fetchUserChat,
  sendChatMessage,
} from "@/api/chat";
import { Chat } from "@/types/chat.types";

interface ChatStore {
  currentChatId: string | null;
  chat: Chat | null;
  error: string | null;
  isLoading: boolean;
  createChat: () => Promise<void>;
  fetchChat: (chatId: string) => Promise<Chat>;
  sendMessage: (chatId: string, message: string) => Promise<string>;
  fetchAllChats: () => Promise<Chat[]>;
}

export const ChatStore = create<ChatStore>((set) => ({
  currentChatId: null,
  chat: null,
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
      set({
        currentChatId: chatId,
        chat: data.chat,
        isLoading: false,
      });
      return data.chat;
    } catch (error: any) {
      set({
        error: error.response?.data?.message || "Error while fetching chat",
        isLoading: false,
        currentChatId: null,
        chat: null,
      });
      throw error;
    }
  },

  fetchAllChats: async () => {
    set({ isLoading: true, error: null });

    try {
      const data = await fetchAllUserChats();
      set({
        currentChatId: null,
        chat: null,
        isLoading: false,
      });
      return data.chats;
    } catch (error: any) {
      set({
        error:
          error.response?.data?.message || "Error while fetching all chats",
        isLoading: false,
        currentChatId: null,
        chat: null,
      });
      throw error;
    }
  },

  sendMessage: async (chatId: string, message: string) => {
    set({ isLoading: true, error: null });

    try {
      const data = await sendChatMessage(chatId, message);

      // Update the chat state with the new message
      set((state) => {
        if (state.chat && state.currentChatId === chatId) {
          const updatedMessages = [
            ...(state.chat.messages || []),
            { sender: "user" as const, content: message },
            { sender: "ai" as const, content: data.response },
          ];

          return {
            isLoading: false,
            chat: {
              ...state.chat,
              messages: updatedMessages,
            },
          };
        }
        return { isLoading: false };
      });

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
