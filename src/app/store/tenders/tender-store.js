import { create } from "zustand";
import {
  createTender,
  getTenderDetailsApi,
  getTendersApi,
  updateTender,
} from "./api";
import axios from "axios";

export const useTendersStore = create((set) => ({
  tenders: [],
  currentTender: null,
  isLoading: [],
  count: 0,
  perPage: 1,

  getTenders: async (params) => {
    try {
      set({ isLoading: true });

      const response = await getTendersApi(params);

      set({
        isLoading: false,
        count: response.data.total,
        perPage: response.data.limit,
        tenders: response.data.data,
      });
    } catch (e) {
      console.log(e);
    }
  },
  getTenderDetails: async (id) => {
    try {
      set({ isLoading: true });

      const response = await getTenderDetailsApi(id);

      set({ isLoading: false, currentTender: response.data });
    } catch (e) {
      console.log(e);
    }
  },
  createTender: async (payload) => {
    try {
      set({
        isLoading: true,
      });
      const response = await createTender(payload);

      set({
        currentTender: response.data,
        isLoading: false,
      });
      return response;
    } catch (e) {
      console.log(e);
    }
  },
  updateTender: async (tender_id, payload) => {
    try {
      set({
        isLoading: true,
      });
      const response = await updateTender(tender_id, payload);

      set({
        currentTender: response.data,
        isLoading: false,
      });
      return response;
    } catch (e) {
      console.log(e);
    }
  },
}));
