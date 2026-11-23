export function createNotificationsState({
  getNotificationsApi,
  getNotificationDetailsApi,
  getNotificationsTokenApi,
  markAllAsReadApi,
  connectNotifications,
}) {
  let listRequestId = 0;
  let detailsRequestId = 0;

  return (set, get) => ({
    notifications: [],
    newNotification: null,
    shownNotificationIds: new Set(),
    notificationDetails: null,

    isLoading: false,
    isNotificationDetailsLoading: false,
    isMarkingAllAsRead: false,

    // A background connection failure must not replace a successfully loaded list.
    error: null,
    notificationDetailsError: null,
    connectionError: null,
    markAllAsReadError: null,
    total: 0,
    perPage: 1,

    getNotifications: async (params, { showSnackbar = false } = {}) => {
      const requestId = ++listRequestId;
      set({ isLoading: true, error: null });

      try {
        const response = await getNotificationsApi(params);
        if (requestId !== listRequestId) return;

        const newNotification = response.data.results[0];
        set((state) => {
          const shouldShow =
            showSnackbar &&
            newNotification &&
            !newNotification.is_viewed &&
            !state.shownNotificationIds.has(newNotification.id);

          return {
            notifications: response.data.results,
            ...(shouldShow && {
              newNotification,
              shownNotificationIds: new Set(state.shownNotificationIds).add(
                newNotification.id,
              ),
            }),
            isLoading: false,
            error: null,
            total: response.data.total,
            perPage: response.data.per_page,
          };
        });
      } catch (error) {
        if (requestId === listRequestId) {
          set({ error: error.message, isLoading: false });
        }
      }
    },

    clearNewNotificationValue: () => {
      set({ newNotification: null });
    },

    getNotificationDetails: async (id) => {
      const requestId = ++detailsRequestId;
      set({
        isNotificationDetailsLoading: true,
        notificationDetails: null,
        notificationDetailsError: null,
      });

      try {
        const response = await getNotificationDetailsApi(id);
        if (requestId !== detailsRequestId) return;

        set({
          notificationDetails: response.data,
          isNotificationDetailsLoading: false,
          notificationDetailsError: null,
        });
      } catch (error) {
        if (requestId === detailsRequestId) {
          set({
            notificationDetailsError: error.message,
            isNotificationDetailsLoading: false,
          });
        }
      }
    },

    getNotificationsToken: async () => {
      try {
        return await getNotificationsTokenApi();
      } catch (error) {
        set({ connectionError: error.message });
      }
    },

    markAllAsRead: async () => {
      if (get().isMarkingAllAsRead) return false;
      set({ isMarkingAllAsRead: true, markAllAsReadError: null });

      try {
        await markAllAsReadApi();
        set({ isMarkingAllAsRead: false, markAllAsReadError: null });
        return true;
      } catch (error) {
        set({ isMarkingAllAsRead: false, markAllAsReadError: error.message });
        return false;
      }
    },

    connectNotifications: () =>
      connectNotifications(
        () => get().getNotifications(undefined, { showSnackbar: true }),
        (error) => {
          set({ connectionError: error.message || error.type || "WebSocket error" });
          console.error("Не удалось подключить уведомления", error);
        },
        () => set({ connectionError: null }),
      ),
  });
}
