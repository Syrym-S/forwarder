import axios from "axios";

const BASE_URL = "https://forwarder.360logistics.kz/wp-json";

export const getLeads = async (params) => {
  const data = await axios.get(
    `${BASE_URL}/forwarder/v1/leads`,

    {
      params,
      headers: {
        "X-WP-Nonce": APP_DATA.nonce,
      },
    },
  );

  return data;
};

export const getLeadItemDetails = async (lead_id) => {
  const data = await axios.get(
    `${BASE_URL}/forwarder/v1/lead/${lead_id}`,

    {
      headers: {
        "X-WP-Nonce": APP_DATA.nonce,
      },
    },
  );

  return data;
};

export const createLeadApi = async (payload) => {
  const data = await axios.post(
    `${BASE_URL}/forwarder/v1/leads/create`,
    payload,
    {
      headers: {
        "X-WP-Nonce": APP_DATA.nonce,
      },
    },
  );

  return data;
};

export const updateLeadApi = async (id, payload) => {
  const data = await axios.patch(
    `${BASE_URL}/forwarder/v1/leads/${id}/update`,
    payload,
    {
      headers: {
        "X-WP-Nonce": APP_DATA.nonce,
      },
    },
  );

  return data;
};
