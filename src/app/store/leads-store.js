import { create } from "zustand";
import axios from "axios";
import { getLeads } from "./api";

export const useLeadsStore = create((set) => ({
  leads: [],
  isLoading: false,
  error: null,

  fetchLeads: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await getLeads();

      set({
        leads: response.data,
        isLoading: false,
      });
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });
    }
  },
}));
