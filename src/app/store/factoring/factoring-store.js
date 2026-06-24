import { create } from "zustand";
import {
  createFactoringApi,
  getFactoringDetailsApi,
  getFactoringsApi,
} from "./api";

export const useFactoringStore = create((set) => ({
  factorings: [],
  factoringDetails: null,
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

  getFactoringDetails: async (index) => {
    try {
      set({ isLoading: true, error: null });

      const response = await getFactoringDetailsApi(index);

      set({
        factoringDetails: response.data,
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
