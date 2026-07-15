import { create } from "zustand";
import {
  createDriverApi,
  getDriverDetailsApi,
  getDriversApi,
  searchDriverApi,
} from "./api";

export const useDriverStore = create((set) => ({
  drivers: [],
  inviteLink: null,
  driverDetails: null,
  isLoading: false,
  error: null,
  count: 0,
  perPage: 1,

  getDrivers: async (params) => {
    try {
      set({ isLoading: true, error: null });

      const response = await getDriversApi(params);

      set({
        drivers: response.data.results,
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
  getDriverDetails: async (driver_id) => {
    try {
      set({ isLoading: true, error: null });

      const response = await getDriverDetailsApi(driver_id);

      set({
        driverDetails: response.data,
        isLoading: false,
      });
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });
    }
  },
  searchDriver: async (params) => {
    try {
      set({ isLoading: true, error: null });

      const response = await searchDriverApi(params);

      set({
        drivers: response.data.results,
        isLoading: false,
      });
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });
    }
  },
  createDriver: async (payload) => {
    try {
      set({ isLoading: true, error: null });

      const response = await createDriverApi(payload);

      set({
        inviteLink: response.data.invite_link,
        isLoading: false,
      });
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });
    }
  },

  clearInviteLink: () => {
    set({ inviteLink: null });
  },
}));
