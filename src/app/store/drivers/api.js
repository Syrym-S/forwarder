import { api } from "../../client";

export const rateDriverApi = (leadId, payload) =>
  api.post(`/forwarder/v1/lead/${leadId}/driver-rating`, payload);

export const getDriverRatingsApi = (driverId, config = {}) =>
  api.get(`/forwarder/v1/drivers/${driverId}/ratings`, config);

export const getDriversApi = async (params) => {
  const data = await api.get(`/forwarder/v1/drivers`, {
    params,
  });

  return data;
};

export const getDriverDetailsApi = async (driver_id) => {
  const data = await api.get(`/forwarder/v1/driver/${driver_id}`);

  return data;
};

export const searchDriverApi = async (params) => {
  const data = await api.get(`/forwarder/v1/drivers/search`, {
    params,
  });

  return data;
};

export const createDriverApi = async (payload) => {
  const data = await api.post(`/forwarder/v1/drivers/create`, payload);

  return data;
};

export const banDriverApi = async (payload, driver_id) => {
  const data = await api.post(
    `/forwarder/v1/drivers/${driver_id}/black-list`,
    payload,
  );

  return data;
};
