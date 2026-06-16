import { create } from "zustand";
import { createTender, getTenderDetails, getTenders } from "./api";
import axios from "axios";

export const useTendersStore = create((set) => ({
  tenders: [],
  currentTender: null,
  isLoading: [],
  count: 0,
  perPage: 1,

  getTenders: async (params) => {
    try {
      set({ isLoading: true });

      const response = await getTenders(params);

      set({
        isLoading: false,
        count: response.data.total,
        perPage: response.data.limit,
        tenders: response.data.data,
      });
    } catch (e) {
      console.log(e);
    }
  },
  getTenderDetails: async (id) => {
    try {
      set({ isLoading: true });

      const response = await getTenderDetails(id);

      set({ isLoading: false, currentTender: response.data });
    } catch (e) {
      console.log(e);
    }
  },
  createTender: async (payload) => {
    try {
      const response = await createTender(payload);

      return response;
    } catch (e) {
      console.log(e);
    }
  },
}));
