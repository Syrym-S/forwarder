import { create } from "zustand";
import { createFactoringApi, getFactoringsApi } from "./api";

export const useFactoringStore = create((set) => ({
  factorings: [],
  isLoading: false,
  error: null,

  getFactorings: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await getFactoringsApi();

      set({
        factorings: response.data.data,
        isLoading: false,
      });

      return response.data;
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });

      throw e;
    }
  },

  createFactoring: async (payload) => {
    try {
      set({ isLoading: true, error: null });

      const response = await createFactoringApi(payload);

      set({
        isLoading: false,
      });

      return response.data;
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });

      console.error("Payload:", payload);
      console.error("Response:", e.response?.data);
      throw e;
    }
  },
}));
