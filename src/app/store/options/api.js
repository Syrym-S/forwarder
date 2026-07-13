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
