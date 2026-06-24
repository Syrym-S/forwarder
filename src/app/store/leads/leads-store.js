import { create } from "zustand";
import {
  confirmLeadDeliveryApi,
  createLeadApi,
  deleteLeadFileApi,
  getHistoryLeads,
  getLeadFilesApi,
  getLeadItemDetails,
  getLeads,
  rejectCargoApi,
  rejectCargoUnloadApi,
  searchLeadsApi,
  searchLeadsHistoryApi,
  updateLeadApi,
  uploadLeadFileApi,
  verifyCargoApi,
  verifyCargoUnloadApi,
} from "./api";

export const useLeadsStore = create((set) => ({
  leads: [],
  searchedLeads: [],
  historyLeads: [],
  files: [],
  uploadedFiles: [],
  currentLead: null,
  isLoading: false,
  isSearchLoading: false,
  error: null,
  count: 0,
  perPage: 1,

  fetchLeads: async (params) => {
    try {
      set({ isLoading: true, error: null });

      const response = await getLeads(params);

      set({
        leads: response.data.results,
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

  searchLeads: async (params) => {
    try {
      set({ isSearchLoading: true, error: null });

      const response = await searchLeadsApi(params);

      set({
        searchedLeads: response.data.results,
        isSearchLoading: false,
      });
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });
    }
  },
  getHistoryLeads: async (params) => {
    try {
      set({ isLoading: true, error: null });

      const response = await getHistoryLeads(params);

      set({
        historyLeads: response.data.results,
        page: response.data.page,
        count: response.data.count,
        // perPage: response.data.per_page,
        isLoading: false,
      });
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });
    }
  },

  searchHistoryLeads: async (params) => {
    try {
      set({ isSearchLoading: true, error: null });

      const response = await searchLeadsHistoryApi(params);

      set({
        searchedLeads: response.data.results,
        isSearchLoading: false,
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
      console.error("Response:", e.response?.data);
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
  getLeadFiles: async (lead_id) => {
    try {
      set({ isLoading: true, error: null });

      const response = await getLeadFilesApi(lead_id);

      set({
        files: response.data.files,
        isLoading: false,
      });
    } catch (e) {
      set({
        isLoading: false,
        error: e.message,
      });

      console.error(e);
    }
  },
  setUploadedFiles: (files) => set({ uploadedFiles: files }),

  uploadLeadFile: async (id, payload) => {
    try {
      set({ isLoading: true, error: null });

      const response = await uploadLeadFileApi(id, payload);

      set({
        isLoading: false,
      });

      return response;
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });

      console.error("Payload:", payload);
      console.error("Response:", e.response?.data);
      throw e;
    }
  },
  deleteLeadFile: async (lead_id, file_path) => {
    try {
      set({ isLoading: true, error: null });

      const response = await deleteLeadFileApi(lead_id, file_path);

      set({
        isLoading: false,
      });

      return response;
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });

      // console.error("Payload:", payload);
      console.error("Response:", e.response?.data);
      throw e;
    }
  },
  verifyCargo: async (lead_id, payload) => {
    try {
      set({ isLoading: true, error: null });

      const response = await verifyCargoApi(lead_id, payload);

      set({
        isLoading: false,
      });

      return response;
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });

      // console.error("Payload:", payload);
      console.error("Response:", e.response?.data);
      throw e;
    }
  },
  rejectCargo: async (lead_id, payload) => {
    try {
      set({ isLoading: true, error: null });

      const response = await rejectCargoApi(lead_id, payload);

      set({
        isLoading: false,
      });

      return response;
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });

      // console.error("Payload:", payload);
      console.error("Response:", e.response?.data);
      throw e;
    }
  },
  verifyCargoUnload: async (lead_id, payload) => {
    try {
      set({ isLoading: true, error: null });

      const response = await verifyCargoUnloadApi(lead_id, payload);

      set({
        isLoading: false,
      });

      return response;
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });

      // console.error("Payload:", payload);
      console.error("Response:", e.response?.data);
      throw e;
    }
  },
  rejectCargoUnload: async (lead_id, payload) => {
    try {
      set({ isLoading: true, error: null });

      const response = await rejectCargoUnloadApi(lead_id, payload);

      set({
        isLoading: false,
      });

      return response;
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });

      // console.error("Payload:", payload);
      console.error("Response:", e.response?.data);
      throw e;
    }
  },
  confirmLeadDelivery: async (lead_id, payload) => {
    try {
      set({ isLoading: true, error: null });

      const response = await confirmLeadDeliveryApi(lead_id, payload);

      set({
        isLoading: false,
      });

      return response;
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });

      // console.error("Payload:", payload);
      console.error("Response:", e.response?.data);
      throw e;
    }
  },
}));
