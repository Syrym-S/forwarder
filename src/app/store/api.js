import axios from "axios";

const BASE_URL = "https://forwarder.360logistics.kz/wp-json";

export const getLeads = async (params = {}) => {
  const data = await axios.get(`${BASE_URL}/forwarder/v1/leads`, {
    params,
    headers: {
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const getHistoryLeads = async (params = {}) => {
  const data = await axios.get(`${BASE_URL}/forwarder/v1/leads/history`, {
    params,
    headers: {
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const getLeadItemDetails = async (lead_id) => {
  const data = await axios.get(`${BASE_URL}/forwarder/v1/lead/${lead_id}`, {
    headers: {
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

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
export const getLeadFilesApi = async (leadId) => {
  const data = await axios.get(
    `${BASE_URL}/forwarder/v1/leads/${leadId}/files`,
    {
      headers: {
        "X-WP-Nonce": APP_DATA.nonce,
      },
    },
  );

  return data;
};

export const uploadLeadFileApi = async (leadId, { file, name, context }) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("name", name || file.name);
  formData.append("context", context || "");

  const data = await axios.post(
    `${BASE_URL}/forwarder/v1/leads/${leadId}/files/upload`,
    formData,
    {
      headers: {
        "X-WP-Nonce": APP_DATA.nonce,
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
};

export const deleteLeadFileApi = async (leadId, path) => {
  const data = await axios.post(
    `${BASE_URL}/forwarder/v1/leads/${leadId}/files/delete`,
    { path },
    {
      headers: {
        "X-WP-Nonce": APP_DATA.nonce,
      },
    },
  );

  return data;
};

export const getDrivers = async () => {
  const data = await axios.get(`${BASE_URL}/forwarder/v1/drivers`, {
    headers: {
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const getCustomers = async () => {
  const data = await axios.get(`${BASE_URL}/forwarder/v1/customers`, {
    headers: {
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};
