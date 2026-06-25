import axios from "axios";

const BASE_URL = "https://forwarder.360logistics.kz/wp-json";

export const getNotificationsApi = async () => {
  const data = await axios.get(`${BASE_URL}/forwarder/v1/notifications`, {
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
