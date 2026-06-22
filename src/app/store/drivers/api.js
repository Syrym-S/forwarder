import axios from "axios";

const BASE_URL = "https://forwarder.360logistics.kz/wp-json";

export const getDriversApi = async () => {
  const data = await axios.get(`${BASE_URL}/forwarder/v1/drivers`, {
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const getDriverDetailsApi = async (driver_id) => {
  const data = await axios.get(`${BASE_URL}/forwarder/v1/driver/${driver_id}`, {
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};
