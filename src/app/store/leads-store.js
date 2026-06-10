import { create } from "zustand";
import axios from "axios";
import {
  createLeadApi,
  getLeadItemDetails,
  getLeads,
  updateLeadApi,
} from "./api";
// import { mockLeads } from "../../shared/const/mock-data";

export const useLeadsStore = create((set) => ({
  leads: [],
  currentLead: null,
  isLoading: false,
  error: null,
  page: 1,
  count: 0,
  perPage: 5,

  fetchLeads: async (params) => {
    try {
      set({ isLoading: true, error: null });

      const response = await getLeads(params);

      set({
        leads: response.data.results,
        page: response.data.page,
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

  getLeadItem: async (lead_id) => {
    try {
      set({ isLoading: true, error: null });

      const response = await getLeadItemDetails(lead_id);

      set({
        currentLead: response.data.data,
        isLoading: false,
      });
    } catch (e) {
      set({
        currentLead: null,
        isLoading: false,
        error: e.message,
      });

      console.error(e);
    }
  },
  createLead: async (payload) => {
    try {
      set({ isLoading: true, error: null });

      const response = await createLeadApi(payload);

      set((state) => ({
        leads: [response.data, ...state.leads],
        isLoading: false,
      }));

      return response.data;
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });

      console.error("Payload:", payload);
      console.error("Response:", error.response?.data);
      throw e;
    }
  },
  updateLead: async (id, payload) => {
    try {
      set({ isLoading: true, error: null });

      const response = await updateLeadApi(id, payload);

      set({ isLoading: false });
      return response.data;
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });

      throw e;
    }
  },
}));
