import { create } from "zustand";
import {
  getNotificationDetailsApi,
  getNotificationsApi,
  getNotificationsTokenApi,
  markAllAsReadApi,
} from "./api";
import Echo from "laravel-echo";
import Pusher from "pusher-js";

// Share the socket across components and separately loaded app bundles.
const connectionKey = Symbol.for("forwarder.notifications.connection");
const MAX_AUTH_RETRIES = 2;

const waitForPage = () =>
  document.readyState === "loading"
    ? new Promise((resolve) => {
        document.addEventListener("DOMContentLoaded", resolve, { once: true });
      })
    : Promise.resolve();

const readTokenFields = (response) => {
  const sources = [response, response?.data, response?.result];
  const pick = (...keys) => {
    for (const source of sources) {
      for (const key of keys) {
        if (source?.[key]) return source[key];
      }
    }
    return "";
  };
  return {
    token: pick("token", "access_token", "accessToken"),
    channel: pick("channel", "channel_name", "channelName"),
    event: pick("event", "event_name", "eventName"),
    authEndpoint: pick("auth_endpoint", "authEndpoint"),
  };
};

export const connectNotifications = (onNotification, onError) => {
  const connection = (window[connectionKey] ??= {
    echo: null,
    pending: null,
    subscribers: new Set(),
    retryTimer: null,
    retryAttempt: 0,
    authRetries: 0,
  });
  const subscriber = { onNotification, onError };
  connection.subscribers.add(subscriber);

  const reportError = (error) => {
    connection.subscribers.forEach((item) => item.onError?.(error));
  };

  const disconnect = () => {
    const echo = connection.echo;
    connection.echo = null;
    echo?.disconnect();
  };

  const scheduleRestart = (delay) => {
    if (!connection.subscribers.size || connection.retryTimer != null) return;
    disconnect();
    const timeout =
      delay ?? Math.min(1000 * 2 ** connection.retryAttempt++, 30000);
    connection.retryTimer = setTimeout(() => {
      connection.retryTimer = null;
      start();
    }, timeout);
  };

  const start = () => {
    if (connection.echo || connection.pending || !connection.subscribers.size)
      return;
    connection.pending = (async () => {
      await waitForPage();
      if (!connection.subscribers.size) return;

      // WordPress inserts the configuration in the footer after the app script.
      const config =
        window.NotifWS_Config || window.NotificationWS_Config || {};
      const host = String(config.reverb_host || config.reverbHost || "").trim();
      const key = String(config.reverb_key || config.reverbKey || "").trim();
      if (!host || !key) {
        throw new Error(
          "Не задан конфиг уведомлений NotifWS_Config (reverb_host/reverb_key)",
        );
      }
      const wsHost = new URL(
        /^[a-z]+:\/\//i.test(host) ? host : `wss://${host}`,
      ).hostname;

      const response = await getNotificationsTokenApi();
      if (!connection.subscribers.size) return;
      if (
        !response ||
        response.success === false ||
        response.status === false ||
        response.error
      ) {
        throw new Error(
          response?.message || "Ошибка получения токена уведомлений",
        );
      }
      const fields = readTokenFields(response);
      if (!fields.token) throw new Error("Не получен токен уведомлений");

      const user = config.user ?? config.user_id ?? window.APP_DATA?.user_id;
      const role = String(config.role || "forwarder").trim();
      const channel = String(
        fields.channel ||
          config.channel ||
          (user != null && role ? `notifications.${role}.${user}` : ""),
      )
        .trim()
        .replace(/^private-/, "");
      if (!channel)
        throw new Error("Не задан канал или пользователь уведомлений");
      const event = String(fields.event || config.event || "notification");
      const authEndpoint =
        fields.authEndpoint ||
        config.auth ||
        config.authEndpoint ||
        `https://${wsHost}/api/broadcasting/auth`;

      const echo = new Echo({
        broadcaster: "reverb",
        Pusher,
        key,
        wsHost,
        wssPort: 443,
        forceTLS: true,
        enabledTransports: ["ws", "wss"],
        authEndpoint,
        withoutInterceptors: true,
        auth: { headers: { Authorization: `Bearer ${fields.token}` } },
      });
      connection.echo = echo;
      const isActive = () =>
        connection.echo === echo && connection.subscribers.size > 0;
      echo.connector?.pusher?.connection?.bind?.("error", (error) => {
        if (isActive()) reportError(error);
      });
      echo
        .private(channel)
        .listen(event.startsWith(".") ? event : `.${event}`, (payload) => {
          if (!isActive()) return;
          if (config.debug)
            console.log("[NotificationWS reverb message]", payload);
          connection.subscribers.forEach((item) =>
            item.onNotification?.(payload),
          );
        })
        .subscribed(() => {
          if (!isActive()) return;
          connection.authRetries = 0;
          connection.retryAttempt = 0;
          if (config.debug)
            console.log("[NotificationWS reverb subscribed]", channel, event);
        })
        .error((error) => {
          if (!isActive()) return;
          const authFailed =
            error?.type === "AuthError" &&
            (error.status === 401 || error.status === 403);
          if (authFailed && connection.authRetries < MAX_AUTH_RETRIES) {
            connection.authRetries++;
            scheduleRestart(0);
            return;
          }
          reportError(error);
          disconnect();
          if (!authFailed) scheduleRestart();
        });
      // Pusher handles reconnection of an established WebSocket itself.
    })()
      .catch((error) => {
        disconnect();
        reportError(error);
        scheduleRestart();
      })
      .finally(() => {
        connection.pending = null;
      });
  };

  if (connection.retryTimer == null) start();

  return () => {
    connection.subscribers.delete(subscriber);
    if (!connection.subscribers.size) {
      if (connection.retryTimer != null) clearTimeout(connection.retryTimer);
      connection.retryTimer = null;
      connection.retryAttempt = 0;
      connection.authRetries = 0;
      disconnect();
    }
  };
};

export const useNotificationsStore = create((set, get) => ({
  notifications: [],
  newNotification: null,
  shownNotificationIds: new Set(),
  notificationDetails: null,

  isLoading: false,
  isNotificationDetailsLoading: false,

  error: null,
  total: 0,
  perPage: 1,

  getNotifications: async (params, { showSnackbar = false } = {}) => {
    try {
      set({ isLoading: true, error: null });

      const response = await getNotificationsApi(params);

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
          total: response.data.total,
          perPage: response.data.per_page,
        };
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
      set({
        isNotificationDetailsLoading: true,
        notificationDetails: null,
        error: null,
      });

      const response = await getNotificationDetailsApi(id);

      set({
        notificationDetails: response.data,
        isNotificationDetailsLoading: false,
      });
    } catch (e) {
      set({
        error: e.message,
        isNotificationDetailsLoading: false,
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

  connectNotifications: () =>
    connectNotifications(
      () => get().getNotifications(undefined, { showSnackbar: true }),
      (error) => {
        set({ error: error.message });
        console.error("Не удалось подключить уведомления", error);
      },
    ),
}));
