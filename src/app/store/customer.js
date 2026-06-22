import { create } from "zustand";
import { getCustomers } from "./leads/api";

export const useCustomerStore = create((set) => ({
  customers: [],
  isLoading: false,
  error: null,

  getCustomers: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await getCustomers();

      set({
        customers: response.data.results,
        isLoading: false,
      });
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });
    }
  },
}));
