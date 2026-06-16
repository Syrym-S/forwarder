import axios from "axios";

const BASE_URL = "https://forwarder.360logistics.kz/wp-json/forwarder/v1";

export const getTenders = async (params) => {
  const data = await axios.get(`${BASE_URL}/tenders`, {
    params,
    headers: {
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const getTenderDetails = async (tender_id) => {
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
