import { api } from "../../client";

export const getNotificationsApi = async (params) => {
  const data = await api.get(`/forwarder/v1/notifications`, {
    params,
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const getNotificationDetailsApi = async (id) => {
  const data = await api.get(`/forwarder/v1/notifications/${id}`, {
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const getNotificationsTokenApi = async () => {
  const response = await api.get(`/notif/v1/token`, {
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return response.data;
};

export const markAllAsReadApi = async () => {
  const response = await api.post(
    `/forwarder/v1/notifications/read-all`,
    null,
    {
      headers: {
        // eslint-disable-next-line no-undef
        "X-WP-Nonce": APP_DATA.nonce,
      },
    },
  );

  return response.data;
};
