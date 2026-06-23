import axios from "axios";

const BASE_URL = "https://forwarder.360logistics.kz/wp-json";

export const getCustomers = async (params) => {
  const data = await axios.get(`${BASE_URL}/forwarder/v1/customers`, {
    params,
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const getCustomerDetailsApi = async (customer_id) => {
  const data = await axios.get(
    `${BASE_URL}/forwarder/v1/customer/${customer_id}`,
    {
      headers: {
        // eslint-disable-next-line no-undef
        "X-WP-Nonce": APP_DATA.nonce,
      },
    },
  );

  return data;
};

export const searchCustomerApi = async (params) => {
  const data = await axios.get(`${BASE_URL}/forwarder/v1/customers/search`, {
    params,
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};
