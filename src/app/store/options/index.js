import { create } from "zustand";
import { getCargoTypesApi, getCurrenciesApi, searchCargoTypeApi } from "./api";

export const useOptionsStore = create((set) => ({
  cargoTypes: [],
  currencies: [],

  isCargoTypesLoading: false,
  isCurrenciesLoading: false,

  count: 0,
  perPage: 1,

  error: null,

  getCargoTypes: async (params) => {
    try {
      set({ isCargoTypesLoading: true, error: null });

      const response = await getCargoTypesApi(params);

      set({
        cargoTypes: response.data.results,
        count: response.data.count,
        perPage: response.data.per_page,
        isCargoTypesLoading: false,
      });
    } catch (e) {
      set({
        error: e.message,
        isCargoTypesLoading: false,
      });
    }
  },

  searchCargoType: async (params) => {
    try {
      set({ isCargoTypesLoading: true, error: null });

      const response = await searchCargoTypeApi(params);

      set({
        cargoTypes: response.data.results,
        isCargoTypesLoading: false,
      });
    } catch (e) {
      set({
        error: e.message,
        isCargoTypesLoading: false,
      });
    }
  },

  getCurrencies: async (params) => {
    try {
      set({ isCurrenciesLoading: true, error: null });

      const response = await getCurrenciesApi(params);

      set({
        currencies: response.data.results,
        count: response.data.count,
        perPage: response.data.per_page,
        isCurrenciesLoading: false,
      });
    } catch (e) {
      set({
        error: e.message,
        isCurrenciesLoading: false,
      });
    }
  },
}));
