import appI18n from "../../../i18n/index.js";
import { create } from "zustand";
import {
  getCargoTypesApi,
  getCurrenciesApi,
  getLeadParamsApi,
  getTNVEDApi,
  searchCargoTypeApi,
} from "./api";

let tnvedRequestId = 0;
let cargoTypesRequestId = 0;

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
  tnvedCount: 0,

  tnvedPerPage: 1,
  perPage: 1,

  error: null,

  getCargoTypes: async (params) => {
    const requestId = ++cargoTypesRequestId;
    try {
      set({ isCargoTypesLoading: true, error: null });

      const response = await getCargoTypesApi(params);
      if (requestId !== cargoTypesRequestId) return;

      set({
        cargoTypes: response.data.results,
        count: response.data.count,
        perPage: response.data.per_page,
        isCargoTypesLoading: false,
      });
    } catch (e) {
      if (requestId !== cargoTypesRequestId) return;
      set({
        error: e.message,
        isCargoTypesLoading: false,
      });
    }
  },

  searchCargoType: async (params) => {
    const requestId = ++cargoTypesRequestId;
    try {
      set({ isCargoTypesLoading: true, error: null });

      const response = await searchCargoTypeApi(params);
      if (requestId !== cargoTypesRequestId) return;

      set({
        cargoTypes: response.data.results,
        isCargoTypesLoading: false,
      });
    } catch (e) {
      if (requestId !== cargoTypesRequestId) return;
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
          error.message || appI18n.t("ui.lead_parameters_load_failed"),
        isLeadParamsLoading: false,
      });
    }
  },

  getLTNVEDOptions: async (params) => {
    const requestId = ++tnvedRequestId;
    set({ isTNVEDLoading: true, tnvedError: null });
    try {
      const response = await getTNVEDApi(params);
      if (requestId !== tnvedRequestId) return;

      console.log(response);
      set({
        tnvedOptions: response.data,
        isTNVEDLoading: false,
        tnvedCount: response.data.count,
      });
    } catch (error) {
      if (requestId !== tnvedRequestId) return;
      set({
        tnvedError:
          error.message || appI18n.t("ui.commodity_directory_load_failed"),
        isTNVEDLoading: false,
      });
    }
  },
}));
