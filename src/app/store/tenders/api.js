import axios from "axios";

const BASE_URL = "https://forwarder.360logistics.kz/wp-json/forwarder/v1";

export const getTendersApi = async (params) => {
  const data = await axios.get(`${BASE_URL}/tenders`, {
    params,
    headers: {
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const getTenderDetailsApi = async (tender_id) => {
  const data = await axios.get(`${BASE_URL}/tender/${tender_id}`, {
    headers: {
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const createTender = async (payload) => {
  const data = await axios.post(`${BASE_URL}/tender/create`, payload, {
    headers: {
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const updateTender = async (tender_id, payload) => {
  const data = await axios.put(
    `${BASE_URL}/tender/${tender_id}/update`,
    payload,
    {
      headers: {
        "X-WP-Nonce": APP_DATA.nonce,
      },
    },
  );

  return data;
};

export const deleteTenderApi = async (tender_id) => {
  const data = await axios.delete(`${BASE_URL}/tender/${tender_id}`, {
    headers: {
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};
