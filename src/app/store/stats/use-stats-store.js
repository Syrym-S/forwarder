import { create } from "zustand";
import { getStatsApi } from "./api";

export const useStatsStore = create((set) => ({
  stats: [],

  isLoading: false,

  error: null,

  getStats: async (params) => {
    try {
      set({ isLoading: true, error: null });

      const response = await getStatsApi(params);

      set({ stats: response, isLoading: false, error: null });

      return response;
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });

      throw e;
    }
  },
}));
