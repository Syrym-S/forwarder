import { create } from "zustand";
import {
  confirmLeadDeliveryApi,
  createLeadApi,
  deleteLeadFileApi,
  detachCustomerApi,
  detachDriverApi,
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
  getAcceptedLeadsApi,
} from "./api";

export const useLeadsStore = create((set) => ({
  leads: [],
  searchedLeads: [],
  historyLeads: [],
  files: [],
  uploadedFiles: [],
  acceptedLeads: [],
  currentLead: null,

  isLoading: false,
  isSearchLoading: false,
  isDriverDetachLoading: false,
  isCustomerDetachLoading: false,
  isLoadLoading: false,
  isUnloadLoading: false,
  isConfirmLoading: false,
  isAcceptedLeadsLoading: false,


  error: null,
  count: 0,
  perPage: 1,
  history_count: 0,
  history_perPage: 1,

  clearCurrentLead: () => {
    set({ currentLead: null, error: null });
  },

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

  fetchAcceptedLeads: async () => {
    try {
      set({ isAcceptedLeadsLoading: true, error: null });

      const response = await getAcceptedLeadsApi();

      set({
        acceptedLeads:
          response.data?.results ||
          response.data?.data ||
          response.data ||
          [],
        isAcceptedLeadsLoading: false,
      });
    } catch (e) {
      set({
        acceptedLeads: [],
        error: e.message,
        isAcceptedLeadsLoading: false,
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
        history_count: response.data.count,
        history_perPage: response.data.per_page,
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
      set({ isLoadLoading: true, error: null });

      const response = await verifyCargoApi(lead_id, payload);

      set({
        isLoadLoading: false,
      });

      return response;
    } catch (e) {
      set({
        error: e.message,
        isLoadLoading: false,
      });

      // console.error("Payload:", payload);
      console.error("Response:", e.response?.data);
      throw e;
    }
  },

  rejectCargo: async (lead_id, payload) => {
    try {
      set({ isLoadLoading: true, error: null });

      const response = await rejectCargoApi(lead_id, payload);

      set({
        isLoadLoading: false,
      });

      return response;
    } catch (e) {
      set({
        error: e.message,
        isLoadLoading: false,
      });

      // console.error("Payload:", payload);
      console.error("Response:", e.response?.data);
      throw e;
    }
  },

  verifyCargoUnload: async (lead_id, payload) => {
    try {
      set({ isUnloadLoading: true, error: null });

      const response = await verifyCargoUnloadApi(lead_id, payload);

      set({
        isUnloadLoading: false,
      });

      return response;
    } catch (e) {
      set({
        error: e.message,
        isUnloadLoading: false,
      });

      // console.error("Payload:", payload);
      console.error("Response:", e.response?.data);
      throw e;
    }
  },

  rejectCargoUnload: async (lead_id, payload) => {
    try {
      set({ isUnloadLoading: true, error: null });

      const response = await rejectCargoUnloadApi(lead_id, payload);

      set({
        isUnloadLoading: false,
      });

      return response;
    } catch (e) {
      set({
        error: e.message,
        isUnloadLoading: false,
      });

      // console.error("Payload:", payload);
      console.error("Response:", e.response?.data);
      throw e;
    }
  },

  confirmLeadDelivery: async (lead_id, payload) => {
    try {
      set({ isConfirmLoading: true, error: null });

      const response = await confirmLeadDeliveryApi(lead_id, payload);

      set({
        isConfirmLoading: false,
      });

      return response;
    } catch (e) {
      set({
        error: e.message,
        isConfirmLoading: false,
      });

      // console.error("Payload:", payload);
      console.error("Response:", e.response?.data);
      throw e;
    }
  },

  detachDriver: async (lead_id) => {
    try {
      set({ isDriverDetachLoading: true, error: null });

      const response = await detachDriverApi(lead_id);

      set({
        isDriverDetachLoading: false,
      });

      return response;
    } catch (e) {
      set({
        error: e.message,
        isDriverDetachLoading: false,
      });

      // console.error("Payload:", payload);
      console.error("Response:", e.response?.data);
      throw e;
    }
  },

  detachCustomer: async (lead_id) => {
    try {
      set({ isCustomerDetachLoading: true, error: null });

      const response = await detachCustomerApi(lead_id);

      set({
        isCustomerDetachLoading: false,
      });

      return response;
    } catch (e) {
      set({
        error: e.message,
        isCustomerDetachLoading: false,
      });

      // console.error("Payload:", payload);
      console.error("Response:", e.response?.data);
      throw e;
    }
  },
}));
