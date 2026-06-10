import { create } from 'zustand';

function createNotificationId() {
   return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export const useNotificationsStore = create((set) => ({
   notifications: [],

   addNotification: ({ type = 'success', message, meta = null }) => {
      const notification = {
         id: createNotificationId(),
         type,
         message,
         meta,
         createdAt: Date.now(),
      };

      set((state) => ({
         notifications: [notification, ...state.notifications],
      }));

      return notification.id;
   },

   removeNotification: (id) => {
      set((state) => ({
         notifications: state.notifications.filter(
            (notification) => notification.id !== id,
         ),
      }));
   },

   clearNotifications: () => {
      set({ notifications: [] });
   },
}));

export function notifyError(message, meta) {
   return useNotificationsStore.getState().addNotification({
      type: 'error',
      message,
      meta,
   });
}

export function notifyWarning(message, meta) {
   return useNotificationsStore.getState().addNotification({
      type: 'warning',
      message,
      meta,
   });
}

export function notifySuccess(message, meta) {
   return useNotificationsStore.getState().addNotification({
      type: 'success',
      message,
      meta,
   });
}
