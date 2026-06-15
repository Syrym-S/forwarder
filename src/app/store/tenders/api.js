import axios from "axios";

const BASE_URL =
  "https://forwarder.360logistics.kz/wp-json/forwarder/v1/tender";

export const createTender = async (payload) => {
  const data = await axios.post(`${BASE_URL}/create`, payload, {
    headers: {
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};
