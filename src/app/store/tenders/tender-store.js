import { create } from "zustand";
import {
  addParticipantApi,
  cancelTenderApi,
  createTender,
  deleteParticipantApi,
  deleteTenderApi,
  getTenderDetailsApi,
  getTendersApi,
  updateTender,
} from "./api";

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

  deleteTender: async (tender_id) => {
    try {
      set({
        isLoading: true,
      });
      const data = await deleteTenderApi(tender_id);

      set({
        isLoading: false,
      });

      return data;
    } catch (e) {
      console.log(e);
      set({
        isLoading: false,
      });
    }
  },
  cancelTender: async (tender_id) => {
    try {
      set({
        isLoading: true,
      });
      const response = await cancelTenderApi(tender_id);

      set({
        isLoading: false,
      });
      return response;
    } catch (e) {
      console.log(e);
      set({
        isLoading: false,
      });
    }
  },

  addParticipant: async (tender_id, payload) => {
    try {
      set({ isLoading: true });
      const data = await addParticipantApi(tender_id, payload);

      set({ isLoading: false });

      return data;
    } catch (e) {
      set({ isLoading: false });

      console.log(e);
    }
  },
  deleteParticipant: async (tender_id, participant_id) => {
    try {
      set({ isLoading: true });
      const data = await deleteParticipantApi(tender_id, participant_id);

      set({ isLoading: false });

      return data;
    } catch (e) {
      set({ isLoading: false });

      console.log(e);
    }
  },
}));
