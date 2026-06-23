import { create } from "zustand";
import { getCustomers, getCustomerDetailsApi, searchCustomerApi } from "./api";

export const useCustomerStore = create((set) => ({
  customers: [],
  customerDetails: null,
  isLoading: false,
  error: null,
  count: 0,
  perPage: 1,

  getCustomers: async (params) => {
    try {
      set({ isLoading: true, error: null });

      const response = await getCustomers(params);

      set({
        customers: response.data.results,
        count: response.data.count,
        perPage: response.data.per_page,
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

  searchCustomers: async (params) => {
    try {
      set({ isLoading: true, error: null });

      const response = await searchCustomerApi(params);

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
