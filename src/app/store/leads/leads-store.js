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
  deleteCargoApi,
  shareLeadApi,
  sendMessageApi,
  getLeadMessagesApi,
  getMessageParticipantInfoApi,
  downloadMessageFileApi,
  deleteMessageApi,
  editMessageApi,
  generaetAvrDocumentApi,
  signAvrDocumentApi,
  getAvrDocumentApi,
} from "./api";

export const useLeadsStore = create((set) => ({
  leads: [],
  searchedLeads: [],
  historyLeads: [],
  files: [],
  uploadedFiles: [],
  acceptedLeads: [],
  leadMessages: [],

  currentLead: null,
  participantData: null,
  notificationPopUpCurrentLead: null,
  downloadFileId: null,
  newMessage: null,
  deletingMessage: null,
  avrDocument: null,

  isLoading: false,
  isSearchLoading: false,
  isDriverDetachLoading: false,
  isCustomerDetachLoading: false,
  isLoadLoading: false,
  isUnloadLoading: false,
  isConfirmLoading: false,
  isAcceptedLeadsLoading: false,
  isCargoDeleteLoading: false,
  isSendingLoading: false,
  isMessagesLoading: false,
  isParticipantLoading: false,
  isDownloadLoading: false,
  isGenerateAvrLoading: false,
  isSignAvrLoading: false,

  error: null,
  count: 0,
  perPage: 1,
  history_count: 0,
  history_perPage: 1,

  clearCurrentLead: () => {
    set({ currentLead: null, error: null });
  },

  clearNotificationPopUpCurrentLead: () => {
    set({ notificationPopUpCurrentLead: null, error: null });
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
          response.data?.results || response.data?.data || response.data || [],
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

  getNotificationPopUpLeadItem: async (lead_id) => {
    try {
      set({ isLoading: true, error: null });

      const response = await getLeadItemDetails(lead_id);

      set({
        notificationPopUpCurrentLead: response.data.data,
        isLoading: false,
      });
    } catch (e) {
      set({
        notificationPopUpCurrentLead: null,
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

  deleteCargo: async (lead_id, cargo_index) => {
    try {
      set({ isCargoDeleteLoading: true, error: null });

      await deleteCargoApi(lead_id, cargo_index);

      set({
        isCargoDeleteLoading: false,
      });
    } catch (e) {
      set({
        error: e.message,
        isCargoDeleteLoading: false,
      });

      // console.error("Payload:", payload);
      console.error("Response:", e.response?.data);
      throw e;
    }
  },

  shareLead: async (lead_id) => {
    try {
      set({ isShareLoading: true, error: null });

      const response = await shareLeadApi(lead_id);

      set({
        isShareLoading: false,
      });

      return response.data;
    } catch (e) {
      set({
        error: e.message,
        isCargoDeleteLoading: false,
      });

      console.error("Response:", e.response?.data);
      throw e;
    }
  },

  getLeadMessages: async (lead_id, params) => {
    try {
      set({ isMessagesLoading: true, error: null });

      const response = await getLeadMessagesApi(lead_id, params);

      set({
        leadMessages: response.data.data,
        isMessagesLoading: false,
      });

      return response.data;
    } catch (e) {
      set({
        error: e.message,
        isMessagesLoading: false,
      });

      console.error("Response:", e.response?.data);
      throw e;
    }
  },

  sendMessage: async (lead_id, payload) => {
    try {
      set({
        newMessage: payload,
        isSendingLoading: true,
      });
      const response = await sendMessageApi(lead_id, payload);

      set({
        newMessage: null,
        isSendingLoading: false,
      });
      return response.data;
    } catch (e) {
      set({
        error: e.message,
        isSendingLoading: false,
      });

      console.error("Response:", e.response?.data);
      throw e;
    }
  },

  editMessage: async (lead_id, message_id, payload) => {
    try {
      const response = await editMessageApi(lead_id, message_id, payload);

      return response.data;
    } catch (e) {
      set({
        error: e.message,
        isSendingLoading: false,
      });

      console.error("Response:", e.response?.data);
      throw e;
    }
  },

  deleteMessage: async (lead_id, message_id, params) => {
    try {
      set({
        deletingMessage: message_id,
      });
      const response = await deleteMessageApi(lead_id, message_id, params);

      set({
        deletingMessage: null,
      });
      return response;
    } catch (e) {
      set({
        error: e.message,
        isMessagesLoading: false,
      });

      console.error("Response:", e.response?.data);
      throw e;
    }
  },

  downloadMessageFile: async (lead_id, attachment_id, messageType) => {
    try {
      set({
        isDownloadLoading: true,
        downloadingFileId: attachment_id,
        error: null,
      });

      const response = await downloadMessageFileApi(
        lead_id,
        attachment_id,
        messageType,
      );

      set({
        isDownloadLoading: false,
        downloadingFileId: null,
      });

      return response.data;
    } catch (e) {
      set({
        error: e.message,
        isDownloadLoading: false,
      });

      console.error("Response:", e.response?.data);
      throw e;
    }
  },

  getMessageParticipantInfo: async (lead_id, messageType) => {
    try {
      set({ isParticipantLoading: true, error: null });

      const response = await getMessageParticipantInfoApi(lead_id, messageType);

      set({
        participantData: response.data.data,
        isParticipantLoading: false,
      });

      return response.data;
    } catch (e) {
      set({
        error: e.message,
        isParticipantLoading: false,
      });

      console.error("Response:", e.response?.data);
      throw e;
    }
  },

  getNewMessage: (message) => {
    set((state) => ({
      leadMessages: [...state.leadMessages, message],
    }));
  },

  updateMessage: (message) => {
    set((state) => ({
      leadMessages: state.leadMessages.map((item) =>
        item.id === message.id
          ? {
              ...item,
              ...message,
            }
          : item,
      ),
    }));
  },

  deleteMessageFromSocket: (message) => {
    set((state) => ({
      leadMessages: state.leadMessages.map((item) =>
        item.id === message.id
          ? {
              ...item,
              ...message,
            }
          : item,
      ),
    }));
  },

  readMessages: (participant_id) => {
    set((state) => ({
      leadMessages: state.leadMessages.map((item) =>
        item.participant_id === participant_id
          ? {
              ...item,
              is_read: true,
            }
          : item,
      ),
    }));
  },

  generateAvrDocument: async (leadId) => {
    try {
      set({ isGenerateAvrLoading: true });

      const response = await generaetAvrDocumentApi(leadId);

      set({ isGenerateAvrLoading: false });

      return response;
    } catch (e) {
      set({ error: e.response?.data?.message, isGenerateAvrLoading: false });
    }
  },

  signAvrDocument: async (leadId) => {
    try {
      set({ isSignAvrLoading: true });

      const response = await signAvrDocumentApi(leadId);

      set({ isSignAvrLoading: false });

      return response;
    } catch (e) {
      set({ error: e.response?.data?.message, isSignAvrLoading: false });
    }
  },

  getAvrDocument: async (leadId) => {
    try {
      set({ isAvrLoading: true });

      const response = await getAvrDocumentApi(leadId);

      set({
        avrDocument: response.data,
        isAvrLoading: false,
      });

      return response;
    } catch (e) {
      console.log(e);
    }
  },
}));
