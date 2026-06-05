import axios from "axios";

const BASE_URL = "https://forwarder.360logistics.kz";

export const getLeads = async () => {
  const data = await axios.get(
    `${BASE_URL}/forwarder/v1/leads`,

    {
      headers: {
        "X-WP-Nonce": "07d1108ceb",
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
        "X-WP-Nonce": "07d1108ceb",
      },
    },
  );

  return data;
};
