import { create } from "zustand";
import {
  getCargoTypesApi,
  getCurrenciesApi,
  getLeadParamsApi,
  getTNVEDApi,
  searchCargoTypeApi,
} from "./api";

export const useOptionsStore = create((set, get) => ({
  leadParams: {},
  isLeadParamsLoading: false,
  leadParamsError: null,

  cargoTypes: [],
  currencies: [],
  tnvedOptions: [],
  isTNVEDLoading: false,
  tnvedError: null,

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

  getLeadParams: async () => {
    if (get().isLeadParamsLoading) return;

    set({ isLeadParamsLoading: true, leadParamsError: null });
    try {
      const response = await getLeadParamsApi();
      set({ leadParams: response.data, isLeadParamsLoading: false });
    } catch (error) {
      set({
        leadParamsError:
          error.message || "Не удалось загрузить параметры перевозки",
        isLeadParamsLoading: false,
      });
    }
  },

  getLTNVEDOptions: async (params) => {
    set({ isTNVEDLoading: true, tnvedError: null });
    try {
      const response = await getTNVEDApi(params);
      set({ tnvedOptions: response.data, isTNVEDLoading: false });
    } catch (error) {
      set({
        tnvedError: error.message || "Не удалось загрузить справочник ТН ВЭД",
        isTNVEDLoading: false,
      });
    }
  },
}));
