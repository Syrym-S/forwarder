import { create } from "zustand";
import { getStatsApi } from "./api";

let latestRequest = 0;

export const useStatsStore = create((set) => ({
  stats: [],

  isLoading: false,

  error: null,

  getStats: async (params) => {
    const requestId = ++latestRequest;
    try {
      set({ isLoading: true, error: null });

      const response = await getStatsApi(params);

      if (requestId === latestRequest) {
        set({ stats: response, isLoading: false, error: null });
      }

      return response;
    } catch (e) {
      if (requestId !== latestRequest) return;
      set({
        error: e.message,
        isLoading: false,
      });

      throw e;
    }
  },
}));
