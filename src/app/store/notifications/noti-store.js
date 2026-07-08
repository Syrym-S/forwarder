import { create } from "zustand";
import {
  getNotificationDetailsApi,
  getNotificationsApi,
  getNotificationsTokenApi,
  markAllAsReadApi,
} from "./api";

export const useNotificationsStore = create((set) => ({
  notifications: [],
  newNotification: null,
  notificationDetails: null,
  isLoading: false,
  error: null,
  total: 0,
  perPage: 1,

  getNotifications: async (params) => {
    try {
      set({ isLoading: true, error: null });

      const response = await getNotificationsApi(params);

      const newNotification = response.data.results[0];

      set({
        notifications: response.data.results,
        newNotification: newNotification.is_viewed ? null : newNotification,
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

  clearNewNotificationValue: () => {
    set({ newNotification: null });
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

  getNotificationsToken: async () => {
    try {
      return await getNotificationsTokenApi();
    } catch (e) {
      set({
        error: e.message,
        isLoading: false,
      });
    }
  },

  markAllAsRead: async () => {
    try {
      set({ isLoading: true, error: null });

      await markAllAsReadApi();

      set({ isLoading: false, error: null });
    } catch (e) {
      console.log(e);
      set({
        error: e.message,
        isLoading: false,
      });
    }
  },

  connectNotifications: async () => {
    const tokenResponse = await getNotificationsTokenApi();

    const socket = new WebSocket(
      `wss://notification.360logistics.kz/staging/socket?token=${tokenResponse.token}`,
    );

    return socket;
  },
}));
