import { create } from "zustand";
import { getFactorLineDetailsApi, getFactorsLineApi } from "./api";

export const useFactorStore = create((set) => ({
  factoringsLine: [],
  factoringLineDetails: null,

  isLoading: false,

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
    } catch (e) {
      console.log(e);
      set({ isLoading: false });
    }
  },
}));
