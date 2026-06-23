import { create } from "zustand";
import { getCustomers, getCustomerDetailsApi } from "./leads/api";

export const useCustomerStore = create((set) => ({
  customers: [],
  customerDetails: null,
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
  getCustomerDetails: async (customer_id) => {
    try {
      set({ isLoading: true, error: null });

      const response = await getCustomerDetailsApi(customer_id);

      set({
        customerDetails: response.data,
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
