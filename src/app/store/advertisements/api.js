import { api } from "../../client";

const BASE_URL = "/forwarder/v1/advertisement";
const LIST_BASE_URL = "/forwarder/v1/advertisements";

export const createAdvertisementApi = (lead_id) => {
  const data = api.post(`${BASE_URL}/create`, { lead_id });

  return data;
};

export const searchAdvertisementLeadsApi = (params) =>
  api.get(`${LIST_BASE_URL}/leads/search`, { params });

export const updateAdvertisementApi = (advertisement_id, lead_id) =>
  api.post(`${BASE_URL}/my/${encodeURIComponent(advertisement_id)}/update`, {
    lead_id,
  });

export const getMyAdvertisementsApi = (params) =>
  api.get(`${LIST_BASE_URL}/my`, { params });

export const getCustomerAdvertisementsApi = (params) =>
  api.get(`${LIST_BASE_URL}/customer`, { params });

export const getMyAdvertisementApi = (id) =>
  api.get(`${BASE_URL}/my/${encodeURIComponent(id)}`);

export const getCustomerAdvertisementApi = (id) =>
  api.get(`${BASE_URL}/customer/${encodeURIComponent(id)}`);

export const closeAdvertisementApi = (id) =>
  api.post(`${BASE_URL}/my/${encodeURIComponent(id)}/close`, null);

export const deleteAdvertisementApi = (id) =>
  api.post(`${BASE_URL}/my/${encodeURIComponent(id)}/delete`, null);
