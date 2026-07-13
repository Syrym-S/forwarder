import { api } from "../../client";

export const getCargoTypesApi = async (params) => {
  const data = await api.get(`/forwarder/v1/cargo-types`, {
    params,
  });

  return data;
};

export const searchCargoTypeApi = async (params) => {
  const data = await api.get(`/forwarder/v1/cargo-types/search`, {
    params,
  });

  return data;
};

export const getCurrenciesApi = async (params) => {
  const data = await api.get(`/forwarder/v1/currencies`, {
    params,
  });

  return data;
};

export const searchCurrencyApi = async (params) => {
  const data = await api.get(`/forwarder/v1/cargo-types/search`, {
    params,
  });

  return data;
};
