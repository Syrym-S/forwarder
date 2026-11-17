import appI18n from "../../../i18n/index.js";
import { create } from "zustand";
import {
  approveFactoreLineApi,
  getFactorLineDetailsApi,
  getFactorsLineApi,
  regenerateFactoringLineApi,
} from "./api";

let latestLinesRequest = 0;

export const useFactorStore = create((set) => ({
  factoringsLine: [],
  linesError: null,
  factoringLineDetails: null,

  isLoading: false,
  isApproveLoading: false,
  isRegenerateLoading: false,
  regenerateError: null,

  getFactoringsLine: async () => {
    const request = ++latestLinesRequest;
    try {
      set({ isLoading: true, linesError: null });

      const response = await getFactorsLineApi();

      if (request !== latestLinesRequest) return false;
      if (!Array.isArray(response.data?.data)) throw new Error(appI18n.t("dashboard.loading_error"));

      set({ factoringsLine: response.data.data, isLoading: false });
      return true;
    } catch (e) {
      if (request !== latestLinesRequest) return false;
      const message = e.response?.data?.message || e.message;
      set({ isLoading: false, linesError: typeof message === "string" ? message : true });
      return false;
    }
  },

  getFactoringLineDetails: async (id) => {
    try {
      set({ isLoading: true });

      const response = await getFactorLineDetailsApi(id);

      set({ factoringLineDetails: response.data, isLoading: false });
      return true;
    } catch (e) {
      console.log(e);
      set({ isLoading: false });
      return false;
    }
  },

  regenerateFactoringLine: async (lineId) => {
    set({ isRegenerateLoading: true, regenerateError: null });
    try {
      const response = await regenerateFactoringLineApi(lineId);
      return response.data;
    } catch (error) {
      set({
        regenerateError:
          error.response?.data?.message ||
          error.message ||
          appI18n.t("ui.factoring_line_document_regeneration_failed"),
      });
      throw error;
    } finally {
      set({ isRegenerateLoading: false });
    }
  },

  approveFactoreLine: async (id) => {
    try {
      set({ isApproveLoading: true });

      const response = await approveFactoreLineApi(id);

      set({ isApproveLoading: false });
      return response;
    } catch (e) {
      console.log(e);
      set({ isApproveLoading: false });
    }
  },
}));
