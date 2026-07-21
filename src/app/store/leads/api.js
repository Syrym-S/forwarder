import { api } from "../../client";

export const getLeads = async (params = {}) => {
  const data = await api.get(`/forwarder/v1/leads`, {
    params,
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const searchLeadsApi = async (params = {}) => {
  const data = await api.get(`/forwarder/v1/leads/search`, {
    params,
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const searchLeadsHistoryApi = async (params = {}) => {
  const data = await api.get(`/forwarder/v1/leads/history/search`, {
    params,
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const getHistoryLeads = async (params = {}) => {
  const data = await api.get(`/forwarder/v1/leads/history`, {
    params,
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const getLeadItemDetails = async (lead_id) => {
  const data = await api.get(`/forwarder/v1/lead/${lead_id}`, {
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const createLeadApi = async (payload) => {
  const data = await api.post(`/forwarder/v1/leads/create`, payload, {
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const updateLeadApi = async (id, payload) => {
  const data = await api.patch(`/forwarder/v1/leads/${id}/update`, payload, {
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const getLeadFilesApi = async (leadId) => {
  const data = await api.get(`/forwarder/v1/leads/${leadId}/files`, {
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const uploadLeadFileApi = async (leadId, payload) => {
  const formData = new FormData();

  formData.append("file", payload.file);
  formData.append("name", name || payload.name);
  formData.append("context", payload.context || "");

  const data = await api.post(
    `/forwarder/v1/leads/${leadId}/files/upload`,
    payload,
    {
      headers: {
        // eslint-disable-next-line no-undef
        "X-WP-Nonce": APP_DATA.nonce,
        "Content-Type": "multipart/form-data",
      },
    },
  );

  return data;
};

export const deleteLeadFileApi = async (leadId, path) => {
  const data = await api.post(
    `/forwarder/v1/leads/${leadId}/files/delete`,
    { path },
    {
      headers: {
        // eslint-disable-next-line no-undef
        "X-WP-Nonce": APP_DATA.nonce,
      },
    },
  );

  return data;
};

export const verifyCargoApi = async (lead_id, payload) => {
  const data = await api.post(
    `/forwarder/v1/leads/${lead_id}/verify-loading`,
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

export const rejectCargoApi = async (lead_id, payload) => {
  const data = await api.post(
    `/forwarder/v1/leads/${lead_id}/reject-loading`,
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

export const verifyCargoUnloadApi = async (lead_id, payload) => {
  const data = await api.post(
    `/forwarder/v1/leads/${lead_id}/verify-unloading`,
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

export const rejectCargoUnloadApi = async (lead_id, payload) => {
  const data = await api.post(
    `/forwarder/v1/leads/${lead_id}/reject-unloading`,
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

export const confirmLeadDeliveryApi = async (lead_id, payload) => {
  const data = await api.post(
    `/forwarder/v1/leads/${lead_id}/confirm-delivery`,
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

export const detachDriverApi = async (lead_id) => {
  const data = await api.post(
    `forwarder/v1/leads/${lead_id}/detach-driver`,
    null,
    {
      headers: {
        // eslint-disable-next-line no-undef
        "X-WP-Nonce": APP_DATA.nonce,
      },
    },
  );

  return data;
};

export const detachCustomerApi = async (lead_id) => {
  const data = await api.post(
    `/forwarder/v1/leads/${lead_id}/detach-customer`,
    null,
    {
      headers: {
        // eslint-disable-next-line no-undef
        "X-WP-Nonce": APP_DATA.nonce,
      },
    },
  );

  return data;
};

export const getAcceptedLeadsApi = async (params = {}) => {
  const data = await api.get(`/forwarder/v1/leads/accepted`, {
    params,
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const deleteCargoApi = async (id, cargo_index) => {
  const data = await api.delete(
    `/forwarder/v1/lead/${id}/cargos/${cargo_index}`,
  );

  return data;
};
