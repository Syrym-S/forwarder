import { create } from "zustand";
import { getNotificationDetailsApi, getNotificationsApi } from "./api";

export const useNotificationsStore = create((set) => ({
  notifications: [],
  notificationDetails: null,
  isLoading: false,
  error: null,
  total: 0,
  perPage: 1,

  getNotifications: async (params) => {
    try {
      set({ isLoading: true, error: null });

      const response = await getNotificationsApi(params);

      set({
        notifications: response.data.results,
        isLoading: false,
        total: response.data.total,
        perPage: response.data.per_page,
      });
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });
    }
  },

  getNotificationDetails: async (id) => {
    try {
      set({ isLoading: true, error: null });

      const response = await getNotificationDetailsApi(id);

      set({
        notificationDetails: response.data,
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
