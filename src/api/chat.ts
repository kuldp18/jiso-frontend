import api from "@/api";

export const createNewChat = async () => {
  try {
    const response = await api.get("/chats/new");
    return response.data;
  } catch (error) {
    console.error("Error while creating new chat:", error);
    throw error;
  }
};

export const fetchUserChat = async (chatId: string) => {
  try {
    const response = await api.get(`/chats/${chatId}`);
    return response.data;
  } catch (error) {
    console.error("Error while fetching chat:", error);
    throw error;
  }
};

export const fetchAllUserChats = async () => {
  try {
    const response = await api.get("/chats");
    return response.data;
  } catch (error) {
    console.error("Error while fetching all chats:", error);
    throw error;
  }
};

export const sendChatMessage = async (chatId: string, message: string) => {
  try {
    const response = await api.post(`/chats/${chatId}/send`, {
      message,
    });

    return response.data;
  } catch (error) {
    console.error("Error while sending message:", error);
    throw error;
  }
};

export const deleteUserChat = async (chatId: string) => {
  try {
    const response = await api.delete(`/chats/${chatId}`);
    return response.data;
  } catch (error) {
    console.error("Error while deleting chat:", error);
    throw error;
  }
};
