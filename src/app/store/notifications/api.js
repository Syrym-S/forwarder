import axios from "axios";

const BASE_URL = "https://forwarder.360logistics.kz/wp-json";

export const getNotificationsApi = async (params) => {
  const data = await axios.get(`${BASE_URL}/forwarder/v1/notifications`, {
    params,
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const getNotificationDetailsApi = async (id) => {
  const data = await axios.get(`${BASE_URL}/forwarder/v1/notifications/${id}`, {
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const getNotificationsTokenApi = async () => {
  const response = await axios.get(`${BASE_URL}/notif/v1/token`, {
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return response.data;
};

export const markAllAsReadApi = async () => {
  const response = await axios.post(
    `${BASE_URL}/forwarder/v1/notifications/read-all`,
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
