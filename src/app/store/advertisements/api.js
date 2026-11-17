import { api } from "../../client";

export const createAdvertisementApi = (lead_id) =>
  api.post("/forwarder/v1/advertisement/create", { lead_id });

export const getMyAdvertisementsApi = (params) =>
  api.get("/forwarder/v1/advertisements/my", { params });

export const getCustomerAdvertisementsApi = (params) =>
  api.get("/forwarder/v1/advertisements/customer", { params });

export const getMyAdvertisementApi = (id) =>
  api.get(`/forwarder/v1/advertisement/my/${encodeURIComponent(id)}`);

export const getCustomerAdvertisementApi = (id) =>
  api.get(`/forwarder/v1/advertisement/customer/${encodeURIComponent(id)}`);

export const closeAdvertisementApi = (id) =>
  api.post(`/forwarder/v1/advertisement/my/${encodeURIComponent(id)}/close`, null);

export const deleteAdvertisementApi = (id) =>
  api.post(`/forwarder/v1/advertisement/my/${encodeURIComponent(id)}/delete`, null);

export const searchAdvertisementLeadsApi = (params) =>
  api.get("/forwarder/v1/tenders/leads/search", { params });
