import axios from "axios";

const BASE_URL = "https://forwarder.360logistics.kz/wp-json";

export const getFactoringsApi = async (params) => {
  const data = await axios.get(`${BASE_URL}/forwarder/v1/factorings`, {
    params,
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const getFactoringDetailsApi = async (index) => {
  const data = await axios.get(`${BASE_URL}/forwarder/v1/factoring/${index}`, {
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const createFactoringApi = async (payload) => {
  const data = await axios.post(
    `${BASE_URL}/forwarder/v1/factoring/create`,
    payload,
    {
      headers: {
        // eslint-disable-next-line no-undef
        "X-WP-Nonce": APP_DATA.nonce,
      },
    },
  );

  return data;
};
