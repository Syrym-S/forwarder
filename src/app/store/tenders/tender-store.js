import { create } from "zustand";
import {
  acceptBetApi,
  addParticipantApi,
  cancelBetApi,
  cancelTenderApi,
  createTender,
  deleteParticipantApi,
  deleteTenderApi,
  getCustomerTenderDetailsApi,
  getCustomerTendersApi,
  getTenderDetailsApi,
  getTendersApi,
  makeBetApi,
  startTenderApi,
  updateTender,
} from "./api";

export const useTendersStore = create((set) => ({
  tenders: [],
  customerTenders: [],
  currentTender: null,
  customerCurrentTender: null,

  isLoading: false,
  isLoadingCurrentTenderLoading: false,
  isAddingLoading: false,
  isBetsLoading: false,

  count: 0,
  perPage: 1,
  customerCount: 0,
  customerPerPage: 1,

  clearCurrentTender: () => {
    set({ currentTender: null, customerCurrentTender: null, error: null });
  },

  //Обработки своих созданных тендеров
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
      set({ isLoadingCurrentTenderLoading: true });

      const response = await getTenderDetailsApi(id);

      set({
        isLoadingCurrentTenderLoading: false,
        currentTender: response.data,
      });
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
  startTender: async (tender_id) => {
    try {
      set({
        isLoading: true,
      });
      const response = await startTenderApi(tender_id);

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
      set({ isAddingLoading: true });
      const data = await addParticipantApi(tender_id, payload);

      set({ isAddingLoading: false });

      return data;
    } catch (e) {
      set({ isAddingLoading: false });

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
  acceptBet: async (tender_id, bet_index) => {
    try {
      set({ isLoading: true });
      const data = await acceptBetApi(tender_id, bet_index);

      set({ isLoading: false });

      return data;
    } catch (e) {
      set({ isLoading: false });

      console.log(e);
    }
  },

  //Обработки тендеров созданных Customer
  getCustomerTenders: async (params) => {
    try {
      set({ isLoading: true });

      const response = await getCustomerTendersApi(params);

      set({
        isLoading: false,
        customerCount: response.data.total,
        customerPerPage: response.data.limit,
        customerTenders: response.data.data,
      });
    } catch (e) {
      console.log(e);
    }
  },
  getCustomerTenderDetails: async (id) => {
    try {
      set({ isLoading: true });

      const response = await getCustomerTenderDetailsApi(id);

      set({ isLoading: false, customerCurrentTender: response.data });
    } catch (e) {
      console.log(e);
    }
  },
  makeBet: async (tender_id, payload) => {
    try {
      set({
        isLoading: true,
      });
      const response = await makeBetApi(tender_id, payload);

      set({
        currentTender: response.data,
        isLoading: false,
      });
      return response;
    } catch (e) {
      console.log(e);
    }
  },
  cancelBet: async (tender_id, bet_index) => {
    try {
      set({ isLoading: true });
      const data = await cancelBetApi(tender_id, bet_index);

      set({ isLoading: false });

      return data;
    } catch (e) {
      set({ isLoading: false });

      console.log(e);
    }
  },
}));
