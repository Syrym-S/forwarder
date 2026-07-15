import { api } from "../../client";

export const getDriversApi = async (params) => {
  const data = await api.get(`/forwarder/v1/drivers`, {
    headers: {
      params,
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const getDriverDetailsApi = async (driver_id) => {
  const data = await api.get(`/forwarder/v1/driver/${driver_id}`, {
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const searchDriverApi = async (params) => {
  const data = await api.get(`/forwarder/v1/drivers/search`, {
    params,
    headers: {
      // eslint-disable-next-line no-undef
      "X-WP-Nonce": APP_DATA.nonce,
    },
  });

  return data;
};

export const createDriverApi = async (payload) => {
  const data = await api.post(`/forwarder/v1/drivers/create`, payload);

  return data;
};
