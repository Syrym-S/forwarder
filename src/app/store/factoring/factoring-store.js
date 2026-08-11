import { create } from "zustand";
import {
  acceptFactoringApi,
  createFactoringApi,
  createFactoringLineApi,
  getFactorDetailsApi,
  getFactoringDetailsApi,
  getFactoringsApi,
  searchFactorApi,
} from "./api";

export const useFactoringStore = create((set) => ({
  factorings: [],
  factors: [],

  factoringDetails: null,
  factorDetails: null,

  isLoading: false,
  isFactorDetailsLoading: false,
  isSearchLoading: false,
  isConfirmLoading: false,

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
      set({ isSearchLoading: true, error: null });

      const response = await searchFactorApi(params);

      set({
        factors: response.data.results,
        isSearchLoading: false,
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

  getFactorDetails: async (id) => {
    try {
      set({ isFactorDetailsLoading: true, error: null });

      const response = await getFactorDetailsApi(id);

      console.log(response);

      set({
        factorDetails: response.data,
        isFactorDetailsLoading: false,
      });

      return response.data;
    } catch (e) {
      set({
        error: e.message,
        isFactorDetailsLoading: false,
      });

      throw e;
    }
  },

  clearFactoringDetails: () => {
    set({ factoringDetails: null });
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

  createFactoringLine: async (payload) => {
    try {
      set({ isLoading: true, error: null });

      const response = await createFactoringLineApi(payload);

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

  acceptFactoring: async (factoring_index) => {
    try {
      set({ isConfirmLoading: true, error: null });

      const response = await acceptFactoringApi(factoring_index);

      set({
        isConfirmLoading: false,
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
}));
