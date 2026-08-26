import { create } from "zustand";

export const useSoketLeadMessagesStore = create((set) => ({
  leadMessages: [],

  addMessage: (message) => {
    set((state) => ({
      leadMessages: [...state.leadMessages, message],
    }));
  },
}));
