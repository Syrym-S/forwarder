import { create } from "zustand";
import {
  createFactoringApi,
  getFactoringDetailsApi,
  getFactoringsApi,
  searchFactorApi,
} from "./api";

export const useFactoringStore = create((set) => ({
  factorings: [],
  factors: [],
  factoringDetails: null,
  isLoading: false,
  error: null,
  count: 0,
  perPage: 1,

  getFactorings: async (params) => {
    try {
      set({ isLoading: true, error: null });

      const response = await getFactoringsApi(params);

      set({
        factorings: response.data.data,
        count: response.data.total,
        perPage: response.data.per_page,
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

  searchFactor: async (params) => {
    try {
      set({ isLoading: true, error: null });

      const response = await searchFactorApi(params);

      set({
        factors: response.data.results,
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
