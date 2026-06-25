import { create } from "zustand";
import { getNotificationDetailsApi, getNotificationsApi } from "./api";

export const useNotificationsStore = create((set) => ({
  notifications: [],
  notificationDetails: null,

  getNotifications: async (params) => {
    try {
      set({ isLoading: true, error: null });

      const response = await getNotificationsApi(params);

      set({
        notifications: response.data.results,
        isLoading: false,
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

      console.log(response);

      set({
        notificationDetails: response.data.results,
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
