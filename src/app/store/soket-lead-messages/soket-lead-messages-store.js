import { create } from "zustand";
import { getChatsApi } from "./api";

export const useSoketLeadMessagesStore = create((set) => ({
  leadMessages: [],
  chats: [],
  isChatsLoading: false,
  chatsError: null,

  getChats: async () => {
    set({ isChatsLoading: true, chatsError: null });
    try {
      const response = await getChatsApi();
      const data = response.data?.data ?? response.data;
      const chats = Array.isArray(data) ? data : data?.chats ?? data?.data;
      if (!Array.isArray(chats)) throw new Error("Некорректный ответ списка чатов");
      set({ chats, isChatsLoading: false });
    } catch (error) {
      set({ isChatsLoading: false, chatsError: error.response?.data?.message || error.message });
    }
  },

  addMessage: (message) => {
    set((state) => ({
      leadMessages: [...state.leadMessages, message],
    }));
  },
}));
