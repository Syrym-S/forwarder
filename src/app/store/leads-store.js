import { create } from "zustand";
import axios from "axios";
import { getLeadItemDetails, getLeads } from "./api";
import { mockLeads } from "../../shared/const/mock-data";

export const useLeadsStore = create((set) => ({
  leads: [],
  currentLead: null,
  isLoading: false,
  error: null,

  fetchLeads: async () => {
    try {
      set({ isLoading: true, error: null });

      const response = await getLeads();

      set({
        leads: response.data,
        isLoading: false,
      });
    } catch (e) {
      set({
        leads: mockLeads,
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
        currentLead: response.data,
        isLoading: false,
      });
    } catch (e) {
      set({
        currentLead: mockLeads.find(
          (lead) => String(lead.id) === String(lead_id),
        ),
        isLoading: false,
        error: e,
      });
    }
  },
  createLead: async (payload) => {
    try {
      set({ isLoading: true, error: null });

      const newLead = {
        ...payload,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };

      set((state) => ({
        leads: [newLead, ...state.leads],
        isLoading: false,
      }));

      return newLead;
    } catch (e) {
      set({
        error: e,
        isLoading: false,
      });

      throw e;
    }
  },
}));
