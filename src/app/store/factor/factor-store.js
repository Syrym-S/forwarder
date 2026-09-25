import { create } from "zustand";
import {
  approveFactoreLineApi,
  getFactorLineDetailsApi,
  getFactorsLineApi,
  regenerateFactoringLineApi,
} from "./api";

export const useFactorStore = create((set) => ({
  factoringsLine: [],
  factoringLineDetails: null,

  isLoading: false,
  isApproveLoading: false,
  isRegenerateLoading: false,
  regenerateError: null,

  getFactoringsLine: async () => {
    try {
      set({ isLoading: true });

      const response = await getFactorsLineApi();

      set({ factoringsLine: response.data.data, isLoading: false });
    } catch (e) {
      console.log(e);
      set({ isLoading: false });
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
          "Не удалось перегенерировать документ факторинговой линии",
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
